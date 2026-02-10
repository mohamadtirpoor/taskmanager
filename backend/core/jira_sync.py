"""
Jira Sync Service
سرویس همگام‌سازی دو طرفه بین پلتفرم و Jira
"""
from django.utils import timezone
from django.db import transaction
from core.models import Task, Sprint, Backlog, User, Tag, Notification
from core.jira_integration import JiraIntegration
import logging

logger = logging.getLogger(__name__)


class JiraSyncService:
    """سرویس همگام‌سازی با Jira"""
    
    def __init__(self):
        self.jira = JiraIntegration()
    
    # ==================== TASK SYNC ====================
    
    @transaction.atomic
    def sync_task_to_jira(self, task):
        """همگام‌سازی Task به Jira"""
        try:
            task_data = {
                'title': task.title,
                'description': task.description,
                'priority': task.priority,
                'deadline': task.deadline,
                'assignee_email': task.assignee.email if task.assignee else None,
                'tags': [tag.name for tag in task.tags.all()]
            }
            
            # اگر jira_key داره، update کن، وگرنه create
            if hasattr(task, 'jira_key') and task.jira_key:
                self.jira.update_issue(task.jira_key, task_data)
            else:
                jira_key = self.jira.create_issue(task_data)
                task.jira_key = jira_key
                task.save(update_fields=['jira_key'])
            
            # اگر task در sprint هست، به sprint جیرا هم اضافه کن
            if task.sprint and hasattr(task.sprint, 'jira_sprint_id') and task.sprint.jira_sprint_id:
                self.jira.add_issues_to_sprint(task.sprint.jira_sprint_id, [task.jira_key])
            
            logger.info(f"Task {task.id} synced to Jira as {task.jira_key}")
            return True, task.jira_key
            
        except Exception as e:
            logger.error(f"Error syncing task {task.id} to Jira: {str(e)}")
            return False, str(e)
    
    @transaction.atomic
    def sync_task_from_jira(self, jira_issue_data):
        """همگام‌سازی Task از Jira"""
        try:
            # پیدا کردن یا ایجاد task
            task = Task.objects.filter(jira_key=jira_issue_data['jira_key']).first()
            
            # پیدا کردن assignee
            assignee = None
            if jira_issue_data.get('assignee_email'):
                assignee = User.objects.filter(email=jira_issue_data['assignee_email']).first()
            
            # اگر assignee پیدا نشد، به admin اول assign کن
            if not assignee:
                assignee = User.objects.filter(role='admin').first()
            
            if not assignee:
                logger.error("No admin user found to assign task")
                return False, "No admin user found"
            
            task_data = {
                'title': jira_issue_data['title'],
                'description': jira_issue_data['description'],
                'status': jira_issue_data['status'],
                'priority': jira_issue_data['priority'],
                'deadline': jira_issue_data.get('deadline') or timezone.now() + timezone.timedelta(days=7),
                'assignee': assignee,
            }
            
            if task:
                # بروزرسانی task موجود
                for key, value in task_data.items():
                    setattr(task, key, value)
                task.save()
            else:
                # ایجاد task جدید
                task = Task.objects.create(
                    jira_key=jira_issue_data['jira_key'],
                    created_by=assignee,
                    **task_data
                )
            
            # همگام‌سازی tags
            if jira_issue_data.get('tags'):
                tag_objects = []
                for tag_name in jira_issue_data['tags']:
                    tag, _ = Tag.objects.get_or_create(name=tag_name)
                    tag_objects.append(tag)
                task.tags.set(tag_objects)
            
            logger.info(f"Task {task.id} synced from Jira {jira_issue_data['jira_key']}")
            return True, task.id
            
        except Exception as e:
            logger.error(f"Error syncing task from Jira: {str(e)}")
            return False, str(e)
    
    # ==================== SPRINT SYNC ====================
    
    @transaction.atomic
    def sync_sprint_to_jira(self, sprint):
        """همگام‌سازی Sprint به Jira"""
        try:
            sprint_data = {
                'title': sprint.title,
                'description': sprint.description,
                'start_date': sprint.start_date,
                'end_date': sprint.end_date,
            }
            
            if hasattr(sprint, 'jira_sprint_id') and sprint.jira_sprint_id:
                self.jira.update_sprint(sprint.jira_sprint_id, sprint_data)
            else:
                jira_sprint_id = self.jira.create_sprint(sprint_data)
                sprint.jira_sprint_id = jira_sprint_id
                sprint.save(update_fields=['jira_sprint_id'])
            
            # همگام‌سازی tasks این sprint
            for task in sprint.tasks.all():
                if hasattr(task, 'jira_key') and task.jira_key:
                    self.jira.add_issues_to_sprint(sprint.jira_sprint_id, [task.jira_key])
            
            logger.info(f"Sprint {sprint.id} synced to Jira as {sprint.jira_sprint_id}")
            return True, sprint.jira_sprint_id
            
        except Exception as e:
            logger.error(f"Error syncing sprint {sprint.id} to Jira: {str(e)}")
            return False, str(e)
    
    # ==================== BACKLOG SYNC ====================
    
    @transaction.atomic
    def sync_backlog_to_jira(self, backlog):
        """همگام‌سازی Backlog به Jira"""
        try:
            # Backlog در جیرا به صورت Issue بدون Sprint ذخیره می‌شود
            task_data = {
                'title': backlog.title,
                'description': backlog.description,
                'priority': backlog.priority,
                'tags': [tag.name for tag in backlog.tags.all()]
            }
            
            if hasattr(backlog, 'jira_key') and backlog.jira_key:
                self.jira.update_issue(backlog.jira_key, task_data)
            else:
                jira_key = self.jira.create_issue(task_data)
                backlog.jira_key = jira_key
                backlog.save(update_fields=['jira_key'])
            
            logger.info(f"Backlog {backlog.id} synced to Jira as {backlog.jira_key}")
            return True, backlog.jira_key
            
        except Exception as e:
            logger.error(f"Error syncing backlog {backlog.id} to Jira: {str(e)}")
            return False, str(e)
    
    # ==================== BULK SYNC ====================
    
    def sync_all_to_jira(self):
        """همگام‌سازی همه چیز به Jira"""
        results = {
            'tasks': {'success': 0, 'failed': 0},
            'sprints': {'success': 0, 'failed': 0},
            'backlogs': {'success': 0, 'failed': 0}
        }
        
        # همگام‌سازی Sprints
        for sprint in Sprint.objects.all():
            success, _ = self.sync_sprint_to_jira(sprint)
            if success:
                results['sprints']['success'] += 1
            else:
                results['sprints']['failed'] += 1
        
        # همگام‌سازی Tasks
        for task in Task.objects.all():
            success, _ = self.sync_task_to_jira(task)
            if success:
                results['tasks']['success'] += 1
            else:
                results['tasks']['failed'] += 1
        
        # همگام‌سازی Backlogs
        for backlog in Backlog.objects.all():
            success, _ = self.sync_backlog_to_jira(backlog)
            if success:
                results['backlogs']['success'] += 1
            else:
                results['backlogs']['failed'] += 1
        
        return results
    
    def sync_all_from_jira(self):
        """همگام‌سازی همه چیز از Jira"""
        results = {
            'tasks': {'success': 0, 'failed': 0},
            'new': 0,
            'updated': 0
        }
        
        try:
            # دریافت تمام issues از Jira
            jira_issues = self.jira.sync_all_issues()
            
            for jira_issue in jira_issues:
                # بررسی که issue قبلا sync شده یا نه
                existing_task = Task.objects.filter(jira_key=jira_issue['jira_key']).exists()
                
                success, _ = self.sync_task_from_jira(jira_issue)
                if success:
                    results['tasks']['success'] += 1
                    if existing_task:
                        results['updated'] += 1
                    else:
                        results['new'] += 1
                else:
                    results['tasks']['failed'] += 1
            
            return results
            
        except Exception as e:
            logger.error(f"Error syncing all from Jira: {str(e)}")
            return results
    
    def sync_recent_from_jira(self, hours=24):
        """همگام‌سازی تغییرات اخیر از Jira"""
        results = {'success': 0, 'failed': 0}
        
        try:
            since_date = timezone.now() - timezone.timedelta(hours=hours)
            jira_issues = self.jira.sync_recent_changes(since_date)
            
            for jira_issue in jira_issues:
                success, _ = self.sync_task_from_jira(jira_issue)
                if success:
                    results['success'] += 1
                else:
                    results['failed'] += 1
            
            return results
            
        except Exception as e:
            logger.error(f"Error syncing recent from Jira: {str(e)}")
            return results
    
    # ==================== COMMENT SYNC ====================
    
    def sync_comment_to_jira(self, comment):
        """همگام‌سازی Comment به Jira"""
        try:
            if not hasattr(comment.task, 'jira_key') or not comment.task.jira_key:
                return False, "Task doesn't have Jira key"
            
            comment_text = f"{comment.user.get_full_name()}: {comment.content}"
            self.jira.add_comment(comment.task.jira_key, comment_text)
            
            logger.info(f"Comment {comment.id} synced to Jira")
            return True, None
            
        except Exception as e:
            logger.error(f"Error syncing comment to Jira: {str(e)}")
            return False, str(e)

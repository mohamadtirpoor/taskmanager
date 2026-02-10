"""
Jira Integration Module
این ماژول تمام قابلیت‌های Jira را به پلتفرم متصل می‌کند
"""
from jira import JIRA
from django.conf import settings
from django.utils import timezone
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class JiraIntegration:
    """کلاس اصلی برای ارتباط با Jira"""
    
    def __init__(self):
        self.jira_url = settings.JIRA_URL
        self.jira_email = settings.JIRA_EMAIL
        self.jira_api_token = settings.JIRA_API_TOKEN
        self.jira_project_key = settings.JIRA_PROJECT_KEY
        
        # اتصال به Jira
        self.jira = JIRA(
            server=self.jira_url,
            basic_auth=(self.jira_email, self.jira_api_token)
        )
    
    def test_connection(self):
        """تست اتصال به Jira"""
        try:
            projects = self.jira.projects()
            return True, f"اتصال موفق - {len(projects)} پروژه یافت شد"
        except Exception as e:
            return False, f"خطا در اتصال: {str(e)}"
    
    # ==================== ISSUE MANAGEMENT ====================
    
    def create_issue(self, task_data):
        """ایجاد Issue در Jira از روی Task"""
        try:
            issue_dict = {
                'project': {'key': self.jira_project_key},
                'summary': task_data['title'],
                'description': task_data.get('description', ''),
                'issuetype': {'name': 'Task'},
                'priority': {'name': self._map_priority_to_jira(task_data.get('priority', 'medium'))},
            }
            
            # اضافه کردن assignee
            if task_data.get('assignee_email'):
                issue_dict['assignee'] = {'emailAddress': task_data['assignee_email']}
            
            # اضافه کردن due date
            if task_data.get('deadline'):
                issue_dict['duedate'] = task_data['deadline'].strftime('%Y-%m-%d')
            
            # اضافه کردن labels (tags)
            if task_data.get('tags'):
                issue_dict['labels'] = task_data['tags']
            
            new_issue = self.jira.create_issue(fields=issue_dict)
            logger.info(f"Issue {new_issue.key} created in Jira")
            return new_issue.key
            
        except Exception as e:
            logger.error(f"Error creating Jira issue: {str(e)}")
            raise
    
    def update_issue(self, issue_key, task_data):
        """بروزرسانی Issue در Jira"""
        try:
            issue = self.jira.issue(issue_key)
            
            update_fields = {}
            if 'title' in task_data:
                update_fields['summary'] = task_data['title']
            if 'description' in task_data:
                update_fields['description'] = task_data['description']
            if 'priority' in task_data:
                update_fields['priority'] = {'name': self._map_priority_to_jira(task_data['priority'])}
            if 'deadline' in task_data:
                update_fields['duedate'] = task_data['deadline'].strftime('%Y-%m-%d')
            if 'tags' in task_data:
                update_fields['labels'] = task_data['tags']
            
            if update_fields:
                issue.update(fields=update_fields)
            
            # بروزرسانی status
            if 'status' in task_data:
                self._transition_issue(issue, task_data['status'])
            
            # بروزرسانی assignee
            if 'assignee_email' in task_data:
                issue.update(assignee={'emailAddress': task_data['assignee_email']})
            
            logger.info(f"Issue {issue_key} updated in Jira")
            return True
            
        except Exception as e:
            logger.error(f"Error updating Jira issue {issue_key}: {str(e)}")
            raise
    
    def delete_issue(self, issue_key):
        """حذف Issue از Jira"""
        try:
            issue = self.jira.issue(issue_key)
            issue.delete()
            logger.info(f"Issue {issue_key} deleted from Jira")
            return True
        except Exception as e:
            logger.error(f"Error deleting Jira issue {issue_key}: {str(e)}")
            raise
    
    def get_issue(self, issue_key):
        """دریافت اطلاعات Issue از Jira"""
        try:
            issue = self.jira.issue(issue_key)
            return self._parse_jira_issue(issue)
        except Exception as e:
            logger.error(f"Error getting Jira issue {issue_key}: {str(e)}")
            raise
    
    # ==================== SPRINT MANAGEMENT ====================
    
    def create_sprint(self, sprint_data):
        """ایجاد Sprint در Jira"""
        try:
            # پیدا کردن board
            boards = self.jira.boards()
            board_id = None
            for board in boards:
                if board.name == sprint_data.get('board_name', self.jira_project_key):
                    board_id = board.id
                    break
            
            if not board_id and boards:
                board_id = boards[0].id
            
            if not board_id:
                raise Exception("هیچ Board فعالی یافت نشد")
            
            sprint = self.jira.create_sprint(
                name=sprint_data['title'],
                board_id=board_id,
                startDate=sprint_data['start_date'].isoformat(),
                endDate=sprint_data['end_date'].isoformat(),
                goal=sprint_data.get('description', '')
            )
            
            logger.info(f"Sprint {sprint.id} created in Jira")
            return sprint.id
            
        except Exception as e:
            logger.error(f"Error creating Jira sprint: {str(e)}")
            raise
    
    def update_sprint(self, sprint_id, sprint_data):
        """بروزرسانی Sprint در Jira"""
        try:
            update_data = {}
            if 'title' in sprint_data:
                update_data['name'] = sprint_data['title']
            if 'start_date' in sprint_data:
                update_data['startDate'] = sprint_data['start_date'].isoformat()
            if 'end_date' in sprint_data:
                update_data['endDate'] = sprint_data['end_date'].isoformat()
            if 'description' in sprint_data:
                update_data['goal'] = sprint_data['description']
            
            if update_data:
                self.jira.update_sprint(sprint_id, **update_data)
            
            logger.info(f"Sprint {sprint_id} updated in Jira")
            return True
            
        except Exception as e:
            logger.error(f"Error updating Jira sprint {sprint_id}: {str(e)}")
            raise
    
    def add_issues_to_sprint(self, sprint_id, issue_keys):
        """اضافه کردن Issues به Sprint"""
        try:
            self.jira.add_issues_to_sprint(sprint_id, issue_keys)
            logger.info(f"Added {len(issue_keys)} issues to sprint {sprint_id}")
            return True
        except Exception as e:
            logger.error(f"Error adding issues to sprint: {str(e)}")
            raise
    
    def get_sprint_issues(self, sprint_id):
        """دریافت تمام Issues یک Sprint"""
        try:
            issues = self.jira.search_issues(f'sprint = {sprint_id}')
            return [self._parse_jira_issue(issue) for issue in issues]
        except Exception as e:
            logger.error(f"Error getting sprint issues: {str(e)}")
            raise
    
    # ==================== BACKLOG MANAGEMENT ====================
    
    def get_backlog_issues(self):
        """دریافت تمام Issues در Backlog"""
        try:
            jql = f'project = {self.jira_project_key} AND sprint is EMPTY AND status != Done'
            issues = self.jira.search_issues(jql, maxResults=100)
            return [self._parse_jira_issue(issue) for issue in issues]
        except Exception as e:
            logger.error(f"Error getting backlog issues: {str(e)}")
            raise
    
    # ==================== COMMENT MANAGEMENT ====================
    
    def add_comment(self, issue_key, comment_text):
        """اضافه کردن کامنت به Issue"""
        try:
            self.jira.add_comment(issue_key, comment_text)
            logger.info(f"Comment added to issue {issue_key}")
            return True
        except Exception as e:
            logger.error(f"Error adding comment: {str(e)}")
            raise
    
    def get_comments(self, issue_key):
        """دریافت کامنت‌های یک Issue"""
        try:
            issue = self.jira.issue(issue_key)
            comments = []
            for comment in issue.fields.comment.comments:
                comments.append({
                    'id': comment.id,
                    'author': comment.author.displayName,
                    'body': comment.body,
                    'created': comment.created
                })
            return comments
        except Exception as e:
            logger.error(f"Error getting comments: {str(e)}")
            raise
    
    # ==================== USER MANAGEMENT ====================
    
    def search_users(self, query):
        """جستجوی کاربران Jira"""
        try:
            users = self.jira.search_users(query)
            return [{
                'email': user.emailAddress,
                'name': user.displayName,
                'account_id': user.accountId
            } for user in users]
        except Exception as e:
            logger.error(f"Error searching users: {str(e)}")
            raise
    
    def get_project_users(self):
        """دریافت تمام کاربران پروژه"""
        try:
            users = self.jira.search_assignable_users_for_projects('', self.jira_project_key)
            return [{
                'email': user.emailAddress,
                'name': user.displayName,
                'account_id': user.accountId
            } for user in users]
        except Exception as e:
            logger.error(f"Error getting project users: {str(e)}")
            raise
    
    # ==================== SYNC OPERATIONS ====================
    
    def sync_all_issues(self):
        """همگام‌سازی تمام Issues از Jira"""
        try:
            jql = f'project = {self.jira_project_key}'
            issues = self.jira.search_issues(jql, maxResults=1000)
            return [self._parse_jira_issue(issue) for issue in issues]
        except Exception as e:
            logger.error(f"Error syncing all issues: {str(e)}")
            raise
    
    def sync_recent_changes(self, since_date):
        """همگام‌سازی تغییرات اخیر"""
        try:
            date_str = since_date.strftime('%Y-%m-%d')
            jql = f'project = {self.jira_project_key} AND updated >= "{date_str}"'
            issues = self.jira.search_issues(jql, maxResults=1000)
            return [self._parse_jira_issue(issue) for issue in issues]
        except Exception as e:
            logger.error(f"Error syncing recent changes: {str(e)}")
            raise
    
    # ==================== HELPER METHODS ====================
    
    def _map_priority_to_jira(self, priority):
        """تبدیل priority پلتفرم به Jira"""
        mapping = {
            'low': 'Low',
            'medium': 'Medium',
            'high': 'High',
            'urgent': 'Highest'
        }
        return mapping.get(priority, 'Medium')
    
    def _map_priority_from_jira(self, jira_priority):
        """تبدیل priority Jira به پلتفرم"""
        mapping = {
            'Lowest': 'low',
            'Low': 'low',
            'Medium': 'medium',
            'High': 'high',
            'Highest': 'urgent'
        }
        return mapping.get(jira_priority, 'medium')
    
    def _map_status_to_jira(self, status):
        """تبدیل status پلتفرم به Jira"""
        mapping = {
            'todo': 'To Do',
            'in_progress': 'In Progress',
            'in_review': 'In Review',
            'done': 'Done'
        }
        return mapping.get(status, 'To Do')
    
    def _map_status_from_jira(self, jira_status):
        """تبدیل status Jira به پلتفرم"""
        status_lower = jira_status.lower()
        if 'to do' in status_lower or 'backlog' in status_lower:
            return 'todo'
        elif 'in progress' in status_lower or 'doing' in status_lower:
            return 'in_progress'
        elif 'review' in status_lower or 'testing' in status_lower:
            return 'in_review'
        elif 'done' in status_lower or 'closed' in status_lower:
            return 'done'
        return 'todo'
    
    def _transition_issue(self, issue, target_status):
        """تغییر وضعیت Issue"""
        try:
            jira_status = self._map_status_to_jira(target_status)
            transitions = self.jira.transitions(issue)
            
            for transition in transitions:
                if transition['name'].lower() == jira_status.lower():
                    self.jira.transition_issue(issue, transition['id'])
                    return True
            
            logger.warning(f"Transition to {jira_status} not found for issue {issue.key}")
            return False
            
        except Exception as e:
            logger.error(f"Error transitioning issue: {str(e)}")
            return False
    
    def _parse_jira_issue(self, issue):
        """تبدیل Issue جیرا به فرمت پلتفرم"""
        return {
            'jira_key': issue.key,
            'title': issue.fields.summary,
            'description': getattr(issue.fields, 'description', '') or '',
            'status': self._map_status_from_jira(issue.fields.status.name),
            'priority': self._map_priority_from_jira(issue.fields.priority.name),
            'assignee_email': getattr(issue.fields.assignee, 'emailAddress', None) if issue.fields.assignee else None,
            'assignee_name': getattr(issue.fields.assignee, 'displayName', None) if issue.fields.assignee else None,
            'deadline': datetime.strptime(issue.fields.duedate, '%Y-%m-%d') if getattr(issue.fields, 'duedate', None) else None,
            'tags': getattr(issue.fields, 'labels', []),
            'created_at': datetime.strptime(issue.fields.created, '%Y-%m-%dT%H:%M:%S.%f%z'),
            'updated_at': datetime.strptime(issue.fields.updated, '%Y-%m-%dT%H:%M:%S.%f%z'),
        }

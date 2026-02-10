"""
Jira Integration API Views
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from core.models import Task, Sprint, Backlog, Comment
from core.jira_integration import JiraIntegration
from core.jira_sync import JiraSyncService
import logging
import json

logger = logging.getLogger(__name__)


class JiraIntegrationViewSet(viewsets.ViewSet):
    """ViewSet برای مدیریت Integration با Jira"""
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def test_connection(self, request):
        """تست اتصال به Jira"""
        try:
            jira = JiraIntegration()
            success, message = jira.test_connection()
            return Response({
                'success': success,
                'message': message
            })
        except Exception as e:
            return Response({
                'success': False,
                'message': f'خطا: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'])
    def project_users(self, request):
        """دریافت لیست کاربران پروژه Jira"""
        try:
            jira = JiraIntegration()
            users = jira.get_project_users()
            return Response({'users': users})
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['post'])
    def sync_task_to_jira(self, request):
        """همگام‌سازی یک Task به Jira"""
        task_id = request.data.get('task_id')
        if not task_id:
            return Response({
                'error': 'task_id الزامی است'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            task = Task.objects.get(id=task_id)
            sync_service = JiraSyncService()
            success, result = sync_service.sync_task_to_jira(task)
            
            if success:
                task.last_synced_at = timezone.now()
                task.save(update_fields=['last_synced_at'])
                return Response({
                    'success': True,
                    'jira_key': result,
                    'message': f'Task با موفقیت به Jira منتقل شد: {result}'
                })
            else:
                return Response({
                    'success': False,
                    'error': result
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
        except Task.DoesNotExist:
            return Response({
                'error': 'Task یافت نشد'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['post'])
    def sync_sprint_to_jira(self, request):
        """همگام‌سازی یک Sprint به Jira"""
        sprint_id = request.data.get('sprint_id')
        if not sprint_id:
            return Response({
                'error': 'sprint_id الزامی است'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            sprint = Sprint.objects.get(id=sprint_id)
            sync_service = JiraSyncService()
            success, result = sync_service.sync_sprint_to_jira(sprint)
            
            if success:
                sprint.last_synced_at = timezone.now()
                sprint.save(update_fields=['last_synced_at'])
                return Response({
                    'success': True,
                    'jira_sprint_id': result,
                    'message': f'Sprint با موفقیت به Jira منتقل شد'
                })
            else:
                return Response({
                    'success': False,
                    'error': result
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
        except Sprint.DoesNotExist:
            return Response({
                'error': 'Sprint یافت نشد'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['post'])
    def sync_backlog_to_jira(self, request):
        """همگام‌سازی یک Backlog به Jira"""
        backlog_id = request.data.get('backlog_id')
        if not backlog_id:
            return Response({
                'error': 'backlog_id الزامی است'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            backlog = Backlog.objects.get(id=backlog_id)
            sync_service = JiraSyncService()
            success, result = sync_service.sync_backlog_to_jira(backlog)
            
            if success:
                backlog.last_synced_at = timezone.now()
                backlog.save(update_fields=['last_synced_at'])
                return Response({
                    'success': True,
                    'jira_key': result,
                    'message': f'Backlog با موفقیت به Jira منتقل شد: {result}'
                })
            else:
                return Response({
                    'success': False,
                    'error': result
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
        except Backlog.DoesNotExist:
            return Response({
                'error': 'Backlog یافت نشد'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['post'])
    def sync_all_to_jira(self, request):
        """همگام‌سازی همه چیز به Jira"""
        try:
            sync_service = JiraSyncService()
            results = sync_service.sync_all_to_jira()
            
            return Response({
                'success': True,
                'results': results,
                'message': 'همگام‌سازی کامل شد'
            })
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['post'])
    def sync_all_from_jira(self, request):
        """همگام‌سازی همه چیز از Jira"""
        try:
            sync_service = JiraSyncService()
            results = sync_service.sync_all_from_jira()
            
            return Response({
                'success': True,
                'results': results,
                'message': f'{results["new"]} آیتم جدید و {results["updated"]} آیتم بروزرسانی شد'
            })
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['post'])
    def sync_recent_from_jira(self, request):
        """همگام‌سازی تغییرات اخیر از Jira"""
        hours = request.data.get('hours', 24)
        
        try:
            sync_service = JiraSyncService()
            results = sync_service.sync_recent_from_jira(hours=hours)
            
            return Response({
                'success': True,
                'results': results,
                'message': f'{results["success"]} آیتم همگام‌سازی شد'
            })
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'])
    def sync_status(self, request):
        """وضعیت همگام‌سازی"""
        try:
            tasks_with_jira = Task.objects.exclude(jira_key__isnull=True).exclude(jira_key='').count()
            tasks_without_jira = Task.objects.filter(jira_key__isnull=True).count() + Task.objects.filter(jira_key='').count()
            
            sprints_with_jira = Sprint.objects.exclude(jira_sprint_id__isnull=True).exclude(jira_sprint_id='').count()
            sprints_without_jira = Sprint.objects.filter(jira_sprint_id__isnull=True).count() + Sprint.objects.filter(jira_sprint_id='').count()
            
            backlogs_with_jira = Backlog.objects.exclude(jira_key__isnull=True).exclude(jira_key='').count()
            backlogs_without_jira = Backlog.objects.filter(jira_key__isnull=True).count() + Backlog.objects.filter(jira_key='').count()
            
            return Response({
                'tasks': {
                    'synced': tasks_with_jira,
                    'not_synced': tasks_without_jira,
                    'total': tasks_with_jira + tasks_without_jira
                },
                'sprints': {
                    'synced': sprints_with_jira,
                    'not_synced': sprints_without_jira,
                    'total': sprints_with_jira + sprints_without_jira
                },
                'backlogs': {
                    'synced': backlogs_with_jira,
                    'not_synced': backlogs_without_jira,
                    'total': backlogs_with_jira + backlogs_without_jira
                }
            })
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def jira_webhook(request):
    """
    Webhook برای دریافت تغییرات از Jira
    این endpoint باید در Jira به عنوان webhook تنظیم شود
    """
    try:
        data = json.loads(request.body)
        webhook_event = data.get('webhookEvent')
        
        logger.info(f"Received Jira webhook: {webhook_event}")
        
        # پردازش رویدادهای مختلف
        if webhook_event == 'jira:issue_created':
            handle_issue_created(data)
        elif webhook_event == 'jira:issue_updated':
            handle_issue_updated(data)
        elif webhook_event == 'jira:issue_deleted':
            handle_issue_deleted(data)
        elif webhook_event == 'sprint_created':
            handle_sprint_created(data)
        elif webhook_event == 'sprint_updated':
            handle_sprint_updated(data)
        
        return Response({'status': 'success'})
        
    except Exception as e:
        logger.error(f"Error processing Jira webhook: {str(e)}")
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def handle_issue_created(data):
    """پردازش ایجاد Issue جدید در Jira"""
    try:
        issue = data.get('issue', {})
        issue_key = issue.get('key')
        
        # بررسی که این issue قبلا sync نشده باشه
        if Task.objects.filter(jira_key=issue_key).exists():
            logger.info(f"Issue {issue_key} already exists, skipping")
            return
        
        jira = JiraIntegration()
        jira_issue_data = jira.get_issue(issue_key)
        
        sync_service = JiraSyncService()
        sync_service.sync_task_from_jira(jira_issue_data)
        
        logger.info(f"Issue {issue_key} created from webhook")
        
    except Exception as e:
        logger.error(f"Error handling issue created: {str(e)}")


def handle_issue_updated(data):
    """پردازش بروزرسانی Issue در Jira"""
    try:
        issue = data.get('issue', {})
        issue_key = issue.get('key')
        
        jira = JiraIntegration()
        jira_issue_data = jira.get_issue(issue_key)
        
        sync_service = JiraSyncService()
        sync_service.sync_task_from_jira(jira_issue_data)
        
        logger.info(f"Issue {issue_key} updated from webhook")
        
    except Exception as e:
        logger.error(f"Error handling issue updated: {str(e)}")


def handle_issue_deleted(data):
    """پردازش حذف Issue از Jira"""
    try:
        issue = data.get('issue', {})
        issue_key = issue.get('key')
        
        # حذف task مربوطه
        Task.objects.filter(jira_key=issue_key).delete()
        
        logger.info(f"Issue {issue_key} deleted from webhook")
        
    except Exception as e:
        logger.error(f"Error handling issue deleted: {str(e)}")


def handle_sprint_created(data):
    """پردازش ایجاد Sprint جدید در Jira"""
    # TODO: Implement sprint webhook handling
    pass


def handle_sprint_updated(data):
    """پردازش بروزرسانی Sprint در Jira"""
    # TODO: Implement sprint webhook handling
    pass

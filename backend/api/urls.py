from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (UserViewSet, SprintViewSet, TaskViewSet, NotificationViewSet, 
                    CommentViewSet, AIAssistantViewSet, MeetingViewSet, BacklogViewSet, TagViewSet)
from .jira_views import JiraIntegrationViewSet, jira_webhook

router = DefaultRouter()
router.register(r'tags', TagViewSet)
router.register(r'users', UserViewSet)
router.register(r'sprints', SprintViewSet)
router.register(r'tasks', TaskViewSet, basename='task')
router.register(r'meetings', MeetingViewSet)
router.register(r'backlogs', BacklogViewSet)
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'comments', CommentViewSet)
router.register(r'ai', AIAssistantViewSet, basename='ai')
router.register(r'jira', JiraIntegrationViewSet, basename='jira')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('jira/webhook/', jira_webhook, name='jira_webhook'),
]

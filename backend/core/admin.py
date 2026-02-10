from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Sprint, Task, Notification, Comment, Meeting, Backlog, Tag

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['username', 'email', 'role', 'expertise', 'is_staff']
    list_filter = ['role', 'is_staff']
    fieldsets = BaseUserAdmin.fieldsets + (
        ('اطلاعات اضافی', {'fields': ('role', 'avatar', 'phone', 'expertise', 'bio')}),
    )

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ['name', 'color']
    search_fields = ['name']

@admin.register(Sprint)
class SprintAdmin(admin.ModelAdmin):
    list_display = ['title', 'start_date', 'end_date', 'created_by']
    list_filter = ['start_date', 'end_date']
    search_fields = ['title']
    filter_horizontal = ['tags']

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['title', 'assignee', 'status', 'priority', 'deadline', 'sprint']
    list_filter = ['status', 'priority', 'sprint']
    search_fields = ['title', 'description']
    filter_horizontal = ['tags']

@admin.register(Meeting)
class MeetingAdmin(admin.ModelAdmin):
    list_display = ['title', 'meeting_date', 'duration_minutes', 'created_by']
    list_filter = ['meeting_date']
    search_fields = ['title']
    filter_horizontal = ['attendees', 'tags']

@admin.register(Backlog)
class BacklogAdmin(admin.ModelAdmin):
    list_display = ['title', 'priority', 'sprint', 'created_by', 'created_at']
    list_filter = ['priority', 'sprint']
    search_fields = ['title', 'description']
    filter_horizontal = ['tags']

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['user', 'type', 'is_read', 'created_at']
    list_filter = ['type', 'is_read']

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['task', 'user', 'created_at']
    list_filter = ['created_at']

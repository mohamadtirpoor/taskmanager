from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'ادمین'),
        ('scrum_master', 'اسکرام مستر'),
        ('team_member', 'عضو تیم'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='team_member')
    avatar = models.URLField(blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    expertise = models.CharField(max_length=200, blank=True, null=True, verbose_name='تخصص')
    bio = models.TextField(blank=True, null=True, verbose_name='درباره')
    
    class Meta:
        db_table = 'users'

class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)
    color = models.CharField(max_length=7, default='#3B82F6')  # hex color
    
    class Meta:
        db_table = 'tags'
    
    def __str__(self):
        return self.name

class Sprint(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    user_story = models.TextField(blank=True, null=True, verbose_name='یوزر استوری')
    start_date = models.DateField()
    end_date = models.DateField()
    tags = models.ManyToManyField(Tag, blank=True, related_name='sprints')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_sprints')
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Jira Integration
    jira_sprint_id = models.CharField(max_length=100, blank=True, null=True, unique=True)
    last_synced_at = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        db_table = 'sprints'
        ordering = ['-start_date']

class Task(models.Model):
    STATUS_CHOICES = [
        ('todo', 'To Do'),
        ('in_progress', 'In Progress'),
        ('in_review', 'In Review'),
        ('done', 'Done'),
    ]
    PRIORITY_CHOICES = [
        ('low', 'کم'),
        ('medium', 'متوسط'),
        ('high', 'زیاد'),
        ('urgent', 'فوری'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    assignee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='todo')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    start_date = models.DateTimeField(null=True, blank=True)
    deadline = models.DateTimeField()
    estimated_hours = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    actual_hours = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    sprint = models.ForeignKey(Sprint, on_delete=models.SET_NULL, null=True, blank=True, related_name='tasks')
    tags = models.ManyToManyField(Tag, blank=True, related_name='tasks')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_tasks')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Jira Integration
    jira_key = models.CharField(max_length=50, blank=True, null=True, unique=True)
    last_synced_at = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        db_table = 'tasks'
        ordering = ['-created_at']

class Meeting(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    meeting_date = models.DateTimeField()
    duration_minutes = models.IntegerField(default=60)
    location = models.CharField(max_length=200, blank=True)
    meeting_link = models.URLField(blank=True, null=True)
    attendees = models.ManyToManyField(User, related_name='meetings')
    tags = models.ManyToManyField(Tag, blank=True, related_name='meetings')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_meetings')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'meetings'
        ordering = ['-meeting_date']

class Backlog(models.Model):
    PRIORITY_CHOICES = [
        ('low', 'کم'),
        ('medium', 'متوسط'),
        ('high', 'زیاد'),
        ('urgent', 'فوری'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    user_story = models.TextField(blank=True, null=True, verbose_name='یوزر استوری')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    sprint = models.ForeignKey(Sprint, on_delete=models.SET_NULL, null=True, blank=True, related_name='backlogs')
    tags = models.ManyToManyField(Tag, blank=True, related_name='backlogs')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_backlogs')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Jira Integration
    jira_key = models.CharField(max_length=50, blank=True, null=True, unique=True)
    last_synced_at = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        db_table = 'backlogs'
        ordering = ['-created_at']

class Notification(models.Model):
    TYPE_CHOICES = [
        ('deadline_reminder', 'یادآوری ددلاین'),
        ('task_start', 'شروع تسک'),
        ('task_assigned', 'تسک جدید'),
        ('task_updated', 'بروزرسانی تسک'),
        ('meeting_scheduled', 'جلسه جدید'),
        ('backlog_added', 'بک‌لاگ جدید'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='notifications', null=True, blank=True)
    meeting = models.ForeignKey(Meeting, on_delete=models.CASCADE, related_name='notifications', null=True, blank=True)
    backlog = models.ForeignKey(Backlog, on_delete=models.CASCADE, related_name='notifications', null=True, blank=True)
    type = models.CharField(max_length=30, choices=TYPE_CHOICES)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'notifications'
        ordering = ['-created_at']

class Comment(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'comments'
        ordering = ['created_at']

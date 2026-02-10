from rest_framework import serializers
from core.models import User, Sprint, Task, Notification, Comment, Meeting, Backlog, Tag
from django.contrib.auth.password_validation import validate_password

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name', 'color']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'avatar', 'phone', 'expertise', 'bio']
        read_only_fields = ['id']

class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'role', 'phone', 'expertise', 'bio']
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class SprintSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    tag_ids = serializers.ListField(child=serializers.IntegerField(), write_only=True, required=False)
    task_count = serializers.SerializerMethodField()
    completed_tasks = serializers.SerializerMethodField()
    
    class Meta:
        model = Sprint
        fields = ['id', 'title', 'description', 'user_story', 'start_date', 'end_date', 'tags', 'tag_ids', 
                  'created_by', 'created_at', 'task_count', 'completed_tasks']
        read_only_fields = ['id', 'created_at']
    
    def get_task_count(self, obj):
        return obj.tasks.count()
    
    def get_completed_tasks(self, obj):
        return obj.tasks.filter(status='done').count()

class TaskSerializer(serializers.ModelSerializer):
    assignee = UserSerializer(read_only=True)
    assignee_id = serializers.IntegerField(write_only=True)
    created_by = UserSerializer(read_only=True)
    sprint_title = serializers.CharField(source='sprint.title', read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    tag_ids = serializers.ListField(child=serializers.IntegerField(), write_only=True, required=False)
    
    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'assignee', 'assignee_id', 'status', 'priority', 
                  'start_date', 'deadline', 'estimated_hours', 'actual_hours', 'sprint', 'sprint_title',
                  'tags', 'tag_ids', 'created_by', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class MeetingSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    attendees = UserSerializer(many=True, read_only=True)
    attendee_ids = serializers.ListField(child=serializers.IntegerField(), write_only=True, required=False)
    tags = TagSerializer(many=True, read_only=True)
    tag_ids = serializers.ListField(child=serializers.IntegerField(), write_only=True, required=False)
    
    class Meta:
        model = Meeting
        fields = ['id', 'title', 'description', 'meeting_date', 'duration_minutes', 'location', 
                  'meeting_link', 'attendees', 'attendee_ids', 'tags', 'tag_ids', 'created_by', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def create(self, validated_data):
        # حذف attendee_ids و tag_ids از validated_data
        attendee_ids = validated_data.pop('attendee_ids', [])
        tag_ids = validated_data.pop('tag_ids', [])
        
        # ایجاد جلسه
        meeting = Meeting.objects.create(**validated_data)
        
        # اضافه کردن شرکت‌کنندگان
        if attendee_ids:
            meeting.attendees.set(attendee_ids)
        
        # اضافه کردن تگ‌ها
        if tag_ids:
            meeting.tags.set(tag_ids)
        
        return meeting

class BacklogSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    sprint_title = serializers.CharField(source='sprint.title', read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    tag_ids = serializers.ListField(child=serializers.IntegerField(), write_only=True, required=False)
    
    class Meta:
        model = Backlog
        fields = ['id', 'title', 'description', 'user_story', 'priority', 'sprint', 'sprint_title', 
                  'tags', 'tag_ids', 'created_by', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class NotificationSerializer(serializers.ModelSerializer):
    task_title = serializers.CharField(source='task.title', read_only=True)
    meeting_title = serializers.CharField(source='meeting.title', read_only=True)
    backlog_title = serializers.CharField(source='backlog.title', read_only=True)
    
    class Meta:
        model = Notification
        fields = ['id', 'type', 'message', 'is_read', 'created_at', 'task', 'task_title', 
                  'meeting', 'meeting_title', 'backlog', 'backlog_title']
        read_only_fields = ['id', 'created_at']

class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Comment
        fields = ['id', 'task', 'user', 'content', 'created_at']
        read_only_fields = ['id', 'created_at']

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.utils import timezone
from datetime import timedelta
from core.models import User, Sprint, Task, Notification, Comment, Meeting, Backlog, Tag
from .serializers import (UserSerializer, UserCreateSerializer, SprintSerializer, TaskSerializer, 
                          NotificationSerializer, CommentSerializer, MeetingSerializer, BacklogSerializer, TagSerializer)
from .ai_assistant import AIAssistant

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        return UserSerializer
    
    def get_queryset(self):
        # فقط ادمین می‌تونه همه کاربران رو ببینه
        if self.request.user.role == 'admin':
            return User.objects.all()
        return User.objects.filter(id=self.request.user.id)
    
    def get_permissions(self):
        # فقط ادمین می‌تونه کاربر ایجاد/حذف کنه
        if self.action in ['create', 'destroy', 'update', 'partial_update']:
            if self.request.user.role != 'admin':
                self.permission_denied(self.request)
        return super().get_permissions()
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

class SprintViewSet(viewsets.ModelViewSet):
    queryset = Sprint.objects.all()
    serializer_class = SprintSerializer
    
    def get_permissions(self):
        # فقط ادمین و اسکرام مستر می‌تونن اسپرینت ایجاد/ویرایش کنن
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            if self.request.user.role not in ['admin', 'scrum_master']:
                self.permission_denied(self.request)
        return super().get_permissions()
    
    def perform_create(self, serializer):
        tag_ids = self.request.data.get('tag_ids', [])
        sprint = serializer.save(created_by=self.request.user)
        if tag_ids:
            sprint.tags.set(tag_ids)
    
    def perform_update(self, serializer):
        tag_ids = self.request.data.get('tag_ids', [])
        sprint = serializer.save()
        if tag_ids is not None:
            sprint.tags.set(tag_ids)
    
    @action(detail=True, methods=['get'])
    def progress(self, request, pk=None):
        sprint = self.get_object()
        total = sprint.tasks.count()
        completed = sprint.tasks.filter(status='done').count()
        return Response({
            'total': total,
            'completed': completed,
            'percentage': (completed / total * 100) if total > 0 else 0
        })

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    
    def get_queryset(self):
        user = self.request.user
        queryset = Task.objects.all()
        
        # فیلتر بر اساس اسپرینت
        sprint_id = self.request.query_params.get('sprint', None)
        if sprint_id:
            queryset = queryset.filter(sprint_id=sprint_id)
        
        # کاربران عادی فقط تسک‌های خودشون رو می‌بینن
        if user.role not in ['admin', 'scrum_master']:
            queryset = queryset.filter(assignee=user)
        
        return queryset.order_by('-created_at')
    
    def get_permissions(self):
        # فقط ادمین و اسکرام مستر می‌تونن تسک ایجاد کنن
        if self.action == 'create':
            if self.request.user.role not in ['admin', 'scrum_master']:
                self.permission_denied(self.request)
        # فقط ادمین می‌تونه تسک حذف کنه
        elif self.action == 'destroy':
            if self.request.user.role != 'admin':
                self.permission_denied(self.request)
        return super().get_permissions()
    
    def check_object_permissions(self, request, obj):
        """بررسی دسترسی برای update و partial_update"""
        super().check_object_permissions(request, obj)
        
        if self.action in ['update', 'partial_update']:
            # کاربران می‌تونن تسک‌های خودشون رو ویرایش کنن
            # ادمین و اسکرام مستر می‌تونن همه تسک‌ها رو ویرایش کنن
            if request.user.role not in ['admin', 'scrum_master'] and obj.assignee != request.user:
                self.permission_denied(request, message='شما فقط می‌توانید تسک‌های خودتان را ویرایش کنید')
    
    def perform_create(self, serializer):
        tag_ids = self.request.data.get('tag_ids', [])
        task = serializer.save(created_by=self.request.user)
        if tag_ids:
            task.tags.set(tag_ids)
    
    def perform_update(self, serializer):
        tag_ids = self.request.data.get('tag_ids')
        task = serializer.save()
        if tag_ids is not None:
            task.tags.set(tag_ids)
    
    @action(detail=False, methods=['get'])
    def today(self, request):
        today = timezone.now().date()
        tasks = self.get_queryset().filter(deadline__date=today)
        serializer = self.get_serializer(tasks, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        now = timezone.now()
        upcoming = now + timedelta(days=3)
        tasks = self.get_queryset().filter(deadline__range=[now, upcoming], status__in=['todo', 'in_progress'])
        serializer = self.get_serializer(tasks, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def overdue(self, request):
        now = timezone.now()
        tasks = self.get_queryset().filter(deadline__lt=now, status__in=['todo', 'in_progress'])
        serializer = self.get_serializer(tasks, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def calendar(self, request):
        """تسک‌ها برای نمایش در تقویم"""
        tasks = self.get_queryset()
        serializer = self.get_serializer(tasks, many=True)
        return Response(serializer.data)

class MeetingViewSet(viewsets.ModelViewSet):
    queryset = Meeting.objects.all()
    serializer_class = MeetingSerializer
    
    def get_queryset(self):
        """فقط جلسات مربوط به کاربر جاری نمایش داده شود"""
        user = self.request.user
        
        # ادمین و اسکرام مستر همه جلسات رو می‌بینن
        if user.role in ['admin', 'scrum_master']:
            return Meeting.objects.all()
        
        # کاربران عادی فقط جلساتی که شرکت‌کننده هستند رو می‌بینن
        return Meeting.objects.filter(attendees=user)
    
    def get_permissions(self):
        # فقط ادمین و اسکرام مستر می‌تونن جلسه ایجاد/ویرایش کنن
        if self.action in ['create', 'update', 'partial_update']:
            if self.request.user.role not in ['admin', 'scrum_master']:
                self.permission_denied(self.request)
        # فقط ادمین می‌تونه جلسه حذف کنه
        elif self.action == 'destroy':
            if self.request.user.role != 'admin':
                self.permission_denied(self.request)
        return super().get_permissions()
    
    def perform_create(self, serializer):
        meeting = serializer.save(created_by=self.request.user)
        
        # ارسال نوتیفیکیشن فقط به شرکت‌کنندگان
        for attendee in meeting.attendees.all():
            Notification.objects.create(
                user=attendee,
                meeting=meeting,
                type='meeting_scheduled',
                message=f'جلسه "{meeting.title}" در تاریخ {meeting.meeting_date.strftime("%Y/%m/%d %H:%M")} برگزار می‌شود'
            )
    
    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        now = timezone.now()
        meetings = Meeting.objects.filter(
            meeting_date__gte=now,
            attendees=request.user
        ).order_by('meeting_date')
        serializer = self.get_serializer(meetings, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def calendar(self, request):
        """جلسات برای نمایش در تقویم - فقط جلسات مربوط به کاربر"""
        meetings = self.get_queryset()
        serializer = self.get_serializer(meetings, many=True)
        return Response(serializer.data)

class BacklogViewSet(viewsets.ModelViewSet):
    queryset = Backlog.objects.all()
    serializer_class = BacklogSerializer
    
    def get_permissions(self):
        # فقط ادمین و اسکرام مستر می‌تونن بک‌لاگ ایجاد/ویرایش کنن
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            if self.request.user.role not in ['admin', 'scrum_master']:
                self.permission_denied(self.request)
        return super().get_permissions()
    
    def perform_create(self, serializer):
        tag_ids = self.request.data.get('tag_ids', [])
        backlog = serializer.save(created_by=self.request.user)
        
        # اضافه کردن تگ‌ها
        if tag_ids:
            backlog.tags.set(tag_ids)
        
        # ارسال نوتیفیکیشن به همه اعضای تیم
        team_members = User.objects.filter(role='team_member')
        for member in team_members:
            Notification.objects.create(
                user=member,
                backlog=backlog,
                type='backlog_added',
                message=f'بک‌لاگ جدید "{backlog.title}" اضافه شد'
            )

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        self.get_queryset().update(is_read=True)
        return Response({'status': 'success'})

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class AIAssistantViewSet(viewsets.ViewSet):
    @action(detail=False, methods=['post'])
    def ask(self, request):
        question = request.data.get('question')
        if not question:
            return Response({'error': 'سوال الزامی است'}, status=status.HTTP_400_BAD_REQUEST)
        
        assistant = AIAssistant(request.user)
        answer = assistant.answer(question)
        return Response({'answer': answer})

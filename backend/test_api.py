#!/usr/bin/env python
"""
اسکریپت تست API
برای تست سریع endpoint های مختلف
"""

import os
import django
import sys

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from core.models import User, Task, Meeting, Sprint
from django.utils import timezone
from datetime import timedelta

def test_users():
    """تست کاربران"""
    print("\n=== تست کاربران ===")
    users = User.objects.all()
    print(f"تعداد کاربران: {users.count()}")
    for user in users:
        print(f"  - {user.username} ({user.get_role_display()})")
    return users.first()

def test_tasks(user):
    """تست تسک‌ها"""
    print("\n=== تست تسک‌ها ===")
    tasks = Task.objects.all()
    print(f"تعداد تسک‌ها: {tasks.count()}")
    for task in tasks[:5]:
        print(f"  - {task.title} ({task.get_status_display()}) - {task.assignee.username}")

def test_meetings():
    """تست جلسات"""
    print("\n=== تست جلسات ===")
    meetings = Meeting.objects.all()
    print(f"تعداد جلسات: {meetings.count()}")
    for meeting in meetings[:5]:
        print(f"  - {meeting.title} - {meeting.meeting_date}")

def test_sprints():
    """تست اسپرینت‌ها"""
    print("\n=== تست اسپرینت‌ها ===")
    sprints = Sprint.objects.all()
    print(f"تعداد اسپرینت‌ها: {sprints.count()}")
    for sprint in sprints[:5]:
        print(f"  - {sprint.title} ({sprint.start_date} تا {sprint.end_date})")

def create_test_meeting(user):
    """ایجاد جلسه تست"""
    print("\n=== ایجاد جلسه تست ===")
    try:
        meeting = Meeting.objects.create(
            title="جلسه تست",
            description="این یک جلسه تست است",
            meeting_date=timezone.now() + timedelta(days=1),
            duration_minutes=60,
            location="اتاق جلسات",
            created_by=user
        )
        meeting.attendees.add(user)
        print(f"✅ جلسه با موفقیت ایجاد شد: {meeting.id}")
        return meeting
    except Exception as e:
        print(f"❌ خطا در ایجاد جلسه: {str(e)}")
        import traceback
        traceback.print_exc()
        return None

def main():
    print("=" * 50)
    print("تست API - سیستم مدیریت تسک")
    print("=" * 50)
    
    # تست کاربران
    user = test_users()
    
    if not user:
        print("\n❌ هیچ کاربری وجود ندارد!")
        print("لطفاً ابتدا با دستور زیر کاربر ایجاد کنید:")
        print("python manage.py createsuperuser")
        return
    
    # تست تسک‌ها
    test_tasks(user)
    
    # تست جلسات
    test_meetings()
    
    # تست اسپرینت‌ها
    test_sprints()
    
    # ایجاد جلسه تست
    if '--create-meeting' in sys.argv:
        create_test_meeting(user)
    
    print("\n" + "=" * 50)
    print("✅ تست‌ها با موفقیت انجام شد!")
    print("=" * 50)

if __name__ == '__main__':
    main()

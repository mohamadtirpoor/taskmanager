#!/usr/bin/env python
"""تست دسترسی‌های جلسات"""

import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from core.models import User, Meeting
from django.utils import timezone
from datetime import timedelta

def test_meeting_visibility():
    print("=" * 50)
    print("تست نمایش جلسات برای کاربران مختلف")
    print("=" * 50)
    
    # گرفتن کاربران
    admin = User.objects.get(username='admin')
    ali = User.objects.get(username='ali')
    reza = User.objects.get(username='reza')
    
    print(f"\nکاربران:")
    print(f"  - {admin.username} ({admin.get_role_display()})")
    print(f"  - {ali.username} ({ali.get_role_display()})")
    print(f"  - {reza.username} ({reza.get_role_display()})")
    
    # ایجاد جلسه تست
    meeting1 = Meeting.objects.create(
        title="جلسه برای علی",
        meeting_date=timezone.now() + timedelta(days=1),
        duration_minutes=60,
        created_by=admin
    )
    meeting1.attendees.set([ali])
    
    meeting2 = Meeting.objects.create(
        title="جلسه برای رضا",
        meeting_date=timezone.now() + timedelta(days=2),
        duration_minutes=60,
        created_by=admin
    )
    meeting2.attendees.set([reza])
    
    meeting3 = Meeting.objects.create(
        title="جلسه برای همه",
        meeting_date=timezone.now() + timedelta(days=3),
        duration_minutes=60,
        created_by=admin
    )
    meeting3.attendees.set([ali, reza])
    
    print(f"\n✅ 3 جلسه ایجاد شد")
    
    # تست نمایش برای ادمین
    admin_meetings = Meeting.objects.all()
    print(f"\nادمین می‌بیند: {admin_meetings.count()} جلسه")
    for m in admin_meetings:
        print(f"  - {m.title}")
    
    # تست نمایش برای علی
    ali_meetings = Meeting.objects.filter(attendees=ali)
    print(f"\nعلی می‌بیند: {ali_meetings.count()} جلسه")
    for m in ali_meetings:
        print(f"  - {m.title}")
    
    # تست نمایش برای رضا
    reza_meetings = Meeting.objects.filter(attendees=reza)
    print(f"\nرضا می‌بیند: {reza_meetings.count()} جلسه")
    for m in reza_meetings:
        print(f"  - {m.title}")
    
    # پاکسازی
    meeting1.delete()
    meeting2.delete()
    meeting3.delete()
    print(f"\n✅ جلسات تست حذف شدند")

if __name__ == '__main__':
    test_meeting_visibility()

#!/usr/bin/env python
"""تست ایجاد جلسه"""

import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from core.models import User, Meeting
from django.utils import timezone
from datetime import timedelta
import json

def test_meeting_creation():
    print("=" * 50)
    print("تست ایجاد جلسه")
    print("=" * 50)
    
    # گرفتن کاربر ادمین
    admin = User.objects.filter(role='admin').first()
    if not admin:
        print("❌ کاربر ادمین یافت نشد!")
        return
    
    print(f"✅ کاربر: {admin.username}")
    
    # داده‌های تست
    meeting_data = {
        'title': 'جلسه تست از Python',
        'description': 'این یک جلسه تست است',
        'meeting_date': timezone.now() + timedelta(days=2),
        'duration_minutes': 60,
        'location': 'اتاق جلسات',
        'meeting_link': 'https://meet.google.com/test',
        'created_by': admin
    }
    
    print("\nداده‌های جلسه:")
    print(json.dumps({
        'title': meeting_data['title'],
        'meeting_date': str(meeting_data['meeting_date']),
        'duration_minutes': meeting_data['duration_minutes'],
    }, indent=2, ensure_ascii=False))
    
    try:
        # ایجاد جلسه
        meeting = Meeting.objects.create(**meeting_data)
        print(f"\n✅ جلسه با موفقیت ایجاد شد: ID={meeting.id}")
        
        # اضافه کردن شرکت‌کنندگان
        users = User.objects.all()[:2]
        meeting.attendees.set(users)
        print(f"✅ {users.count()} شرکت‌کننده اضافه شد")
        
        # نمایش جلسه
        print("\nجزئیات جلسه:")
        print(f"  ID: {meeting.id}")
        print(f"  عنوان: {meeting.title}")
        print(f"  تاریخ: {meeting.meeting_date}")
        print(f"  مدت: {meeting.duration_minutes} دقیقه")
        print(f"  شرکت‌کنندگان: {meeting.attendees.count()}")
        
        return meeting
        
    except Exception as e:
        print(f"\n❌ خطا در ایجاد جلسه: {str(e)}")
        import traceback
        traceback.print_exc()
        return None

def test_serializer():
    print("\n" + "=" * 50)
    print("تست Serializer")
    print("=" * 50)
    
    from api.serializers import MeetingSerializer
    from rest_framework.request import Request
    from rest_framework.test import APIRequestFactory
    
    factory = APIRequestFactory()
    request = factory.post('/api/meetings/')
    
    admin = User.objects.filter(role='admin').first()
    request.user = admin
    
    data = {
        'title': 'جلسه تست Serializer',
        'description': 'تست',
        'meeting_date': (timezone.now() + timedelta(days=3)).isoformat(),
        'duration_minutes': 60,
        'location': 'اتاق',
        'attendee_ids': [admin.id]
    }
    
    print("\nداده‌های ورودی:")
    print(json.dumps(data, indent=2, ensure_ascii=False))
    
    serializer = MeetingSerializer(data=data)
    
    if serializer.is_valid():
        print("\n✅ Serializer معتبر است")
        print("\nداده‌های validated:")
        print(json.dumps(serializer.validated_data, indent=2, default=str, ensure_ascii=False))
    else:
        print("\n❌ Serializer نامعتبر است")
        print("خطاها:")
        print(json.dumps(serializer.errors, indent=2, ensure_ascii=False))

if __name__ == '__main__':
    test_meeting_creation()
    test_serializer()

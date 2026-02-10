#!/usr/bin/env python
"""تست مستقیم API ایجاد جلسه"""

import requests
import json
from datetime import datetime, timedelta

# URL های API
BASE_URL = "http://127.0.0.1:8000/api"
LOGIN_URL = f"{BASE_URL}/auth/login/"
MEETING_URL = f"{BASE_URL}/meetings/"

def test_meeting_api():
    print("=" * 50)
    print("تست API ایجاد جلسه")
    print("=" * 50)
    
    # 1. Login و گرفتن token
    print("\n1. Login...")
    login_data = {
        "username": "admin",
        "password": "admin123"
    }
    
    try:
        response = requests.post(LOGIN_URL, json=login_data)
        response.raise_for_status()
        token = response.json()['access']
        print(f"✅ Token دریافت شد: {token[:20]}...")
    except Exception as e:
        print(f"❌ خطا در login: {str(e)}")
        return
    
    # 2. ایجاد جلسه
    print("\n2. ایجاد جلسه...")
    
    meeting_date = (datetime.now() + timedelta(days=1)).isoformat()
    
    meeting_data = {
        "title": "Test Meeting from API",
        "description": "This is a test meeting",
        "meeting_date": meeting_date,
        "duration_minutes": 60,
        "location": "Meeting Room",
        "meeting_link": "https://meet.google.com/test",
        "attendee_ids": [1, 2]
    }
    
    print("\nداده‌های ارسالی:")
    print(json.dumps(meeting_data, indent=2))
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(MEETING_URL, json=meeting_data, headers=headers)
        print(f"\nStatus Code: {response.status_code}")
        
        if response.status_code == 201:
            print("✅ جلسه با موفقیت ایجاد شد!")
            print("\nپاسخ:")
            print(json.dumps(response.json(), indent=2))
        else:
            print(f"❌ خطا: {response.status_code}")
            print("پاسخ:")
            print(response.text)
            
    except Exception as e:
        print(f"❌ خطا در ارسال درخواست: {str(e)}")

if __name__ == '__main__':
    test_meeting_api()

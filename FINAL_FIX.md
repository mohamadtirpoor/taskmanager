# ✅ رفع نهایی باگ ایجاد جلسه

## مشکل:
خطای 500 در ایجاد جلسه با پیام:
```
TypeError: Meeting() got unexpected keyword arguments: 'attendee_ids'
```

## علت:
Serializer سعی می‌کرد `attendee_ids` را مستقیماً به `Meeting.objects.create()` ارسال کند، در حالی که این فیلد در مدل وجود ندارد (فقط یک فیلد write-only در serializer است).

## راه حل:
اضافه کردن متد `create` سفارشی به `MeetingSerializer` که:
1. `attendee_ids` و `tag_ids` را از `validated_data` حذف می‌کند
2. جلسه را ایجاد می‌کند
3. شرکت‌کنندگان و تگ‌ها را به صورت جداگانه اضافه می‌کند

## تغییرات:

### 1. `backend/api/serializers.py`
```python
class MeetingSerializer(serializers.ModelSerializer):
    # ... فیلدها ...
    
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
```

### 2. `backend/api/views.py`
ساده‌سازی `MeetingViewSet.perform_create` چون serializer خودش همه کارها را انجام می‌دهد:
```python
def perform_create(self, serializer):
    meeting = serializer.save(created_by=self.request.user)
    
    # ارسال نوتیفیکیشن به شرکت‌کنندگان
    for attendee in meeting.attendees.all():
        Notification.objects.create(
            user=attendee,
            meeting=meeting,
            type='meeting_scheduled',
            message=f'جلسه "{meeting.title}" برگزار می‌شود'
        )
```

## تست:
✅ جلسه با موفقیت ایجاد شد (ID: 3)
✅ شرکت‌کنندگان اضافه شدند
✅ نوتیفیکیشن‌ها ارسال شدند

## نکته مهم:
این الگو برای همه serializer هایی که فیلدهای ManyToMany با `_ids` دارند باید استفاده شود.

## وضعیت نهایی:
- ✅ ایجاد جلسه: کار می‌کند
- ✅ جابجایی تسک: کار می‌کند
- ✅ حذف تسک (ادمین): کار می‌کند
- ✅ یوزر استوری: اضافه شد
- ✅ تاریخ شمسی: همه جا اعمال شد
- ✅ تقویم: نمایش تسک، جلسه، اسپرینت

🎉 **همه باگ‌ها برطرف شدند!**

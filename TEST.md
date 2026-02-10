# راهنمای تست

## اجرای تست‌ها

### Backend Tests

```bash
cd backend
python manage.py test
```

### اجرای تست‌های خاص

```bash
# تست احراز هویت
python manage.py test api.tests.AuthenticationTests

# تست تسک‌ها
python manage.py test api.tests.TaskTests

# تست اسپرینت‌ها
python manage.py test api.tests.SprintTests
```

### اجرای تست با coverage

```bash
pip install coverage
coverage run --source='.' manage.py test
coverage report
coverage html
```

## تست API با Postman

### 1. ورود و دریافت توکن

**Request:**
```
POST http://localhost:8000/api/auth/login/
Content-Type: application/json

{
    "username": "admin",
    "password": "admin"
}
```

**Response:**
```json
{
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### 2. دریافت اطلاعات کاربر

**Request:**
```
GET http://localhost:8000/api/users/me/
Authorization: Bearer {access_token}
```

### 3. لیست تسک‌ها

**Request:**
```
GET http://localhost:8000/api/tasks/
Authorization: Bearer {access_token}
```

### 4. ایجاد تسک

**Request:**
```
POST http://localhost:8000/api/tasks/
Authorization: Bearer {access_token}
Content-Type: application/json

{
    "title": "تسک جدید",
    "description": "توضیحات تسک",
    "assignee_id": 1,
    "status": "todo",
    "priority": "high",
    "deadline": "2024-12-31T12:00:00Z",
    "estimated_hours": 8
}
```

### 5. تسک‌های امروز

**Request:**
```
GET http://localhost:8000/api/tasks/today/
Authorization: Bearer {access_token}
```

### 6. ایجاد اسپرینت

**Request:**
```
POST http://localhost:8000/api/sprints/
Authorization: Bearer {access_token}
Content-Type: application/json

{
    "title": "اسپرینت جدید",
    "description": "توضیحات اسپرینت",
    "start_date": "2024-01-01",
    "end_date": "2024-01-14"
}
```

### 7. پیشرفت اسپرینت

**Request:**
```
GET http://localhost:8000/api/sprints/1/progress/
Authorization: Bearer {access_token}
```

### 8. دستیار هوشمند

**Request:**
```
POST http://localhost:8000/api/ai/ask/
Authorization: Bearer {access_token}
Content-Type: application/json

{
    "question": "امروز چه تسک‌هایی دارم؟"
}
```

## تست با curl

### ورود

```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'
```

### دریافت تسک‌ها

```bash
TOKEN="your_access_token"
curl http://localhost:8000/api/tasks/ \
  -H "Authorization: Bearer $TOKEN"
```

### ایجاد تسک

```bash
curl -X POST http://localhost:8000/api/tasks/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "تسک جدید",
    "assignee_id": 1,
    "status": "todo",
    "priority": "high",
    "deadline": "2024-12-31T12:00:00Z"
  }'
```

## تست Frontend

### تست دستی

1. ورود به سیستم با اطلاعات ادمین
2. بررسی داشبورد و نمایش آمار
3. مشاهده لیست تسک‌ها
4. ایجاد تسک جدید
5. تغییر وضعیت تسک
6. مشاهده تقویم
7. بررسی نوتیفیکیشن‌ها
8. تست دستیار هوشمند

### چک‌لیست تست

- [ ] ورود و خروج
- [ ] نمایش داشبورد
- [ ] لیست تسک‌ها
- [ ] فیلتر تسک‌ها
- [ ] ایجاد تسک
- [ ] ویرایش تسک
- [ ] حذف تسک
- [ ] لیست اسپرینت‌ها
- [ ] ایجاد اسپرینت
- [ ] نمایش تقویم
- [ ] نوتیفیکیشن‌ها
- [ ] دستیار هوشمند
- [ ] ریسپانسیو بودن

## تست Performance

### Backend

```bash
# نصب locust
pip install locust

# ایجاد فایل locustfile.py
# اجرا
locust -f locustfile.py
```

### Frontend

```bash
# نصب lighthouse
npm install -g lighthouse

# اجرا
lighthouse http://localhost:5173 --view
```

## تست امنیتی

### SQL Injection

تست ورودی‌های مخرب در فیلدهای جستجو و فیلتر

### XSS

تست اسکریپت‌های مخرب در فیلدهای متنی

### CSRF

بررسی توکن CSRF در فرم‌ها

### Authentication

- تست دسترسی بدون توکن
- تست توکن منقضی شده
- تست توکن نامعتبر

## CI/CD Testing

### GitHub Actions

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Set up Python
      uses: actions/setup-python@v2
      with:
        python-version: 3.11
    
    - name: Install dependencies
      run: |
        cd backend
        pip install -r requirements.txt
    
    - name: Run tests
      run: |
        cd backend
        python manage.py test
```

## نکات مهم

1. همیشه قبل از commit تست‌ها را اجرا کنید
2. تست‌های جدید برای ویژگی‌های جدید بنویسید
3. Coverage را بالای 80% نگه دارید
4. تست‌های integration را فراموش نکنید
5. تست‌های امنیتی را جدی بگیرید

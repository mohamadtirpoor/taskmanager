# راهنمای سریع شروع کار

## نصب و اجرا در 5 دقیقه ⚡

### مرحله 1: Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### مرحله 2: Frontend (در ترمینال جدید)

```bash
cd frontend
npm install
npm run dev
```

### مرحله 3: ورود به سیستم

1. مرورگر را باز کنید: `http://localhost:5173`
2. با اطلاعات ادمین وارد شوید

## ساختار پروژه

```
├── backend/                 # Django Backend
│   ├── config/             # تنظیمات Django
│   ├── core/               # مدل‌های اصلی
│   ├── api/                # API endpoints
│   ├── manage.py           # Django CLI
│   └── requirements.txt    # پکیج‌های Python
│
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── components/    # کامپوننت‌های قابل استفاده مجدد
│   │   ├── pages/         # صفحات اصلی
│   │   ├── services/      # API calls
│   │   └── context/       # React Context
│   ├── package.json       # پکیج‌های Node
│   └── vite.config.js     # تنظیمات Vite
│
├── README.md              # مستندات اصلی
├── SETUP.md              # راهنمای نصب کامل
├── DEPLOYMENT.md         # راهنمای استقرار
└── FEATURES.md           # لیست ویژگی‌ها
```

## دستورات مفید

### Backend

```bash
# ایجاد مایگریشن جدید
python manage.py makemigrations

# اجرای مایگریشن‌ها
python manage.py migrate

# ایجاد کاربر ادمین
python manage.py createsuperuser

# اجرای سرور
python manage.py runserver

# ورود به shell Django
python manage.py shell

# جمع‌آوری فایل‌های static
python manage.py collectstatic
```

### Frontend

```bash
# نصب پکیج‌ها
npm install

# اجرای سرور توسعه
npm run dev

# ساخت نسخه production
npm run build

# پیش‌نمایش build
npm run preview
```

## ایجاد داده‌های نمونه

### روش سریع (پیشنهادی)

```bash
cd backend
python manage.py create_sample_data
```

این دستور به صورت خودکار:
- 4 کاربر (1 ادمین، 1 اسکرام مستر، 3 عضو تیم)
- 2 اسپرینت
- 6 تسک با وضعیت‌های مختلف
- چند نوتیفیکیشن نمونه

ایجاد می‌کند.

### از طریق Django Shell

```bash
cd backend
python manage.py shell
```

```python
from core.models import User, Sprint, Task
from datetime import datetime, timedelta

# ایجاد کاربر
user = User.objects.create_user(
    username='ali',
    email='ali@example.com',
    password='password123',
    first_name='علی',
    last_name='احمدی',
    role='team_member'
)

# ایجاد اسپرینت
sprint = Sprint.objects.create(
    title='اسپرینت اول',
    description='اسپرینت اول پروژه',
    start_date=datetime.now().date(),
    end_date=(datetime.now() + timedelta(days=14)).date(),
    created_by=user
)

# ایجاد تسک
task = Task.objects.create(
    title='طراحی صفحه اصلی',
    description='طراحی و پیاده‌سازی صفحه اصلی',
    assignee=user,
    status='todo',
    priority='high',
    deadline=datetime.now() + timedelta(days=3),
    estimated_hours=8,
    sprint=sprint,
    created_by=user
)
```

### از طریق پنل ادمین

1. به `http://localhost:8000/admin` بروید
2. با اطلاعات ادمین وارد شوید
3. از منوی سمت راست، مدل‌ها را انتخاب کنید
4. داده‌های نمونه ایجاد کنید

## تست API با curl

### ورود و دریافت توکن

```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'
```

### دریافت لیست تسک‌ها

```bash
curl http://localhost:8000/api/tasks/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### ایجاد تسک جدید

```bash
curl -X POST http://localhost:8000/api/tasks/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "تسک جدید",
    "description": "توضیحات",
    "assignee_id": 1,
    "status": "todo",
    "priority": "medium",
    "deadline": "2024-12-31T12:00:00Z"
  }'
```

## تنظیمات اختیاری

### دستیار هوشمند (AI Assistant)

برای فعال‌سازی دستیار هوشمند، کلید API OpenAI را در `.env` اضافه کنید:

```env
OPENAI_API_KEY=sk-your-api-key-here
```

### دیتابیس PostgreSQL

برای استفاده از PostgreSQL به جای SQLite:

1. PostgreSQL را نصب کنید
2. دیتابیس ایجاد کنید
3. در `settings.py` تغییر دهید:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'taskmanager',
        'USER': 'postgres',
        'PASSWORD': 'your-password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

### Celery برای تسک‌های پس‌زمینه

```bash
# نصب Redis
# Windows: https://github.com/microsoftarchive/redis/releases

# اجرای Celery Worker
cd backend
celery -A config worker -l info

# اجرای Celery Beat (برای تسک‌های زمان‌بندی شده)
celery -A config beat -l info
```

## عیب‌یابی سریع

### Backend اجرا نمی‌شود

```bash
# بررسی نصب پکیج‌ها
pip list

# نصب مجدد
pip install -r requirements.txt --force-reinstall
```

### Frontend اجرا نمی‌شود

```bash
# پاک کردن node_modules
rm -rf node_modules
npm install

# یا با yarn
yarn install
```

### خطای CORS

مطمئن شوید Backend روی پورت 8000 و Frontend روی پورت 5173 اجرا می‌شود.

### خطای دیتابیس

```bash
# حذف دیتابیس و ایجاد مجدد
rm db.sqlite3
python manage.py migrate
python manage.py createsuperuser
```

## پشتیبانی

برای سوالات و مشکلات:
- مستندات کامل: `SETUP.md`
- لیست ویژگی‌ها: `FEATURES.md`
- راهنمای استقرار: `DEPLOYMENT.md`

## نکات مهم

✅ همیشه محیط مجازی Python را فعال کنید
✅ Backend باید قبل از Frontend اجرا شود
✅ برای تست، از پنل ادمین Django استفاده کنید
✅ برای production، DEBUG را False کنید
✅ از HTTPS برای production استفاده کنید

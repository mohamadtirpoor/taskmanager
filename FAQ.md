# سوالات متداول (FAQ)

## نصب و راه‌اندازی

### چگونه پروژه را نصب کنم؟

**روش سریع (Windows):**
```bash
.\setup.ps1
```

**روش سریع (Linux/Mac):**
```bash
chmod +x setup.sh
./setup.sh
```

**روش دستی:**
راهنمای کامل در [QUICKSTART.md](QUICKSTART.md)

### خطای "Python not found" می‌گیرم

Python 3.10 یا بالاتر را نصب کنید:
- Windows: https://www.python.org/downloads/
- Linux: `sudo apt install python3.10`
- Mac: `brew install python@3.10`

### خطای "Node not found" می‌گیرم

Node.js 18 یا بالاتر را نصب کنید:
- https://nodejs.org/

### Backend اجرا می‌شود اما Frontend خطا می‌دهد

```bash
cd frontend
rm -rf node_modules
npm install
npm run dev
```

## استفاده

### چگونه کاربر جدید ایجاد کنم؟

از پنل ادمین Django:
1. به `http://localhost:8000/admin` بروید
2. Users > Add User
3. اطلاعات را وارد کنید

### چگونه تسک ایجاد کنم؟

1. وارد سیستم شوید
2. به صفحه Tasks بروید
3. دکمه "تسک جدید" را بزنید
4. فرم را پر کنید

### چگونه اسپرینت ایجاد کنم؟

1. به صفحه Sprints بروید
2. دکمه "اسپرینت جدید" را بزنید
3. تاریخ شروع و پایان را تعیین کنید

### دستیار هوشمند کار نمی‌کند

دستیار هوشمند به OpenAI API نیاز دارد:

1. کلید API از OpenAI دریافت کنید
2. در فایل `.env` اضافه کنید:
   ```
   OPENAI_API_KEY=sk-your-key-here
   ```
3. Backend را ری‌استارت کنید

بدون API، دستیار با پاسخ‌های پیش‌فرض کار می‌کند.

## مشکلات رایج

### خطای CORS

مطمئن شوید:
- Backend روی پورت 8000
- Frontend روی پورت 5173
- تنظیمات CORS در `settings.py` صحیح است

### خطای "Migration not applied"

```bash
cd backend
python manage.py migrate
```

### خطای "Port already in use"

**Backend (8000):**
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8000 | xargs kill -9
```

**Frontend (5173):**
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5173 | xargs kill -9
```

### دیتابیس خراب شده

```bash
cd backend
rm db.sqlite3
python manage.py migrate
python manage.py createsuperuser
python manage.py create_sample_data
```

### نوتیفیکیشن‌ها نمایش داده نمی‌شوند

1. بررسی کنید Backend اجرا است
2. Console مرورگر را چک کنید
3. لاگ Backend را بررسی کنید

## توسعه

### چگونه ویژگی جدید اضافه کنم؟

راهنمای کامل در [CONTRIBUTING.md](CONTRIBUTING.md)

### چگونه تست بنویسم؟

**Backend:**
```python
# در backend/api/tests.py
class MyTest(TestCase):
    def test_something(self):
        # تست خود را بنویسید
        pass
```

**اجرا:**
```bash
python manage.py test
```

### چگونه API جدید اضافه کنم؟

1. مدل در `core/models.py`
2. Serializer در `api/serializers.py`
3. ViewSet در `api/views.py`
4. URL در `api/urls.py`

### چگونه صفحه جدید اضافه کنم؟

1. کامپوننت در `frontend/src/pages/`
2. Route در `frontend/src/App.jsx`
3. لینک در `frontend/src/components/Layout.jsx`

## استقرار

### چگونه روی سرور استقرار دهم؟

راهنمای کامل در [DEPLOYMENT.md](DEPLOYMENT.md)

### چگونه با Docker اجرا کنم؟

```bash
docker-compose up -d
```

راهنمای کامل در [DOCKER.md](DOCKER.md)

### چگونه HTTPS فعال کنم؟

با Let's Encrypt:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

### چگونه از دیتابیس Backup بگیرم؟

**SQLite:**
```bash
cp backend/db.sqlite3 backup.sqlite3
```

**PostgreSQL:**
```bash
pg_dump -U postgres taskmanager > backup.sql
```

## امنیت

### چگونه رمز عبور را تغییر دهم؟

از پنل ادمین یا:
```bash
cd backend
python manage.py changepassword username
```

### چگونه SECRET_KEY را تغییر دهم؟

```python
# در backend/config/settings.py
import secrets
SECRET_KEY = secrets.token_urlsafe(50)
```

### چگونه دسترسی کاربران را محدود کنم؟

از نقش‌های موجود استفاده کنید:
- `admin` - دسترسی کامل
- `scrum_master` - مدیریت اسپرینت و تسک
- `team_member` - فقط تسک‌های خود

## عملکرد

### سیستم کند است

1. از PostgreSQL به جای SQLite استفاده کنید
2. Redis برای cache فعال کنید
3. Static files را serve کنید
4. از CDN استفاده کنید

### چگونه لاگ‌ها را ببینم؟

**Backend:**
```bash
cd backend
python manage.py runserver
# لاگ‌ها در terminal نمایش داده می‌شوند
```

**Docker:**
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

## پشتیبانی

### کجا سوال بپرسم؟

- GitHub Issues
- Discussions
- ایمیل: support@dadeh-negar.com

### چگونه باگ گزارش کنم؟

راهنمای کامل در [CONTRIBUTING.md](CONTRIBUTING.md)

### چگونه آسیب‌پذیری امنیتی گزارش کنم؟

راهنمای کامل در [SECURITY.md](SECURITY.md)

---

سوال شما اینجا نیست؟ Issue ایجاد کنید!

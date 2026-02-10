# راهنمای نصب و راه‌اندازی

## پیش‌نیازها

- Python 3.10 یا بالاتر
- Node.js 18 یا بالاتر
- pip (Python package manager)
- npm یا yarn

## نصب Backend

### 1. ایجاد محیط مجازی Python

```bash
cd backend
python -m venv venv
```

### 2. فعال‌سازی محیط مجازی

**Windows:**
```bash
venv\Scripts\activate
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

### 3. نصب پکیج‌ها

```bash
pip install -r requirements.txt
```

### 4. تنظیمات محیطی

فایل `.env` را در پوشه `backend` ایجاد کنید:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

### 5. مایگریشن دیتابیس

```bash
python manage.py migrate
```

### 6. ایجاد کاربر ادمین

```bash
python manage.py createsuperuser
```

اطلاعات زیر را وارد کنید:
- Username: admin
- Email: admin@example.com
- Password: admin (یا هر رمز دلخواه)

### 7. اجرای سرور

```bash
python manage.py runserver
```

Backend روی `http://localhost:8000` اجرا می‌شود.

## نصب Frontend

### 1. نصب پکیج‌ها

```bash
cd frontend
npm install
```

### 2. اجرای سرور توسعه

```bash
npm run dev
```

Frontend روی `http://localhost:5173` اجرا می‌شود.

## دسترسی به سیستم

1. مرورگر را باز کنید و به آدرس `http://localhost:5173` بروید
2. با اطلاعات کاربر ادمین وارد شوید:
   - نام کاربری: admin
   - رمز عبور: admin

## ایجاد داده‌های نمونه

برای تست سیستم، می‌توانید از پنل ادمین Django استفاده کنید:

1. به `http://localhost:8000/admin` بروید
2. با اطلاعات ادمین وارد شوید
3. اسپرینت‌ها و تسک‌های نمونه ایجاد کنید

## نکات مهم

- Backend باید همیشه در حال اجرا باشد
- Frontend به Backend متصل است و بدون آن کار نمی‌کند
- برای استفاده از دستیار هوشمند، کلید API OpenAI را در `.env` تنظیم کنید

## عیب‌یابی

### خطای CORS

اگر با خطای CORS مواجه شدید، مطمئن شوید که:
- Backend روی پورت 8000 اجرا شده است
- Frontend روی پورت 5173 اجرا شده است
- تنظیمات CORS در `settings.py` صحیح است

### خطای دیتابیس

اگر با خطای دیتابیس مواجه شدید:
```bash
cd backend
python manage.py migrate --run-syncdb
```

### خطای نصب پکیج‌ها

اگر نصب پکیج‌های Python با مشکل مواجه شد:
```bash
pip install --upgrade pip
pip install -r requirements.txt --no-cache-dir
```

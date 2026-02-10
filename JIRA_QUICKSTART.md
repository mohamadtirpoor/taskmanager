# راهنمای سریع اتصال به Jira

## 🚀 شروع سریع (5 دقیقه)

### مرحله 1: تنظیم فایل .env

فایل `backend/.env` را باز کنید و مقادیر زیر را تنظیم کنید:

```env
JIRA_URL=https://your-domain.atlassian.net
JIRA_EMAIL=mohamad.tirpoor@gmail.com
JIRA_API_TOKEN=ATATT3xFfGF0uE4jzOBFlAXsMURRxOYV2ezMCg_w3u5PUfrVNxBa7FGrXENivgNbFiBzGqfY8eON7WUOqWTgJRmZ7t13w4IENzETVVf2ZOPbjwbPkTSRfQuQnQzDXQihCtMlCwsJyha2MPHaMgvSzX4GX5hU39yO8mjdG3nKGWkjniHDYwtLD9U=6B630E1E
JIRA_PROJECT_KEY=YOUR_PROJECT_KEY
```

**مهم:** `JIRA_URL` و `JIRA_PROJECT_KEY` را با مقادیر واقعی خود جایگزین کنید!

### مرحله 2: نصب کتابخانه‌ها

```bash
cd backend
pip install jira==3.8.0
```

### مرحله 3: اجرای Migration

```bash
python manage.py migrate
```

### مرحله 4: تست اتصال

```bash
python test_jira_connection.py
```

اگر پیام ✅ دریافت کردید، همه چیز آماده است!

### مرحله 5: همگام‌سازی اولیه

#### گزینه A: انتقال داده‌های موجود به Jira
```bash
python manage.py jira_sync --direction to-jira
```

#### گزینه B: دریافت داده‌ها از Jira
```bash
python manage.py jira_sync --direction from-jira
```

## 🎯 استفاده از رابط کاربری

1. سرور را اجرا کنید:
```bash
python manage.py runserver
```

2. به عنوان Admin وارد شوید

3. به صفحه "اتصال Jira" بروید (منوی بالا)

4. از دکمه‌های همگام‌سازی استفاده کنید

## 📝 یافتن Project Key

1. به پروژه Jira خود بروید
2. از URL پروژه، کد 2-5 حرفی را پیدا کنید
3. مثال: `https://your-domain.atlassian.net/browse/PROJ` → Project Key = `PROJ`

## ❓ مشکل دارید؟

### خطای "Project not found"
- بررسی کنید که `JIRA_PROJECT_KEY` صحیح است
- بررسی کنید که به پروژه دسترسی دارید

### خطای "Authentication failed"
- بررسی کنید که `JIRA_EMAIL` صحیح است
- بررسی کنید که `JIRA_API_TOKEN` منقضی نشده است
- API Token جدید بسازید: https://id.atlassian.com/manage-profile/security/api-tokens

### خطای "Connection refused"
- بررسی کنید که `JIRA_URL` صحیح است
- بررسی کنید که به اینترنت متصل هستید

## 📚 مستندات کامل

برای اطلاعات بیشتر، فایل `JIRA_INTEGRATION.md` را مطالعه کنید.

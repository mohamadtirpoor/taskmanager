# 🚀 شروع کار با Jira Integration

## مراحل سریع (فقط 3 دقیقه!)

### 1️⃣ تنظیم فایل .env

فایل `backend/.env` را باز کنید و این دو خط را ویرایش کنید:

```env
JIRA_URL=https://your-domain.atlassian.net  # ← آدرس Jira خود
JIRA_PROJECT_KEY=PROJ  # ← کلید پروژه خود (مثل PROJ, DEV, TEAM)
```

**چطور Project Key را پیدا کنم؟**
- به پروژه Jira خود بروید
- از URL، کد 2-5 حرفی را پیدا کنید
- مثال: `https://mycompany.atlassian.net/browse/PROJ` → `PROJ`

### 2️⃣ نصب کتابخانه

```bash
cd backend
pip install jira==3.8.0
```

### 3️⃣ اجرای Migration

```bash
python manage.py migrate
```

### 4️⃣ تست اتصال

```bash
python test_jira_connection.py
```

اگر ✅ دیدید، آماده‌اید!

### 5️⃣ همگام‌سازی

**گزینه A: انتقال داده‌های موجود به Jira**
```bash
python manage.py jira_sync --direction to-jira
```

**گزینه B: دریافت داده‌ها از Jira**
```bash
python manage.py jira_sync --direction from-jira
```

## ✅ تمام!

حالا:
1. سرور را اجرا کنید: `python manage.py runserver`
2. به عنوان Admin وارد شوید
3. به صفحه "اتصال Jira" بروید
4. از دکمه‌های همگام‌سازی استفاده کنید

## 📚 مستندات بیشتر

- **راهنمای سریع**: `JIRA_QUICKSTART.md`
- **راهنمای کامل**: `JIRA_INTEGRATION.md`
- **خلاصه پیاده‌سازی**: `JIRA_SETUP_SUMMARY.md`

## ❓ مشکل دارید؟

```bash
python test_jira_connection.py
```

این دستور مشکل را نشان می‌دهد!

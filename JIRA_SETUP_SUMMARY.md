# خلاصه پیاده‌سازی اتصال Jira

## ✅ فایل‌های ایجاد شده

### Backend

1. **`backend/core/jira_integration.py`**
   - کلاس اصلی `JiraIntegration` برای ارتباط با Jira API
   - قابلیت‌ها:
     - ایجاد، ویرایش، حذف Issues
     - مدیریت Sprints
     - مدیریت Backlogs
     - مدیریت Comments
     - جستجوی کاربران
     - همگام‌سازی داده‌ها

2. **`backend/core/jira_sync.py`**
   - سرویس همگام‌سازی دو طرفه
   - قابلیت‌ها:
     - Sync Task به/از Jira
     - Sync Sprint به/از Jira
     - Sync Backlog به/از Jira
     - Sync Comment به Jira
     - Bulk sync operations

3. **`backend/api/jira_views.py`**
   - API endpoints برای مدیریت Integration
   - Webhook handler برای دریافت تغییرات از Jira
   - Endpoints:
     - `/api/jira/test_connection/` - تست اتصال
     - `/api/jira/sync_task_to_jira/` - همگام‌سازی Task
     - `/api/jira/sync_sprint_to_jira/` - همگام‌سازی Sprint
     - `/api/jira/sync_backlog_to_jira/` - همگام‌سازی Backlog
     - `/api/jira/sync_all_to_jira/` - همگام‌سازی همه به Jira
     - `/api/jira/sync_all_from_jira/` - همگام‌سازی همه از Jira
     - `/api/jira/sync_recent_from_jira/` - تغییرات اخیر
     - `/api/jira/sync_status/` - وضعیت همگام‌سازی
     - `/api/jira/webhook/` - Webhook endpoint

4. **`backend/core/management/commands/jira_sync.py`**
   - Management command برای همگام‌سازی از CLI
   - استفاده:
     ```bash
     python manage.py jira_sync --direction to-jira
     python manage.py jira_sync --direction from-jira
     python manage.py jira_sync --direction both
     python manage.py jira_sync --test
     ```

5. **`backend/core/migrations/0005_jira_integration_fields.py`**
   - Migration برای اضافه کردن فیلدهای Jira به models
   - فیلدهای اضافه شده:
     - `Task.jira_key`
     - `Task.last_synced_at`
     - `Sprint.jira_sprint_id`
     - `Sprint.last_synced_at`
     - `Backlog.jira_key`
     - `Backlog.last_synced_at`

6. **`backend/test_jira_connection.py`**
   - اسکریپت تست اتصال به Jira
   - نمایش اطلاعات پروژه و کاربران

### Frontend

1. **`frontend/src/pages/JiraIntegration.jsx`**
   - صفحه مدیریت اتصال Jira
   - قابلیت‌ها:
     - تست اتصال
     - نمایش وضعیت همگام‌سازی
     - دکمه‌های همگام‌سازی
     - راهنمای استفاده

### Configuration

1. **`backend/config/settings.py`**
   - اضافه شدن تنظیمات Jira:
     - `JIRA_URL`
     - `JIRA_EMAIL`
     - `JIRA_API_TOKEN`
     - `JIRA_PROJECT_KEY`

2. **`backend/.env`**
   - فایل تنظیمات با اطلاعات واقعی شما

3. **`backend/.env.example`**
   - نمونه فایل تنظیمات

4. **`backend/requirements.txt`**
   - اضافه شدن `jira==3.8.0`

### Documentation

1. **`JIRA_INTEGRATION.md`**
   - راهنمای کامل اتصال به Jira
   - شامل:
     - دریافت API Token
     - تنظیمات Backend
     - همگام‌سازی داده‌ها
     - تنظیم Webhook
     - نگاشت داده‌ها
     - عیب‌یابی

2. **`JIRA_QUICKSTART.md`**
   - راهنمای سریع 5 دقیقه‌ای

3. **`JIRA_SETUP_SUMMARY.md`**
   - این فایل - خلاصه پیاده‌سازی

## 🔄 نگاشت داده‌ها

### Task ↔ Jira Issue
- Title ↔ Summary
- Description ↔ Description
- Status ↔ Status (todo, in_progress, in_review, done)
- Priority ↔ Priority (low, medium, high, urgent)
- Assignee ↔ Assignee
- Deadline ↔ Due Date
- Tags ↔ Labels

### Sprint ↔ Jira Sprint
- Title ↔ Name
- Description ↔ Goal
- Start Date ↔ Start Date
- End Date ↔ End Date

### Backlog ↔ Jira Issue (without Sprint)
- همان نگاشت Task، اما بدون Sprint

## 🎯 قابلیت‌های پیاده‌سازی شده

### ✅ کامل

- [x] اتصال به Jira Cloud
- [x] تست اتصال
- [x] ایجاد Issue در Jira
- [x] بروزرسانی Issue در Jira
- [x] حذف Issue از Jira
- [x] دریافت Issue از Jira
- [x] ایجاد Sprint در Jira
- [x] بروزرسانی Sprint در Jira
- [x] اضافه کردن Issues به Sprint
- [x] مدیریت Backlog
- [x] همگام‌سازی Comments
- [x] همگام‌سازی Tags/Labels
- [x] همگام‌سازی Priority
- [x] همگام‌سازی Status
- [x] همگام‌سازی Assignee
- [x] Webhook handler
- [x] Management commands
- [x] API endpoints
- [x] رابط کاربری
- [x] مستندات کامل

## 📋 مراحل بعدی برای شما

### 1. تنظیم اطلاعات Jira

فایل `backend/.env` را باز کنید و موارد زیر را تنظیم کنید:

```env
JIRA_URL=https://your-domain.atlassian.net  # ← آدرس Jira خود را وارد کنید
JIRA_PROJECT_KEY=PROJ  # ← کلید پروژه خود را وارد کنید
```

### 2. نصب کتابخانه Jira

```bash
cd backend
pip install jira==3.8.0
```

### 3. اجرای Migration

```bash
python manage.py migrate
```

### 4. تست اتصال

```bash
python test_jira_connection.py
```

### 5. همگام‌سازی اولیه

انتخاب کنید که می‌خواهید:

**A) داده‌های موجود را به Jira منتقل کنید:**
```bash
python manage.py jira_sync --direction to-jira
```

**B) داده‌ها را از Jira دریافت کنید:**
```bash
python manage.py jira_sync --direction from-jira
```

### 6. استفاده از رابط کاربری

1. سرور را اجرا کنید
2. به عنوان Admin وارد شوید
3. به صفحه "اتصال Jira" بروید
4. از دکمه‌های همگام‌سازی استفاده کنید

### 7. تنظیم Webhook (اختیاری)

برای همگام‌سازی خودکار، Webhook را در Jira تنظیم کنید:

**URL:** `https://your-domain.com/api/jira/webhook/`

**Events:**
- Issue Created
- Issue Updated
- Issue Deleted

## 🎓 نکات مهم

1. **API Token**: API Token شما در فایل `.env` ذخیره شده است. این Token را در جای امن نگه دارید.

2. **Project Key**: حتماً Project Key صحیح را وارد کنید. می‌توانید از URL پروژه Jira خود پیدا کنید.

3. **همگام‌سازی اولیه**: برای اولین بار، فقط یکی از گزینه‌های "to-jira" یا "from-jira" را انتخاب کنید.

4. **Webhook**: برای استفاده از Webhook در محیط توسعه، از ngrok استفاده کنید.

5. **Backup**: قبل از همگام‌سازی اولیه، از داده‌های خود backup بگیرید.

## 🆘 در صورت مشکل

1. فایل `JIRA_QUICKSTART.md` را مطالعه کنید
2. فایل `JIRA_INTEGRATION.md` را برای جزئیات بیشتر مطالعه کنید
3. از دستور `python test_jira_connection.py` برای تست استفاده کنید
4. لاگ‌های Django را بررسی کنید

## 🎉 تمام!

همه چیز آماده است! حالا می‌توانید پلتفرم خود را با Jira متصل کنید و از تمام قابلیت‌های Jira استفاده کنید.

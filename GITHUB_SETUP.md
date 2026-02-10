# راهنمای آپلود پروژه به GitHub

## 📋 پیش‌نیازها

1. حساب GitHub داشته باشید
2. Git روی سیستم نصب باشد
3. دسترسی به terminal/command prompt

## 🚀 مراحل آپلود

### مرحله 1: ایجاد Repository در GitHub

1. به https://github.com بروید و وارد شوید
2. روی دکمه **"+"** در گوشه بالا سمت راست کلیک کنید
3. **"New repository"** را انتخاب کنید
4. اطلاعات زیر را وارد کنید:
   - **Repository name**: `scrum-management-platform` (یا هر نام دیگری)
   - **Description**: `پلتفرم مدیریت اسکرام با اتصال به Jira`
   - **Public** یا **Private** را انتخاب کنید
   - ✅ **Add a README file** را انتخاب نکنید (چون ما README داریم)
   - ✅ **Add .gitignore** را انتخاب نکنید (چون ما .gitignore داریم)
5. روی **"Create repository"** کلیک کنید

### مرحله 2: آماده‌سازی پروژه

در terminal/command prompt، به پوشه پروژه بروید:

```bash
cd path/to/your/project
```

### مرحله 3: Initialize Git

```bash
git init
```

### مرحله 4: اضافه کردن فایل‌ها

```bash
git add .
```

### مرحله 5: اولین Commit

```bash
git commit -m "Initial commit: Scrum Management Platform with Jira Integration"
```

### مرحله 6: اضافه کردن Remote Repository

**نکته:** آدرس repository خود را از GitHub کپی کنید

```bash
git remote add origin https://github.com/YOUR_USERNAME/scrum-management-platform.git
```

**جایگزین کنید:**
- `YOUR_USERNAME` با نام کاربری GitHub خود
- `scrum-management-platform` با نام repository که انتخاب کردید

### مرحله 7: Push کردن کد

```bash
git branch -M main
git push -u origin main
```

## ✅ تمام!

پروژه شما الان روی GitHub است! 🎉

آدرس پروژه: `https://github.com/YOUR_USERNAME/scrum-management-platform`

## 🔐 مدیریت فایل‌های حساس

**مهم:** فایل `.env` حاوی اطلاعات حساس است و نباید به GitHub آپلود شود.

### بررسی .gitignore

فایل `.gitignore` را باز کنید و مطمئن شوید این خطوط وجود دارند:

```
# Environment variables
.env
*.env
.env.local

# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
venv/
env/

# Database
*.sqlite3
db.sqlite3

# Node
node_modules/
```

### اگر .env را اشتباهی push کردید

```bash
# حذف از Git (اما نگه داشتن در local)
git rm --cached backend/.env

# Commit
git commit -m "Remove .env from repository"

# Push
git push origin main
```

سپس فوراً API Token جدید در Jira بسازید!

## 📝 بروزرسانی README

یک README خوب برای پروژه خود بنویسید. نمونه:

```markdown
# پلتفرم مدیریت اسکرام

پلتفرم جامع مدیریت پروژه با قابلیت اتصال به Jira

## ویژگی‌ها

- ✅ مدیریت Tasks و Sprints
- ✅ تقویم و جلسات
- ✅ مدیریت Backlog
- ✅ اتصال کامل به Jira
- ✅ همگام‌سازی دو طرفه
- ✅ Webhook support
- ✅ رابط کاربری مدرن با React

## نصب و راه‌اندازی

مستندات کامل در فایل `QUICKSTART.md`

## اتصال به Jira

راهنمای کامل در فایل `JIRA_INTEGRATION.md`
```

## 🔄 بروزرسانی‌های بعدی

هر بار که تغییری دادید:

```bash
# اضافه کردن تغییرات
git add .

# Commit با پیام مناسب
git commit -m "توضیح تغییرات"

# Push
git push origin main
```

## 🌿 کار با Branches

برای توسعه ویژگی‌های جدید:

```bash
# ایجاد branch جدید
git checkout -b feature/new-feature

# کار روی feature...

# Commit
git add .
git commit -m "Add new feature"

# Push branch
git push origin feature/new-feature
```

سپس در GitHub یک Pull Request ایجاد کنید.

## 📊 GitHub Actions (اختیاری)

می‌توانید CI/CD برای پروژه تنظیم کنید:

1. در repository خود، به **Actions** بروید
2. یک workflow برای Python/Django انتخاب کنید
3. تنظیمات را customize کنید

## 🏷️ Releases

برای ایجاد نسخه‌های رسمی:

1. به **Releases** در GitHub بروید
2. **"Create a new release"** را کلیک کنید
3. یک tag (مثل `v1.0.0`) ایجاد کنید
4. توضیحات نسخه را بنویسید
5. منتشر کنید

## 🤝 مشارکت

اگر می‌خواهید دیگران در پروژه مشارکت کنند:

1. به **Settings** > **Collaborators** بروید
2. افراد را با username یا email دعوت کنید

## 📄 License

یک فایل LICENSE به پروژه اضافه کنید:

```bash
# مثال: MIT License
touch LICENSE
```

## 🔗 لینک‌های مفید

- [GitHub Docs](https://docs.github.com)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)
- [Markdown Guide](https://www.markdownguide.org/)

## ⚠️ نکات امنیتی

1. ❌ هرگز API Keys را commit نکنید
2. ❌ هرگز Passwords را commit نکنید
3. ✅ همیشه از .gitignore استفاده کنید
4. ✅ از GitHub Secrets برای CI/CD استفاده کنید
5. ✅ فایل .env.example را commit کنید (بدون مقادیر واقعی)

## 🆘 مشکلات رایج

### خطا: "remote origin already exists"

```bash
git remote remove origin
git remote add origin YOUR_REPO_URL
```

### خطا: "failed to push some refs"

```bash
git pull origin main --rebase
git push origin main
```

### خطا: "Permission denied"

از HTTPS به جای SSH استفاده کنید یا SSH key تنظیم کنید.

## 📞 پشتیبانی

اگر مشکلی داشتید:
1. Issues را در GitHub بررسی کنید
2. یک Issue جدید ایجاد کنید
3. از Stack Overflow کمک بگیرید

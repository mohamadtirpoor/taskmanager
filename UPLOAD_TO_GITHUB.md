# 📤 راهنمای آپلود به GitHub

## روش 1: استفاده از اسکریپت خودکار (ساده‌ترین روش) ⭐

### Windows:

```cmd
setup_github.bat
```

### Linux/Mac:

```bash
chmod +x setup_github.sh
./setup_github.sh
```

اسکریپت از شما آدرس repository را می‌پرسد و بقیه کارها را خودکار انجام می‌دهد!

---

## روش 2: دستی (قدم به قدم)

### مرحله 1: ایجاد Repository در GitHub

1. به https://github.com بروید
2. روی **"+"** کلیک کنید → **"New repository"**
3. اطلاعات را وارد کنید:
   - **Name**: `scrum-management-platform`
   - **Description**: `پلتفرم مدیریت اسکرام با اتصال به Jira`
   - **Public** یا **Private**
   - ❌ README, .gitignore, License را انتخاب نکنید
4. **"Create repository"** را کلیک کنید

### مرحله 2: آماده‌سازی پروژه

```bash
# رفتن به پوشه پروژه
cd path/to/your/project

# Initialize Git
git init

# اضافه کردن همه فایل‌ها
git add .

# اولین commit
git commit -m "Initial commit: Scrum Management Platform with Jira Integration"
```

### مرحله 3: اتصال به GitHub

```bash
# اضافه کردن remote (آدرس repository خود را جایگزین کنید)
git remote add origin https://github.com/YOUR_USERNAME/scrum-management-platform.git

# تغییر نام branch به main
git branch -M main

# Push کردن
git push -u origin main
```

### مرحله 4: تأیید

به آدرس repository خود بروید و بررسی کنید که همه فایل‌ها آپلود شده‌اند.

---

## ⚠️ نکات مهم قبل از آپلود

### 1. بررسی فایل .env

**مهم:** مطمئن شوید فایل `.env` در `.gitignore` است!

```bash
# بررسی کنید
cat .gitignore | grep .env
```

باید این خطوط را ببینید:
```
.env
*.env
backend/.env
```

### 2. حذف فایل‌های حساس

اگر اشتباهی `.env` را commit کردید:

```bash
# حذف از Git (اما نگه داشتن در local)
git rm --cached backend/.env

# Commit
git commit -m "Remove .env from repository"

# Push
git push origin main
```

**سپس فوراً API Token جدید در Jira بسازید!**

### 3. بررسی فایل‌های بزرگ

```bash
# پیدا کردن فایل‌های بزرگ‌تر از 10MB
find . -type f -size +10M
```

GitHub فایل‌های بزرگ‌تر از 100MB را قبول نمی‌کند.

---

## 📝 بعد از آپلود

### 1. بروزرسانی README

فایل `README_GITHUB.md` را به `README.md` تغییر نام دهید:

```bash
mv README_GITHUB.md README.md
git add README.md
git commit -m "Update README"
git push
```

### 2. اضافه کردن Topics

در GitHub:
1. به repository بروید
2. روی ⚙️ **Settings** کلیک کنید
3. در بخش **Topics** این موارد را اضافه کنید:
   - `django`
   - `react`
   - `jira`
   - `scrum`
   - `project-management`
   - `tailwindcss`
   - `python`
   - `javascript`

### 3. تنظیم Description

در صفحه اصلی repository:
1. روی ⚙️ کنار **About** کلیک کنید
2. Description را اضافه کنید:
   ```
   پلتفرم جامع مدیریت اسکرام با قابلیت همگام‌سازی کامل با Jira
   ```
3. Website را اضافه کنید (اگر دارید)

### 4. ایجاد Branch Protection Rules (اختیاری)

برای پروژه‌های تیمی:
1. **Settings** → **Branches**
2. **Add rule** برای `main`
3. فعال کنید:
   - ✅ Require pull request reviews
   - ✅ Require status checks to pass

---

## 🔄 بروزرسانی‌های بعدی

هر بار که تغییری دادید:

```bash
# مشاهده تغییرات
git status

# اضافه کردن تغییرات
git add .

# یا فقط فایل‌های خاص
git add backend/api/views.py

# Commit با پیام مناسب
git commit -m "Add new feature: ..."

# Push
git push origin main
```

### پیام‌های Commit خوب:

```bash
git commit -m "feat: Add Jira webhook support"
git commit -m "fix: Fix task sync issue"
git commit -m "docs: Update README"
git commit -m "refactor: Improve sync service"
git commit -m "test: Add tests for Jira integration"
```

---

## 🌿 کار با Branches

### ایجاد Feature Branch

```bash
# ایجاد و رفتن به branch جدید
git checkout -b feature/new-feature

# کار روی feature...

# Commit
git add .
git commit -m "Add new feature"

# Push branch
git push origin feature/new-feature
```

### Merge کردن

در GitHub:
1. به **Pull requests** بروید
2. **New pull request** را کلیک کنید
3. Branch خود را انتخاب کنید
4. توضیحات را بنویسید
5. **Create pull request**
6. بعد از review، **Merge** کنید

---

## 🐛 عیب‌یابی

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

**راه‌حل 1:** استفاده از Personal Access Token

1. به https://github.com/settings/tokens بروید
2. **Generate new token (classic)** را کلیک کنید
3. Scopes را انتخاب کنید: `repo`
4. Token را کپی کنید
5. هنگام push، به جای password از token استفاده کنید

**راه‌حل 2:** استفاده از SSH

```bash
# تولید SSH key
ssh-keygen -t ed25519 -C "your-email@example.com"

# کپی کردن public key
cat ~/.ssh/id_ed25519.pub

# اضافه کردن به GitHub:
# Settings → SSH and GPG keys → New SSH key

# تغییر remote به SSH
git remote set-url origin git@github.com:YOUR_USERNAME/scrum-management-platform.git
```

### خطا: "large files"

برای فایل‌های بزرگ از Git LFS استفاده کنید:

```bash
# نصب Git LFS
git lfs install

# Track کردن فایل‌های بزرگ
git lfs track "*.zip"
git lfs track "*.mp4"

# Commit و Push
git add .gitattributes
git commit -m "Add Git LFS"
git push
```

---

## 📊 GitHub Actions (CI/CD)

برای تست خودکار:

1. در repository، **Actions** را کلیک کنید
2. **New workflow** را انتخاب کنید
3. یک template برای Python/Django انتخاب کنید
4. فایل `.github/workflows/django.yml` ایجاد می‌شود
5. Customize کنید و commit کنید

---

## 🏷️ Releases

برای ایجاد نسخه رسمی:

```bash
# ایجاد tag
git tag -a v1.0.0 -m "First release"

# Push tag
git push origin v1.0.0
```

در GitHub:
1. **Releases** → **Create a new release**
2. Tag را انتخاب کنید
3. Release notes بنویسید
4. **Publish release**

---

## 📞 کمک بیشتر

- 📚 [GitHub Docs](https://docs.github.com)
- 📖 [Git Book](https://git-scm.com/book/en/v2)
- 🎓 [GitHub Learning Lab](https://lab.github.com/)
- 💬 [GitHub Community](https://github.community/)

---

## ✅ Checklist

قبل از آپلود:

- [ ] فایل `.env` در `.gitignore` است
- [ ] فایل `db.sqlite3` در `.gitignore` است
- [ ] `node_modules/` در `.gitignore` است
- [ ] `__pycache__/` در `.gitignore` است
- [ ] README کامل است
- [ ] LICENSE اضافه شده است
- [ ] .env.example موجود است (بدون مقادیر واقعی)

بعد از آپلود:

- [ ] Repository description تنظیم شده
- [ ] Topics اضافه شده
- [ ] README در GitHub به درستی نمایش داده می‌شود
- [ ] همه فایل‌ها آپلود شده‌اند
- [ ] فایل‌های حساس آپلود نشده‌اند

---

**موفق باشید! 🎉**

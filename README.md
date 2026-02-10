# 🚀 پلتفرم مدیریت اسکرام با اتصال Jira

<div dir="rtl">

یک پلتفرم جامع مدیریت پروژه اسکرام با قابلیت همگام‌سازی کامل با Jira

</div>

## ✨ ویژگی‌های کلیدی

- ✅ **مدیریت Tasks**: ایجاد، ویرایش و پیگیری تسک‌ها با اولویت‌بندی
- ✅ **مدیریت Sprints**: برنامه‌ریزی و مدیریت اسپرینت‌ها
- ✅ **Backlog Management**: مدیریت بک‌لاگ محصول
- ✅ **تقویم هوشمند**: نمایش تسک‌ها و جلسات در تقویم
- ✅ **مدیریت جلسات**: برنامه‌ریزی و پیگیری جلسات تیم
- ✅ **اتصال کامل به Jira**: همگام‌سازی دو طرفه با Jira
- ✅ **Webhook Support**: دریافت خودکار تغییرات از Jira
- ✅ **رابط کاربری مدرن**: طراحی زیبا با React و Tailwind CSS
- ✅ **سیستم نوتیفیکیشن**: اعلان‌های real-time
- ✅ **مدیریت تیم**: کنترل دسترسی و نقش‌های کاربری

## 🏗️ معماری

### Backend
- **Framework**: Django 5.0.1
- **API**: Django REST Framework
- **Authentication**: JWT (Simple JWT)
- **Database**: SQLite (قابل تغییر به PostgreSQL)
- **Task Queue**: Celery + Redis
- **Jira Integration**: jira-python library

### Frontend
- **Framework**: React 18
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **HTTP Client**: Axios

## 📋 پیش‌نیازها

- Python 3.10+
- Node.js 18+
- Redis (برای Celery)
- Git

## 🚀 نصب و راه‌اندازی

### 1. Clone کردن پروژه

```bash
git clone https://github.com/YOUR_USERNAME/scrum-management-platform.git
cd scrum-management-platform
```

### 2. راه‌اندازی Backend

```bash
cd backend

# ایجاد virtual environment
python -m venv venv

# فعال‌سازی virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# نصب dependencies
pip install -r requirements.txt

# تنظیم فایل .env
cp .env.example .env
# فایل .env را ویرایش کنید

# اجرای migrations
python manage.py migrate

# ایجاد superuser
python manage.py createsuperuser

# اجرای سرور
python manage.py runserver
```

### 3. راه‌اندازی Frontend

```bash
cd frontend

# نصب dependencies
npm install

# تنظیم فایل .env
cp .env.example .env

# اجرای development server
npm run dev
```

### 4. دسترسی به برنامه

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/api
- **Django Admin**: http://localhost:8000/admin

## 🔗 اتصال به Jira

### مرحله 1: دریافت API Token

1. به https://id.atlassian.com/manage-profile/security/api-tokens بروید
2. "Create API token" را کلیک کنید
3. Token را کپی کنید

### مرحله 2: تنظیم فایل .env

```env
JIRA_URL=https://your-domain.atlassian.net
JIRA_EMAIL=your-email@example.com
JIRA_API_TOKEN=your-api-token
JIRA_PROJECT_KEY=YOUR_PROJECT_KEY
```

### مرحله 3: تست اتصال

```bash
cd backend
python test_jira_connection.py
```

### مرحله 4: همگام‌سازی

```bash
# انتقال داده‌ها به Jira
python manage.py jira_sync --direction to-jira

# دریافت داده‌ها از Jira
python manage.py jira_sync --direction from-jira
```

📚 **مستندات کامل**: [JIRA_INTEGRATION.md](JIRA_INTEGRATION.md)

## 📁 ساختار پروژه

```
.
├── backend/
│   ├── api/                    # API endpoints
│   ├── config/                 # تنظیمات Django
│   ├── core/                   # Models و business logic
│   │   ├── jira_integration.py # ماژول اتصال به Jira
│   │   ├── jira_sync.py        # سرویس همگام‌سازی
│   │   └── management/         # Management commands
│   ├── requirements.txt
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── components/         # کامپوننت‌های React
│   │   ├── pages/              # صفحات
│   │   ├── services/           # API services
│   │   └── context/            # Context providers
│   ├── package.json
│   └── vite.config.js
├── docker-compose.yml
├── JIRA_INTEGRATION.md         # راهنمای Jira
├── QUICKSTART.md               # راهنمای سریع
└── README.md
```

## 🐳 استفاده با Docker

```bash
# Build و اجرای containers
docker-compose up -d

# مشاهده logs
docker-compose logs -f

# توقف containers
docker-compose down
```

## 🧪 تست

### Backend Tests

```bash
cd backend
python manage.py test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login/` - ورود
- `POST /api/auth/refresh/` - تازه‌سازی token

### Tasks
- `GET /api/tasks/` - لیست تسک‌ها
- `POST /api/tasks/` - ایجاد تسک
- `GET /api/tasks/{id}/` - جزئیات تسک
- `PUT /api/tasks/{id}/` - ویرایش تسک
- `DELETE /api/tasks/{id}/` - حذف تسک

### Sprints
- `GET /api/sprints/` - لیست اسپرینت‌ها
- `POST /api/sprints/` - ایجاد اسپرینت
- `GET /api/sprints/{id}/progress/` - پیشرفت اسپرینت

### Jira Integration
- `GET /api/jira/test_connection/` - تست اتصال
- `POST /api/jira/sync_all_to_jira/` - همگام‌سازی به Jira
- `POST /api/jira/sync_all_from_jira/` - همگام‌سازی از Jira
- `GET /api/jira/sync_status/` - وضعیت همگام‌سازی

📚 **مستندات کامل API**: در حال آماده‌سازی

## 🔐 امنیت

- ✅ JWT Authentication
- ✅ CORS Protection
- ✅ CSRF Protection
- ✅ Role-based Access Control
- ✅ Environment Variables برای اطلاعات حساس
- ✅ SQL Injection Protection (Django ORM)

## 🤝 مشارکت

1. Fork کنید
2. یک branch جدید بسازید (`git checkout -b feature/amazing-feature`)
3. تغییرات را commit کنید (`git commit -m 'Add amazing feature'`)
4. Push کنید (`git push origin feature/amazing-feature`)
5. یک Pull Request باز کنید

## 📝 License

این پروژه تحت لایسنس MIT منتشر شده است - فایل [LICENSE](LICENSE) را برای جزئیات ببینید.

## 👥 نویسندگان

- **توسعه‌دهنده اصلی** - [Your Name](https://github.com/YOUR_USERNAME)

## 🙏 تشکر

- [Django](https://www.djangoproject.com/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Jira API](https://developer.atlassian.com/cloud/jira/platform/rest/v3/)

## 📞 پشتیبانی

اگر سوال یا مشکلی دارید:

- 📧 Email: your-email@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/YOUR_USERNAME/scrum-management-platform/issues)
- 📖 Documentation: [Wiki](https://github.com/YOUR_USERNAME/scrum-management-platform/wiki)

## 🗺️ Roadmap

- [ ] پشتیبانی از Subtasks
- [ ] Time Tracking
- [ ] Reports و Analytics
- [ ] Mobile App
- [ ] Integration با Slack
- [ ] Integration با Microsoft Teams
- [ ] Export به PDF/Excel
- [ ] Advanced Search و Filters

## 📸 Screenshots

### Dashboard
![Dashboard](docs/screenshots/dashboard.png)

### Tasks Management
![Tasks](docs/screenshots/tasks.png)

### Jira Integration
![Jira](docs/screenshots/jira.png)

---

<div align="center">

**ساخته شده با ❤️ برای تیم‌های اسکرام**

[⭐ Star این پروژه](https://github.com/YOUR_USERNAME/scrum-management-platform) | [🐛 گزارش باگ](https://github.com/YOUR_USERNAME/scrum-management-platform/issues) | [💡 درخواست ویژگی](https://github.com/YOUR_USERNAME/scrum-management-platform/issues)

</div>

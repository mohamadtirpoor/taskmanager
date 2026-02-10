# معماری سیستم

## نمای کلی

پلتفرم مدیریت تسک داده نگار اقتصاد یک وب‌اپلیکیشن Full-Stack با معماری API-based است که از الگوی Client-Server استفاده می‌کند.

```
┌─────────────────────────────────────────────────────────┐
│                      Frontend (React)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │Dashboard │  │  Tasks   │  │ Sprints  │  │Calendar │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
│                         │                                │
│                    API Calls (Axios)                     │
└─────────────────────────┬───────────────────────────────┘
                          │ HTTP/REST
                          │ JWT Auth
┌─────────────────────────▼───────────────────────────────┐
│                   Backend (Django)                       │
│  ┌──────────────────────────────────────────────────┐   │
│  │              Django REST Framework                │   │
│  │  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐ │   │
│  │  │ Users  │  │ Tasks  │  │Sprints │  │  AI    │ │   │
│  │  │  API   │  │  API   │  │  API   │  │  API   │ │   │
│  │  └────────┘  └────────┘  └────────┘  └────────┘ │   │
│  └──────────────────────────────────────────────────┘   │
│                         │                                │
│  ┌──────────────────────▼──────────────────────────┐   │
│  │              Business Logic Layer                │   │
│  │  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐ │   │
│  │  │ User   │  │ Task   │  │Sprint  │  │  AI    │ │   │
│  │  │Service │  │Service │  │Service │  │Service │ │   │
│  │  └────────┘  └────────┘  └────────┘  └────────┘ │   │
│  └──────────────────────────────────────────────────┘   │
│                         │                                │
│  ┌──────────────────────▼──────────────────────────┐   │
│  │                 Data Layer                       │   │
│  │  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐ │   │
│  │  │  User  │  │  Task  │  │ Sprint │  │ Notif  │ │   │
│  │  │ Model  │  │ Model  │  │ Model  │  │ Model  │ │   │
│  │  └────────┘  └────────┘  └────────┘  └────────┘ │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────┬───────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────┐
│                    Database (PostgreSQL)                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │  users   │  │  tasks   │  │ sprints  │  │  notif  │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
└─────────────────────────────────────────────────────────┘
```

## لایه‌های معماری

### 1. Frontend Layer (Presentation)

**تکنولوژی:** React 18 + Vite

**مسئولیت‌ها:**
- نمایش UI/UX
- مدیریت state با Context API
- ارتباط با Backend از طریق API
- Routing و Navigation

**ساختار:**
```
frontend/
├── src/
│   ├── components/      # کامپوننت‌های قابل استفاده مجدد
│   │   ├── Layout.jsx
│   │   ├── TaskCard.jsx
│   │   └── AIAssistant.jsx
│   ├── pages/          # صفحات اصلی
│   │   ├── Dashboard.jsx
│   │   ├── Tasks.jsx
│   │   ├── Sprints.jsx
│   │   └── Calendar.jsx
│   ├── context/        # React Context
│   │   └── AuthContext.jsx
│   ├── services/       # API calls
│   │   └── api.js
│   └── App.jsx
└── package.json
```

### 2. API Layer (Backend Interface)

**تکنولوژی:** Django REST Framework

**مسئولیت‌ها:**
- دریافت و پردازش درخواست‌های HTTP
- احراز هویت و مجوزدهی
- Serialization/Deserialization
- Validation
- Error Handling

**Endpoints:**
```
/api/auth/login/          POST   - ورود
/api/auth/refresh/        POST   - تازه‌سازی توکن
/api/users/               GET    - لیست کاربران
/api/users/me/            GET    - اطلاعات کاربر جاری
/api/tasks/               GET    - لیست تسک‌ها
/api/tasks/               POST   - ایجاد تسک
/api/tasks/{id}/          GET    - جزئیات تسک
/api/tasks/{id}/          PUT    - ویرایش تسک
/api/tasks/{id}/          DELETE - حذف تسک
/api/tasks/today/         GET    - تسک‌های امروز
/api/tasks/upcoming/      GET    - تسک‌های نزدیک
/api/tasks/overdue/       GET    - تسک‌های عقب افتاده
/api/sprints/             GET    - لیست اسپرینت‌ها
/api/sprints/             POST   - ایجاد اسپرینت
/api/sprints/{id}/        GET    - جزئیات اسپرینت
/api/sprints/{id}/progress/ GET  - پیشرفت اسپرینت
/api/notifications/       GET    - لیست اعلان‌ها
/api/ai/ask/              POST   - پرسش از دستیار
```

### 3. Business Logic Layer

**تکنولوژی:** Django Models & Services

**مسئولیت‌ها:**
- منطق کسب‌وکار
- قوانین و محدودیت‌ها
- محاسبات و پردازش‌ها
- یکپارچه‌سازی با سرویس‌های خارجی

**کامپوننت‌ها:**
- User Management
- Task Management
- Sprint Management
- Notification System
- AI Assistant

### 4. Data Layer

**تکنولوژی:** Django ORM

**مسئولیت‌ها:**
- تعریف مدل‌های داده
- روابط بین جداول
- Validation در سطح مدل
- Query optimization

**مدل‌های اصلی:**

```python
User
├── id (PK)
├── username
├── email
├── role (admin/scrum_master/team_member)
└── ...

Task
├── id (PK)
├── title
├── description
├── assignee (FK → User)
├── status (todo/in_progress/in_review/done)
├── priority (low/medium/high/urgent)
├── deadline
├── sprint (FK → Sprint)
└── created_by (FK → User)

Sprint
├── id (PK)
├── title
├── description
├── start_date
├── end_date
└── created_by (FK → User)

Notification
├── id (PK)
├── user (FK → User)
├── task (FK → Task)
├── type
├── message
└── is_read
```

### 5. Database Layer

**تکنولوژی:** PostgreSQL (Production) / SQLite (Development)

**مسئولیت‌ها:**
- ذخیره‌سازی داده
- تضمین یکپارچگی داده
- Transaction management
- Indexing و Optimization

## جریان داده (Data Flow)

### مثال: ایجاد تسک جدید

```
1. کاربر فرم را پر می‌کند
   └─> Frontend: TaskForm Component

2. ارسال درخواست به Backend
   └─> API Call: POST /api/tasks/
       Headers: Authorization: Bearer {token}
       Body: {title, description, assignee_id, ...}

3. احراز هویت
   └─> JWT Middleware
       ├─> Verify Token
       └─> Load User

4. Validation
   └─> TaskSerializer
       ├─> Validate Fields
       └─> Check Permissions

5. Business Logic
   └─> TaskViewSet.create()
       ├─> Create Task
       ├─> Create Notification
       └─> Log Activity

6. ذخیره در Database
   └─> Django ORM
       └─> INSERT INTO tasks ...

7. پاسخ به Frontend
   └─> Response: 201 Created
       Body: {id, title, ...}

8. بروزرسانی UI
   └─> Frontend: Update State
       └─> Re-render Component
```

## امنیت (Security Architecture)

### احراز هویت (Authentication)

```
┌──────────┐                    ┌──────────┐
│  Client  │                    │  Server  │
└────┬─────┘                    └────┬─────┘
     │                               │
     │  POST /api/auth/login/        │
     │  {username, password}         │
     ├──────────────────────────────>│
     │                               │
     │                          Verify
     │                          Credentials
     │                               │
     │  {access, refresh}            │
     │<──────────────────────────────┤
     │                               │
     │  GET /api/tasks/              │
     │  Authorization: Bearer token  │
     ├──────────────────────────────>│
     │                               │
     │                          Verify
     │                          JWT Token
     │                               │
     │  {tasks: [...]}               │
     │<──────────────────────────────┤
     │                               │
```

### مجوزدهی (Authorization)

```python
# Role-based Access Control
if user.role == 'admin':
    # دسترسی کامل
    queryset = Task.objects.all()
elif user.role == 'scrum_master':
    # دسترسی به تسک‌های تیم
    queryset = Task.objects.filter(sprint__created_by=user)
else:
    # فقط تسک‌های خود
    queryset = Task.objects.filter(assignee=user)
```

## مقیاس‌پذیری (Scalability)

### Horizontal Scaling

```
                    ┌──────────────┐
                    │ Load Balancer│
                    └──────┬───────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────▼────┐       ┌────▼────┐       ┌────▼────┐
   │Backend 1│       │Backend 2│       │Backend 3│
   └────┬────┘       └────┬────┘       └────┬────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
                    ┌──────▼───────┐
                    │   Database   │
                    │  (Primary)   │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │   Database   │
                    │  (Replica)   │
                    └──────────────┘
```

### Caching Strategy

```
┌─────────┐
│ Client  │
└────┬────┘
     │
     │ GET /api/tasks/
     ▼
┌─────────┐
│  Redis  │ ◄─── Cache Hit (Fast)
│  Cache  │
└────┬────┘
     │ Cache Miss
     ▼
┌─────────┐
│Backend  │
└────┬────┘
     │
     ▼
┌─────────┐
│Database │
└─────────┘
```

## توسعه آینده

### نسخه موبایل

```
┌──────────────┐
│React Native  │
│   Mobile     │
└──────┬───────┘
       │
       │ Same API
       ▼
┌──────────────┐
│   Backend    │
│     API      │
└──────────────┘
```

### Microservices (آینده)

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│   Task   │     │  Sprint  │     │   AI     │
│ Service  │     │ Service  │     │ Service  │
└────┬─────┘     └────┬─────┘     └────┬─────┘
     │                │                │
     └────────────────┼────────────────┘
                      │
              ┌───────▼────────┐
              │  API Gateway   │
              └───────┬────────┘
                      │
              ┌───────▼────────┐
              │    Frontend    │
              └────────────────┘
```

## نکات طراحی

### 1. Separation of Concerns
- Frontend فقط UI
- Backend فقط Business Logic
- Database فقط Data Storage

### 2. API-First Design
- همه عملیات از طریق API
- آماده برای Mobile
- قابل یکپارچه‌سازی

### 3. Stateless Backend
- هر درخواست مستقل است
- مقیاس‌پذیری آسان
- Load Balancing ساده

### 4. Security by Design
- JWT Authentication
- Role-based Access
- Input Validation
- SQL Injection Prevention

### 5. Performance Optimization
- Database Indexing
- Query Optimization
- Caching Strategy
- Lazy Loading

## ابزارهای مانیتورینگ

```
┌──────────────────────────────────────┐
│         Application Layer            │
│  ┌────────┐  ┌────────┐  ┌────────┐ │
│  │ Sentry │  │  Logs  │  │Metrics │ │
│  └────────┘  └────────┘  └────────┘ │
└──────────────────────────────────────┘
```

## مستندات بیشتر

- [API Documentation](API.md)
- [Database Schema](DATABASE.md)
- [Security Guide](SECURITY.md)
- [Deployment Guide](DEPLOYMENT.md)

# راهنمای استفاده از Docker

## نصب Docker

### Windows
1. [Docker Desktop](https://www.docker.com/products/docker-desktop/) را دانلود و نصب کنید
2. Docker Desktop را اجرا کنید

### Linux
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

## راه‌اندازی با Docker Compose

### اجرای کامل پروژه

```bash
# ساخت و اجرای تمام سرویس‌ها
docker-compose up -d

# مشاهده لاگ‌ها
docker-compose logs -f

# توقف سرویس‌ها
docker-compose down
```

### اجرای مایگریشن‌ها

```bash
docker-compose exec backend python manage.py migrate
```

### ایجاد کاربر ادمین

```bash
docker-compose exec backend python manage.py createsuperuser
```

### ایجاد داده‌های نمونه

```bash
docker-compose exec backend python manage.py create_sample_data
```

## دسترسی به سرویس‌ها

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- Admin Panel: http://localhost:8000/admin
- PostgreSQL: localhost:5432
- Redis: localhost:6379

## دستورات مفید

### مشاهده وضعیت سرویس‌ها

```bash
docker-compose ps
```

### ری‌استارت سرویس خاص

```bash
docker-compose restart backend
docker-compose restart frontend
```

### مشاهده لاگ سرویس خاص

```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

### ورود به shell سرویس

```bash
# Django shell
docker-compose exec backend python manage.py shell

# Bash shell
docker-compose exec backend bash
```

### پاک کردن همه چیز

```bash
# توقف و حذف کانتینرها
docker-compose down

# حذف volumes (دیتابیس پاک می‌شود!)
docker-compose down -v

# حذف images
docker-compose down --rmi all
```

## Build Production

### ساخت image های production

```bash
# Backend
cd backend
docker build -t taskmanager-backend:latest .

# Frontend
cd frontend
docker build -t taskmanager-frontend:latest .
```

### اجرا در production

```bash
# Backend
docker run -d \
  -p 8000:8000 \
  -e DEBUG=False \
  -e SECRET_KEY=your-secret-key \
  -e DATABASE_URL=postgresql://user:pass@host:5432/db \
  taskmanager-backend:latest

# Frontend
docker run -d \
  -p 80:80 \
  taskmanager-frontend:latest
```

## عیب‌یابی

### خطای اتصال به دیتابیس

```bash
# بررسی وضعیت PostgreSQL
docker-compose logs db

# ری‌استارت دیتابیس
docker-compose restart db
```

### خطای نصب پکیج‌ها

```bash
# ساخت مجدد images
docker-compose build --no-cache

# اجرای مجدد
docker-compose up -d
```

### مشکل در Frontend

```bash
# پاک کردن node_modules و نصب مجدد
docker-compose exec frontend rm -rf node_modules
docker-compose exec frontend npm install
docker-compose restart frontend
```

## نکات مهم

1. **حجم داده‌ها**: داده‌های دیتابیس در volume ذخیره می‌شوند و با `docker-compose down` پاک نمی‌شوند
2. **Development**: از `docker-compose.yml` برای توسعه استفاده کنید
3. **Production**: برای production از Dockerfile های جداگانه و تنظیمات امنیتی استفاده کنید
4. **Backup**: قبل از `docker-compose down -v` حتما از دیتابیس backup بگیرید

## Backup و Restore

### Backup دیتابیس

```bash
docker-compose exec db pg_dump -U postgres taskmanager > backup.sql
```

### Restore دیتابیس

```bash
docker-compose exec -T db psql -U postgres taskmanager < backup.sql
```

## مانیتورینگ

### مشاهده استفاده از منابع

```bash
docker stats
```

### مشاهده حجم volumes

```bash
docker volume ls
docker volume inspect taskmanager_postgres_data
```

## Docker Hub

### Push به Docker Hub

```bash
# Login
docker login

# Tag
docker tag taskmanager-backend:latest username/taskmanager-backend:latest
docker tag taskmanager-frontend:latest username/taskmanager-frontend:latest

# Push
docker push username/taskmanager-backend:latest
docker push username/taskmanager-frontend:latest
```

### Pull از Docker Hub

```bash
docker pull username/taskmanager-backend:latest
docker pull username/taskmanager-frontend:latest
```

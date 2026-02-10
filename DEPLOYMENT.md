# راهنمای استقرار (Deployment)

## استقرار Backend

### 1. تنظیمات Production

در فایل `backend/config/settings.py`:

```python
DEBUG = False
ALLOWED_HOSTS = ['yourdomain.com', 'www.yourdomain.com']

# Database - PostgreSQL
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'taskmanager',
        'USER': 'postgres',
        'PASSWORD': 'your-password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

# Static files
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATIC_URL = '/static/'
```

### 2. نصب Gunicorn

```bash
pip install gunicorn
```

### 3. اجرا با Gunicorn

```bash
gunicorn config.wsgi:application --bind 0.0.0.0:8000
```

### 4. استفاده از Nginx

فایل کانفیگ Nginx:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /static/ {
        alias /path/to/backend/staticfiles/;
    }

    location / {
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
}
```

## استقرار Frontend

### 1. Build Production

```bash
cd frontend
npm run build
```

### 2. تنظیم API URL

در فایل `frontend/src/services/api.js`:

```javascript
const api = axios.create({
  baseURL: 'https://yourdomain.com/api',
  // ...
})
```

### 3. آپلود فایل‌ها

فایل‌های موجود در `frontend/dist` را روی سرور آپلود کنید.

## استقرار با Docker

### 1. Dockerfile برای Backend

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]
```

### 2. Dockerfile برای Frontend

```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
```

### 3. docker-compose.yml

```yaml
version: '3.8'

services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: taskmanager
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    command: gunicorn config.wsgi:application --bind 0.0.0.0:8000
    volumes:
      - ./backend:/app
    ports:
      - "8000:8000"
    depends_on:
      - db
    environment:
      DATABASE_URL: postgresql://postgres:password@db:5432/taskmanager

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

### 4. اجرا با Docker Compose

```bash
docker-compose up -d
```

## استقرار روی سرویس‌های Cloud

### Heroku

```bash
# نصب Heroku CLI
heroku login
heroku create your-app-name

# Backend
cd backend
git init
heroku git:remote -a your-app-name
git add .
git commit -m "Initial commit"
git push heroku master

# تنظیم دیتابیس
heroku addons:create heroku-postgresql:hobby-dev
heroku run python manage.py migrate
```

### Railway

1. به Railway.app بروید
2. پروژه جدید ایجاد کنید
3. Backend و Frontend را به صورت جداگانه دیپلوی کنید
4. PostgreSQL را اضافه کنید
5. متغیرهای محیطی را تنظیم کنید

### DigitalOcean

1. یک Droplet ایجاد کنید (Ubuntu 22.04)
2. SSH به سرور
3. نصب Python، Node.js، PostgreSQL، Nginx
4. کلون کردن پروژه
5. تنظیم Gunicorn و Nginx
6. تنظیم SSL با Let's Encrypt

## چک‌لیست قبل از استقرار

- [ ] DEBUG = False
- [ ] SECRET_KEY تصادفی و امن
- [ ] ALLOWED_HOSTS تنظیم شده
- [ ] دیتابیس Production (PostgreSQL)
- [ ] Static files جمع‌آوری شده
- [ ] CORS تنظیم شده
- [ ] SSL نصب شده
- [ ] Backup دیتابیس تنظیم شده
- [ ] Monitoring تنظیم شده
- [ ] متغیرهای محیطی امن

## نکات امنیتی

1. همیشه از HTTPS استفاده کنید
2. SECRET_KEY را در متغیرهای محیطی نگه دارید
3. دسترسی دیتابیس را محدود کنید
4. از Firewall استفاده کنید
5. به‌روزرسانی‌های امنیتی را نصب کنید
6. از Rate Limiting استفاده کنید
7. لاگ‌ها را مانیتور کنید

## Monitoring و Logging

### Sentry (برای Error Tracking)

```bash
pip install sentry-sdk
```

```python
import sentry_sdk

sentry_sdk.init(
    dsn="your-sentry-dsn",
    traces_sample_rate=1.0,
)
```

### Logging

```python
LOGGING = {
    'version': 1,
    'handlers': {
        'file': {
            'class': 'logging.FileHandler',
            'filename': 'debug.log',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'INFO',
        },
    },
}
```

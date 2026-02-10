FROM python:3.11-slim

WORKDIR /app

# نصب وابستگی‌های سیستمی
RUN apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# کپی و نصب پکیج‌های Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# کپی کد پروژه
COPY . .

# جمع‌آوری فایل‌های static
RUN python manage.py collectstatic --noinput || true

# اجرای مایگریشن‌ها
CMD python manage.py migrate && \
    python manage.py runserver 0.0.0.0:8000

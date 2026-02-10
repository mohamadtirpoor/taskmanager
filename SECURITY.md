# سیاست امنیتی

## نسخه‌های پشتیبانی شده

| نسخه | پشتیبانی امنیتی |
| --- | --- |
| 1.0.x | ✅ |

## گزارش آسیب‌پذیری

اگر آسیب‌پذیری امنیتی پیدا کردید، لطفاً به صورت خصوصی گزارش دهید.

### چگونه گزارش کنیم؟

1. **به صورت عمومی Issue ایجاد نکنید**
2. ایمیل به: security@dadeh-negar.com
3. شامل:
   - توضیحات کامل آسیب‌پذیری
   - مراحل بازتولید
   - تاثیر احتمالی
   - راه‌حل پیشنهادی (اختیاری)

### زمان پاسخ

- تایید دریافت: 24 ساعت
- ارزیابی اولیه: 72 ساعت
- رفع مشکل: بسته به شدت

## بهترین شیوه‌های امنیتی

### برای توسعه‌دهندگان

1. **هرگز اطلاعات حساس را commit نکنید**
   - کلیدهای API
   - رمزهای عبور
   - توکن‌ها

2. **از متغیرهای محیطی استفاده کنید**
   ```python
   SECRET_KEY = os.environ.get('SECRET_KEY')
   ```

3. **Dependency ها را به‌روز نگه دارید**
   ```bash
   pip list --outdated
   npm outdated
   ```

4. **تست‌های امنیتی بنویسید**

### برای استقرار

1. **DEBUG را False کنید**
   ```python
   DEBUG = False
   ```

2. **HTTPS استفاده کنید**

3. **ALLOWED_HOSTS را محدود کنید**
   ```python
   ALLOWED_HOSTS = ['yourdomain.com']
   ```

4. **از Firewall استفاده کنید**

5. **دسترسی دیتابیس را محدود کنید**

6. **لاگ‌ها را مانیتور کنید**

7. **Backup منظم بگیرید**

## چک‌لیست امنیتی

### Backend

- [ ] DEBUG = False در production
- [ ] SECRET_KEY تصادفی و امن
- [ ] ALLOWED_HOSTS تنظیم شده
- [ ] CORS محدود به دامنه‌های مشخص
- [ ] JWT با expiration مناسب
- [ ] Rate limiting فعال
- [ ] SQL Injection prevention
- [ ] XSS protection
- [ ] CSRF protection
- [ ] Password hashing قوی
- [ ] HTTPS اجباری
- [ ] Security headers تنظیم شده

### Frontend

- [ ] API keys در environment variables
- [ ] XSS prevention
- [ ] Input validation
- [ ] Secure cookie settings
- [ ] Content Security Policy
- [ ] HTTPS اجباری

### Database

- [ ] رمز عبور قوی
- [ ] دسترسی محدود
- [ ] Backup منظم
- [ ] Encryption at rest
- [ ] Connection pooling

### Infrastructure

- [ ] Firewall فعال
- [ ] SSH key-based authentication
- [ ] Fail2ban نصب شده
- [ ] Monitoring فعال
- [ ] Log rotation
- [ ] Automatic updates

## ابزارهای امنیتی

### Python

```bash
# بررسی آسیب‌پذیری‌ها
pip install safety
safety check

# بررسی کد
pip install bandit
bandit -r backend/
```

### JavaScript

```bash
# بررسی آسیب‌پذیری‌ها
npm audit

# رفع خودکار
npm audit fix
```

### Docker

```bash
# اسکن image
docker scan taskmanager-backend:latest
```

## منابع

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Django Security](https://docs.djangoproject.com/en/5.0/topics/security/)
- [React Security](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml)

## تشکر

از تمام کسانی که به بهبود امنیت این پروژه کمک می‌کنند، تشکر می‌کنیم.

---

آخرین بروزرسانی: 2024-02-08

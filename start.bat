@echo off
echo ====================================
echo پلتفرم مدیریت تسک داده نگار اقتصاد
echo ====================================
echo.

echo [1/3] راه‌اندازی Backend...
cd backend
if not exist venv (
    echo ایجاد محیط مجازی...
    python -m venv venv
)

call venv\Scripts\activate
echo نصب پکیج‌ها...
pip install -r requirements.txt -q

if not exist db.sqlite3 (
    echo ایجاد دیتابیس...
    python manage.py migrate
    echo.
    echo لطفا اطلاعات کاربر ادمین را وارد کنید:
    python manage.py createsuperuser
)

echo.
echo [2/3] راه‌اندازی Frontend...
cd ..\frontend
if not exist node_modules (
    echo نصب پکیج‌ها...
    call npm install
)

echo.
echo [3/3] اجرای سرورها...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo.

start cmd /k "cd ..\backend && venv\Scripts\activate && python manage.py runserver"
timeout /t 3 /nobreak >nul
start cmd /k "npm run dev"

echo.
echo سرورها در حال اجرا هستند!
echo برای ورود به سیستم به http://localhost:5173 بروید
pause

# PowerShell Setup Script

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "پلتفرم مدیریت تسک داده نگار اقتصاد" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# بررسی Python
Write-Host "[1/5] بررسی Python..." -ForegroundColor Blue
if (!(Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "Python نصب نیست. لطفا Python 3.10+ را نصب کنید." -ForegroundColor Red
    exit 1
}
Write-Host "✓ Python نصب است" -ForegroundColor Green

# بررسی Node.js
Write-Host "[2/5] بررسی Node.js..." -ForegroundColor Blue
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Node.js نصب نیست. لطفا Node.js 18+ را نصب کنید." -ForegroundColor Red
    exit 1
}
Write-Host "✓ Node.js نصب است" -ForegroundColor Green

# نصب Backend
Write-Host "[3/5] نصب Backend..." -ForegroundColor Blue
Set-Location backend

if (!(Test-Path "venv")) {
    Write-Host "ایجاد محیط مجازی..."
    python -m venv venv
}

.\venv\Scripts\Activate.ps1
Write-Host "نصب پکیج‌های Python..."
pip install -r requirements.txt -q

if (!(Test-Path "db.sqlite3")) {
    Write-Host "ایجاد دیتابیس..."
    python manage.py migrate
    
    Write-Host ""
    Write-Host "لطفا اطلاعات کاربر ادمین را وارد کنید:"
    python manage.py createsuperuser
}

Set-Location ..
Write-Host "✓ Backend نصب شد" -ForegroundColor Green

# نصب Frontend
Write-Host "[4/5] نصب Frontend..." -ForegroundColor Blue
Set-Location frontend

if (!(Test-Path "node_modules")) {
    Write-Host "نصب پکیج‌های Node.js..."
    npm install
}

Set-Location ..
Write-Host "✓ Frontend نصب شد" -ForegroundColor Green

# ایجاد داده‌های نمونه
Write-Host "[5/5] ایجاد داده‌های نمونه..." -ForegroundColor Blue
Set-Location backend
.\venv\Scripts\Activate.ps1
python manage.py create_sample_data
Set-Location ..
Write-Host "✓ داده‌های نمونه ایجاد شد" -ForegroundColor Green

Write-Host ""
Write-Host "====================================" -ForegroundColor Green
Write-Host "✅ نصب با موفقیت انجام شد!" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green
Write-Host ""
Write-Host "برای اجرای پروژه:"
Write-Host "  Backend:  cd backend; .\venv\Scripts\Activate.ps1; python manage.py runserver"
Write-Host "  Frontend: cd frontend; npm run dev"
Write-Host ""
Write-Host "یا با Docker:"
Write-Host "  docker-compose up -d"
Write-Host ""
Write-Host "اطلاعات ورود:"
Write-Host "  ادمین: admin / admin"
Write-Host "  اسکرام مستر: scrum / scrum123"
Write-Host "  اعضای تیم: ali, sara, reza / password123"
Write-Host ""

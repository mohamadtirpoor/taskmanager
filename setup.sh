#!/bin/bash

echo "===================================="
echo "پلتفرم مدیریت تسک داده نگار اقتصاد"
echo "===================================="
echo ""

# رنگ‌ها
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# بررسی Python
echo -e "${BLUE}[1/5] بررسی Python...${NC}"
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}Python نصب نیست. لطفا Python 3.10+ را نصب کنید.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Python نصب است${NC}"

# بررسی Node.js
echo -e "${BLUE}[2/5] بررسی Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js نصب نیست. لطفا Node.js 18+ را نصب کنید.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js نصب است${NC}"

# نصب Backend
echo -e "${BLUE}[3/5] نصب Backend...${NC}"
cd backend

if [ ! -d "venv" ]; then
    echo "ایجاد محیط مجازی..."
    python3 -m venv venv
fi

source venv/bin/activate
echo "نصب پکیج‌های Python..."
pip install -r requirements.txt -q

if [ ! -f "db.sqlite3" ]; then
    echo "ایجاد دیتابیس..."
    python manage.py migrate
    
    echo ""
    echo "لطفا اطلاعات کاربر ادمین را وارد کنید:"
    python manage.py createsuperuser
fi

cd ..
echo -e "${GREEN}✓ Backend نصب شد${NC}"

# نصب Frontend
echo -e "${BLUE}[4/5] نصب Frontend...${NC}"
cd frontend

if [ ! -d "node_modules" ]; then
    echo "نصب پکیج‌های Node.js..."
    npm install
fi

cd ..
echo -e "${GREEN}✓ Frontend نصب شد${NC}"

# ایجاد داده‌های نمونه
echo -e "${BLUE}[5/5] ایجاد داده‌های نمونه...${NC}"
cd backend
source venv/bin/activate
python manage.py create_sample_data
cd ..
echo -e "${GREEN}✓ داده‌های نمونه ایجاد شد${NC}"

echo ""
echo -e "${GREEN}===================================="
echo "✅ نصب با موفقیت انجام شد!"
echo "====================================${NC}"
echo ""
echo "برای اجرای پروژه:"
echo "  Backend:  cd backend && source venv/bin/activate && python manage.py runserver"
echo "  Frontend: cd frontend && npm run dev"
echo ""
echo "یا با Docker:"
echo "  docker-compose up -d"
echo ""
echo "اطلاعات ورود:"
echo "  ادمین: admin / admin"
echo "  اسکرام مستر: scrum / scrum123"
echo "  اعضای تیم: ali, sara, reza / password123"
echo ""

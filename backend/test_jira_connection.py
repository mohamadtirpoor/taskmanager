"""
اسکریپت تست اتصال به Jira
این فایل را برای تست سریع اتصال به Jira اجرا کنید
"""
import os
import sys
import django

# تنظیم Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from core.jira_integration import JiraIntegration
from django.conf import settings


def test_connection():
    """تست اتصال به Jira"""
    print("=" * 60)
    print("تست اتصال به Jira")
    print("=" * 60)
    
    # نمایش تنظیمات
    print(f"\n📋 تنظیمات:")
    print(f"   URL: {settings.JIRA_URL}")
    print(f"   Email: {settings.JIRA_EMAIL}")
    print(f"   Project Key: {settings.JIRA_PROJECT_KEY}")
    print(f"   API Token: {'*' * 20}{settings.JIRA_API_TOKEN[-10:] if settings.JIRA_API_TOKEN else 'NOT SET'}")
    
    # بررسی تنظیمات
    if not settings.JIRA_URL or settings.JIRA_URL == 'https://your-domain.atlassian.net':
        print("\n❌ خطا: JIRA_URL تنظیم نشده است")
        print("   لطفاً در فایل .env مقدار JIRA_URL را تنظیم کنید")
        return False
    
    if not settings.JIRA_EMAIL:
        print("\n❌ خطا: JIRA_EMAIL تنظیم نشده است")
        print("   لطفاً در فایل .env مقدار JIRA_EMAIL را تنظیم کنید")
        return False
    
    if not settings.JIRA_API_TOKEN:
        print("\n❌ خطا: JIRA_API_TOKEN تنظیم نشده است")
        print("   لطفاً در فایل .env مقدار JIRA_API_TOKEN را تنظیم کنید")
        return False
    
    if not settings.JIRA_PROJECT_KEY:
        print("\n❌ خطا: JIRA_PROJECT_KEY تنظیم نشده است")
        print("   لطفاً در فایل .env مقدار JIRA_PROJECT_KEY را تنظیم کنید")
        return False
    
    # تست اتصال
    print("\n🔄 در حال اتصال به Jira...")
    try:
        jira = JiraIntegration()
        success, message = jira.test_connection()
        
        if success:
            print(f"\n✅ {message}")
            
            # نمایش اطلاعات بیشتر
            print("\n📊 اطلاعات پروژه:")
            try:
                project = jira.jira.project(settings.JIRA_PROJECT_KEY)
                print(f"   نام: {project.name}")
                print(f"   کلید: {project.key}")
                print(f"   نوع: {project.projectTypeKey}")
                
                # نمایش تعداد Issues
                issues = jira.jira.search_issues(f'project = {settings.JIRA_PROJECT_KEY}', maxResults=0)
                print(f"   تعداد Issues: {issues.total}")
                
            except Exception as e:
                print(f"   ⚠️  نمی‌توان اطلاعات پروژه را دریافت کرد: {str(e)}")
            
            return True
        else:
            print(f"\n❌ {message}")
            return False
            
    except Exception as e:
        print(f"\n❌ خطا در اتصال: {str(e)}")
        print("\n💡 راهنمایی:")
        print("   1. بررسی کنید که URL صحیح است")
        print("   2. بررسی کنید که Email و API Token صحیح هستند")
        print("   3. بررسی کنید که به اینترنت متصل هستید")
        print("   4. بررسی کنید که API Token منقضی نشده است")
        return False


def test_project_access():
    """تست دسترسی به پروژه"""
    print("\n" + "=" * 60)
    print("تست دسترسی به پروژه")
    print("=" * 60)
    
    try:
        jira = JiraIntegration()
        
        # دریافت اطلاعات پروژه
        project = jira.jira.project(settings.JIRA_PROJECT_KEY)
        print(f"\n✅ دسترسی به پروژه '{project.name}' موفق بود")
        
        # دریافت لیست کاربران
        print("\n👥 کاربران پروژه:")
        users = jira.get_project_users()
        for user in users[:5]:  # نمایش 5 کاربر اول
            print(f"   - {user['name']} ({user['email']})")
        if len(users) > 5:
            print(f"   ... و {len(users) - 5} کاربر دیگر")
        
        return True
        
    except Exception as e:
        print(f"\n❌ خطا در دسترسی به پروژه: {str(e)}")
        return False


if __name__ == '__main__':
    print("\n🚀 شروع تست اتصال به Jira\n")
    
    # تست اتصال
    connection_ok = test_connection()
    
    if connection_ok:
        # تست دسترسی به پروژه
        test_project_access()
        
        print("\n" + "=" * 60)
        print("✅ همه تست‌ها موفق بودند!")
        print("=" * 60)
        print("\n💡 حالا می‌توانید از دستورات زیر استفاده کنید:")
        print("   python manage.py jira_sync --direction to-jira")
        print("   python manage.py jira_sync --direction from-jira")
        print("\n")
    else:
        print("\n" + "=" * 60)
        print("❌ تست اتصال ناموفق بود")
        print("=" * 60)
        print("\n💡 لطفاً تنظیمات را در فایل .env بررسی کنید")
        print("   مسیر فایل: backend/.env")
        print("\n")

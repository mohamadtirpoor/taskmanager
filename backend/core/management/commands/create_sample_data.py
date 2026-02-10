from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from core.models import User, Sprint, Task, Notification

class Command(BaseCommand):
    help = 'ایجاد داده‌های نمونه برای تست سیستم'

    def handle(self, *args, **kwargs):
        self.stdout.write('در حال ایجاد داده‌های نمونه...')

        # ایجاد کاربران
        admin = User.objects.filter(username='admin').first()
        if not admin:
            admin = User.objects.create_superuser(
                username='admin',
                email='admin@example.com',
                password='admin',
                first_name='مدیر',
                last_name='سیستم',
                role='admin'
            )
            self.stdout.write(self.style.SUCCESS('✓ کاربر ادمین ایجاد شد'))

        # ایجاد اسکرام مستر
        scrum_master, created = User.objects.get_or_create(
            username='scrum',
            defaults={
                'email': 'scrum@example.com',
                'first_name': 'محمد',
                'last_name': 'رضایی',
                'role': 'scrum_master'
            }
        )
        if created:
            scrum_master.set_password('scrum123')
            scrum_master.save()
            self.stdout.write(self.style.SUCCESS('✓ اسکرام مستر ایجاد شد'))

        # ایجاد اعضای تیم
        team_members = []
        members_data = [
            ('ali', 'علی', 'احمدی'),
            ('sara', 'سارا', 'محمدی'),
            ('reza', 'رضا', 'کریمی'),
        ]

        for username, first_name, last_name in members_data:
            member, created = User.objects.get_or_create(
                username=username,
                defaults={
                    'email': f'{username}@example.com',
                    'first_name': first_name,
                    'last_name': last_name,
                    'role': 'team_member'
                }
            )
            if created:
                member.set_password('password123')
                member.save()
                self.stdout.write(self.style.SUCCESS(f'✓ عضو تیم {first_name} {last_name} ایجاد شد'))
            team_members.append(member)

        # ایجاد اسپرینت‌ها
        sprint1, created = Sprint.objects.get_or_create(
            title='اسپرینت اول - طراحی UI',
            defaults={
                'description': 'طراحی و پیاده‌سازی رابط کاربری',
                'start_date': timezone.now().date(),
                'end_date': (timezone.now() + timedelta(days=14)).date(),
                'created_by': scrum_master
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS('✓ اسپرینت اول ایجاد شد'))

        sprint2, created = Sprint.objects.get_or_create(
            title='اسپرینت دوم - Backend API',
            defaults={
                'description': 'توسعه API های Backend',
                'start_date': (timezone.now() + timedelta(days=14)).date(),
                'end_date': (timezone.now() + timedelta(days=28)).date(),
                'created_by': scrum_master
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS('✓ اسپرینت دوم ایجاد شد'))

        # ایجاد تسک‌ها
        tasks_data = [
            {
                'title': 'طراحی صفحه داشبورد',
                'description': 'طراحی و پیاده‌سازی صفحه داشبورد با نمایش آمار',
                'assignee': team_members[0],
                'status': 'done',
                'priority': 'high',
                'deadline': timezone.now() - timedelta(days=2),
                'estimated_hours': 8,
                'sprint': sprint1
            },
            {
                'title': 'پیاده‌سازی صفحه تسک‌ها',
                'description': 'ایجاد صفحه لیست تسک‌ها با فیلتر و جستجو',
                'assignee': team_members[1],
                'status': 'in_progress',
                'priority': 'high',
                'deadline': timezone.now() + timedelta(days=1),
                'estimated_hours': 10,
                'sprint': sprint1
            },
            {
                'title': 'طراحی تقویم',
                'description': 'پیاده‌سازی تقویم ماهانه برای نمایش تسک‌ها',
                'assignee': team_members[2],
                'status': 'in_review',
                'priority': 'medium',
                'deadline': timezone.now() + timedelta(days=2),
                'estimated_hours': 12,
                'sprint': sprint1
            },
            {
                'title': 'یکپارچه‌سازی دستیار هوشمند',
                'description': 'اتصال به OpenAI API و پیاده‌سازی دستیار هوشمند',
                'assignee': team_members[0],
                'status': 'todo',
                'priority': 'medium',
                'deadline': timezone.now() + timedelta(days=5),
                'estimated_hours': 15,
                'sprint': sprint1
            },
            {
                'title': 'سیستم نوتیفیکیشن',
                'description': 'پیاده‌سازی سیستم اعلان‌های داخلی',
                'assignee': team_members[1],
                'status': 'todo',
                'priority': 'low',
                'deadline': timezone.now() + timedelta(days=7),
                'estimated_hours': 8,
                'sprint': sprint1
            },
            {
                'title': 'API احراز هویت',
                'description': 'پیاده‌سازی JWT authentication',
                'assignee': team_members[2],
                'status': 'todo',
                'priority': 'urgent',
                'deadline': timezone.now() + timedelta(days=3),
                'estimated_hours': 6,
                'sprint': sprint2
            },
        ]

        for task_data in tasks_data:
            task, created = Task.objects.get_or_create(
                title=task_data['title'],
                defaults={
                    **task_data,
                    'created_by': scrum_master
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'✓ تسک "{task.title}" ایجاد شد'))

                # ایجاد نوتیفیکیشن برای تسک‌های نزدیک به ددلاین
                if task.deadline - timezone.now() < timedelta(days=2):
                    Notification.objects.create(
                        user=task.assignee,
                        task=task,
                        type='deadline_reminder',
                        message=f'تسک "{task.title}" نزدیک به ددلاین است'
                    )

        self.stdout.write(self.style.SUCCESS('\n✅ همه داده‌های نمونه با موفقیت ایجاد شدند!'))
        self.stdout.write('\nاطلاعات ورود:')
        self.stdout.write('  ادمین: admin / admin')
        self.stdout.write('  اسکرام مستر: scrum / scrum123')
        self.stdout.write('  اعضای تیم: ali, sara, reza / password123')

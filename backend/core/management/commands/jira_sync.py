"""
Management Command برای همگام‌سازی با Jira
"""
from django.core.management.base import BaseCommand
from core.jira_sync import JiraSyncService
from core.jira_integration import JiraIntegration


class Command(BaseCommand):
    help = 'همگام‌سازی داده‌ها با Jira'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--direction',
            type=str,
            choices=['to-jira', 'from-jira', 'both'],
            default='both',
            help='جهت همگام‌سازی'
        )
        parser.add_argument(
            '--recent',
            type=int,
            help='فقط تغییرات اخیر (تعداد ساعت)'
        )
        parser.add_argument(
            '--test',
            action='store_true',
            help='تست اتصال به Jira'
        )
    
    def handle(self, *args, **options):
        # تست اتصال
        if options['test']:
            self.stdout.write('در حال تست اتصال به Jira...')
            jira = JiraIntegration()
            success, message = jira.test_connection()
            if success:
                self.stdout.write(self.style.SUCCESS(f'✓ {message}'))
            else:
                self.stdout.write(self.style.ERROR(f'✗ {message}'))
            return
        
        sync_service = JiraSyncService()
        direction = options['direction']
        recent = options.get('recent')
        
        # همگام‌سازی به Jira
        if direction in ['to-jira', 'both']:
            self.stdout.write('در حال همگام‌سازی به Jira...')
            results = sync_service.sync_all_to_jira()
            
            self.stdout.write(self.style.SUCCESS(
                f'✓ Tasks: {results["tasks"]["success"]} موفق, {results["tasks"]["failed"]} ناموفق'
            ))
            self.stdout.write(self.style.SUCCESS(
                f'✓ Sprints: {results["sprints"]["success"]} موفق, {results["sprints"]["failed"]} ناموفق'
            ))
            self.stdout.write(self.style.SUCCESS(
                f'✓ Backlogs: {results["backlogs"]["success"]} موفق, {results["backlogs"]["failed"]} ناموفق'
            ))
        
        # همگام‌سازی از Jira
        if direction in ['from-jira', 'both']:
            self.stdout.write('در حال همگام‌سازی از Jira...')
            
            if recent:
                results = sync_service.sync_recent_from_jira(hours=recent)
                self.stdout.write(self.style.SUCCESS(
                    f'✓ {results["success"]} آیتم همگام‌سازی شد, {results["failed"]} ناموفق'
                ))
            else:
                results = sync_service.sync_all_from_jira()
                self.stdout.write(self.style.SUCCESS(
                    f'✓ {results["new"]} آیتم جدید, {results["updated"]} آیتم بروزرسانی شد'
                ))
                self.stdout.write(self.style.SUCCESS(
                    f'✓ موفق: {results["tasks"]["success"]}, ناموفق: {results["tasks"]["failed"]}'
                ))
        
        self.stdout.write(self.style.SUCCESS('\n✓ همگام‌سازی کامل شد!'))

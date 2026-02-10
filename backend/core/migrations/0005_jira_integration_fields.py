# Generated migration for Jira integration fields

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0004_backlog_user_story_sprint_user_story'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='jira_key',
            field=models.CharField(blank=True, max_length=50, null=True, unique=True),
        ),
        migrations.AddField(
            model_name='task',
            name='last_synced_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='sprint',
            name='jira_sprint_id',
            field=models.CharField(blank=True, max_length=100, null=True, unique=True),
        ),
        migrations.AddField(
            model_name='sprint',
            name='last_synced_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='backlog',
            name='jira_key',
            field=models.CharField(blank=True, max_length=50, null=True, unique=True),
        ),
        migrations.AddField(
            model_name='backlog',
            name='last_synced_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]

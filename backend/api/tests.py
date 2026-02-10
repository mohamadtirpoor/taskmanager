from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from core.models import User, Sprint, Task
from datetime import datetime, timedelta

class AuthenticationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123',
            first_name='تست',
            last_name='کاربر'
        )

    def test_login(self):
        """تست ورود کاربر"""
        response = self.client.post(reverse('token_obtain_pair'), {
            'username': 'testuser',
            'password': 'testpass123'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_login_invalid_credentials(self):
        """تست ورود با اطلاعات نادرست"""
        response = self.client.post(reverse('token_obtain_pair'), {
            'username': 'testuser',
            'password': 'wrongpass'
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class TaskTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123',
            first_name='تست',
            last_name='کاربر'
        )
        self.client.force_authenticate(user=self.user)

    def test_create_task(self):
        """تست ایجاد تسک"""
        data = {
            'title': 'تسک تست',
            'description': 'توضیحات تست',
            'assignee_id': self.user.id,
            'status': 'todo',
            'priority': 'medium',
            'deadline': (datetime.now() + timedelta(days=7)).isoformat(),
            'estimated_hours': 8
        }
        response = self.client.post('/api/tasks/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Task.objects.count(), 1)
        self.assertEqual(Task.objects.first().title, 'تسک تست')

    def test_list_tasks(self):
        """تست لیست تسک‌ها"""
        Task.objects.create(
            title='تسک 1',
            assignee=self.user,
            status='todo',
            priority='high',
            deadline=datetime.now() + timedelta(days=1),
            created_by=self.user
        )
        response = self.client.get('/api/tasks/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_today_tasks(self):
        """تست تسک‌های امروز"""
        Task.objects.create(
            title='تسک امروز',
            assignee=self.user,
            status='todo',
            priority='high',
            deadline=datetime.now(),
            created_by=self.user
        )
        response = self.client.get('/api/tasks/today/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)


class SprintTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123',
            role='scrum_master'
        )
        self.client.force_authenticate(user=self.user)

    def test_create_sprint(self):
        """تست ایجاد اسپرینت"""
        data = {
            'title': 'اسپرینت تست',
            'description': 'توضیحات اسپرینت',
            'start_date': datetime.now().date().isoformat(),
            'end_date': (datetime.now() + timedelta(days=14)).date().isoformat()
        }
        response = self.client.post('/api/sprints/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Sprint.objects.count(), 1)

    def test_sprint_progress(self):
        """تست پیشرفت اسپرینت"""
        sprint = Sprint.objects.create(
            title='اسپرینت تست',
            start_date=datetime.now().date(),
            end_date=(datetime.now() + timedelta(days=14)).date(),
            created_by=self.user
        )
        
        # ایجاد تسک‌ها
        Task.objects.create(
            title='تسک 1',
            assignee=self.user,
            status='done',
            priority='high',
            deadline=datetime.now() + timedelta(days=1),
            sprint=sprint,
            created_by=self.user
        )
        Task.objects.create(
            title='تسک 2',
            assignee=self.user,
            status='todo',
            priority='high',
            deadline=datetime.now() + timedelta(days=1),
            sprint=sprint,
            created_by=self.user
        )
        
        response = self.client.get(f'/api/sprints/{sprint.id}/progress/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total'], 2)
        self.assertEqual(response.data['completed'], 1)
        self.assertEqual(response.data['percentage'], 50)

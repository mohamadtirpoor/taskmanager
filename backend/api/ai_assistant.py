from django.utils import timezone
from datetime import timedelta
from core.models import Task
from django.conf import settings

class AIAssistant:
    def __init__(self, user):
        self.user = user
    
    def answer(self, question):
        context = self._get_user_context()
        return self._fallback_answer(question, context)
    
    def _get_user_context(self):
        today = timezone.now().date()
        tasks_today = Task.objects.filter(assignee=self.user, deadline__date=today).count()
        tasks_overdue = Task.objects.filter(assignee=self.user, deadline__lt=timezone.now(), status__in=['todo', 'in_progress']).count()
        tasks_total = Task.objects.filter(assignee=self.user).count()
        tasks_done = Task.objects.filter(assignee=self.user, status='done').count()
        
        return {
            'tasks_today': tasks_today,
            'tasks_overdue': tasks_overdue,
            'tasks_total': tasks_total,
            'tasks_done': tasks_done,
        }
    
    def _fallback_answer(self, question, context):
        question_lower = question.lower()
        
        if 'امروز' in question_lower or 'today' in question_lower:
            return f"شما امروز {context['tasks_today']} تسک دارید."
        
        if 'عقب' in question_lower or 'overdue' in question_lower:
            return f"شما {context['tasks_overdue']} تسک عقب افتاده دارید."
        
        if 'آمار' in question_lower or 'stats' in question_lower:
            return f"از مجموع {context['tasks_total']} تسک، {context['tasks_done']} تسک انجام شده است."
        
        return "متوجه سوال شما نشدم. لطفا سوال دیگری بپرسید."

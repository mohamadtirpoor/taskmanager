import { Clock, User, Calendar } from 'lucide-react'
import { toJalali } from '../utils/dateUtils'

const statusColors = {
  todo: 'badge-todo',
  in_progress: 'badge-in-progress',
  in_review: 'badge-in-review',
  done: 'badge-done'
}

const statusLabels = {
  todo: 'انجام نشده',
  in_progress: 'در حال انجام',
  in_review: 'در حال بررسی',
  done: 'انجام شده'
}

const priorityColors = {
  low: 'text-gray-500',
  medium: 'text-blue-500',
  high: 'text-orange-500',
  urgent: 'text-red-500'
}

export default function TaskCard({ task, compact = false }) {
  const deadline = new Date(task.deadline)
  const isOverdue = deadline < new Date() && task.status !== 'done'

  return (
    <div className={`card ${isOverdue ? 'border-2 border-red-200' : ''} ${compact ? 'p-4' : ''}`}>
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-bold text-gray-800 flex-1">{task.title}</h3>
        <span className={`badge ${statusColors[task.status]}`}>
          {statusLabels[task.status]}
        </span>
      </div>

      {!compact && task.description && (
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <User size={16} />
          <span>{task.assignee?.first_name} {task.assignee?.last_name}</span>
        </div>
        <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-600 font-medium' : ''}`}>
          <Calendar size={16} />
          <span>{toJalali(deadline)}</span>
        </div>
        {task.estimated_hours && (
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{task.estimated_hours} ساعت</span>
          </div>
        )}
      </div>

      {task.sprint_title && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-500">اسپرینت: {task.sprint_title}</span>
        </div>
      )}
    </div>
  )
}

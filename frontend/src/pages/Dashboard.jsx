import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { CheckCircle2, Clock, AlertCircle, TrendingUp, Calendar, User as UserIcon, ArrowUpRight } from 'lucide-react'
import AIAssistant from '../components/AIAssistant'
import { toJalali } from '../utils/dateUtils'

export default function Dashboard() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState({ today: [], upcoming: [], overdue: [] })
  const [stats, setStats] = useState({ total: 0, done: 0, inProgress: 0, inReview: 0 })
  const [teamStats, setTeamStats] = useState({ totalTasks: 0, completedTasks: 0, teamMembers: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [today, upcoming, overdue, all, users] = await Promise.all([
        api.get('/tasks/today/'),
        api.get('/tasks/upcoming/'),
        api.get('/tasks/overdue/'),
        api.get('/tasks/'),
        user?.role === 'admin' || user?.role === 'scrum_master' ? api.get('/users/') : Promise.resolve({ data: [] })
      ])

      setTasks({
        today: today.data,
        upcoming: upcoming.data,
        overdue: overdue.data
      })

      const allTasks = all.data.results || []
      setStats({
        total: allTasks.length,
        done: allTasks.filter(t => t.status === 'done').length,
        inProgress: allTasks.filter(t => t.status === 'in_progress').length,
        inReview: allTasks.filter(t => t.status === 'in_review').length
      })

      if (user?.role === 'admin' || user?.role === 'scrum_master') {
        const allTasksForTeam = await api.get('/tasks/')
        const allTasksData = allTasksForTeam.data.results || []
        setTeamStats({
          totalTasks: allTasksData.length,
          completedTasks: allTasksData.filter(t => t.status === 'done').length,
          teamMembers: users.data.results?.length || users.data.length || 0
        })
      }

      setLoading(false)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      setLoading(false)
    }
  }

  const progressPercentage = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0
  const teamProgressPercentage = teamStats.totalTasks > 0 ? Math.round((teamStats.completedTasks / teamStats.totalTasks) * 100) : 0

  if (loading) return <div className="text-center py-12">در حال بارگذاری...</div>

  return (
    <div className="space-y-6">
      {/* هدر با پروفایل */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-text-primary mb-2">
            سلام، {user?.first_name} 👋
          </h1>
          <p className="text-text-secondary">امروز چه کارهایی داری؟</p>
        </div>
        <Link to="/profile">
          <div className="flex items-center gap-3 card-light cursor-pointer hover:scale-105 transition-transform">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary-300 to-purple-300 flex items-center justify-center text-xl font-bold text-white">
                  {user?.first_name?.[0]}{user?.last_name?.[0]}
                </div>
              )}
            </div>
            <div className="text-right">
              <p className="font-bold text-text-primary">{user?.first_name} {user?.last_name}</p>
              <p className="text-sm text-text-secondary">{user?.expertise || 'عضو تیم'}</p>
            </div>
          </div>
        </Link>
      </div>

      {/* آمار کلی */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white bg-opacity-20 rounded-2xl p-3">
              <CheckCircle2 size={28} />
            </div>
            <ArrowUpRight size={20} />
          </div>
          <p className="text-blue-100 text-sm mb-1 font-medium">کل تسک‌ها</p>
          <p className="text-4xl font-bold">{stats.total}</p>
        </div>

        <div className="stat-card bg-gradient-to-br from-yellow-500 to-orange-500 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white bg-opacity-20 rounded-2xl p-3">
              <Clock size={28} />
            </div>
            <ArrowUpRight size={20} />
          </div>
          <p className="text-yellow-100 text-sm mb-1 font-medium">در حال انجام</p>
          <p className="text-4xl font-bold">{stats.inProgress}</p>
        </div>

        <div className="stat-card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white bg-opacity-20 rounded-2xl p-3">
              <TrendingUp size={28} />
            </div>
            <ArrowUpRight size={20} />
          </div>
          <p className="text-purple-100 text-sm mb-1 font-medium">در حال بررسی</p>
          <p className="text-4xl font-bold">{stats.inReview}</p>
        </div>

        <div className="stat-card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white bg-opacity-20 rounded-2xl p-3">
              <CheckCircle2 size={28} />
            </div>
            <ArrowUpRight size={20} />
          </div>
          <p className="text-green-100 text-sm mb-1 font-medium">انجام شده</p>
          <p className="text-4xl font-bold">{stats.done}</p>
        </div>
      </div>

      {/* پیشرفت شخصی */}
      <div className="card-light">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">پیشرفت شخصی</h2>
          <span className="text-2xl font-bold text-green-600">{progressPercentage}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill bg-gradient-to-r from-green-400 to-green-600"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="flex justify-between mt-3 text-sm text-gray-600">
          <span>{stats.done} تسک انجام شده</span>
          <span>{stats.total - stats.done} تسک باقی‌مانده</span>
        </div>
      </div>

      {/* پیشرفت تیم (فقط برای ادمین و اسکرام مستر) */}
      {(user?.role === 'admin' || user?.role === 'scrum_master') && (
        <div className="card-purple">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">پیشرفت تیم</h2>
              <p className="text-sm text-gray-600">{teamStats.teamMembers} عضو تیم</p>
            </div>
            <span className="text-2xl font-bold text-purple-600">{teamProgressPercentage}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill bg-gradient-to-r from-purple-400 to-purple-600"
              style={{ width: `${teamProgressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between mt-3 text-sm text-gray-600">
            <span>{teamStats.completedTasks} تسک انجام شده</span>
            <span>{teamStats.totalTasks} تسک کل</span>
          </div>
        </div>
      )}

      {/* تسک‌های عقب افتاده */}
      {tasks.overdue.length > 0 && (
        <div className="card-dark">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-red-500 rounded-2xl p-3">
              <AlertCircle className="text-white" size={24} />
            </div>
            <h2 className="text-xl font-bold">تسک‌های عقب افتاده</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tasks.overdue.map(task => (
              <TaskCard key={task.id} task={task} isDark />
            ))}
          </div>
        </div>
      )}

      {/* تسک‌های امروز و نزدیک به ددلاین */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar className="text-green-500" size={24} />
            تسک‌های امروز
          </h2>
          {tasks.today.length === 0 ? (
            <p className="text-gray-500 text-center py-8">تسکی برای امروز وجود ندارد 🎉</p>
          ) : (
            <div className="space-y-3">
              {tasks.today.map(task => (
                <TaskCard key={task.id} task={task} compact />
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Clock className="text-orange-500" size={24} />
            نزدیک به ددلاین
          </h2>
          {tasks.upcoming.length === 0 ? (
            <p className="text-gray-500 text-center py-8">تسکی وجود ندارد</p>
          ) : (
            <div className="space-y-3">
              {tasks.upcoming.map(task => (
                <TaskCard key={task.id} task={task} compact />
              ))}
            </div>
          )}
        </div>
      </div>

      <AIAssistant />
    </div>
  )
}

function TaskCard({ task, compact = false, isDark = false }) {
  const deadline = new Date(task.deadline)
  const isOverdue = deadline < new Date() && task.status !== 'done'

  const statusColors = {
    todo: 'bg-gray-200 text-gray-700',
    in_progress: 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800',
    in_review: 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800',
    done: 'bg-gradient-to-r from-green-100 to-green-200 text-green-800'
  }

  const statusLabels = {
    todo: 'انجام نشده',
    in_progress: 'در حال انجام',
    in_review: 'در حال بررسی',
    done: 'انجام شده'
  }

  return (
    <div className={`${isDark ? 'bg-gray-800 border-2 border-gray-700' : 'bg-white'} rounded-2xl p-4 shadow-md hover:shadow-lg transition-all ${isOverdue ? 'border-2 border-red-300' : ''}`}>
      <div className="flex items-start justify-between mb-2">
        <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-800'} flex-1`}>{task.title}</h3>
        <span className={`badge ${statusColors[task.status]} text-xs`}>
          {statusLabels[task.status]}
        </span>
      </div>

      {!compact && task.description && (
        <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm mb-3 line-clamp-2`}>{task.description}</p>
      )}

      <div className="flex items-center gap-4 text-sm">
        <div className={`flex items-center gap-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          <UserIcon size={14} />
          <span>{task.assignee?.first_name} {task.assignee?.last_name}</span>
        </div>
        <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-600 font-bold' : isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          <Calendar size={14} />
          <span>{toJalali(deadline)}</span>
        </div>
      </div>
    </div>
  )
}

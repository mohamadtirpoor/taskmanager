import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LayoutDashboard, CheckSquare, Calendar, Layers, LogOut, Bell, Users, FileText, UserCog, Link2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import api from '../services/api'
import { toJalali } from '../utils/dateUtils'

export default function Layout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    loadNotifications()
    // بروزرسانی هر 30 ثانیه
    const interval = setInterval(loadNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadNotifications = () => {
    api.get('/notifications/').then(res => setNotifications(res.data.results || []))
  }

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'داشبورد' },
    { path: '/tasks', icon: CheckSquare, label: 'تسک‌ها' },
    { path: '/sprints', icon: Layers, label: 'اسپرینت‌ها' },
    { path: '/meetings', icon: Users, label: 'جلسات' },
    { path: '/backlogs', icon: FileText, label: 'بک‌لاگ‌ها' },
    { path: '/calendar', icon: Calendar, label: 'تقویم' },
  ]

  // اضافه کردن مدیریت تیم و Jira فقط برای ادمین
  const allNavItems = user?.role === 'admin' 
    ? [...navItems, 
       { path: '/team', icon: UserCog, label: 'مدیریت تیم' },
       { path: '/jira', icon: Link2, label: 'اتصال Jira' }
      ]
    : navItems

  const unreadCount = notifications.filter(n => !n.is_read).length

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'meeting_scheduled': return '📅'
      case 'backlog_added': return '📝'
      case 'task_assigned': return '✅'
      case 'deadline_reminder': return '⏰'
      default: return '🔔'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-lg">د</span>
                </div>
                <span className="text-xl font-bold text-gray-800">داده نگار اقتصاد</span>
              </div>
              
              <div className="hidden md:flex gap-2">
                {allNavItems.map(item => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-2xl transition-all ${
                      location.pathname === item.path
                        ? 'bg-primary-500 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-2xl transition-colors"
                >
                  <Bell size={22} />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 left-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>
                
                {showNotifications && (
                  <div className="absolute left-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 max-h-96 overflow-y-auto">
                    <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-blue-50">
                      <h3 className="font-bold text-gray-800">اعلان‌ها</h3>
                    </div>
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">اعلانی وجود ندارد</div>
                    ) : (
                      notifications.map(notif => (
                        <div key={notif.id} className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${!notif.is_read ? 'bg-blue-50' : ''}`}>
                          <div className="flex items-start gap-3">
                            <span className="text-2xl">{getNotificationIcon(notif.type)}</span>
                            <div className="flex-1">
                              <p className="text-sm text-gray-800 font-medium">{notif.message}</p>
                              <p className="text-xs text-gray-500 mt-1">{toJalali(notif.created_at)}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 pr-4 border-r border-gray-200">
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-800">{user?.first_name} {user?.last_name}</p>
                  <p className="text-xs text-gray-500">
                    {user?.role === 'admin' ? 'ادمین' : user?.role === 'scrum_master' ? 'اسکرام مستر' : 'عضو تیم'}
                  </p>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-2xl transition-colors"
                  title="خروج"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  )
}

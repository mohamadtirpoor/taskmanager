import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { Plus, X, Layers } from 'lucide-react'
import { toJalali } from '../utils/dateUtils'

export default function Backlogs() {
  const { user } = useAuth()
  const [backlogs, setBacklogs] = useState([])
  const [sprints, setSprints] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    user_story: '',
    priority: 'medium',
    sprint: ''
  })

  const isAdmin = user?.role === 'admin' || user?.role === 'scrum_master'

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [backlogsRes, sprintsRes] = await Promise.all([
        api.get('/backlogs/'),
        api.get('/sprints/')
      ])
      setBacklogs(backlogsRes.data.results || [])
      setSprints(sprintsRes.data.results || [])
      setLoading(false)
    } catch (error) {
      console.error('Error loading data:', error)
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/backlogs/', formData)
      setShowModal(false)
      setFormData({ title: '', description: '', user_story: '', priority: 'medium', sprint: '' })
      loadData()
    } catch (error) {
      console.error('Error creating backlog:', error)
    }
  }

  const priorityLabels = {
    low: 'کم',
    medium: 'متوسط',
    high: 'زیاد',
    urgent: 'فوری'
  }

  if (loading) return <div className="text-center py-12">در حال بارگذاری...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-800">بک‌لاگ‌ها</h1>
        {isAdmin && (
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            بک‌لاگ جدید
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {backlogs.map(backlog => (
          <div key={backlog.id} className="card">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800 flex-1">{backlog.title}</h3>
              <span className={`badge badge-priority-${backlog.priority}`}>
                {priorityLabels[backlog.priority]}
              </span>
            </div>

            <p className="text-gray-600 text-sm mb-4 whitespace-pre-wrap">{backlog.description}</p>

            {backlog.user_story && (
              <div className="bg-blue-50 border-r-4 border-blue-500 p-3 rounded-2xl mb-4">
                <p className="text-xs font-medium text-blue-800 mb-1">یوزر استوری:</p>
                <p className="text-sm text-gray-700">{backlog.user_story}</p>
              </div>
            )}

            <div className="space-y-2">
              {backlog.sprint_title && (
                <div className="flex items-center gap-2 text-sm text-gray-700 bg-blue-50 rounded-2xl p-3">
                  <Layers size={16} className="text-blue-600" />
                  <span>{backlog.sprint_title}</span>
                </div>
              )}

              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  ایجاد شده توسط {backlog.created_by?.first_name} {backlog.created_by?.last_name}
                </p>
                <p className="text-xs text-gray-500">
                  {toJalali(backlog.created_at)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {backlogs.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-gray-500 mb-4">هنوز بک‌لاگی ایجاد نشده است</p>
          {isAdmin && (
            <button onClick={() => setShowModal(true)} className="btn-primary">
              اولین بک‌لاگ را بسازید
            </button>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">بک‌لاگ جدید</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">عنوان</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">توضیحات</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input"
                  rows="4"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">یوزر استوری</label>
                <textarea
                  value={formData.user_story}
                  onChange={(e) => setFormData({ ...formData, user_story: e.target.value })}
                  className="input"
                  rows="3"
                  placeholder="به عنوان [نقش]، می‌خواهم [قابلیت] تا [هدف]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">اولویت</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="input"
                  >
                    <option value="low">کم</option>
                    <option value="medium">متوسط</option>
                    <option value="high">زیاد</option>
                    <option value="urgent">فوری</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">اسپرینت (اختیاری)</label>
                  <select
                    value={formData.sprint}
                    onChange={(e) => setFormData({ ...formData, sprint: e.target.value })}
                    className="input"
                  >
                    <option value="">بدون اسپرینت</option>
                    {sprints.map(s => (
                      <option key={s.id} value={s.id}>{s.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">ایجاد بک‌لاگ</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

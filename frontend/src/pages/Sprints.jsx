import { useState, useEffect } from 'react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import { Plus, Calendar, TrendingUp, X, Users, CheckCircle2, Clock } from 'lucide-react'
import { toJalali } from '../utils/dateUtils'

export default function Sprints() {
  const { user } = useAuth()
  const [sprints, setSprints] = useState([])
  const [selectedSprint, setSelectedSprint] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    user_story: '',
    start_date: '',
    end_date: ''
  })

  const isAdmin = user?.role === 'admin' || user?.role === 'scrum_master'

  useEffect(() => {
    loadSprints()
  }, [])

  const loadSprints = async () => {
    try {
      const res = await api.get('/sprints/')
      setSprints(res.data.results || [])
      setLoading(false)
    } catch (error) {
      console.error('Error loading sprints:', error)
      setLoading(false)
    }
  }

  const loadSprintDetails = async (sprintId) => {
    try {
      const [sprintRes, tasksRes] = await Promise.all([
        api.get(`/sprints/${sprintId}/`),
        api.get(`/tasks/?sprint=${sprintId}`)
      ])
      setSelectedSprint({
        ...sprintRes.data,
        tasks: tasksRes.data.results || []
      })
      setShowDetailModal(true)
    } catch (error) {
      console.error('Error loading sprint details:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/sprints/', formData)
      setShowModal(false)
      setFormData({ title: '', description: '', user_story: '', start_date: '', end_date: '' })
      loadSprints()
    } catch (error) {
      console.error('Error creating sprint:', error)
    }
  }

  if (loading) return <div className="text-center py-12">در حال بارگذاری...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-800">اسپرینت‌ها</h1>
        {isAdmin && (
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            اسپرینت جدید
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sprints.map(sprint => {
          const progress = sprint.task_count > 0 
            ? (sprint.completed_tasks / sprint.task_count * 100).toFixed(0)
            : 0

          return (
            <div 
              key={sprint.id} 
              onClick={() => loadSprintDetails(sprint.id)}
              className="card hover:scale-105 cursor-pointer transition-transform"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex-1">{sprint.title}</h3>
                <span className="badge bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800">
                  {sprint.task_count} تسک
                </span>
              </div>

              {sprint.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{sprint.description}</p>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-2xl p-3">
                  <Calendar size={16} />
                  <span>
                    {toJalali(sprint.start_date)} - {toJalali(sprint.end_date)}
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600 font-medium">پیشرفت</span>
                    <span className="font-bold text-primary-600">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-l from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 pt-3 border-t border-gray-100">
                  <CheckCircle2 size={16} className="text-green-500" />
                  <span>{sprint.completed_tasks} از {sprint.task_count} تسک انجام شده</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {sprints.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-gray-500 mb-4">هنوز اسپرینتی ایجاد نشده است</p>
          {isAdmin && (
            <button onClick={() => setShowModal(true)} className="btn-primary">
              اولین اسپرینت را بسازید
            </button>
          )}
        </div>
      )}

      {/* Create Sprint Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">اسپرینت جدید</h2>
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
                  rows="3"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">تاریخ شروع</label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">تاریخ پایان</label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="input"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">ایجاد اسپرینت</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sprint Detail Modal */}
      {showDetailModal && selectedSprint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">{selectedSprint.title}</h2>
                {selectedSprint.description && (
                  <p className="text-gray-600 mb-3">{selectedSprint.description}</p>
                )}
                {selectedSprint.user_story && (
                  <div className="bg-blue-50 border-r-4 border-blue-500 p-4 rounded-2xl mb-3">
                    <p className="text-sm font-medium text-blue-800 mb-1">یوزر استوری:</p>
                    <p className="text-gray-700">{selectedSprint.user_story}</p>
                  </div>
                )}
              </div>
              <button 
                onClick={() => setShowDetailModal(false)} 
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-blue-600 mb-2">
                  <Calendar size={20} />
                  <span className="text-sm font-medium">مدت زمان</span>
                </div>
                <p className="text-sm text-gray-700">
                  {toJalali(selectedSprint.start_date)}
                  <br />
                  {toJalali(selectedSprint.end_date)}
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-green-600 mb-2">
                  <CheckCircle2 size={20} />
                  <span className="text-sm font-medium">تسک‌های انجام شده</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">
                  {selectedSprint.completed_tasks} / {selectedSprint.task_count}
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-purple-600 mb-2">
                  <TrendingUp size={20} />
                  <span className="text-sm font-medium">پیشرفت</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">
                  {selectedSprint.task_count > 0 
                    ? ((selectedSprint.completed_tasks / selectedSprint.task_count) * 100).toFixed(0)
                    : 0}%
                </p>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4">تسک‌های اسپرینت</h3>
              {selectedSprint.tasks && selectedSprint.tasks.length > 0 ? (
                <div className="space-y-3">
                  {selectedSprint.tasks.map(task => (
                    <div key={task.id} className={`task-card task-card-${task.status}`}>
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-bold text-gray-800">{task.title}</h4>
                        <span className={`badge badge-${task.status}`}>
                          {task.status === 'todo' && 'انجام نشده'}
                          {task.status === 'in_progress' && 'در حال انجام'}
                          {task.status === 'in_review' && 'در حال بررسی'}
                          {task.status === 'done' && 'انجام شده'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Users size={14} />
                          <span>{task.assignee?.first_name} {task.assignee?.last_name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>{toJalali(task.deadline)}</span>
                        </div>
                        {task.estimated_hours && (
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            <span>{task.estimated_hours}h</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">هنوز تسکی به این اسپرینت اضافه نشده</p>
              )}
            </div>

            <button 
              onClick={() => setShowDetailModal(false)} 
              className="btn-secondary w-full"
            >
              بستن
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

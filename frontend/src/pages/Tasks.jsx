import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import { Plus, X, Calendar, Clock, User as UserIcon, Trash2 } from 'lucide-react'
import { toJalali } from '../utils/dateUtils'

export default function Tasks() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [users, setUsers] = useState([])
  const [sprints, setSprints] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignee_id: '',
    priority: 'medium',
    deadline: '',
    estimated_hours: '',
    sprint: ''
  })

  const isAdmin = user?.role === 'admin' || user?.role === 'scrum_master'

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [tasksRes, usersRes, sprintsRes] = await Promise.all([
        api.get('/tasks/'),
        isAdmin ? api.get('/users/') : Promise.resolve({ data: [] }),
        api.get('/sprints/')
      ])
      setTasks(tasksRes.data.results || [])
      setUsers(usersRes.data.results || usersRes.data || [])
      setSprints(sprintsRes.data.results || [])
      setLoading(false)
    } catch (error) {
      console.error('Error loading data:', error)
      setLoading(false)
    }
  }

  const handleDragEnd = async (result) => {
    if (!result.destination) return

    const { source, destination, draggableId } = result
    if (source.droppableId === destination.droppableId) return

    const taskId = parseInt(draggableId)
    const newStatus = destination.droppableId
    const task = tasks.find(t => t.id === taskId)

    // بررسی دسترسی: کاربران عادی فقط می‌توانند تسک‌های خودشان را جابجا کنند
    if (user?.role !== 'admin' && user?.role !== 'scrum_master') {
      if (!task || task.assignee?.id !== user?.id) {
        alert('شما فقط می‌توانید تسک‌های خودتان را تغییر دهید')
        return
      }
    }

    // بروزرسانی optimistic UI
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, status: newStatus } : t
    ))

    try {
      await api.patch(`/tasks/${taskId}/`, { status: newStatus })
    } catch (error) {
      console.error('Error updating task:', error)
      console.error('Error response:', error.response?.data)
      
      // برگرداندن تسک به وضعیت قبلی در صورت خطا
      setTasks(prev => prev.map(t => 
        t.id === taskId ? { ...t, status: source.droppableId } : t
      ))
      
      alert('خطا در تغییر وضعیت تسک: ' + (error.response?.data?.detail || error.message))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/tasks/', formData)
      setShowModal(false)
      setFormData({
        title: '',
        description: '',
        assignee_id: '',
        priority: 'medium',
        deadline: '',
        estimated_hours: '',
        sprint: ''
      })
      loadData()
    } catch (error) {
      console.error('Error creating task:', error)
      alert('خطا در ایجاد تسک')
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('آیا از حذف این تسک اطمینان دارید؟')) return
    
    try {
      await api.delete(`/tasks/${taskId}/`)
      setTasks(prev => prev.filter(task => task.id !== taskId))
    } catch (error) {
      console.error('Error deleting task:', error)
      alert('خطا در حذف تسک')
    }
  }

  const groupedTasks = {
    todo: tasks.filter(t => t.status === 'todo'),
    in_progress: tasks.filter(t => t.status === 'in_progress'),
    in_review: tasks.filter(t => t.status === 'in_review'),
    done: tasks.filter(t => t.status === 'done')
  }

  const columns = [
    { id: 'todo', title: 'انجام نشده', color: 'border-gray-300 bg-gray-50' },
    { id: 'in_progress', title: 'در حال انجام', color: 'border-yellow-300 bg-yellow-50' },
    { id: 'in_review', title: 'در حال بررسی', color: 'border-purple-300 bg-purple-50' },
    { id: 'done', title: 'انجام شده', color: 'border-green-300 bg-green-50' }
  ]

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
        <h1 className="text-4xl font-bold text-gray-800">تسک‌ها</h1>
        {isAdmin && (
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            تسک جدید
          </button>
        )}
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {columns.map(column => (
            <div key={column.id} className="space-y-4">
              <div className={`column-header ${column.color}`}>
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-gray-800 text-lg">{column.title}</h2>
                  <span className="badge badge-{column.id}">{groupedTasks[column.id].length}</span>
                </div>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`space-y-3 min-h-[200px] p-2 rounded-2xl transition-colors ${
                      snapshot.isDraggingOver ? 'bg-blue-50 ring-2 ring-blue-300' : ''
                    }`}
                  >
                    {groupedTasks[column.id].map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`task-card task-card-${task.status} ${
                              snapshot.isDragging ? 'rotate-3 scale-105' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <h3 className="font-bold text-gray-800 flex-1 text-lg">{task.title}</h3>
                              <div className="flex items-center gap-2">
                                <span className={`badge badge-priority-${task.priority}`}>
                                  {priorityLabels[task.priority]}
                                </span>
                                {user?.role === 'admin' && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleDeleteTask(task.id)
                                    }}
                                    className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    title="حذف تسک"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                )}
                              </div>
                            </div>

                            {task.description && (
                              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{task.description}</p>
                            )}

                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <UserIcon size={16} />
                                <span>{task.assignee?.first_name} {task.assignee?.last_name}</span>
                              </div>

                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar size={16} />
                                <span>{toJalali(task.deadline)}</span>
                              </div>

                              {task.estimated_hours && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Clock size={16} />
                                  <span>{task.estimated_hours} ساعت</span>
                                </div>
                              )}
                            </div>

                            {task.sprint_title && (
                              <div className="mt-3 pt-3 border-t border-gray-200">
                                <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full">
                                  {task.sprint_title}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">تسک جدید</h2>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">مسئول</label>
                  <select
                    value={formData.assignee_id}
                    onChange={(e) => setFormData({ ...formData, assignee_id: e.target.value })}
                    className="input"
                    required
                  >
                    <option value="">انتخاب کنید</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>{u.first_name} {u.last_name}</option>
                    ))}
                  </select>
                </div>

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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ددلاین</label>
                  <input
                    type="datetime-local"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">زمان تخمینی (ساعت)</label>
                  <input
                    type="number"
                    value={formData.estimated_hours}
                    onChange={(e) => setFormData({ ...formData, estimated_hours: e.target.value })}
                    className="input"
                    step="0.5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">اسپرینت</label>
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

              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">ایجاد تسک</button>
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

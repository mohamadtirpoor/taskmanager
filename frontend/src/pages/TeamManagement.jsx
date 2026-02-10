import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { Plus, X, Trash2, Edit } from 'lucide-react'

export default function TeamManagement() {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'team_member',
    phone: '',
    expertise: '',
    bio: ''
  })

  // فقط ادمین می‌تونه این صفحه رو ببینه
  if (user?.role !== 'admin') {
    return <div className="text-center py-12">شما دسترسی به این صفحه ندارید</div>
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const res = await api.get('/users/')
      setUsers(res.data.results || res.data || [])
      setLoading(false)
    } catch (error) {
      console.error('Error loading users:', error)
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/users/', formData)
      setShowModal(false)
      setFormData({
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        role: 'team_member',
        phone: '',
        expertise: '',
        bio: ''
      })
      loadUsers()
    } catch (error) {
      console.error('Error creating user:', error)
      alert('خطا در ایجاد کاربر')
    }
  }

  const handleDelete = async (userId) => {
    if (!confirm('آیا مطمئن هستید که می‌خواهید این کاربر را حذف کنید؟')) return
    
    try {
      await api.delete(`/users/${userId}/`)
      loadUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('خطا در حذف کاربر')
    }
  }

  if (loading) return <div className="text-center py-12">در حال بارگذاری...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-800">مدیریت تیم</h1>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          افزودن کاربر
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(u => (
          <div key={u.id} className="card">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800">{u.first_name} {u.last_name}</h3>
                <p className="text-sm text-gray-600">@{u.username}</p>
              </div>
              <span className={`badge ${
                u.role === 'admin' ? 'bg-red-100 text-red-700' :
                u.role === 'scrum_master' ? 'bg-purple-100 text-purple-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {u.role === 'admin' ? 'ادمین' : u.role === 'scrum_master' ? 'اسکرام مستر' : 'عضو تیم'}
              </span>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <p>📧 {u.email}</p>
              {u.phone && <p>📱 {u.phone}</p>}
              {u.expertise && (
                <div className="bg-green-50 rounded-2xl p-3 mt-3">
                  <p className="text-green-800 font-medium">💼 {u.expertise}</p>
                </div>
              )}
              {u.bio && <p className="text-gray-500 text-xs mt-2">{u.bio}</p>}
            </div>

            {u.id !== user.id && (
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleDelete(u.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={16} />
                  حذف
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">افزودن کاربر جدید</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">نام</label>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">نام خانوادگی</label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="input"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نام کاربری</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="input"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ایمیل</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">رمز عبور</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="input"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">نقش</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="input"
                  >
                    <option value="team_member">عضو تیم</option>
                    <option value="scrum_master">اسکرام مستر</option>
                    <option value="admin">ادمین</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">تلفن</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">تخصص</label>
                <input
                  type="text"
                  value={formData.expertise}
                  onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                  className="input"
                  placeholder="مثال: توسعه‌دهنده Frontend"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">درباره</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="input"
                  rows="3"
                  placeholder="توضیحات کوتاه درباره کاربر"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">افزودن کاربر</button>
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

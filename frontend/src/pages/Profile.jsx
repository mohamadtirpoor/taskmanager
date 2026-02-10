import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { Camera, Mail, Phone, Briefcase, Edit2, Save, X } from 'lucide-react'

export default function Profile() {
  const { user, setUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    expertise: '',
    bio: ''
  })
  const [avatarPreview, setAvatarPreview] = useState(null)

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        expertise: user.expertise || '',
        bio: user.bio || ''
      })
      setAvatarPreview(user.avatar)
    }
  }, [user])

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await api.patch(`/users/${user.id}/`, formData)
      setUser(response.data)
      setIsEditing(false)
      alert('پروفایل با موفقیت بروزرسانی شد')
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('خطا در بروزرسانی پروفایل')
    } finally {
      setLoading(false)
    }
  }

  const getRoleBadge = (role) => {
    const badges = {
      admin: { text: 'ادمین', class: 'bg-gradient-to-r from-red-500 to-red-600 text-white' },
      scrum_master: { text: 'اسکرام مستر', class: 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800' },
      team_member: { text: 'عضو تیم', class: 'bg-gradient-to-r from-green-100 to-green-200 text-green-800' }
    }
    return badges[role] || badges.team_member
  }

  const roleBadge = getRoleBadge(user?.role)

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-gray-800">پروفایل کاربری</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* کارت پروفایل */}
        <div className="lg:col-span-1">
          <div className="card text-center">
            <div className="relative inline-block mb-4">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary-200 shadow-lg mx-auto">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-200 to-purple-200 flex items-center justify-center text-4xl font-bold text-gray-800">
                    {user?.first_name?.[0]}{user?.last_name?.[0]}
                  </div>
                )}
              </div>
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-[#2B2B2B] text-white p-2 rounded-full cursor-pointer hover:bg-[#333333] transition-colors shadow-lg">
                  <Camera size={20} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {user?.first_name} {user?.last_name}
            </h2>
            <p className="text-gray-600 mb-3">@{user?.username}</p>
            <span className={`badge ${roleBadge.class} mb-4`}>
              {roleBadge.text}
            </span>

            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-primary w-full flex items-center justify-center gap-2 mt-4"
              >
                <Edit2 size={18} />
                ویرایش پروفایل
              </button>
            )}
          </div>
        </div>

        {/* اطلاعات کاربری */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">اطلاعات شخصی</h3>
              {isEditing && (
                <div className="flex gap-2">
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Save size={18} />
                    {loading ? 'در حال ذخیره...' : 'ذخیره'}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false)
                      setFormData({
                        first_name: user.first_name || '',
                        last_name: user.last_name || '',
                        email: user.email || '',
                        phone: user.phone || '',
                        expertise: user.expertise || '',
                        bio: user.bio || ''
                      })
                    }}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <X size={18} />
                    انصراف
                  </button>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    نام
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      className="input"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-2xl text-gray-800">
                      {user?.first_name || '-'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    نام خانوادگی
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      className="input"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-2xl text-gray-800">
                      {user?.last_name || '-'}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                  <Mail size={16} />
                  ایمیل
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-2xl text-gray-800">
                    {user?.email || '-'}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                  <Phone size={16} />
                  شماره تماس
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input"
                    placeholder="09123456789"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-2xl text-gray-800">
                    {user?.phone || '-'}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                  <Briefcase size={16} />
                  تخصص
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.expertise}
                    onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                    className="input"
                    placeholder="مثلاً: توسعه‌دهنده فرانت‌اند"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-2xl text-gray-800">
                    {user?.expertise || '-'}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  درباره من
                </label>
                {isEditing ? (
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="input"
                    rows="4"
                    placeholder="چند خط درباره خودتان بنویسید..."
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-2xl text-gray-800 min-h-[100px]">
                    {user?.bio || '-'}
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { Plus, Calendar, Clock, MapPin, Video, X, Users, Trash2 } from 'lucide-react'
import { toJalali, toJalaliDateTime } from '../utils/dateUtils'

export default function Meetings() {
  const { user } = useAuth()
  const [meetings, setMeetings] = useState([])
  const [users, setUsers] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    meeting_date: '',
    duration_minutes: 60,
    location: '',
    meeting_link: '',
    attendee_ids: []
  })

  const isAdmin = user?.role === 'admin' || user?.role === 'scrum_master'

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [meetingsRes, usersRes] = await Promise.all([
        api.get('/meetings/'),
        isAdmin ? api.get('/users/') : Promise.resolve({ data: [] })
      ])
      setMeetings(meetingsRes.data.results || [])
      setUsers(usersRes.data.results || usersRes.data || [])
      setLoading(false)
    } catch (error) {
      console.error('Error loading data:', error)
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // تبدیل duration_minutes به عدد
    const submitData = {
      ...formData,
      duration_minutes: parseInt(formData.duration_minutes) || 60
    }
    
    console.log('Submitting meeting:', submitData)
    console.log('Meeting date type:', typeof submitData.meeting_date)
    console.log('Duration type:', typeof submitData.duration_minutes)
    console.log('Attendee IDs:', submitData.attendee_ids)
    
    try {
      const response = await api.post('/meetings/', submitData)
      console.log('Meeting created:', response.data)
      setShowModal(false)
      setFormData({
        title: '',
        description: '',
        meeting_date: '',
        duration_minutes: 60,
        location: '',
        meeting_link: '',
        attendee_ids: []
      })
      loadData()
    } catch (error) {
      console.error('Error creating meeting:', error)
      console.error('Error response:', error.response?.data)
      console.error('Error status:', error.response?.status)
      console.error('Error headers:', error.response?.headers)
      alert('خطا در ایجاد جلسه:\n' + JSON.stringify(error.response?.data, null, 2))
    }
  }

  const toggleAttendee = (userId) => {
    setFormData(prev => ({
      ...prev,
      attendee_ids: prev.attendee_ids.includes(userId)
        ? prev.attendee_ids.filter(id => id !== userId)
        : [...prev.attendee_ids, userId]
    }))
  }

  const handleDeleteMeeting = async (meetingId) => {
    if (!window.confirm('آیا از حذف این جلسه اطمینان دارید؟')) return
    
    try {
      await api.delete(`/meetings/${meetingId}/`)
      setMeetings(prev => prev.filter(meeting => meeting.id !== meetingId))
    } catch (error) {
      console.error('Error deleting meeting:', error)
      alert('خطا در حذف جلسه')
    }
  }

  if (loading) return <div className="text-center py-12">در حال بارگذاری...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-800">جلسات</h1>
        {isAdmin && (
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            جلسه جدید
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {meetings.map(meeting => {
          const meetingDate = new Date(meeting.meeting_date)
          const isPast = meetingDate < new Date()

          return (
            <div 
              key={meeting.id} 
              className={`card ${isPast ? 'opacity-60' : ''}`}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex-1">{meeting.title}</h3>
                <div className="flex items-center gap-2">
                  {!isPast && (
                    <span className="badge bg-gradient-to-r from-green-100 to-green-200 text-green-800">
                      آینده
                    </span>
                  )}
                  {user?.role === 'admin' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteMeeting(meeting.id)
                      }}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="حذف جلسه"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>

              {meeting.description && (
                <p className="text-gray-600 text-sm mb-4">{meeting.description}</p>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-700 bg-blue-50 rounded-2xl p-3">
                  <Calendar size={16} className="text-blue-600" />
                  <span>{toJalaliDateTime(meetingDate)}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-700 bg-purple-50 rounded-2xl p-3">
                  <Clock size={16} className="text-purple-600" />
                  <span>{meeting.duration_minutes} دقیقه</span>
                </div>

                {meeting.location && (
                  <div className="flex items-center gap-2 text-sm text-gray-700 bg-orange-50 rounded-2xl p-3">
                    <MapPin size={16} className="text-orange-600" />
                    <span>{meeting.location}</span>
                  </div>
                )}

                {meeting.meeting_link && (
                  <a 
                    href={meeting.meeting_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 rounded-2xl p-3 hover:bg-blue-100 transition-colors"
                  >
                    <Video size={16} />
                    <span>لینک جلسه</span>
                  </a>
                )}

                <div className="pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users size={16} />
                    <span>{meeting.attendees?.length || 0} شرکت‌کننده</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {meetings.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-gray-500 mb-4">هنوز جلسه‌ای ایجاد نشده است</p>
          {isAdmin && (
            <button onClick={() => setShowModal(true)} className="btn-primary">
              اولین جلسه را بسازید
            </button>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">جلسه جدید</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">عنوان جلسه</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">تاریخ و ساعت</label>
                  <input
                    type="datetime-local"
                    value={formData.meeting_date}
                    onChange={(e) => setFormData({ ...formData, meeting_date: e.target.value })}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">مدت زمان (دقیقه)</label>
                  <input
                    type="number"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                    className="input"
                    min="15"
                    step="15"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">مکان</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="input"
                  placeholder="اتاق جلسات، آنلاین، ..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">لینک جلسه (اختیاری)</label>
                <input
                  type="url"
                  value={formData.meeting_link}
                  onChange={(e) => setFormData({ ...formData, meeting_link: e.target.value })}
                  className="input"
                  placeholder="https://meet.google.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">شرکت‌کنندگان</label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border-2 border-gray-200 rounded-2xl">
                  {users.map(u => (
                    <label key={u.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-xl cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.attendee_ids.includes(u.id)}
                        onChange={() => toggleAttendee(u.id)}
                        className="rounded"
                      />
                      <span className="text-sm">{u.first_name} {u.last_name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">ایجاد جلسه</button>
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

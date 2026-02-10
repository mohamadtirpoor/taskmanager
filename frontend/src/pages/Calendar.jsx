import { useState, useEffect } from 'react'
import api from '../services/api'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Users, CheckCircle } from 'lucide-react'
import { toJalali, getJalaliMonthName } from '../utils/dateUtils'

export default function Calendar() {
  const [tasks, setTasks] = useState([])
  const [meetings, setMeetings] = useState([])
  const [sprints, setSprints] = useState([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [tasksRes, meetingsRes, sprintsRes] = await Promise.all([
        api.get('/tasks/calendar/'),
        api.get('/meetings/calendar/'),
        api.get('/sprints/')
      ])
      setTasks(tasksRes.data.results || tasksRes.data || [])
      setMeetings(meetingsRes.data.results || meetingsRes.data || [])
      setSprints(sprintsRes.data.results || sprintsRes.data || [])
      setLoading(false)
    } catch (error) {
      console.error('Error loading calendar data:', error)
      setLoading(false)
    }
  }

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const days = []

    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null)
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }

  const getItemsForDay = (date) => {
    if (!date) return { tasks: [], meetings: [], sprints: [] }
    
    const dayTasks = tasks.filter(task => {
      const taskDate = new Date(task.deadline)
      return taskDate.toDateString() === date.toDateString()
    })
    
    const dayMeetings = meetings.filter(meeting => {
      const meetingDate = new Date(meeting.meeting_date)
      return meetingDate.toDateString() === date.toDateString()
    })
    
    const daySprints = sprints.filter(sprint => {
      const startDate = new Date(sprint.start_date)
      const endDate = new Date(sprint.end_date)
      return date >= startDate && date <= endDate
    })
    
    return { tasks: dayTasks, meetings: dayMeetings, sprints: daySprints }
  }

  const days = getDaysInMonth(currentDate)
  const monthName = getJalaliMonthName(currentDate)

  if (loading) return <div className="text-center py-12">در حال بارگذاری...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">تقویم</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ChevronRight size={20} />
          </button>
          <span className="font-bold text-gray-800 min-w-[150px] text-center">{monthName}</span>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
        </div>
      </div>

      <div className="card">
        <div className="grid grid-cols-7 gap-2">
          {['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'].map(day => (
            <div key={day} className="text-center font-bold text-gray-600 py-2">
              {day}
            </div>
          ))}

          {days.map((day, index) => {
            const { tasks: dayTasks, meetings: dayMeetings, sprints: daySprints } = getItemsForDay(day)
            const isToday = day && day.toDateString() === new Date().toDateString()
            const hasItems = dayTasks.length > 0 || dayMeetings.length > 0 || daySprints.length > 0

            return (
              <div
                key={index}
                className={`min-h-[120px] p-2 rounded-xl border-2 transition-colors ${
                  day
                    ? isToday
                      ? 'border-primary-500 bg-primary-50'
                      : hasItems
                      ? 'border-gray-200 hover:border-gray-300 bg-white'
                      : 'border-gray-100 hover:border-gray-200 bg-white'
                    : 'border-transparent'
                }`}
              >
                {day && (
                  <>
                    <div className={`text-sm font-bold mb-2 ${isToday ? 'text-primary-600' : 'text-gray-600'}`}>
                      {day.getDate()}
                    </div>
                    <div className="space-y-1">
                      {/* نمایش اسپرینت‌ها */}
                      {daySprints.map(sprint => (
                        <div
                          key={`sprint-${sprint.id}`}
                          className="text-xs p-1.5 rounded-lg bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 flex items-center gap-1"
                          title={sprint.title}
                        >
                          <CheckCircle size={12} />
                          <div className="truncate">{sprint.title}</div>
                        </div>
                      ))}
                      
                      {/* نمایش جلسات */}
                      {dayMeetings.map(meeting => (
                        <div
                          key={`meeting-${meeting.id}`}
                          className="text-xs p-1.5 rounded-lg bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 flex items-center gap-1"
                          title={meeting.title}
                        >
                          <Users size={12} />
                          <div className="truncate">{meeting.title}</div>
                        </div>
                      ))}
                      
                      {/* نمایش تسک‌ها */}
                      {dayTasks.map(task => (
                        <div
                          key={`task-${task.id}`}
                          className={`text-xs p-1.5 rounded-lg flex items-center gap-1 ${
                            task.status === 'done'
                              ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800'
                              : task.status === 'in_progress'
                              ? 'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800'
                              : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800'
                          }`}
                          title={task.title}
                        >
                          <CalendarIcon size={12} />
                          <div className="truncate">{task.title}</div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await login(username, password)
      navigate('/')
    } catch (err) {
      setError('نام کاربری یا رمز عبور اشتباه است')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mb-4">
            <span className="text-white font-bold text-2xl">د</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">داده نگار اقتصاد</h1>
          <p className="text-gray-600">سیستم مدیریت تسک و برنامه‌ریزی</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">ورود به سیستم</h2>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">نام کاربری</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input"
                placeholder="نام کاربری خود را وارد کنید"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">رمز عبور</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="رمز عبور خود را وارد کنید"
                required
              />
            </div>

            <button type="submit" className="btn-primary w-full mt-6">
              ورود
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          نسخه دمو - برای تست از نام کاربری و رمز عبور admin استفاده کنید
        </p>
      </div>
    </div>
  )
}

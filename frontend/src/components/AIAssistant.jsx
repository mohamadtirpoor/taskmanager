import { useState } from 'react'
import { MessageSquare, Send, Sparkles } from 'lucide-react'
import api from '../services/api'

export default function AIAssistant() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAsk = async () => {
    if (!question.trim()) return
    setLoading(true)
    try {
      const res = await api.post('/ai/ask/', { question })
      setAnswer(res.data.answer)
    } catch (err) {
      setAnswer('متاسفانه خطایی رخ داد. لطفا دوباره تلاش کنید.')
    }
    setLoading(false)
  }

  const quickQuestions = [
    'امروز چه تسک‌هایی دارم؟',
    'کدام تسک‌ها عقب افتاده‌اند؟',
    'آمار عملکرد من چطور است؟'
  ]

  return (
    <div className="card bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 border-2 border-purple-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-3 shadow-lg">
          <Sparkles className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">دستیار هوشمند</h2>
          <p className="text-sm text-gray-600">سوالات خود را از من بپرسید</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => setQuestion(q)}
              className="text-sm px-4 py-2 bg-white rounded-2xl text-gray-700 hover:bg-purple-100 transition-all shadow-sm hover:shadow-md border border-purple-100"
            >
              {q}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
            placeholder="سوال خود را بپرسید..."
            className="input flex-1"
            disabled={loading}
          />
          <button
            onClick={handleAsk}
            disabled={loading}
            className="btn-primary flex items-center gap-2 min-w-[120px] justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>در حال پردازش...</span>
              </>
            ) : (
              <>
                <Send size={18} />
                <span>ارسال</span>
              </>
            )}
          </button>
        </div>

        {answer && (
          <div className="bg-white rounded-2xl p-6 border-2 border-purple-200 shadow-md">
            <div className="flex items-start gap-3">
              <div className="bg-purple-100 rounded-xl p-2">
                <MessageSquare className="text-purple-600" size={20} />
              </div>
              <div className="flex-1">
                <p className="text-gray-800 leading-relaxed">{answer}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

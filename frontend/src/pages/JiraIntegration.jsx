import { useState, useEffect } from 'react';
import { api } from '../services/api';
import Layout from '../components/Layout';

export default function JiraIntegration() {
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [syncStatus, setSyncStatus] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    loadSyncStatus();
  }, []);

  const showMessage = (text, type = 'success') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  const testConnection = async () => {
    setLoading(true);
    try {
      const response = await api.get('/jira/test_connection/');
      setConnectionStatus(response.data);
      showMessage(response.data.message, response.data.success ? 'success' : 'error');
    } catch (error) {
      showMessage('خطا در تست اتصال', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadSyncStatus = async () => {
    try {
      const response = await api.get('/jira/sync_status/');
      setSyncStatus(response.data);
    } catch (error) {
      console.error('Error loading sync status:', error);
    }
  };

  const syncAllToJira = async () => {
    if (!confirm('آیا مطمئن هستید که می‌خواهید همه داده‌ها را به Jira منتقل کنید؟')) {
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/jira/sync_all_to_jira/');
      showMessage(response.data.message);
      loadSyncStatus();
    } catch (error) {
      showMessage('خطا در همگام‌سازی', 'error');
    } finally {
      setLoading(false);
    }
  };

  const syncAllFromJira = async () => {
    if (!confirm('آیا مطمئن هستید که می‌خواهید همه داده‌ها را از Jira دریافت کنید؟')) {
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/jira/sync_all_from_jira/');
      showMessage(response.data.message);
      loadSyncStatus();
    } catch (error) {
      showMessage('خطا در همگام‌سازی', 'error');
    } finally {
      setLoading(false);
    }
  };

  const syncRecentFromJira = async () => {
    setLoading(true);
    try {
      const response = await api.post('/jira/sync_recent_from_jira/', { hours: 24 });
      showMessage(response.data.message);
      loadSyncStatus();
    } catch (error) {
      showMessage('خطا در همگام‌سازی', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">اتصال به Jira</h1>
          <p className="text-gray-600">مدیریت همگام‌سازی با Jira</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            messageType === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {message}
          </div>
        )}

        {/* Connection Status */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">وضعیت اتصال</h2>
          <div className="flex items-center justify-between">
            <div>
              {connectionStatus && (
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    connectionStatus.success ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <span className={connectionStatus.success ? 'text-green-700' : 'text-red-700'}>
                    {connectionStatus.message}
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={testConnection}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'در حال تست...' : 'تست اتصال'}
            </button>
          </div>
        </div>

        {/* Sync Status */}
        {syncStatus && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">وضعیت همگام‌سازی</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Tasks */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-700 mb-2">تسک‌ها</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">همگام‌سازی شده:</span>
                    <span className="font-semibold text-green-600">{syncStatus.tasks.synced}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">همگام‌سازی نشده:</span>
                    <span className="font-semibold text-orange-600">{syncStatus.tasks.not_synced}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-600">مجموع:</span>
                    <span className="font-semibold">{syncStatus.tasks.total}</span>
                  </div>
                </div>
              </div>

              {/* Sprints */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-700 mb-2">اسپرینت‌ها</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">همگام‌سازی شده:</span>
                    <span className="font-semibold text-green-600">{syncStatus.sprints.synced}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">همگام‌سازی نشده:</span>
                    <span className="font-semibold text-orange-600">{syncStatus.sprints.not_synced}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-600">مجموع:</span>
                    <span className="font-semibold">{syncStatus.sprints.total}</span>
                  </div>
                </div>
              </div>

              {/* Backlogs */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-700 mb-2">بک‌لاگ‌ها</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">همگام‌سازی شده:</span>
                    <span className="font-semibold text-green-600">{syncStatus.backlogs.synced}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">همگام‌سازی نشده:</span>
                    <span className="font-semibold text-orange-600">{syncStatus.backlogs.not_synced}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-600">مجموع:</span>
                    <span className="font-semibold">{syncStatus.backlogs.total}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sync Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">عملیات همگام‌سازی</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={syncAllToJira}
              disabled={loading}
              className="p-4 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 disabled:opacity-50 transition-colors"
            >
              <div className="text-center">
                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <div className="font-semibold">انتقال به Jira</div>
                <div className="text-sm text-gray-600 mt-1">همه داده‌ها را به Jira منتقل کن</div>
              </div>
            </button>

            <button
              onClick={syncAllFromJira}
              disabled={loading}
              className="p-4 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 disabled:opacity-50 transition-colors"
            >
              <div className="text-center">
                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                <div className="font-semibold">دریافت از Jira</div>
                <div className="text-sm text-gray-600 mt-1">همه داده‌ها را از Jira دریافت کن</div>
              </div>
            </button>

            <button
              onClick={syncRecentFromJira}
              disabled={loading}
              className="p-4 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 disabled:opacity-50 transition-colors"
            >
              <div className="text-center">
                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <div className="font-semibold">تغییرات اخیر</div>
                <div className="text-sm text-gray-600 mt-1">دریافت تغییرات 24 ساعت اخیر</div>
              </div>
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 rounded-lg p-6 mt-6">
          <h3 className="font-bold text-blue-900 mb-3">راهنمای استفاده</h3>
          <ul className="space-y-2 text-blue-800 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>ابتدا اطلاعات Jira خود را در فایل .env تنظیم کنید</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>با دکمه "تست اتصال" از صحت اتصال اطمینان حاصل کنید</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>برای همگام‌سازی اولیه از "انتقال به Jira" یا "دریافت از Jira" استفاده کنید</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>برای همگام‌سازی مداوم، Webhook را در Jira تنظیم کنید</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>آدرس Webhook: <code className="bg-white px-2 py-1 rounded">https://your-domain.com/api/jira/webhook/</code></span>
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}

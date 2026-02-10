import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import Sprints from './pages/Sprints'
import Calendar from './pages/Calendar'
import Meetings from './pages/Meetings'
import Backlogs from './pages/Backlogs'
import TeamManagement from './pages/TeamManagement'
import Profile from './pages/Profile'
import JiraIntegration from './pages/JiraIntegration'
import Layout from './components/Layout'

function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" />
}

function AdminRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" />
  if (user.role !== 'admin') return <Navigate to="/" />
  return children
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="sprints" element={<Sprints />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="meetings" element={<Meetings />} />
            <Route path="backlogs" element={<Backlogs />} />
            <Route path="profile" element={<Profile />} />
            <Route path="team" element={<AdminRoute><TeamManagement /></AdminRoute>} />
            <Route path="jira" element={<AdminRoute><JiraIntegration /></AdminRoute>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

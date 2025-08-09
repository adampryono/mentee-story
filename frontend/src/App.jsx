import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './hooks/useAuth'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import MentorDashboard from './pages/MentorDashboard'
import CreateReport from './pages/CreateReport'
import ReportHistory from './pages/ReportHistory'
import AdminDashboard from './pages/AdminDashboard'
import ManageMentors from './pages/ManageMentors'
import ManageMentees from './pages/ManageMentees'
import ManageTopics from './pages/ManageTopics'
import AllReports from './pages/AllReports'

function RoleBasedRedirect() {
  const { user } = useAuth()
  
  if (user?.role === 'admin') {
    return <Navigate to="/admin" replace />
  } else if (user?.role === 'mentor') {
    return <Navigate to="/mentor-dashboard" replace />
  } else {
    return <Navigate to="/dashboard" replace />
  }
}

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<RoleBasedRedirect />} />
          
          {/* Mentor Routes */}
          <Route path="dashboard" element={<MentorDashboard />} />
          <Route path="mentor-dashboard" element={<MentorDashboard />} />
          <Route path="create-report/:menteeId" element={<CreateReport />} />
          <Route path="reports" element={<ReportHistory />} />
          
          {/* Admin Routes */}
          <Route path="admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
          <Route path="admin/mentors" element={<ProtectedRoute adminOnly><ManageMentors /></ProtectedRoute>} />
          <Route path="admin/mentees" element={<ProtectedRoute adminOnly><ManageMentees /></ProtectedRoute>} />
          <Route path="admin/topics" element={<ProtectedRoute adminOnly><ManageTopics /></ProtectedRoute>} />
          <Route path="admin/reports" element={<ProtectedRoute adminOnly><AllReports /></ProtectedRoute>} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App

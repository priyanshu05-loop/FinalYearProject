import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

// Pages
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import DashboardPage from '@/pages/dashboard/DashboardPage'
import ProfilePage from '@/pages/profile/ProfilePage'
import ResumeUploadPage from '@/pages/resume/ResumeUploadPage'
import InterviewSetupPage from '@/pages/interview/InterviewSetupPage'
import InterviewPage from '@/pages/interview/InterviewPage'
import ResultsPage from '@/pages/results/ResultsPage'

// Components
import ProtectedRoute from '@/components/ProtectedRoute'
import Navbar from '@/components/Navbar'

export default function App() {
  const { isAuthenticated, fetchCurrentUser } = useAuthStore()

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token && !isAuthenticated) {
      fetchCurrentUser()
    }
  }, [isAuthenticated, fetchCurrentUser])

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {isAuthenticated && <Navbar />}
        
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resume"
            element={
              <ProtectedRoute>
                <ResumeUploadPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interview/new"
            element={
              <ProtectedRoute>
                <InterviewSetupPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interview/:sessionId"
            element={
              <ProtectedRoute>
                <InterviewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/results/:sessionId"
            element={
              <ProtectedRoute>
                <ResultsPage />
              </ProtectedRoute>
            }
          />

          {/* Redirect to dashboard */}
          <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

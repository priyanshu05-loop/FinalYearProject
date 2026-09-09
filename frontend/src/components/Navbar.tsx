import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center">
            <h1 className="text-2xl font-bold text-primary-600">AI Interview</h1>
          </Link>

          {/* Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">
              Dashboard
            </Link>
            <Link to="/resume" className="text-gray-600 hover:text-gray-900 transition-colors">
              Resume
            </Link>
            <Link to="/interview/new" className="text-gray-600 hover:text-gray-900 transition-colors">
              Interview
            </Link>
            <Link to="/profile" className="text-gray-600 hover:text-gray-900 transition-colors">
              Profile
            </Link>
          </div>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {user?.first_name?.[0]?.toUpperCase()}
              </div>
              <span className="hidden sm:inline">{user?.first_name}</span>
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                <Link to="/profile" className="block px-4 py-2 text-gray-600 hover:bg-gray-100">
                  My Profile
                </Link>
                <Link to="/resume" className="block px-4 py-2 text-gray-600 hover:bg-gray-100">
                  My Resume
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

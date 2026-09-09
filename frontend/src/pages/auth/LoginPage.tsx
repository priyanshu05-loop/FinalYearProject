import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { ToastContainer, toast } from 'react-toastify'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, loading } = useAuthStore()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    try {
      await login(formData.email, formData.password)
      toast.success('Logged in successfully!')
      navigate('/dashboard')
    } catch (error: any) {
      const errorMsg = error.response?.data?.detail || 'Login failed'
      setErrors({ form: errorMsg })
      toast.error(errorMsg)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary-600">AI Interview</h1>
          <p className="mt-2 text-gray-600">Sign in to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {errors.form && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-700">{errors.form}</p>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="input-field mt-1"
              placeholder="you@example.com"
            />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="input-field mt-1"
              placeholder="••••••••"
            />
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        {/* Register link */}
        <p className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
            Register here
          </Link>
        </p>
      </div>
      <ToastContainer />
    </div>
  )
}

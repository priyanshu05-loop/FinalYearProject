import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { toast, ToastContainer } from 'react-toastify'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register, loading } = useAuthStore()
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    first_name: '',
    last_name: '',
    password: '',
    password2: '',
    role: 'candidate',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    if (formData.password !== formData.password2) {
      setErrors({ password2: 'Passwords do not match' })
      toast.error('Passwords do not match')
      return
    }

    try {
      await register(formData)
      toast.success('Registration successful! Please login.')
      navigate('/login')
    } catch (error: any) {
      const errorMsg = error.response?.data?.detail || 'Registration failed'
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
          <p className="mt-2 text-gray-600">Create your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {errors.form && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-700">{errors.form}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">First name</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                className="input-field mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last name</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                className="input-field mt-1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="input-field mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="input-field mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="input-field mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm password</label>
            <input
              type="password"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
              required
              className="input-field mt-1"
            />
            {errors.password2 && <p className="form-error">{errors.password2}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        {/* Login link */}
        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
            Login here
          </Link>
        </p>
      </div>
      <ToastContainer />
    </div>
  )
}

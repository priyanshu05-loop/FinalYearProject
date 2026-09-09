import { create } from 'zustand'
import { apiClient } from '@/services/api'

export interface User {
  id: number
  email: string
  username: string
  first_name: string
  last_name: string
  role: 'candidate' | 'recruiter' | 'admin'
  profile_picture?: string
  bio?: string
  total_interviews: number
  average_score: number
  created_at: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null

  // Actions
  login: (email: string, password: string) => Promise<void>
  register: (userData: any) => Promise<void>
  logout: () => Promise<void>
  fetchCurrentUser: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ loading: true, error: null })
    try {
      const response = await apiClient.login(email, password)
      localStorage.setItem('access_token', response.data.access)
      localStorage.setItem('refresh_token', response.data.refresh)

      // Fetch user info
      const userResponse = await apiClient.getCurrentUser()
      set({
        user: userResponse.data,
        isAuthenticated: true,
        loading: false,
      })
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Login failed',
        loading: false,
      })
      throw error
    }
  },

  register: async (userData: any) => {
    set({ loading: true, error: null })
    try {
      await apiClient.register(userData)
      set({ loading: false })
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Registration failed',
        loading: false,
      })
      throw error
    }
  },

  logout: async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token')
      if (refreshToken) {
        await apiClient.logout(refreshToken)
      }
    } catch (error) {
      // Ignore errors on logout
    } finally {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      set({ user: null, isAuthenticated: false })
    }
  },

  fetchCurrentUser: async () => {
    set({ loading: true })
    try {
      const response = await apiClient.getCurrentUser()
      set({
        user: response.data,
        isAuthenticated: true,
        loading: false,
      })
    } catch (error) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
      })
    }
  },

  clearError: () => set({ error: null }),
}))

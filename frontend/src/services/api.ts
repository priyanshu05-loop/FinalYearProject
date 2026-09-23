import axios, { AxiosInstance, AxiosError } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '30000')

class APIClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Add request interceptor to include auth token
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('access_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Handle unauthorized - redirect to login
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  // Auth endpoints
  login(email: string, password: string) {
    return this.client.post('/users/login/', { email, password })
  }

  register(userData: any) {
    return this.client.post('/users/register/', userData)
  }

  logout(refreshToken: string) {
    return this.client.post('/users/logout/', { refresh: refreshToken })
  }

  refreshToken(refreshToken: string) {
    return this.client.post('/users/login/refresh/', { refresh: refreshToken })
  }

  // User endpoints
  getCurrentUser() {
    return this.client.get('/users/me/')
  }

  getUserProfile() {
    return this.client.get('/users/profile/')
  }

  getJobRoles() {
    return this.client.get('/interviews/job-roles/')
  }

  updateUserProfile(data: any) {
    return this.client.put('/users/profile/', data)
  }

  changePassword(oldPassword: string, newPassword: string, newPasswordConfirm: string) {
    return this.client.put('/users/change-password/', {
      old_password: oldPassword,
      new_password: newPassword,
      new_password_confirm: newPasswordConfirm,
    })
  }

  // Resume endpoints
  uploadResume(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    return this.client.post('/resume/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  }

  getResume() {
    return this.client.get('/resume/')
  }

  // Interview endpoints
  createInterviewSession(jobRoleId: number) {
    return this.client.post('/interviews/sessions/', { job_role_id: jobRoleId })
  }

  getInterviewSessions() {
    return this.client.get('/interviews/sessions/')
  }

  getInterviewSession(sessionId: number) {
    return this.client.get(`/interviews/sessions/${sessionId}/`)
  }

  getQuestions(sessionId: number) {
    return this.client.get('/interviews/questions/', { params: { session_id: sessionId } })
  }

  submitAnswer(questionId: number, data: any) {
    const formData = new FormData()
    formData.append('transcribed_text', data.transcribed_text)
    formData.append('duration_seconds', data.duration_seconds)
    if (data.video_blob) {
      formData.append('video', data.video_blob, 'answer_video.webm')
    }
    if (data.audio_blob) {
      formData.append('audio', data.audio_blob, 'answer_audio.wav')
    }
    return this.client.post(`/interviews/questions/${questionId}/submit/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  }

  getSessionReport(sessionId: number) {
    return this.client.get(`/interviews/sessions/${sessionId}/report/`)
  }

  // AI endpoints
  generateQuestions(sessionId: number) {
    return this.client.post(`/ai/generate-questions/`, { session_id: sessionId })
  }

  getAITask(taskId: number) {
    return this.client.get(`/ai/tasks/${taskId}/`)
  }
}

export const apiClient = new APIClient()

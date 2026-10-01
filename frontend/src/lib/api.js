// Axios instance dengan interceptor CSRF dan auto-redirect 401.
import axios from 'axios'
import useAuthStore from '@/stores/authStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // kirim session cookie
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor — lampirkan CSRF token dari store
api.interceptors.request.use((config) => {
  const csrfToken = useAuthStore.getState().csrfToken
  if (csrfToken) {
    config.headers['X-CSRF-Token'] = csrfToken
  }
  return config
})

// Response interceptor — auto logout jika 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearAuth()
      // Hanya redirect jika kita tidak sedang berada di halaman login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export default api

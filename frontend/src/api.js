// frontend/src/lib/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 
           'http://localhost/jember-penduduk/backend/api',
  withCredentials: true,   // penting: kirim cookie session PHP
  headers: { 'Content-Type': 'application/json' },
})

// Interceptor: auto redirect ke /login kalau 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // opsional: window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
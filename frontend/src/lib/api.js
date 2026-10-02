import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost/GIS/backend/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

export default api
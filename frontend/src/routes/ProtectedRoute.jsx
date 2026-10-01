// HOC route protection — cek sesi aktif ke server saat mount.
import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import api from '@/lib/api'
import useAuthStore from '@/stores/authStore'

export default function ProtectedRoute() {
  const { user, setAuth, clearAuth } = useAuthStore()
  const [status, setStatus] = useState('checking') // 'checking' | 'ok' | 'denied'

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await api.get('/auth.php?action=me')
        setAuth(res.data.data, res.data.data.csrf_token)
        setStatus('ok')
      } catch (err) {
        clearAuth()
        setStatus('denied')
      }
    }
    checkSession()
  }, []) // eslint-disable-line

  if (status === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-3 text-zinc-400">
          <div className="w-6 h-6 border-2 border-jember-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Memeriksa sesi...</span>
        </div>
      </div>
    )
  }

  if (status === 'denied') {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

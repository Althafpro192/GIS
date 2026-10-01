// Zustand store untuk auth — menyimpan info user & CSRF token.
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      csrfToken: null,

      setAuth: (user, csrfToken) => set({ user, csrfToken }),
      clearAuth: () => set({ user: null, csrfToken: null }),
    }),
    {
      name: 'jember-auth',
      // Simpan hanya user info; CSRF token selalu diperbarui dari server
      partialize: (state) => ({ user: state.user }),
    },
  ),
)

export default useAuthStore

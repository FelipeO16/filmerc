import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginRequest } from '@/types'
import { UserStatus } from '@/types'
import { useNotificationStore } from './notification'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value && !!token.value)

  const notificationStore = useNotificationStore()

  function initializeAuth() {
    const storedUser = localStorage.getItem('auth_user')
    const storedToken = localStorage.getItem('auth_token')

    if (storedUser && storedToken) {
      try {
        user.value = JSON.parse(storedUser)
        token.value = storedToken
      } catch (error) {
        console.error('Erro ao analisar dados de autenticação armazenados:', error)
        clearAuth()
      }
    }
  }

  async function login(credentials: LoginRequest): Promise<boolean> {
    try {
      const users = getStoredUsers()
      const foundUser = users.find(
        u => u.document === credentials.document &&
          u.password === credentials.password &&
          u.status === UserStatus.ACTIVE
      )

      if (!foundUser) {
        notificationStore.showError('Credenciais inválidas ou usuário inativo')
        return false
      }

      user.value = foundUser
      token.value = `token_${foundUser.id}_${Date.now()}`

      localStorage.setItem('auth_user', JSON.stringify(foundUser))
      localStorage.setItem('auth_token', token.value)

      notificationStore.showSuccess('Login realizado com sucesso')
      return true
    } catch (error) {
      console.error('Erro no login:', error)
      notificationStore.showError('Falha no login')
      return false
    }
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_user')
    localStorage.removeItem('auth_token')
    notificationStore.showSuccess('Logout realizado com sucesso')
  }

  function clearAuth() {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_user')
    localStorage.removeItem('auth_token')
  }

  function getStoredUsers(): User[] {
    try {
      const stored = localStorage.getItem('users')
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Erro ao obter usuários armazenados:', error)
      return []
    }
  }

  function updateCurrentUser(updatedUser: User) {
    if (user.value && user.value.id === updatedUser.id) {
      user.value = updatedUser
      localStorage.setItem('auth_user', JSON.stringify(updatedUser))
    }
  }

  return {
    user: computed(() => user.value),
    token: computed(() => token.value),
    isAuthenticated,
    initializeAuth,
    login,
    logout,
    clearAuth,
    updateCurrentUser,
  }
})

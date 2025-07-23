import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, CreateUserRequest, UpdateUserRequest, UserFilters } from '@/types'
import { UserStatus } from '@/types'
import { useNotificationStore } from './notification'
import { useAuthStore } from './auth'

export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>([])
  const loading = ref(false)

  const notificationStore = useNotificationStore()
  const authStore = useAuthStore()

  function loadUsers() {
    try {
      const stored = localStorage.getItem('users')
      if (stored) {
        users.value = JSON.parse(stored).map((user: User) => ({
          ...user,
          createdAt: new Date(user.createdAt),
          updatedAt: new Date(user.updatedAt),
        }))
      } else {
        createDefaultUser()
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
      notificationStore.showError('Falha ao carregar usuários')
    }
  }

  function saveUsers() {
    try {
      localStorage.setItem('users', JSON.stringify(users.value))
    } catch (error) {
      console.error('Erro ao salvar usuários:', error)
      notificationStore.showError('Falha ao salvar usuários')
    }
  }

  function createDefaultUser() {
    const defaultUser: User = {
      id: 'user_1',
      name: 'Administrator',
      document: '12345678901',
      password: 'admin123',
      status: UserStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    users.value = [defaultUser]
    saveUsers()
  }

  async function createUser(userData: CreateUserRequest): Promise<boolean> {
    try {
      loading.value = true

      if (users.value.some(user => user.document === userData.document)) {
        notificationStore.showError('Usuário com este documento já existe')
        return false
      }

      const newUser: User = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      users.value.push(newUser)
      saveUsers()
      notificationStore.showSuccess('Usuário criado com sucesso')
      return true
    } catch (error) {
      console.error('Erro ao criar usuário:', error)
      notificationStore.showError('Falha ao criar usuário')
      return false
    } finally {
      loading.value = false
    }
  }

  async function updateUser(id: string, userData: UpdateUserRequest): Promise<boolean> {
    try {
      loading.value = true

      const userIndex = users.value.findIndex(user => user.id === id)
      if (userIndex === -1) {
        notificationStore.showError('Usuário não encontrado')
        return false
      }

      if (userData.document && users.value.some(user => user.document === userData.document && user.id !== id)) {
        notificationStore.showError('Usuário com este documento já existe')
        return false
      }

      const updatedUser = {
        ...users.value[userIndex],
        ...userData,
        updatedAt: new Date(),
      }

      users.value[userIndex] = updatedUser
      saveUsers()

      authStore.updateCurrentUser(updatedUser)

      notificationStore.showSuccess('Usuário atualizado com sucesso')
      return true
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error)
      notificationStore.showError('Falha ao atualizar usuário')
      return false
    } finally {
      loading.value = false
    }
  }

  async function deleteUser(id: string): Promise<boolean> {
    try {
      loading.value = true

      const userIndex = users.value.findIndex(user => user.id === id)
      if (userIndex === -1) {
        notificationStore.showError('Usuário não encontrado')
        return false
      }

      if (authStore.user?.id === id) {
        notificationStore.showError('Não é possível excluir o usuário atualmente logado')
        return false
      }

      users.value[userIndex] = {
        ...users.value[userIndex],
        status: UserStatus.INACTIVE,
        updatedAt: new Date(),
      }

      saveUsers()
      notificationStore.showSuccess('Usuário desativado com sucesso')
      return true
    } catch (error) {
      console.error('Erro ao excluir usuário:', error)
      notificationStore.showError('Falha ao desativar usuário')
      return false
    } finally {
      loading.value = false
    }
  }

  function getUserById(id: string): User | undefined {
    return users.value.find(user => user.id === id)
  }

  const filteredUsers = computed(() => {
    return (filters: UserFilters) => {
      let result = users.value

      if (filters.search) {
        const search = filters.search.toLowerCase()
        result = result.filter(user =>
          user.name.toLowerCase().includes(search) ||
          user.document.includes(search)
        )
      }

      if (filters.status) {
        result = result.filter(user => user.status === filters.status)
      }

      return result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    }
  })

  const activeUsers = computed(() => users.value.filter(user => user.status === UserStatus.ACTIVE))

  return {
    users,
    loading,
    loadUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserById,
    filteredUsers,
    activeUsers,
  }
})

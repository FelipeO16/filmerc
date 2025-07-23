import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../auth'
import { UserStatus } from '@/types'


const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    localStorageMock.getItem.mockClear()
    localStorageMock.setItem.mockClear()
    localStorageMock.removeItem.mockClear()
  })

  describe('Estado inicial', () => {
    it('deve inicializar com usuário e token nulos', () => {
      const authStore = useAuthStore()
      expect(authStore.user).toBeNull()
      expect(authStore.token).toBeNull()
      expect(authStore.isAuthenticated).toBe(false)
    })
  })

  describe('initializeAuth', () => {
    it('deve carregar dados de autenticação do localStorage', () => {
      const mockUser = {
        id: '1',
        name: 'Admin',
        document: '123456789',
        password: 'password',
        status: UserStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      const mockToken = 'mock-jwt-token'
      localStorageMock.getItem
        .mockReturnValueOnce(JSON.stringify(mockUser))
        .mockReturnValueOnce(mockToken)
      
      const authStore = useAuthStore()
      authStore.initializeAuth()
      
      expect(authStore.user).toMatchObject({
        id: mockUser.id,
        name: mockUser.name,
        document: mockUser.document,
        password: mockUser.password,
        status: mockUser.status,
      })
      expect(authStore.token).toBe(mockToken)
      expect(authStore.isAuthenticated).toBe(true)
    })

    it('deve manter valores nulos quando não há dados no localStorage', () => {
      localStorageMock.getItem.mockReturnValue(null)
      
      const authStore = useAuthStore()
      authStore.initializeAuth()
      
      expect(authStore.user).toBeNull()
      expect(authStore.token).toBeNull()
      expect(authStore.isAuthenticated).toBe(false)
    })

    it('deve lidar com dados inválidos no localStorage', () => {
      localStorageMock.getItem.mockReturnValue('invalid-json')
      
      const authStore = useAuthStore()
      authStore.initializeAuth()
      
      expect(authStore.user).toBeNull()
      expect(authStore.token).toBeNull()
      expect(authStore.isAuthenticated).toBe(false)
    })
  })

  describe('login', () => {
    it('deve fazer login com credenciais válidas', async () => {
      const mockUser = {
        id: '1',
        name: 'Admin',
        document: '123456789',
        password: 'password123',
        status: UserStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      localStorageMock.getItem.mockReturnValue(JSON.stringify([mockUser]))
      
      const authStore = useAuthStore()
      const credentials = {
        document: '123456789',
        password: 'password123',
      }
      
      const result = await authStore.login(credentials)
      
      expect(result).toBe(true)
      expect(authStore.user).toMatchObject({
        id: mockUser.id,
        name: mockUser.name,
        document: mockUser.document,
        password: mockUser.password,
        status: mockUser.status,
      })
      expect(authStore.token).toMatch(/^token_1_\d+$/)
      expect(authStore.isAuthenticated).toBe(true)
      expect(localStorageMock.setItem).toHaveBeenCalledWith('auth_user', expect.any(String))
      expect(localStorageMock.setItem).toHaveBeenCalledWith('auth_token', expect.any(String))
    })

    it('deve falhar com credenciais inválidas', async () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify([]))
      
      const authStore = useAuthStore()
      const credentials = {
        document: 'invalid',
        password: 'wrong',
      }
      
      const result = await authStore.login(credentials)
      
      expect(result).toBe(false)
      expect(authStore.user).toBeNull()
      expect(authStore.token).toBeNull()
      expect(authStore.isAuthenticated).toBe(false)
      expect(localStorageMock.setItem).not.toHaveBeenCalled()
    })

    it('deve falhar com usuário inativo', async () => {
      const mockUser = {
        id: '2',
        name: 'Inactive User',
        document: 'inactive',
        password: 'password',
        status: UserStatus.INACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      localStorageMock.getItem.mockReturnValue(JSON.stringify([mockUser]))
      
      const authStore = useAuthStore()
      const credentials = {
        document: 'inactive',
        password: 'password',
      }
      
      const result = await authStore.login(credentials)
      
      expect(result).toBe(false)
      expect(authStore.user).toBeNull()
      expect(authStore.token).toBeNull()
      expect(authStore.isAuthenticated).toBe(false)
    })
  })

  describe('logout', () => {
    it('deve fazer logout e limpar dados', () => {
      const mockUser = {
        id: '1',
        name: 'Admin',
        document: '123456789',
        password: 'password123',
        status: UserStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      localStorageMock.getItem.mockReturnValue(JSON.stringify([mockUser]))
      
      const authStore = useAuthStore()
      authStore.login({
        document: '123456789',
        password: 'password123',
      })
      authStore.logout()
      
      expect(authStore.user).toBeNull()
      expect(authStore.token).toBeNull()
      expect(authStore.isAuthenticated).toBe(false)
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_user')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_token')
    })

    it('deve funcionar mesmo quando já está deslogado', () => {
      const authStore = useAuthStore()
      authStore.logout()
      
      expect(authStore.user).toBeNull()
      expect(authStore.token).toBeNull()
      expect(authStore.isAuthenticated).toBe(false)
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_user')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_token')
    })
  })

  describe('clearAuth', () => {
    it('deve limpar autenticação sem mostrar notificação', () => {
      const mockUser = {
        id: '1',
        name: 'Admin',
        document: '123456789',
        password: 'password123',
        status: UserStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      localStorageMock.getItem.mockReturnValue(JSON.stringify([mockUser]))
      
      const authStore = useAuthStore()
      authStore.login({
        document: '123456789',
        password: 'password123',
      })
      authStore.clearAuth()
      
      expect(authStore.user).toBeNull()
      expect(authStore.token).toBeNull()
      expect(authStore.isAuthenticated).toBe(false)
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_user')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_token')
    })
  })

  describe('updateCurrentUser', () => {
    it('deve atualizar usuário atual quando IDs coincidem', async () => {
      const originalUser = {
        id: '1',
        name: 'Original User',
        document: '123456789',
        password: 'password',
        status: UserStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      const updatedUser = {
        ...originalUser,
        name: 'Updated User',
      }
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify([originalUser]))
      
      const authStore = useAuthStore()
      await authStore.login({
        document: '123456789',
        password: 'password',
      })
      authStore.updateCurrentUser(updatedUser)
      
      expect(authStore.user).toMatchObject({
        id: updatedUser.id,
        name: updatedUser.name,
        document: updatedUser.document,
        password: updatedUser.password,
        status: updatedUser.status,
      })
      expect(localStorageMock.setItem).toHaveBeenCalledWith('auth_user', expect.any(String))
    })

    it('não deve atualizar quando IDs não coincidem', async () => {
      const originalUser = {
        id: '1',
        name: 'Original User',
        document: '123456789',
        password: 'password',
        status: UserStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      const updatedUser = {
        id: '2',
        name: 'Updated User',
        document: '123456789',
        password: 'password',
        status: UserStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify([originalUser]))
      
      const authStore = useAuthStore()
      await authStore.login({
        document: '123456789',
        password: 'password',
      })
      authStore.updateCurrentUser(updatedUser)
      
      expect(authStore.user).toMatchObject({
        id: originalUser.id,
        name: originalUser.name,
        document: originalUser.document,
        password: originalUser.password,
        status: originalUser.status,
      })
    })

    it('não deve atualizar quando não há usuário logado', () => {
      const updatedUser = {
        id: '1',
        name: 'Updated User',
        document: '123456789',
        password: 'password',
        status: UserStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      
      const authStore = useAuthStore()
      authStore.updateCurrentUser(updatedUser)
      
      expect(authStore.user).toBeNull()
      expect(localStorageMock.setItem).not.toHaveBeenCalled()
    })
  })

  describe('Ciclo completo de autenticação', () => {
    it('deve gerenciar ciclo completo de login e logout', async () => {
      const mockUser = {
        id: '1',
        name: 'Admin',
        document: '123456789',
        password: 'password123',
        status: UserStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      localStorageMock.getItem.mockReturnValue(JSON.stringify([mockUser]))
      
      const authStore = useAuthStore()
      
      expect(authStore.isAuthenticated).toBe(false)
      expect(authStore.user).toBeNull()
      
      const credentials = {
        document: '123456789',
        password: 'password123',
      }
      const loginResult = await authStore.login(credentials)
      
      expect(loginResult).toBe(true)
      expect(authStore.isAuthenticated).toBe(true)
      expect(authStore.user).toBeDefined()
      expect(authStore.token).toBeDefined()
      
      authStore.logout()
      expect(authStore.isAuthenticated).toBe(false)
      expect(authStore.user).toBeNull()
      expect(authStore.token).toBeNull()
    })
  })
}) 
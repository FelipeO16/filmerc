import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from '../user'
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

describe('User Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    localStorageMock.getItem.mockClear()
    localStorageMock.setItem.mockClear()
  })

  describe('Estado inicial', () => {
    it('deve inicializar com array vazio de usuários', () => {
      const userStore = useUserStore()
      expect(userStore.users).toEqual([])
      expect(userStore.loading).toBe(false)
    })
  })

  describe('loadUsers', () => {
    it('deve carregar usuários do localStorage', () => {
      const mockUsers = [
        {
          id: '1',
          name: 'Admin',
          document: '123456789',
          password: 'password',
          status: UserStatus.ACTIVE,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUsers))
      
      const userStore = useUserStore()
      userStore.loadUsers()
      
      expect(userStore.users).toEqual(mockUsers)
    })

    it('deve criar usuário padrão quando não há usuários', () => {
      localStorageMock.getItem.mockReturnValue(null)
      
      const userStore = useUserStore()
      userStore.loadUsers()
      
      expect(userStore.users).toHaveLength(1)
      expect(userStore.users[0].name).toBe('Administrator')
      expect(userStore.users[0].document).toBe('12345678901')
      expect(userStore.users[0].status).toBe(UserStatus.ACTIVE)
    })
  })

  describe('createUser', () => {
    it('deve criar novo usuário', async () => {
      const userStore = useUserStore()
      const newUser = {
        name: 'Novo Usuário',
        document: '987654321',
        password: 'senha123',
        status: UserStatus.ACTIVE,
      }
      
      const result = await userStore.createUser(newUser)
      
      expect(result).toBe(true)
      expect(userStore.users).toHaveLength(1)
      expect(userStore.users[0].name).toBe(newUser.name)
      expect(userStore.users[0].document).toBe(newUser.document)
      expect(userStore.users[0].password).toBe(newUser.password)
      expect(userStore.users[0].status).toBe(newUser.status)
      expect(userStore.users[0].createdAt).toBeInstanceOf(Date)
      expect(userStore.users[0].updatedAt).toBeInstanceOf(Date)
      expect(localStorageMock.setItem).toHaveBeenCalled()
    })

    it('deve falhar ao criar usuário com documento duplicado', async () => {
      const userStore = useUserStore()
      
      await userStore.createUser({
        name: 'Usuário 1',
        document: '123456789',
        password: 'senha123',
        status: UserStatus.ACTIVE,
      })
      
      const result = await userStore.createUser({
        name: 'Usuário 2',
        document: '123456789',
        password: 'senha456',
        status: UserStatus.ACTIVE,
      })
      
      expect(result).toBe(false)
      expect(userStore.users).toHaveLength(1)
    })
  })

  describe('updateUser', () => {
    it('deve atualizar usuário existente', async () => {
      const userStore = useUserStore()
      
      await userStore.createUser({
        name: 'Usuário Original',
        document: '123456789',
        password: 'senha123',
        status: UserStatus.ACTIVE,
      })
      
      const originalUser = userStore.users[0]
      const updateData = {
        name: 'Usuário Atualizado',
        password: 'novaSenha123',
      }
      
      const result = await userStore.updateUser(originalUser.id, updateData)
      
      expect(result).toBe(true)
      expect(userStore.users[0].name).toBe('Usuário Atualizado')
      expect(userStore.users[0].password).toBe('novaSenha123')
      expect(userStore.users[0].document).toBe('123456789')
      expect(userStore.users[0].status).toBe(UserStatus.ACTIVE)
      expect(userStore.users[0].updatedAt.getTime()).toBeGreaterThanOrEqual(originalUser.updatedAt.getTime())
      expect(localStorageMock.setItem).toHaveBeenCalled()
    })

    it('deve retornar false para usuário inexistente', async () => {
      const userStore = useUserStore()
      
      const result = await userStore.updateUser('non-existent-id', {
        name: 'Novo Nome',
      })
      
      expect(result).toBe(false)
    })

    it('deve falhar ao atualizar com documento duplicado', async () => {
      const userStore = useUserStore()
      
      await userStore.createUser({
        name: 'Usuário 1',
        document: '111111111',
        password: 'senha123',
        status: UserStatus.ACTIVE,
      })
      
      await userStore.createUser({
        name: 'Usuário 2',
        document: '222222222',
        password: 'senha456',
        status: UserStatus.ACTIVE,
      })
      
      expect(userStore.users).toHaveLength(2)
      
      const user1 = userStore.users.find(u => u.document === '111111111')
      const user2 = userStore.users.find(u => u.document === '222222222')
      
      expect(user1).toBeDefined()
      expect(user2).toBeDefined()
      expect(user1!.id).not.toBe(user2!.id)
      
      const result = await userStore.updateUser(user2!.id, {
        document: '111111111',
      })
      
      expect(result).toBe(false)
      expect(userStore.users.find(u => u.id === user2!.id)?.document).toBe('222222222')
    })
  })

  describe('deleteUser', () => {
    it('deve desativar usuário existente', async () => {
      const userStore = useUserStore()
      
      await userStore.createUser({
        name: 'Usuário para Deletar',
        document: '999999999',
        password: 'senha123',
        status: UserStatus.ACTIVE,
      })
      
      const user = userStore.users[0]
      const result = await userStore.deleteUser(user.id)
      
      expect(result).toBe(true)
      expect(userStore.users[0].status).toBe(UserStatus.INACTIVE)
      expect(localStorageMock.setItem).toHaveBeenCalled()
    })

    it('deve retornar false para usuário inexistente', async () => {
      const userStore = useUserStore()
      
      const result = await userStore.deleteUser('non-existent-id')
      
      expect(result).toBe(false)
    })
  })

  describe('getUserById', () => {
    it('deve retornar usuário por ID', async () => {
      const userStore = useUserStore()
      
      await userStore.createUser({
        name: 'Usuário Busca',
        document: '888888888',
        password: 'senha123',
        status: UserStatus.ACTIVE,
      })
      
      const user = userStore.users[0]
      const foundUser = userStore.getUserById(user.id)
      
      expect(foundUser).toEqual(user)
    })

    it('deve retornar undefined para ID inexistente', () => {
      const userStore = useUserStore()
      
      const result = userStore.getUserById('non-existent-id')
      
      expect(result).toBeUndefined()
    })
  })

  describe('filteredUsers', () => {
    beforeEach(async () => {
      const userStore = useUserStore()
      
      await userStore.createUser({
        name: 'João Silva',
        document: '123456789',
        password: 'senha123',
        status: UserStatus.ACTIVE,
      })
      
      await userStore.createUser({
        name: 'Maria Santos',
        document: '987654321',
        password: 'senha456',
        status: UserStatus.INACTIVE,
      })
      
      await userStore.createUser({
        name: 'Pedro Oliveira',
        document: '555555555',
        password: 'senha789',
        status: UserStatus.ACTIVE,
      })
    })

    it('deve filtrar por nome', () => {
      const userStore = useUserStore()
      const filtered = userStore.filteredUsers({ search: 'João' })
      
      expect(filtered).toHaveLength(1)
      expect(filtered[0].name).toBe('João Silva')
    })

    it('deve filtrar por documento', () => {
      const userStore = useUserStore()
      const filtered = userStore.filteredUsers({ search: '123456789' })
      
      expect(filtered).toHaveLength(1)
      expect(filtered[0].document).toBe('123456789')
    })

    it('deve filtrar por status', () => {
      const userStore = useUserStore()
      
      const activeUsers = userStore.filteredUsers({ status: UserStatus.ACTIVE })
      const inactiveUsers = userStore.filteredUsers({ status: UserStatus.INACTIVE })
      
      expect(activeUsers).toHaveLength(2)
      expect(inactiveUsers).toHaveLength(1)
    })

    it('deve filtrar por múltiplos critérios', () => {
      const userStore = useUserStore()
      const filtered = userStore.filteredUsers({ search: 'João', status: UserStatus.ACTIVE })
      
      expect(filtered).toHaveLength(1)
      expect(filtered[0].name).toBe('João Silva')
      expect(filtered[0].status).toBe(UserStatus.ACTIVE)
    })

    it('deve retornar todos os usuários quando não há filtros', () => {
      const userStore = useUserStore()
      const filtered = userStore.filteredUsers({})
      
      expect(filtered).toHaveLength(3)
    })

    it('deve fazer busca case-insensitive', () => {
      const userStore = useUserStore()
      const filtered = userStore.filteredUsers({ search: 'joão' })
      
      expect(filtered).toHaveLength(1)
      expect(filtered[0].name).toBe('João Silva')
    })
  })

  describe('activeUsers', () => {
    it('deve retornar apenas usuários ativos', async () => {
      const userStore = useUserStore()
      
      await userStore.createUser({
        name: 'Usuário Ativo',
        document: '111111111',
        password: 'senha123',
        status: UserStatus.ACTIVE,
      })
      
      await userStore.createUser({
        name: 'Usuário Inativo',
        document: '222222222',
        password: 'senha456',
        status: UserStatus.INACTIVE,
      })
      
      const activeUsers = userStore.activeUsers
      
      expect(activeUsers).toHaveLength(1)
      expect(activeUsers[0].name).toBe('Usuário Ativo')
      expect(activeUsers[0].status).toBe(UserStatus.ACTIVE)
    })
  })
}) 
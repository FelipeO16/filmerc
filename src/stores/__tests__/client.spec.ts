import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useClientStore } from '../client'
import { ClientStatus } from '@/types'


const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('Client Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    localStorageMock.getItem.mockClear()
    localStorageMock.setItem.mockClear()
  })

  describe('Estado inicial', () => {
    it('deve inicializar com array vazio de clientes', () => {
      const clientStore = useClientStore()
      expect(clientStore.clients).toEqual([])
      expect(clientStore.loading).toBe(false)
    })
  })

  describe('loadClients', () => {
    it('deve carregar clientes do localStorage', () => {
      const mockClients = [
        {
          id: '1',
          name: 'João',
          lastName: 'Silva',
          cpf: '12345678901',
          email: 'joao@email.com',
          phone: '11999999999',
          address: {
            zipCode: '12345-678',
            street: 'Rua A',
            neighborhood: 'Centro',
            city: 'São Paulo',
            state: 'SP',
          },
          status: ClientStatus.ACTIVE,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockClients))
      
      const clientStore = useClientStore()
      clientStore.loadClients()
      
      expect(clientStore.clients).toEqual(mockClients)
    })

    it('deve inicializar com array vazio quando não há clientes', () => {
      localStorageMock.getItem.mockReturnValue(null)
      
      const clientStore = useClientStore()
      clientStore.loadClients()
      
      expect(clientStore.clients).toEqual([])
    })
  })

  describe('createClient', () => {
    it('deve criar novo cliente', async () => {
      const clientStore = useClientStore()
      const newClient = {
        name: 'Maria',
        lastName: 'Santos',
        cpf: '98765432100',
        email: 'maria@email.com',
        phone: '11888888888',
        address: {
          zipCode: '54321-876',
          street: 'Rua B',
          neighborhood: 'Vila Nova',
          city: 'Rio de Janeiro',
          state: 'RJ',
        },
        status: ClientStatus.ACTIVE,
      }
      
      const result = await clientStore.createClient(newClient)
      
      expect(result).toBe(true)
      expect(clientStore.clients).toHaveLength(1)
      expect(clientStore.clients[0].name).toBe(newClient.name)
      expect(clientStore.clients[0].lastName).toBe(newClient.lastName)
      expect(clientStore.clients[0].cpf).toBe(newClient.cpf)
      expect(clientStore.clients[0].email).toBe(newClient.email)
      expect(clientStore.clients[0].phone).toBe(newClient.phone)
      expect(clientStore.clients[0].address).toEqual(newClient.address)
      expect(clientStore.clients[0].status).toBe(newClient.status)
      expect(clientStore.clients[0].createdAt).toBeInstanceOf(Date)
      expect(clientStore.clients[0].updatedAt).toBeInstanceOf(Date)
      expect(localStorageMock.setItem).toHaveBeenCalled()
    })

    it('deve falhar ao criar cliente com CPF duplicado', async () => {
      const clientStore = useClientStore()
      
      await clientStore.createClient({
        name: 'Cliente 1',
        lastName: 'Sobrenome 1',
        cpf: '12345678901',
        email: 'cliente1@email.com',
        phone: '11111111111',
        address: {
          zipCode: '11111-111',
          street: 'Rua 1',
          neighborhood: 'Bairro 1',
          city: 'Cidade 1',
          state: 'SP',
        },
        status: ClientStatus.ACTIVE,
      })
      
      const result = await clientStore.createClient({
        name: 'Cliente 2',
        lastName: 'Sobrenome 2',
        cpf: '12345678901',
        email: 'cliente2@email.com',
        phone: '22222222222',
        address: {
          zipCode: '22222-222',
          street: 'Rua 2',
          neighborhood: 'Bairro 2',
          city: 'Cidade 2',
          state: 'RJ',
        },
        status: ClientStatus.ACTIVE,
      })
      
      expect(result).toBe(false)
      expect(clientStore.clients).toHaveLength(1)
    })

    it('deve falhar ao criar cliente com email duplicado', async () => {
      const clientStore = useClientStore()
      
      await clientStore.createClient({
        name: 'Cliente 1',
        lastName: 'Sobrenome 1',
        cpf: '12345678901',
        email: 'cliente@email.com',
        phone: '11111111111',
        address: {
          zipCode: '11111-111',
          street: 'Rua 1',
          neighborhood: 'Bairro 1',
          city: 'Cidade 1',
          state: 'SP',
        },
        status: ClientStatus.ACTIVE,
      })
      
      const result = await clientStore.createClient({
        name: 'Cliente 2',
        lastName: 'Sobrenome 2',
        cpf: '98765432100',
        email: 'cliente@email.com',
        phone: '22222222222',
        address: {
          zipCode: '22222-222',
          street: 'Rua 2',
          neighborhood: 'Bairro 2',
          city: 'Cidade 2',
          state: 'RJ',
        },
        status: ClientStatus.ACTIVE,
      })
      
      expect(result).toBe(false)
      expect(clientStore.clients).toHaveLength(1)
    })
  })

  describe('updateClient', () => {
    it('deve atualizar cliente existente', async () => {
      const clientStore = useClientStore()
      
      await clientStore.createClient({
        name: 'João',
        lastName: 'Silva',
        cpf: '12345678901',
        email: 'joao@email.com',
        phone: '11999999999',
        address: {
          zipCode: '12345-678',
          street: 'Rua A',
          neighborhood: 'Centro',
          city: 'São Paulo',
          state: 'SP',
        },
        status: ClientStatus.ACTIVE,
      })
      
      const originalClient = clientStore.clients[0]
      const updateData = {
        name: 'João Pedro',
        email: 'joaopedro@email.com',
        phone: '11777777777',
      }
      
      const result = await clientStore.updateClient(originalClient.id, updateData)
      
      expect(result).toBe(true)
      expect(clientStore.clients[0].name).toBe('João Pedro')
      expect(clientStore.clients[0].email).toBe('joaopedro@email.com')
      expect(clientStore.clients[0].phone).toBe('11777777777')
      expect(clientStore.clients[0].lastName).toBe('Silva')
      expect(clientStore.clients[0].cpf).toBe('12345678901')
      expect(clientStore.clients[0].updatedAt.getTime()).toBeGreaterThanOrEqual(originalClient.updatedAt.getTime())
      expect(localStorageMock.setItem).toHaveBeenCalled()
    })

    it('deve retornar false para cliente inexistente', async () => {
      const clientStore = useClientStore()
      
      const result = await clientStore.updateClient('non-existent-id', {
        name: 'Novo Nome',
      })
      
      expect(result).toBe(false)
    })
  })

  describe('deleteClient', () => {
    it('deve desativar cliente existente', async () => {
      const clientStore = useClientStore()
      
      await clientStore.createClient({
        name: 'Cliente para Deletar',
        lastName: 'Sobrenome',
        cpf: '99999999999',
        email: 'deletar@email.com',
        phone: '99999999999',
        address: {
          zipCode: '99999-999',
          street: 'Rua Deletar',
          neighborhood: 'Bairro Deletar',
          city: 'Cidade Deletar',
          state: 'SP',
        },
        status: ClientStatus.ACTIVE,
      })
      
      const client = clientStore.clients[0]
      const result = await clientStore.deleteClient(client.id)
      
      expect(result).toBe(true)
      expect(clientStore.clients[0].status).toBe(ClientStatus.INACTIVE)
      expect(localStorageMock.setItem).toHaveBeenCalled()
    })

    it('deve retornar false para cliente inexistente', async () => {
      const clientStore = useClientStore()
      
      const result = await clientStore.deleteClient('non-existent-id')
      
      expect(result).toBe(false)
    })
  })

  describe('getClientById', () => {
    it('deve retornar cliente por ID', async () => {
      const clientStore = useClientStore()
      
      await clientStore.createClient({
        name: 'Cliente Busca',
        lastName: 'Sobrenome',
        cpf: '88888888888',
        email: 'busca@email.com',
        phone: '88888888888',
        address: {
          zipCode: '88888-888',
          street: 'Rua Busca',
          neighborhood: 'Bairro Busca',
          city: 'Cidade Busca',
          state: 'SP',
        },
        status: ClientStatus.ACTIVE,
      })
      
      const client = clientStore.clients[0]
      const foundClient = clientStore.getClientById(client.id)
      
      expect(foundClient).toEqual(client)
    })

    it('deve retornar undefined para ID inexistente', () => {
      const clientStore = useClientStore()
      
      const result = clientStore.getClientById('non-existent-id')
      
      expect(result).toBeUndefined()
    })
  })

  describe('filteredClients', () => {
    beforeEach(async () => {
      const clientStore = useClientStore()
      
      await clientStore.createClient({
        name: 'João',
        lastName: 'Silva',
        cpf: '12345678901',
        email: 'joao@email.com',
        phone: '11999999999',
        address: {
          zipCode: '12345-678',
          street: 'Rua A',
          neighborhood: 'Centro',
          city: 'São Paulo',
          state: 'SP',
        },
        status: ClientStatus.ACTIVE,
      })
      
      await clientStore.createClient({
        name: 'Maria',
        lastName: 'Santos',
        cpf: '98765432100',
        email: 'maria@email.com',
        phone: '11888888888',
        address: {
          zipCode: '54321-876',
          street: 'Rua B',
          neighborhood: 'Vila Nova',
          city: 'Rio de Janeiro',
          state: 'RJ',
        },
        status: ClientStatus.INACTIVE,
      })
      
      await clientStore.createClient({
        name: 'Pedro',
        lastName: 'Oliveira',
        cpf: '55555555555',
        email: 'pedro@email.com',
        phone: '11555555555',
        address: {
          zipCode: '55555-555',
          street: 'Rua C',
          neighborhood: 'Jardim',
          city: 'Belo Horizonte',
          state: 'MG',
        },
        status: ClientStatus.ACTIVE,
      })
    })

    it('deve filtrar por nome', () => {
      const clientStore = useClientStore()
      const filtered = clientStore.filteredClients({ search: 'João' })
      
      expect(filtered).toHaveLength(1)
      expect(filtered[0].name).toBe('João')
    })

    it('deve filtrar por sobrenome', () => {
      const clientStore = useClientStore()
      const filtered = clientStore.filteredClients({ search: 'Silva' })
      
      expect(filtered).toHaveLength(1)
      expect(filtered[0].lastName).toBe('Silva')
    })

    it('deve filtrar por CPF', () => {
      const clientStore = useClientStore()
      const filtered = clientStore.filteredClients({ document: '12345678901' })
      
      expect(filtered).toHaveLength(1)
      expect(filtered[0].cpf).toBe('12345678901')
    })

    it('deve filtrar por status', () => {
      const clientStore = useClientStore()
      
      const activeClients = clientStore.filteredClients({ status: ClientStatus.ACTIVE })
      const inactiveClients = clientStore.filteredClients({ status: ClientStatus.INACTIVE })
      
      expect(activeClients).toHaveLength(2)
      expect(inactiveClients).toHaveLength(1)
    })

    it('deve filtrar por múltiplos critérios', () => {
      const clientStore = useClientStore()
      const filtered = clientStore.filteredClients({ search: 'João', status: ClientStatus.ACTIVE })
      
      expect(filtered).toHaveLength(1)
      expect(filtered[0].name).toBe('João')
      expect(filtered[0].status).toBe(ClientStatus.ACTIVE)
    })

    it('deve retornar todos os clientes quando não há filtros', () => {
      const clientStore = useClientStore()
      const filtered = clientStore.filteredClients({})
      
      expect(filtered).toHaveLength(3)
    })

    it('deve fazer busca case-insensitive', () => {
      const clientStore = useClientStore()
      const filtered = clientStore.filteredClients({ search: 'joão' })
      
      expect(filtered).toHaveLength(1)
      expect(filtered[0].name).toBe('João')
    })
  })

  describe('activeClients', () => {
    it('deve retornar apenas clientes ativos', async () => {
      const clientStore = useClientStore()
      
      await clientStore.createClient({
        name: 'Cliente Ativo',
        lastName: 'Teste',
        cpf: '11111111111',
        email: 'ativo@email.com',
        phone: '11111111111',
        address: {
          zipCode: '11111-111',
          street: 'Rua 1',
          neighborhood: 'Bairro 1',
          city: 'Cidade 1',
          state: 'SP',
        },
        status: ClientStatus.ACTIVE,
      })
      
      await clientStore.createClient({
        name: 'Cliente Inativo',
        lastName: 'Teste',
        cpf: '22222222222',
        email: 'inativo@email.com',
        phone: '22222222222',
        address: {
          zipCode: '22222-222',
          street: 'Rua 2',
          neighborhood: 'Bairro 2',
          city: 'Cidade 2',
          state: 'RJ',
        },
        status: ClientStatus.INACTIVE,
      })
      
      const activeClients = clientStore.activeClients
      
      expect(activeClients).toHaveLength(1)
      expect(activeClients[0].name).toBe('Cliente Ativo')
      expect(activeClients[0].status).toBe(ClientStatus.ACTIVE)
    })
  })
}) 
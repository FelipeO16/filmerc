import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Client, CreateClientRequest, UpdateClientRequest, ClientFilters } from '@/types'
import { ClientStatus } from '@/types'
import { useNotificationStore } from './notification'

export const useClientStore = defineStore('client', () => {
  const clients = ref<Client[]>([])
  const loading = ref(false)

  const notificationStore = useNotificationStore()

  function loadClients() {
    try {
      const stored = localStorage.getItem('clients')
      if (stored) {
        clients.value = JSON.parse(stored).map((client: Client) => ({
          ...client,
          createdAt: new Date(client.createdAt),
          updatedAt: new Date(client.updatedAt),
        }))
      }
    } catch (error) {
      console.error('Erro ao carregar clientes:', error)
      notificationStore.showError('Falha ao carregar clientes')
    }
  }

  function saveClients() {
    try {
      localStorage.setItem('clients', JSON.stringify(clients.value))
    } catch (error) {
      console.error('Erro ao salvar clientes:', error)
      notificationStore.showError('Falha ao salvar clientes')
    }
  }

  async function createClient(clientData: CreateClientRequest): Promise<boolean> {
    try {
      loading.value = true

      if (clients.value.some(client => client.cpf === clientData.cpf)) {
        notificationStore.showError('Cliente com este CPF já existe')
        return false
      }

      if (clients.value.some(client => client.email === clientData.email)) {
        notificationStore.showError('Cliente com este email já existe')
        return false
      }

      const newClient: Client = {
        id: `client_${Date.now()}`,
        ...clientData,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      clients.value.push(newClient)
      saveClients()
      notificationStore.showSuccess('Cliente criado com sucesso')
      return true
    } catch (error) {
      console.error('Erro ao criar cliente:', error)
      notificationStore.showError('Falha ao criar cliente')
      return false
    } finally {
      loading.value = false
    }
  }

  async function updateClient(id: string, clientData: UpdateClientRequest): Promise<boolean> {
    try {
      loading.value = true

      const clientIndex = clients.value.findIndex(client => client.id === id)
      if (clientIndex === -1) {
        notificationStore.showError('Cliente não encontrado')
        return false
      }

      if (clientData.cpf && clients.value.some(client => client.cpf === clientData.cpf && client.id !== id)) {
        notificationStore.showError('Cliente com este CPF já existe')
        return false
      }

      if (clientData.email && clients.value.some(client => client.email === clientData.email && client.id !== id)) {
        notificationStore.showError('Cliente com este email já existe')
        return false
      }

      const updatedClient = {
        ...clients.value[clientIndex],
        ...clientData,
        updatedAt: new Date(),
      }

      clients.value[clientIndex] = updatedClient
      saveClients()
      notificationStore.showSuccess('Cliente atualizado com sucesso')
      return true
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error)
      notificationStore.showError('Falha ao atualizar cliente')
      return false
    } finally {
      loading.value = false
    }
  }

  async function deleteClient(id: string): Promise<boolean> {
    try {
      loading.value = true

      const clientIndex = clients.value.findIndex(client => client.id === id)
      if (clientIndex === -1) {
        notificationStore.showError('Cliente não encontrado')
        return false
      }

      const hasActiveRentals = await hasActiveRentalsForClient(id)
      if (hasActiveRentals) {
        notificationStore.showError('Não é possível desativar cliente com locações ativas')
        return false
      }

      clients.value[clientIndex] = {
        ...clients.value[clientIndex],
        status: ClientStatus.INACTIVE,
        updatedAt: new Date(),
      }

      saveClients()
      notificationStore.showSuccess('Cliente desativado com sucesso')
      return true
    } catch (error) {
      console.error('Erro ao excluir cliente:', error)
      notificationStore.showError('Falha ao desativar cliente')
      return false
    } finally {
      loading.value = false
    }
  }

  async function hasActiveRentalsForClient(clientId: string): Promise<boolean> {
    try {
      const stored = localStorage.getItem('rentals')
      if (!stored) return false

      const rentals = JSON.parse(stored)
      return rentals.some((rental: { clientId: string; status: string }) =>
        rental.clientId === clientId && rental.status === 'rented'
      )
    } catch (error) {
      console.error('Erro ao verificar locações ativas:', error)
      return false
    }
  }

  function getClientById(id: string): Client | undefined {
    return clients.value.find(client => client.id === id)
  }

  const filteredClients = computed(() => {
    return (filters: ClientFilters) => {
      let result = clients.value

      if (filters.search) {
        const search = filters.search.toLowerCase()
        result = result.filter(client =>
          client.name.toLowerCase().includes(search) ||
          client.lastName.toLowerCase().includes(search) ||
          `${client.name} ${client.lastName}`.toLowerCase().includes(search) ||
          client.cpf.replace(/\D/g, '').includes(search.replace(/\D/g, ''))
        )
      }

      if (filters.document) {
        result = result.filter(client => client.cpf.includes(filters.document!))
      }

      if (filters.status) {
        result = result.filter(client => client.status === filters.status)
      }

      return result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    }
  })

  const activeClients = computed(() =>
    clients.value.filter(client => client.status === ClientStatus.ACTIVE)
  )

  const availableClients = computed(() =>
    activeClients.value
  )

  return {
    clients,
    loading,
    loadClients,
    createClient,
    updateClient,
    deleteClient,
    getClientById,
    filteredClients,
    activeClients,
    availableClients,
    hasActiveRentalsForClient,
  }
})

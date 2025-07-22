import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Rental, CreateRentalRequest, UpdateRentalRequest, RentalFilters } from '@/types'
import { RentalStatus } from '@/types'
import { useNotificationStore } from './notification'
import { useClientStore } from './client'
import { useUserStore } from './user'
import { MovieService } from '@/services/movie-service'

export const useRentalStore = defineStore('rental', () => {
  const rentals = ref<Rental[]>([])
  const loading = ref(false)

  const notificationStore = useNotificationStore()
  const clientStore = useClientStore()
  const userStore = useUserStore()

  function loadRentals() {
    try {
      const stored = localStorage.getItem('rentals')
      if (stored) {
        rentals.value = JSON.parse(stored).map((rental: Rental) => ({
          ...rental,
          rentalDate: new Date(rental.rentalDate),
          returnDate: new Date(rental.returnDate),
          createdAt: new Date(rental.createdAt),
          updatedAt: new Date(rental.updatedAt),
        }))
      }
    } catch (error) {
      console.error('Erro ao carregar locações:', error)
      notificationStore.showError('Falha ao carregar locações')
    }
  }

  function saveRentals() {
    try {
      localStorage.setItem('rentals', JSON.stringify(rentals.value))
    } catch (error) {
      console.error('Erro ao salvar locações:', error)
      notificationStore.showError('Falha ao salvar locações')
    }
  }

  async function createRental(rentalData: CreateRentalRequest): Promise<boolean> {
    try {
      loading.value = true

      const client = clientStore.getClientById(rentalData.clientId)
      const user = userStore.getUserById(rentalData.userId)

      if (!client) {
        notificationStore.showError('Cliente não encontrado')
        return false
      }

      if (!user) {
        notificationStore.showError('Usuário não encontrado')
        return false
      }

      const hasActiveRentals = await clientStore.hasActiveRentalsForClient(rentalData.clientId)
      if (hasActiveRentals) {
        notificationStore.showError('Cliente já possui uma locação ativa')
        return false
      }

      const movies = await MovieService.getMoviesByIds(rentalData.movieIds)

      const newRental: Rental = {
        id: `rental_${Date.now()}`,
        clientId: rentalData.clientId,
        client,
        movies,
        rentalDate: rentalData.rentalDate,
        returnDate: rentalData.returnDate,
        userId: rentalData.userId,
        user,
        status: RentalStatus.RENTED,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      rentals.value.push(newRental)
      saveRentals()
      notificationStore.showSuccess('Locação criada com sucesso')
      return true
    } catch (error) {
      console.error('Erro ao criar locação:', error)
      notificationStore.showError('Falha ao criar locação')
      return false
    } finally {
      loading.value = false
    }
  }

  async function updateRental(id: string, rentalData: UpdateRentalRequest): Promise<boolean> {
    try {
      loading.value = true

      const rentalIndex = rentals.value.findIndex(rental => rental.id === id)
      if (rentalIndex === -1) {
        notificationStore.showError('Locação não encontrada')
        return false
      }

      const updatedRental = {
        ...rentals.value[rentalIndex],
        ...rentalData,
        updatedAt: new Date(),
      }

      rentals.value[rentalIndex] = updatedRental
      saveRentals()
      notificationStore.showSuccess('Locação atualizada com sucesso')
      return true
    } catch (error) {
      console.error('Erro ao atualizar locação:', error)
      notificationStore.showError('Falha ao atualizar locação')
      return false
    } finally {
      loading.value = false
    }
  }

  async function returnRental(id: string): Promise<boolean> {
    return updateRental(id, {
      status: RentalStatus.RETURNED,
      returnDate: new Date()
    })
  }

  function getRentalById(id: string): Rental | undefined {
    return rentals.value.find(rental => rental.id === id)
  }

  const filteredRentals = computed(() => {
    return (filters: RentalFilters) => {
      let result = rentals.value

      if (filters.clientSearch) {
        const search = filters.clientSearch.toLowerCase()
        result = result.filter(rental =>
          rental.client.name.toLowerCase().includes(search) ||
          rental.client.lastName.toLowerCase().includes(search) ||
          `${rental.client.name} ${rental.client.lastName}`.toLowerCase().includes(search) ||
          rental.client.cpf.includes(search)
        )
      }

      if (filters.rentalDateFrom) {
        result = result.filter(rental =>
          rental.rentalDate >= filters.rentalDateFrom!
        )
      }

      if (filters.rentalDateTo) {
        result = result.filter(rental =>
          rental.rentalDate <= filters.rentalDateTo!
        )
      }

      if (filters.returnDateFrom) {
        result = result.filter(rental =>
          rental.returnDate >= filters.returnDateFrom!
        )
      }

      if (filters.returnDateTo) {
        result = result.filter(rental =>
          rental.returnDate <= filters.returnDateTo!
        )
      }

      if (filters.status) {
        result = result.filter(rental => rental.status === filters.status)
      }

      return result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    }
  })

  const activeRentals = computed(() =>
    rentals.value.filter(rental => rental.status === RentalStatus.RENTED)
  )

  const overdueRentals = computed(() => {
    const today = new Date()
    return activeRentals.value.filter(rental =>
      rental.returnDate < today
    )
  })

  const upcomingReturns = computed(() => {
    const today = new Date()
    const threeDaysFromNow = new Date()
    threeDaysFromNow.setDate(today.getDate() + 3)

    return activeRentals.value.filter(rental =>
      rental.returnDate >= today && rental.returnDate <= threeDaysFromNow
    )
  })

  return {
    rentals,
    loading,
    loadRentals,
    createRental,
    updateRental,
    returnRental,
    getRentalById,
    filteredRentals,
    activeRentals,
    overdueRentals,
    upcomingReturns,
  }
})

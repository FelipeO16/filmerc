import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useRentalStore } from '../rental'
import { useClientStore } from '../client'
import { useUserStore } from '../user'
import { RentalStatus, ClientStatus, UserStatus } from '@/types'
import { MovieService } from '@/services/movie-service'


const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})


vi.mock('@/services/movie-service', () => ({
  MovieService: {
    getMoviesByIds: vi.fn(),
  },
}))

describe('Rental Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    localStorageMock.getItem.mockClear()
    localStorageMock.setItem.mockClear()
  })

  describe('Estado inicial', () => {
    it('deve inicializar com array vazio de alugueis', () => {
      const rentalStore = useRentalStore()
      expect(rentalStore.rentals).toEqual([])
      expect(rentalStore.loading).toBe(false)
    })
  })

  describe('loadRentals', () => {
    it('deve carregar alugueis do localStorage', () => {
      const mockRentals = [
        {
          id: 'rental_1',
          clientId: 'client_1',
          client: {
            id: 'client_1',
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
          movies: [
            {
              imdbID: 'tt1234567',
              Title: 'Filme 1',
              Year: '2023',
              Type: 'movie',
              Poster: 'poster1.jpg',
            },
          ],
          rentalDate: new Date('2023-01-01'),
          returnDate: new Date('2023-01-08'),
          userId: 'user_1',
          user: {
            id: 'user_1',
            name: 'Admin',
            document: '123456789',
            password: 'password',
            status: UserStatus.ACTIVE,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          status: RentalStatus.RENTED,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockRentals))
      
      const rentalStore = useRentalStore()
      rentalStore.loadRentals()
      
      expect(rentalStore.rentals).toHaveLength(1)
      expect(rentalStore.rentals[0].id).toBe('rental_1')
      expect(rentalStore.rentals[0].rentalDate).toBeInstanceOf(Date)
      expect(rentalStore.rentals[0].returnDate).toBeInstanceOf(Date)
    })

    it('deve inicializar com array vazio quando não há alugueis', () => {
      localStorageMock.getItem.mockReturnValue(null)
      
      const rentalStore = useRentalStore()
      rentalStore.loadRentals()
      
      expect(rentalStore.rentals).toEqual([])
    })
  })

  describe('createRental', () => {
    it('deve criar novo aluguel', async () => {
      const rentalStore = useRentalStore()
      
      const clientStore = useClientStore()
      const userStore = useUserStore()
      
      const mockClient = {
        id: 'client1',
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
      }
      
      const mockUser = {
        id: 'user1',
        name: 'Admin',
        document: '123456789',
        password: 'password',
        status: UserStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      
      const mockMovies = [
        {
          imdbID: 'tt1234567',
          Title: 'Filme 1',
          Year: '2023',
          Type: 'movie',
          Poster: 'poster1.jpg',
        },
      ]
      
      vi.spyOn(clientStore, 'getClientById').mockReturnValue(mockClient)
      vi.spyOn(userStore, 'getUserById').mockReturnValue(mockUser)
      vi.spyOn(clientStore, 'hasActiveRentalsForClient').mockResolvedValue(false)
      vi.spyOn(MovieService, 'getMoviesByIds').mockResolvedValue(mockMovies)
      
      const newRental = {
        clientId: 'client1',
        movieIds: ['tt1234567'],
        rentalDate: new Date('2023-01-01'),
        returnDate: new Date('2023-01-08'),
        userId: 'user1',
      }
      
      const result = await rentalStore.createRental(newRental)
      
      expect(result).toBe(true)
      expect(rentalStore.rentals).toHaveLength(1)
      expect(rentalStore.rentals[0].clientId).toBe(newRental.clientId)
      expect(rentalStore.rentals[0].rentalDate).toEqual(newRental.rentalDate)
      expect(rentalStore.rentals[0].returnDate).toEqual(newRental.returnDate)
      expect(rentalStore.rentals[0].userId).toBe(newRental.userId)
      expect(rentalStore.rentals[0].status).toBe(RentalStatus.RENTED)
      expect(rentalStore.rentals[0].createdAt).toBeInstanceOf(Date)
      expect(rentalStore.rentals[0].updatedAt).toBeInstanceOf(Date)
      expect(localStorageMock.setItem).toHaveBeenCalled()
    })
  })

  describe('updateRental', () => {
    it('deve atualizar aluguel existente', async () => {
      const rentalStore = useRentalStore()
      
      const clientStore = useClientStore()
      const userStore = useUserStore()
      
      const mockClient = {
        id: 'client1',
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
      }
      
      const mockUser = {
        id: 'user1',
        name: 'Admin',
        document: '123456789',
        password: 'password',
        status: UserStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      
      const mockMovies = [
        {
          imdbID: 'tt1234567',
          Title: 'Filme 1',
          Year: '2023',
          Type: 'movie',
          Poster: 'poster1.jpg',
        },
      ]
      
      vi.spyOn(clientStore, 'getClientById').mockReturnValue(mockClient)
      vi.spyOn(userStore, 'getUserById').mockReturnValue(mockUser)
      vi.spyOn(clientStore, 'hasActiveRentalsForClient').mockResolvedValue(false)
      vi.spyOn(MovieService, 'getMoviesByIds').mockResolvedValue(mockMovies)
      
      await rentalStore.createRental({
        clientId: 'client1',
        movieIds: ['tt1234567'],
        rentalDate: new Date('2023-01-01'),
        returnDate: new Date('2023-01-08'),
        userId: 'user1',
      })
      
      const originalRental = rentalStore.rentals[0]
      const updateData = {
        returnDate: new Date('2023-01-10'),
        status: RentalStatus.RETURNED,
      }
      
      const result = await rentalStore.updateRental(originalRental.id, updateData)
      
      expect(result).toBe(true)
      expect(rentalStore.rentals[0].returnDate).toEqual(updateData.returnDate)
      expect(rentalStore.rentals[0].status).toBe(RentalStatus.RETURNED)
      expect(rentalStore.rentals[0].updatedAt.getTime()).toBeGreaterThanOrEqual(originalRental.updatedAt.getTime())
      expect(localStorageMock.setItem).toHaveBeenCalled()
    })

    it('deve retornar false para aluguel inexistente', async () => {
      const rentalStore = useRentalStore()
      
      const result = await rentalStore.updateRental('non-existent-id', {
        returnDate: new Date(),
      })
      
      expect(result).toBe(false)
    })
  })

  describe('returnRental', () => {
    it('deve marcar aluguel como retornado', async () => {
      const rentalStore = useRentalStore()
      
      const clientStore = useClientStore()
      const userStore = useUserStore()
      
      const mockClient = {
        id: 'client1',
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
      }
      
      const mockUser = {
        id: 'user1',
        name: 'Admin',
        document: '123456789',
        password: 'password',
        status: UserStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      
      const mockMovies = [
        {
          imdbID: 'tt1234567',
          Title: 'Filme 1',
          Year: '2023',
          Type: 'movie',
          Poster: 'poster1.jpg',
        },
      ]
      
      vi.spyOn(clientStore, 'getClientById').mockReturnValue(mockClient)
      vi.spyOn(userStore, 'getUserById').mockReturnValue(mockUser)
      vi.spyOn(clientStore, 'hasActiveRentalsForClient').mockResolvedValue(false)
      vi.spyOn(MovieService, 'getMoviesByIds').mockResolvedValue(mockMovies)
      
      await rentalStore.createRental({
        clientId: 'client1',
        movieIds: ['tt1234567'],
        rentalDate: new Date('2023-01-01'),
        returnDate: new Date('2023-01-08'),
        userId: 'user1',
      })
      
      const rental = rentalStore.rentals[0]
      const result = await rentalStore.returnRental(rental.id)
      
      expect(result).toBe(true)
      expect(rentalStore.rentals[0].status).toBe(RentalStatus.RETURNED)
      expect(rentalStore.rentals[0].returnDate).toBeInstanceOf(Date)
      expect(localStorageMock.setItem).toHaveBeenCalled()
    })

    it('deve retornar false para aluguel inexistente', async () => {
      const rentalStore = useRentalStore()
      
      const result = await rentalStore.returnRental('non-existent-id')
      
      expect(result).toBe(false)
    })
  })

  describe('getRentalById', () => {
    it('deve retornar aluguel por ID', async () => {
      const rentalStore = useRentalStore()
      
      const clientStore = useClientStore()
      const userStore = useUserStore()
      
      const mockClient = {
        id: 'client1',
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
      }
      
      const mockUser = {
        id: 'user1',
        name: 'Admin',
        document: '123456789',
        password: 'password',
        status: UserStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      
      const mockMovies = [
        {
          imdbID: 'tt1234567',
          Title: 'Filme 1',
          Year: '2023',
          Type: 'movie',
          Poster: 'poster1.jpg',
        },
      ]
      
      vi.spyOn(clientStore, 'getClientById').mockReturnValue(mockClient)
      vi.spyOn(userStore, 'getUserById').mockReturnValue(mockUser)
      vi.spyOn(clientStore, 'hasActiveRentalsForClient').mockResolvedValue(false)
      vi.spyOn(MovieService, 'getMoviesByIds').mockResolvedValue(mockMovies)
      
      await rentalStore.createRental({
        clientId: 'client1',
        movieIds: ['tt1234567'],
        rentalDate: new Date('2023-01-01'),
        returnDate: new Date('2023-01-08'),
        userId: 'user1',
      })
      
      const rental = rentalStore.rentals[0]
      const foundRental = rentalStore.getRentalById(rental.id)
      
      expect(foundRental).toEqual(rental)
    })

    it('deve retornar undefined para ID inexistente', () => {
      const rentalStore = useRentalStore()
      
      const result = rentalStore.getRentalById('non-existent-id')
      
      expect(result).toBeUndefined()
    })
  })

  describe('filteredRentals', () => {
    beforeEach(async () => {
      const rentalStore = useRentalStore()
      const clientStore = useClientStore()
      const userStore = useUserStore()
      
      const mockClient = {
        id: 'client1',
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
      }
      
      const mockUser = {
        id: 'user1',
        name: 'Admin',
        document: '123456789',
        password: 'password',
        status: UserStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      
      const mockMovies = [
        {
          imdbID: 'tt1234567',
          Title: 'Filme 1',
          Year: '2023',
          Type: 'movie',
          Poster: 'poster1.jpg',
        },
      ]
      
      vi.spyOn(clientStore, 'getClientById').mockReturnValue(mockClient)
      vi.spyOn(userStore, 'getUserById').mockReturnValue(mockUser)
      vi.spyOn(clientStore, 'hasActiveRentalsForClient').mockResolvedValue(false)
      vi.spyOn(MovieService, 'getMoviesByIds').mockResolvedValue(mockMovies)
      
      await rentalStore.createRental({
        clientId: 'client1',
        movieIds: ['tt1234567'],
        rentalDate: new Date('2023-01-01'),
        returnDate: new Date('2023-01-08'),
        userId: 'user1',
      })
    })

    it('deve filtrar por cliente', () => {
      const rentalStore = useRentalStore()
      const filtered = rentalStore.filteredRentals({ clientSearch: 'João' })
      
      expect(filtered).toHaveLength(1)
      expect(filtered[0].client.name).toBe('João')
    })

    it('deve filtrar por data de aluguel', () => {
      const rentalStore = useRentalStore()
      const filtered = rentalStore.filteredRentals({ 
        rentalDateFrom: new Date('2023-01-01'),
        rentalDateTo: new Date('2023-01-01')
      })
      
      expect(filtered).toHaveLength(1)
      expect(filtered[0].rentalDate).toEqual(new Date('2023-01-01'))
    })

    it('deve filtrar por data de retorno', () => {
      const rentalStore = useRentalStore()
      const filtered = rentalStore.filteredRentals({ 
        returnDateFrom: new Date('2023-01-08'),
        returnDateTo: new Date('2023-01-08')
      })
      
      expect(filtered).toHaveLength(1)
      expect(filtered[0].returnDate).toEqual(new Date('2023-01-08'))
    })

    it('deve filtrar por status', () => {
      const rentalStore = useRentalStore()
      const filtered = rentalStore.filteredRentals({ status: RentalStatus.RENTED })
      
      expect(filtered).toHaveLength(1)
      expect(filtered[0].status).toBe(RentalStatus.RENTED)
    })

    it('deve filtrar por múltiplos critérios', () => {
      const rentalStore = useRentalStore()
      const filtered = rentalStore.filteredRentals({
        clientSearch: 'João',
        status: RentalStatus.RENTED,
      })
      
      expect(filtered).toHaveLength(1)
      expect(filtered[0].client.name).toBe('João')
      expect(filtered[0].status).toBe(RentalStatus.RENTED)
    })

    it('deve retornar todos os alugueis quando não há filtros', () => {
      const rentalStore = useRentalStore()
      const filtered = rentalStore.filteredRentals({})
      
      expect(filtered).toHaveLength(1)
    })
  })

  describe('activeRentals', () => {
    it('deve retornar apenas alugueis ativos', async () => {
      const rentalStore = useRentalStore()
      const clientStore = useClientStore()
      const userStore = useUserStore()
      
      const mockClient = {
        id: 'client1',
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
      }
      
      const mockUser = {
        id: 'user1',
        name: 'Admin',
        document: '123456789',
        password: 'password',
        status: UserStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      
      const mockMovies = [
        {
          imdbID: 'tt1234567',
          Title: 'Filme 1',
          Year: '2023',
          Type: 'movie',
          Poster: 'poster1.jpg',
        },
      ]
      
      vi.spyOn(clientStore, 'getClientById').mockReturnValue(mockClient)
      vi.spyOn(userStore, 'getUserById').mockReturnValue(mockUser)
      vi.spyOn(clientStore, 'hasActiveRentalsForClient').mockResolvedValue(false)
      vi.spyOn(MovieService, 'getMoviesByIds').mockResolvedValue(mockMovies)
      
      await rentalStore.createRental({
        clientId: 'client1',
        movieIds: ['tt1234567'],
        rentalDate: new Date('2023-01-01'),
        returnDate: new Date('2023-01-08'),
        userId: 'user1',
      })
      
      const activeRentals = rentalStore.activeRentals
      
      expect(activeRentals).toHaveLength(1)
      expect(activeRentals[0].status).toBe(RentalStatus.RENTED)
    })
  })

  describe('overdueRentals', () => {
    it('deve retornar alugueis em atraso', async () => {
      const rentalStore = useRentalStore()
      const clientStore = useClientStore()
      const userStore = useUserStore()
      
      const mockClient = {
        id: 'client1',
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
      }
      
      const mockUser = {
        id: 'user1',
        name: 'Admin',
        document: '123456789',
        password: 'password',
        status: UserStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      
      const mockMovies = [
        {
          imdbID: 'tt1234567',
          Title: 'Filme 1',
          Year: '2023',
          Type: 'movie',
          Poster: 'poster1.jpg',
        },
      ]
      
      vi.spyOn(clientStore, 'getClientById').mockReturnValue(mockClient)
      vi.spyOn(userStore, 'getUserById').mockReturnValue(mockUser)
      vi.spyOn(clientStore, 'hasActiveRentalsForClient').mockResolvedValue(false)
      vi.spyOn(MovieService, 'getMoviesByIds').mockResolvedValue(mockMovies)
      
      await rentalStore.createRental({
        clientId: 'client1',
        movieIds: ['tt1234567'],
        rentalDate: new Date('2023-01-01'),
        returnDate: new Date('2023-01-01'),
        userId: 'user1',
      })
      
      const overdueRentals = rentalStore.overdueRentals
      
      expect(overdueRentals).toHaveLength(1)
      expect(overdueRentals[0].status).toBe(RentalStatus.RENTED)
    })
  })

  describe('upcomingReturns', () => {
    it('deve retornar retornos próximos', async () => {
      const rentalStore = useRentalStore()
      const clientStore = useClientStore()
      const userStore = useUserStore()
      
      const mockClient = {
        id: 'client1',
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
      }
      
      const mockUser = {
        id: 'user1',
        name: 'Admin',
        document: '123456789',
        password: 'password',
        status: UserStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      
      const mockMovies = [
        {
          imdbID: 'tt1234567',
          Title: 'Filme 1',
          Year: '2023',
          Type: 'movie',
          Poster: 'poster1.jpg',
        },
      ]
      
      vi.spyOn(clientStore, 'getClientById').mockReturnValue(mockClient)
      vi.spyOn(userStore, 'getUserById').mockReturnValue(mockUser)
      vi.spyOn(clientStore, 'hasActiveRentalsForClient').mockResolvedValue(false)
      vi.spyOn(MovieService, 'getMoviesByIds').mockResolvedValue(mockMovies)
      
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 2)
      
      await rentalStore.createRental({
        clientId: 'client1',
        movieIds: ['tt1234567'],
        rentalDate: new Date(),
        returnDate: futureDate,
        userId: 'user1',
      })
      
      const upcomingReturns = rentalStore.upcomingReturns
      
      expect(upcomingReturns).toHaveLength(1)
      expect(upcomingReturns[0].status).toBe(RentalStatus.RENTED)
    })
  })
}) 
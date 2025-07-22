export interface User {
  id: string
  name: string
  document: string
  password: string
  status: UserStatus
  createdAt: Date
  updatedAt: Date
}

export interface CreateUserRequest {
  name: string
  document: string
  password: string
  status: UserStatus
}

export interface UpdateUserRequest {
  name?: string
  document?: string
  password?: string
  status?: UserStatus
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

export interface Client {
  id: string
  name: string
  lastName: string
  cpf: string
  email: string
  phone: string
  address: Address
  status: ClientStatus
  createdAt: Date
  updatedAt: Date
}

export interface CreateClientRequest {
  name: string
  lastName: string
  cpf: string
  email: string
  phone: string
  address: Address
  status: ClientStatus
}

export interface UpdateClientRequest {
  name?: string
  lastName?: string
  cpf?: string
  email?: string
  phone?: string
  address?: Address
  status?: ClientStatus
}

export interface Address {
  zipCode: string
  street: string
  neighborhood: string
  city: string
  state: string
}

export enum ClientStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

export interface Movie {
  imdbID: string
  Title: string
  Year: string
  Type: string
  Poster: string
  Plot?: string
  Director?: string
  Actors?: string
  Genre?: string
  Runtime?: string
  imdbRating?: string
}

export interface MovieSearchResponse {
  Search: Movie[]
  totalResults: string
  Response: string
  Error?: string
}

export interface MovieDetailResponse extends Movie {
  Rated: string
  Released: string
  Genre: string
  Director: string
  Writer: string
  Actors: string
  Plot: string
  Language: string
  Country: string
  Awards: string
  Ratings: Array<{
    Source: string
    Value: string
  }>
  Metascore: string
  imdbRating: string
  imdbVotes: string
  DVD: string
  BoxOffice: string
  Production: string
  Website: string
  Response: string
}

export interface Rental {
  id: string
  clientId: string
  client: Client
  movies: Movie[]
  rentalDate: Date
  returnDate: Date
  userId: string
  user: User
  status: RentalStatus
  createdAt: Date
  updatedAt: Date
}

export interface CreateRentalRequest {
  clientId: string
  movieIds: string[]
  rentalDate: Date
  returnDate: Date
  userId: string
}

export interface UpdateRentalRequest {
  returnDate?: Date
  status?: RentalStatus
}

export enum RentalStatus {
  RENTED = 'rented',
  RETURNED = 'returned'
}

export interface LoginRequest {
  document: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message: string
  errors?: string[]
}

export interface UserFilters {
  search?: string
  status?: UserStatus
}

export interface ClientFilters {
  search?: string
  document?: string
  status?: ClientStatus
}

export interface MovieFilters {
  search: string
  year?: string
  page?: number
}

export interface RentalFilters {
  clientSearch?: string
  rentalDateFrom?: Date
  rentalDateTo?: Date
  returnDateFrom?: Date
  returnDateTo?: Date
  status?: RentalStatus
}

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
}

export interface ViaCepResponse {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  ibge: string
  gia: string
  ddd: string
  siafi: string
  erro?: boolean
}

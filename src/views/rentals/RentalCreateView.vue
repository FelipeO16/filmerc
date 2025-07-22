<template>
  <div class="space-y-6">
    <div class="md:flex md:items-center md:justify-between">
      <div class="flex-1 min-w-0">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Nova Locação
        </h2>
        <p class="mt-1 text-sm text-gray-500">
          Crie uma nova locação selecionando cliente e filmes.
        </p>
      </div>
      <div class="mt-4 flex md:mt-0 md:ml-4">
        <BaseButton variant="outline" @click="$router.push('/rentals')"> Voltar </BaseButton>
      </div>
    </div>

    <BaseCard>
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Cliente *</label>
            <select
              v-model="form.clientId"
              required
              :class="[
                'block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                errors.clientId ? 'border-red-300' : '',
              ]"
            >
              <option value="">Selecione um cliente</option>
              <option v-for="client in availableClients" :key="client.id" :value="client.id">
                {{ client.name }} {{ client.lastName }} ({{ formatCpf(client.cpf) }})
              </option>
            </select>
            <p v-if="errors.clientId" class="mt-1 text-sm text-red-600">{{ errors.clientId }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Data de Devolução *</label>
            <input
              v-model="form.returnDate"
              type="date"
              required
              :min="minReturnDate"
              :class="[
                'block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                errors.returnDate ? 'border-red-300' : '',
              ]"
            />
            <p v-if="errors.returnDate" class="mt-1 text-sm text-red-600">
              {{ errors.returnDate }}
            </p>
          </div>
        </div>

        <div>
          <div class="flex justify-between items-center mb-4">
            <label class="block text-sm font-medium text-gray-700">Filmes Selecionados</label>
            <BaseButton type="button" variant="outline" @click="showMovieSearch = true">
              <el-icon class="mr-2">
                <Plus />
              </el-icon>
              Adicionar Filme
            </BaseButton>
          </div>

          <div
            v-if="selectedMovies.length === 0"
            class="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg"
          >
            <el-icon class="h-12 w-12 text-gray-400 mx-auto mb-4">
              <Film />
            </el-icon>
            <p class="text-gray-500">Nenhum filme selecionado</p>
            <p class="text-sm text-gray-400">Clique em "Adicionar Filme" para começar</p>
          </div>

          <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="movie in selectedMovies"
              :key="movie.imdbID"
              class="relative bg-white border border-gray-200 rounded-lg p-4"
            >
              <button
                type="button"
                @click="removeMovie(movie.imdbID)"
                class="absolute top-2 right-2 text-gray-400 hover:text-red-600"
              >
                <el-icon class="h-5 w-5">
                  <Close />
                </el-icon>
              </button>

              <div class="flex items-start space-x-3">
                <img
                  v-if="movie.Poster && movie.Poster !== 'N/A'"
                  :src="movie.Poster"
                  :alt="movie.Title"
                  class="w-16 h-24 object-cover rounded"
                />
                <div v-else class="w-16 h-24 bg-gray-200 rounded flex items-center justify-center">
                  <el-icon class="h-8 w-8 text-gray-400">
                    <Film />
                  </el-icon>
                </div>

                <div class="flex-1 min-w-0">
                  <h4 class="text-sm font-medium text-gray-900 truncate">{{ movie.Title }}</h4>
                  <p class="text-sm text-gray-500">{{ movie.Year }}</p>
                  <p class="text-xs text-gray-400">{{ movie.imdbID }}</p>
                </div>
              </div>
            </div>
          </div>

          <p v-if="errors.movies" class="mt-2 text-sm text-red-600">{{ errors.movies }}</p>
        </div>

        <div class="flex justify-end space-x-3">
          <BaseButton type="button" variant="outline" @click="$router.push('/rentals')">
            Cancelar
          </BaseButton>
          <BaseButton type="submit" :loading="loading" :disabled="selectedMovies.length === 0">
            Criar Locação
          </BaseButton>
        </div>
      </form>
    </BaseCard>
  </div>

  <div
    v-if="showMovieSearch"
    class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
  >
    <div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-semibold text-gray-900">Buscar Filmes</h3>
          <button @click="showMovieSearch = false" class="text-gray-400 hover:text-gray-600">
            <el-icon class="h-6 w-6">
              <Close />
            </el-icon>
          </button>
        </div>

        <div class="mb-6">
          <div class="flex space-x-4">
            <div class="flex-1">
              <BaseInput
                v-model="movieSearch.query"
                placeholder="Digite o nome do filme..."
                @keyup.enter="searchMovies"
              />
            </div>
            <BaseButton @click="searchMovies" :loading="movieSearchLoading">
              <el-icon class="mr-2">
                <Search />
              </el-icon>
              Buscar
            </BaseButton>
          </div>
        </div>

        <div v-if="movieSearchLoading" class="text-center py-8">
          <div
            class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
          ></div>
          <p class="mt-2 text-gray-500">Buscando filmes...</p>
        </div>

        <div
          v-else-if="searchResults.length === 0 && movieSearch.hasSearched"
          class="text-center py-8"
        >
          <el-icon class="h-16 w-16 text-gray-400 mx-auto mb-4">
            <Document />
          </el-icon>
          <p class="text-gray-500">Nenhum filme encontrado</p>
        </div>

        <div
          v-else-if="searchResults.length > 0"
          class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 max-h-96 overflow-y-auto"
        >
          <div
            v-for="movie in searchResults"
            :key="movie.imdbID"
            class="border border-gray-200 rounded-lg p-3"
          >
            <div class="flex items-start space-x-3">
              <img
                v-if="movie.Poster && movie.Poster !== 'N/A'"
                :src="movie.Poster"
                :alt="movie.Title"
                class="w-12 h-18 object-cover rounded"
              />
              <div v-else class="w-12 h-18 bg-gray-200 rounded flex items-center justify-center">
                <el-icon class="h-6 w-6 text-gray-400">
                  <Film />
                </el-icon>
              </div>

              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-medium text-gray-900 truncate">{{ movie.Title }}</h4>
                <p class="text-sm text-gray-500">{{ movie.Year }}</p>
                <BaseButton
                  size="small"
                  variant="primary"
                  @click="addMovie(movie)"
                  :disabled="isMovieSelected(movie.imdbID)"
                  class="mt-2"
                >
                  {{ isMovieSelected(movie.imdbID) ? 'Selecionado' : 'Adicionar' }}
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useClientStore } from '@/stores/client'
import { useRentalStore } from '@/stores/rental'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'
import { MovieService } from '@/services/movie-service'
import type { Movie, CreateRentalRequest } from '@/types'
import { ClientStatus } from '@/types'
import BaseCard from '@/components/atoms/BaseCard.vue'
import BaseInput from '@/components/atoms/BaseInput.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'
import { Plus, Film, Close, Search, Document } from '@element-plus/icons-vue'

const router = useRouter()
const clientStore = useClientStore()
const rentalStore = useRentalStore()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const loading = ref(false)
const showMovieSearch = ref(false)
const movieSearchLoading = ref(false)
const selectedMovies = ref<Movie[]>([])
const searchResults = ref<Movie[]>([])

const form = reactive({
  clientId: '',
  returnDate: '',
})

const movieSearch = reactive({
  query: '',
  hasSearched: false,
})

const errors = reactive({
  clientId: '',
  returnDate: '',
  movies: '',
})

const minReturnDate = computed(() => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().split('T')[0]
})

const availableClients = computed(() => {
  return clientStore.clients.filter(
    (client) =>
      client.status === ClientStatus.ACTIVE && !clientStore.hasActiveRentalsForClient(client.id),
  )
})

onMounted(() => {
  clientStore.loadClients()
  form.returnDate = minReturnDate.value
})

function validateForm() {
  errors.clientId = ''
  errors.returnDate = ''
  errors.movies = ''

  let isValid = true

  if (!form.clientId) {
    errors.clientId = 'Selecione um cliente'
    isValid = false
  }

  if (!form.returnDate) {
    errors.returnDate = 'Data de devolução é obrigatória'
    isValid = false
  }

  if (selectedMovies.value.length === 0) {
    errors.movies = 'Selecione pelo menos um filme'
    isValid = false
  }

  return isValid
}

async function handleSubmit() {
  if (!validateForm()) return

  try {
    loading.value = true

    const rentalData: CreateRentalRequest = {
      clientId: form.clientId,
      movieIds: selectedMovies.value.map((movie) => movie.imdbID),
      rentalDate: new Date(),
      returnDate: new Date(form.returnDate),
      userId: authStore.user!.id,
    }

    const success = await rentalStore.createRental(rentalData)

    if (success) {
      await router.push('/rentals')
    }
  } catch (error) {
    console.error('Erro ao criar locação:', error)
  } finally {
    loading.value = false
  }
}

async function searchMovies() {
  if (!movieSearch.query.trim()) return

  try {
    movieSearchLoading.value = true
    movieSearch.hasSearched = true

    const response = await MovieService.searchMovies({
      search: movieSearch.query,
      year: '',
      page: 1,
    })

    if (response.Response === 'True') {
      searchResults.value = response.Search || []
    } else {
      searchResults.value = []
    }
  } catch (error) {
    console.error('Erro na busca de filmes:', error)

    if (error instanceof Error && error.message.includes('Chave da API OMDb não configurada')) {
      notificationStore.showError(
        'Chave da API OMDb não configurada. Crie um arquivo .env na raiz do projeto com VITE_OMDB_API_KEY=sua_chave_aqui',
      )
    }

    searchResults.value = []
  } finally {
    movieSearchLoading.value = false
  }
}

function addMovie(movie: Movie) {
  if (!isMovieSelected(movie.imdbID)) {
    selectedMovies.value.push(movie)
  }
}

function removeMovie(imdbID: string) {
  const index = selectedMovies.value.findIndex((movie) => movie.imdbID === imdbID)
  if (index > -1) {
    selectedMovies.value.splice(index, 1)
  }
}

function isMovieSelected(imdbID: string) {
  return selectedMovies.value.some((movie) => movie.imdbID === imdbID)
}

function formatCpf(cpf: string) {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}
</script>

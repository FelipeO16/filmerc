<template>
  <div class="space-y-6">
    <div class="md:flex md:items-center md:justify-between">
      <div class="flex-1 min-w-0">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Buscar Filmes
        </h2>
        <p class="mt-1 text-sm text-gray-500">
          Explore o catálogo de filmes usando a base de dados OMDb.
        </p>
      </div>
    </div>

    <BaseCard>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nome do Filme</label>
          <BaseInput
            v-model="filters.search"
            placeholder="Digite o nome do filme..."
            @input="debouncedSearch"
            @keyup.enter="performSearch"
          >
            <template #suffix>
              <el-icon class="text-gray-400">
                <Search />
              </el-icon>
            </template>
          </BaseInput>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Ano</label>
          <BaseInput
            v-model="filters.year"
            placeholder="Ano (ex: 2023)"
            type="number"
            min="1900"
            max="2030"
            @input="debouncedSearch"
          />
        </div>

        <div class="flex items-end space-x-2">
          <BaseButton variant="primary" @click="performSearch" :loading="loading">
            <el-icon class="mr-2">
              <Search />
            </el-icon>
            Buscar
          </BaseButton>
          <BaseButton variant="outline" @click="clearFilters"> Limpar </BaseButton>
        </div>
      </div>
    </BaseCard>

    <div v-if="!hasSearched && !loading" class="text-center py-12">
      <el-icon class="h-16 w-16 text-gray-400 mx-auto mb-4">
        <Film />
      </el-icon>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Busque por filmes</h3>
      <p class="text-gray-500">Digite o nome de um filme para começar a busca.</p>
    </div>

    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="mt-2 text-gray-500">Buscando filmes...</p>
    </div>

    <div v-if="error" class="text-center py-12">
      <el-icon class="h-16 w-16 text-red-400 mx-auto mb-4">
        <Warning />
      </el-icon>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Erro na busca</h3>
      <p class="text-red-600">{{ error }}</p>
      <BaseButton variant="outline" @click="performSearch" class="mt-4">
        Tentar novamente
      </BaseButton>
    </div>

    <div v-if="hasSearched && !loading && !error && movies.length === 0" class="text-center py-12">
      <el-icon class="h-16 w-16 text-gray-400 mx-auto mb-4">
        <Document />
      </el-icon>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhum filme encontrado</h3>
      <p class="text-gray-500">Tente uma busca diferente ou verifique a ortografia.</p>
    </div>

    <div
      v-if="movies.length > 0"
      class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      <div
        v-for="movie in movies"
        :key="movie.imdbID"
        class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
      >
        <div class="aspect-w-2 aspect-h-3 bg-gray-200">
          <img
            v-if="movie.Poster && movie.Poster !== 'N/A'"
            :src="movie.Poster"
            :alt="movie.Title"
            class="w-full h-64 object-cover"
            @error="handleImageError"
          />
          <div v-else class="w-full h-64 bg-gray-200 flex items-center justify-center">
            <el-icon class="h-16 w-16 text-gray-400">
              <Film />
            </el-icon>
          </div>
        </div>
        <div class="p-4">
          <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{{ movie.Title }}</h3>
          <div class="space-y-1 text-sm text-gray-600">
            <p><span class="font-medium">Ano:</span> {{ movie.Year }}</p>
            <p><span class="font-medium">Tipo:</span> {{ movie.Type }}</p>
            <p v-if="movie.imdbID"><span class="font-medium">ID IMDb:</span> {{ movie.imdbID }}</p>
          </div>
          <div class="mt-4 flex justify-between items-center">
            <BaseButton variant="outline" size="small" @click="viewDetails(movie)">
              Ver Detalhes
            </BaseButton>
            <BaseButton variant="primary" size="small" @click="selectMovie(movie)">
              Selecionar
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <div v-if="movies.length > 0 && totalResults > movies.length" class="text-center mt-6">
      <BaseButton variant="outline" @click="loadMore" :loading="loadingMore">
        Carregar mais filmes
      </BaseButton>
      <p class="text-sm text-gray-500 mt-2">
        Mostrando {{ movies.length }} de {{ totalResults }} resultados
      </p>
    </div>
  </div>

  <div
    v-if="selectedMovie"
    class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
  >
    <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-xl font-bold text-gray-900">{{ selectedMovie.Title }}</h3>
          <button @click="selectedMovie = null" class="text-gray-400 hover:text-gray-600">
            <el-icon class="h-6 w-6">
              <Close />
            </el-icon>
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <img
              v-if="selectedMovie.Poster && selectedMovie.Poster !== 'N/A'"
              :src="selectedMovie.Poster"
              :alt="selectedMovie.Title"
              class="w-full rounded-lg shadow-md"
            />
            <div v-else class="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
              <el-icon class="h-24 w-24 text-gray-400">
                <Film />
              </el-icon>
            </div>
          </div>

          <div class="space-y-3">
            <div>
              <span class="font-medium text-gray-700">Ano:</span>
              <span class="ml-2">{{ selectedMovie.Year }}</span>
            </div>
            <div>
              <span class="font-medium text-gray-700">Tipo:</span>
              <span class="ml-2">{{ selectedMovie.Type }}</span>
            </div>
            <div>
              <span class="font-medium text-gray-700">ID IMDb:</span>
              <span class="ml-2">{{ selectedMovie.imdbID }}</span>
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-end space-x-3">
          <BaseButton variant="outline" @click="selectedMovie = null"> Fechar </BaseButton>
          <BaseButton variant="primary" @click="selectMovie(selectedMovie)">
            Selecionar Filme
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { MovieService } from '@/services/movie-service'
import { useNotificationStore } from '@/stores/notification'
import type { Movie, MovieFilters } from '@/types'
import BaseCard from '@/components/atoms/BaseCard.vue'
import BaseInput from '@/components/atoms/BaseInput.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'
import { Search, Film, Warning, Document, Close } from '@element-plus/icons-vue'

const notificationStore = useNotificationStore()

const loading = ref(false)
const loadingMore = ref(false)
const hasSearched = ref(false)
const error = ref('')
const movies = ref<Movie[]>([])
const totalResults = ref(0)
const currentPage = ref(1)
const selectedMovie = ref<Movie | null>(null)

const filters = reactive<MovieFilters>({
  search: '',
  year: '',
  page: 1,
})

let searchTimeout: number

function debouncedSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    if (filters.search.trim()) {
      performSearch()
    }
  }, 500)
}

async function performSearch() {
  if (!filters.search.trim()) {
    notificationStore.showWarning('Digite o nome de um filme para buscar')
    return
  }

  try {
    loading.value = true
    error.value = ''
    currentPage.value = 1
    filters.page = 1

    const response = await MovieService.searchMovies(filters)

    if (response.Response === 'True') {
      movies.value = response.Search || []
      totalResults.value = parseInt(response.totalResults || '0')
      hasSearched.value = true
    } else {
      movies.value = []
      totalResults.value = 0
      error.value = response.Error || 'Erro desconhecido na busca'
      hasSearched.value = true
    }
  } catch (err) {
    console.error('Erro na busca:', err)

    if (err instanceof Error && err.message.includes('Chave da API OMDb não configurada')) {
      error.value =
        'Chave da API OMDb não configurada. Crie um arquivo .env na raiz do projeto com VITE_OMDB_API_KEY=sua_chave_aqui'
    } else {
      error.value = 'Erro ao buscar filmes. Verifique sua conexão.'
    }

    movies.value = []
    totalResults.value = 0
    hasSearched.value = true
  } finally {
    loading.value = false
  }
}

async function loadMore() {
  if (!filters.search.trim()) return

  try {
    loadingMore.value = true
    currentPage.value++
    filters.page = currentPage.value

    const response = await MovieService.searchMovies(filters)

    if (response.Response === 'True' && response.Search) {
      movies.value.push(...response.Search)
    }
  } catch (err) {
    console.error('Erro ao carregar mais filmes:', err)
    notificationStore.showError('Erro ao carregar mais filmes')
    currentPage.value--
    filters.page = currentPage.value
  } finally {
    loadingMore.value = false
  }
}

function clearFilters() {
  filters.search = ''
  filters.year = ''
  filters.page = 1
  movies.value = []
  totalResults.value = 0
  currentPage.value = 1
  hasSearched.value = false
  error.value = ''
}

function viewDetails(movie: Movie) {
  selectedMovie.value = movie
}

function selectMovie(movie: Movie) {
  notificationStore.showSuccess(`Filme "${movie.Title}" selecionado`)
  selectedMovie.value = null
}

function handleImageError(event: Event) {
  const target = event.target as HTMLImageElement
  target.style.display = 'none'
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

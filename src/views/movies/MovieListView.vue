<template>
  <div class="space-y-8">
    <div class="md:flex md:items-center md:justify-between">
      <div class="flex-1 min-w-0">
        <h2
          class="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
        >
          Buscar Filmes
        </h2>
        <p class="mt-2 text-lg text-gray-600">
          Explore o catálogo de filmes usando a base de dados OMDb.
        </p>
      </div>
    </div>

    <BaseCard variant="glass" padding="large">
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Nome do Filme</label>
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
          <label class="block text-sm font-semibold text-gray-700 mb-2">Ano</label>
          <BaseInput
            v-model="filters.year"
            placeholder="Ano (ex: 2023)"
            type="number"
            min="1900"
            max="2030"
            @input="debouncedSearch"
          />
        </div>

        <div class="flex items-end space-x-3">
          <BaseButton
            variant="gradient"
            @click="performSearch"
            :loading="loading"
            class="flex-1 h-10"
            icon="Search"
          >
            Buscar
          </BaseButton>
          <BaseButton variant="outline" @click="clearFilters" class="h-10" icon="Refresh">
            Limpar
          </BaseButton>
        </div>
      </div>
    </BaseCard>

    <div v-if="!hasSearched && !loading" class="text-center py-16">
      <div
        class="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <el-icon class="h-12 w-12 text-blue-600">
          <Film />
        </el-icon>
      </div>
      <h3 class="text-2xl font-bold text-gray-900 mb-3">Busque por filmes</h3>
      <p class="text-lg text-gray-600">Digite o nome de um filme para começar a busca.</p>
    </div>

    <div v-if="loading" class="text-center py-16">
      <div
        class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"
      ></div>
      <p class="mt-4 text-lg text-gray-600">Buscando filmes...</p>
    </div>

    <div v-if="error" class="text-center py-16">
      <div
        class="w-24 h-24 bg-gradient-to-br from-red-100 to-pink-200 rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <el-icon class="h-12 w-12 text-red-600">
          <Warning />
        </el-icon>
      </div>
      <h3 class="text-2xl font-bold text-gray-900 mb-3">Erro na busca</h3>
      <p class="text-lg text-red-600 mb-6">{{ error }}</p>
      <BaseButton variant="outline" @click="performSearch" icon="Refresh">
        Tentar novamente
      </BaseButton>
    </div>

    <div v-if="hasSearched && !loading && !error && movies.length === 0" class="text-center py-16">
      <div
        class="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <el-icon class="h-12 w-12 text-gray-600">
          <Document />
        </el-icon>
      </div>
      <h3 class="text-2xl font-bold text-gray-900 mb-3">Nenhum filme encontrado</h3>
      <p class="text-lg text-gray-600">Tente uma busca diferente ou verifique a ortografia.</p>
    </div>

    <div
      v-if="movies.length > 0"
      class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      <div
        v-for="movie in movies"
        :key="movie.imdbID"
        class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-white/20"
      >
        <div class="aspect-w-2 aspect-h-3 bg-gradient-to-br from-gray-100 to-gray-200">
          <img
            v-if="movie.Poster && movie.Poster !== 'N/A' && !movie.imageError"
            :src="movie.Poster"
            :alt="movie.Title"
            class="w-full h-64 object-cover"
            @error="handleImageError(movie)"
          />
          <div
            v-else
            class="w-full h-64 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center"
          >
            <el-icon class="h-16 w-16 text-gray-400">
              <Film />
            </el-icon>
          </div>
        </div>
        <div class="p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-3 line-clamp-2">{{ movie.Title }}</h3>
          <div class="space-y-2 text-sm text-gray-600 mb-4">
            <p><span class="font-semibold">Ano:</span> {{ movie.Year }}</p>
            <p><span class="font-semibold">Tipo:</span> {{ movie.Type }}</p>
            <p v-if="movie.imdbID">
              <span class="font-semibold">ID IMDb:</span> {{ movie.imdbID }}
            </p>
          </div>
          <div class="flex justify-between items-center">
            <BaseButton variant="outline" size="small" @click="viewDetails(movie)" icon="View">
              Detalhes
            </BaseButton>
            <BaseButton variant="gradient" size="small" @click="selectMovie(movie)" icon="Check">
              Selecionar
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <div v-if="movies.length > 0 && totalResults > movies.length" class="text-center mt-8">
      <BaseButton
        variant="outline"
        @click="loadMore"
        :loading="loadingMore"
        size="large"
        icon="Download"
      >
        Carregar mais filmes
      </BaseButton>
      <p class="text-sm text-gray-600 mt-3">
        Mostrando {{ movies.length }} de {{ totalResults }} resultados
      </p>
    </div>
  </div>

  <div
    v-if="selectedMovie"
    class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
  >
    <div
      class="bg-white/95 backdrop-blur-md rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20"
    >
      <div class="p-8">
        <div class="flex justify-between items-start mb-6">
          <h3
            class="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
          >
            {{ selectedMovie.Title }}
          </h3>
          <button
            @click="selectedMovie = null"
            class="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
          >
            <el-icon class="h-6 w-6">
              <Close />
            </el-icon>
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <img
              v-if="
                selectedMovie.Poster && selectedMovie.Poster !== 'N/A' && !selectedMovie.imageError
              "
              :src="selectedMovie.Poster"
              :alt="selectedMovie.Title"
              class="w-full rounded-xl shadow-lg"
              @error="handleImageError(selectedMovie)"
            />
            <div
              v-else
              class="w-full h-96 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center"
            >
              <el-icon class="h-24 w-24 text-gray-400">
                <Film />
              </el-icon>
            </div>
          </div>

          <div class="space-y-4">
            <div
              class="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200/50"
            >
              <h4 class="font-semibold text-gray-900 mb-3">Informações do Filme</h4>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="font-medium text-gray-700">Ano:</span>
                  <span class="text-gray-900">{{ selectedMovie.Year }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="font-medium text-gray-700">Tipo:</span>
                  <span class="text-gray-900">{{ selectedMovie.Type }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="font-medium text-gray-700">ID IMDb:</span>
                  <span class="text-gray-900 font-mono">{{ selectedMovie.imdbID }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-8 flex justify-end space-x-4">
          <BaseButton variant="outline" @click="selectedMovie = null" icon="Close">
            Fechar
          </BaseButton>
          <BaseButton variant="gradient" @click="selectMovie(selectedMovie)" icon="Check">
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

function handleImageError(movie: Movie) {
  movie.imageError = true
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

import { omdbApi } from './api'
import type { Movie, MovieSearchResponse, MovieDetailResponse, MovieFilters } from '@/types'

const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY || ''

export class MovieService {
  static async searchMovies(filters: MovieFilters): Promise<MovieSearchResponse> {
    try {
      if (!OMDB_API_KEY) {
        throw new Error('Chave da API OMDb não configurada. Adicione VITE_OMDB_API_KEY no arquivo .env')
      }

      const params = {
        apikey: OMDB_API_KEY,
        s: filters.search,
        type: 'movie',
        y: filters.year,
        page: filters.page || 1,
      }

      const response = await omdbApi.get<MovieSearchResponse>('/', { params })

      if (response.data.Response === 'False') {
        return {
          Search: [],
          totalResults: '0',
          Response: 'False',
          Error: response.data.Error || 'Nenhum filme encontrado'
        }
      }

      return response.data
    } catch (error) {
      console.error('Erro ao buscar filmes:', error)
      throw new Error('Falha ao buscar filmes')
    }
  }

  static async getMovieDetails(imdbId: string): Promise<MovieDetailResponse> {
    try {
      if (!OMDB_API_KEY) {
        throw new Error('Chave da API OMDb não configurada. Adicione VITE_OMDB_API_KEY no arquivo .env')
      }

      const params = {
        apikey: OMDB_API_KEY,
        i: imdbId,
        plot: 'full',
      }

      const response = await omdbApi.get<MovieDetailResponse>('/', { params })

      if (response.data.Response === 'False') {
        throw new Error('Filme não encontrado')
      }

      return response.data
    } catch (error) {
      console.error('Erro ao obter detalhes do filme:', error)
      throw new Error('Falha ao obter detalhes do filme')
    }
  }

  static async getMoviesByIds(imdbIds: string[]): Promise<Movie[]> {
    try {
      const movies = await Promise.all(
        imdbIds.map(id => this.getMovieDetails(id))
      )
      return movies
    } catch (error) {
      console.error('Erro ao obter filmes por IDs:', error)
      throw new Error('Falha ao obter filmes')
    }
  }

  static getYearOptions(): number[] {
    const currentYear = new Date().getFullYear()
    const years: number[] = []

    for (let year = currentYear; year >= 1900; year--) {
      years.push(year)
    }

    return years
  }
}

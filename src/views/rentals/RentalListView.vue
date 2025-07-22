<template>
  <div class="space-y-6">
    <div class="md:flex md:items-center md:justify-between">
      <div class="flex-1 min-w-0">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Gerenciamento de Locações
        </h2>
        <p class="mt-1 text-sm text-gray-500">Gerencie locações ativas, devoluções e histórico.</p>
      </div>
      <div class="mt-4 flex md:mt-0 md:ml-4">
        <BaseButton variant="primary" @click="$router.push('/rentals/create')">
          <el-icon class="mr-2">
            <Plus />
          </el-icon>
          Nova Locação
        </BaseButton>
      </div>
    </div>

    <BaseCard>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Buscar Cliente</label>
          <BaseInput
            v-model="filters.clientSearch"
            placeholder="Buscar por cliente..."
            @input="debouncedSearch"
          >
            <template #suffix>
              <el-icon class="text-gray-400">
                <Search />
              </el-icon>
            </template>
          </BaseInput>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Data de Locação</label>
          <el-date-picker
            v-model="filters.rentalDateFrom"
            type="date"
            placeholder="Selecione a data"
            format="DD/MM/YYYY"
            value-format="YYYY-MM-DD"
            class="w-full"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Data de Devolução</label>
          <el-date-picker
            v-model="filters.returnDateFrom"
            type="date"
            placeholder="Selecione a data"
            format="DD/MM/YYYY"
            value-format="YYYY-MM-DD"
            class="w-full"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <el-select
            v-model="filters.status"
            placeholder="Todos os status"
            clearable
            class="w-full"
          >
            <el-option label="Alugado" :value="RentalStatus.RENTED" />
            <el-option label="Entregue" :value="RentalStatus.RETURNED" />
          </el-select>
        </div>

        <div class="flex items-end">
          <BaseButton variant="outline" @click="clearFilters" class="w-full h-10" icon="Refresh">
            Limpar
          </BaseButton>
        </div>
      </div>
    </BaseCard>

    <BaseCard>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Cliente
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Filmes
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Datas
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Usuário
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Ações
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="rental in displayedRentals" :key="rental.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div
                      class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center"
                    >
                      <el-icon class="h-6 w-6 text-blue-600">
                        <UserFilled />
                      </el-icon>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ rental.client.name }} {{ rental.client.lastName }}
                    </div>
                    <div class="text-sm text-gray-500">{{ rental.client.email }}</div>
                  </div>
                </div>
              </td>

              <td class="px-6 py-4">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="movie in rental.movies.slice(0, 2)"
                    :key="movie.imdbID"
                    class="inline-flex items-center rounded-full p-1 text-xs font-medium text-center bg-gray-100 text-gray-800"
                  >
                    {{ movie.Title }}
                  </span>
                  <span
                    v-if="rental.movies.length > 2"
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600"
                  >
                    +{{ rental.movies.length - 2 }} mais
                  </span>
                </div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  <div>Locado: {{ formatDate(rental.rentalDate) }}</div>
                  <div>Devolver: {{ formatDate(rental.returnDate) }}</div>
                </div>
                <div v-if="isOverdue(rental)" class="text-xs text-red-600 font-medium">
                  Atrasado
                </div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ rental.user.name }}</div>
                <div class="text-sm text-gray-500">{{ formatCpf(rental.user.document) }}</div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    rental.status === RentalStatus.RENTED
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800',
                  ]"
                >
                  {{ rental.status === RentalStatus.RENTED ? 'Alugado' : 'Entregue' }}
                </span>
              </td>

              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                  <BaseButton
                    v-if="rental.status === RentalStatus.RENTED"
                    variant="success"
                    size="small"
                    @click="returnRental(rental.id)"
                    :loading="loading"
                    icon="Check"
                  >
                    Devolver
                  </BaseButton>
                  <BaseButton
                    variant="outline"
                    size="small"
                    @click="viewRentalDetails(rental)"
                    icon="View"
                  >
                    Detalhes
                  </BaseButton>
                </div>
              </td>
            </tr>

            <tr v-if="displayedRentals.length === 0">
              <td colspan="6" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                <div class="flex flex-col items-center justify-center py-8">
                  <el-icon class="h-12 w-12 text-gray-400 mb-4">
                    <Tickets />
                  </el-icon>
                  <p class="text-lg font-medium text-gray-900 mb-2">Nenhuma locação encontrada</p>
                  <p class="text-gray-500">Tente ajustar os filtros ou crie uma nova locação.</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </BaseCard>
  </div>

  <div
    v-if="showDetailsModal"
    class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
  >
    <div
      class="bg-white/95 backdrop-blur-md rounded-2xl max-w-4xl w-full max-h-[90vh] shadow-2xl border border-white/20 p-4"
    >
      <div class="p-4 max-h-[80vh] overflow-y-auto">
        <div class="flex justify-between items-start mb-6">
          <div class="flex items-center space-x-4">
            <h3
              class="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
            >
              Detalhes da Locação
            </h3>
            <span
              :class="[
                'inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold',
                selectedRental?.status === RentalStatus.RENTED
                  ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200'
                  : 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-200',
              ]"
            >
              {{ selectedRental?.status === RentalStatus.RENTED ? 'Alugado' : 'Entregue' }}
            </span>
          </div>
          <button
            @click="showDetailsModal = false"
            class="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
          >
            <el-icon class="h-6 w-6">
              <Close />
            </el-icon>
          </button>
        </div>

        <div v-if="selectedRental" class="space-y-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BaseCard variant="glass" padding="large">
              <div class="flex items-center mb-4">
                <div
                  class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg mr-4"
                >
                  <el-icon class="h-6 w-6">
                    <UserFilled class="text-white" />
                  </el-icon>
                </div>
                <div>
                  <h4 class="text-lg font-semibold text-gray-900">Cliente</h4>
                  <p class="text-sm text-gray-600">Informações do cliente</p>
                </div>
              </div>
              <div class="space-y-3">
                <div class="flex items-center">
                  <div class="flex-1">
                    <p class="font-semibold text-gray-900">
                      {{ selectedRental.client?.name }} {{ selectedRental.client?.lastName }}
                    </p>
                    <p class="text-sm text-gray-600">{{ selectedRental.client?.email }}</p>
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span class="font-medium text-gray-700">CPF:</span>
                    <span class="text-gray-900">{{
                      formatCpf(selectedRental.client?.cpf || '')
                    }}</span>
                  </div>
                  <div>
                    <span class="font-medium text-gray-700">Telefone:</span>
                    <span class="text-gray-900">{{ selectedRental.client?.phone }}</span>
                  </div>
                </div>
              </div>
            </BaseCard>

            <BaseCard variant="glass" padding="large">
              <div class="flex items-center mb-4">
                <div
                  class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg mr-4"
                >
                  <el-icon class="h-6 w-6">
                    <Calendar class="text-white" />
                  </el-icon>
                </div>
                <div>
                  <h4 class="text-lg font-semibold text-gray-900">Datas</h4>
                  <p class="text-sm text-gray-600">Período da locação</p>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-6">
                <div>
                  <p class="text-sm font-medium text-gray-700">Data de Locação</p>
                  <p class="text-lg font-semibold text-gray-900">
                    {{ formatDate(selectedRental.rentalDate) }}
                  </p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-700">Data de Devolução</p>
                  <p class="text-lg font-semibold text-gray-900">
                    {{ formatDate(selectedRental.returnDate) }}
                  </p>
                </div>
              </div>
            </BaseCard>
          </div>

          <BaseCard variant="glass" padding="large">
            <div class="flex items-center mb-4">
              <div
                class="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg mr-4"
              >
                <el-icon class="h-6 w-6">
                  <Film class="text-white" />
                </el-icon>
              </div>
              <div>
                <h4 class="text-lg font-semibold text-gray-900">Filmes Alugados</h4>
                <p class="text-sm text-gray-600">{{ selectedRental.movies?.length }} filme(s)</p>
              </div>
            </div>
            <div class="flex flex-wrap gap-4">
              <div
                v-for="movie in selectedRental.movies"
                :key="movie.imdbID"
                class="flex items-center space-x-3 p-3 bg-white/50 rounded-xl border border-white/20 min-w-[280px]"
              >
                <div
                  class="w-12 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center flex-shrink-0"
                >
                  <el-icon class="h-6 w-6 text-gray-400">
                    <Film class="text-white" />
                  </el-icon>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-semibold text-gray-900 truncate">{{ movie.Title }}</p>
                  <p class="text-sm text-gray-600">{{ movie.Year }}</p>
                </div>
              </div>
            </div>
          </BaseCard>

          <BaseCard variant="glass" padding="large">
            <div class="flex items-center mb-4">
              <div
                class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg mr-4"
              >
                <el-icon class="h-6 w-6 text-white">
                  <User class="text-white" />
                </el-icon>
              </div>
              <div>
                <h4 class="text-lg font-semibold text-gray-900">Usuário Responsável</h4>
                <p class="text-sm text-gray-600">Quem criou a locação</p>
              </div>
            </div>
            <div class="flex items-center">
              <div class="flex-1">
                <p class="font-semibold text-gray-900">{{ selectedRental.user?.name }}</p>
                <p class="text-sm text-gray-600">
                  {{ formatCpf(selectedRental.user?.document || '') }}
                </p>
              </div>
            </div>
          </BaseCard>
        </div>

        <div class="mt-8 flex justify-end">
          <BaseButton variant="outline" @click="showDetailsModal = false" icon="Close">
            Fechar
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRentalStore } from '@/stores/rental'

import { RentalStatus, type Rental } from '@/types'
import BaseCard from '@/components/atoms/BaseCard.vue'
import BaseInput from '@/components/atoms/BaseInput.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'
import {
  Plus,
  Search,
  UserFilled,
  Tickets,
  Close,
  Film,
  User,
  Calendar,
} from '@element-plus/icons-vue'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const rentalStore = useRentalStore()

const { loading } = storeToRefs(rentalStore)

const filters = ref({
  clientSearch: '',
  rentalDateFrom: '',
  returnDateFrom: '',
  status: undefined as RentalStatus | undefined,
})

const selectedRental = ref<Rental | null>(null)
const showDetailsModal = ref(false)

onMounted(() => {
  rentalStore.loadRentals()
})

const displayedRentals = computed(() => {
  const processedFilters = {
    ...filters.value,
    rentalDateFrom: filters.value.rentalDateFrom
      ? new Date(filters.value.rentalDateFrom)
      : undefined,
    returnDateFrom: filters.value.returnDateFrom
      ? new Date(filters.value.returnDateFrom)
      : undefined,
  }
  return rentalStore.filteredRentals(processedFilters)
})

let searchTimeout: number

function debouncedSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {}, 300)
}

function clearFilters() {
  filters.value = {
    clientSearch: '',
    rentalDateFrom: '',
    returnDateFrom: '',
    status: undefined,
  }
}

function returnRental(rentalId: string) {
  if (confirm('Confirmar devolução desta locação?')) {
    rentalStore.returnRental(rentalId)
  }
}

function viewRentalDetails(rental: Rental) {
  selectedRental.value = rental
  showDetailsModal.value = true
}

function formatDate(date: Date) {
  return format(date, 'dd/MM/yyyy', { locale: ptBR })
}

function formatCpf(cpf: string) {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

function isOverdue(rental: { status: RentalStatus; returnDate: Date }) {
  return rental.status === RentalStatus.RENTED && rental.returnDate < new Date()
}
</script>

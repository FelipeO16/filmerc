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
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
          <input
            v-model="filters.rentalDateFrom"
            type="date"
            class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Data de Devolução</label>
          <input
            v-model="filters.returnDateFrom"
            type="date"
            class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div class="flex items-end space-x-2">
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              v-model="filters.status"
              class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos os status</option>
              <option :value="RentalStatus.RENTED">Alugado</option>
              <option :value="RentalStatus.RETURNED">Entregue</option>
            </select>
          </div>
          <BaseButton variant="outline" @click="clearFilters">Limpar</BaseButton>
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
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
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
                  >
                    <el-icon class="mr-1">
                      <Check />
                    </el-icon>
                    Devolver
                  </BaseButton>
                  <BaseButton variant="outline" size="small" @click="viewRentalDetails(rental.id)">
                    <el-icon class="mr-1">
                      <View />
                    </el-icon>
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
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRentalStore } from '@/stores/rental'

import { RentalStatus } from '@/types'
import BaseCard from '@/components/atoms/BaseCard.vue'
import BaseInput from '@/components/atoms/BaseInput.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'
import { Plus, Search, UserFilled, Check, View, Tickets } from '@element-plus/icons-vue'
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
  searchTimeout = setTimeout(() => {
    // A busca é reativa através do computed, não precisa fazer nada aqui
  }, 300)
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

function viewRentalDetails(rentalId: string) {
  // TODO: Implementar modal ou página de detalhes
  console.log('Ver detalhes da locação:', rentalId)
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

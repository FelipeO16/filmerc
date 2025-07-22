<template>
  <div class="space-y-8">
    <div class="md:flex md:items-center md:justify-between">
      <div class="flex-1 min-w-0">
        <h2
          class="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
        >
          Gerenciamento de Clientes
        </h2>
        <p class="mt-2 text-lg text-gray-600">
          Gerencie clientes, informações de contato e endereços.
        </p>
      </div>
      <div class="mt-4 flex md:mt-0 md:ml-4">
        <BaseButton variant="primary" @click="$router.push('/clients/create')" icon="Plus">
          Novo Cliente
        </BaseButton>
      </div>
    </div>

    <BaseCard variant="glass" padding="large">
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Buscar</label>
          <BaseInput
            v-model="filters.search"
            placeholder="Buscar por nome, sobrenome ou documento..."
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
          <label class="block text-sm font-semibold text-gray-700 mb-2">Status</label>
          <el-select
            v-model="filters.status"
            placeholder="Todos os status"
            clearable
            class="w-full"
          >
            <el-option label="Ativo" :value="ClientStatus.ACTIVE" />
            <el-option label="Inativo" :value="ClientStatus.INACTIVE" />
          </el-select>
        </div>

        <div class="flex items-end">
          <BaseButton variant="outline" @click="clearFilters" class="w-full h-10" icon="Refresh">
            Limpar Filtros
          </BaseButton>
        </div>
      </div>
    </BaseCard>

    <BaseCard variant="glass" padding="none">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200/50">
          <thead class="bg-gradient-to-r from-gray-50 to-blue-50/50">
            <tr>
              <th
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Cliente
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                CPF
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Contato
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Criado em
              </th>
              <th
                class="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Ações
              </th>
            </tr>
          </thead>
          <tbody class="bg-white/50 divide-y divide-gray-200/30">
            <tr
              v-for="client in displayedClients"
              :key="client.id"
              class="hover:bg-white/80 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-12 w-12">
                    <div
                      class="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg"
                    >
                      <el-icon class="h-6 w-6">
                        <UserFilled class="text-white" />
                      </el-icon>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-semibold text-gray-900">
                      {{ client.name }} {{ client.lastName }}
                    </div>
                    <div class="text-sm text-gray-600">{{ client.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                {{ formatCpf(client.cpf) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div class="font-medium">{{ client.phone }}</div>
                <div class="text-sm text-gray-600">
                  {{ client.address.city }}/{{ client.address.state }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold',
                    client.status === ClientStatus.ACTIVE
                      ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200'
                      : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200',
                  ]"
                >
                  {{ client.status === ClientStatus.ACTIVE ? 'Ativo' : 'Inativo' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(client.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end space-x-2">
                  <BaseButton
                    variant="outline"
                    size="small"
                    @click="editClient(client.id)"
                    icon="Edit"
                  >
                    Editar
                  </BaseButton>

                  <BaseButton
                    v-if="client.status === ClientStatus.ACTIVE"
                    variant="danger"
                    size="small"
                    @click="deactivateClient(client.id)"
                    :loading="loading"
                    icon="Close"
                  >
                    Desativar
                  </BaseButton>
                </div>
              </td>
            </tr>

            <tr v-if="displayedClients.length === 0">
              <td
                colspan="6"
                class="px-6 py-12 whitespace-nowrap text-sm text-gray-500 text-center"
              >
                <div class="flex flex-col items-center justify-center">
                  <div
                    class="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mb-4"
                  >
                    <el-icon class="h-8 w-8 text-gray-400">
                      <UserFilled />
                    </el-icon>
                  </div>
                  <p class="text-lg font-semibold text-gray-900 mb-2">Nenhum cliente encontrado</p>
                  <p class="text-gray-600">Tente ajustar os filtros ou adicione um novo cliente.</p>
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
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useClientStore } from '@/stores/client'
import type { ClientFilters } from '@/types'
import { ClientStatus } from '@/types'
import BaseCard from '@/components/atoms/BaseCard.vue'
import BaseInput from '@/components/atoms/BaseInput.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'
import { Search, UserFilled, Refresh } from '@element-plus/icons-vue'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const router = useRouter()
const clientStore = useClientStore()

const { loading } = storeToRefs(clientStore)

const filters = ref<ClientFilters>({
  search: '',
  status: undefined,
})

onMounted(() => {
  clientStore.loadClients()
})

const displayedClients = computed(() => {
  return clientStore.filteredClients(filters.value)
})

let searchTimeout: number

function debouncedSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {}, 300)
}

function clearFilters() {
  filters.value = {
    search: '',
    status: undefined,
  }
}

function editClient(clientId: string) {
  router.push(`/clients/${clientId}/edit`)
}

async function deactivateClient(clientId: string) {
  if (confirm('Tem certeza que deseja desativar este cliente?')) {
    await clientStore.deleteClient(clientId)
  }
}

function formatDate(date: Date) {
  return format(date, 'dd/MM/yyyy', { locale: ptBR })
}

function formatCpf(cpf: string) {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}
</script>

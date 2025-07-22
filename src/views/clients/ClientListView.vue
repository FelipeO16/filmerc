<template>
  <div class="space-y-6">
    <div class="md:flex md:items-center md:justify-between">
      <div class="flex-1 min-w-0">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Gerenciamento de Clientes
        </h2>
        <p class="mt-1 text-sm text-gray-500">
          Gerencie clientes, informações de contato e endereços.
        </p>
      </div>
      <div class="mt-4 flex md:mt-0 md:ml-4">
        <BaseButton variant="primary" @click="$router.push('/clients/create')">
          <el-icon class="mr-2">
            <Plus />
          </el-icon>
          Novo Cliente
        </BaseButton>
      </div>
    </div>

    <BaseCard>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
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
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
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
          <BaseButton variant="outline" @click="clearFilters">Limpar Filtros</BaseButton>
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
                CPF
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Contato
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Criado em
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Ações
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="client in displayedClients" :key="client.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div
                      class="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center"
                    >
                      <el-icon class="h-6 w-6 text-green-600">
                        <UserFilled />
                      </el-icon>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ client.name }} {{ client.lastName }}
                    </div>
                    <div class="text-sm text-gray-500">{{ client.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatCpf(client.cpf) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div>{{ client.phone }}</div>
                <div class="text-xs text-gray-500">
                  {{ client.address.city }}/{{ client.address.state }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    client.status === ClientStatus.ACTIVE
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800',
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
                  <BaseButton variant="outline" size="small" @click="editClient(client.id)">
                    <el-icon class="mr-1">
                      <Edit />
                    </el-icon>
                    Editar
                  </BaseButton>

                  <BaseButton
                    v-if="client.status === ClientStatus.ACTIVE"
                    variant="danger"
                    size="small"
                    @click="deactivateClient(client.id)"
                    :loading="loading"
                  >
                    <el-icon class="mr-1">
                      <Close />
                    </el-icon>
                    Desativar
                  </BaseButton>
                </div>
              </td>
            </tr>

            <tr v-if="displayedClients.length === 0">
              <td colspan="6" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                <div class="flex flex-col items-center justify-center py-8">
                  <el-icon class="h-12 w-12 text-gray-400 mb-4">
                    <UserFilled />
                  </el-icon>
                  <p class="text-lg font-medium text-gray-900 mb-2">Nenhum cliente encontrado</p>
                  <p class="text-gray-500">Tente ajustar os filtros ou adicione um novo cliente.</p>
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
import { Plus, Search, Edit, Close, UserFilled } from '@element-plus/icons-vue'
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
  searchTimeout = setTimeout(() => {
    // A busca é reativa através do computed, não precisa fazer nada aqui
  }, 300)
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

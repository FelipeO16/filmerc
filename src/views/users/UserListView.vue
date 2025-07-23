<template>
  <div class="space-y-6">
    <div class="md:flex md:items-center md:justify-between">
      <div class="flex-1 min-w-0">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Gerenciamento de Usuários
        </h2>
        <p class="mt-1 text-sm text-gray-500">
          Gerencie usuários do sistema, permissões e status de acesso.
        </p>
      </div>
      <div class="mt-4 flex md:mt-0 md:ml-4">
        <BaseButton variant="gradient" @click="$router.push('/users/create')" icon="Plus">
          Novo Usuário
        </BaseButton>
      </div>
    </div>

    <BaseCard variant="glass" padding="large">
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Buscar</label>
          <BaseInput
            v-model="filters.search"
            placeholder="Buscar por nome ou CPF..."
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
            <el-option label="Ativo" value="active" />
            <el-option label="Inativo" value="inactive" />
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
                Usuário
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                CPF
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
              v-for="user in displayedUsers"
              :key="user.id"
              class="hover:bg-white/80 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-12 w-12">
                    <div
                      class="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg"
                    >
                      <el-icon class="h-6 w-6">
                        <User class="text-white" />
                      </el-icon>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-semibold text-gray-900">
                      {{ user.name }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                {{ formatCPF(user.document) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold',
                    user.status === 'active'
                      ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200'
                      : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200',
                  ]"
                >
                  {{ user.status === 'active' ? 'Ativo' : 'Inativo' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(user.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end space-x-2">
                  <BaseButton variant="outline" size="small" @click="editUser(user.id)" icon="Edit">
                    Editar
                  </BaseButton>

                  <BaseButton
                    v-if="user.status === 'active' && user.id !== authStore.user?.id"
                    variant="danger"
                    size="small"
                    @click="deactivateUser(user.id)"
                    :loading="loading"
                    icon="Close"
                  >
                    Desativar
                  </BaseButton>
                </div>
              </td>
            </tr>

            <tr v-if="displayedUsers.length === 0">
              <td
                colspan="5"
                class="px-6 py-12 whitespace-nowrap text-sm text-gray-500 text-center"
              >
                <div class="flex flex-col items-center justify-center">
                  <div
                    class="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mb-4"
                  >
                    <el-icon class="h-8 w-8 text-gray-400">
                      <User />
                    </el-icon>
                  </div>
                  <p class="text-lg font-semibold text-gray-900 mb-2">Nenhum usuário encontrado</p>
                  <p class="text-gray-600">Tente ajustar os filtros ou adicione um novo usuário.</p>
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
import { useUserStore } from '@/stores/user'
import { useAuthStore } from '@/stores/auth'
import type { UserFilters } from '@/types'
import BaseCard from '@/components/atoms/BaseCard.vue'
import BaseInput from '@/components/atoms/BaseInput.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'
import { Search, User } from '@element-plus/icons-vue'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const router = useRouter()
const userStore = useUserStore()
const authStore = useAuthStore()

const { loading } = storeToRefs(userStore)

const filters = ref<UserFilters>({
  search: '',
  status: undefined,
})

onMounted(() => {
  userStore.loadUsers()
})

const displayedUsers = computed(() => {
  return userStore.filteredUsers(filters.value)
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

function editUser(userId: string) {
  router.push(`/users/${userId}/edit`)
}

async function deactivateUser(userId: string) {
  if (confirm('Tem certeza que deseja desativar este usuário?')) {
    await userStore.deleteUser(userId)
  }
}

function formatDate(date: Date) {
  return format(date, 'dd/MM/yyyy', { locale: ptBR })
}

function formatCPF(cpf: string) {
  if (!cpf) return ''
  const cleanCPF = cpf.replace(/\D/g, '')
  if (cleanCPF.length !== 11) return cpf
  return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}
</script>

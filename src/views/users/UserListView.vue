<template>
  <div class="space-y-6">
    <PageHeader
      title="Gerenciamento de Usuários"
      description="Gerencie usuários do sistema, permissões e status de acesso."
    >
      <template #actions>
        <BaseButton variant="gradient" @click="$router.push('/users/create')" icon="Plus">
          Novo Usuário
        </BaseButton>
      </template>
    </PageHeader>

    <FilterBar
      :filters="filterConfig"
      v-model="filters"
      @filter-change="handleFilterChange"
    />

    <DataTable
      :columns="tableColumns"
      :items="displayedUsers"
      :empty-icon="User"
      empty-title="Nenhum usuário encontrado"
      empty-message="Tente ajustar os filtros ou adicione um novo usuário."
    >
      <template #user="{ item }">
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
              {{ item.name }}
            </div>
          </div>
        </div>
      </template>

      <template #cpf="{ item }">
        <span class="text-sm text-gray-900 font-medium">{{ formatCPF(item.document) }}</span>
      </template>

      <template #status="{ item }">
        <span
          :class="[
            'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold',
            item.status === 'active'
              ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200'
              : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200',
          ]"
        >
          {{ item.status === 'active' ? 'Ativo' : 'Inativo' }}
        </span>
      </template>

      <template #createdAt="{ item }">
        <span class="text-sm text-gray-900">{{ formatDate(item.createdAt) }}</span>
      </template>

      <template #actions="{ item }">
        <div class="flex items-center justify-end space-x-2">
          <BaseButton variant="outline" size="small" @click="editUser(String(item.id))" icon="Edit">
            Editar
          </BaseButton>

          <BaseButton
            v-if="item.status === 'active' && item.id !== authStore.user?.id"
            variant="danger"
            size="small"
            @click="deactivateUser(String(item.id))"
            :loading="loading"
            icon="Close"
          >
            Desativar
          </BaseButton>
        </div>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'
import { useAuthStore } from '@/stores/auth'
import type { UserFilters } from '@/types'
import BaseButton from '@/components/atoms/BaseButton.vue'
import PageHeader from '@/components/molecules/PageHeader.vue'
import FilterBar from '@/components/molecules/FilterBar.vue'
import DataTable from '@/components/molecules/DataTable.vue'
import { User } from '@element-plus/icons-vue'
import { format, isValid } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const router = useRouter()
const userStore = useUserStore()
const authStore = useAuthStore()

const { loading } = storeToRefs(userStore)

const filters = ref<UserFilters>({
  search: '',
  status: undefined,
})

const filterConfig = [
  {
    key: 'search',
    label: 'Buscar',
    type: 'text' as const,
    placeholder: 'Buscar por nome ou CPF...',
    icon: 'Search'
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select' as const,
    placeholder: 'Todos os status',
    options: [
      { label: 'Ativo', value: 'active' },
      { label: 'Inativo', value: 'inactive' }
    ]
  }
]

const tableColumns = [
  { key: 'user', label: 'Usuário' },
  { key: 'cpf', label: 'CPF' },
  { key: 'status', label: 'Status' },
  { key: 'createdAt', label: 'Criado em' },
  { key: 'actions', label: 'Ações', align: 'right' as const }
]

onMounted(() => {
  userStore.loadUsers()
})

const displayedUsers = computed(() => {
  return userStore.filteredUsers(filters.value)
})

function handleFilterChange() {
}

function editUser(userId: string) {
  router.push(`/users/${userId}/edit`)
}

async function deactivateUser(userId: string) {
  if (confirm('Tem certeza que deseja desativar este usuário?')) {
    await userStore.deleteUser(userId)
  }
}

function formatDate(date: unknown) {
  if (!date) return '-'
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date as Date
    if (!isValid(dateObj)) return '-'
    return format(dateObj, 'dd/MM/yyyy', { locale: ptBR })
  } catch {
    return '-'
  }
}

function formatCPF(cpf: unknown) {
  if (!cpf) return ''
  const cpfStr = String(cpf)
  const cleanCPF = cpfStr.replace(/\D/g, '')
  if (cleanCPF.length !== 11) return cpfStr
  return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}
</script>

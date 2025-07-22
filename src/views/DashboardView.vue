<template>
  <div class="space-y-6">
    <div class="md:flex md:items-center md:justify-between">
      <div class="flex-1 min-w-0">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Dashboard
        </h2>
        <p class="mt-1 text-sm text-gray-500">
          Bem-vindo de volta, {{ authStore.user?.name }}! Aqui está o que está acontecendo com seu
          negócio de locadora de filmes.
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <BaseCard>
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <el-icon class="h-6 w-6 text-blue-600">
                <User />
              </el-icon>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Total de Usuários</dt>
                <dd>
                  <div class="text-lg font-medium text-gray-900">{{ totalUsers }}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-5 py-3">
          <div class="text-sm">
            <BaseButton variant="outline" size="small" @click="$router.push('/users')">
              Ver todos os usuários
            </BaseButton>
          </div>
        </div>
      </BaseCard>

      <BaseCard>
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <el-icon class="h-6 w-6 text-green-600">
                <UserFilled />
              </el-icon>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Clientes Ativos</dt>
                <dd>
                  <div class="text-lg font-medium text-gray-900">{{ activeClients }}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-5 py-3">
          <div class="text-sm">
            <BaseButton variant="outline" size="small" @click="$router.push('/clients')">
              Ver todos os clientes
            </BaseButton>
          </div>
        </div>
      </BaseCard>

      <BaseCard>
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <el-icon class="h-6 w-6 text-yellow-600">
                <Film />
              </el-icon>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Locações Ativas</dt>
                <dd>
                  <div class="text-lg font-medium text-gray-900">{{ activeRentals }}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-5 py-3">
          <div class="text-sm">
            <BaseButton variant="outline" size="small" @click="$router.push('/rentals')">
              Ver todas as locações
            </BaseButton>
          </div>
        </div>
      </BaseCard>

      <BaseCard>
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <el-icon class="h-6 w-6 text-red-600">
                <Warning />
              </el-icon>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Locações em Atraso</dt>
                <dd>
                  <div class="text-lg font-medium text-gray-900">{{ overdueRentals }}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-5 py-3">
          <div class="text-sm">
            <BaseButton
              variant="link"
              size="small"
              @click="$router.push('/rentals?filter=overdue')"
            >
              Ver locações em atraso
            </BaseButton>
          </div>
        </div>
      </BaseCard>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <BaseCard>
        <div class="p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Ações Rápidas</h3>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <BaseButton
              variant="primary"
              @click="$router.push('/clients/create')"
              class="justify-center"
            >
              <el-icon class="mr-2">
                <Plus />
              </el-icon>
              Adicionar Cliente
            </BaseButton>

            <BaseButton
              variant="primary"
              @click="$router.push('/rentals/create')"
              class="justify-center"
            >
              <el-icon class="mr-2">
                <DocumentAdd />
              </el-icon>
              Nova Locação
            </BaseButton>

            <BaseButton variant="outline" @click="$router.push('/movies')" class="justify-center">
              <el-icon class="mr-2">
                <Search />
              </el-icon>
              Buscar Filmes
            </BaseButton>

            <BaseButton
              variant="outline"
              @click="$router.push('/users/create')"
              class="justify-center"
            >
              <el-icon class="mr-2">
                <UserFilled />
              </el-icon>
              Adicionar Usuário
            </BaseButton>
          </div>
        </div>
      </BaseCard>

      <BaseCard>
        <div class="p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Próximas Devoluções</h3>
          <div v-if="upcomingReturns.length > 0" class="space-y-3">
            <div
              v-for="rental in upcomingReturns"
              :key="rental.id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <p class="text-sm font-medium text-gray-900">{{ rental.client?.name }}</p>
                <p class="text-xs text-gray-500">{{ rental.movies?.length }} filme(s)</p>
              </div>
              <div class="text-right">
                <p class="text-sm text-gray-900">{{ formatDate(rental.returnDate) }}</p>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-6">
            <el-icon class="h-8 w-8 text-gray-400 mx-auto mb-2">
              <Calendar />
            </el-icon>
            <p class="text-sm text-gray-500">Nenhuma devolução próxima</p>
          </div>
        </div>
      </BaseCard>
    </div>

    <BaseCard>
      <div class="p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Locações Recentes</h3>
        <div v-if="recentRentals.length > 0" class="overflow-x-auto">
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
                  Data de Locação
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="rental in recentRentals" :key="rental.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ rental.client?.name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ rental.movies?.length }} filme(s)
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(rental.rentalDate) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      rental.status === 'rented'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800',
                    ]"
                  >
                    {{ rental.status === 'rented' ? 'Alugado' : 'Devolvido' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="text-center py-6">
          <el-icon class="h-8 w-8 text-gray-400 mx-auto mb-2">
            <Document />
          </el-icon>
          <p class="text-sm text-gray-500">Nenhuma locação recente</p>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
import { useClientStore } from '@/stores/client'
import { useRentalStore } from '@/stores/rental'
import BaseCard from '@/components/atoms/BaseCard.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'
import {
  User,
  UserFilled,
  Plus,
  Search,
  DocumentAdd,
  Calendar,
  Document,
  Film,
  Warning,
} from '@element-plus/icons-vue'
import { format } from 'date-fns'

const authStore = useAuthStore()
const userStore = useUserStore()
const clientStore = useClientStore()
const rentalStore = useRentalStore()

const { users } = storeToRefs(userStore)
const { rentals } = storeToRefs(rentalStore)

const totalUsers = computed(() => users.value.length)
const activeClients = computed(() => clientStore.activeClients.length)
const activeRentals = computed(() => rentalStore.activeRentals.length)
const overdueRentals = computed(() => rentalStore.overdueRentals.length)
const upcomingReturns = computed(() => rentalStore.upcomingReturns)
const recentRentals = computed(() => rentals.value.slice(0, 10))

function formatDate(date: Date) {
  return format(date, 'MMM dd, yyyy')
}
</script>

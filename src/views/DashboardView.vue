<template>
  <div class="space-y-8">
    <div class="md:flex md:items-center md:justify-between">
      <div class="flex-1 min-w-0">
        <h2
          class="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
        >
          Dashboard
        </h2>
        <p class="mt-2 text-lg text-gray-600">
          Bem-vindo de volta,
          <span class="font-semibold text-blue-600">{{ authStore.user?.name }}</span
          >! Aqui está o que está acontecendo com seu negócio de locadora de filmes.
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <BaseCard variant="glass">
        <div class="p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div
                class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg"
              >
                <el-icon class="h-6 w-6">
                  <User class="text-white" />
                </el-icon>
              </div>
            </div>
            <div class="ml-4 w-0 flex-1">
              <dl>
                <dt class="text-sm font-semibold text-gray-600 truncate">Total de Usuários</dt>
                <dd>
                  <div class="text-2xl font-bold text-gray-900">{{ totalUsers }}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div
          class="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-5 border-t border-blue-200/50"
        >
          <div class="text-sm">
            <BaseButton
              variant="outline"
              size="small"
              @click="$router.push('/users')"
              class="w-full text-xs"
              icon="View"
            >
              Ver usuários
            </BaseButton>
          </div>
        </div>
      </BaseCard>

      <BaseCard variant="glass">
        <div class="p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div
                class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg"
              >
                <el-icon class="h-6 w-6">
                  <UserFilled class="text-white" />
                </el-icon>
              </div>
            </div>
            <div class="ml-4 w-0 flex-1">
              <dl>
                <dt class="text-sm font-semibold text-gray-600 truncate">Clientes Ativos</dt>
                <dd>
                  <div class="text-2xl font-bold text-gray-900">{{ activeClients }}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div
          class="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-5 border-t border-green-200/50"
        >
          <div class="text-sm">
            <BaseButton
              variant="outline"
              size="small"
              @click="$router.push('/clients')"
              class="w-full text-xs"
              icon="View"
            >
              Ver clientes
            </BaseButton>
          </div>
        </div>
      </BaseCard>

      <BaseCard variant="glass">
        <div class="p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div
                class="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg"
              >
                <el-icon class="h-6 w-6">
                  <Film class="text-white" />
                </el-icon>
              </div>
            </div>
            <div class="ml-4 w-0 flex-1">
              <dl>
                <dt class="text-sm font-semibold text-gray-600 truncate">Locações Ativas</dt>
                <dd>
                  <div class="text-2xl font-bold text-gray-900">{{ activeRentals }}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div
          class="bg-gradient-to-r from-yellow-50 to-orange-50 px-6 py-5 border-t border-yellow-200/50"
        >
          <div class="text-sm">
            <BaseButton
              variant="outline"
              size="small"
              @click="$router.push('/rentals')"
              class="w-full text-xs"
              icon="View"
            >
              Ver locações
            </BaseButton>
          </div>
        </div>
      </BaseCard>

      <BaseCard variant="glass">
        <div class="p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div
                class="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg"
              >
                <el-icon class="h-6 w-6">
                  <Warning class="text-white" />
                </el-icon>
              </div>
            </div>
            <div class="ml-4 w-0 flex-1">
              <dl>
                <dt class="text-sm font-semibold text-gray-600 truncate">Locações em Atraso</dt>
                <dd>
                  <div class="text-2xl font-bold text-gray-900">{{ overdueRentals }}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gradient-to-r from-red-50 to-pink-50 px-6 py-5 border-t border-red-200/50">
          <div class="text-sm">
            <BaseButton
              variant="outline"
              size="small"
              @click="$router.push('/rentals?filter=overdue')"
              class="w-full text-xs"
              icon="View"
            >
              Ver atrasos
            </BaseButton>
          </div>
        </div>
      </BaseCard>
    </div>

    <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <BaseCard variant="glass" padding="large">
        <h3 class="text-xl font-bold text-gray-900 mb-6">Ações Rápidas</h3>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <BaseButton
            variant="gradient"
            @click="$router.push('/clients/create')"
            class="justify-center h-11"
            icon="Plus"
          >
            Adicionar Cliente
          </BaseButton>

          <BaseButton
            variant="gradient"
            @click="$router.push('/rentals/create')"
            class="justify-center h-11"
            icon="DocumentAdd"
          >
            Nova Locação
          </BaseButton>

          <BaseButton
            variant="outline"
            @click="$router.push('/movies')"
            class="justify-center h-11"
            icon="Search"
          >
            Buscar Filmes
          </BaseButton>

          <BaseButton
            variant="outline"
            @click="$router.push('/users/create')"
            class="justify-center h-11"
            icon="UserFilled"
          >
            Adicionar Usuário
          </BaseButton>
        </div>
      </BaseCard>

      <BaseCard variant="glass" padding="large">
        <h3 class="text-xl font-bold text-gray-900 mb-6">Próximas Devoluções</h3>
        <div v-if="upcomingReturns.length > 0" class="space-y-4">
          <div
            v-for="rental in upcomingReturns"
            :key="rental.id"
            class="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200/50"
          >
            <div>
              <p class="text-sm font-semibold text-gray-900">{{ rental.client?.name }}</p>
              <p class="text-xs text-gray-600">{{ rental.movies?.length }} filme(s)</p>
            </div>
            <div class="text-right">
              <p class="text-sm font-semibold text-gray-900">{{ formatDate(rental.returnDate) }}</p>
              <p class="text-xs text-gray-500">Devolução</p>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8">
          <div
            class="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <el-icon class="h-8 w-8 text-gray-400">
              <Calendar />
            </el-icon>
          </div>
          <p class="text-gray-600">Nenhuma devolução próxima</p>
        </div>
      </BaseCard>
    </div>

    <BaseCard variant="glass" padding="none">
      <div class="p-6 border-b border-gray-200/50">
        <h3 class="text-xl font-bold text-gray-900">Locações Recentes</h3>
      </div>
      <div v-if="recentRentals.length > 0" class="overflow-x-auto">
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
                Filmes
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Data de Locação
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody class="bg-white/50 divide-y divide-gray-200/30">
            <tr
              v-for="rental in recentRentals"
              :key="rental.id"
              class="hover:bg-white/80 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                {{ rental.client?.name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ rental.movies?.length }} filme(s)
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ formatDate(rental.rentalDate) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold',
                    rental.status === 'rented'
                      ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border border-yellow-200'
                      : 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200',
                  ]"
                >
                  {{ rental.status === 'rented' ? 'Alugado' : 'Devolvido' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="text-center py-12">
        <div
          class="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <el-icon class="h-8 w-8 text-gray-400">
            <Document />
          </el-icon>
        </div>
        <p class="text-gray-600">Nenhuma locação recente</p>
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
import { User, UserFilled, Calendar, Document, Film, Warning } from '@element-plus/icons-vue'
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
  return format(date, 'dd/MM/yyyy')
}
</script>

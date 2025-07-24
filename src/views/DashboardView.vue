<template>
  <div class="space-y-8">
    <PageHeader
      title="Dashboard"
      description="Bem-vindo de volta, {{ authStore.user?.name }}! Aqui está o que está acontecendo com seu negócio de locadora de filmes."
    />

    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total de Usuários"
        :value="totalUsers"
        icon="User"
        variant="blue"
        action-text="Ver usuários"
        @action="$router.push('/users')"
      />

      <StatCard
        title="Clientes Ativos"
        :value="activeClients"
        icon="UserFilled"
        variant="green"
        action-text="Ver clientes"
        @action="$router.push('/clients')"
      />

      <StatCard
        title="Locações Ativas"
        :value="activeRentals"
        icon="Film"
        variant="yellow"
        action-text="Ver locações"
        @action="$router.push('/rentals')"
      />

      <StatCard
        title="Locações em Atraso"
        :value="overdueRentals"
        icon="Warning"
        variant="red"
        action-text="Ver atrasos"
        @action="$router.push('/rentals?filter=overdue')"
      />
    </div>

    <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <QuickActionCard title="Ações Rápidas">
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
      </QuickActionCard>

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
import PageHeader from '@/components/molecules/PageHeader.vue'
import StatCard from '@/components/molecules/StatCard.vue'
import QuickActionCard from '@/components/molecules/QuickActionCard.vue'
import { Calendar, Document } from '@element-plus/icons-vue'
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

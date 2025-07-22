<template>
  <div class="flex h-screen bg-gray-100">
    <div class="hidden md:flex md:w-64 md:flex-col">
      <div class="flex flex-col flex-grow pt-5 overflow-y-auto bg-white border-r border-gray-200">
        <div class="flex items-center flex-shrink-0 px-4">
          <h1 class="text-xl font-bold text-gray-900">FilmerC</h1>
        </div>

        <div class="mt-8 flex-grow flex flex-col">
          <nav class="flex-1 px-2 space-y-1">
            <router-link
              v-for="item in navigationItems"
              :key="item.name"
              :to="item.to"
              :class="[
                $route.name === item.name || $route.path.startsWith(item.to)
                  ? 'bg-blue-100 text-blue-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
              ]"
            >
              <el-icon class="mr-3 h-5 w-5">
                <component :is="item.icon" />
              </el-icon>
              {{ item.label }}
            </router-link>
          </nav>
        </div>

        <div class="flex-shrink-0 flex border-t border-gray-200 p-4">
          <div class="flex items-center w-full">
            <div class="flex-shrink-0">
              <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <el-icon class="h-5 w-5 text-blue-600">
                  <User />
                </el-icon>
              </div>
            </div>
            <div class="ml-3 flex-1">
              <p class="text-sm font-medium text-gray-900">{{ authStore.user?.name }}</p>
              <BaseButton variant="outline" size="small" @click="handleLogout" class="mt-1">
                Sair
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="md:hidden">
      <div class="fixed inset-0 flex z-40" v-if="isSidebarOpen">
        <div class="fixed inset-0 bg-gray-600 bg-opacity-75" @click="isSidebarOpen = false"></div>
      </div>
    </div>

    <div class="flex flex-col w-0 flex-1 overflow-hidden">
      <div class="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
        <div class="flex-1 px-4 flex justify-between">
          <div class="flex-1 flex">
            <div class="w-full flex md:ml-0">
              <div class="relative w-full text-gray-400 focus-within:text-gray-600">
                <div class="flex items-center h-16">
                  <h1 class="text-lg font-medium text-gray-900">
                    {{ pageTitle }}
                  </h1>
                </div>
              </div>
            </div>
          </div>
          <div class="ml-4 flex items-center md:ml-6">
            <div class="text-sm text-gray-600">Bem-vindo, {{ authStore.user?.name }}</div>
          </div>
        </div>
      </div>

      <main class="flex-1 relative overflow-y-auto focus:outline-none" tabindex="0">
        <div class="py-6">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <slot />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseButton from '@/components/atoms/BaseButton.vue'
import { House, User, UserFilled, Film, Tickets } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const isSidebarOpen = ref(false)

const navigationItems = [
  {
    name: 'dashboard',
    label: 'Dashboard',
    to: '/',
    icon: House,
  },
  {
    name: 'users',
    label: 'Usuários',
    to: '/users',
    icon: User,
  },
  {
    name: 'clients',
    label: 'Clientes',
    to: '/clients',
    icon: UserFilled,
  },
  {
    name: 'movies',
    label: 'Filmes',
    to: '/movies',
    icon: Film,
  },
  {
    name: 'rentals',
    label: 'Locações',
    to: '/rentals',
    icon: Tickets,
  },
]

const pageTitle = computed(() => {
  const currentItem = navigationItems.find(
    (item) => route.name === item.name || route.path.startsWith(item.to),
  )
  return currentItem?.label || 'FilmerC'
})

async function handleLogout() {
  authStore.logout()
  await router.push('/login')
}
</script>

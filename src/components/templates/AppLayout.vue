<template>
  <div class="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <div class="hidden md:flex md:w-72 md:flex-col">
      <div
        class="flex flex-col flex-grow pt-5 overflow-y-auto bg-white/80 backdrop-blur-sm border-r border-white/20 shadow-xl"
      >
        <div class="flex items-center flex-shrink-0 px-6 mb-8">
          <div class="flex items-center space-x-3">
            <div
              class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg"
            >
              <el-icon class="h-6 w-6">
                <Film class="text-white" />
              </el-icon>
            </div>
            <h1
              class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
            >
              Filmerc
            </h1>
          </div>
        </div>

        <div class="flex-grow flex flex-col">
          <nav class="flex-1 px-4 space-y-2">
            <router-link
              v-for="item in navigationItems"
              :key="item.name"
              :to="item.to"
              :class="[
                isActiveRoute(item)
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-700 hover:bg-white/50 hover:text-blue-600 hover:shadow-md',
                'group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 hover-lift',
              ]"
            >
              <el-icon class="mr-3 h-5 w-5">
                <component :is="item.icon" />
              </el-icon>
              {{ item.label }}
            </router-link>
          </nav>
        </div>

        <div class="flex-shrink-0 flex border-t border-gray-200/50 p-6">
          <div class="flex items-center w-full">
            <div class="flex-shrink-0">
              <div
                class="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg"
              >
                <el-icon class="h-6 w-6">
                  <User class="text-white" />
                </el-icon>
              </div>
            </div>
            <div class="ml-4 flex-1">
              <p class="text-sm font-semibold text-gray-900">{{ authStore.user?.name }}</p>
              <p class="text-xs text-gray-500">Usuário ativo</p>
            </div>
            <BaseButton
              variant="outline"
              size="small"
              @click="handleLogout"
              class="ml-2 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors"
            >
              Sair
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <div class="md:hidden">
      <div class="fixed inset-0 flex z-40" v-if="isSidebarOpen">
        <div
          class="fixed inset-0 bg-gray-600/30 backdrop-blur-sm"
          @click="isSidebarOpen = false"
        ></div>
        <div
          class="relative flex-1 flex flex-col max-w-xs w-full bg-white/95 backdrop-blur-md shadow-xl"
        >
          <div class="absolute top-0 right-0 -mr-12 pt-2">
            <button
              @click="isSidebarOpen = false"
              class="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <el-icon class="h-6 w-6 text-white">
                <Close />
              </el-icon>
            </button>
          </div>
          <div class="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div class="flex-shrink-0 flex items-center px-6 mb-8">
              <div class="flex items-center space-x-3">
                <div
                  class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg"
                >
                  <el-icon class="h-6 w-6">
                    <Film class="text-white" />
                  </el-icon>
                </div>
                <h1
                  class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
                >
                  Filmerc
                </h1>
              </div>
            </div>
            <nav class="mt-5 px-4 space-y-2">
              <router-link
                v-for="item in navigationItems"
                :key="item.name"
                :to="item.to"
                @click="isSidebarOpen = false"
                :class="[
                  isActiveRoute(item)
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-700 hover:bg-white/50 hover:text-blue-600 hover:shadow-md',
                  'group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 hover-lift',
                ]"
              >
                <el-icon class="mr-3 h-5 w-5">
                  <component :is="item.icon" />
                </el-icon>
                {{ item.label }}
              </router-link>
            </nav>
          </div>
          <div class="flex-shrink-0 flex border-t border-gray-200/50 p-6">
            <div class="flex items-center w-full">
              <div class="flex-shrink-0">
                <div
                  class="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg"
                >
                  <el-icon class="h-6 w-6">
                    <User class="text-white" />
                  </el-icon>
                </div>
              </div>
              <div class="ml-4 flex-1">
                <p class="text-sm font-semibold text-gray-900">{{ authStore.user?.name }}</p>
                <p class="text-xs text-gray-500">Usuário ativo</p>
              </div>
              <BaseButton
                variant="outline"
                size="small"
                @click="handleLogout"
                class="ml-2 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors"
              >
                Sair
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col w-0 flex-1 overflow-hidden">
      <div
        class="relative z-10 flex-shrink-0 flex h-16 bg-white/10 backdrop-blur-sm shadow-lg border-b border-white/20"
      >
        <div class="flex-1 px-6 flex justify-between items-center">
          <div class="flex-1 flex">
            <div class="w-full flex md:ml-0">
              <div class="relative w-full text-gray-400 focus-within:text-gray-600">
                <div class="flex items-center h-16">
                  <button
                    @click="isSidebarOpen = true"
                    class="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                  >
                    <el-icon class="h-6 w-6">
                      <Menu />
                    </el-icon>
                  </button>
                  <h1
                    class="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent ml-2 md:ml-0"
                  >
                    {{ pageTitle }}
                  </h1>
                </div>
              </div>
            </div>
          </div>
          <div class="ml-4 flex items-center md:ml-6">
            <div class="text-sm text-gray-600 font-medium">
              Bem-vindo, <span class="text-blue-600">{{ authStore.user?.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <main class="flex-1 relative overflow-y-auto focus:outline-none" tabindex="0">
        <div class="py-8">
          <div class="max-w-7xl mx-auto px-6 sm:px-8 md:px-10">
            <BaseBreadcrumb />
            <slot />
          </div>
        </div>
      </main>

      <StructuredData type="WebPage" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseButton from '@/components/atoms/BaseButton.vue'
import BaseBreadcrumb from '@/components/atoms/BaseBreadcrumb.vue'
import StructuredData from '@/components/atoms/StructuredData.vue'
import { House, User, UserFilled, Film, Tickets, Menu, Close } from '@element-plus/icons-vue'

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

function isActiveRoute(item: { name: string; to: string }) {
  if (item.to === '/') {
    return route.path === '/'
  }

  return route.path.startsWith(item.to)
}

const pageTitle = computed(() => {
  const currentItem = navigationItems.find(isActiveRoute)
  return currentItem?.label || 'Filmerc'
})

async function handleLogout() {
  authStore.logout()
  await router.push('/login')
}
</script>

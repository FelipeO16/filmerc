<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
import { useClientStore } from '@/stores/client'
import { useRentalStore } from '@/stores/rental'
import AppLayout from '@/components/templates/AppLayout.vue'
import NotificationContainer from '@/components/organisms/NotificationContainer.vue'

const authStore = useAuthStore()
const userStore = useUserStore()
const clientStore = useClientStore()
const rentalStore = useRentalStore()

onMounted(() => {
  userStore.loadUsers()
  authStore.initializeAuth()

  if (authStore.isAuthenticated) {
    clientStore.loadClients()
    rentalStore.loadRentals()
  }
})
</script>

<template>
  <div id="app" class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <AppLayout v-if="authStore.isAuthenticated">
      <RouterView />
    </AppLayout>

    <RouterView v-else />

    <NotificationContainer />
  </div>
</template>

<style>
* {
  scroll-behavior: smooth;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

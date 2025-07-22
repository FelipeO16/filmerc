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
  <div id="app" class="min-h-screen bg-gray-50">
    <AppLayout v-if="authStore.isAuthenticated">
      <RouterView />
    </AppLayout>

    <RouterView v-else />

    <NotificationContainer />
  </div>
</template>

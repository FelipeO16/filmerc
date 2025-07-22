<template>
  <teleport to="body">
    <div v-if="notifications.length > 0" class="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      <transition-group name="notification" tag="div" class="space-y-3">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          :class="notificationClasses(notification.type)"
          class="p-4 rounded-lg shadow-lg cursor-pointer"
          @click="removeNotification(notification.id)"
        >
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <el-icon :class="iconClasses(notification.type)">
                <component :is="getIcon(notification.type)" />
              </el-icon>
            </div>

            <div class="ml-3 flex-1">
              <h4 class="text-sm font-medium">
                {{ notification.title }}
              </h4>
              <p class="mt-1 text-sm opacity-90">
                {{ notification.message }}
              </p>
            </div>

            <div class="ml-4 flex-shrink-0 flex">
              <button
                class="inline-flex text-white hover:opacity-75 focus:outline-none"
                @click.stop="removeNotification(notification.id)"
              >
                <el-icon class="h-4 w-4">
                  <Close />
                </el-icon>
              </button>
            </div>
          </div>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useNotificationStore } from '@/stores/notification'
import {
  Close,
  SuccessFilled,
  WarningFilled,
  CircleCloseFilled,
  InfoFilled,
} from '@element-plus/icons-vue'
import type { Notification } from '@/types'

const notificationStore = useNotificationStore()
const { notifications } = storeToRefs(notificationStore)
const { removeNotification } = notificationStore

function notificationClasses(type: Notification['type']) {
  const baseClasses = 'transform transition-all duration-300 ease-in-out'

  const typeClasses = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-white',
    info: 'bg-blue-500 text-white',
  }

  return `${baseClasses} ${typeClasses[type]}`
}

function iconClasses() {
  return 'h-5 w-5'
}

function getIcon(type: Notification['type']) {
  const icons = {
    success: SuccessFilled,
    error: CircleCloseFilled,
    warning: WarningFilled,
    info: InfoFilled,
  }

  return icons[type]
}
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-move {
  transition: transform 0.3s ease;
}
</style>

import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Notification } from '@/types'

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<Notification[]>([])

  function addNotification(notification: Omit<Notification, 'id'>) {
    const id = `notification_${Date.now()}_${Math.random()}`
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration !== undefined ? notification.duration : 5000,
    }

    notifications.value.push(newNotification)

    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, newNotification.duration)
    }

    return id
  }

  function removeNotification(id: string) {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  function clearAll() {
    notifications.value = []
  }

  function showSuccess(message: string, title = 'Sucesso') {
    return addNotification({
      type: 'success',
      title,
      message,
    })
  }

  function showError(message: string, title = 'Erro') {
    return addNotification({
      type: 'error',
      title,
      message,
      duration: 7000,
    })
  }

  function showWarning(message: string, title = 'Aviso') {
    return addNotification({
      type: 'warning',
      title,
      message,
    })
  }

  function showInfo(message: string, title = 'Informação') {
    return addNotification({
      type: 'info',
      title,
      message,
    })
  }

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  }
})

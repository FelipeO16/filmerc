import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useNotificationStore } from '../notification'


vi.useFakeTimers()

describe('Notification Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllTimers()
  })

  afterEach(() => {
  })

  describe('Estado inicial', () => {
    it('deve inicializar com array vazio de notificações', () => {
      const notificationStore = useNotificationStore()
      expect(notificationStore.notifications).toEqual([])
    })
  })

  describe('addNotification', () => {
    it('deve adicionar notificação com ID único', () => {
      const notificationStore = useNotificationStore()
      const notification = {
        type: 'success' as const,
        title: 'Test',
        message: 'Test message',
      }
      const id = notificationStore.addNotification(notification)
      
      expect(notificationStore.notifications).toHaveLength(1)
      expect(notificationStore.notifications[0]).toMatchObject({
        ...notification,
        id,
        duration: 5000,
      })
      expect(id).toMatch(/^notification_\d+_\d+\.\d+$/)
    })

    it('deve adicionar notificação com duração personalizada', () => {
      const notificationStore = useNotificationStore()
      const notification = {
        type: 'error' as const,
        title: 'Error',
        message: 'Error message',
        duration: 10000,
      }
      const id = notificationStore.addNotification(notification)
      
      expect(notificationStore.notifications[0]).toMatchObject({
        ...notification,
        id,
        duration: 10000,
      })
    })

    it('deve remover notificação automaticamente após duração', () => {
      const notificationStore = useNotificationStore()
      const notification = {
        type: 'info' as const,
        title: 'Info',
        message: 'Info message',
        duration: 3000,
      }
      const id = notificationStore.addNotification(notification)
      
      expect(notificationStore.notifications).toHaveLength(1)
      expect(notificationStore.notifications[0].id).toBe(id)
      
      vi.advanceTimersByTime(3000)
      
      expect(notificationStore.notifications).toHaveLength(0)
    })

    it('não deve remover notificação quando duração é 0', () => {
      const notificationStore = useNotificationStore()
      const notification = {
        type: 'warning' as const,
        title: 'Warning',
        message: 'Warning message',
        duration: 0,
      }
      const id = notificationStore.addNotification(notification)
      
      expect(notificationStore.notifications).toHaveLength(1)
      expect(notificationStore.notifications[0].id).toBe(id)
      expect(notificationStore.notifications[0].duration).toBe(0)
      
      expect(notificationStore.notifications).toHaveLength(1)
      
      expect(notificationStore.notifications).toHaveLength(1)
      expect(notificationStore.notifications[0].id).toBe(id)
    })
  })

  describe('removeNotification', () => {
    it('deve remover notificação específica', () => {
      const notificationStore = useNotificationStore()
      
      const id1 = notificationStore.addNotification({
        type: 'success',
        title: 'Success 1',
        message: 'Message 1',
      })
      const id2 = notificationStore.addNotification({
        type: 'error',
        title: 'Error 1',
        message: 'Message 2',
      })
      
      expect(notificationStore.notifications).toHaveLength(2)
      
      notificationStore.removeNotification(id1)
      
      expect(notificationStore.notifications).toHaveLength(1)
      expect(notificationStore.notifications[0].id).toBe(id2)
    })

    it('não deve fazer nada quando ID não existe', () => {
      const notificationStore = useNotificationStore()
      
      notificationStore.addNotification({
        type: 'success',
        title: 'Success',
        message: 'Message',
      })
      
      expect(notificationStore.notifications).toHaveLength(1)
      
      notificationStore.removeNotification('non-existent-id')
      
      expect(notificationStore.notifications).toHaveLength(1)
    })
  })

  describe('clearAll', () => {
    it('deve remover todas as notificações', () => {
      const notificationStore = useNotificationStore()
      
      notificationStore.addNotification({
        type: 'success',
        title: 'Success',
        message: 'Message 1',
      })
      notificationStore.addNotification({
        type: 'error',
        title: 'Error',
        message: 'Message 2',
      })
      
      expect(notificationStore.notifications).toHaveLength(2)
      
      notificationStore.clearAll()
      
      expect(notificationStore.notifications).toHaveLength(0)
    })
  })

  describe('showSuccess', () => {
    it('deve criar notificação de sucesso com valores padrão', () => {
      const notificationStore = useNotificationStore()
      const id = notificationStore.showSuccess('Operação realizada com sucesso')
      
      expect(notificationStore.notifications[0]).toMatchObject({
        id,
        type: 'success',
        title: 'Sucesso',
        message: 'Operação realizada com sucesso',
        duration: 5000,
      })
    })

    it('deve criar notificação de sucesso com título personalizado', () => {
      const notificationStore = useNotificationStore()
      const id = notificationStore.showSuccess('Operação realizada com sucesso', 'Custom Title')
      
      expect(notificationStore.notifications[0]).toMatchObject({
        id,
        type: 'success',
        title: 'Custom Title',
        message: 'Operação realizada com sucesso',
        duration: 5000,
      })
    })
  })

  describe('showError', () => {
    it('deve criar notificação de erro com duração estendida', () => {
      const notificationStore = useNotificationStore()
      const id = notificationStore.showError('Erro na operação')
      
      expect(notificationStore.notifications[0]).toMatchObject({
        id,
        type: 'error',
        title: 'Erro',
        message: 'Erro na operação',
        duration: 7000,
      })
    })

    it('deve criar notificação de erro com título personalizado', () => {
      const notificationStore = useNotificationStore()
      const id = notificationStore.showError('Erro na operação', 'Custom Error')
      
      expect(notificationStore.notifications[0]).toMatchObject({
        id,
        type: 'error',
        title: 'Custom Error',
        message: 'Erro na operação',
        duration: 7000,
      })
    })
  })

  describe('showWarning', () => {
    it('deve criar notificação de aviso', () => {
      const notificationStore = useNotificationStore()
      const id = notificationStore.showWarning('Aviso importante')
      
      expect(notificationStore.notifications[0]).toMatchObject({
        id,
        type: 'warning',
        title: 'Aviso',
        message: 'Aviso importante',
        duration: 5000,
      })
    })

    it('deve criar notificação de aviso com título personalizado', () => {
      const notificationStore = useNotificationStore()
      const id = notificationStore.showWarning('Aviso importante', 'Custom Warning')
      
      expect(notificationStore.notifications[0]).toMatchObject({
        id,
        type: 'warning',
        title: 'Custom Warning',
        message: 'Aviso importante',
        duration: 5000,
      })
    })
  })

  describe('showInfo', () => {
    it('deve criar notificação de informação', () => {
      const notificationStore = useNotificationStore()
      const id = notificationStore.showInfo('Informação útil')
      
      expect(notificationStore.notifications[0]).toMatchObject({
        id,
        type: 'info',
        title: 'Informação',
        message: 'Informação útil',
        duration: 5000,
      })
    })

    it('deve criar notificação de informação com título personalizado', () => {
      const notificationStore = useNotificationStore()
      const id = notificationStore.showInfo('Informação útil', 'Custom Info')
      
      expect(notificationStore.notifications[0]).toMatchObject({
        id,
        type: 'info',
        title: 'Custom Info',
        message: 'Informação útil',
        duration: 5000,
      })
    })
  })

  describe('Múltiplas notificações', () => {
    it('deve gerenciar múltiplas notificações simultaneamente', () => {
      const notificationStore = useNotificationStore()
      
      const id1 = notificationStore.showSuccess('Sucesso 1')
      const id2 = notificationStore.showError('Erro 1')
      const id3 = notificationStore.showWarning('Aviso 1')
      const id4 = notificationStore.showInfo('Info 1')
      
      expect(notificationStore.notifications).toHaveLength(4)
      expect(notificationStore.notifications.map(n => n.id)).toEqual([id1, id2, id3, id4])
      
      notificationStore.removeNotification(id2)
      
      expect(notificationStore.notifications).toHaveLength(3)
      expect(notificationStore.notifications.map(n => n.id)).toEqual([id1, id3, id4])
      
      notificationStore.clearAll()
      
      expect(notificationStore.notifications).toHaveLength(0)
    })
  })

  describe('Remoção automática', () => {
    it('deve remover notificações com diferentes durações', () => {
      const notificationStore = useNotificationStore()
      
      notificationStore.addNotification({
        type: 'success',
        title: 'Quick',
        message: 'Quick message',
        duration: 1000,
      })
      notificationStore.addNotification({
        type: 'error',
        title: 'Slow',
        message: 'Slow message',
        duration: 5000,
      })
      
      expect(notificationStore.notifications).toHaveLength(2)
      
      vi.advanceTimersByTime(1000)
      
      expect(notificationStore.notifications).toHaveLength(1)
      expect(notificationStore.notifications[0].title).toBe('Slow')
      
      vi.advanceTimersByTime(4000)
      
      expect(notificationStore.notifications).toHaveLength(0)
    })
  })
}) 
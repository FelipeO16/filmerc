import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseButton from '../atoms/BaseButton.vue'


vi.mock('@element-plus/icons-vue', () => ({
  Loading: {
    name: 'Loading',
    template: '<div data-testid="spinner">Loading</div>',
  },
}))

describe('BaseButton', () => {
  describe('Renderização', () => {
    it('deve renderizar com slot padrão', () => {
      const wrapper = mount(BaseButton, {
        slots: {
          default: 'Clique aqui',
        },
      })

      expect(wrapper.text()).toBe('Clique aqui')
      expect(wrapper.element.tagName).toBe('BUTTON')
    })

    it('deve renderizar com texto via prop', () => {
      const wrapper = mount(BaseButton, {
        props: {
          text: 'Botão com texto',
        },
      })

      expect(wrapper.text()).toBe('Botão com texto')
      expect(wrapper.element.tagName).toBe('BUTTON')
    })
  })

  describe('Variantes', () => {
    it('deve aplicar variante primary por padrão', () => {
      const wrapper = mount(BaseButton, {
        slots: {
          default: 'Botão',
        },
      })

      expect(wrapper.classes()).toContain('bg-gradient-to-r')
      expect(wrapper.classes()).toContain('from-blue-600')
      expect(wrapper.classes()).toContain('text-white')
    })

    it('deve aplicar variante secondary', () => {
      const wrapper = mount(BaseButton, {
        props: {
          variant: 'secondary',
        },
        slots: {
          default: 'Botão',
        },
      })

      expect(wrapper.classes()).toContain('bg-gradient-to-r')
      expect(wrapper.classes()).toContain('from-gray-600')
      expect(wrapper.classes()).toContain('text-white')
    })

    it('deve aplicar variante success', () => {
      const wrapper = mount(BaseButton, {
        props: {
          variant: 'success',
        },
        slots: {
          default: 'Botão',
        },
      })

      expect(wrapper.classes()).toContain('bg-gradient-to-r')
      expect(wrapper.classes()).toContain('from-green-500')
      expect(wrapper.classes()).toContain('text-white')
    })

    it('deve aplicar variante danger', () => {
      const wrapper = mount(BaseButton, {
        props: {
          variant: 'danger',
        },
        slots: {
          default: 'Botão',
        },
      })

      expect(wrapper.classes()).toContain('bg-gradient-to-r')
      expect(wrapper.classes()).toContain('from-red-500')
      expect(wrapper.classes()).toContain('text-white')
    })

    it('deve aplicar variante gradient', () => {
      const wrapper = mount(BaseButton, {
        props: {
          variant: 'gradient',
        },
        slots: {
          default: 'Botão',
        },
      })

      expect(wrapper.classes()).toContain('bg-gradient-to-br')
      expect(wrapper.classes()).toContain('from-blue-500')
      expect(wrapper.classes()).toContain('to-cyan-600')
      expect(wrapper.classes()).toContain('text-white')
    })

    it('deve aplicar variante outline', () => {
      const wrapper = mount(BaseButton, {
        props: {
          variant: 'outline',
        },
        slots: {
          default: 'Botão',
        },
      })

      expect(wrapper.classes()).toContain('bg-white/80')
      expect(wrapper.classes()).toContain('text-gray-700')
      expect(wrapper.classes()).toContain('border')
    })
  })

  describe('Tamanhos', () => {
    it('deve aplicar tamanho small', () => {
      const wrapper = mount(BaseButton, {
        props: {
          size: 'small',
        },
        slots: {
          default: 'Botão',
        },
      })

      expect(wrapper.classes()).toContain('px-3')
      expect(wrapper.classes()).toContain('py-2')
      expect(wrapper.classes()).toContain('text-sm')
    })

    it('deve aplicar tamanho medium por padrão', () => {
      const wrapper = mount(BaseButton, {
        slots: {
          default: 'Botão',
        },
      })

      expect(wrapper.classes()).toContain('px-4')
      expect(wrapper.classes()).toContain('py-2')
      expect(wrapper.classes()).toContain('text-sm')
    })

    it('deve aplicar tamanho large', () => {
      const wrapper = mount(BaseButton, {
        props: {
          size: 'large',
        },
        slots: {
          default: 'Botão',
        },
      })

      expect(wrapper.classes()).toContain('px-6')
      expect(wrapper.classes()).toContain('py-2.5')
      expect(wrapper.classes()).toContain('text-base')
    })
  })

  describe('Estados', () => {
    it('deve aplicar estado disabled', () => {
      const wrapper = mount(BaseButton, {
        props: {
          disabled: true,
        },
        slots: {
          default: 'Botão',
        },
      })

      expect(wrapper.attributes('disabled')).toBeDefined()
      expect(wrapper.classes()).toContain('disabled:opacity-50')
      expect(wrapper.classes()).toContain('disabled:cursor-not-allowed')
    })

    it('deve aplicar estado loading', () => {
      const wrapper = mount(BaseButton, {
        props: {
          loading: true,
        },
        slots: {
          default: 'Botão',
        },
      })

      expect(wrapper.attributes('disabled')).toBeDefined()
      expect(wrapper.classes()).toContain('disabled:opacity-50')
      expect(wrapper.classes()).toContain('disabled:cursor-not-allowed')
    })

    it('deve mostrar spinner quando loading', () => {
      const wrapper = mount(BaseButton, {
        props: {
          loading: true,
        },
        slots: {
          default: 'Botão',
        },
      })

      const spinner = wrapper.find('[data-testid="spinner"]')
      expect(spinner.exists()).toBe(true)
    })
  })

  describe('Eventos', () => {
    it('deve emitir evento click', async () => {
      const wrapper = mount(BaseButton, {
        slots: {
          default: 'Botão',
        },
      })

      await wrapper.trigger('click')

      expect(wrapper.emitted('click')).toBeTruthy()
    })

    it('não deve emitir evento click quando disabled', async () => {
      const wrapper = mount(BaseButton, {
        props: {
          disabled: true,
        },
        slots: {
          default: 'Botão',
        },
      })

      await wrapper.trigger('click')

      expect(wrapper.emitted('click')).toBeFalsy()
    })

    it('não deve emitir evento click quando loading', async () => {
      const wrapper = mount(BaseButton, {
        props: {
          loading: true,
        },
        slots: {
          default: 'Botão',
        },
      })

      await wrapper.trigger('click')

      expect(wrapper.emitted('click')).toBeFalsy()
    })
  })

  describe('Classes personalizadas', () => {
    it('deve aplicar classes personalizadas', () => {
      const wrapper = mount(BaseButton, {
        props: {
          class: 'custom-button',
        },
        slots: {
          default: 'Botão',
        },
      })

      expect(wrapper.classes()).toContain('custom-button')
    })

    it('deve combinar classes padrão com personalizadas', () => {
      const wrapper = mount(BaseButton, {
        props: {
          variant: 'success',
          class: 'custom-button',
        },
        slots: {
          default: 'Botão',
        },
      })

      expect(wrapper.classes()).toContain('bg-gradient-to-r')
      expect(wrapper.classes()).toContain('from-green-500')
      expect(wrapper.classes()).toContain('custom-button')
    })
  })

  describe('Atributos HTML', () => {
    it('deve aplicar atributos HTML', () => {
      const wrapper = mount(BaseButton, {
        props: {
          id: 'test-button',
          'data-testid': 'test-button',
        },
        slots: {
          default: 'Botão',
        },
      })

      expect(wrapper.attributes('id')).toBe('test-button')
      expect(wrapper.attributes('data-testid')).toBe('test-button')
    })

    it('deve aplicar aria-label', () => {
      const wrapper = mount(BaseButton, {
        props: {
          'aria-label': 'Botão de teste',
        },
        slots: {
          default: 'Botão',
        },
      })

      expect(wrapper.attributes('aria-label')).toBe('Botão de teste')
    })
  })

  describe('Acessibilidade', () => {
    it('deve ter type button por padrão', () => {
      const wrapper = mount(BaseButton, {
        slots: {
          default: 'Botão',
        },
      })

      expect(wrapper.attributes('type')).toBe('button')
    })

    it('deve ter type submit quando especificado', () => {
      const wrapper = mount(BaseButton, {
        props: {
          type: 'submit',
        },
        slots: {
          default: 'Enviar',
        },
      })

      expect(wrapper.attributes('type')).toBe('submit')
    })

    it('deve ter disabled quando loading', () => {
      const wrapper = mount(BaseButton, {
        props: {
          loading: true,
        },
        slots: {
          default: 'Botão',
        },
      })

      expect(wrapper.attributes('disabled')).toBeDefined()
    })
  })

  describe('Combinações de props', () => {
    it('deve combinar variante outline com tamanho large', () => {
      const wrapper = mount(BaseButton, {
        props: {
          variant: 'outline',
          size: 'large',
        },
        slots: {
          default: 'Botão',
        },
      })

      expect(wrapper.classes()).toContain('bg-white/80')
      expect(wrapper.classes()).toContain('text-gray-700')
      expect(wrapper.classes()).toContain('px-6')
      expect(wrapper.classes()).toContain('py-2.5')
    })

    it('deve combinar variante danger com estado loading', () => {
      const wrapper = mount(BaseButton, {
        props: {
          variant: 'danger',
          loading: true,
        },
        slots: {
          default: 'Botão',
        },
      })

      expect(wrapper.classes()).toContain('bg-gradient-to-r')
      expect(wrapper.classes()).toContain('from-red-500')
      expect(wrapper.classes()).toContain('disabled:opacity-50')
      expect(wrapper.attributes('disabled')).toBeDefined()
    })
  })
})

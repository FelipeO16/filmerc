<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClasses"
    @click="$emit('click', $event)"
  >
    <el-icon v-if="loading" class="animate-spin">
      <Loading />
    </el-icon>
    <el-icon v-else-if="icon">
      <component :is="icon" />
    </el-icon>
    <span v-if="$slots.default || text">
      <slot>{{ text }}</slot>
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Loading } from '@element-plus/icons-vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline' | 'link'
  size?: 'small' | 'medium' | 'large'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  icon?: string
  text?: string
  block?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'medium',
  type: 'button',
  disabled: false,
  loading: false,
  block: false,
})

defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClasses = computed(() => {
  const baseClasses = [
    'inline-flex',
    'items-center',
    'justify-center',
    'gap-2',
    'font-medium',
    'rounded-lg',
    'transition-all',
    'duration-200',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
  ]

  if (props.block) {
    baseClasses.push('w-full')
  }

  const sizeClasses = {
    small: ['px-3', 'py-1.5', 'text-sm'],
    medium: ['px-4', 'py-2', 'text-sm'],
    large: ['px-6', 'py-3', 'text-base'],
  }

  const variantClasses = {
    primary: [
      'bg-blue-600',
      'hover:bg-blue-700',
      'text-white',
      'focus:ring-blue-500',
      'border',
      'border-transparent',
    ],
    secondary: [
      'bg-gray-600',
      'hover:bg-gray-700',
      'text-white',
      'focus:ring-gray-500',
      'border',
      'border-transparent',
    ],
    danger: [
      'bg-red-600',
      'hover:bg-red-700',
      'text-white',
      'focus:ring-red-500',
      'border',
      'border-transparent',
    ],
    success: [
      'bg-green-600',
      'hover:bg-green-700',
      'text-white',
      'focus:ring-green-500',
      'border',
      'border-transparent',
    ],
    outline: [
      'bg-white',
      'hover:bg-gray-50',
      'text-gray-900',
      'focus:ring-blue-500',
      'border',
      'border-gray-300',
    ],
    link: [
      'bg-transparent',
      'hover:bg-gray-100',
      'text-blue-600',
      'hover:text-blue-700',
      'focus:ring-blue-500',
      'border',
      'border-transparent',
    ],
  }

  return [...baseClasses, ...sizeClasses[props.size], ...variantClasses[props.variant]]
})
</script>

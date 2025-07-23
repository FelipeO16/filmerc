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
    <el-icon v-else-if="icon" class="flex items-center">
      <component :is="icon" />
    </el-icon>
    <span v-if="$slots.default || text" class="flex items-center">
      <slot>{{ text }}</slot>
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Loading } from '@element-plus/icons-vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline' | 'link' | 'gradient'
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
    'gap-1.5',
    'font-semibold',
    'rounded-xl',
    'transition-all',
    'duration-300',
    'cursor-pointer',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
    'hover-lift',
    'active:scale-95',
  ]

  if (props.block) {
    baseClasses.push('w-full')
  }

  const sizeClasses = {
    small: ['px-3', 'py-2', 'text-sm', 'h-9'],
    medium: ['px-4', 'py-2', 'text-sm', 'h-10'],
    large: ['px-6', 'py-2.5', 'text-base', 'h-12'],
  }

  const variantClasses = {
    primary: [
      'bg-gradient-to-r',
      'from-blue-600',
      'to-indigo-600',
      'hover:from-blue-700',
      'hover:to-indigo-700',
      'text-white',
      'focus:ring-blue-500',
      'border',
      'border-transparent',
      'shadow-lg',
      'shadow-blue-500/25',
    ],
    secondary: [
      'bg-gradient-to-r',
      'from-gray-600',
      'to-gray-700',
      'hover:from-gray-700',
      'hover:to-gray-800',
      'text-white',
      'focus:ring-gray-500',
      'border',
      'border-transparent',
      'shadow-lg',
      'shadow-gray-500/25',
    ],
    danger: [
      'bg-gradient-to-r',
      'from-red-500',
      'to-pink-600',
      'hover:from-red-600',
      'hover:to-pink-700',
      'text-white',
      'focus:ring-red-500',
      'border',
      'border-transparent',
      'shadow-lg',
      'shadow-red-500/25',
    ],
    success: [
      'bg-gradient-to-r',
      'from-green-500',
      'to-emerald-600',
      'hover:from-green-600',
      'hover:to-emerald-700',
      'text-white',
      'focus:ring-green-500',
      'border',
      'border-transparent',
      'shadow-lg',
      'shadow-green-500/25',
    ],
    outline: [
      'bg-white/80',
      'backdrop-blur-sm',
      'hover:bg-white',
      'text-gray-700',
      'focus:ring-blue-500',
      'border',
      'border-gray-300/50',
      'shadow-md',
      'shadow-gray-200/50',
    ],
    link: [
      'bg-transparent',
      'hover:bg-blue-50',
      'text-blue-600',
      'hover:text-blue-700',
      'focus:ring-blue-500',
      'border',
      'border-transparent',
    ],
    gradient: [
      'bg-gradient-to-br',
      'from-blue-500',
      'to-cyan-600',
      'hover:from-blue-600',
      'hover:to-cyan-700',
      'text-white',
      'focus:ring-cyan-400',
      'border',
      'border-transparent',
      'shadow-lg',
      'shadow-blue-400/25',
    ],
  }

  return [...baseClasses, ...sizeClasses[props.size], ...variantClasses[props.variant]]
})
</script>

<template>
  <div :class="cardClasses">
    <div v-if="$slots.header" :class="headerClasses">
      <slot name="header" />
    </div>

    <div :class="bodyClasses">
      <slot />
    </div>

    <div v-if="$slots.footer" :class="footerClasses">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  padding?: 'none' | 'small' | 'medium' | 'large'
  shadow?: 'none' | 'small' | 'medium' | 'large'
  border?: boolean
  rounded?: boolean
  variant?: 'default' | 'glass' | 'gradient'
}

const props = withDefaults(defineProps<Props>(), {
  padding: 'medium',
  shadow: 'medium',
  border: true,
  rounded: true,
  variant: 'default',
})

const cardClasses = computed(() => {
  const classes = ['overflow-hidden', 'transition-all', 'duration-300']

  if (props.variant === 'glass') {
    classes.push('bg-white/80', 'backdrop-blur-sm', 'border-white/20')
  } else if (props.variant === 'gradient') {
    classes.push('bg-gradient-to-br', 'from-white', 'to-blue-50/50')
  } else {
    classes.push('bg-white')
  }

  if (props.border) {
    if (props.variant === 'glass') {
      classes.push('border', 'border-white/20')
    } else {
      classes.push('border', 'border-gray-200/50')
    }
  }

  if (props.rounded) {
    classes.push('rounded-2xl')
  }

  const shadowClasses = {
    none: [],
    small: ['shadow-sm'],
    medium: ['shadow-lg', 'shadow-gray-200/50'],
    large: ['shadow-xl', 'shadow-gray-300/50'],
  }

  classes.push(...shadowClasses[props.shadow])

  return classes
})

const headerClasses = computed(() => {
  const classes = ['border-b']

  if (props.variant === 'glass') {
    classes.push('border-white/20')
  } else {
    classes.push('border-gray-200/50')
  }

  const paddingClasses = {
    none: [],
    small: ['px-4', 'py-3'],
    medium: ['px-6', 'py-4'],
    large: ['px-8', 'py-6'],
  }

  classes.push(...paddingClasses[props.padding])

  return classes
})

const bodyClasses = computed(() => {
  const paddingClasses = {
    none: [],
    small: ['p-4'],
    medium: ['p-6'],
    large: ['p-8'],
  }

  return paddingClasses[props.padding]
})

const footerClasses = computed(() => {
  const classes = ['border-t']

  if (props.variant === 'glass') {
    classes.push('border-white/20', 'bg-white/30')
  } else {
    classes.push('border-gray-200/50', 'bg-gray-50/50')
  }

  const paddingClasses = {
    none: [],
    small: ['px-4', 'py-3'],
    medium: ['px-6', 'py-4'],
    large: ['px-8', 'py-6'],
  }

  classes.push(...paddingClasses[props.padding])

  return classes
})
</script>

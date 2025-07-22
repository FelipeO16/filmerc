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
}

const props = withDefaults(defineProps<Props>(), {
  padding: 'medium',
  shadow: 'medium',
  border: true,
  rounded: true,
})

const cardClasses = computed(() => {
  const classes = ['bg-white', 'overflow-hidden']

  if (props.border) {
    classes.push('border', 'border-gray-200')
  }

  if (props.rounded) {
    classes.push('rounded-lg')
  }

  const shadowClasses = {
    none: [],
    small: ['shadow-sm'],
    medium: ['shadow-md'],
    large: ['shadow-lg'],
  }

  classes.push(...shadowClasses[props.shadow])

  return classes
})

const headerClasses = computed(() => {
  const classes = ['border-b', 'border-gray-200']

  const paddingClasses = {
    none: [],
    small: ['px-3', 'py-2'],
    medium: ['px-4', 'py-3'],
    large: ['px-6', 'py-4'],
  }

  classes.push(...paddingClasses[props.padding])

  return classes
})

const bodyClasses = computed(() => {
  const paddingClasses = {
    none: [],
    small: ['p-3'],
    medium: ['p-4'],
    large: ['p-6'],
  }

  return paddingClasses[props.padding]
})

const footerClasses = computed(() => {
  const classes = ['border-t', 'border-gray-200', 'bg-gray-50']

  const paddingClasses = {
    none: [],
    small: ['px-3', 'py-2'],
    medium: ['px-4', 'py-3'],
    large: ['px-6', 'py-4'],
  }

  classes.push(...paddingClasses[props.padding])

  return classes
})
</script>

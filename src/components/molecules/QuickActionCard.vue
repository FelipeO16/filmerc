<template>
  <BaseCard variant="glass" padding="large">
    <h3 class="text-xl font-bold text-gray-900 mb-6">{{ title }}</h3>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <slot />
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import BaseCard from '../atoms/BaseCard.vue'

interface Props {
  title: string
}

defineProps<Props>()
</script> 
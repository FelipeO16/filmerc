<template>
  <div class="md:flex md:items-center md:justify-between">
    <div class="flex-1 min-w-0">
      <h2
        class="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
      >
        {{ title }}
      </h2>
      <p class="mt-2 text-lg text-gray-600">
        {{ description }}
      </p>
    </div>
    <div v-if="$slots.actions" class="mt-4 flex md:mt-0 md:ml-4">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  description: string
}

defineProps<Props>()
</script> 
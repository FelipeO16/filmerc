<template>
  <div class="w-full">
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <div class="relative">
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :class="inputClasses"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @blur="$emit('blur', $event)"
        @focus="$emit('focus', $event)"
      />

      <div v-if="$slots.suffix" class="absolute inset-y-0 right-0 flex items-center pr-3">
        <slot name="suffix" />
      </div>
    </div>

    <p v-if="error" class="mt-1 text-sm text-red-600">
      {{ error }}
    </p>

    <p v-if="helper && !error" class="mt-1 text-sm text-gray-500">
      {{ helper }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  id?: string
  label?: string
  type?: string
  modelValue?: string | number
  placeholder?: string
  disabled?: boolean
  required?: boolean
  error?: string
  helper?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  required: false,
})

defineEmits<{
  'update:modelValue': [value: string]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const inputClasses = computed(() => {
  const baseClasses = [
    'block',
    'w-full',
    'px-3',
    'py-2',
    'border',
    'rounded-lg',
    'shadow-sm',
    'transition-colors',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-0',
    'disabled:bg-gray-50',
    'disabled:text-gray-500',
    'disabled:cursor-not-allowed',
  ]

  if (props.error) {
    baseClasses.push(
      'border-red-300',
      'text-red-900',
      'placeholder-red-300',
      'focus:ring-red-500',
      'focus:border-red-500',
    )
  } else {
    baseClasses.push(
      'border-gray-300',
      'text-gray-900',
      'placeholder-gray-400',
      'focus:ring-blue-500',
      'focus:border-blue-500',
    )
  }

  return baseClasses
})
</script>

<template>
  <BaseCard variant="glass" padding="large">
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
      <div v-for="filter in filters" :key="filter.key">
        <label class="block text-sm font-semibold text-gray-700 mb-2">{{ filter.label }}</label>
        
        <BaseInput
          v-if="filter.type === 'text'"
          v-model="filterValues[filter.key]"
          :placeholder="filter.placeholder"
          @input="handleFilterChange"
        >
          <template #suffix v-if="filter.icon">
            <el-icon class="text-gray-400">
              <component :is="filter.icon" />
            </el-icon>
          </template>
        </BaseInput>

        <el-select
          v-else-if="filter.type === 'select'"
          v-model="filterValues[filter.key]"
          :placeholder="filter.placeholder"
          clearable
          class="w-full"
          @change="handleFilterChange"
        >
          <el-option
            v-for="option in filter.options"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </div>

      <div class="flex items-end">
        <BaseButton
          variant="outline"
          @click="clearFilters"
          class="w-full h-10"
          icon="Refresh"
        >
          Limpar Filtros
        </BaseButton>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseCard from '../atoms/BaseCard.vue'
import BaseInput from '../atoms/BaseInput.vue'
import BaseButton from '../atoms/BaseButton.vue'

interface FilterOption {
  label: string
  value: string | number
}

interface Filter {
  key: string
  label: string
  type: 'text' | 'select'
  placeholder?: string
  icon?: string
  options?: FilterOption[]
}

interface Props {
  filters: Filter[]
  modelValue: Record<string, unknown>
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, unknown>]
  'filter-change': [value: Record<string, unknown>]
}>()

const filterValues = ref<Record<string, unknown>>({ ...props.modelValue })

props.filters.forEach(filter => {
  if (!(filter.key in filterValues.value)) {
    filterValues.value[filter.key] = ''
  }
})

watch(filterValues, (newValue) => {
  emit('update:modelValue', { ...newValue })
}, { deep: true })

function handleFilterChange() {
  emit('filter-change', { ...filterValues.value })
}

function clearFilters() {
  const clearedFilters: Record<string, unknown> = {}
  props.filters.forEach(filter => {
    clearedFilters[filter.key] = ''
  })
  filterValues.value = clearedFilters
  emit('filter-change', clearedFilters)
}
</script> 
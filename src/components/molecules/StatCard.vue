<template>
  <BaseCard variant="glass">
    <div class="p-6">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <div
            :class="[
              'w-12 h-12 rounded-xl flex items-center justify-center shadow-lg',
              iconBgClass
            ]"
          >
            <el-icon class="h-6 w-6">
              <component :is="icon" class="text-white" />
            </el-icon>
          </div>
        </div>
        <div class="ml-4 w-0 flex-1">
          <dl>
            <dt class="text-sm font-semibold text-gray-600 truncate">{{ title }}</dt>
            <dd>
              <div class="text-2xl font-bold text-gray-900">{{ value }}</div>
            </dd>
          </dl>
        </div>
      </div>
    </div>
    <div
      :class="[
        'px-6 py-5 border-t',
        footerBgClass
      ]"
    >
      <div class="text-sm">
        <BaseButton
          variant="outline"
          size="small"
          @click="$emit('action')"
          class="w-full text-xs"
          icon="View"
        >
          {{ actionText }}
        </BaseButton>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseCard from '../atoms/BaseCard.vue'
import BaseButton from '../atoms/BaseButton.vue'

interface Props {
  title: string
  value: string | number
  icon: string
  variant?: 'blue' | 'green' | 'yellow' | 'red'
  actionText: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'blue'
})

defineEmits<{
  action: []
}>()

const iconBgClass = computed(() => {
  const classes = {
    blue: 'bg-gradient-to-br from-blue-500 to-indigo-600',
    green: 'bg-gradient-to-br from-green-500 to-emerald-600',
    yellow: 'bg-gradient-to-br from-yellow-500 to-orange-600',
    red: 'bg-gradient-to-br from-red-500 to-pink-600'
  }
  return classes[props.variant]
})

const footerBgClass = computed(() => {
  const classes = {
    blue: 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200/50',
    green: 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200/50',
    yellow: 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200/50',
    red: 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200/50'
  }
  return classes[props.variant]
})
</script> 
<template>
  <BaseCard variant="glass" padding="none">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200/50">
        <thead class="bg-gradient-to-r from-gray-50 to-blue-50/50">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              :class="[
                'px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider',
                column.align === 'right' ? 'text-right' : 'text-left'
              ]"
            >
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white/50 divide-y divide-gray-200/30">
          <tr
            v-for="(item, index) in items"
            :key="item.id || index"
            class="hover:bg-white/80 transition-colors"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              :class="[
                'px-6 py-4 whitespace-nowrap text-sm',
                column.align === 'right' ? 'text-right' : 'text-left'
              ]"
            >
              <slot :name="column.key" :item="item" :column="column">
                {{ getValue(item, column.key) }}
              </slot>
            </td>
          </tr>

          <tr v-if="items.length === 0">
            <td :colspan="columns.length" class="px-6 py-12 whitespace-nowrap text-sm text-gray-500 text-center">
              <slot name="empty">
                <div class="flex flex-col items-center justify-center">
                  <div
                    class="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mb-4"
                  >
                    <el-icon class="h-8 w-8 text-gray-400">
                      <component :is="emptyIcon" />
                    </el-icon>
                  </div>
                  <p class="text-lg font-semibold text-gray-900 mb-2">{{ emptyTitle }}</p>
                  <p class="text-gray-600">{{ emptyMessage }}</p>
                </div>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import BaseCard from '../atoms/BaseCard.vue'

interface Column {
  key: string
  label: string
  align?: 'left' | 'right' | 'center'
}

interface Props {
  columns: Column[]
  items: Record<string, unknown>[]
  emptyIcon?: Component
  emptyTitle?: string
  emptyMessage?: string
}

withDefaults(defineProps<Props>(), {
  emptyTitle: 'Nenhum item encontrado',
  emptyMessage: 'Tente ajustar os filtros ou adicione novos itens.'
})

function getValue(item: Record<string, unknown>, key: string): unknown {
  return key.split('.').reduce((obj, k) => (obj as Record<string, unknown>)?.[k], item)
}
</script> 
<template>
  <div class="space-y-6">
    <div class="md:flex md:items-center md:justify-between">
      <div class="flex-1 min-w-0">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Gerenciamento de Locações
        </h2>
        <p class="mt-1 text-sm text-gray-500">Gerencie locações ativas, devoluções e histórico.</p>
      </div>
      <div class="mt-4 flex md:mt-0 md:ml-4">
        <BaseButton variant="primary" @click="$router.push('/rentals/create')">
          <el-icon class="mr-2">
            <Plus />
          </el-icon>
          Nova Locação
        </BaseButton>
      </div>
    </div>

    <BaseCard>
      <div class="text-center py-12">
        <el-icon class="h-12 w-12 text-gray-400 mx-auto mb-4">
          <Tickets />
        </el-icon>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Em desenvolvimento</h3>
        <p class="text-gray-500">
          O sistema de gerenciamento de locações será implementado em breve.
        </p>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import BaseCard from '@/components/atoms/BaseCard.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'
import { Plus, Tickets } from '@element-plus/icons-vue'
</script>

<template>
  <div class="space-y-6">
    <div class="md:flex md:items-center md:justify-between">
      <div class="flex-1 min-w-0">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Editar Cliente
        </h2>
        <p class="mt-1 text-sm text-gray-500">Atualize as informações do cliente.</p>
      </div>
      <div class="mt-4 flex md:mt-0 md:ml-4">
        <BaseButton variant="outline" @click="$router.push('/clients')">
          <el-icon class="mr-2">
            <ArrowLeft />
          </el-icon>
          Voltar
        </BaseButton>
      </div>
    </div>

    <BaseCard>
      <div class="text-center py-12">
        <el-icon class="h-12 w-12 text-gray-400 mx-auto mb-4">
          <UserFilled />
        </el-icon>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Em desenvolvimento</h3>
        <p class="text-gray-500">O formulário de edição de clientes será implementado em breve.</p>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import BaseCard from '@/components/atoms/BaseCard.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'
import { ArrowLeft, UserFilled } from '@element-plus/icons-vue'
</script>

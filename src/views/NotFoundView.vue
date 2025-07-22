<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full text-center">
      <div class="space-y-6">
        <div>
          <h1 class="text-9xl font-bold text-gray-300">404</h1>
          <h2 class="mt-4 text-3xl font-bold text-gray-900">Página não encontrada</h2>
          <p class="mt-2 text-lg text-gray-600">
            Desculpe, não conseguimos encontrar a página que você está procurando.
          </p>
        </div>

        <div class="space-y-3">
          <BaseButton variant="primary" size="large" @click="$router.push('/')">
            Voltar ao início
          </BaseButton>

          <BaseButton variant="outline" size="large" @click="$router.back()"> Voltar </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseButton from '@/components/atoms/BaseButton.vue'
</script>

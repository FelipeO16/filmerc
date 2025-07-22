<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Entrar no FilmerC</h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Sistema de gerenciamento de locadora de filmes
        </p>
      </div>

      <BaseCard padding="large">
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <BaseInput
            id="document"
            v-model="form.document"
            label="Documento"
            placeholder="Digite seu número de documento"
            required
            :error="errors.document"
          />

          <BaseInput
            id="password"
            v-model="form.password"
            type="password"
            label="Senha"
            placeholder="Digite sua senha"
            required
            :error="errors.password"
          />

          <BaseButton type="submit" :loading="loading" block size="large"> Entrar </BaseButton>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            Credenciais padrão: <br />
            Documento: <strong>12345678901</strong><br />
            Senha: <strong>admin123</strong>
          </p>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseCard from '@/components/atoms/BaseCard.vue'
import BaseInput from '@/components/atoms/BaseInput.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)

const form = reactive({
  document: '',
  password: '',
})

const errors = reactive({
  document: '',
  password: '',
})

function validateForm() {
  errors.document = ''
  errors.password = ''

  let isValid = true

  if (!form.document.trim()) {
    errors.document = 'Documento é obrigatório'
    isValid = false
  }

  if (!form.password.trim()) {
    errors.password = 'Senha é obrigatória'
    isValid = false
  }

  return isValid
}

async function handleSubmit() {
  if (!validateForm()) return

  try {
    loading.value = true

    const success = await authStore.login({
      document: form.document,
      password: form.password,
    })

    if (success) {
      await router.push('/')
    }
  } catch (error) {
    console.error('Erro no login:', error)
  } finally {
    loading.value = false
  }
}
</script>

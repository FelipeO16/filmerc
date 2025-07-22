<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
  >
    <div class="absolute inset-0 overflow-hidden">
      <div
        class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl"
      ></div>
      <div
        class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl"
      ></div>
    </div>

    <div class="max-w-md w-full space-y-8 relative z-10">
      <div class="text-center">
        <div class="flex justify-center mb-6">
          <div
            class="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl"
          >
            <el-icon class="h-10 w-10">
              <Film class="text-white" />
            </el-icon>
          </div>
        </div>
        <h2
          class="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
        >
          FilmerC
        </h2>
        <p class="mt-2 text-lg text-gray-600 font-medium">Sistema de Gerenciamento</p>
        <p class="text-sm text-gray-500">Faça login para acessar sua conta</p>
      </div>

      <BaseCard variant="glass" padding="large" class="backdrop-blur-md">
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <BaseInput
            id="cpf"
            v-model="form.document"
            label="CPF"
            placeholder="000.000.000-00"
            required
            :error="errors.document"
            @input="formatCpf"
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

          <BaseButton
            type="submit"
            :loading="loading"
            block
            size="large"
            variant="gradient"
            class="mt-8"
            icon="User"
          >
            Entrar no Sistema
          </BaseButton>
        </form>

        <div
          class="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200/50"
        >
          <p class="text-sm text-gray-700 font-medium mb-2">👤 Credenciais de Demonstração:</p>
          <div class="space-y-1 text-sm text-gray-600">
            <p><span class="font-semibold">CPF:</span> 123.456.789-01</p>
            <p><span class="font-semibold">Senha:</span> admin123</p>
          </div>
        </div>
      </BaseCard>

      <div class="text-center">
        <p class="text-xs text-gray-500">© 2024 FilmerC. Todos os direitos reservados.</p>
      </div>
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
import { Film } from '@element-plus/icons-vue'

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
    errors.document = 'CPF é obrigatório'
    isValid = false
  } else if (form.document.replace(/\D/g, '').length !== 11) {
    errors.document = 'CPF deve ter 11 dígitos'
    isValid = false
  } else if (form.document.length !== 14) {
    errors.document = 'CPF deve estar no formato 000.000.000-00'
    isValid = false
  }

  if (!form.password.trim()) {
    errors.password = 'Senha é obrigatória'
    isValid = false
  }

  return isValid
}

function formatCpf() {
  let value = form.document.replace(/\D/g, '')
  value = value.substring(0, 11)
  value = value.replace(/(\d{3})(\d)/, '$1.$2')
  value = value.replace(/(\d{3})(\d)/, '$1.$2')
  value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  form.document = value
}

async function handleSubmit() {
  if (!validateForm()) return

  try {
    loading.value = true

    const documentWithoutFormat = form.document.replace(/\D/g, '')

    const success = await authStore.login({
      document: documentWithoutFormat,
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

<template>
  <div
    class="min-h-screen relative overflow-y-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"
  >
    <div class="absolute inset-0">
      <div class="absolute inset-0 bg-black/40"></div>
      <div class="absolute top-0 left-0 w-full h-full">
        <div
          class="absolute top-10 left-10 w-20 h-20 bg-blue-400/20 rounded-full blur-xl animate-pulse"
        ></div>
        <div
          class="absolute top-20 right-20 w-32 h-32 bg-indigo-500/20 rounded-full blur-xl animate-pulse delay-1000"
        ></div>
        <div
          class="absolute bottom-20 left-20 w-24 h-24 bg-blue-500/20 rounded-full blur-xl animate-pulse delay-2000"
        ></div>
        <div
          class="absolute bottom-10 right-10 w-16 h-16 bg-indigo-400/20 rounded-full blur-xl animate-pulse delay-3000"
        ></div>
      </div>
    </div>

    <div class="relative z-10 min-h-screen flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <div class="text-center mb-4">
          <div class="flex justify-center mb-6">
            <div class="relative">
              <div
                class="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl transform rotate-12 hover:rotate-0 transition-transform duration-500"
              >
                <el-icon class="h-12 w-12">
                  <Film class="text-cyan-100" />
                </el-icon>
              </div>
              <div
                class="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg"
              >
                <div class="w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
          </div>

          <h1
            class="text-5xl font-black bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent mb-2"
          >
            FILMERC
          </h1>
          <p class="text-xl text-white/90 font-semibold mb-1">Locadora de Filmes</p>
          <p class="text-sm text-white/70">Sistema de Gerenciamento Profissional</p>
        </div>

        <div class="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8">
          <div class="text-center mb-6">
            <h2 class="text-2xl font-bold text-white mb-2">Bem-vindo de volta!</h2>
            <p class="text-white/80">Faça login para acessar o sistema</p>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-white/90">CPF</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <el-icon class="h-5 w-5">
                    <User class="text-white" />
                  </el-icon>
                </div>
                <input
                  v-model="form.document"
                  type="text"
                  placeholder="000.000.000-00"
                  class="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                  @input="formatCpf"
                  required
                />
              </div>
              <p v-if="errors.document" class="text-red-400 text-sm mt-1">{{ errors.document }}</p>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-semibold text-white/90">Senha</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <el-icon class="h-5 w-5">
                    <Lock class="text-white" />
                  </el-icon>
                </div>
                <input
                  v-model="form.password"
                  type="password"
                  placeholder="Digite sua senha"
                  class="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>
              <p v-if="errors.password" class="text-red-400 text-sm mt-1">{{ errors.password }}</p>
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <div v-if="loading" class="flex items-center justify-center">
                <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Entrando...
              </div>
              <div v-else class="flex items-center justify-center">
                <el-icon class="h-5 w-5 mr-2">
                  <Right />
                </el-icon>
                Entrar no Sistema
              </div>
            </button>
          </form>

          <div
            class="mt-8 p-6 bg-gradient-to-r from-blue-400/10 to-indigo-500/10 rounded-2xl border border-blue-400/20"
          >
            <div class="flex items-center mb-3">
              <el-icon class="h-5 w-5 mr-2">
                <InfoFilled class="text-blue-400" />
              </el-icon>
              <p class="text-blue-400 font-semibold">Credenciais de Demonstração</p>
            </div>
            <div class="space-y-2 text-white/90 text-sm">
              <div class="flex items-center">
                <span class="font-semibold w-16">CPF:</span>
                <span class="font-mono bg-white/10 px-2 py-1 rounded">123.456.789-01</span>
              </div>
              <div class="flex items-center">
                <span class="font-semibold w-16">Senha:</span>
                <span class="font-mono bg-white/10 px-2 py-1 rounded">admin123</span>
              </div>
            </div>
          </div>
        </div>

        <div class="my-8 md:my-0 md:mt-8 text-center">
          <p class="text-white/60 text-sm">© 2025 FilMerc. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>

    <div class="absolute bottom-4 left-4 text-white/40 text-xs">
      <div class="flex items-center space-x-4">
        <div class="flex items-center">
          <div class="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
          <span>Filmes</span>
        </div>
        <div class="flex items-center">
          <div class="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
          <span>Clientes</span>
        </div>
        <div class="flex items-center">
          <div class="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
          <span>Aluguéis</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Film, User, Lock, Right, InfoFilled } from '@element-plus/icons-vue'

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

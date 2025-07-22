<template>
  <div class="space-y-6">
    <div class="md:flex md:items-center md:justify-between">
      <div class="flex-1 min-w-0">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Editar Usuário
        </h2>
        <p class="mt-1 text-sm text-gray-500">Atualize as informações do usuário.</p>
      </div>
      <div class="mt-4 flex md:mt-0 md:ml-4">
        <BaseButton variant="outline" @click="$router.push('/users')">
          <el-icon class="mr-2">
            <ArrowLeft />
          </el-icon>
          Voltar
        </BaseButton>
      </div>
    </div>

    <BaseCard v-if="user">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <BaseInput
            v-model="form.name"
            label="Nome Completo"
            placeholder="Digite o nome completo"
            required
            :error="errors.name"
          />

          <BaseInput
            v-model="form.document"
            label="Documento"
            placeholder="Digite o documento (CPF/CNPJ)"
            required
            :error="errors.document"
          />
        </div>

        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <BaseInput
            v-model="form.password"
            type="password"
            label="Nova Senha (deixe em branco para manter a atual)"
            placeholder="Digite a nova senha"
            :error="errors.password"
          />

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Status <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.status"
              class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
            </select>
            <p v-if="errors.status" class="mt-1 text-sm text-red-600">
              {{ errors.status }}
            </p>
          </div>
        </div>

        <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <BaseButton type="button" variant="outline" @click="$router.push('/users')">
            Cancelar
          </BaseButton>

          <BaseButton type="submit" :loading="loading"> Salvar Alterações </BaseButton>
        </div>
      </form>
    </BaseCard>

    <div v-else class="text-center py-12">
      <p class="text-gray-500">Carregando...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { UserStatus, type User, type UpdateUserRequest } from '@/types'
import BaseCard from '@/components/atoms/BaseCard.vue'
import BaseInput from '@/components/atoms/BaseInput.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'
import { ArrowLeft } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const loading = ref(false)
const user = ref<User | null>(null)

const form = reactive({
  name: '',
  document: '',
  password: '',
  status: '' as UserStatus,
})

const errors = reactive({
  name: '',
  document: '',
  password: '',
  status: '',
})

onMounted(() => {
  loadUser()
})

function loadUser() {
  const userId = route.params.id as string
  const foundUser = userStore.getUserById(userId)

  if (foundUser) {
    user.value = foundUser
    form.name = foundUser.name
    form.document = foundUser.document
    form.status = foundUser.status
  } else {
    router.push('/users')
  }
}

function validateForm() {
  Object.keys(errors).forEach((key) => {
    errors[key as keyof typeof errors] = ''
  })

  let isValid = true

  if (!form.name.trim()) {
    errors.name = 'Nome é obrigatório'
    isValid = false
  }

  if (!form.document.trim()) {
    errors.document = 'Documento é obrigatório'
    isValid = false
  } else if (form.document.length < 11) {
    errors.document = 'Documento deve ter pelo menos 11 caracteres'
    isValid = false
  }

  if (form.password && form.password.length < 6) {
    errors.password = 'Senha deve ter pelo menos 6 caracteres'
    isValid = false
  }

  if (!form.status) {
    errors.status = 'Status é obrigatório'
    isValid = false
  }

  return isValid
}

async function handleSubmit() {
  if (!validateForm()) return

  try {
    loading.value = true

    const updateData: UpdateUserRequest = {
      name: form.name,
      document: form.document,
      status: form.status,
    }

    if (form.password) {
      updateData.password = form.password
    }

    const success = await userStore.updateUser(route.params.id as string, updateData)

    if (success) {
      router.push('/users')
    }
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error)
  } finally {
    loading.value = false
  }
}
</script>

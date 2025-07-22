<template>
  <div class="space-y-6">
    <div class="md:flex md:items-center md:justify-between">
      <div class="flex-1 min-w-0">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Criar Novo Usuário
        </h2>
        <p class="mt-1 text-sm text-gray-500">Adicione um novo usuário ao sistema.</p>
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

    <BaseCard>
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
            label="Senha"
            placeholder="Digite a senha"
            required
            :error="errors.password"
          />

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Status <span class="text-red-500">*</span>
            </label>
            <el-select v-model="form.status" placeholder="Selecione o status" class="w-full">
              <el-option label="Ativo" value="active" />
              <el-option label="Inativo" value="inactive" />
            </el-select>
            <p v-if="errors.status" class="mt-1 text-sm text-red-600">
              {{ errors.status }}
            </p>
          </div>
        </div>

        <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <BaseButton type="button" variant="outline" @click="$router.push('/users')">
            Cancelar
          </BaseButton>

          <BaseButton type="submit" :loading="loading"> Criar Usuário </BaseButton>
        </div>
      </form>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { UserStatus } from '@/types'
import BaseCard from '@/components/atoms/BaseCard.vue'
import BaseInput from '@/components/atoms/BaseInput.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'
import { ArrowLeft } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

const loading = ref(false)

const form = reactive({
  name: '',
  document: '',
  password: '',
  status: '' as UserStatus | '',
})

const errors = reactive({
  name: '',
  document: '',
  password: '',
  status: '',
})

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

  if (!form.password.trim()) {
    errors.password = 'Senha é obrigatória'
    isValid = false
  } else if (form.password.length < 6) {
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

    const success = await userStore.createUser({
      name: form.name,
      document: form.document,
      password: form.password,
      status: form.status as UserStatus,
    })

    if (success) {
      router.push('/users')
    }
  } catch (error) {
    console.error('Erro ao criar usuário:', error)
  } finally {
    loading.value = false
  }
}
</script>

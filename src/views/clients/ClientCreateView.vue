<template>
  <div class="space-y-6">
    <div class="md:flex md:items-center md:justify-between">
      <div class="flex-1 min-w-0">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Criar Novo Cliente
        </h2>
        <p class="mt-1 text-sm text-gray-500">
          Adicione um novo cliente ao sistema com informações de contato e endereço.
        </p>
      </div>
      <div class="mt-4 flex md:mt-0 md:ml-4">
        <BaseButton variant="outline" @click="$router.push('/clients')"> Voltar </BaseButton>
      </div>
    </div>

    <BaseCard>
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <BaseInput
            id="name"
            v-model="form.name"
            label="Nome"
            placeholder="Digite o nome"
            required
            :error="errors.name"
          />

          <BaseInput
            id="lastName"
            v-model="form.lastName"
            label="Sobrenome"
            placeholder="Digite o sobrenome"
            required
            :error="errors.lastName"
          />

          <BaseInput
            id="cpf"
            v-model="form.cpf"
            label="CPF"
            placeholder="000.000.000-00"
            required
            :error="errors.cpf"
            @input="formatCpf"
          />

          <BaseInput
            id="email"
            v-model="form.email"
            type="email"
            label="Email"
            placeholder="cliente@email.com"
            required
            :error="errors.email"
          />

          <BaseInput
            id="phone"
            v-model="form.phone"
            label="Telefone"
            placeholder="(11) 99999-9999"
            required
            :error="errors.phone"
            @input="formatPhone"
          />

          <BaseInput
            id="zipCode"
            v-model="form.address.zipCode"
            label="CEP"
            placeholder="00000-000"
            required
            :error="errors.cep"
            @input="formatCep"
            @blur="fetchAddress"
          />

          <BaseInput
            id="street"
            v-model="form.address.street"
            label="Logradouro"
            placeholder="Rua, Avenida..."
            required
            :error="errors.street"
          />

          <BaseInput
            id="neighborhood"
            v-model="form.address.neighborhood"
            label="Bairro"
            placeholder="Nome do bairro"
            required
            :error="errors.neighborhood"
          />

          <BaseInput
            id="city"
            v-model="form.address.city"
            label="Cidade"
            placeholder="Nome da cidade"
            required
            :error="errors.city"
          />

          <BaseInput
            id="state"
            v-model="form.address.state"
            label="UF"
            placeholder="SP"
            required
            :error="errors.uf"
            maxlength="2"
          />
        </div>

        <div class="flex justify-end space-x-3">
          <BaseButton type="button" variant="outline" @click="$router.push('/clients')">
            Cancelar
          </BaseButton>
          <BaseButton type="submit" :loading="loading"> Criar Cliente </BaseButton>
        </div>
      </form>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useClientStore } from '@/stores/client'
import { ViaCepService } from '@/services/viacep-service'
import { ClientStatus } from '@/types'
import BaseCard from '@/components/atoms/BaseCard.vue'
import BaseInput from '@/components/atoms/BaseInput.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'

const router = useRouter()
const clientStore = useClientStore()

const loading = ref(false)

const form = reactive({
  name: '',
  lastName: '',
  cpf: '',
  email: '',
  phone: '',
  status: ClientStatus.ACTIVE,
  address: {
    zipCode: '',
    street: '',
    neighborhood: '',
    city: '',
    state: '',
  },
})

const errors = reactive({
  name: '',
  lastName: '',
  cpf: '',
  email: '',
  phone: '',
  cep: '',
  street: '',
  neighborhood: '',
  city: '',
  uf: '',
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

  if (!form.lastName.trim()) {
    errors.lastName = 'Sobrenome é obrigatório'
    isValid = false
  }

  if (!form.cpf.trim()) {
    errors.cpf = 'CPF é obrigatório'
    isValid = false
  } else if (form.cpf.replace(/\D/g, '').length !== 11) {
    errors.cpf = 'CPF deve ter 11 dígitos'
    isValid = false
  }

  if (!form.email.trim()) {
    errors.email = 'Email é obrigatório'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = 'Email inválido'
    isValid = false
  }

  if (!form.phone.trim()) {
    errors.phone = 'Telefone é obrigatório'
    isValid = false
  }

  if (!form.address.zipCode.trim()) {
    errors.cep = 'CEP é obrigatório'
    isValid = false
  }

  if (!form.address.street.trim()) {
    errors.street = 'Logradouro é obrigatório'
    isValid = false
  }

  if (!form.address.neighborhood.trim()) {
    errors.neighborhood = 'Bairro é obrigatório'
    isValid = false
  }

  if (!form.address.city.trim()) {
    errors.city = 'Cidade é obrigatória'
    isValid = false
  }

  if (!form.address.state.trim()) {
    errors.uf = 'UF é obrigatória'
    isValid = false
  }

  return isValid
}

async function handleSubmit() {
  if (!validateForm()) return

  try {
    loading.value = true

    const success = await clientStore.createClient(form)

    if (success) {
      await router.push('/clients')
    }
  } catch (error) {
    console.error('Erro ao criar cliente:', error)
  } finally {
    loading.value = false
  }
}

function formatCpf() {
  let value = form.cpf.replace(/\D/g, '')
  value = value.replace(/(\d{3})(\d)/, '$1.$2')
  value = value.replace(/(\d{3})(\d)/, '$1.$2')
  value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  form.cpf = value
}

function formatPhone() {
  let value = form.phone.replace(/\D/g, '')
  value = value.replace(/(\d{2})(\d)/, '($1) $2')
  value = value.replace(/(\d{5})(\d)/, '$1-$2')
  form.phone = value
}

function formatCep() {
  let value = form.address.zipCode.replace(/\D/g, '')
  value = value.replace(/(\d{5})(\d)/, '$1-$2')
  form.address.zipCode = value
}

async function fetchAddress() {
  if (form.address.zipCode.replace(/\D/g, '').length === 8) {
    try {
      const address = await ViaCepService.getAddressByZipCode(form.address.zipCode)
      if (address) {
        form.address.street = address.street
        form.address.neighborhood = address.neighborhood
        form.address.city = address.city
        form.address.state = address.state
      }
    } catch (error) {
      console.error('Erro ao buscar endereço:', error)
    }
  }
}
</script>

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
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <BaseInput
            v-model="form.name"
            label="Nome"
            placeholder="Digite o nome"
            required
            :error="errors.name"
          />

          <BaseInput
            v-model="form.lastName"
            label="Sobrenome"
            placeholder="Digite o sobrenome"
            required
            :error="errors.lastName"
          />
        </div>

        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <BaseInput
            v-model="form.cpf"
            label="CPF"
            placeholder="000.000.000-00"
            required
            :error="errors.cpf"
            @input="formatCpf"
          />

          <BaseInput
            v-model="form.phone"
            label="Telefone"
            placeholder="(00) 00000-0000"
            required
            :error="errors.phone"
            @input="formatPhone"
          />
        </div>

        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <BaseInput
            v-model="form.email"
            type="email"
            label="E-mail"
            placeholder="Digite o e-mail"
            required
            :error="errors.email"
          />

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Status <span class="text-red-500">*</span>
            </label>
            <el-select v-model="form.status" placeholder="Selecione o status" class="w-full">
              <el-option label="Ativo" :value="ClientStatus.ACTIVE" />
              <el-option label="Inativo" :value="ClientStatus.INACTIVE" />
            </el-select>
            <p v-if="errors.status" class="mt-1 text-sm text-red-600">
              {{ errors.status }}
            </p>
          </div>
        </div>

        <div class="border-t border-gray-200 pt-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Endereço</h3>
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <BaseInput
              v-model="form.address.zipCode"
              label="CEP"
              placeholder="00000-000"
              required
              :error="errors.address?.zipCode"
              @input="formatCep"
              @blur="searchCep"
            />

            <BaseInput
              v-model="form.address.street"
              label="Rua"
              placeholder="Digite a rua"
              required
              :error="errors.address?.street"
            />
          </div>

          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 mt-6">
            <BaseInput
              v-model="form.address.neighborhood"
              label="Bairro"
              placeholder="Digite o bairro"
              required
              :error="errors.address?.neighborhood"
            />

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Estado <span class="text-red-500">*</span>
              </label>
              <el-select
                v-model="form.address.state"
                placeholder="Selecione o estado"
                class="w-full"
              >
                <el-option
                  v-for="state in states"
                  :key="state.value"
                  :label="state.label"
                  :value="state.value"
                />
              </el-select>
              <p v-if="errors.address?.state" class="mt-1 text-sm text-red-600">
                {{ errors.address.state }}
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-6 sm:grid-cols-1 mt-6">
            <BaseInput
              v-model="form.address.city"
              label="Cidade"
              placeholder="Digite a cidade"
              required
              :error="errors.address?.city"
            />
          </div>
        </div>

        <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <BaseButton type="button" variant="outline" @click="$router.push('/clients')">
            Cancelar
          </BaseButton>

          <BaseButton type="submit" :loading="loading"> Atualizar Cliente </BaseButton>
        </div>
      </form>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useClientStore } from '@/stores/client'
import { ClientStatus } from '@/types'
import BaseCard from '@/components/atoms/BaseCard.vue'
import BaseInput from '@/components/atoms/BaseInput.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'
import { ArrowLeft } from '@element-plus/icons-vue'
import { ViaCepService } from '@/services/viacep-service'

const router = useRouter()
const route = useRoute()
const clientStore = useClientStore()

const loading = ref(false)
const clientId = route.params.id as string

const form = reactive({
  name: '',
  lastName: '',
  cpf: '',
  phone: '',
  email: '',
  status: '' as ClientStatus | '',
  address: {
    zipCode: '',
    street: '',
    neighborhood: '',
    city: '',
    state: '',
  },
})

const errors = reactive<{
  name: string
  lastName: string
  cpf: string
  phone: string
  email: string
  status: string
  address: {
    zipCode: string
    street: string
    neighborhood: string
    city: string
    state: string
  }
}>({
  name: '',
  lastName: '',
  cpf: '',
  phone: '',
  email: '',
  status: '',
  address: {
    zipCode: '',
    street: '',
    neighborhood: '',
    city: '',
    state: '',
  },
})

const states = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' },
]

onMounted(async () => {
  await loadClient()
})

async function loadClient() {
  try {
    loading.value = true
    const client = await clientStore.getClientById(clientId)

    if (client) {
      form.name = client.name
      form.lastName = client.lastName
      form.cpf = client.cpf
      form.phone = client.phone
      form.email = client.email
      form.status = client.status
      form.address.zipCode = client.address.zipCode
      form.address.street = client.address.street
      form.address.neighborhood = client.address.neighborhood
      form.address.city = client.address.city
      form.address.state = client.address.state
    } else {
      router.push('/clients')
    }
  } catch (error) {
    console.error('Erro ao carregar cliente:', error)
    router.push('/clients')
  } finally {
    loading.value = false
  }
}

function validateForm() {
  errors.name = ''
  errors.lastName = ''
  errors.cpf = ''
  errors.phone = ''
  errors.email = ''
  errors.status = ''
  errors.address.zipCode = ''
  errors.address.street = ''
  errors.address.neighborhood = ''
  errors.address.city = ''
  errors.address.state = ''

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

  if (!form.phone.trim()) {
    errors.phone = 'Telefone é obrigatório'
    isValid = false
  } else if (form.phone.replace(/\D/g, '').length < 10) {
    errors.phone = 'Telefone deve ter pelo menos 10 dígitos'
    isValid = false
  }

  if (!form.email.trim()) {
    errors.email = 'E-mail é obrigatório'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'E-mail inválido'
    isValid = false
  }

  if (!form.status) {
    errors.status = 'Status é obrigatório'
    isValid = false
  }

  if (!form.address.zipCode.trim()) {
    errors.address.zipCode = 'CEP é obrigatório'
    isValid = false
  }

  if (!form.address.street.trim()) {
    errors.address.street = 'Rua é obrigatória'
    isValid = false
  }

  if (!form.address.neighborhood.trim()) {
    errors.address.neighborhood = 'Bairro é obrigatório'
    isValid = false
  }

  if (!form.address.city.trim()) {
    errors.address.city = 'Cidade é obrigatória'
    isValid = false
  }

  if (!form.address.state) {
    errors.address.state = 'Estado é obrigatório'
    isValid = false
  }

  return isValid
}

function formatCpf() {
  let value = form.cpf.replace(/\D/g, '')
  value = value.substring(0, 11)
  value = value.replace(/(\d{3})(\d)/, '$1.$2')
  value = value.replace(/(\d{3})(\d)/, '$1.$2')
  value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  form.cpf = value
}

function formatPhone() {
  let value = form.phone.replace(/\D/g, '')
  value = value.substring(0, 11)
  value = value.replace(/(\d{2})(\d)/, '($1) $2')
  value = value.replace(/(\d{5})(\d)/, '$1-$2')
  form.phone = value
}

function formatCep() {
  let value = form.address.zipCode.replace(/\D/g, '')
  value = value.substring(0, 8)
  value = value.replace(/(\d{5})(\d)/, '$1-$2')
  form.address.zipCode = value
}

async function searchCep() {
  const cep = form.address.zipCode.replace(/\D/g, '')
  if (cep.length === 8) {
    try {
      const address = await ViaCepService.getAddressByZipCode(cep)
      if (address) {
        form.address.street = address.street
        form.address.neighborhood = address.neighborhood
        form.address.city = address.city
        form.address.state = address.state
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error)
    }
  }
}

async function handleSubmit() {
  if (!validateForm()) return

  try {
    loading.value = true

    const success = await clientStore.updateClient(clientId, {
      name: form.name,
      lastName: form.lastName,
      cpf: form.cpf.replace(/\D/g, ''),
      phone: form.phone.replace(/\D/g, ''),
      email: form.email,
      status: form.status as ClientStatus,
      address: {
        zipCode: form.address.zipCode.replace(/\D/g, ''),
        street: form.address.street,
        neighborhood: form.address.neighborhood,
        city: form.address.city,
        state: form.address.state,
      },
    })

    if (success) {
      router.push('/clients')
    }
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error)
  } finally {
    loading.value = false
  }
}
</script>

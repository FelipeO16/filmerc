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
          <div class="col-span-2">
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-blue-700">
                    <strong>Dica:</strong> Digite o CEP para preenchimento automático do endereço.
                    Os campos de endereço serão preenchidos automaticamente.
                  </p>
                </div>
              </div>
            </div>
          </div>
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

          <div class="relative">
            <BaseInput
              id="zipCode"
              v-model="form.address.zipCode"
              label="CEP"
              placeholder="00000-000"
              required
              :error="errors.cep"
              @input="formatCep"
              @blur="fetchAddress"
              :loading="cepLoading"
            />
            <div v-if="cepLoading" class="absolute right-3 top-8">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            </div>
          </div>

          <!-- Mensagem de CEP não encontrado -->
          <div v-if="cepNotFound" class="col-span-2">
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-yellow-700">
                    <strong>Atenção:</strong> CEP não encontrado. Os campos de endereço foram
                    liberados para edição manual.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <BaseInput
            id="street"
            v-model="form.address.street"
            label="Logradouro"
            :placeholder="
              cepNotFound ? 'Digite o logradouro' : 'Preenchido automaticamente pelo CEP'
            "
            required
            :error="errors.street"
            :disabled="!cepNotFound"
          />

          <BaseInput
            id="neighborhood"
            v-model="form.address.neighborhood"
            label="Bairro"
            :placeholder="cepNotFound ? 'Digite o bairro' : 'Preenchido automaticamente pelo CEP'"
            required
            :error="errors.neighborhood"
            :disabled="!cepNotFound"
          />

          <BaseInput
            id="city"
            v-model="form.address.city"
            label="Cidade"
            :placeholder="cepNotFound ? 'Digite a cidade' : 'Preenchido automaticamente pelo CEP'"
            required
            :error="errors.city"
            :disabled="!cepNotFound"
          />

          <BaseInput
            id="state"
            v-model="form.address.state"
            label="UF"
            :placeholder="cepNotFound ? 'Digite a UF' : 'Preenchido automaticamente pelo CEP'"
            required
            :error="errors.uf"
            maxlength="2"
            :disabled="!cepNotFound"
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
const cepLoading = ref(false)
const cepNotFound = ref(false)

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
  } else if (form.cpf.length > 14) {
    errors.cpf = 'CPF deve ter no máximo 14 caracteres'
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
  } else if (form.phone.replace(/\D/g, '').length < 10) {
    errors.phone = 'Telefone deve ter pelo menos 10 dígitos'
    isValid = false
  } else if (form.phone.length > 15) {
    errors.phone = 'Telefone deve ter no máximo 15 caracteres'
    isValid = false
  }

  if (!form.address.zipCode.trim()) {
    errors.cep = 'CEP é obrigatório'
    isValid = false
  } else if (form.address.zipCode.replace(/\D/g, '').length !== 8) {
    errors.cep = 'CEP deve ter 8 dígitos'
    isValid = false
  } else if (form.address.zipCode.length > 9) {
    errors.cep = 'CEP deve ter no máximo 9 caracteres'
    isValid = false
  }

  if (!form.address.street.trim()) {
    errors.street = cepNotFound.value
      ? 'Logradouro é obrigatório'
      : 'Digite um CEP válido para preencher o logradouro'
    isValid = false
  }

  if (!form.address.neighborhood.trim()) {
    errors.neighborhood = cepNotFound.value
      ? 'Bairro é obrigatório'
      : 'Digite um CEP válido para preencher o bairro'
    isValid = false
  }

  if (!form.address.city.trim()) {
    errors.city = cepNotFound.value
      ? 'Cidade é obrigatória'
      : 'Digite um CEP válido para preencher a cidade'
    isValid = false
  }

  if (!form.address.state.trim()) {
    errors.uf = cepNotFound.value ? 'UF é obrigatória' : 'Digite um CEP válido para preencher a UF'
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
  // Limita a 11 dígitos
  value = value.substring(0, 11)
  value = value.replace(/(\d{3})(\d)/, '$1.$2')
  value = value.replace(/(\d{3})(\d)/, '$1.$2')
  value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  form.cpf = value
}

function formatPhone() {
  let value = form.phone.replace(/\D/g, '')
  // Limita a 11 dígitos (DDD + 9 dígitos)
  value = value.substring(0, 11)
  value = value.replace(/(\d{2})(\d)/, '($1) $2')
  value = value.replace(/(\d{5})(\d)/, '$1-$2')
  form.phone = value
}

function formatCep() {
  let value = form.address.zipCode.replace(/\D/g, '')
  // Limita a 8 dígitos
  value = value.substring(0, 8)
  value = value.replace(/(\d{5})(\d)/, '$1-$2')
  form.address.zipCode = value

  // Reseta o estado quando o CEP é alterado
  if (value.length < 9) {
    cepNotFound.value = false
  }
}

async function fetchAddress() {
  if (form.address.zipCode.replace(/\D/g, '').length === 8) {
    try {
      cepLoading.value = true
      cepNotFound.value = false

      const address = await ViaCepService.getAddressByZipCode(form.address.zipCode)

      if (address) {
        form.address.street = address.street
        form.address.neighborhood = address.neighborhood
        form.address.city = address.city
        form.address.state = address.state
        cepNotFound.value = false
      } else {
        // CEP não encontrado - limpa os campos e permite edição manual
        form.address.street = ''
        form.address.neighborhood = ''
        form.address.city = ''
        form.address.state = ''
        cepNotFound.value = true
      }
    } catch (error) {
      console.error('Erro ao buscar endereço:', error)
      // Em caso de erro, também permite edição manual
      form.address.street = ''
      form.address.neighborhood = ''
      form.address.city = ''
      form.address.state = ''
      cepNotFound.value = true
    } finally {
      cepLoading.value = false
    }
  } else {
    // CEP incompleto - reseta o estado
    cepNotFound.value = false
  }
}
</script>

import { viaCepApi } from './api'
import type { ViaCepResponse, Address } from '@/types'

export class ViaCepService {
  static async getAddressByZipCode(zipCode: string): Promise<Address | null> {
    try {
      const cleanZipCode = zipCode.replace(/\D/g, '')

      if (cleanZipCode.length !== 8) {
        throw new Error('Formato de CEP inválido')
      }

      const response = await viaCepApi.get<ViaCepResponse>(`/${cleanZipCode}/json/`)

      if (response.data.erro) {
        return null
      }

      return {
        zipCode: response.data.cep,
        street: response.data.logradouro,
        neighborhood: response.data.bairro,
        city: response.data.localidade,
        state: response.data.uf,
      }
    } catch (error) {
      console.error('Erro ao buscar endereço do ViaCEP:', error)
      return null
    }
  }

  static formatZipCode(zipCode: string): string {
    const cleanZipCode = zipCode.replace(/\D/g, '')
    if (cleanZipCode.length === 8) {
      return `${cleanZipCode.slice(0, 5)}-${cleanZipCode.slice(5)}`
    }
    return zipCode
  }

  static isValidZipCode(zipCode: string): boolean {
    const cleanZipCode = zipCode.replace(/\D/g, '')
    return cleanZipCode.length === 8
  }
}

<template>
  <nav aria-label="Breadcrumb" class="mb-4">
    <ol class="flex items-center space-x-2 text-sm text-gray-600">
      <li v-for="(item, index) in breadcrumbs" :key="index" class="flex items-center">
        <router-link
          v-if="item.path && index < breadcrumbs.length - 1"
          :to="item.path"
          class="hover:text-blue-600 transition-colors duration-200"
        >
          {{ item.name }}
        </router-link>
        <span v-else class="text-gray-900 font-medium">
          {{ item.name }}
        </span>

        <el-icon v-if="index < breadcrumbs.length - 1" class="ml-2 h-4 w-4 text-gray-400">
          <ArrowRight />
        </el-icon>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowRight } from '@element-plus/icons-vue'

interface BreadcrumbItem {
  name: string
  path?: string
}

const route = useRoute()

const breadcrumbs = computed<BreadcrumbItem[]>(() => {
  const items: BreadcrumbItem[] = [{ name: 'Home', path: '/' }]

  switch (route.name) {
    case 'dashboard':
      items.push({ name: 'Dashboard' })
      break
    case 'users':
      items.push({ name: 'Usuários' })
      break
    case 'user-create':
      items.push({ name: 'Usuários', path: '/users' })
      items.push({ name: 'Criar Usuário' })
      break
    case 'user-edit':
      items.push({ name: 'Usuários', path: '/users' })
      items.push({ name: 'Editar Usuário' })
      break
    case 'clients':
      items.push({ name: 'Clientes' })
      break
    case 'client-create':
      items.push({ name: 'Clientes', path: '/clients' })
      items.push({ name: 'Cadastrar Cliente' })
      break
    case 'client-edit':
      items.push({ name: 'Clientes', path: '/clients' })
      items.push({ name: 'Editar Cliente' })
      break
    case 'movies':
      items.push({ name: 'Filmes' })
      break
    case 'rentals':
      items.push({ name: 'Aluguéis' })
      break
    case 'rental-create':
      items.push({ name: 'Aluguéis', path: '/rentals' })
      items.push({ name: 'Novo Aluguel' })
      break
    case 'not-found':
      items.push({ name: 'Página não encontrada' })
      break
  }

  return items
})

function insertBreadcrumbStructuredData() {
  const existingScript = document.querySelector('script[data-breadcrumb-structured-data]')
  if (existingScript) {
    existingScript.remove()
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.value.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${window.location.origin}${item.path || ''}`,
    })),
  }

  const script = document.createElement('script')
  script.setAttribute('type', 'application/ld+json')
  script.setAttribute('data-breadcrumb-structured-data', 'true')
  script.textContent = JSON.stringify(structuredData, null, 2)

  document.head.appendChild(script)
}

watch(
  breadcrumbs,
  () => {
    insertBreadcrumbStructuredData()
  },
  { immediate: true },
)

onMounted(() => {
  insertBreadcrumbStructuredData()
})
</script>

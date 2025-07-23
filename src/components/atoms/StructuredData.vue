<template>
  <div style="display: none"></div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

interface StructuredDataProps {
  type?: 'Organization' | 'WebSite' | 'WebPage' | 'BreadcrumbList'
  data?: Record<string, unknown>
}

const props = withDefaults(defineProps<StructuredDataProps>(), {
  type: 'WebPage',
  data: () => ({}),
})

const route = useRoute()

const structuredData = computed(() => {
  const baseData = {
    '@context': 'https://schema.org',
    '@type': props.type,
    '@id': `${window.location.origin}${route.path}`,
    url: `${window.location.origin}${route.path}`,
    name: document.title,
    description: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
    inLanguage: 'pt-BR',
    isPartOf: {
      '@type': 'WebSite',
      '@id': window.location.origin,
      name: 'Filmerc',
      description: 'Sistema de Gestão para Locadora de Filmes',
      url: window.location.origin,
      publisher: {
        '@type': 'Organization',
        name: 'Filmerc',
        url: window.location.origin,
      },
    },
  }

  return {
    ...baseData,
    ...props.data,
  }
})

function insertStructuredData() {
  const existingScript = document.querySelector('script[data-structured-data]')
  if (existingScript) {
    existingScript.remove()
  }

  const script = document.createElement('script')
  script.setAttribute('type', 'application/ld+json')
  script.setAttribute('data-structured-data', 'true')
  script.textContent = JSON.stringify(structuredData.value, null, 2)

  document.head.appendChild(script)
}

watch(
  structuredData,
  () => {
    insertStructuredData()
  },
  { immediate: true },
)

onMounted(() => {
  insertStructuredData()
})
</script>

import { watch } from 'vue'
import { useRoute } from 'vue-router'

interface SeoMeta {
  title?: string
  description?: string
  keywords?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  twitterTitle?: string
  twitterDescription?: string
  twitterImage?: string
  noIndex?: boolean
}

const defaultMeta: SeoMeta = {
  title: 'Filmerc - Sistema de Gestão para Locadora de Filmes',
  description: 'Sistema completo de gestão para locadoras de filmes. Gerencie clientes, filmes, aluguéis e usuários de forma eficiente e organizada.',
  keywords: 'locadora, filmes, gestão, aluguel, clientes, sistema',
  ogTitle: 'Filmerc - Sistema de Gestão para Locadora de Filmes',
  ogDescription: 'Sistema completo de gestão para locadoras de filmes. Gerencie clientes, filmes, aluguéis e usuários de forma eficiente e organizada.',
  ogImage: '/og-image.jpg',
  twitterTitle: 'Filmerc - Sistema de Gestão para Locadora de Filmes',
  twitterDescription: 'Sistema completo de gestão para locadoras de filmes. Gerencie clientes, filmes, aluguéis e usuários de forma eficiente e organizada.',
  twitterImage: '/og-image.jpg',
  noIndex: false
}

export function useSeo() {
  const route = useRoute()

  function updateMetaTags(meta: SeoMeta = {}) {
    const finalMeta = { ...defaultMeta, ...meta }

    if (finalMeta.title) {
      document.title = finalMeta.title
    }

    updateMetaTag('description', finalMeta.description)
    updateMetaTag('keywords', finalMeta.keywords)
    updateMetaTag('robots', finalMeta.noIndex ? 'noindex, nofollow' : 'index, follow')
    updateMetaTag('og:title', finalMeta.ogTitle, 'property')
    updateMetaTag('og:description', finalMeta.ogDescription, 'property')
    updateMetaTag('og:image', finalMeta.ogImage, 'property')
    updateMetaTag('twitter:title', finalMeta.twitterTitle, 'property')
    updateMetaTag('twitter:description', finalMeta.twitterDescription, 'property')
    updateMetaTag('twitter:image', finalMeta.twitterImage, 'property')
  }

  function updateMetaTag(name: string, content?: string, attribute: 'name' | 'property' = 'name') {
    if (!content) return

    let meta = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement

    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute(attribute, name)
      document.head.appendChild(meta)
    }

    meta.setAttribute('content', content)
  }

  function setPageTitle(title: string) {
    const fullTitle = title.includes('Filmerc') ? title : `${title} - Filmerc`
    updateMetaTags({ title: fullTitle })
  }

  function setPageDescription(description: string) {
    updateMetaTags({ description })
  }

  function setNoIndex() {
    updateMetaTags({ noIndex: true })
  }

  watch(
    () => route.meta,
    (meta) => {
      if (meta.seo) {
        updateMetaTags(meta.seo as SeoMeta)
      }
    },
    { immediate: true }
  )

  return {
    updateMetaTags,
    setPageTitle,
    setPageDescription,
    setNoIndex
  }
}

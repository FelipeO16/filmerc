import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue'),
      meta: {
        requiresGuest: true,
        seo: {
          title: 'Login - Filmerc',
          description: 'Faça login no sistema de gestão da locadora de filmes Filmerc.',
          noIndex: true
        }
      }
    },
    {
      path: '/',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: {
        requiresAuth: true,
        seo: {
          title: 'Dashboard - Filmerc',
          description: 'Painel principal do sistema Filmerc. Visualize estatísticas de usuários, clientes, filmes e aluguéis.',
          keywords: 'dashboard, estatísticas, locadora, filmes, gestão'
        }
      }
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('../views/users/UserListView.vue'),
      meta: {
        requiresAuth: true,
        seo: {
          title: 'Usuários - Filmerc',
          description: 'Gerencie usuários do sistema Filmerc. Visualize, adicione, edite e remova usuários.',
          keywords: 'usuários, gestão, sistema, locadora'
        }
      }
    },
    {
      path: '/users/create',
      name: 'user-create',
      component: () => import('../views/users/UserCreateView.vue'),
      meta: {
        requiresAuth: true,
        seo: {
          title: 'Criar Usuário - Filmerc',
          description: 'Crie um novo usuário no sistema Filmerc.',
          noIndex: true
        }
      }
    },
    {
      path: '/users/:id/edit',
      name: 'user-edit',
      component: () => import('../views/users/UserEditView.vue'),
      meta: {
        requiresAuth: true,
        seo: {
          title: 'Editar Usuário - Filmerc',
          description: 'Edite informações de um usuário no sistema Filmerc.',
          noIndex: true
        }
      }
    },
    {
      path: '/clients',
      name: 'clients',
      component: () => import('../views/clients/ClientListView.vue'),
      meta: {
        requiresAuth: true,
        seo: {
          title: 'Clientes - Filmerc',
          description: 'Gerencie clientes da locadora. Visualize, adicione, edite e remova clientes.',
          keywords: 'clientes, locadora, gestão, cadastro'
        }
      }
    },
    {
      path: '/clients/create',
      name: 'client-create',
      component: () => import('../views/clients/ClientCreateView.vue'),
      meta: {
        requiresAuth: true,
        seo: {
          title: 'Cadastrar Cliente - Filmerc',
          description: 'Cadastre um novo cliente na locadora Filmerc.',
          noIndex: true
        }
      }
    },
    {
      path: '/clients/:id/edit',
      name: 'client-edit',
      component: () => import('../views/clients/ClientEditView.vue'),
      meta: {
        requiresAuth: true,
        seo: {
          title: 'Editar Cliente - Filmerc',
          description: 'Edite informações de um cliente na locadora Filmerc.',
          noIndex: true
        }
      }
    },
    {
      path: '/movies',
      name: 'movies',
      component: () => import('../views/movies/MovieListView.vue'),
      meta: {
        requiresAuth: true,
        seo: {
          title: 'Filmes - Filmerc',
          description: 'Gerencie o catálogo de filmes da locadora. Visualize, adicione, edite e remova filmes.',
          keywords: 'filmes, catálogo, locadora, aluguel, cinema'
        }
      }
    },
    {
      path: '/rentals',
      name: 'rentals',
      component: () => import('../views/rentals/RentalListView.vue'),
      meta: {
        requiresAuth: true,
        seo: {
          title: 'Aluguéis - Filmerc',
          description: 'Gerencie aluguéis de filmes. Visualize histórico de aluguéis e status dos filmes.',
          keywords: 'aluguéis, locação, filmes, histórico, status'
        }
      }
    },
    {
      path: '/rentals/create',
      name: 'rental-create',
      component: () => import('../views/rentals/RentalCreateView.vue'),
      meta: {
        requiresAuth: true,
        seo: {
          title: 'Novo Aluguel - Filmerc',
          description: 'Crie um novo aluguel de filme no sistema Filmerc.',
          noIndex: true
        }
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
      meta: {
        seo: {
          title: 'Página não encontrada - Filmerc',
          description: 'A página que você está procurando não foi encontrada.',
          noIndex: true
        }
      }
    }
  ],
})

router.beforeEach((to) => {
  const authStore = useAuthStore()

  authStore.initializeAuth()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login' }
  }

  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    return { name: 'dashboard' }
  }
})

export default router

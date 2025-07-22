import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('../views/users/UserListView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/users/create',
      name: 'user-create',
      component: () => import('../views/users/UserCreateView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/users/:id/edit',
      name: 'user-edit',
      component: () => import('../views/users/UserEditView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/clients',
      name: 'clients',
      component: () => import('../views/clients/ClientListView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/clients/create',
      name: 'client-create',
      component: () => import('../views/clients/ClientCreateView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/clients/:id/edit',
      name: 'client-edit',
      component: () => import('../views/clients/ClientEditView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/movies',
      name: 'movies',
      component: () => import('../views/movies/MovieListView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/rentals',
      name: 'rentals',
      component: () => import('../views/rentals/RentalListView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/rentals/create',
      name: 'rental-create',
      component: () => import('../views/rentals/RentalCreateView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue')
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

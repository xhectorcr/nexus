import { createRouter, createWebHistory } from 'vue-router'
import RootLayout from '@/layouts/RootLayout.vue'
import LandingPage from '@/pages/landing/LandingPage.vue'
import PostulanteDashboard from '@/pages/postulante/PostulanteDashboard.vue'
import EstudianteDashboard from '@/pages/estudiante/EstudianteDashboard.vue'
import RutaAprendizaje from '@/pages/estudiante/RutaAprendizaje.vue'
import FamiliaDashboard from '@/pages/familia/FamiliaDashboard.vue'
import FamiliaProgreso from '@/pages/familia/FamiliaProgreso.vue'
import UTPPlusDashboard from '@/pages/utp-plus/UTPPlusDashboard.vue'
import LoginPage from '@/pages/login/LoginPage.vue'
import TestVocacional from '@/pages/postulante/TestVocacional.vue'
import { useAuth } from '@/lib/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: RootLayout,
      children: [
        {
          // Landing Page
          path: '',
          name: 'home',
          component: LandingPage,
        },
        {
          // Login Page
          path: 'login',
          name: 'login',
          component: LoginPage,
        },
        {
          // Register Page
          path: 'register',
          name: 'register',
          component: LoginPage,
        },
        {
          // Postulante
          path: 'postulante',
          name: 'postulante',
          component: PostulanteDashboard,
          meta: { requiresAuth: true, role: 'postulante' }
        },
        {
          // Postulante Test Vocacional
          path: 'postulante/test',
          name: 'postulante-test',
          component: TestVocacional,
          meta: { requiresAuth: true, role: 'postulante' }
        },
        {
          // Estudiante Dashboard
          path: 'estudiante',
          name: 'estudiante',
          component: EstudianteDashboard,
          meta: { requiresAuth: true, role: 'estudiante' }
        },
        {
          // Estudiante Ruta
          path: 'estudiante/ruta',
          name: 'estudiante-ruta',
          component: RutaAprendizaje,
          meta: { requiresAuth: true, role: 'estudiante' }
        },
        {
          // Padre de familia
          path: 'familia',
          name: 'familia',
          component: FamiliaDashboard,
          meta: { requiresAuth: true, role: 'familia' }
        },
        {
          // Padre de familia Progreso
          path: 'familia/progreso',
          name: 'familia-progreso',
          component: FamiliaProgreso,
          meta: { requiresAuth: true, role: 'familia' }
        },
        {
          // UTP+ (IA)
          path: 'utp-plus',
          name: 'utp-plus',
          component: UTPPlusDashboard,
        },
      ],
    },
  ],
})

router.beforeEach((to, _from, next) => {
  const auth = useAuth()
  const isAuthenticated = !!auth.state.user
  const userRole = auth.state.user?.role

  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      // User is not logged in, redirect to login
      const targetRole = to.meta.role as string || ''
      next({
        path: '/login',
        query: {
          role: targetRole,
          redirect: to.fullPath
        }
      })
    } else if (to.meta.role && to.meta.role !== userRole) {
      // Logged in but has wrong role, redirect to appropriate portal
      if (userRole === 'estudiante') next('/estudiante')
      else if (userRole === 'familia') next('/familia')
      else if (userRole === 'postulante') next('/postulante')
      else next('/')
    } else {
      next()
    }
  } else {
    // If logged in and tries to go to login or register, redirect to their portal
    if ((to.path === '/login' || to.path === '/register') && isAuthenticated) {
      if (userRole === 'estudiante') next('/estudiante')
      else if (userRole === 'familia') next('/familia')
      else if (userRole === 'postulante') next('/postulante')
      else next('/')
    } else {
      next()
    }
  }
})

export default router


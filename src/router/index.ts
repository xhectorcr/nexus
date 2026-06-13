import { createRouter, createWebHistory } from 'vue-router'
import RootLayout from '@/layouts/RootLayout.vue'
import LandingPage from '@/pages/landing/LandingPage.vue'
import PostulanteDashboard from '@/pages/postulante/PostulanteDashboard.vue'
import EstudianteDashboard from '@/pages/estudiante/EstudianteDashboard.vue'
import RutaAprendizaje from '@/pages/estudiante/RutaAprendizaje.vue'
import FamiliaDashboard from '@/pages/familia/FamiliaDashboard.vue'
import FamiliaProgreso from '@/pages/familia/FamiliaProgreso.vue'
import UTPPlusDashboard from '@/pages/utp-plus/UTPPlusDashboard.vue'

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
          //Postulante
          path: 'postulante',
          name: 'postulante',
          component: PostulanteDashboard,
        },
        {
          //Estudiante Dashboard
          path: 'estudiante',
          name: 'estudiante',
          component: EstudianteDashboard,
        },
        {
          //Estudiante Ruta
          path: 'estudiante/ruta',
          name: 'estudiante-ruta',
          component: RutaAprendizaje,
        },
        {
          //Padre de familia
          path: 'familia',
          name: 'familia',
          component: FamiliaDashboard,
        },
        {
          //Padre de familia
          path: 'familia/progreso',
          name: 'familia-progreso',
          component: FamiliaProgreso,
        },
        {
          //UTP+ (IA)
          path: 'utp-plus',
          name: 'utp-plus',
          component: UTPPlusDashboard,
        },
      ],
    },
  ],
})

export default router

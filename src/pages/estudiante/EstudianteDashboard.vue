<script setup lang="ts">
import { markRaw } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Home,
  Map as MapIcon,
  BookOpen,
  Clock,
  Star,
  Bell,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-vue-next'

import { useAuth } from '@/lib/auth'
import { api } from '@/lib/api'
import { ref, onMounted } from 'vue'

const auth = useAuth()

const sidebarItems = [
  { icon: markRaw(Home), label: "Inicio", href: "/estudiante" },
  { icon: markRaw(MapIcon), label: "Ruta de Aprendizaje", href: "/estudiante/ruta" },
]

const stats = [
  { label: "Promedio Acumulado", value: "16.5", icon: markRaw(Star), color: "#D4A017" },
  { label: "Créditos Aprobados", value: "45", icon: markRaw(Award), color: "#1565C0" },
  { label: "Cursos Actuales", value: "6", icon: markRaw(BookOpen), color: "#B50E30" },
  { label: "Asistencia Global", value: "92%", icon: markRaw(TrendingUp), color: "#2E7D32" },
]

const upcomingTasks = ref([
  { title: "Entrega de Proyecto Final", course: "Ingeniería de Software", date: "Mañana, 23:59", type: "Tarea", urgent: true },
  { title: "Práctica Calificada 3", course: "Cálculo II", date: "15 Jun, 10:00", type: "Examen", urgent: false },
  { title: "Foro de Discusión", course: "Ética Profesional", date: "16 Jun, 23:59", type: "Foro", urgent: false },
])

const conexionesMentoria = ref<any[]>([])

const fetchEstudianteData = async () => {
  try {
    const estudianteId = 2 // Mocked ID for Estudiante Alejandro
    const conRes = await api.get(`/api/conexiones/estudiante/${estudianteId}`)
    conexionesMentoria.value = conRes.data.data || []
    
    // Si tiene conexiones pendientes, las agregamos como tareas urgentes (Demo)
    if (conexionesMentoria.value.length > 0) {
      upcomingTasks.value.unshift({
        title: `Mentiría solicitada por Postulante #${conexionesMentoria.value[0].postulanteId}`,
        course: "Conexión P2P NEXUS",
        date: "Lo antes posible",
        type: "Mentoría",
        urgent: true
      })
    }
  } catch (e) {
    console.error("Error fetching mentor connections", e)
  }
}

onMounted(() => {
  fetchEstudianteData()
})
</script>

<template>
  <DashboardLayout
    :sidebarItems="sidebarItems"
    title="NEXUS Estudiante"
    subtitle="Tu espacio personal para seguir tu progreso académico"
    :breadcrumbs="[
      { label: 'Inicio' }
    ]"
    moduleColor="#B50E30"
  >
    <div class="space-y-6">
      <!-- Hero Section -->
      <Card class="bg-gradient-to-br from-[#B50E30] to-[#8F0B26] border-0 text-white overflow-hidden relative">
        <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
        <div class="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />
        <CardHeader class="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle class="text-3xl">¡Hola de nuevo, {{ auth.state.user?.name ? auth.state.user.name.split(' ')[0] : 'Estudiante' }}!</CardTitle>
            <CardDescription class="text-white/90 mt-1">
              Tienes 1 tarea importante pendiente para mañana. Mantén el buen ritmo.
            </CardDescription>
          </div>
          <div class="bg-white/10 backdrop-blur-md border border-white/20 p-3.5 rounded-2xl self-start sm:self-auto flex flex-col items-start sm:items-end gap-1 select-all shrink-0">
            <span class="text-[10px] uppercase font-bold text-red-200 tracking-wider">Código de Vinculación Familiar</span>
            <span class="font-mono font-black text-white text-lg tracking-widest">NEX-ALE-2026</span>
          </div>
        </CardHeader>
        <CardContent class="relative z-10 flex gap-4">
          <Button class="bg-white text-[#B50E30] hover:bg-white/90">
            Ver horario de hoy
          </Button>
          <Button variant="outline" class="text-white border-white/20 hover:bg-white/10" @click="$router.push('/estudiante/ruta')">
            Ir a mi Ruta
          </Button>
        </CardContent>
      </Card>

      <!-- Quick Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card v-for="(stat, i) in stats" :key="i">
          <CardContent class="p-6 flex flex-col items-center text-center justify-center">
            <div class="w-12 h-12 rounded-full mb-3 flex items-center justify-center" :style="{ backgroundColor: `${stat.color}15` }">
              <component :is="stat.icon" class="w-6 h-6" :style="{ color: stat.color }" />
            </div>
            <p class="text-3xl font-bold text-[#1F1F1F]">{{ stat.value }}</p>
            <p class="text-xs text-[#5F6368] mt-1 uppercase tracking-wide font-medium">{{ stat.label }}</p>
          </CardContent>
        </Card>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
          <!-- Upcoming Tasks -->
          <Card>
            <CardHeader class="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle class="text-lg flex items-center gap-2">
                  <Bell class="w-5 h-5 text-[#B50E30]" />
                  Próximas Entregas
                </CardTitle>
                <CardDescription>Tus actividades académicas más cercanas</CardDescription>
              </div>
              <Button variant="ghost" size="sm" class="text-[#B50E30]">
                Ver calendario
                <ChevronRight class="w-4 h-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div class="space-y-4 mt-2">
                <div v-for="(task, i) in upcomingTasks" :key="i" class="flex items-start gap-4 p-3 rounded-lg border border-[#D9D9D9] hover:border-[#B50E30] hover:shadow-sm transition-all bg-white">
                  <div :class="`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${task.urgent ? 'bg-[#B50E30]/10' : 'bg-[#F1F1F1]'}`">
                    <Clock :class="`w-5 h-5 ${task.urgent ? 'text-[#B50E30]' : 'text-[#5F6368]'}`" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between mb-1">
                      <h4 class="font-medium text-[#1F1F1F] truncate">{{ task.title }}</h4>
                      <Badge :variant="task.urgent ? 'default' : 'secondary'" :class="task.urgent ? 'bg-[#B50E30] text-white' : ''">
                        {{ task.type }}
                      </Badge>
                    </div>
                    <p class="text-sm text-[#5F6368]">{{ task.course }}</p>
                    <p :class="`text-xs font-medium mt-1 ${task.urgent ? 'text-[#B50E30]' : 'text-[#5F6368]'}`">
                      Vence: {{ task.date }}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Current Route Progress -->
          <Card>
            <CardHeader>
              <CardTitle class="text-lg flex items-center gap-2">
                <MapIcon class="w-5 h-5 text-[#B50E30]" />
                Progreso en tu Ruta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div class="p-4 rounded-xl border border-[#B50E30]/20 bg-[#B50E30]/5">
                <div class="flex items-center justify-between mb-2">
                  <h4 class="font-medium text-[#B50E30]">Módulo 1: Fundamentos de Programación</h4>
                  <span class="text-sm font-bold text-[#B50E30]">72%</span>
                </div>
                <Progress :value="72" class="h-2 mb-4 bg-white" />
                <p class="text-sm text-[#5F6368] mb-4">Te faltan 2 actividades para desbloquear el siguiente módulo.</p>
                <Button class="bg-[#B50E30] hover:bg-[#8F0B26] text-white" @click="$router.push('/estudiante/ruta')">
                  Continuar ruta
                </Button>
              </div>
            </CardContent>
          </Card>
      </div>
    </div>
  </DashboardLayout>
</template>

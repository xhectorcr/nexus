<script setup lang="ts">
import { markRaw } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Home,
  TrendingUp,
  FileText,
  MessageSquare,
  Heart,
  CheckCircle2,
  Clock,
  Target,
  BarChart3,
  Calendar,
  Bell,
  Star,
  ChevronRight,
} from 'lucide-vue-next'

const moduleProgress = [
  { name: "Autoconocimiento", pct: 80, status: "completed", color: "#2E7D32" },
  { name: "Intereses Profesionales", pct: 60, status: "in_progress", color: "#D4A017" },
  { name: "Inteligencias Múltiples", pct: 100, status: "completed", color: "#2E7D32" },
  { name: "Personalidad y Aptitudes", pct: 50, status: "in_progress", color: "#D4A017" },
  { name: "Simulador de Carreras", pct: 0, status: "pending", color: "#9ca3af" },
  { name: "Proyecto Final de Vocación", pct: 20, status: "in_progress", color: "#D4A017" },
]

const statusConfig: Record<string, any> = {
  completed: { label: "Completado", bg: "bg-green-100", text: "text-green-700", dot: "#16a34a" },
  in_progress: { label: "En progreso", bg: "bg-yellow-100", text: "text-yellow-700", dot: "#D4A017" },
  pending: { label: "Pendiente", bg: "bg-gray-100", text: "text-gray-500", dot: "#9ca3af" },
}

const stats = [
  { label: "Horas estudiadas", value: "8.5h", icon: markRaw(Clock), color: "#1565C0" },
  { label: "Módulos completados", value: "2 / 6", icon: markRaw(CheckCircle2), color: "#2E7D32" },
  { label: "Actividades pendientes", value: "5", icon: markRaw(Target), color: "#F9A825" },
  { label: "Promedio evaluaciones", value: "8.4", icon: markRaw(Star), color: "#D4A017" },
]

const timeline = [
  { event: "Completó el Quiz de Intereses Profesionales", time: "hace 2 horas", icon: markRaw(CheckCircle2), color: "#2E7D32" },
  { event: "Vio el video introductorio de Personalidad", time: "hace 5 horas", icon: markRaw(Clock), color: "#1565C0" },
  { event: "Ganó la insignia 'Explorador'", time: "ayer", icon: markRaw(Star), color: "#D4A017" },
  { event: "Completó el módulo de Inteligencias Múltiples", time: "hace 3 días", icon: markRaw(CheckCircle2), color: "#2E7D32" },
]

const sidebarItems = [
  { icon: markRaw(Home), label: "Inicio", href: "/familia" },
  { icon: markRaw(TrendingUp), label: "Progreso de tu hijo", href: "/familia/progreso" },
  { icon: markRaw(FileText), label: "Recursos" },
  { icon: markRaw(MessageSquare), label: "Foro" },
  { icon: markRaw(Heart), label: "Bienestar" },
]

const overallPct = Math.round(moduleProgress.reduce((s, m) => s + m.pct, 0) / moduleProgress.length)
</script>

<template>
  <DashboardLayout
    :sidebarItems="sidebarItems"
    title="NEXUS Familia"
    subtitle="Progreso de tu hijo — sincronización en tiempo real"
    :breadcrumbs="[
      { label: 'Inicio', href: '/' },
      { label: 'Familia', href: '/familia' },
      { label: 'Progreso' },
    ]"
    moduleColor="#D4A017"
  >
    <div class="space-y-5">
      <!-- Student summary hero -->
      <Card class="border-0 overflow-hidden" style="background: linear-gradient(135deg, #D4A017 0%, #B8870F 50%, #1565C0 100%)">
        <CardContent class="p-6">
          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div class="relative">
              <Avatar class="w-20 h-20 ring-4 ring-white/30 shadow-xl">
                <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop" />
                <AvatarFallback class="bg-white/20 text-white text-xl">AL</AvatarFallback>
              </Avatar>
              <div class="absolute -bottom-1 -right-1 bg-white text-[#D4A017] text-xs font-bold px-2 py-0.5 rounded-full shadow">
                Nv.3
              </div>
            </div>
            <div class="text-white flex-1">
              <p class="text-white/70 text-sm">Estudiante</p>
              <h1 class="text-2xl font-bold">Alejandro Lastra Torres</h1>
              <p class="text-white/80 text-sm mt-0.5">Carrera sugerida por IA: <span class="font-semibold text-white">Ingeniería de Sistemas</span></p>
            </div>
            <div class="text-right text-white">
              <div class="text-5xl font-bold">{{ overallPct }}%</div>
              <p class="text-white/70 text-sm">progreso total</p>
              <Badge class="mt-2 bg-white/20 text-white border-0">🔥 12 días seguidos</Badge>
            </div>
          </div>

          <!-- Big progress bar -->
          <div class="mt-5">
            <div class="flex justify-between text-sm text-white/80 mb-2">
              <span>Progreso General de la Ruta de Aprendizaje</span>
              <span class="font-semibold">{{ overallPct }}%</span>
            </div>
            <div class="w-full bg-white/20 rounded-full h-4 overflow-hidden">
              <div
                class="h-4 rounded-full transition-all duration-700 relative overflow-hidden"
                :style="{ width: `${overallPct}%`, background: 'linear-gradient(90deg, #ffffff40, #ffffff)' }"
              >
                <div class="absolute inset-0 bg-gradient-to-r from-transparent to-white/30 animate-pulse" />
              </div>
            </div>
            <div class="flex justify-between text-xs text-white/60 mt-1.5">
              <span>0%</span>
              <span>Ruta completada: 100%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Quick stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card v-for="(s, i) in stats" :key="i">
          <CardContent class="p-4">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center" :style="{ backgroundColor: `${s.color}15` }">
                <component :is="s.icon" class="w-4 h-4" :style="{ color: s.color }" />
              </div>
            </div>
            <div class="text-2xl font-bold">{{ s.value }}</div>
            <div class="text-xs text-muted-foreground mt-0.5 leading-tight">{{ s.label }}</div>
          </CardContent>
        </Card>
      </div>

      <!-- Module breakdown + activity feed -->
      <div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
        <!-- Module bars -->
        <Card>
          <CardHeader class="pb-3 pt-5 px-5">
            <div class="flex items-center justify-between">
              <div>
                <CardTitle class="flex items-center gap-2">
                  <BarChart3 class="w-4 h-4 text-[#D4A017]" />
                  Progreso de tu hijo
                </CardTitle>
                <CardDescription>Desglose por módulo — actualización automática</CardDescription>
              </div>
              <div class="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                <div class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                Sincronizado
              </div>
            </div>
          </CardHeader>
          <CardContent class="px-5 pb-5 space-y-5">
            <div v-for="mod in moduleProgress" :key="mod.name">
              <div class="flex items-center justify-between mb-1.5">
                <div class="flex items-center gap-2">
                  <span class="text-sm font-medium">{{ mod.name }}</span>
                  <span :class="`text-xs px-2 py-0.5 rounded-full ${statusConfig[mod.status].bg} ${statusConfig[mod.status].text}`">
                    {{ statusConfig[mod.status].label }}
                  </span>
                </div>
                <span class="text-sm font-bold" :style="{ color: mod.color === '#9ca3af' ? '#9ca3af' : mod.color }">
                  {{ mod.pct }}%
                </span>
              </div>
              <div class="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                  class="h-3 rounded-full transition-all duration-700"
                  :style="{ width: `${mod.pct}%`, backgroundColor: mod.color }"
                />
              </div>
            </div>

            <!-- Legend -->
            <div class="flex items-center gap-4 pt-2 border-t border-border">
              <div v-for="s in ['completed', 'in_progress', 'pending']" :key="s" class="flex items-center gap-1.5">
                <div class="w-2.5 h-2.5 rounded-full" :style="{ backgroundColor: statusConfig[s].dot }" />
                <span class="text-xs text-muted-foreground">{{ statusConfig[s].label }}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Right column -->
        <div class="space-y-4">
          <!-- Last activity -->
          <Card class="border-[#2E7D32]/20 bg-green-50/50">
            <CardHeader class="pb-2 pt-4 px-4">
              <CardTitle class="text-sm flex items-center gap-2">
                <Bell class="w-4 h-4 text-[#2E7D32]" />
                Última actividad realizada
              </CardTitle>
            </CardHeader>
            <CardContent class="px-4 pb-4">
              <p class="text-sm font-medium text-green-800">
                Completó el Quiz de Intereses Profesionales
              </p>
              <p class="text-xs text-green-600 mt-1">hace 2 horas</p>
            </CardContent>
          </Card>

          <!-- Next objective -->
          <Card class="border-[#D4A017]/20 bg-amber-50/50">
            <CardHeader class="pb-2 pt-4 px-4">
              <CardTitle class="text-sm flex items-center gap-2">
                <Target class="w-4 h-4 text-[#D4A017]" />
                Próximo objetivo
              </CardTitle>
            </CardHeader>
            <CardContent class="px-4 pb-4">
              <p class="text-sm font-medium text-amber-800">
                Completar la actividad práctica del módulo Personalidad
              </p>
              <p class="text-xs text-amber-600 mt-1">Estimado: 30 minutos</p>
            </CardContent>
          </Card>

          <!-- Estimated completion -->
          <Card>
            <CardContent class="p-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-[#1565C0]/10 rounded-xl flex items-center justify-center">
                  <Calendar class="w-5 h-5 text-[#1565C0]" />
                </div>
                <div>
                  <p class="text-xs text-muted-foreground">Fecha estimada de finalización</p>
                  <p class="text-sm font-semibold">15 de Agosto, 2026</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Activity timeline -->
          <Card>
            <CardHeader class="pb-2 pt-4 px-4">
              <CardTitle class="text-sm">Actividad reciente</CardTitle>
            </CardHeader>
            <CardContent class="px-4 pb-4">
              <div class="space-y-3">
                <div v-for="(t, i) in timeline" :key="i" class="flex items-start gap-2.5">
                  <div
                    class="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    :style="{ backgroundColor: `${t.color}15` }"
                  >
                    <component :is="t.icon" class="w-3.5 h-3.5" :style="{ color: t.color }" />
                  </div>
                  <div>
                    <p class="text-xs font-medium leading-snug">{{ t.event }}</p>
                    <p class="text-xs text-muted-foreground">{{ t.time }}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- See full path -->
          <Button variant="outline" class="w-full gap-2 text-sm">
            Ver Ruta de Aprendizaje completa
            <ChevronRight class="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

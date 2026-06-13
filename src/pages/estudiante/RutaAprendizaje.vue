<script setup lang="ts">
import { ref, markRaw } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Home,
  Map as MapIcon,
  BookOpen,
  Trophy,
  Star,
  Lock,
  CheckCircle2,
  Circle,
  PlayCircle,
  Clock,
  Zap,
  Brain,
  Target,
  Heart,
  Gamepad2,
  ArrowLeft,
  Award,
  Flame,
  TrendingUp,
} from 'lucide-vue-next'
import ModuleDetail from '@/components/ruta/ModuleDetail.vue'

const modules = [
  {
    id: 1,
    title: "Autoconocimiento y Exploración Vocacional",
    description: "Descúbrete a ti mismo y tus fortalezas únicas",
    icon: Heart,
    color: "#B50E30",
    status: "available",
    progress: 72,
    duration: "3 horas",
    activities: 6,
    completedActivities: 4,
    xp: 250,
    badge: "Explorador",
    position: { x: 10, side: "left" },
  },
  {
    id: 2,
    title: "Inteligencias Múltiples",
    description: "Identifica tu tipo de inteligencia dominante",
    icon: Brain,
    color: "#1565C0",
    status: "locked",
    progress: 0,
    duration: "2.5 horas",
    activities: 5,
    completedActivities: 0,
    xp: 200,
    badge: "Pensador",
    position: { x: 55, side: "right" },
  },
  {
    id: 3,
    title: "Intereses Profesionales",
    description: "Mapea tus pasiones hacia oportunidades reales",
    icon: Target,
    color: "#B50E30",
    status: "locked",
    progress: 0,
    duration: "2 horas",
    activities: 5,
    completedActivities: 0,
    xp: 180,
    badge: "Visionario",
    position: { x: 10, side: "left" },
  },
  {
    id: 4,
    title: "Personalidad y Aptitudes",
    description: "Test MBTI adaptado al contexto universitario peruano",
    icon: Zap,
    color: "#D4A017",
    status: "locked",
    progress: 0,
    duration: "3 horas",
    activities: 6,
    completedActivities: 0,
    xp: 220,
    badge: "Estratega",
    position: { x: 55, side: "right" },
  },
  {
    id: 5,
    title: "Simulador de Carreras",
    description: "Vive un día como profesional de diferentes campos",
    icon: Gamepad2,
    color: "#1565C0",
    status: "locked",
    progress: 0,
    duration: "4 horas",
    activities: 7,
    completedActivities: 0,
    xp: 300,
    badge: "Simulador",
    position: { x: 10, side: "left" },
  },
  {
    id: 6,
    title: "Proyecto Final de Vocación",
    description: "Consolida tu decisión con un plan de vida universitario",
    icon: Star,
    color: "#B50E30",
    status: "locked",
    progress: 0,
    duration: "5 horas",
    activities: 8,
    completedActivities: 0,
    xp: 500,
    badge: "Vocation Master",
    position: { x: 55, side: "right" },
  },
]

const badges = [
  { name: "Explorador", icon: "🧭", earned: true },
  { name: "Constante", icon: "🔥", earned: true },
  { name: "Pensador", icon: "🧠", earned: false },
  { name: "Visionario", icon: "👁️", earned: false },
]

const sidebarItems = [
  { icon: markRaw(Home), label: "Inicio", href: "/postulante" },
  { icon: markRaw(MapIcon), label: "Ruta de Aprendizaje", href: "/ruta" },
  { icon: markRaw(BookOpen), label: "Bitácora Digital" },
  { icon: markRaw(Trophy), label: "Logros" },
  { icon: markRaw(Gamepad2), label: "Laberinto Vocacional" },
]

const selectedModule = ref<any>(null)
const totalProgress = 72 / 6
</script>

<template>
  <DashboardLayout
    v-if="selectedModule"
    :sidebarItems="sidebarItems"
    title="NEXUS Postulante"
    subtitle="Ruta de Aprendizaje"
    :breadcrumbs="[
      { label: 'Inicio', href: '/' },
      { label: 'Postulante', href: '/postulante' },
      { label: 'Ruta de Aprendizaje', href: '/ruta' },
      { label: selectedModule.title },
    ]"
    moduleColor="#B50E30"
  >
    <div class="mb-4">
      <Button
        variant="ghost"
        @click="selectedModule = null"
        class="flex items-center gap-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft class="w-4 h-4" />
        Volver a la Ruta
      </Button>
    </div>
    <ModuleDetail :module="selectedModule" />
  </DashboardLayout>

  <DashboardLayout
    v-else
    :sidebarItems="sidebarItems"
    title="NEXUS Postulante"
    subtitle="Tu ruta personalizada hacia la vocación perfecta"
    :breadcrumbs="[
      { label: 'Inicio', href: '/' },
      { label: 'Postulante', href: '/postulante' },
      { label: 'Ruta de Aprendizaje' },
    ]"
    moduleColor="#B50E30"
  >
    <div class="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
      <!-- Left: Map + Modules -->
      <div class="space-y-4">
        <!-- Student Header Card -->
        <Card class="border-0 overflow-hidden" style="background: linear-gradient(135deg, #B50E30 0%, #8F0B26 60%, #1565C0 100%)">
          <CardContent class="p-5">
            <div class="flex items-center gap-4">
              <div class="relative">
                <Avatar class="w-16 h-16 ring-2 ring-white/40">
                  <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop" />
                  <AvatarFallback class="bg-white/20 text-white">AL</AvatarFallback>
                </Avatar>
                <div class="absolute -bottom-1 -right-1 bg-[#D4A017] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  Nv.3
                </div>
              </div>
              <div class="flex-1 text-white">
                <p class="text-white/70 text-xs">Bienvenido de vuelta</p>
                <h2 class="font-semibold text-lg leading-tight">Alejandro Lastra</h2>
                <div class="flex items-center gap-1.5 mt-1">
                  <Zap class="w-3.5 h-3.5 text-[#D4A017]" />
                  <span class="text-[#D4A017] text-xs font-medium">IA sugiere: Ingeniería de Sistemas</span>
                </div>
              </div>
              <div class="text-right text-white">
                <div class="text-2xl font-bold">72%</div>
                <div class="text-white/60 text-xs">completado</div>
                <div class="flex items-center justify-end gap-1 mt-1.5">
                  <Flame class="w-3.5 h-3.5 text-orange-400" />
                  <span class="text-xs text-orange-300">12 días seguidos</span>
                </div>
              </div>
            </div>

            <div class="mt-4">
              <div class="flex justify-between text-xs text-white/70 mb-1.5">
                <span>Progreso General</span>
                <span>{{ Math.round(totalProgress) }}% total</span>
              </div>
              <div class="w-full bg-white/20 rounded-full h-2">
                <div
                  class="h-2 rounded-full transition-all duration-700"
                  :style="{ width: `${totalProgress}%`, background: 'linear-gradient(90deg, #D4A017, #F0C040)' }"
                />
              </div>
            </div>

            <div class="flex gap-2 mt-3">
              <div
                v-for="b in badges"
                :key="b.name"
                :title="b.name"
                :class="`text-lg w-8 h-8 flex items-center justify-center rounded-full ${
                  b.earned ? 'bg-white/20' : 'bg-white/5 grayscale opacity-40'
                }`"
              >
                {{ b.icon }}
              </div>
              <div class="ml-auto">
                <Badge class="bg-white/20 text-white border-0 text-xs">
                  <TrendingUp class="w-3 h-3 mr-1" />
                  450 XP
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Path Map -->
        <Card class="border border-border overflow-hidden">
          <CardHeader class="pb-3 pt-5 px-5">
            <div class="flex items-center justify-between">
              <div>
                <CardTitle class="flex items-center gap-2">
                  <MapIcon class="w-5 h-5 text-[#B50E30]" />
                  Ruta de Aprendizaje Vocacional
                </CardTitle>
                <p class="text-sm text-muted-foreground mt-0.5">Completa cada módulo para desbloquear el siguiente</p>
              </div>
              <Badge variant="outline" class="text-[#B50E30] border-[#B50E30]/30">
                1 / 6 módulos
              </Badge>
            </div>
          </CardHeader>
          <CardContent class="px-5 pb-6">
            <div class="relative min-h-[700px]">
              <!-- Background dots grid -->
              <div
                class="absolute inset-0 rounded-xl"
                style="background-image: radial-gradient(circle, #D9D9D9 1px, transparent 1px); background-size: 28px 28px;"
              />

              <!-- Path SVG -->
              <svg
                class="absolute inset-0 w-full h-full"
                viewBox="0 0 400 700"
                preserveAspectRatio="none"
                style="z-index: 1;"
              >
                <path
                  d="M 80 80 C 80 130, 200 130, 200 180 C 200 230, 320 230, 320 280 C 320 330, 200 330, 200 380 C 200 430, 80 430, 80 480 C 80 530, 200 530, 200 580 C 200 620, 320 620, 320 650"
                  fill="none"
                  stroke="#e5e7eb"
                  stroke-width="6"
                  stroke-dasharray="0"
                />
                <path
                  d="M 80 80 C 80 130, 200 130, 200 180"
                  fill="none"
                  stroke="#B50E30"
                  stroke-width="6"
                  stroke-linecap="round"
                />
                <circle v-for="(d, i) in [{ cx: 80, cy: 80 }, { cx: 320, cy: 280 }, { cx: 80, cy: 480 }, { cx: 320, cy: 650 }]" :key="i" :cx="d.cx" :cy="d.cy" r="4" fill="#D9D9D9" />
              </svg>

              <!-- Module Cards -->
              <div class="relative z-10 space-y-12 py-2">
                <div v-for="(mod, idx) in modules" :key="mod.id" :class="`flex ${idx % 2 === 0 ? 'justify-start' : 'justify-end'} relative`">
                  <div
                    class="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow z-20"
                    :style="{
                      left: idx % 2 === 0 ? 'calc(50% - 8px)' : undefined,
                      right: idx % 2 === 0 ? undefined : 'calc(50% - 8px)',
                      backgroundColor: mod.status === 'available' ? mod.color : '#9ca3af',
                    }"
                  />

                  <div
                    :class="`w-[45%] transition-all duration-200 ${
                      mod.status === 'available' ? 'hover:scale-[1.02] cursor-pointer' : 'opacity-60 cursor-not-allowed'
                    }`"
                    @click="mod.status === 'available' && (selectedModule = mod)"
                  >
                    <div
                      class="rounded-2xl border bg-card shadow-sm overflow-hidden"
                      :style="{
                        borderColor: mod.status === 'available' ? `${mod.color}40` : '#e5e7eb',
                        boxShadow: mod.status === 'available' ? `0 4px 20px ${mod.color}18` : undefined,
                      }"
                    >
                      <!-- Top accent strip -->
                      <div class="h-1" :style="{ backgroundColor: mod.status === 'available' ? mod.color : '#e5e7eb' }" />

                      <div class="p-4">
                        <div class="flex items-start justify-between mb-3">
                          <div
                            class="w-10 h-10 rounded-xl flex items-center justify-center"
                            :style="{ backgroundColor: mod.status === 'available' ? `${mod.color}15` : '#f3f4f6' }"
                          >
                            <component :is="mod.icon" class="w-5 h-5" :style="{ color: mod.status === 'available' ? mod.color : '#9ca3af' }" />
                          </div>
                          <div v-if="mod.status !== 'available'" class="bg-gray-100 rounded-lg p-1.5">
                            <Lock class="w-3.5 h-3.5 text-gray-400" />
                          </div>
                          <Badge v-if="mod.status === 'available' && mod.progress > 0" class="text-xs border-0" :style="{ backgroundColor: `${mod.color}15`, color: mod.color }">
                            {{ mod.progress }}%
                          </Badge>
                        </div>

                        <div class="mb-1 flex items-center gap-1.5">
                          <span class="text-xs text-muted-foreground">#{{ idx + 1 }}</span>
                        </div>
                        <h3 :class="`text-sm font-semibold leading-tight mb-1 ${mod.status !== 'available' ? 'text-muted-foreground' : ''}`">
                          {{ mod.title }}
                        </h3>
                        <p class="text-xs text-muted-foreground leading-relaxed">
                          {{ mod.status === 'available' ? mod.description : 'Completa el módulo anterior para desbloquear este contenido.' }}
                        </p>

                        <template v-if="mod.status === 'available'">
                          <div v-if="mod.progress > 0" class="mt-3 mb-2">
                            <Progress :value="mod.progress" class="h-1.5" />
                          </div>
                          <div class="flex items-center justify-between mt-3">
                            <div class="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock class="w-3 h-3" />
                              {{ mod.duration }}
                            </div>
                            <Button
                              size="sm"
                              class="h-7 text-xs px-3 text-white"
                              :style="{ backgroundColor: mod.color }"
                            >
                              {{ mod.progress > 0 ? "Continuar" : "Comenzar" }}
                              <ChevronRight class="w-3 h-3 ml-0.5" />
                            </Button>
                          </div>
                        </template>

                        <div v-else class="flex items-center gap-1 mt-3">
                          <Lightbulb class="w-3 h-3 text-muted-foreground" />
                          <span class="text-xs text-muted-foreground">{{ mod.duration }} · {{ mod.activities }} actividades</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Right Sidebar -->
      <div class="space-y-4">
        <!-- Continue Card -->
        <Card class="border border-[#B50E30]/20 bg-[#B50E30]/3">
          <CardContent class="p-4">
            <div class="flex items-center gap-2 mb-3">
              <div class="w-8 h-8 bg-[#B50E30] rounded-lg flex items-center justify-center">
                <PlayCircle class="w-4 h-4 text-white" />
              </div>
              <div>
                <p class="text-xs text-muted-foreground">Continuar donde lo dejaste</p>
                <p class="text-sm font-semibold">Autoconocimiento</p>
              </div>
            </div>
            <div class="mb-3">
              <div class="flex justify-between text-xs mb-1">
                <span class="text-muted-foreground">Actividad 4 de 6</span>
                <span class="text-[#B50E30] font-medium">72%</span>
              </div>
              <Progress :value="72" class="h-2" />
            </div>
            <Button class="w-full bg-[#B50E30] hover:bg-[#8F0B26] text-white text-sm gap-2">
              <PlayCircle class="w-4 h-4" />
              Continuar
            </Button>
          </CardContent>
        </Card>

        <!-- Stats -->
        <Card>
          <CardContent class="p-4 grid grid-cols-2 gap-3">
            <div v-for="s in [
              { label: 'Horas estudiadas', value: '8.5h', icon: Clock, color: '#1565C0' },
              { label: 'Módulos completados', value: '1', icon: CheckCircle2, color: '#2E7D32' },
              { label: 'Actividades pendientes', value: '2', icon: Circle, color: '#F9A825' },
              { label: 'Promedio evaluaciones', value: '8.4', icon: Star, color: '#D4A017' },
            ]" :key="s.label" class="bg-secondary/50 rounded-xl p-3">
              <component :is="s.icon" class="w-4 h-4 mb-1.5" :style="{ color: s.color }" />
              <div class="font-bold text-lg leading-none">{{ s.value }}</div>
              <div class="text-xs text-muted-foreground mt-0.5 leading-tight">{{ s.label }}</div>
            </div>
          </CardContent>
        </Card>

        <!-- Module Overview -->
        <Card>
          <CardHeader class="pb-2 pt-4 px-4">
            <CardTitle class="text-sm">Estado de Módulos</CardTitle>
          </CardHeader>
          <CardContent class="px-4 pb-4 space-y-2">
            <div v-for="m in modules" :key="m.id" class="flex items-center gap-2.5">
              <div
                class="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                :style="{ background: m.status === 'available' ? m.color : '#e5e7eb' }"
              >
                <CheckCircle2 v-if="m.status === 'available'" class="w-3.5 h-3.5 text-white" />
                <Lock v-else class="w-3 h-3 text-gray-400" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-medium truncate">{{ m.title.split(' ').slice(0, 3).join(' ') }}</p>
                <div v-if="m.status === 'available' && m.progress > 0" class="w-full bg-gray-100 rounded-full h-1 mt-0.5">
                  <div
                    class="h-1 rounded-full"
                    :style="{ width: `${m.progress}%`, backgroundColor: m.color }"
                  />
                </div>
              </div>
              <span class="text-xs text-muted-foreground flex-shrink-0">
                {{ m.status === 'available' ? `${m.progress}%` : '—' }}
              </span>
            </div>
          </CardContent>
        </Card>

        <!-- Next objective -->
        <Card class="border-[#D4A017]/30 bg-amber-50/50">
          <CardContent class="p-4">
            <div class="flex items-start gap-3">
              <div class="w-8 h-8 bg-[#D4A017] rounded-lg flex items-center justify-center flex-shrink-0">
                <Target class="w-4 h-4 text-white" />
              </div>
              <div>
                <p class="text-xs text-[#D4A017] font-semibold uppercase tracking-wide">Próximo objetivo</p>
                <p class="text-sm font-medium mt-0.5">Completar el Minijuego de Autoconocimiento</p>
                <p class="text-xs text-muted-foreground mt-1">+50 XP al completar</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Estimated completion -->
        <Card>
          <CardContent class="p-4 flex items-center gap-3">
            <div class="w-8 h-8 bg-[#1565C0]/10 rounded-lg flex items-center justify-center">
              <Award class="w-4 h-4 text-[#1565C0]" />
            </div>
            <div>
              <p class="text-xs text-muted-foreground">Fecha estimada de finalización</p>
              <p class="text-sm font-semibold">15 de Agosto, 2026</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </DashboardLayout>
</template>

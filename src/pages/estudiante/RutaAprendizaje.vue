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
    title: "Fundamentos de Programación",
    description: "Lógica básica y estructuras de control",
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
    title: "Algoritmos y Estructuras de Datos",
    description: "Optimización y manejo eficiente de información",
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
    title: "Arquitectura de Computadoras",
    description: "Entiende el hardware y sistemas operativos",
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
    title: "Bases de Datos Relacionales",
    description: "Diseño y modelado de datos con SQL",
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
    title: "Ingeniería de Software",
    description: "Metodologías ágiles y ciclo de vida del software",
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
    title: "Desarrollo Web Full-Stack",
    description: "Construcción de aplicaciones web modernas",
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
  { icon: markRaw(Home), label: "Inicio", href: "/estudiante" },
  { icon: markRaw(MapIcon), label: "Ruta de Aprendizaje", href: "/estudiante/ruta" },
]

const selectedModule = ref<any>(null)
const totalProgress = 72 / 6
</script>

<template>
  <DashboardLayout
    v-if="selectedModule"
    :sidebarItems="sidebarItems"
    title="NEXUS Estudiante"
    subtitle="Ruta de Aprendizaje"
    :breadcrumbs="[
      { label: 'Inicio', href: '/estudiante' },
      { label: 'Ruta de Aprendizaje', href: '/estudiante/ruta' },
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
    title="NEXUS Estudiante"
    subtitle="Tu ruta personalizada hacia la vocación perfecta"
    :breadcrumbs="[
      { label: 'Inicio', href: '/estudiante' },
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
                  <GraduationCap class="w-3.5 h-3.5 text-[#D4A017]" />
                  <span class="text-[#D4A017] text-xs font-medium">Ingeniería de Sistemas - V Ciclo</span>
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
        <Card class="border-0 overflow-hidden bg-[#121826] text-white shadow-xl">
          <CardHeader class="pb-3 pt-5 px-5 border-b border-white/10 relative z-10 bg-[#121826]">
            <div class="flex items-center justify-between">
              <div>
                <CardTitle class="flex items-center gap-2 text-white">
                  <MapIcon class="w-5 h-5 text-[#B50E30]" />
                  Ruta de Aprendizaje Académico
                </CardTitle>
                <p class="text-sm text-white/50 mt-0.5 font-mono">Completa cada módulo para desbloquear el siguiente</p>
              </div>
              <Badge variant="outline" class="text-white border-white/20 bg-white/5">
                1 / 6 módulos
              </Badge>
            </div>
          </CardHeader>
          <CardContent class="px-0 pb-0 bg-[#121826]">
            <div class="relative min-h-[800px] w-full overflow-hidden">
              <!-- Background grid (optional cyber look) -->
              <div
                class="absolute inset-0"
                style="background-image: linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px); background-size: 30px 30px;"
              />

              <!-- Path Lines SVG -->
              <svg class="absolute inset-0 w-full h-full pointer-events-none z-0">
                <defs>
                  <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  <linearGradient id="line-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#EF4444" />
                    <stop offset="100%" stop-color="#991B1B" />
                  </linearGradient>
                </defs>
                <line
                  v-for="i in modules.length - 1"
                  :key="'line-'+i"
                  :x1="((i - 1) % 2 === 0) ? '35%' : '65%'"
                  :y1="`${100 * ((i - 1) + 0.5) / modules.length}%`"
                  :x2="(i % 2 === 0) ? '35%' : '65%'"
                  :y2="`${100 * (i + 0.5) / modules.length}%`"
                  :stroke="modules[i-1].status === 'available' && modules[i].status === 'available' ? '#EF4444' : (modules[i-1].status === 'available' ? '#991B1B' : '#374151')"
                  stroke-width="3"
                  :stroke-dasharray="modules[i-1].status === 'available' && modules[i].status === 'available' ? '8 6' : '0'"
                  :class="modules[i-1].status === 'available' && modules[i].status === 'available' ? 'animate-[dash_2s_linear_infinite]' : ''"
                  stroke-linecap="round"
                />
              </svg>

              <!-- Modules -->
              <div class="relative z-10 w-full h-full flex flex-col justify-between py-12" :style="{ minHeight: `${modules.length * 150}px` }">
                <div v-for="(mod, idx) in modules" :key="mod.id" class="flex-1 flex items-center relative w-full">
                  <div
                    class="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group"
                    :class="mod.status === 'available' ? 'cursor-pointer' : 'cursor-not-allowed'"
                    :style="{
                      left: idx % 2 === 0 ? '35%' : '65%',
                      top: '50%'
                    }"
                    @click="mod.status === 'available' && (selectedModule = mod)"
                  >
                    <!-- Current Module Indicator -->
                    <div v-if="mod.status === 'available' && mod.progress > 0 && mod.progress < 100" class="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#EF4444] text-white text-[11px] font-bold px-3 py-1.5 rounded shadow-lg shadow-red-500/30 whitespace-nowrap z-30 tracking-wide uppercase transition-transform group-hover:-translate-y-2">
                      Continuar Ruta
                      <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-[#EF4444]"></div>
                    </div>

                    <!-- Isometric Platform SVG -->
                    <div class="relative z-20">
                      <svg width="150" height="120" viewBox="0 0 150 120" class="drop-shadow-2xl overflow-visible">
                        <g>
                          <!-- Base Shadow -->
                          <ellipse cx="75" cy="100" rx="45" ry="15" fill="black" fill-opacity="0.5" class="transition-transform duration-500 group-hover:scale-90 opacity-60" />
                          
                          <!-- Lower Base Platform (Fixed) -->
                          <g class="transform translate-y-6">
                            <polygon points="75,30 135,60 75,90 15,60" fill="#1F2937" />
                            <polygon points="15,60 75,90 75,100 15,70" fill="#111827" />
                            <polygon points="75,90 135,60 135,70 75,100" fill="#030712" />
                            <polygon points="75,30 135,60 75,90 15,60" fill="none" stroke="#374151" stroke-width="1" />
                          </g>

                          <!-- Connecting Beam (if available) -->
                          <polygon v-if="mod.status === 'available'" points="65,40 85,40 85,90 65,90" fill="#EF4444" opacity="0.15" filter="url(#glow-red)" />
                          <polygon v-if="mod.status === 'available'" points="70,40 80,40 80,90 70,90" fill="#EF4444" opacity="0.3" />

                          <!-- Floating Top Layer (Animates on hover) -->
                          <g :class="`transition-all duration-500 ease-out ${mod.status === 'available' ? 'group-hover:-translate-y-4' : 'opacity-60'}`">
                            <!-- Top Face -->
                            <polygon points="75,10 135,40 75,70 15,40" :fill="mod.status === 'available' ? '#EF4444' : '#4B5563'" />
                            <polygon points="75,10 135,40 75,70 15,40" fill="white" fill-opacity="0.1" />
                            <!-- Inner Diamond Pattern -->
                            <polygon v-if="mod.status === 'available'" points="75,22 120,44 75,66 30,44" fill="none" stroke="#FECACA" stroke-width="1.5" opacity="0.6" />
                            <polygon v-if="mod.status === 'available'" points="75,30 105,45 75,60 45,45" :fill="'#B91C1C'" opacity="0.4" />
                            
                            <!-- Left Face -->
                            <polygon points="15,40 75,70 75,80 15,50" :fill="mod.status === 'available' ? '#DC2626' : '#374151'" />
                            <polygon points="15,40 75,70 75,80 15,50" fill="black" fill-opacity="0.2" />
                            
                            <!-- Right Face -->
                            <polygon points="75,70 135,40 135,50 75,80" :fill="mod.status === 'available' ? '#B91C1C' : '#1F2937'" />
                            <polygon points="75,70 135,40 135,50 75,80" fill="black" fill-opacity="0.4" />
                            
                            <!-- Top Edge Highlights -->
                            <polyline v-if="mod.status === 'available'" points="15,40 75,70 135,40" fill="none" stroke="#FECACA" stroke-width="2" opacity="0.9" />
                          </g>
                        </g>
                      </svg>
                    </div>

                    <!-- Text Label next to the node -->
                    <div
                      class="absolute whitespace-nowrap top-[45%] -translate-y-1/2 transition-transform duration-500"
                      :class="[
                        idx % 2 === 0 ? 'left-[100%] ml-2 text-left' : 'right-[100%] mr-2 text-right',
                        mod.status === 'available' ? 'group-hover:-translate-y-4' : ''
                      ]"
                    >
                      <p class="text-xs text-white/40 font-mono mb-0.5 uppercase tracking-wider">Módulo {{ idx + 1 }}</p>
                      <h3 :class="`text-sm font-bold w-48 whitespace-normal leading-tight ${mod.status === 'available' ? 'text-white drop-shadow-md' : 'text-gray-500'}`">
                        {{ mod.title }}
                      </h3>
                      <p v-if="mod.status === 'available'" class="text-[11px] mt-1.5 flex items-center font-medium" :class="idx % 2 === 0 ? 'justify-start text-[#EF4444]' : 'justify-end text-[#EF4444]'">
                        <component :is="mod.icon" class="w-3.5 h-3.5 mr-1" />
                        {{ mod.progress }}% completado
                      </p>
                      <p v-else class="text-[11px] text-gray-500 mt-1.5 flex items-center font-medium" :class="idx % 2 === 0 ? 'justify-start' : 'justify-end'">
                        <Lock class="w-3 h-3 mr-1" /> Bloqueado
                      </p>
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
                <p class="text-sm font-semibold">Fundamentos de Programación</p>
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
                <p class="text-xs text-muted-foreground">Completado ayer</p>
                <p class="text-sm font-medium mt-0.5">Completar el Laboratorio de Programación</p>
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

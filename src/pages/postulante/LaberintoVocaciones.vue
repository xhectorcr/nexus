<script setup lang="ts">
import { ref } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useRouter } from 'vue-router'
import { useAuth } from '@/lib/auth'
import {
  Home,
  Map as MapIcon,
  Star,
  Lock,
  CheckCircle2,
  PlayCircle,
  Brain,
  Target,
  Heart,
  Gamepad2,
  ArrowLeft,
  Flame,
  TrendingUp,
  Lightbulb,
} from 'lucide-vue-next'

const router = useRouter()
const auth = useAuth()

const sidebarItems = [
  { icon: Home, label: "Inicio", href: "/postulante" },
]

const modules = [
  {
    id: 1,
    title: "Test de Intereses Vocacionales",
    description: "Evaluación inicial completada con éxito.",
    icon: Brain,
    color: "#2E7D32",
    status: "available",
    progress: 100,
    xp: 50,
    badge: "Explorador",
    position: { x: 10, side: "left" },
  },
  {
    id: 2,
    title: "Test de Inteligencias Múltiples",
    description: "Descubre tus tipos de inteligencia dominantes.",
    icon: Lightbulb,
    color: "#B50E30",
    status: "available",
    progress: 0,
    xp: 100,
    badge: "Pensador",
    position: { x: 55, side: "right" },
  },
  {
    id: 3,
    title: "Test de Personalidad y Valores",
    description: "Conoce tu perfil psicológico y ético.",
    icon: Heart,
    color: "#D4A017",
    status: "locked",
    progress: 0,
    xp: 150,
    badge: "Empático",
    position: { x: 10, side: "left" },
  },
  {
    id: 4,
    title: "Simulador de Situaciones",
    description: "Juego de rol para toma de decisiones.",
    icon: Gamepad2,
    color: "#1565C0",
    status: "locked",
    progress: 0,
    xp: 200,
    badge: "Estratega",
    position: { x: 55, side: "right" },
  },
  {
    id: 5,
    title: "Resultado Vocacional",
    description: "Tu perfil completo y recomendación NEXUS IA.",
    icon: Target,
    color: "#B50E30",
    status: "locked",
    progress: 0,
    xp: 500,
    badge: "Vocación Encontrada",
    position: { x: 10, side: "left" },
  },
]

const badges = [
  { name: "Curioso", icon: "🔍", earned: true },
  { name: "Constante", icon: "🔥", earned: true },
  { name: "Pensador", icon: "🧠", earned: false },
]

const totalProgress = ref(20)
const selectedModule = ref<any>(null)
</script>

<template>
  <DashboardLayout
    :sidebarItems="sidebarItems"
    title="NEXUS Postulante"
    subtitle="Tu Laberinto de Vocaciones y Experiencias"
    :breadcrumbs="[
      { label: 'Inicio', href: '/postulante' },
      { label: 'Laberinto de Vocaciones' },
    ]"
    moduleColor="#B50E30"
  >
    <div class="mb-4">
      <Button
        variant="ghost"
        @click="router.push('/postulante')"
        class="flex items-center gap-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft class="w-4 h-4" />
        Volver al Dashboard
      </Button>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
      <!-- Left: Map + Modules -->
      <div class="space-y-4">
        <!-- Student Header Card -->
        <Card class="border-0 overflow-hidden" style="background: linear-gradient(135deg, #B50E30 0%, #8F0B26 60%, #1565C0 100%)">
          <CardContent class="p-5">
            <div class="flex items-center gap-4">
              <div class="relative">
                <Avatar class="w-16 h-16 ring-2 ring-white/40">
                  <AvatarImage src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop" />
                  <AvatarFallback class="bg-white/20 text-white">CP</AvatarFallback>
                </Avatar>
                <div class="absolute -bottom-1 -right-1 bg-[#D4A017] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  Nv.1
                </div>
              </div>
              <div class="flex-1 text-white">
                <p class="text-white/70 text-xs">Explorador de Vocaciones</p>
                <h2 class="font-semibold text-lg leading-tight">{{ auth.state.user?.name || 'Camila Postulante' }}</h2>
                <div class="flex items-center gap-1.5 mt-1">
                  <Target class="w-3.5 h-3.5 text-[#D4A017]" />
                  <span class="text-[#D4A017] text-xs font-medium">Buscando su camino</span>
                </div>
              </div>
              <div class="text-right text-white">
                <div class="text-2xl font-bold">20%</div>
                <div class="text-white/60 text-xs">completado</div>
                <div class="flex items-center justify-end gap-1 mt-1.5">
                  <Flame class="w-3.5 h-3.5 text-orange-400" />
                  <span class="text-xs text-orange-300">2 días seguidos</span>
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
                  50 XP
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
                  <Gamepad2 class="w-5 h-5 text-[#B50E30]" />
                  Laberinto de Vocaciones
                </CardTitle>
                <p class="text-sm text-white/50 mt-0.5 font-mono">Supera cada etapa para desbloquear tu perfil completo.</p>
              </div>
              <Badge variant="outline" class="text-white border-white/20 bg-white/5">
                1 / 5 etapas
              </Badge>
            </div>
          </CardHeader>
          <CardContent class="px-0 pb-0 bg-[#121826]">
            <div class="relative min-h-[700px] w-full overflow-hidden">
              <!-- Background grid -->
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
                    <div v-if="mod.status === 'available' && mod.progress < 100" class="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#EF4444] text-white text-[11px] font-bold px-3 py-1.5 rounded shadow-lg shadow-red-500/30 whitespace-nowrap z-30 tracking-wide uppercase transition-transform group-hover:-translate-y-2">
                      Continuar Laberinto
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
                      <p class="text-xs text-white/40 font-mono mb-0.5 uppercase tracking-wider">Etapa {{ idx + 1 }}</p>
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
                <p class="text-xs text-muted-foreground">Siguiente desafío</p>
                <p class="text-sm font-semibold">Test de Inteligencias Múltiples</p>
              </div>
            </div>
            <div class="mb-3">
              <p class="text-xs text-muted-foreground italic line-clamp-3">
                Avanza a la segunda etapa para que NEXUS evalúe tus inteligencias dominantes.
              </p>
            </div>
            <Button class="w-full bg-[#B50E30] hover:bg-[#8F0B26] text-white text-sm gap-2">
              <PlayCircle class="w-4 h-4" />
              Iniciar Etapa (+100 XP)
            </Button>
          </CardContent>
        </Card>

        <!-- Stats -->
        <Card>
          <CardHeader class="pb-2 pt-4 px-4">
            <CardTitle class="text-sm">Estado del Laberinto</CardTitle>
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
                <p class="text-xs font-medium truncate">{{ m.title }}</p>
              </div>
              <span class="text-xs text-muted-foreground flex-shrink-0">
                {{ m.status === 'available' ? `${m.progress}%` : '—' }}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </DashboardLayout>
</template>

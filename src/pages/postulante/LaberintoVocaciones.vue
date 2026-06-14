<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { api } from '@/lib/api'
import { useAuth } from '@/lib/auth'
import {
  ArrowLeft,
  BookOpen,
  Brain,
  CheckCircle2,
  Flame,
  Gamepad2,
  Heart,
  Home,
  Lightbulb,
  Lock,
  MessageCircle,
  PlayCircle,
  Target,
  TrendingUp
} from 'lucide-vue-next'
import { computed, markRaw, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()
const auth = useAuth()

const sidebarItems = computed(() => [
  { icon: markRaw(Home), label: t('nav.home'), href: "/postulante" },
  { icon: markRaw(Brain), label: t('nav.vocational_tests'), href: "/postulante/test" },
  { icon: markRaw(Gamepad2), label: t('postulante.labyrinth'), href: "/postulante/laberinto" },
  { icon: markRaw(BookOpen), label: t('postulante.digital_log'), href: "/postulante/bitacora" },
  { icon: markRaw(MessageCircle), label: t('postulante.p2p_connection'), href: "/postulante/p2p" },
])

const modules = ref<any[]>([])
const selectedModule = ref<any>(null)
const totalProgress = ref(0)
const userXP = ref(0)
const userLevel = ref(1)
const userStreak = ref(0)
const isLoading = ref(true)

const badges = computed(() => [
  { name: t('laberinto.badges.b1') || "Explorador", icon: "🔍", earned: userXP.value >= 10 },
  { name: t('laberinto.badges.b2') || "Constante", icon: "🔥", earned: userStreak.value >= 2 },
  { name: t('laberinto.badges.b3') || "Pensador", icon: "🧠", earned: userXP.value >= 100 },
])

const currentModuleIndex = computed(() => {
  return modules.value.findIndex((m) => m.status === "available" || m.status === "in_progress");
});

const activeModule = computed(() => {
  const index = currentModuleIndex.value;
  return index !== -1 ? modules.value[index] : null;
});

const loadJourneyData = async () => {
  try {
    isLoading.value = true;
    const usuarioId = auth.state.user?.id || 1;
    let postulanteId = usuarioId;

    try {
      const profRes = await api.get(`/api/postulantes/by-usuario/${usuarioId}`);
      if (profRes.data?.data?.id) postulanteId = profRes.data.data.id;
    } catch (e) {
      console.warn("No se pudo obtener el perfil de postulante, usando fallback ID", e);
    }

    try {
      const journeyRes = await api.get(`/api/journeys/postulante/${postulanteId}/activo`);
      
      if (journeyRes.data && journeyRes.data.success) {
        const journey = journeyRes.data.data;
        let xpCounter = 0;
        let completedCount = 0;

        modules.value = journey.nodos.map((nodo: any, i: number) => {
          // Asignación de colores e iconos estilo Postulante (Azules)
          let color = "#2563EB"; // Azul base
          let icon = Brain;
          
          if (nodo.tipo === "FORO") { color = "#3B82F6"; icon = MessageCircle; }
          if (nodo.tipo === "LABERINTO" || nodo.tipo === "QUIZ" || nodo.tipo === "DESAFIO") { color = "#0EA5E9"; icon = Gamepad2; }
          if (nodo.tipo === "MENTORIA" || nodo.tipo === "EVENTO") { color = "#0284C7"; icon = Target; }
          if (nodo.tipo === "LECTURA") { color = "#4F46E5"; icon = BookOpen; }

          const isCompleted = nodo.estado === "COMPLETADO";
          const isInProgress = nodo.estado === "EN_PROGRESO";
          const isAvailable = isInProgress || (nodo.estado === "PENDIENTE" && (i === 0 || journey.nodos[i - 1].estado === "COMPLETADO"));

          if (isCompleted) {
            xpCounter += nodo.xp || 0;
            completedCount++;
          }

          return {
            id: nodo.id,
            title: nodo.titulo,
            description: nodo.descripcion,
            icon: markRaw(icon),
            color,
            status: isCompleted ? "completed" : (isAvailable ? (isInProgress ? "in_progress" : "available") : "locked"),
            progress: isCompleted ? 100 : (isInProgress ? 50 : 0),
            xp: nodo.xp || 10,
          };
        });

        userXP.value = xpCounter;
        userLevel.value = Math.floor(xpCounter / 100) + 1;
        userStreak.value = Math.max(1, completedCount);
        totalProgress.value = Math.round((completedCount / journey.nodos.length) * 100) || 0;
      }
    } catch (e) {
      console.error("No se encontró un journey activo, usando datos de MOCK.");
      // FALLBACK MOCK PARA EL POSTULANTE
      totalProgress.value = 20;
      userXP.value = 50;
      userLevel.value = 1;
      userStreak.value = 2;
      
      modules.value = [
        { id: 1, title: t('laberinto.modules.m1_t') || 'Módulo 1', description: t('laberinto.modules.m1_d') || 'Desc 1', icon: markRaw(Brain), color: "#2563EB", status: "completed", progress: 100, xp: 50 },
        { id: 2, title: t('laberinto.modules.m2_t') || 'Módulo 2', description: t('laberinto.modules.m2_d') || 'Desc 2', icon: markRaw(Lightbulb), color: "#3B82F6", status: "in_progress", progress: 50, xp: 100 },
        { id: 3, title: t('laberinto.modules.m3_t') || 'Módulo 3', description: t('laberinto.modules.m3_d') || 'Desc 3', icon: markRaw(Heart), color: "#0EA5E9", status: "locked", progress: 0, xp: 150 },
        { id: 4, title: t('laberinto.modules.m4_t') || 'Módulo 4', description: t('laberinto.modules.m4_d') || 'Desc 4', icon: markRaw(Gamepad2), color: "#0284C7", status: "locked", progress: 0, xp: 200 },
        { id: 5, title: t('laberinto.modules.m5_t') || 'Módulo 5', description: t('laberinto.modules.m5_d') || 'Desc 5', icon: markRaw(Target), color: "#4F46E5", status: "locked", progress: 0, xp: 500 },
      ];
    }
  } catch (error) {
    console.error("Error cargando los datos", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadJourneyData();
});
</script>

<template>
  <DashboardLayout
    :sidebarItems="sidebarItems"
    :title="$t('postulante.title')"
    :subtitle="$t('laberinto.subtitle')"
    :breadcrumbs="[
      { label: $t('nav.home'), href: '/postulante' },
      { label: $t('laberinto.title') },
    ]"
    moduleColor="#082065"
  >
    <div class="mb-4">
      <Button
        variant="ghost"
        @click="router.push('/postulante')"
        class="flex items-center gap-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft class="w-4 h-4" />
        {{ $t('laberinto.back_to_dashboard') }}
      </Button>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6" v-if="!isLoading">
      <div class="space-y-4">
        <Card class="overflow-hidden border-0" style="background: linear-gradient(135deg, #082065 0%, #0D47A1 60%, #1A237E 100%)">
          <CardContent class="p-5">
            <div class="flex items-center gap-4">
              <div class="relative">
                <Avatar class="w-16 h-16 shadow-xl ring-2 ring-white/40">
                  <AvatarImage src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop" />
                  <AvatarFallback class="text-white bg-white/20">CP</AvatarFallback>
                </Avatar>
                <div class="absolute -bottom-1 -right-1 bg-[#0EA5E9] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-lg border border-blue-400">
                  Nv.{{ userLevel }}
                </div>
              </div>
              <div class="flex-1 text-white">
                <p class="text-xs font-bold tracking-wider uppercase text-white/70">{{ $t('laberinto.explorer_role') || 'Postulante' }}</p>
                <h2 class="text-lg font-semibold leading-tight">{{ auth.state.user?.name || 'Camila Postulante' }}</h2>
                <div class="flex items-center gap-1.5 mt-1 bg-white/10 w-fit px-2 py-0.5 rounded backdrop-blur-sm">
                  <Target class="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span class="text-[#38BDF8] text-xs font-medium">{{ $t('laberinto.searching_path') || 'Descubriendo Vocación' }}</span>
                </div>
              </div>
              <div class="p-3 text-right text-white border bg-black/20 rounded-xl border-white/10 backdrop-blur-sm">
                <div class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">{{ Math.round(totalProgress) }}%</div>
                <div class="text-white/60 text-[10px] font-bold uppercase tracking-wider">{{ $t('laberinto.completed') || 'Completado' }}</div>
                <div class="flex items-center justify-end gap-1 mt-1.5">
                  <Flame class="w-3.5 h-3.5 text-[#60A5FA] animate-pulse" />
                  <span class="text-[#93C5FD] text-xs font-bold">{{ $t('laberinto.streak_days', { days: userStreak }) || `${userStreak} días racha` }}</span>
                </div>
              </div>
            </div>

            <div class="mt-4">
              <div class="flex justify-between text-xs text-white/70 mb-1.5 font-bold uppercase tracking-wider">
                <span>{{ $t('laberinto.general_progress') || 'Progreso General' }}</span>
                <span>{{ Math.round(totalProgress) }}% {{ $t('laberinto.total') || 'Total' }}</span>
              </div>
              <div class="w-full h-2 border rounded-full shadow-inner bg-black/30 border-white/5">
                <div
                  class="relative h-full transition-all duration-1000 ease-out rounded-full"
                  :style="{ width: `${totalProgress}%`, background: 'linear-gradient(90deg, #0EA5E9, #38BDF8)' }"
                >
                   <div class="absolute inset-0 bg-white/20 animate-[pulse_2s_ease-in-out_infinite]"></div>
                </div>
              </div>
            </div>

            <div class="flex gap-2 pt-4 mt-4 border-t border-white/10">
              <div
                v-for="b in badges"
                :key="b.name"
                :title="b.name"
                :class="`text-lg w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110 ${
                  b.earned ? 'bg-white/20 border border-white/20 shadow-lg' : 'bg-black/20 border border-white/5 grayscale opacity-40'
                }`"
              >
                {{ b.icon }}
              </div>
              <div class="ml-auto">
                <Badge class="text-xs text-white border-0 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 shadow-blue-900/50">
                  <TrendingUp class="w-3 h-3 mr-1" />
                  {{ userXP }} XP
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card class="border-0 overflow-hidden bg-[#0B1120] text-white shadow-xl">
          <CardHeader class="pb-3 pt-5 px-5 border-b border-white/10 relative z-10 bg-[#0B1120]">
            <div class="flex items-center justify-between">
              <div>
                <CardTitle class="flex items-center gap-2 text-white">
                  <Gamepad2 class="w-5 h-5 text-[#3B82F6]" />
                  {{ $t('laberinto.title') || 'Laberinto Vocacional' }}
                </CardTitle>
                <p class="text-sm text-white/50 mt-0.5 font-mono">{{ $t('laberinto.map_desc') || 'Tu mapa de descubrimiento' }}</p>
              </div>
              <Badge variant="outline" class="text-white border-white/20 bg-white/5">
                {{ modules.length }} Etapas
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent class="px-0 pb-0 bg-[#0B1120]">
            <div class="relative min-h-[700px] w-full overflow-hidden">
              <div
                class="absolute inset-0"
                style="background-image: linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px); background-size: 30px 30px;"
              />

              <svg v-if="modules.length > 1" class="absolute inset-0 z-0 w-full h-full pointer-events-none">
                <defs>
                  <filter id="glow-blue" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
                <line
                  v-for="i in modules.length - 1"
                  :key="'line-'+i"
                  :x1="((i - 1) % 2 === 0) ? '35%' : '65%'"
                  :y1="`${100 * ((i - 1) + 0.5) / modules.length}%`"
                  :x2="(i % 2 === 0) ? '35%' : '65%'"
                  :y2="`${100 * (i + 0.5) / modules.length}%`"
                  :stroke="modules[i-1].status !== 'locked' && modules[i].status !== 'locked' ? '#3B82F6' : (modules[i-1].status !== 'locked' ? '#1E3A8A' : '#374151')"
                  stroke-width="3"
                  :stroke-dasharray="modules[i-1].status !== 'locked' && modules[i].status !== 'locked' ? '8 6' : '0'"
                  :class="modules[i-1].status !== 'locked' && modules[i].status !== 'locked' ? 'animate-[dash_2s_linear_infinite]' : ''"
                  stroke-linecap="round"
                />
              </svg>

              <div class="relative z-10 flex flex-col justify-between w-full h-full py-12" :style="{ minHeight: `${modules.length * 150}px` }">
                <div v-for="(mod, idx) in modules" :key="mod.id" class="relative flex items-center flex-1 w-full">
                  <div
                    class="absolute flex flex-col items-center transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 group"
                    :class="[
                      mod.status !== 'locked' ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed opacity-60 grayscale',
                      idx === currentModuleIndex ? 'drop-shadow-[0_0_20px_rgba(59,130,246,0.6)] scale-110' : ''
                    ]"
                    :style="{ left: idx % 2 === 0 ? '35%' : '65%', top: '50%' }"
                  >
                    <div v-if="idx === currentModuleIndex" class="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#3B82F6] text-white text-[11px] font-bold px-3 py-1.5 rounded shadow-lg shadow-blue-500/50 whitespace-nowrap z-30 tracking-wide uppercase animate-bounce">
                      {{ $t('laberinto.continue_maze') || 'Continuar aquí' }}
                      <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-[#3B82F6]"></div>
                    </div>

                    <div class="relative z-20">
                      <svg width="150" height="120" viewBox="0 0 150 120" class="overflow-visible drop-shadow-2xl">
                        <g>
                          <ellipse cx="75" cy="100" rx="45" ry="15" fill="black" fill-opacity="0.5" class="transition-transform duration-500 group-hover:scale-90 opacity-60" />
                          
                          <g class="transform translate-y-6">
                            <polygon points="75,30 135,60 75,90 15,60" fill="#1F2937" />
                            <polygon points="15,60 75,90 75,100 15,70" fill="#111827" />
                            <polygon points="75,90 135,60 135,70 75,100" fill="#030712" />
                            <polygon points="75,30 135,60 75,90 15,60" fill="none" stroke="#374151" stroke-width="1" />
                          </g>

                          <g :class="`transition-all duration-500 ease-out ${mod.status !== 'locked' ? 'group-hover:-translate-y-4' : ''}`">
                            <polygon points="75,10 135,40 75,70 15,40" :fill="mod.status !== 'locked' ? '#3B82F6' : '#4B5563'" />
                            <polygon points="75,10 135,40 75,70 15,40" fill="white" fill-opacity="0.1" />
                            <polygon v-if="mod.status !== 'locked'" points="75,22 120,44 75,66 30,44" fill="none" stroke="#BFDBFE" stroke-width="1.5" opacity="0.6" />
                            <polygon v-if="mod.status !== 'locked'" points="75,30 105,45 75,60 45,45" :fill="'#1D4ED8'" opacity="0.4" />
                            
                            <polygon points="15,40 75,70 75,80 15,50" :fill="mod.status !== 'locked' ? '#2563EB' : '#374151'" />
                            <polygon points="15,40 75,70 75,80 15,50" fill="black" fill-opacity="0.2" />
                            
                            <polygon points="75,70 135,40 135,50 75,80" :fill="mod.status !== 'locked' ? '#1D4ED8' : '#1F2937'" />
                            <polygon points="75,70 135,40 135,50 75,80" fill="black" fill-opacity="0.4" />
                          </g>
                        </g>
                      </svg>
                    </div>

                    <div
                      class="absolute whitespace-nowrap top-[45%] -translate-y-1/2 transition-transform duration-500"
                      :class="[
                        idx % 2 === 0 ? 'left-[100%] ml-2 text-left' : 'right-[100%] mr-2 text-right',
                        mod.status !== 'locked' ? 'group-hover:-translate-y-4' : ''
                      ]"
                    >
                      <p class="text-xs text-white/40 font-mono mb-0.5 uppercase tracking-wider">{{ $t('laberinto.stage') || 'Etapa' }} {{ idx + 1 }}</p>
                      <h3 :class="`text-sm font-bold w-48 whitespace-normal leading-tight ${mod.status !== 'locked' ? 'text-white drop-shadow-md' : 'text-gray-500'}`">
                        {{ mod.title }}
                      </h3>
                      
                      <p v-if="mod.status === 'completed'" class="text-[11px] mt-1.5 flex items-center font-bold" :class="idx % 2 === 0 ? 'justify-start text-emerald-400' : 'justify-end text-emerald-400'">
                        <CheckCircle2 class="w-3.5 h-3.5 mr-1" /> Completado
                      </p>
                      <p v-else-if="mod.status === 'in_progress' || mod.status === 'available'" class="text-[11px] mt-1.5 flex items-center font-bold" :class="idx % 2 === 0 ? 'justify-start text-[#3B82F6]' : 'justify-end text-[#3B82F6]'">
                        <component :is="mod.icon" class="w-3.5 h-3.5 mr-1" /> {{ mod.progress }}% {{ $t('laberinto.completed') || 'Progreso' }}
                      </p>
                      <p v-else class="text-[11px] text-gray-500 mt-1.5 flex items-center font-medium" :class="idx % 2 === 0 ? 'justify-start' : 'justify-end'">
                        <Lock class="w-3 h-3 mr-1" /> {{ $t('laberinto.locked') || 'Bloqueado' }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div class="space-y-4">
        <Card class="border border-[#082065]/20 bg-[#082065]/5">
          <CardContent class="p-4">
            <div v-if="activeModule">
              <div class="flex items-center gap-2 mb-3">
                <div class="w-8 h-8 bg-[#082065] rounded-lg flex items-center justify-center">
                  <PlayCircle class="w-4 h-4 text-white" />
                </div>
                <div>
                  <p class="text-xs text-muted-foreground">{{ $t('laberinto.next_challenge') || 'Siguiente Desafío' }}</p>
                  <p class="text-sm font-semibold">{{ activeModule.title }}</p>
                </div>
              </div>
              <div class="mb-3">
                <p class="text-xs italic text-muted-foreground line-clamp-3">
                  {{ activeModule.description }}
                </p>
              </div>
              <Button class="w-full bg-[#082065] hover:bg-[#0D47A1] text-white text-sm gap-2 font-bold shadow-md transition-transform hover:-translate-y-0.5">
                <PlayCircle class="w-4 h-4" />
                {{ $t('laberinto.start_stage') || 'Iniciar Etapa' }} (+{{ activeModule.xp }} XP)
              </Button>
            </div>
            <div v-else class="py-4 text-center">
              <CheckCircle2 class="w-8 h-8 mx-auto mb-2 text-emerald-500" />
              <p class="text-sm font-bold text-slate-800">¡Has completado toda la ruta!</p>
              <p class="text-xs text-slate-500">Espera nuevos desafíos.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="px-4 pt-4 pb-2 border-b border-gray-100">
            <CardTitle class="text-sm font-bold">{{ $t('laberinto.maze_status') || 'Estado de la Ruta' }}</CardTitle>
          </CardHeader>
          <CardContent class="px-4 pt-3 pb-4 space-y-3">
            <div v-for="m in modules" :key="m.id" class="flex items-center gap-3">
              <div
                class="flex items-center justify-center flex-shrink-0 transition-colors rounded-full w-7 h-7"
                :style="{ background: m.status !== 'locked' ? m.color : '#f3f4f6' }"
              >
                <CheckCircle2 v-if="m.status === 'completed'" class="w-4 h-4 text-white" />
                <component :is="m.icon" v-else-if="m.status === 'in_progress' || m.status === 'available'" class="w-4 h-4 text-white" />
                <Lock v-else class="w-3.5 h-3.5 text-gray-400" />
              </div>
              <div class="flex-1 min-w-0">
                <p :class="`text-xs font-bold truncate ${m.status !== 'locked' ? 'text-slate-800' : 'text-slate-400'}`">{{ m.title }}</p>
                <div v-if="m.status !== 'locked' && m.progress > 0" class="w-full h-1 mt-1 rounded-full bg-slate-100">
                  <div class="h-full rounded-full" :style="{ width: `${m.progress}%`, backgroundColor: m.color }"></div>
                </div>
              </div>
              <span :class="`text-[10px] font-black flex-shrink-0 ${m.status !== 'locked' ? 'text-blue-600' : 'text-slate-400'}`">
                {{ m.status !== 'locked' ? `${m.progress}%` : '—' }}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    
    <div v-else class="flex items-center justify-center min-h-[400px]">
      <div class="flex flex-col items-center gap-4">
        <div class="w-10 h-10 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        <p class="text-sm font-bold text-gray-500">Cargando tu laberinto vocacional...</p>
      </div>
    </div>
  </DashboardLayout>
</template>

<style scoped>
.transition-all {
  transition: all 0.25s ease;
}
</style>
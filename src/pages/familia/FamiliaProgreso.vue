<script setup lang="ts">
import { ref, markRaw, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Home,
  TrendingUp,
  CheckCircle2,
  Clock,
  Target,
  BarChart3,
  Calendar,
  Bell,
  Star,
  Volume2,
  VolumeX,
  Sparkles
} from 'lucide-vue-next'

import { useAuth } from '@/lib/auth'
const auth = useAuth()
const router = useRouter()

onMounted(() => {
  // if (!auth.state.user?.linkedStudentCode) {
  //   router.push('/familia')
  // }
})

const vistaFacil = ref(true)
const reproduciendoText = ref('')
const mostrarExplicacionIA = ref(false)

const hablar = (texto: string) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel()
    if (reproduciendoText.value === texto) {
      reproduciendoText.value = ''
      return
    }
    reproduciendoText.value = texto
    const utterance = new SpeechSynthesisUtterance(texto)
    utterance.lang = 'es-ES'
    utterance.onend = () => {
      reproduciendoText.value = ''
    }
    window.speechSynthesis.speak(utterance)
  }
}

const moduleProgress = computed(() => {
  return [
    { 
      name: "1. Autoconocimiento", 
      desc: "Ayuda a tu hijo a descubrir qué le gusta, qué valora y qué se le da bien.",
      pct: 80, 
      status: "completed", 
      color: "#2E7D32" 
    },
    { 
      name: "2. Intereses Profesionales", 
      desc: "Explora qué trabajos y profesiones del mundo real le llaman más la atención.",
      pct: 60, 
      status: "in_progress", 
      color: "#FFB20D" 
    },
    { 
      name: "3. Inteligencias Múltiples", 
      desc: "Prueba para saber en qué destaca (números, palabras, arte, lógica, etc.).",
      pct: 100, 
      status: "completed", 
      color: "#2E7D32" 
    },
    { 
      name: "4. Personalidad y Aptitudes", 
      desc: "Analiza cómo se comporta y resuelve problemas en el día a día.",
      pct: 50, 
      status: "in_progress", 
      color: "#FFB20D" 
    },
    { 
      name: "5. Simulador de Carreras", 
      desc: "Permite a tu hijo 'probar' virtualmente cómo es un día de trabajo en cada profesión.",
      pct: 0, 
      status: "pending", 
      color: "#9ca3af" 
    },
    { 
      name: "6. Proyecto Final de Vocación", 
      desc: "El resumen de todo su camino donde elige su carrera definitiva.",
      pct: 20, 
      status: "in_progress", 
      color: "#FFB20D" 
    },
  ]
})

const statusConfig: Record<string, any> = {
  completed: { label: "¡Terminado!", bg: "bg-emerald-100", text: "text-emerald-800 font-bold", dot: "#2E7D32" },
  in_progress: { label: "En progreso (Avanzando)", bg: "bg-amber-100", text: "text-amber-800 font-bold", dot: "#FFB20D" },
  pending: { label: "Por empezar", bg: "bg-gray-100", text: "text-gray-600", dot: "#9ca3af" },
}

const stats = computed(() => {
  return [
    { label: "Horas dedicadas a estudiar", value: "8 horas y media", icon: markRaw(Clock), color: "#FFB20D" },
    { label: "Temas completados", value: "2 de 6 listos", icon: markRaw(CheckCircle2), color: "#2E7D32" },
    { label: "Tareas para hacer hoy", value: "5 pendientes", icon: markRaw(Target), color: "#F9A825" },
    { label: "Calificación promedio", value: "8.4 (Muy buena)", icon: markRaw(Star), color: "#FFB20D" },
  ]
})

const timeline = computed(() => {
  return [
    { event: "Completó el test de Intereses Profesionales", time: "hace 2 horas", icon: markRaw(CheckCircle2), color: "#2E7D32" },
    { event: "Vio el video explicativo de Personalidad", time: "hace 5 horas", icon: markRaw(Clock), color: "#FFB20D" },
    { event: "Ganó la medalla virtual 'Explorador'", time: "ayer", icon: markRaw(Star), color: "#FFB20D" },
    { event: "Completó el tema de Inteligencias Múltiples", time: "hace 3 días", icon: markRaw(CheckCircle2), color: "#2E7D32" },
  ]
})

const sidebarItems = [
  { icon: markRaw(Home), label: "Inicio", href: "/familia" },
  { icon: markRaw(TrendingUp), label: "Progreso de tu hijo", href: "/familia/progreso" },
]

const overallPct = computed(() => {
  return Math.round(moduleProgress.value.reduce((s, m) => s + m.pct, 0) / moduleProgress.value.length)
})

const studentNameShort = computed(() => auth.state.user?.studentName ? auth.state.user.studentName.split(' ')[0] : 'Alejandro')
const careerName = computed(() => auth.state.user?.careerSuggestion || 'Ingeniería de Sistemas')
const textoExplicacionIA = computed(() => `Hola. Te explico el avance de ${studentNameShort.value} en palabras sencillas: Va muy bien. Ya completó los temas vocacionales principales de su ruta. Destaca en resolución de problemas, por lo que el sistema inteligente sugiere la carrera de ${careerName.value}. Sigue apoyando a tu hijo/a en esta etapa.`)
</script>

<template>
  <DashboardLayout
    :sidebarItems="sidebarItems"
    title="Notas y Progreso"
    subtitle="Mira en detalle lo que tu hijo ha avanzado en NEXUS"
    :breadcrumbs="[
      { label: 'Inicio', href: '/familia' },
      { label: 'Progreso' },
    ]"
    moduleColor="#FFB20D"
  >
    <div class="space-y-6">

      <!-- Controles de Accesibilidad -->
      <div class="bg-gradient-to-r from-amber-50 to-amber-100/50 p-4 rounded-2xl border border-amber-200/60 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white shadow-md">
            <Sparkles class="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 class="font-bold text-gray-800 text-lg">Asistente de Progreso</h3>
            <p class="text-xs text-gray-600">Te explicamos todo paso a paso, con letra grande y audio-lectura.</p>
          </div>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <button 
            @click="vistaFacil = !vistaFacil"
            class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm"
            :class="vistaFacil ? 'bg-amber-600 text-white hover:bg-amber-700' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'"
          >
            <span class="w-2.5 h-2.5 rounded-full bg-green-400" v-if="vistaFacil"></span>
            {{ vistaFacil ? 'Vista Fácil: Activada' : 'Activar Vista Fácil' }}
          </button>
          
          <Button 
            @click="mostrarExplicacionIA = !mostrarExplicacionIA"
            class="bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-semibold gap-1.5 shadow-sm"
          >
            <Sparkles class="w-4 h-4 fill-white" />
            {{ mostrarExplicacionIA ? 'Cerrar Explicación IA' : 'Explicación Sencilla con IA' }}
          </Button>
        </div>
      </div>

      <!-- Cuadro de Explicación de la IA (Interactivo) -->
      <Card 
        v-if="mostrarExplicacionIA" 
        class="border-amber-400 bg-amber-50/50 shadow-md p-6 rounded-2xl relative overflow-hidden transition-all"
      >
        <div class="absolute top-0 right-0 w-32 h-32 bg-amber-100 rounded-full -mr-12 -mt-12 opacity-30"></div>
        <div class="flex flex-col md:flex-row gap-5 items-start">
          <div class="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-lg">
            <Sparkles class="w-6 h-6 fill-white" />
          </div>
          <div class="space-y-4">
            <h3 class="font-extrabold text-amber-900 text-xl flex items-center gap-2">
              Explicación Sencilla de NEXUS Inteligencia Artificial
            </h3>
            <p class="text-gray-800 leading-relaxed font-medium" :class="vistaFacil ? 'text-lg' : 'text-base'">
              "{{ textoExplicacionIA }}"
            </p>
            <div class="flex flex-wrap items-center gap-3 pt-2">
              <Button 
                @click="hablar(textoExplicacionIA)"
                class="bg-amber-700 hover:bg-amber-800 text-white gap-2 rounded-xl font-bold text-sm h-10 px-5"
              >
                <component :is="reproduciendoText === textoExplicacionIA ? VolumeX : Volume2" class="w-4.5 h-4.5" />
                {{ reproduciendoText === textoExplicacionIA ? 'Detener Voz' : 'Escuchar Explicación en Voz Alta' }}
              </Button>
              <Button 
                variant="ghost" 
                class="text-amber-700 hover:text-amber-900 font-bold hover:bg-amber-100/50" 
                @click="mostrarExplicacionIA = false"
              >
                Entendido, gracias
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <!-- Tarjeta Resumen del Alumno -->
      <Card class="border-0 overflow-hidden shadow-lg" style="background: linear-gradient(135deg, #FFD54F 0%, #FFB20D 50%, #B8870F 100%)">
        <CardContent class="p-6">
          <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div class="flex items-center gap-4">
              <Avatar class="w-20 h-20 ring-4 ring-white/30 shadow-md">
                <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop" />
                <AvatarFallback class="bg-white/20 text-white text-xl font-bold">AL</AvatarFallback>
              </Avatar>
              <div class="text-white space-y-1">
                <span class="text-white/70 text-xs font-semibold uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded">Hijo Registrado</span>
                <h1 class="text-2xl font-black">{{ auth.state.user?.studentName || 'Alejandro Lastra Torres' }}</h1>
                <p class="text-sm font-semibold text-white/90">
                  Carrera recomendada por IA: <span class="bg-white text-[#FFB20D] px-2 py-0.5 rounded ml-1 font-extrabold text-xs">{{ auth.state.user?.careerSuggestion || 'Ingeniería de Sistemas' }}</span>
                </p>
              </div>
            </div>
            
            <div class="text-right text-white self-stretch md:self-auto flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 border-white/10 pt-4 md:pt-0">
              <div>
                <div class="text-4xl md:text-5xl font-black">{{ overallPct }}%</div>
                <p class="text-white/70 text-xs font-bold uppercase">Progreso en total</p>
              </div>
              <Badge class="mt-2 bg-emerald-500 text-white border-0 font-bold px-3 py-1 text-xs shadow-sm">
                🔥 12 días seguidos de estudio
              </Badge>
            </div>
          </div>

          <!-- Barra de Progreso Grande -->
          <div class="mt-6 border-t border-white/10 pt-5">
            <div class="flex justify-between text-sm text-white/90 mb-2">
              <span class="font-bold">Barra de avance general:</span>
              <span class="font-extrabold">{{ overallPct }}% completado</span>
            </div>
            <div class="w-full bg-white/20 rounded-full h-4.5 overflow-hidden p-0.5">
              <div
                class="h-3.5 rounded-full transition-all duration-700 relative overflow-hidden bg-white"
                :style="{ width: `${overallPct}%` }"
              >
                <div class="absolute inset-0 bg-gradient-to-r from-transparent to-white/40 animate-pulse" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Métricas Clave (Resumen Numérico) -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card 
          v-for="(s, i) in stats" 
          :key="i" 
          class="border-gray-200 shadow-sm"
          :class="vistaFacil ? 'p-4' : 'p-3'"
        >
          <CardContent class="p-0 flex flex-col justify-between h-full">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mb-3" :style="{ backgroundColor: `${s.color}15` }">
              <component :is="s.icon" class="w-4.5 h-4.5" :style="{ color: s.color }" />
            </div>
            <div>
              <div class="text-xl md:text-2xl font-black text-gray-900 leading-none mb-1">{{ s.value }}</div>
              <div class="text-xs text-gray-500 font-bold leading-snug">{{ s.label }}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Grid Principal: Desglose de Módulos & Actividad Reciente -->
      <div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        
        <!-- Desglose por Módulo -->
        <Card class="border-gray-200 shadow-sm">
          <CardHeader class="p-5 border-b border-gray-100 bg-gray-50/30">
            <div class="flex flex-wrap items-center justify-between gap-4">
              <div>
                <CardTitle class="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <BarChart3 class="w-5 h-5 text-amber-600" />
                  ¿Qué temas está estudiando mi hijo?
                </CardTitle>
                <CardDescription class="text-gray-600" :class="vistaFacil ? 'text-base' : 'text-sm'">
                  NEXUS divide el camino en 6 temas. A continuación ves el detalle de cada uno de ellos.
                </CardDescription>
              </div>
              <div class="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 font-bold">
                <span class="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                Actualizado en tiempo real
              </div>
            </div>
          </CardHeader>
          <CardContent class="p-5 space-y-5">
            
            <div 
              v-for="mod in moduleProgress" 
              :key="mod.name"
              class="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
            >
              <div class="flex flex-wrap items-start justify-between gap-2 mb-2">
                <div class="space-y-0.5">
                  <span class="font-extrabold text-gray-950" :class="vistaFacil ? 'text-lg' : 'text-base'">
                    {{ mod.name }}
                  </span>
                  <p v-if="vistaFacil" class="text-xs text-gray-500 font-medium leading-relaxed max-w-lg">
                    {{ mod.desc }}
                  </p>
                </div>
                
                <div class="flex items-center gap-3">
                  <span :class="`text-xs px-2.5 py-0.5 rounded-full ${statusConfig[mod.status].bg} ${statusConfig[mod.status].text}`">
                    {{ statusConfig[mod.status].label }}
                  </span>
                  <span class="font-extrabold text-sm text-gray-950">
                    {{ mod.pct }}%
                  </span>
                </div>
              </div>

              <!-- Progress bar -->
              <div class="w-full bg-gray-100 rounded-full h-3 overflow-hidden p-0.5 border border-gray-200/50">
                <div
                  class="h-2 rounded-full transition-all duration-700"
                  :style="{ width: `${mod.pct}%`, backgroundColor: mod.color }"
                />
              </div>
            </div>

            <!-- Leyenda de colores -->
            <div class="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-100 text-xs">
              <span class="font-bold text-gray-500">Significado de los colores:</span>
              <div v-for="s in ['completed', 'in_progress', 'pending']" :key="s" class="flex items-center gap-1.5">
                <div class="w-3 h-3 rounded-full border" :style="{ backgroundColor: statusConfig[s].dot }" />
                <span class="font-semibold text-gray-600">{{ statusConfig[s].label }}</span>
              </div>
            </div>

          </CardContent>
        </Card>

        <!-- Columna Derecha: Resumen de Actividades -->
        <div class="space-y-6">
          
          <!-- Próximo Objetivo Rápido -->
          <Card class="border-amber-300 bg-amber-50/40 relative overflow-hidden">
            <CardHeader class="p-4 pb-2">
              <CardTitle class="text-sm font-bold flex items-center gap-1.5 text-amber-900">
                <Target class="w-4 h-4 text-amber-700" />
                Siguiente tarea de Alejandro:
              </CardTitle>
            </CardHeader>
            <CardContent class="p-4 pt-0 space-y-1">
              <p class="font-bold text-gray-950 text-sm">
                Completar la actividad práctica sobre "Personalidad".
              </p>
              <p class="text-xs text-amber-800 font-semibold">
                Estimado: Le tomará 30 minutos terminarlo.
              </p>
            </CardContent>
          </Card>

          <!-- Fecha de entrega estimada -->
          <Card class="border-gray-200 shadow-sm">
            <CardContent class="p-4 flex items-center gap-3">
              <div class="w-10 h-10 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-center shrink-0">
                <Calendar class="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p class="text-[10px] text-gray-500 font-bold uppercase leading-none">Fecha estimada de finalización</p>
                <p class="text-sm font-black text-gray-900 mt-1">15 de Agosto, 2026</p>
              </div>
            </CardContent>
          </Card>

          <!-- Historial de Actividad Reciente -->
          <Card class="border-gray-200 shadow-sm">
            <CardHeader class="p-4 pb-2 border-b border-gray-100">
              <CardTitle class="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <Bell class="w-4 h-4 text-gray-500" />
                Historial reciente de Alejandro
              </CardTitle>
            </CardHeader>
            <CardContent class="p-4 space-y-3">
              <div v-for="(t, i) in timeline" :key="i" class="flex items-start gap-3">
                <div
                  class="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 border"
                  :style="{ backgroundColor: `${t.color}10`, borderColor: `${t.color}30` }"
                >
                  <component :is="t.icon" class="w-3.5 h-3.5" :style="{ color: t.color }" />
                </div>
                <div class="min-w-0">
                  <p class="text-xs font-bold text-gray-900 leading-snug">{{ t.event }}</p>
                  <p class="text-[10px] text-gray-500 font-semibold mt-0.5">{{ t.time }}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Botón Volver -->
          <a href="/familia" class="block w-full">
            <Button variant="outline" class="w-full gap-1.5 font-bold rounded-xl text-sm h-11 border-gray-300">
              Volver al inicio del Portal
            </Button>
          </a>

        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<style scoped>
.transition-all {
  transition: all 0.25s ease;
}
</style>

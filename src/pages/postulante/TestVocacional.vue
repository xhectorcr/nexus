<script setup lang="ts">
import { ref, markRaw } from 'vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { useAuth } from '@/lib/auth'
import { api } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Brain,
  Cpu,
  Building2,
  Users2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Compass,
  Check,
  Zap,
  TrendingUp,
  Heart,
  Home
} from 'lucide-vue-next'

const router = useRouter()
const auth = useAuth()

const sidebarItems = [
  { icon: markRaw(Home), label: "Inicio", href: "/postulante" },
  { icon: markRaw(Brain), label: "Test Vocacional", href: "/postulante/test" },
]

// Steps: 
// 0: Welcome
// 1-5: Questions
// 6: AI Scanning
// 7: Results
const currentStep = ref(0)

const questions = [
  {
    id: 1,
    title: "¿Qué tipo de actividades disfrutas más hacer en tu tiempo libre?",
    options: [
      {
        text: "Crear páginas web, programar o desarmar y entender dispositivos tecnológicos",
        category: "sistemas",
        icon: Cpu,
        color: "text-blue-600 bg-blue-50"
      },
      {
        text: "Dibujar planos, diseñar maquetas o planificar la decoración y distribución de espacios",
        category: "arquitectura",
        icon: Building2,
        color: "text-red-600 bg-red-50"
      },
      {
        text: "Planear un emprendimiento, idear formas de vender productos o liderar equipos de trabajo",
        category: "administracion",
        icon: Users2,
        color: "text-amber-600 bg-amber-50"
      },
      {
        text: "Conversar sobre emociones, escuchar activamente los problemas de otros y aconsejarlos",
        category: "psicologia",
        icon: Heart,
        color: "text-emerald-600 bg-emerald-50"
      }
    ]
  },
  {
    id: 2,
    title: "En un trabajo grupal de tu colegio, ¿qué rol prefieres asumir por naturaleza?",
    options: [
      {
        text: "Resolver los problemas lógicos más complejos, estructurar datos o automatizar tareas",
        category: "sistemas",
        icon: Brain,
        color: "text-blue-600 bg-blue-50"
      },
      {
        text: "Diseñar la presentación visual, hacer esquemas estéticos y cuidar la simetría del proyecto",
        category: "arquitectura",
        icon: Compass,
        color: "text-red-600 bg-red-50"
      },
      {
        text: "Coordinar los tiempos de entrega, delegar responsabilidades y presentar los resultados finales",
        category: "administracion",
        icon: TrendingUp,
        color: "text-amber-600 bg-amber-50"
      },
      {
        text: "Asegurar que todos los miembros del grupo se sientan incluidos y mediar en caso de discusiones",
        category: "psicologia",
        icon: Users2,
        color: "text-emerald-600 bg-emerald-50"
      }
    ]
  },
  {
    id: 3,
    title: "Si tuvieras recursos ilimitados para resolver un problema del mundo real, ¿qué harías?",
    options: [
      {
        text: "Crear una plataforma con Inteligencia Artificial para optimizar la salud y educación global",
        category: "sistemas",
        icon: Cpu,
        color: "text-blue-600 bg-blue-50"
      },
      {
        text: "Planificar y construir distritos eco-amigables y viviendas sostenibles con áreas verdes",
        category: "arquitectura",
        icon: Building2,
        color: "text-red-600 bg-red-50"
      },
      {
        text: "Crear una incubadora de negocios que ayude a miles de emprendedores a expandir sus empresas",
        category: "administracion",
        icon: Zap,
        color: "text-amber-600 bg-amber-50"
      },
      {
        text: "Implementar centros comunitarios de salud mental y terapia accesible para toda la población",
        category: "psicologia",
        icon: Heart,
        color: "text-emerald-600 bg-emerald-50"
      }
    ]
  },
  {
    id: 4,
    title: "¿Qué tipo de lectura, artículos o videos llaman más tu atención en redes?",
    options: [
      {
        text: "Nuevas tecnologías, ciberseguridad, robótica, gadgets y avances de la inteligencia artificial",
        category: "sistemas",
        icon: Cpu,
        color: "text-blue-600 bg-blue-50"
      },
      {
        text: "Arquitectura moderna, estructuras históricas, tendencias de diseño de interiores o modelado 3D",
        category: "arquitectura",
        icon: Compass,
        color: "text-red-600 bg-red-50"
      },
      {
        text: "Estrategias de marketing, historias de éxito de startups, finanzas personales e inversiones",
        category: "administracion",
        icon: TrendingUp,
        color: "text-amber-600 bg-amber-50"
      },
      {
        text: "Comportamiento del cerebro, psicología del consumidor, relaciones interpersonales o salud mental",
        category: "psicologia",
        icon: Brain,
        color: "text-emerald-600 bg-emerald-50"
      }
    ]
  },
  {
    id: 5,
    title: "¿Con qué tipo de problemas te sientes más motivado/a a lidiar y solucionar?",
    options: [
      {
        text: "Un fallo de software en un programa o la necesidad de automatizar un proceso repetitivo",
        category: "sistemas",
        icon: Zap,
        color: "text-blue-600 bg-blue-50"
      },
      {
        text: "La distribución incómoda de un ambiente físico o la falta de espacios seguros de recreación",
        category: "arquitectura",
        icon: Building2,
        color: "text-red-600 bg-red-50"
      },
      {
        text: "Un negocio local que tiene pérdidas económicas o procesos organizacionales ineficientes",
        category: "administracion",
        icon: Users2,
        color: "text-amber-600 bg-amber-50"
      },
      {
        text: "Una persona de tu entorno que pasa por una situación de estrés, tristeza o crisis personal",
        category: "psicologia",
        icon: Heart,
        color: "text-emerald-600 bg-emerald-50"
      }
    ]
  }
]

// User selections for each question (1-indexed question numbers)
const selectedOptions = ref<Record<number, string>>({})
const aiScanText = ref('NEXUS IA está conectando el servidor vocacional...')
const computedResult = ref({
  career: 'Ingeniería de Sistemas',
  percentage: 95,
  description: 'Te apasiona la tecnología, la lógica algorítmica y la resolución de problemas abstractos. Tienes aptitudes innatas para liderar el cambio tecnológico a través del desarrollo de software y la Inteligencia Artificial.',
  skills: ['Pensamiento lógico y abstracto', 'Resolución de problemas complejos', 'Aptitud para el aprendizaje tecnológico rápido', 'Habilidades de automatización y optimización'],
  color: '#1565C0',
  colorBg: 'bg-blue-50 border-blue-200 text-blue-900',
  icon: Cpu
})

const handleSelect = (questionId: number, category: string) => {
  selectedOptions.value[questionId] = category
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const nextStep = () => {
  // Check if answered before going next
  if (currentStep.value >= 1 && currentStep.value <= 5) {
    if (!selectedOptions.value[currentStep.value]) {
      return // Must select an answer
    }
  }
  
  if (currentStep.value === 5) {
    // Start AI analysis step
    currentStep.value = 6
    runAiScanning()
  } else {
    currentStep.value++
  }
}

// Simulated AI calculation but real API call behind the scenes
const runAiScanning = async () => {
  const texts = [
    'NEXUS IA está analizando la frecuencia de tus patrones de decisión...',
    'Evaluando competencias contra la malla académica de la UTP...',
    'Haciendo matchmaking con perfiles profesionales de éxito...',
    'Calculando porcentajes de afinidad vocacional final...'
  ]
  
  let textIndex = 0
  const interval = setInterval(() => {
    if (textIndex < texts.length) {
      aiScanText.value = texts[textIndex]
      textIndex++
    }
  }, 1000)
  
  try {
    // We synthesize the query parameters based on the 5 answers
    const categories = Object.values(selectedOptions.value)
    const gustos = categories.join(', ')
    const habilidades = 'lógica, resolución de problemas, creatividad' // In a real scenario, this would be derived from specific questions
    const miedos = 'rutina, estancamiento' // Derived as well

    const response = await api.get('/api/v1/ai/perfilar', {
      params: { gustos, habilidades, miedos }
    })
    
    // Minimum artificial delay to allow animations to play out (UX)
    setTimeout(() => {
      clearInterval(interval)
      
      const resData = response.data
      const firstCareer = resData.data && resData.data.length > 0 ? resData.data[0] : null
      
      if (firstCareer) {
        // Map backend response to UI state
        computedResult.value = {
          career: firstCareer.nombre,
          percentage: 92, // Randomly generated or provided by AI backend in the future
          description: resData.message || firstCareer.descripcion || 'Basado en tus elecciones, esta carrera es ideal para ti.',
          skills: [firstCareer.campoLaboral, 'Pensamiento crítico', 'Adaptación', 'Liderazgo'],
          color: '#1565C0',
          colorBg: 'bg-blue-50 border-blue-200 text-blue-900',
          icon: Cpu
        }
      } else {
        // Fallback if API returns empty list
        calculateResults()
      }
      currentStep.value = 7
    }, Math.max(0, 4500 - (textIndex * 1000))) // Wait at least 4.5s total

  } catch (error) {
    console.error('Error calling AI endpoint', error)
    clearInterval(interval)
    // Fallback to local calculation on error
    calculateResults()
    currentStep.value = 7
  }
}

const calculateResults = () => {
  // Count selections
  const counts: Record<string, number> = { sistemas: 0, arquitectura: 0, administracion: 0, psicologia: 0 }
  Object.values(selectedOptions.value).forEach(cat => {
    counts[cat] = (counts[cat] || 0) + 1
  })
  
  // Find category with highest count
  let topCategory = 'sistemas'
  let maxCount = -1
  Object.entries(counts).forEach(([cat, count]) => {
    if (count > maxCount) {
      maxCount = count
      topCategory = cat
    }
  })
  
  // Calculate percentage of matching
  const basePercentage = Math.round((maxCount / 5) * 60) + 35 // Scales between 35% and 95%
  
  if (topCategory === 'sistemas') {
    computedResult.value = {
      career: 'Ingeniería de Sistemas',
      percentage: basePercentage,
      description: 'Muestras una alta preferencia por el análisis lógico, la tecnología informática y el desarrollo de soluciones de software. Eres ideal para liderar la transformación digital mediante algoritmos, bases de datos e inteligencia artificial.',
      skills: ['Pensamiento lógico y algorítmico', 'Desarrollo y diseño de software', 'Análisis de datos y analítica web', 'Adaptación a tecnologías emergentes'],
      color: '#1565C0',
      colorBg: 'bg-blue-50 border-blue-200 text-blue-900',
      icon: Cpu
    }
  } else if (topCategory === 'arquitectura') {
    computedResult.value = {
      career: 'Arquitectura y Urbanismo',
      percentage: basePercentage,
      description: 'Destacas por tu sentido del diseño espacial, el modelado en tres dimensiones y la planificación estética. Tienes un perfil ideal para diseñar y construir espacios funcionales, sostenibles e integrados a la comunidad.',
      skills: ['Diseño y representación espacial', 'Modelado en 3D y maquetación digital', 'Creatividad artística y funcional', 'Planificación urbana sostenible'],
      color: '#B50E30',
      colorBg: 'bg-red-50 border-red-200 text-red-900',
      icon: Building2
    }
  } else if (topCategory === 'administracion') {
    computedResult.value = {
      career: 'Administración de Empresas',
      percentage: basePercentage,
      description: 'Tus decisiones reflejan visión estratégica, habilidades de liderazgo y un alto sentido para la gestión comercial. Estás preparado/a para dirigir proyectos, optimizar recursos empresariales y fundar startups innovadoras.',
      skills: ['Liderazgo y trabajo en equipo', 'Visión estratégica y comercial', 'Optimización de recursos financieros', 'Gestión de proyectos y negocios'],
      color: '#D4A017',
      colorBg: 'bg-amber-50 border-amber-200 text-amber-900',
      icon: Users2
    }
  } else {
    computedResult.value = {
      career: 'Psicología',
      percentage: basePercentage,
      description: 'Tienes un perfil orientado al bienestar humano, la empatía y la comprensión del comportamiento. Eres excelente escuchando y mediando, lo que te hace idóneo/a para la psicología clínica, educativa o de recursos humanos.',
      skills: ['Escucha activa y empatía profunda', 'Comprensión del comportamiento humano', 'Resolución pacífica de conflictos', 'Asesoramiento y soporte social'],
      color: '#2E7D32',
      colorBg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      icon: Heart
    }
  }
}

const saveAndRedirect = () => {
  // Save result to localStorage and update active auth user
  auth.updateCareerSuggestion(computedResult.value.career)
  router.push('/postulante')
}
</script>

<template>
  <DashboardLayout
    :sidebarItems="sidebarItems"
    title="NEXUS Test Vocacional"
    subtitle="Orientación Inteligente UTP"
    :breadcrumbs="[
      { label: 'Inicio', href: '/postulante' },
      { label: 'Test Vocacional' }
    ]"
    moduleColor="#B50E30"
  >
    <div class="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full">
      
      <!-- Step 0: Welcome Screen -->
      <Card v-if="currentStep === 0" class="border-[#D9D9D9] shadow-xl w-full p-4 sm:p-8 bg-white/95 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-full -mr-16 -mt-16 opacity-30" />
        <CardContent class="space-y-6 pt-6 text-center">
          <div class="w-20 h-20 bg-red-50 border border-red-200 rounded-3xl flex items-center justify-center mx-auto text-[#B50E30] animate-bounce">
            <Sparkles class="w-10 h-10 fill-red-50" />
          </div>
          
          <div class="space-y-2">
            <h1 class="text-3xl font-extrabold text-gray-900 leading-tight">Descubre tu Vocación Profesional</h1>
            <p class="text-gray-600 max-w-lg mx-auto text-base">
              NEXUS te acompaña a descubrir qué carrera se alinea mejor con tus talentos, pasiones y estilo de vida usando Inteligencia Artificial.
            </p>
          </div>

          <div class="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto py-4">
            <div class="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span class="text-2xl block mb-1">⏱️</span>
              <h3 class="font-bold text-gray-800 text-sm">Rápido</h3>
              <p class="text-xs text-gray-500 mt-1">Solo te tomará de 3 a 5 minutos completarlo.</p>
            </div>
            <div class="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span class="text-2xl block mb-1">🎯</span>
              <h3 class="font-bold text-gray-800 text-sm">Certero</h3>
              <p class="text-xs text-gray-500 mt-1">Basado en metodologías de orientación vocacional.</p>
            </div>
            <div class="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span class="text-2xl block mb-1">🤖</span>
              <h3 class="font-bold text-gray-800 text-sm">Inteligente</h3>
              <p class="text-xs text-gray-500 mt-1">Análisis predictivo de compatibilidad.</p>
            </div>
          </div>

          <Button size="lg" class="bg-[#B50E30] hover:bg-[#8F0B26] text-white font-bold rounded-xl px-8 py-6 shadow-md transition-transform hover:scale-[1.02]" @click="nextStep">
            Comenzar Evaluación
            <ArrowRight class="w-5 h-5 ml-2" />
          </Button>
        </CardContent>
      </Card>

      <!-- Step 1-5: Questions Screen -->
      <div v-else-if="currentStep >= 1 && currentStep <= 5" class="w-full space-y-6">
        <!-- Progress Bar and Steps Indicator -->
        <div class="flex items-center justify-between text-sm text-gray-500 font-medium">
          <span class="text-[#B50E30] font-bold">Pregunta {{ currentStep }} de 5</span>
          <span>{{ currentStep * 20 }}% completado</span>
        </div>
        <Progress :value="currentStep * 20" class="h-2.5 bg-gray-200" />

        <!-- Question Card -->
        <Card class="border-[#D9D9D9] shadow-xl bg-white">
          <CardHeader class="pb-2">
            <CardTitle class="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight">
              {{ questions[currentStep - 1].title }}
            </CardTitle>
            <CardDescription class="text-sm">Selecciona la alternativa con la que te sientas más identificado/a.</CardDescription>
          </CardHeader>
          
          <CardContent class="p-6 pt-4 space-y-4">
            <div class="grid gap-3">
              <div
                v-for="(option, idx) in questions[currentStep - 1].options"
                :key="idx"
                @click="handleSelect(currentStep, option.category)"
                :class="`flex items-start gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer hover:shadow-md ${
                  selectedOptions[currentStep] === option.category
                    ? 'border-[#B50E30] bg-red-50/40 ring-1 ring-[#B50E30]/10'
                    : 'border-gray-200 hover:border-red-200 hover:bg-slate-50/50'
                }`"
              >
                <!-- Option Icon -->
                <div :class="`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${option.color}`">
                  <component :is="option.icon" class="w-5 h-5" />
                </div>
                
                <div class="flex-1 min-w-0">
                  <p class="text-sm sm:text-base font-semibold text-gray-800 leading-snug mt-1.5">
                    {{ option.text }}
                  </p>
                </div>

                <!-- Check icon when selected -->
                <div class="shrink-0 self-center">
                  <span
                    class="w-6 h-6 rounded-full flex items-center justify-center border-2"
                    :class="selectedOptions[currentStep] === option.category ? 'border-[#B50E30] bg-[#B50E30] text-white' : 'border-gray-300'"
                  >
                    <Check v-if="selectedOptions[currentStep] === option.category" class="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>

            <!-- Navigation Buttons -->
            <div class="flex justify-between items-center pt-6 border-t border-gray-100">
              <Button variant="outline" class="border-gray-300 font-bold rounded-xl px-5 h-11" @click="prevStep">
                <ArrowLeft class="w-4 h-4 mr-2" />
                Atrás
              </Button>
              
              <Button
                class="bg-[#B50E30] hover:bg-[#8F0B26] text-white font-bold rounded-xl px-6 h-11"
                :disabled="!selectedOptions[currentStep]"
                @click="nextStep"
              >
                {{ currentStep === 5 ? 'Finalizar e Analizar' : 'Siguiente' }}
                <ArrowRight class="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Step 6: AI Scanning Animation -->
      <Card v-else-if="currentStep === 6" class="border-0 shadow-2xl bg-gradient-to-br from-[#8F0B26] to-[#4A0311] text-white w-full p-8 text-center overflow-hidden relative min-h-[400px] flex flex-col justify-center items-center">
        <!-- Floating dots animation -->
        <div class="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <CardContent class="space-y-6 flex flex-col items-center max-w-lg mx-auto">
          <!-- Multi-circle Radar scan animation -->
          <div class="relative w-28 h-28 mb-4">
            <div class="absolute inset-0 rounded-full border-4 border-red-500/20 animate-ping" />
            <div class="absolute inset-2 rounded-full border-4 border-red-400/40 animate-[ping_1.5s_infinite]" />
            <div class="absolute inset-4 rounded-full border-2 border-red-300/60 animate-pulse" />
            <div class="absolute inset-6 rounded-full bg-[#B50E30] flex items-center justify-center shadow-lg shadow-red-500/50">
              <Sparkles class="w-8 h-8 text-white animate-spin-slow" />
            </div>
          </div>

          <div class="space-y-2">
            <h2 class="text-2xl font-black tracking-tight text-white flex items-center justify-center gap-1.5">
              NEXUS Inteligencia Artificial
            </h2>
            <p class="text-red-200 text-sm font-medium animate-pulse mt-3 max-w-sm mx-auto min-h-[40px] leading-relaxed">
              {{ aiScanText }}
            </p>
          </div>

          <!-- Loading bar -->
          <div class="w-full max-w-xs bg-white/10 rounded-full h-1.5 overflow-hidden mt-2">
            <div class="bg-red-400 h-full rounded-full animate-[loading-bar_4s_ease-in-out_infinite]" style="width: 80%" />
          </div>
        </CardContent>
      </Card>

      <!-- Step 7: Results screen -->
      <Card v-else-if="currentStep === 7" class="border-[#D9D9D9] shadow-xl w-full p-6 sm:p-8 bg-white relative overflow-hidden">
        <!-- Confetti decoration background -->
        <div class="absolute top-0 right-0 w-40 h-40 bg-green-50 rounded-full -mr-20 -mt-20 opacity-40 pointer-events-none" />
        
        <CardContent class="space-y-6 pt-4">
          <div class="text-center">
            <Badge class="bg-green-100 text-green-800 border-green-200 font-extrabold px-3 py-1 rounded-full text-xs">
              🎯 Test Completado con Éxito
            </Badge>
            <h1 class="text-3xl font-extrabold text-gray-900 mt-2">Tu Recomendación Vocacional</h1>
            <p class="text-gray-500 text-sm max-w-md mx-auto mt-1">
              Basado en tus elecciones de resolución de problemas e intereses, NEXUS te recomienda la siguiente opción académica.
            </p>
          </div>

          <!-- Recomendación Principal Card -->
          <div :class="`border-2 rounded-2xl p-6 ${computedResult.colorBg} relative overflow-hidden`">
            <div class="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full -mr-10 -mt-10 opacity-30" />
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md text-blue-700">
                  <component :is="computedResult.icon" class="w-8 h-8" :style="{ color: computedResult.color }" />
                </div>
                <div>
                  <span class="text-xs font-bold uppercase tracking-wider text-gray-500">Carrera Recomendada</span>
                  <h2 class="text-2xl font-black leading-tight" :style="{ color: computedResult.color }">
                    {{ computedResult.career }}
                  </h2>
                </div>
              </div>
              
              <div class="bg-white px-4 py-2 rounded-2xl shadow-sm text-center border self-stretch sm:self-auto flex sm:flex-col justify-between items-center sm:justify-center">
                <span class="text-xs text-gray-500 font-bold uppercase tracking-wide">Afinidad IA</span>
                <span class="text-3xl font-black" :style="{ color: computedResult.color }">
                  {{ computedResult.percentage }}%
                </span>
              </div>
            </div>

            <p class="text-gray-700 text-sm mt-4 leading-relaxed font-medium">
              {{ computedResult.description }}
            </p>
          </div>

          <!-- Competencias Clave -->
          <div class="space-y-3">
            <h3 class="font-bold text-gray-800 text-base">Habilidades que destacan en tu perfil:</h3>
            <div class="grid sm:grid-cols-2 gap-3">
              <div
                v-for="(skill, idx) in computedResult.skills"
                :key="idx"
                class="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100"
              >
                <div class="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-green-700">
                  <Check class="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span class="text-xs sm:text-sm font-semibold text-gray-700 leading-snug">{{ skill }}</span>
              </div>
            </div>
          </div>

          <!-- Acciones Finales -->
          <div class="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
            <Button variant="outline" class="border-gray-300 font-bold rounded-xl h-12 flex-1" @click="currentStep = 0">
              Repetir Evaluación
            </Button>
            <Button
              class="bg-[#B50E30] hover:bg-[#8F0B26] text-white font-bold rounded-xl h-12 flex-1 gap-2 shadow-md"
              @click="saveAndRedirect"
            >
              Guardar en Perfil e Ir al Dashboard
              <ArrowRight class="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

    </div>
  </DashboardLayout>
</template>

<style scoped>
/* Custom animations */
.animate-spin-slow {
  animation: spin 8s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes loading-bar {
  0% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(20%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>

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
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const auth = useAuth()
const { t } = useI18n()

const sidebarItems = computed(() => [
  { icon: markRaw(Home), label: t('nav.home'), href: "/postulante" },
  { icon: markRaw(Brain), label: t('testVocacional.breadcrumb'), href: "/postulante/test" },
])

// Steps: 
// 0: Welcome
// 1-5: Questions
// 6: AI Scanning
// 7: Results
const currentStep = ref(0)

const questions = computed(() => [
  {
    id: 1,
    title: t('testVocacional.questions.q1.title'),
    options: [
      {
        text: t('testVocacional.questions.q1.o1'),
        category: "sistemas",
        icon: Cpu,
        color: "text-blue-600 bg-blue-50"
      },
      {
        text: t('testVocacional.questions.q1.o2'),
        category: "arquitectura",
        icon: Building2,
        color: "text-red-600 bg-red-50"
      },
      {
        text: t('testVocacional.questions.q1.o3'),
        category: "administracion",
        icon: Users2,
        color: "text-amber-600 bg-amber-50"
      },
      {
        text: t('testVocacional.questions.q1.o4'),
        category: "psicologia",
        icon: Heart,
        color: "text-emerald-600 bg-emerald-50"
      }
    ]
  },
  {
    id: 2,
    title: t('testVocacional.questions.q2.title'),
    options: [
      {
        text: t('testVocacional.questions.q2.o1'),
        category: "sistemas",
        icon: Brain,
        color: "text-blue-600 bg-blue-50"
      },
      {
        text: t('testVocacional.questions.q2.o2'),
        category: "arquitectura",
        icon: Compass,
        color: "text-red-600 bg-red-50"
      },
      {
        text: t('testVocacional.questions.q2.o3'),
        category: "administracion",
        icon: TrendingUp,
        color: "text-amber-600 bg-amber-50"
      },
      {
        text: t('testVocacional.questions.q2.o4'),
        category: "psicologia",
        icon: Users2,
        color: "text-emerald-600 bg-emerald-50"
      }
    ]
  },
  {
    id: 3,
    title: t('testVocacional.questions.q3.title'),
    options: [
      {
        text: t('testVocacional.questions.q3.o1'),
        category: "sistemas",
        icon: Cpu,
        color: "text-blue-600 bg-blue-50"
      },
      {
        text: t('testVocacional.questions.q3.o2'),
        category: "arquitectura",
        icon: Building2,
        color: "text-red-600 bg-red-50"
      },
      {
        text: t('testVocacional.questions.q3.o3'),
        category: "administracion",
        icon: Zap,
        color: "text-amber-600 bg-amber-50"
      },
      {
        text: t('testVocacional.questions.q3.o4'),
        category: "psicologia",
        icon: Heart,
        color: "text-emerald-600 bg-emerald-50"
      }
    ]
  },
  {
    id: 4,
    title: t('testVocacional.questions.q4.title'),
    options: [
      {
        text: t('testVocacional.questions.q4.o1'),
        category: "sistemas",
        icon: Cpu,
        color: "text-blue-600 bg-blue-50"
      },
      {
        text: t('testVocacional.questions.q4.o2'),
        category: "arquitectura",
        icon: Compass,
        color: "text-red-600 bg-red-50"
      },
      {
        text: t('testVocacional.questions.q4.o3'),
        category: "administracion",
        icon: TrendingUp,
        color: "text-amber-600 bg-amber-50"
      },
      {
        text: t('testVocacional.questions.q4.o4'),
        category: "psicologia",
        icon: Brain,
        color: "text-emerald-600 bg-emerald-50"
      }
    ]
  },
  {
    id: 5,
    title: t('testVocacional.questions.q5.title'),
    options: [
      {
        text: t('testVocacional.questions.q5.o1'),
        category: "sistemas",
        icon: Zap,
        color: "text-blue-600 bg-blue-50"
      },
      {
        text: t('testVocacional.questions.q5.o2'),
        category: "arquitectura",
        icon: Building2,
        color: "text-red-600 bg-red-50"
      },
      {
        text: t('testVocacional.questions.q5.o3'),
        category: "administracion",
        icon: Users2,
        color: "text-amber-600 bg-amber-50"
      },
      {
        text: t('testVocacional.questions.q5.o4'),
        category: "psicologia",
        icon: Heart,
        color: "text-emerald-600 bg-emerald-50"
      }
    ]
  }
])

const selectedOptions = ref<Record<number, string>>({})
const aiScanText = ref(t('testVocacional.ai_messages.m1'))
const computedResult = ref({
  career: t('testVocacional.careers.sistemas'),
  percentage: 95,
  description: t('testVocacional.careers.sistemas_desc'),
  skills: [t('testVocacional.careers.sistemas_s1'), t('testVocacional.careers.sistemas_s2'), t('testVocacional.careers.sistemas_s3'), t('testVocacional.careers.sistemas_s4')],
  color: '#082065',
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
    t('testVocacional.ai_messages.m1'),
    t('testVocacional.ai_messages.m2'),
    t('testVocacional.ai_messages.m3'),
    t('testVocacional.ai_messages.m4')
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
          color: '#082065',
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
      career: t('testVocacional.careers.sistemas'),
      percentage: basePercentage,
      description: t('testVocacional.careers.sistemas_desc'),
      skills: [t('testVocacional.careers.sistemas_s1'), t('testVocacional.careers.sistemas_s2'), t('testVocacional.careers.sistemas_s3'), t('testVocacional.careers.sistemas_s4')],
      color: '#082065',
      colorBg: 'bg-blue-50 border-blue-200 text-blue-900',
      icon: Cpu
    }
  } else if (topCategory === 'arquitectura') {
    computedResult.value = {
      career: t('testVocacional.careers.arquitectura'),
      percentage: basePercentage,
      description: t('testVocacional.careers.arquitectura_desc'),
      skills: [t('testVocacional.careers.arquitectura_s1'), t('testVocacional.careers.arquitectura_s2'), t('testVocacional.careers.arquitectura_s3'), t('testVocacional.careers.arquitectura_s4')],
      color: '#B50E30',
      colorBg: 'bg-red-50 border-red-200 text-red-900',
      icon: Building2
    }
  } else if (topCategory === 'administracion') {
    computedResult.value = {
      career: t('testVocacional.careers.administracion'),
      percentage: basePercentage,
<<<<<<< HEAD
      description: 'Tus decisiones reflejan visión estratégica, habilidades de liderazgo y un alto sentido para la gestión comercial. Estás preparado/a para dirigir proyectos, optimizar recursos empresariales y fundar startups innovadoras.',
      skills: ['Liderazgo y trabajo en equipo', 'Visión estratégica y comercial', 'Optimización de recursos financieros', 'Gestión de proyectos y negocios'],
      color: '#FFB20D',
=======
      description: t('testVocacional.careers.administracion_desc'),
      skills: [t('testVocacional.careers.administracion_s1'), t('testVocacional.careers.administracion_s2'), t('testVocacional.careers.administracion_s3'), t('testVocacional.careers.administracion_s4')],
      color: '#D4A017',
>>>>>>> 9e9480f0ebfe4d84286064d4259a62bd87af7fed
      colorBg: 'bg-amber-50 border-amber-200 text-amber-900',
      icon: Users2
    }
  } else {
    computedResult.value = {
      career: t('testVocacional.careers.psicologia'),
      percentage: basePercentage,
      description: t('testVocacional.careers.psicologia_desc'),
      skills: [t('testVocacional.careers.psicologia_s1'), t('testVocacional.careers.psicologia_s2'), t('testVocacional.careers.psicologia_s3'), t('testVocacional.careers.psicologia_s4')],
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
    :title="$t('testVocacional.title')"
    :subtitle="$t('testVocacional.subtitle')"
    :breadcrumbs="[
      { label: $t('nav.home'), href: '/postulante' },
      { label: $t('testVocacional.breadcrumb') }
    ]"
    moduleColor="#082065"
  >
    <div class="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full">
      
      <!-- Step 0: Welcome Screen -->
      <Card v-if="currentStep === 0" class="border-[#D9D9D9] shadow-xl w-full p-4 sm:p-8 bg-white/95 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -mr-16 -mt-16 opacity-30" />
        <CardContent class="space-y-6 pt-6 text-center">
          <div class="w-20 h-20 bg-blue-50 border border-blue-200 rounded-3xl flex items-center justify-center mx-auto text-blue-600 animate-bounce">
            <Sparkles class="w-10 h-10 fill-blue-50" />
          </div>
          
          <div class="space-y-2">
            <h1 class="text-3xl font-extrabold text-gray-900 leading-tight">{{ $t('testVocacional.welcome_title') }}</h1>
            <p class="text-gray-600 max-w-lg mx-auto text-base">
              {{ $t('testVocacional.welcome_desc') }}
            </p>
          </div>

          <div class="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto py-4">
            <div class="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span class="text-2xl block mb-1">⏱️</span>
              <h3 class="font-bold text-gray-800 text-sm">{{ $t('testVocacional.features.f1_title') }}</h3>
              <p class="text-xs text-gray-500 mt-1">{{ $t('testVocacional.features.f1_desc') }}</p>
            </div>
            <div class="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span class="text-2xl block mb-1">🎯</span>
              <h3 class="font-bold text-gray-800 text-sm">{{ $t('testVocacional.features.f2_title') }}</h3>
              <p class="text-xs text-gray-500 mt-1">{{ $t('testVocacional.features.f2_desc') }}</p>
            </div>
            <div class="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span class="text-2xl block mb-1">🤖</span>
              <h3 class="font-bold text-gray-800 text-sm">{{ $t('testVocacional.features.f3_title') }}</h3>
              <p class="text-xs text-gray-500 mt-1">{{ $t('testVocacional.features.f3_desc') }}</p>
            </div>
          </div>

          <Button size="lg" class="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl px-8 py-6 shadow-md transition-transform hover:scale-[1.02]" @click="nextStep">
            {{ $t('testVocacional.start_eval') }}
            <ArrowRight class="w-5 h-5 ml-2" />
          </Button>
        </CardContent>
      </Card>

      <!-- Step 1-5: Questions Screen -->
      <div v-else-if="currentStep >= 1 && currentStep <= 5" class="w-full space-y-6">
        <!-- Progress Bar and Steps Indicator -->
        <div class="flex items-center justify-between text-sm text-gray-500 font-medium">
          <span class="text-blue-700 font-bold">{{ $t('testVocacional.question_x_of_y', { current: currentStep, total: 5 }) }}</span>
          <span>{{ $t('testVocacional.pct_completed', { pct: currentStep * 20 }) }}</span>
        </div>
        <Progress :value="currentStep * 20" class="h-2.5 bg-gray-200" />

        <!-- Question Card -->
        <Card class="border-[#D9D9D9] shadow-xl bg-white">
          <CardHeader class="pb-2">
            <CardTitle class="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight">
              {{ questions[currentStep - 1].title }}
            </CardTitle>
            <CardDescription class="text-sm">{{ $t('testVocacional.select_option_desc') }}</CardDescription>
          </CardHeader>
          
          <CardContent class="p-6 pt-4 space-y-4">
            <div class="grid gap-3">
              <div
                v-for="(option, idx) in questions[currentStep - 1].options"
                :key="idx"
                @click="handleSelect(currentStep, option.category)"
                :class="`flex items-start gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer hover:shadow-md ${
                  selectedOptions[currentStep] === option.category
                    ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-500/10'
                    : 'border-gray-200 hover:border-blue-200 hover:bg-slate-50/50'
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
                    :class="selectedOptions[currentStep] === option.category ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'"
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
                {{ $t('testVocacional.btn_back') }}
              </Button>
              
              <Button
                class="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl px-6 h-11"
                :disabled="!selectedOptions[currentStep]"
                @click="nextStep"
              >
                {{ currentStep === 5 ? $t('testVocacional.btn_finish') : $t('testVocacional.btn_next') }}
                <ArrowRight class="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Step 6: AI Scanning Animation -->
      <Card v-else-if="currentStep === 6" class="border-0 shadow-2xl bg-gradient-to-br from-blue-900 to-[#0B1E3F] text-white w-full p-8 text-center overflow-hidden relative min-h-[400px] flex flex-col justify-center items-center">
        <!-- Floating dots animation -->
        <div class="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <CardContent class="space-y-6 flex flex-col items-center max-w-lg mx-auto">
          <!-- Multi-circle Radar scan animation -->
          <div class="relative w-28 h-28 mb-4">
            <div class="absolute inset-0 rounded-full border-4 border-blue-500/20 animate-ping" />
            <div class="absolute inset-2 rounded-full border-4 border-blue-400/40 animate-[ping_1.5s_infinite]" />
            <div class="absolute inset-4 rounded-full border-2 border-blue-300/60 animate-pulse" />
            <div class="absolute inset-6 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/50">
              <Sparkles class="w-8 h-8 text-white animate-spin-slow" />
            </div>
          </div>

          <div class="space-y-2">
            <h2 class="text-2xl font-black tracking-tight text-white flex items-center justify-center gap-1.5">
              {{ $t('testVocacional.ai_scanning_title') }}
            </h2>
            <p class="text-blue-200 text-sm font-medium animate-pulse mt-3 max-w-sm mx-auto min-h-[40px] leading-relaxed">
              {{ aiScanText }}
            </p>
          </div>

          <!-- Loading bar -->
          <div class="w-full max-w-xs bg-white/10 rounded-full h-1.5 overflow-hidden mt-2">
            <div class="bg-blue-400 h-full rounded-full animate-[loading-bar_4s_ease-in-out_infinite]" style="width: 80%" />
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
              {{ $t('testVocacional.result.completed_badge') }}
            </Badge>
            <h1 class="text-3xl font-extrabold text-gray-900 mt-2">{{ $t('testVocacional.result.title') }}</h1>
            <p class="text-gray-500 text-sm max-w-md mx-auto mt-1">
              {{ $t('testVocacional.result.desc') }}
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
                  <span class="text-xs font-bold uppercase tracking-wider text-gray-500">{{ $t('testVocacional.result.recommended_career_label') }}</span>
                  <h2 class="text-2xl font-black leading-tight" :style="{ color: computedResult.color }">
                    {{ computedResult.career }}
                  </h2>
                </div>
              </div>
              
              <div class="bg-white px-4 py-2 rounded-2xl shadow-sm text-center border self-stretch sm:self-auto flex sm:flex-col justify-between items-center sm:justify-center">
                <span class="text-xs text-gray-500 font-bold uppercase tracking-wide">{{ $t('testVocacional.result.ai_affinity') }}</span>
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
            <h3 class="font-bold text-gray-800 text-base">{{ $t('testVocacional.result.key_skills') }}</h3>
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
              {{ $t('testVocacional.result.btn_repeat') }}
            </Button>
            <Button
              class="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl h-12 flex-1 gap-2 shadow-md"
              @click="saveAndRedirect"
            >
              {{ $t('testVocacional.result.btn_save_go') }}
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

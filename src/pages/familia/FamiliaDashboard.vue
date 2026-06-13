<script setup lang="ts">
import { ref, markRaw, computed } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Home,
  TrendingUp,
  FileText,
  Download,
  CheckCircle2,
  Volume2,
  VolumeX,
  HelpCircle,
  Phone,
  Sparkles,
  ChevronDown,
  UserCheck
} from 'lucide-vue-next'
import { useAuth } from '@/lib/auth'
import { api } from '@/lib/api'
import { onMounted } from 'vue'
const auth = useAuth()

// Accessibility: default to true for non-tech-savvy users
const vistaFacil = ref(true)
const reproduciendoText = ref('')

// Voice Synthesis Helper
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

// Voice Synthesis Helper
const isApplicantLinked = computed(() => auth.state.user?.linkedStudentRole === 'postulante')
const isStudentLinked = computed(() => !isApplicantLinked.value)

// Student: Alejandro Lastra Torres
const studentMilestones = [
  { title: "Paso 1: Plan de acción creado", completed: true, date: "15 May 2026", desc: "Definimos los objetivos de Alejandro para elegir su carrera." },
  { title: "Paso 2: Primera evaluación", completed: true, date: "20 May 2026", desc: "Completó su primera prueba de gustos y preferencias." },
  { title: "Paso 3: Test de Fortalezas", completed: true, date: "5 Jun 2026", desc: "Identificó sus talentos en lógica y matemáticas." },
  { title: "Paso 4: Charla con tutor vocacional", completed: false, date: "Pendiente", desc: "Conversará 15 minutos en videollamada para resolver dudas." },
  { title: "Paso 5: Elección de su carrera", completed: false, date: "Pendiente", desc: "Decidirá la carrera final para iniciar su postulación." },
]

// Applicant: Camila Ramos
const applicantMilestones = ref([
  { title: "Paso 1: Test Vocacional Completado", completed: true, date: "12 Jun 2026", desc: "Camila completó la evaluación con 95% en Ingeniería de Sistemas." },
  { title: "Paso 2: Plan de Admisión UTP", completed: true, date: "13 Jun 2026", desc: "Se generó el plan de estudios adaptado a su perfil vocacional." },
  { title: "Paso 3: Envío de Documentos", completed: false, date: "Pendiente", desc: "Subir certificado de estudios de secundaria para evaluación preferencial." },
  { title: "Paso 4: Charla Informativa de Admisión", completed: false, date: "Pendiente", desc: "Charla interactiva en el campus sobre becas y financiamiento." },
  { title: "Paso 5: Matrícula e Ingreso", completed: false, date: "Pendiente", desc: "Formalización de ingreso a la Universidad Tecnológica del Perú." },
])

const applicantProgress = ref(100)

const fetchChildData = async () => {
  try {
    const childId = 1 // Mocked linked child ID
    // Check real test status
    const profileRes = await api.get(`/api/postulantes/${childId}`)
    const profile = profileRes.data.data
    
    if (profile) {
      applicantMilestones.value[0].completed = profile.cuestionarioCompletado
      applicantProgress.value = profile.cuestionarioCompletado ? 100 : 20
      
      // Use AI translator to translate the last technical entry if they have one
      if (profile.entradasBitacora && profile.entradasBitacora.length > 0) {
        const lastTechnicalLog = profile.entradasBitacora[0].titulo
        const translationRes = await api.get('/api/v1/ai/familia/traductor', {
          params: { logroTecnico: lastTechnicalLog }
        })
        
        // Add as a dynamic FAQ or milestone description
        applicantMilestones.value[1].desc = `Traducción IA del último avance: ${translationRes.data}`
      }
    }
  } catch (error) {
    console.error('Error fetching child data:', error)
  }
}

onMounted(() => {
  if (isApplicantLinked.value) {
    fetchChildData()
  }
})

// FAQs for Student (Alejandro)
const studentFaqs = [
  {
    q: "¿Cómo va Alejandro hoy en sus estudios?",
    a: "¡Va excelente! Ha completado 3 de los 5 grandes pasos y tiene un progreso general del 68%. Además, lleva 12 días seguidos entrando a estudiar.",
    voiceText: "Tu hijo Alejandro va excelente. Ha completado tres de los cinco grandes pasos de su camino y tiene un progreso total del sesenta y ocho por ciento. ¡Va muy bien!"
  },
  {
    q: "¿Qué carrera le recomienda la Inteligencia Artificial?",
    a: "Le recomienda Ingeniería de Sistemas, porque destaca en análisis de datos, tecnología y resolución de problemas matemáticos.",
    voiceText: "Le recomendamos Ingeniería de Sistemas. Alejandro muestra mucha habilidad para la tecnología, las matemáticas y la resolución de problemas."
  },
  {
    q: "¿Qué tareas le faltan por terminar?",
    a: "Le falta tener la charla con su tutor vocacional en línea y realizar la elección final de su carrera.",
    voiceText: "Tiene pendiente conversar con su tutor vocacional y tomar la decisión final de su carrera."
  }
]

// FAQs for Applicant (Camila)
const applicantFaqs = [
  {
    q: "¿Cómo le fue a Camila en su Test Vocacional?",
    a: "¡Muy bien! NEXUS IA analizó sus respuestas y determinó un 95% de afinidad con la carrera de Ingeniería de Sistemas por sus habilidades de resolución lógica.",
    voiceText: "A Camila le fue excelente. El sistema inteligente calculó noventa y cinco por ciento de afinidad con Ingeniería de Sistemas."
  },
  {
    q: "¿Cuál es el siguiente paso para su ingreso?",
    a: "Debe enviar su certificado de estudios escolares de secundaria para validar su ingreso directo por vía preferencial a la UTP.",
    voiceText: "El siguiente paso es enviar su certificado de estudios escolares para asegurar su ingreso preferencial."
  },
  {
    q: "¿Qué beneficios tiene por dar el test vocacional?",
    a: "Tiene acceso prioritario a charlas de admisión, visitas guiadas al laboratorio de computación y asesoría de becas UTP.",
    voiceText: "Tiene acceso preferencial a charlas en el campus y visitas guiadas a laboratorios de computación."
  }
]

const selectedFaq = ref<number | null>(null)

const toggleFaq = (index: number, isApp: boolean) => {
  const list = isApp ? applicantFaqs : studentFaqs
  if (selectedFaq.value === index) {
    selectedFaq.value = null
  } else {
    selectedFaq.value = index
    hablar(list[index].voiceText)
  }
}

const resources = [
  {
    title: "Guía fácil en PDF para Padres",
    description: "Manual sencillo con preguntas para conversar con tu hijo sin presionarlo.",
    downloads: 1243,
    icon: markRaw(FileText),
    color: "#B50E30",
  },
  {
    title: "Consejos de estudio en casa",
    description: "Cómo organizar un lugar tranquilo para que tu hijo estudie concentrado.",
    downloads: 1567,
    icon: markRaw(TrendingUp),
    color: "#1565C0",
  }
]

const parentTips = [
  "Felicita a tu hijo hoy por su constancia y esfuerzo de estudio. ¡Tu apoyo le dará más motivación!",
  "Pregúntale qué descubrió sobre sí mismo en el Test Vocacional. Escúchalo con atención e interés.",
  "Ayúdale a elegir un horario tranquilo para su videollamada de orientación académica."
]

const sidebarItems = [
  { icon: markRaw(Home), label: "Inicio", href: "/familia" },
  { icon: markRaw(TrendingUp), label: "Progreso de tu hijo", href: "/familia/progreso" },
]
</script>

<template>
  <DashboardLayout
    :sidebarItems="sidebarItems"
    title="Portal para Padres"
    subtitle="Acompaña a tu hijo en su camino profesional de forma fácil y accesible"
    :breadcrumbs="[{ label: 'Inicio' }]"
    moduleColor="#D4A017"
  >
    <div class="space-y-6">
      
      <!-- HEADER CON VISTA FÁCIL Y AUDIO -->
      <div class="bg-gradient-to-r from-amber-50 to-amber-100/50 p-5 rounded-2xl border border-amber-200/60 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-md shrink-0">
            <Sparkles class="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 class="font-extrabold text-gray-800" :class="vistaFacil ? 'text-xl' : 'text-lg'">Asistente de Lectura y Vista Grande</h3>
            <p class="text-xs text-gray-600 font-medium">Diseñado con botones grandes, explicaciones de voz y letra clara para su comodidad.</p>
          </div>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <button 
            @click="vistaFacil = !vistaFacil"
            class="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm border"
            :class="vistaFacil ? 'bg-amber-600 text-white border-amber-600 hover:bg-amber-700' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'"
          >
            <span class="w-2.5 h-2.5 rounded-full bg-green-400" v-if="vistaFacil"></span>
            {{ vistaFacil ? 'Letra Grande: Activada' : 'Activar Letra Grande' }}
          </button>
          
          <Button 
            @click="hablar(auth.state.user?.linkedStudentCode 
              ? `Bienvenido de vuelta. Estás viendo el progreso de tu hijo ${auth.state.user.studentName}. Su avance es del sesenta y ocho por ciento. Puedes pulsar las preguntas para escuchar más detalles.`
              : 'Bienvenido. Por favor, escribe en la casilla del centro el código de ocho dígitos de tu hijo. Por ejemplo, N E X, A L E, dos mil veintiséis.')"
            variant="outline" 
            class="gap-2 rounded-xl text-gray-800 border-amber-300 hover:bg-amber-50 text-sm font-bold h-11"
          >
            <component :is="reproduciendoText.length > 0 ? VolumeX : Volume2" class="w-4.5 h-4.5 text-amber-700" />
            {{ reproduciendoText.length > 0 ? 'Detener Voz' : 'Escuchar Instrucciones' }}
          </Button>
        </div>
      </div>

      <!-- ============================================== -->
      <!-- ALUMNO VINCULADO O POR DEFECTO -->
      <!-- ============================================== -->
      <div class="space-y-6">
        
        <!-- BANNER DE INFORMACIÓN DEL ESTUDIANTE CONECTADO -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-center text-amber-600">
              <UserCheck class="w-6 h-6" />
            </div>
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-gray-500">Hijo(a) conectado/a actualmente:</span>
              <h2 class="font-black text-gray-900 leading-none" :class="vistaFacil ? 'text-2xl' : 'text-xl'">
                {{ auth.state.user?.studentName || 'Alejandro Lastra Torres' }} 
                <Badge class="ml-2 bg-amber-100 text-amber-800 border-amber-200 font-extrabold text-[10px] uppercase">
                  {{ isStudentLinked ? 'Estudiante UTP' : 'Postulante / Admisión' }}
                </Badge>
              </h2>
            </div>
          </div>
        </div>

        <!-- ============================================== -->
        <!-- SUB-CASO B1: EL ALUMNO ES ESTUDIANTE (ALEJANDRO) -->
        <!-- ============================================== -->
        <div v-if="isStudentLinked" class="space-y-6">
          <div class="grid md:grid-cols-[1.5fr_1fr] gap-6">
            <!-- Semáforo de Estado Simplificado -->
            <Card class="border-2 border-emerald-300 bg-emerald-50/30 p-6 rounded-2xl shadow-sm space-y-4">
              <div class="flex items-center gap-2.5">
                <span class="w-4 h-4 rounded-full bg-emerald-500 animate-pulse"></span>
                <span class="text-sm font-extrabold text-emerald-800 uppercase tracking-wider">Estado: Excelente y Al Día</span>
              </div>
              <h2 class="font-black text-gray-900 leading-tight" :class="vistaFacil ? 'text-3xl' : 'text-2xl'">
                ¡Alejandro va por muy buen camino!
              </h2>
              <p class="text-gray-700 leading-relaxed" :class="vistaFacil ? 'text-lg' : 'text-base'">
                Ha completado el <strong>68%</strong> de su plan de estudios vocacionales de este ciclo. No tiene tareas pendientes ni faltas registradas en sus cursos de Ingeniería de Sistemas.
              </p>
              <div class="pt-2">
                <a href="/familia/progreso" class="text-emerald-700 hover:text-emerald-800 font-black text-sm underline flex items-center gap-1">
                  Ver detalle completo de sus notas y exámenes &rarr;
                </a>
              </div>
            </Card>

            <!-- Resumen de Notas en Gráfica Simple -->
            <Card class="p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between items-center text-center">
              <span class="text-sm font-bold uppercase tracking-wider text-gray-500">Progreso Total</span>
              <div class="my-4 relative flex items-center justify-center">
                <div class="text-6xl font-black text-emerald-600">68%</div>
              </div>
              <Progress :value="68" class="h-3.5 w-full bg-emerald-100" />
              <span class="text-xs text-gray-500 font-bold mt-2">Faltan solo 2 pasos para completar el ciclo académico</span>
            </Card>
          </div>

          <!-- Milestones / Lista de Pasos del Estudiante -->
          <Card class="border-gray-200 shadow-sm">
            <CardHeader class="p-5 border-b border-gray-100">
              <CardTitle class="font-extrabold text-gray-900 flex items-center gap-2" :class="vistaFacil ? 'text-xl' : 'text-lg'">
                <TrendingUp class="w-5 h-5 text-blue-600" />
                Pasos dados en este periodo académico
              </CardTitle>
              <CardDescription :class="vistaFacil ? 'text-base' : 'text-sm'">
                Visualiza el avance de tu hijo en cada fase del ciclo. Las tareas marcadas en verde ya fueron completadas y aprobadas.
              </CardDescription>
            </CardHeader>
            <CardContent class="p-5 space-y-4">
              <div class="relative pl-6 border-l-2 border-gray-200 space-y-4 ml-3">
                <div v-for="(m, idx) in studentMilestones" :key="idx" class="relative">
                  <span class="absolute -left-[35px] top-1 w-6 h-6 rounded-full flex items-center justify-center border-2 font-bold text-xs"
                    :class="m.completed ? 'bg-emerald-500 border-emerald-100 text-white' : 'bg-white border-gray-300 text-gray-400'">
                    <CheckCircle2 v-if="m.completed" class="w-4 h-4 fill-white text-emerald-500" />
                    <span v-else>•</span>
                  </span>
                  <div class="p-4 rounded-xl border" :class="m.completed ? 'border-emerald-200 bg-emerald-50/10' : 'border-gray-100 bg-gray-50/30 opacity-75'">
                    <h4 class="font-bold text-gray-900" :class="vistaFacil ? 'text-lg' : 'text-base'">{{ m.title }}</h4>
                    <p class="text-gray-600 text-xs sm:text-sm mt-0.5">{{ m.desc }}</p>
                    <Badge class="mt-2 text-[10px] font-bold" :class="m.completed ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-600'">
                      {{ m.completed ? 'Completado' : 'Pendiente' }}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- FAQs / Preguntas del Portal de Estudiante -->
          <Card class="border-gray-200 shadow-sm">
            <CardHeader class="p-5 border-b border-gray-100 bg-amber-50/10">
              <CardTitle class="font-extrabold text-gray-900 flex items-center gap-2" :class="vistaFacil ? 'text-xl' : 'text-lg'">
                <HelpCircle class="w-5 h-5 text-amber-600" />
                Preguntas frecuentes de Alejandro
              </CardTitle>
            </CardHeader>
            <CardContent class="p-5 space-y-3">
              <div 
                v-for="(faq, i) in studentFaqs" 
                :key="i"
                class="border rounded-xl cursor-pointer hover:border-amber-400 hover:bg-amber-50/10 transition-all overflow-hidden"
                :class="selectedFaq === i ? 'border-amber-500 bg-amber-50/20' : 'border-gray-200'"
                @click="toggleFaq(i, false)"
              >
                <div class="p-4 flex items-center justify-between font-bold text-gray-800" :class="vistaFacil ? 'text-lg' : 'text-sm'">
                  <span>{{ faq.q }}</span>
                  <ChevronDown class="w-4 h-4" />
                </div>
                <div v-if="selectedFaq === i" class="px-4 pb-4 border-t border-amber-100 pt-2 bg-white text-gray-700 leading-relaxed" :class="vistaFacil ? 'text-base' : 'text-sm'">
                  {{ faq.a }}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- ============================================== -->
        <!-- SUB-CASO B2: EL ALUMNO ES POSTULANTE (CAMILA) -->
        <!-- ============================================== -->
        <div v-if="isApplicantLinked" class="space-y-6">
          <div class="grid md:grid-cols-[1.5fr_1fr] gap-6">
            <!-- Semáforo de Estado para Admisión -->
            <Card class="border-2 border-blue-300 bg-blue-50/30 p-6 rounded-2xl shadow-sm space-y-4">
              <div class="flex items-center gap-2.5">
                <span class="w-4 h-4 rounded-full bg-blue-500 animate-pulse"></span>
                <span class="text-sm font-extrabold text-blue-800 uppercase tracking-wider">Admisión: Proceso Iniciado</span>
              </div>
              <h2 class="font-black text-gray-900 leading-tight" :class="vistaFacil ? 'text-3xl' : 'text-2xl'">
                Camila completó su Test Vocacional
              </h2>
              <p class="text-gray-700 leading-relaxed" :class="vistaFacil ? 'text-lg' : 'text-base'">
                El sistema de Inteligencia Artificial evaluó el perfil de Camila Ramos y recomendó la carrera de **Ingeniería de Sistemas** con **95% de afinidad**. Está en la fase de recopilación de requisitos de ingreso directo.
              </p>
              <div class="pt-2">
                <Badge class="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-3 py-1 rounded-full text-xs">
                  Afinidad UTP: Ingeniería de Sistemas (95%)
                </Badge>
              </div>
            </Card>

            <!-- Detalle de Progreso Vocacional -->
            <Card class="p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between items-center text-center bg-gradient-to-b from-slate-50 to-white">
              <span class="text-sm font-bold uppercase tracking-wider text-gray-500">Progreso Vocacional</span>
              <div class="my-4 text-center">
                <div class="text-6xl font-black text-blue-600">{{ applicantProgress }}%</div>
                <span class="text-xs font-bold text-emerald-600 block mt-1">✓ Test Vocacional {{ applicantProgress === 100 ? 'Completado' : 'Pendiente' }}</span>
              </div>
              <Progress :value="applicantProgress" class="h-3.5 w-full bg-blue-100" />
              <span class="text-[11px] text-gray-500 font-bold mt-2">Siguiente paso: Presentación de certificado escolar</span>
            </Card>
          </div>

          <!-- Milestones de Admisión -->
          <Card class="border-gray-200 shadow-sm">
            <CardHeader class="p-5 border-b border-gray-100">
              <CardTitle class="font-extrabold text-gray-900 flex items-center gap-2" :class="vistaFacil ? 'text-xl' : 'text-lg'">
                <TrendingUp class="w-5 h-5 text-blue-600" />
                Camino de Admisión y Vocación de Camila
              </CardTitle>
              <CardDescription :class="vistaFacil ? 'text-base' : 'text-sm'">
                Muestra los pasos requeridos para que Camila complete su ingreso y matrícula en la UTP.
              </CardDescription>
            </CardHeader>
            <CardContent class="p-5 space-y-4">
              <div class="relative pl-6 border-l-2 border-gray-200 space-y-4 ml-3">
                <div v-for="(m, idx) in applicantMilestones" :key="idx" class="relative">
                  <span class="absolute -left-[35px] top-1 w-6 h-6 rounded-full flex items-center justify-center border-2 font-bold text-xs"
                    :class="m.completed ? 'bg-blue-600 border-blue-100 text-white' : 'bg-white border-gray-300 text-gray-400'">
                    <CheckCircle2 v-if="m.completed" class="w-4 h-4 fill-white text-blue-600" />
                    <span v-else>•</span>
                  </span>
                  <div class="p-4 rounded-xl border" :class="m.completed ? 'border-blue-200 bg-blue-50/10' : 'border-gray-100 bg-gray-50/30 opacity-75'">
                    <h4 class="font-bold text-gray-900" :class="vistaFacil ? 'text-lg' : 'text-base'">{{ m.title }}</h4>
                    <p class="text-gray-600 text-xs sm:text-sm mt-0.5">{{ m.desc }}</p>
                    <Badge class="mt-2 text-[10px] font-bold" :class="m.completed ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'">
                      {{ m.completed ? 'Listo' : 'Próximamente' }}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- FAQs del Postulante -->
          <Card class="border-gray-200 shadow-sm">
            <CardHeader class="p-5 border-b border-gray-100 bg-blue-50/10">
              <CardTitle class="font-extrabold text-gray-900 flex items-center gap-2" :class="vistaFacil ? 'text-xl' : 'text-lg'">
                <HelpCircle class="w-5 h-5 text-blue-600" />
                Preguntas frecuentes de Admisión de Camila
              </CardTitle>
            </CardHeader>
            <CardContent class="p-5 space-y-3">
              <div 
                v-for="(faq, i) in applicantFaqs" 
                :key="i"
                class="border rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/10 transition-all overflow-hidden"
                :class="selectedFaq === i ? 'border-blue-500 bg-blue-50/20' : 'border-gray-200'"
                @click="toggleFaq(i, true)"
              >
                <div class="p-4 flex items-center justify-between font-bold text-gray-800" :class="vistaFacil ? 'text-lg' : 'text-sm'">
                  <span>{{ faq.q }}</span>
                  <ChevronDown class="w-4 h-4" />
                </div>
                <div v-if="selectedFaq === i" class="px-4 pb-4 border-t border-blue-100 pt-2 bg-white text-gray-700 leading-relaxed" :class="vistaFacil ? 'text-base' : 'text-sm'">
                  {{ faq.a }}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- RECURSOS Y GUÍAS ADICIONALES PARA PADRES (COMÚN) -->
        <div class="grid md:grid-cols-2 gap-6">
          <Card class="border-gray-200 shadow-sm">
            <CardHeader class="p-5">
              <CardTitle class="font-extrabold text-gray-900 text-lg">Guías Útiles y Consejos Simples</CardTitle>
              <CardDescription>Material muy sencillo que puedes descargar o imprimir para apoyar a tu hijo.</CardDescription>
            </CardHeader>
            <CardContent class="p-5 pt-0 space-y-4">
              <div 
                v-for="(res, idx) in resources" 
                :key="idx"
                class="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors"
              >
                <div class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" :style="{ backgroundColor: `${res.color}15` }">
                  <component :is="res.icon" class="w-6 h-6" :style="{ color: res.color }" />
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="font-bold text-gray-900 text-base">{{ res.title }}</h4>
                  <p class="text-sm text-gray-600 mt-1 leading-snug">{{ res.description }}</p>
                  <div class="flex items-center justify-between mt-3">
                    <span class="text-xs text-gray-500">{{ res.downloads.toLocaleString() }} descargas</span>
                    <Button size="sm" variant="outline" class="gap-1.5 font-bold rounded-xl text-xs h-8 border-gray-300">
                      <Download class="w-3.5 h-3.5 text-gray-600" />
                      Descargar PDF
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card class="border-gray-200 shadow-sm flex flex-col justify-between bg-blue-50/5">
            <div>
              <CardHeader class="p-5">
                <CardTitle class="font-extrabold text-gray-900 text-lg">Consejos Diarios para la Familia</CardTitle>
                <CardDescription>Pequeñas sugerencias de psicólogos de la UTP para acompañar a tu hijo/a.</CardDescription>
              </CardHeader>
              <CardContent class="p-5 pt-0 space-y-3">
                <div v-for="(tip, idx) in parentTips" :key="idx" class="p-4 rounded-xl bg-white border border-gray-100 shadow-sm flex gap-3 items-start">
                  <span class="text-amber-500 text-lg">💡</span>
                  <p class="text-sm font-semibold text-gray-700 leading-relaxed">{{ tip }}</p>
                </div>
              </CardContent>
            </div>
            <div class="p-4 bg-gray-50 border-t border-gray-100 rounded-b-xl flex items-center justify-between">
              <span class="text-xs text-gray-600 font-bold">¿Tienes dudas rápidas?</span>
              <a href="tel:+51987654321" class="text-amber-700 hover:text-amber-800 text-xs font-black underline flex items-center gap-1">
                <Phone class="w-3.5 h-3.5" />
                Llamar Soporte Padres
              </a>
            </div>
          </Card>
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

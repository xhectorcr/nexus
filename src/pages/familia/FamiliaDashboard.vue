<script setup lang="ts">
import { ref, markRaw } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Home,
  TrendingUp,
  FileText,
  Heart,
  Download,
  CheckCircle2,
  Circle,
  Plus,
  ThumbsUp,
  MessageCircle,
  Volume2,
  VolumeX,
  HelpCircle,
  Phone,
  Sparkles,
  UserCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-vue-next'

const vistaFacil = ref(true)
const reproduciendoText = ref('')

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

const sidebarItems = [
  { icon: markRaw(Home), label: "Inicio", href: "/familia" },
  { icon: markRaw(TrendingUp), label: "Progreso de tu hijo", href: "/familia/progreso" },
]

const milestones = [
  { title: "Paso 1: Plan de acción creado", completed: true, date: "15 May 2026", desc: "Definimos los objetivos de Alejandro para elegir su carrera." },
  { title: "Paso 2: Primera evaluación", completed: true, date: "20 May 2026", desc: "Completó su primera prueba de gustos y preferencias." },
  { title: "Paso 3: Test de Fortalezas", completed: true, date: "5 Jun 2026", desc: "Identificó sus talentos en lógica y matemáticas." },
  { title: "Paso 4: Charla con tutor vocacional", completed: false, date: "Pendiente", desc: "Conversará 15 minutos en videollamada para resolver dudas." },
  { title: "Paso 5: Elección de su carrera", completed: false, date: "Pendiente", desc: "Decidirá la carrera final para iniciar su postulación." },
]

const faqs = [
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
  },
  {
    q: "¿Cómo puedo contactar a un asesor o ayuda?",
    a: "Puedes llamarnos directamente a nuestra línea telefónica preferencial para padres: +51 987 654 321. Estamos aquí para guiarte sin complicaciones.",
    voiceText: "Llámanos con total confianza a nuestro número exclusivo para padres: nueve ocho siete, seis cinco cuatro, tres dos uno. Te atenderemos con mucho gusto."
  }
]

const selectedFaq = ref<number | null>(null)

const toggleFaq = (index: number) => {
  if (selectedFaq.value === index) {
    selectedFaq.value = null
  } else {
    selectedFaq.value = index
    hablar(faqs[index].voiceText)
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
  "Felicita a Alejandro hoy por sus 12 días seguidos de estudio. ¡Saber que lo apoyas le dará más motivación!",
  "Pregúntale qué descubrió sobre sí mismo en el Test de Fortalezas. Escúchalo con atención e interés.",
  "Ayúdale a elegir un horario tranquilo para su videollamada con el tutor vocacional."
]

const forumPosts = [
  {
    user: "María Prado (Mamá de Luis)",
    question: "¿Cómo puedo motivar a mi hijo sin que sienta que lo estoy presionando a decidir?",
    replies: 12,
    likes: 24,
    time: "hace 2 horas",
  },
  {
    user: "Carlos Rivas (Papá de Sofía)",
    question: "Mi hija está indecisa entre dos carreras. ¿El simulador de NEXUS realmente ayuda?",
    replies: 8,
    likes: 15,
    time: "hace 5 horas",
  }
]

const categories = ["Consejos", "Dudas de Carreras", "Apoyo en Casa", "Testimonios"]

const stats = [
  { label: "Avance del camino", value: "68%", desc: "Más de la mitad completado", color: "#2E7D32" },
  { label: "Pasos logrados", value: "3 de 5", desc: "Faltan solo 2 pasos", color: "#1565C0" },
  { label: "Estudio diario", value: "12 días", desc: "¡Muy buena constancia!", color: "#B50E30" }
]
</script>

<template>
  <DashboardLayout
    :sidebarItems="sidebarItems"
    title="Portal para Padres"
    subtitle="Acompaña a tu hijo en la elección de su carrera profesional de forma fácil"
    :breadcrumbs="[
      { label: 'Inicio', href: '/' },
      { label: 'Familia' },
    ]"
    moduleColor="#D4A017"
  >
    <div class="space-y-6">
      
      <!-- Barra de Accesibilidad y Voz -->
      <div class="bg-gradient-to-r from-amber-50 to-amber-100/50 p-4 rounded-2xl border border-amber-200/60 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-white shadow-md">
            <Sparkles class="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 class="font-bold text-gray-800 text-lg">Asistente Visual y de Voz</h3>
            <p class="text-xs text-gray-600">Diseñado especialmente para leer sin manuales y escuchar la información.</p>
          </div>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <!-- Toggle Vista Fácil -->
          <button 
            @click="vistaFacil = !vistaFacil"
            class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm"
            :class="vistaFacil ? 'bg-amber-600 text-white hover:bg-amber-700' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'"
          >
            <span class="w-2.5 h-2.5 rounded-full bg-green-400" v-if="vistaFacil"></span>
            {{ vistaFacil ? 'Vista Fácil: Activada' : 'Activar Vista Fácil (Letra Grande)' }}
          </button>
          
          <!-- Botón de Audio Resumen -->
          <Button 
            @click="hablar('Bienvenido al portal para padres de NEXUS. Tu hijo Alejandro va excelente, ha completado tres de cinco pasos y lleva un progreso del sesenta y ocho por ciento. Te sugerimos felicitarlo por su esfuerzo.')"
            variant="outline" 
            class="gap-2 rounded-xl text-gray-800 border-amber-300 hover:bg-amber-50 text-sm font-semibold h-10"
          >
            <component :is="reproduciendoText.startsWith('Bienvenido') ? VolumeX : Volume2" class="w-4 h-4 text-amber-700" />
            {{ reproduciendoText.startsWith('Bienvenido') ? 'Detener Voz' : 'Escuchar Resumen de Voz' }}
          </Button>
        </div>
      </div>

      <!-- Tarjeta Principal de Estado de mi Hijo (Semáforo) -->
      <div class="grid md:grid-cols-3 gap-6">
        <!-- Semáforo de Estado -->
        <Card 
          class="md:col-span-2 border-2 relative overflow-hidden transition-all duration-300"
          :class="[
            vistaFacil ? 'p-6 shadow-md' : 'p-4',
            'border-emerald-300 bg-emerald-50/40'
          ]"
        >
          <div class="absolute top-0 right-0 w-24 h-24 bg-emerald-100 rounded-full -mr-8 -mt-8 opacity-40"></div>
          <CardContent class="p-0 flex flex-col md:flex-row items-start md:items-center gap-5 justify-between">
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <span class="w-4.5 h-4.5 rounded-full bg-emerald-500 animate-ping absolute"></span>
                <span class="w-4.5 h-4.5 rounded-full bg-emerald-500 inline-block relative"></span>
                <span class="text-sm font-bold text-emerald-800 uppercase tracking-wide">Estado de tu Hijo: Al Día</span>
              </div>
              <h2 class="font-extrabold text-gray-900 leading-tight" :class="vistaFacil ? 'text-3xl' : 'text-2xl'">
                ¡Alejandro va súper bien!
              </h2>
              <p class="text-gray-700 leading-relaxed" :class="vistaFacil ? 'text-lg' : 'text-base'">
                Ha completado el <strong>68%</strong> de su ruta vocacional. Muestra un avance constante y no tiene retrasos en sus tareas del colegio.
              </p>
              <div class="flex items-center gap-2 pt-2">
                <Badge class="bg-blue-600 text-white hover:bg-blue-700 font-semibold px-3 py-1 rounded-full text-xs">
                  Sugerencia IA: Ingeniería de Sistemas
                </Badge>
                <a href="/familia/progreso" class="text-emerald-700 hover:text-emerald-800 font-bold text-sm underline flex items-center gap-1">
                  Ver detalle completo de sus notas &rarr;
                </a>
              </div>
            </div>
            
            <div class="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm flex flex-col items-center justify-center w-full md:w-36 text-center shrink-0">
              <span class="text-5xl font-black text-emerald-600">68%</span>
              <span class="text-xs text-gray-500 font-medium mt-1">Avance Total</span>
              <Progress :value="68" class="h-2 w-full mt-3 bg-emerald-100" />
            </div>
          </CardContent>
        </Card>

        <!-- Tarjeta de Consejos Rápidos para Padres -->
        <Card 
          class="border-blue-200 bg-blue-50/30 overflow-hidden"
          :class="vistaFacil ? 'p-6 shadow-md' : 'p-4'"
        >
          <div class="space-y-4">
            <div class="flex items-center gap-2">
              <Heart class="w-5 h-5 text-blue-600 fill-blue-600" />
              <h3 class="font-bold text-gray-800 text-lg">¿Cómo ayudar a tu hijo hoy?</h3>
            </div>
            <div class="space-y-3">
              <div 
                v-for="(tip, idx) in parentTips.slice(0, 2)" 
                :key="idx"
                class="flex items-start gap-2.5 text-gray-700 leading-normal"
                :class="vistaFacil ? 'text-base' : 'text-sm'"
              >
                <span class="text-blue-600 font-bold text-lg">&bull;</span>
                <p>{{ tip }}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <!-- Preguntas Rápidas e Interactivas -->
      <Card class="border-amber-200 shadow-sm">
        <CardHeader class="border-b border-amber-100 bg-amber-50/20 p-5">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <CardTitle class="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                <HelpCircle class="w-5 h-5 text-amber-600" />
                ¿Qué deseas saber hoy sobre el progreso de tu hijo?
              </CardTitle>
              <CardDescription class="text-gray-600" :class="vistaFacil ? 'text-base' : 'text-sm'">
                Toca cualquier pregunta y te responderemos de forma muy sencilla y clara.
              </CardDescription>
            </div>
            <Badge class="bg-amber-100 text-amber-800 border-amber-200 font-bold px-3 py-1 rounded-full text-xs">
              Con audio lector
            </Badge>
          </div>
        </CardHeader>
        <CardContent class="p-5 space-y-4">
          <div class="grid md:grid-cols-2 gap-4">
            <div 
              v-for="(faq, i) in faqs" 
              :key="i"
              class="border rounded-2xl transition-all duration-200 overflow-hidden cursor-pointer"
              :class="[
                selectedFaq === i 
                  ? 'border-amber-500 bg-amber-50/30 ring-2 ring-amber-500/20 shadow-sm' 
                  : 'border-gray-200 hover:border-amber-300 hover:bg-gray-50/50'
              ]"
              @click="toggleFaq(i)"
            >
              <div class="p-4 flex items-center justify-between gap-3">
                <span class="font-bold text-gray-800 text-left" :class="vistaFacil ? 'text-lg' : 'text-base'">
                  {{ faq.q }}
                </span>
                <div class="shrink-0 p-1.5 rounded-full bg-gray-100 text-gray-600">
                  <component :is="selectedFaq === i ? ChevronUp : ChevronDown" class="w-4 h-4" />
                </div>
              </div>
              
              <div 
                v-if="selectedFaq === i" 
                class="px-4 pb-4 pt-1 bg-white border-t border-amber-100 transition-all duration-300"
              >
                <p class="text-gray-700 leading-relaxed mb-3" :class="vistaFacil ? 'text-lg' : 'text-base'">
                  {{ faq.a }}
                </p>
                <div class="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    class="bg-amber-100 hover:bg-amber-200 text-amber-900 gap-1.5 font-bold rounded-xl text-xs h-8"
                    @click.stop="hablar(faq.voiceText)"
                  >
                    <component :is="reproduciendoText === faq.voiceText ? VolumeX : Volume2" class="w-3.5 h-3.5" />
                    {{ reproduciendoText === faq.voiceText ? 'Detener voz' : 'Escuchar respuesta' }}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- El Camino de Alejandro (Milestones) -->
      <Card class="border-gray-200 shadow-sm">
        <CardHeader class="p-5">
          <CardTitle class="text-xl font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp class="w-5 h-5 text-blue-600" />
            El camino vocacional de Alejandro paso a paso
          </CardTitle>
          <CardDescription :class="vistaFacil ? 'text-base' : 'text-sm'" class="text-gray-600">
            Aquí ves los 5 pasos que tu hijo debe dar para elegir su carrera profesional. Los marcados en verde ya están listos.
          </CardDescription>
        </CardHeader>
        <CardContent class="p-5 pt-0">
          <div class="relative pl-6 border-l-2 border-gray-200 space-y-6 ml-3">
            <div 
              v-for="(milestone, i) in milestones" 
              :key="i"
              class="relative"
            >
              <!-- Indicator dot -->
              <span 
                class="absolute -left-10 top-1.5 w-6.5 h-6.5 rounded-full flex items-center justify-center border-4 shadow-sm"
                :class="[
                  milestone.completed 
                    ? 'bg-emerald-500 border-emerald-100 text-white' 
                    : 'bg-white border-gray-300 text-gray-400'
                ]"
              >
                <CheckCircle2 v-if="milestone.completed" class="w-4 h-4 fill-white text-emerald-500" />
                <span v-else class="w-2.5 h-2.5 rounded-full bg-gray-300"></span>
              </span>

              <div 
                class="p-4 rounded-2xl border transition-all"
                :class="[
                  milestone.completed 
                    ? 'border-emerald-200 bg-emerald-50/20' 
                    : 'border-gray-100 bg-gray-50/30 opacity-75'
                ]"
              >
                <div class="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <h4 
                    class="font-bold text-gray-900"
                    :class="[
                      vistaFacil ? 'text-lg' : 'text-base',
                      milestone.completed ? 'text-emerald-900' : 'text-gray-700'
                    ]"
                  >
                    {{ milestone.title }}
                  </h4>
                  <Badge 
                    class="font-semibold px-2.5 py-0.5 rounded-full text-xs"
                    :class="milestone.completed ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-gray-200 text-gray-600'"
                  >
                    {{ milestone.completed ? '¡Logrado!' : 'Por hacer' }}
                  </Badge>
                </div>
                <p class="text-gray-600" :class="vistaFacil ? 'text-base' : 'text-sm'">
                  {{ milestone.desc }}
                </p>
                <p class="text-xs text-gray-500 font-medium mt-2 flex items-center gap-1">
                  <span>Fecha:</span> 
                  <span class="font-semibold">{{ milestone.date }}</span>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Guías y Apoyo de Padres -->
      <div class="grid md:grid-cols-2 gap-6">
        <!-- Recursos -->
        <Card class="border-gray-200 shadow-sm">
          <CardHeader class="p-5">
            <CardTitle class="text-lg font-bold text-gray-900">Guías Útiles para Padres</CardTitle>
            <CardDescription class="text-gray-600">Material muy sencillo y gratuito que puedes guardar o imprimir.</CardDescription>
          </CardHeader>
          <CardContent class="p-5 pt-0 space-y-4">
            <div 
              v-for="(res, idx) in resources" 
              :key="idx"
              class="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors"
            >
              <div 
                class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                :style="{ backgroundColor: `${res.color}15` }"
              >
                <component :is="res.icon" class="w-6 h-6" :style="{ color: res.color }" />
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="font-bold text-gray-900 text-base">{{ res.title }}</h4>
                <p class="text-sm text-gray-600 mt-1 leading-snug">{{ res.description }}</p>
                <div class="flex items-center justify-between mt-3">
                  <span class="text-xs text-gray-500">{{ res.downloads.toLocaleString() }} descargas</span>
                  <Button size="sm" variant="outline" class="gap-1.5 font-bold rounded-xl text-xs h-8 border-gray-300">
                    <Download class="w-3.5 h-3.5 text-gray-600" />
                    Descargar Guía
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Comunidad de Padres / Foro -->
        <Card class="border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <CardHeader class="p-5">
              <div class="flex items-center justify-between gap-3">
                <CardTitle class="text-lg font-bold text-gray-900">Preguntar a otros Padres</CardTitle>
                <Button size="sm" class="bg-amber-600 hover:bg-amber-700 font-bold rounded-xl text-xs h-8 text-white">
                  <Plus class="w-3.5 h-3.5 mr-1" />
                  Nueva Pregunta
                </Button>
              </div>
              <CardDescription class="text-gray-600">Comunidad privada y segura de NEXUS para compartir experiencias y dudas.</CardDescription>
            </CardHeader>
            <CardContent class="p-5 pt-0 space-y-3">
              <div 
                v-for="(post, i) in forumPosts" 
                :key="i"
                class="p-3.5 rounded-xl border border-gray-100 bg-white shadow-sm"
              >
                <div class="flex items-center gap-2 mb-1">
                  <Avatar class="w-6 h-6">
                    <AvatarFallback class="bg-amber-600 text-white text-[10px] font-bold">
                      {{ post.user[0] }}
                    </AvatarFallback>
                  </Avatar>
                  <span class="font-bold text-xs text-gray-700">{{ post.user }}</span>
                  <span class="text-[10px] text-gray-500">• {{ post.time }}</span>
                </div>
                <p class="text-gray-800 font-medium text-sm leading-snug mb-2">{{ post.question }}</p>
                <div class="flex items-center gap-3 text-xs text-gray-500">
                  <button class="flex items-center gap-1 hover:text-amber-600 transition-colors font-medium">
                    <ThumbsUp class="w-3.5 h-3.5 text-gray-400" />
                    {{ post.likes }} me gusta
                  </button>
                  <button class="flex items-center gap-1 hover:text-amber-600 transition-colors font-medium">
                    <MessageCircle class="w-3.5 h-3.5 text-gray-400" />
                    {{ post.replies }} respuestas
                  </button>
                </div>
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
  </DashboardLayout>
</template>

<style scoped>
/* Transición suave */
.transition-all {
  transition: all 0.25s ease;
}
</style>

<script setup lang="ts">
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import {
  CheckCircle2,
  ChevronDown,
  Download,
  FileText,
  HelpCircle,
  Home,
  Phone,
  Sparkles,
  TrendingUp,
  UserCheck,
  Volume2,
  VolumeX,
  KeyRound,
  ArrowRight,
  Info
} from "lucide-vue-next";
import { computed, markRaw, onMounted, ref } from "vue";
const auth = useAuth();

const vistaFacil = ref(true);
const reproduciendoText = ref("");

// Vinculación State
const pinCode = ref("");
const pinError = ref("");
const isLoading = ref(false);

const isLinked = computed(() => !!auth.state.user?.linkedStudentCode);

const handleLinkStudent = () => {
  if (!pinCode.value) {
    pinError.value = "Por favor, ingresa el código del estudiante.";
    return;
  }
  
  isLoading.value = true;
  pinError.value = "";
  
  setTimeout(() => {
    const success = auth.linkStudent(pinCode.value);
    if (!success) {
      pinError.value = "Código inválido. Por favor, verifica el código (ej. NEX-ALE-2026).";
    } else {
      pinCode.value = "";
      if (isApplicantLinked.value) fetchChildData();
      hablar("¡Excelente! Has vinculado correctamente a tu hijo.");
    }
    isLoading.value = false;
  }, 800);
};

const hablar = (texto: string) => {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  reproduciendoText.value = texto;
  const utterance = new SpeechSynthesisUtterance(texto);
  utterance.lang = "es-PE";
  utterance.rate = 0.95;
  utterance.pitch = 1;
  utterance.onend = () => {
    reproduciendoText.value = "";
  };
  window.speechSynthesis.speak(utterance);
};

const detenerLectura = () => {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    reproduciendoText.value = "";
  }
};

const isApplicantLinked = computed(
  () => auth.state.user?.linkedStudentRole === "postulante",
);
const isStudentLinked = computed(() => auth.state.user?.linkedStudentRole === "estudiante");

const studentMilestones = [
  {
    title: "Paso 1: Plan de acción creado",
    completed: true,
    date: "15 May 2026",
    desc: "Definimos los objetivos de Alejandro para elegir su carrera.",
  },
  {
    title: "Paso 2: Primera evaluación",
    completed: true,
    date: "20 May 2026",
    desc: "Completó su primera prueba de gustos y preferencias.",
  },
  {
    title: "Paso 3: Test de Fortalezas",
    completed: true,
    date: "5 Jun 2026",
    desc: "Identificó sus talentos en lógica y matemáticas.",
  },
  {
    title: "Paso 4: Charla con tutor vocacional",
    completed: false,
    date: "Pendiente",
    desc: "Conversará 15 minutos en videollamada para resolver dudas.",
  },
  {
    title: "Paso 5: Elección de su carrera",
    completed: false,
    date: "Pendiente",
    desc: "Decidirá la carrera final para iniciar su postulación.",
  },
];

const applicantMilestones = ref([
  {
    title: "Paso 1: Test Vocacional",
    completed: true,
    date: "12 Jun 2026",
    desc: "Camila completó la evaluación con 95% en Ingeniería de Sistemas.",
  },
  {
    title: "Paso 2: Plan de Admisión UTP",
    completed: true,
    date: "13 Jun 2026",
    desc: "Se generó el plan de estudios adaptado a su perfil vocacional.",
  },
  {
    title: "Paso 3: Certificado de Estudios",
    completed: false,
    date: "Pendiente",
    desc: "Falta subir el certificado de estudios de secundaria para evaluación.",
  },
  {
    title: "Paso 4: Charla Informativa",
    completed: false,
    date: "Pendiente",
    desc: "Asistir a la charla en el campus sobre becas y financiamiento.",
  },
]);

const applicantProgress = ref(100);

const fetchChildData = async () => {
  try {
    const childId = 1;
    const profileRes = await api.get(`/api/postulantes/${childId}`);
    const profile = profileRes.data.data;

    if (profile) {
      applicantMilestones.value[0].completed = profile.cuestionarioCompletado;
      applicantProgress.value = profile.cuestionarioCompletado ? 100 : 20;
    }
  } catch (error) {
    console.warn("Error fetching child data (API may not be running):", error);
  }
};

onMounted(() => {
  if (isApplicantLinked.value) {
    fetchChildData();
  }
});

const studentFaqs = [
  {
    q: "¿Cómo va Alejandro hoy?",
    a: "¡Va excelente! Ha completado 3 de los 5 grandes pasos y tiene un progreso general del 68%.",
    voiceText: "Tu hijo Alejandro va excelente. Ha completado tres de los cinco grandes pasos.",
  },
  {
    q: "¿Qué carrera le recomienda la IA?",
    a: "Le recomienda Ingeniería de Sistemas, porque destaca en análisis de datos y tecnología.",
    voiceText: "Le recomendamos Ingeniería de Sistemas. Alejandro muestra mucha habilidad para la tecnología.",
  },
  {
    q: "¿Qué tareas le faltan por terminar?",
    a: "Le falta tener la charla con su tutor vocacional en línea y realizar la elección final.",
    voiceText: "Tiene pendiente conversar con su tutor vocacional y tomar la decisión final.",
  },
];

const applicantFaqs = [
  {
    q: "¿Cómo le fue en el Test Vocacional?",
    a: "¡Muy bien! Determinó un 95% de afinidad con la carrera de Ingeniería de Sistemas.",
    voiceText: "Le fue excelente. El sistema inteligente calculó noventa y cinco por ciento de afinidad con Ingeniería de Sistemas.",
  },
  {
    q: "¿Cuál es el siguiente paso?",
    a: "Debe enviar su certificado de estudios escolares de secundaria para validar su ingreso directo.",
    voiceText: "El siguiente paso es enviar su certificado de estudios escolares para asegurar su ingreso preferencial.",
  },
];

const selectedFaq = ref<number | null>(null);

const toggleFaq = (index: number) => {
  selectedFaq.value = selectedFaq.value === index ? null : index;
};

const toggleInstrucciones = () => {
  if (reproduciendoText.value) {
    detenerLectura();
    return;
  }
  
  if (!isLinked.value) {
    hablar("Bienvenido. Por favor, escribe en la casilla del centro el código de ocho dígitos de tu hijo para ver su progreso.");
  } else {
    hablar(
      `Bienvenido de vuelta. Estás viendo el progreso de tu hijo ${auth.state.user?.studentName}. Puedes pulsar las preguntas para escuchar más detalles.`
    );
  }
};

const resources = [
  {
    title: "Guía fácil en PDF para Padres",
    description: "Manual sencillo con preguntas para conversar con tu hijo.",
    downloads: 1243,
    icon: markRaw(FileText),
    color: "#B50E30",
  },
  {
    title: "Consejos de estudio en casa",
    description: "Cómo organizar un lugar tranquilo para que tu hijo estudie.",
    downloads: 1567,
    icon: markRaw(TrendingUp),
    color: "#082065",
  },
];

const parentTips = [
  "Felicita a tu hijo hoy por su esfuerzo. ¡Tu apoyo le dará más motivación!",
  "Pregúntale qué descubrió sobre sí mismo en el Test Vocacional.",
];

const sidebarItems = [
  { icon: markRaw(Home), label: "Inicio", href: "/familia" },
  {
    icon: markRaw(TrendingUp),
    label: "Progreso de tu hijo",
    href: "/familia/progreso",
  },
];
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
      
      <!-- TOP BAR: ASISTENTE DE VOZ (COMÚN) -->
      <div
        class="flex flex-col items-center justify-between gap-4 p-5 border shadow-sm bg-gradient-to-r from-amber-50 to-amber-100/50 rounded-2xl border-amber-200/60 md:flex-row"
      >
        <div class="flex items-center gap-3">
          <div
            class="flex items-center justify-center w-12 h-12 text-white shadow-md bg-amber-500 rounded-2xl shrink-0"
          >
            <Sparkles class="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 class="font-extrabold text-gray-800" :class="vistaFacil ? 'text-xl' : 'text-lg'">
              Asistente de Lectura y Vista Grande
            </h3>
            <p class="text-xs font-medium text-gray-600">
              Diseñado con botones grandes y explicaciones de voz para su comodidad.
            </p>
          </div>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <button
            @click="vistaFacil = !vistaFacil"
            class="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm border"
            :class="
              vistaFacil
                ? 'bg-amber-600 text-white border-amber-600 hover:bg-amber-700'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
            "
          >
            <span class="w-2.5 h-2.5 rounded-full bg-green-400" v-if="vistaFacil"></span>
            {{ vistaFacil ? "Letra Grande: Activada" : "Activar Letra Grande" }}
          </button>

          <Button
            @click="toggleInstrucciones"
            variant="outline"
            class="gap-2 text-sm font-bold text-gray-800 rounded-xl border-amber-300 hover:bg-amber-50 h-11"
          >
            <component
              :is="reproduciendoText.length > 0 ? VolumeX : Volume2"
              class="w-4.5 h-4.5 text-amber-700"
            />
            {{ reproduciendoText.length > 0 ? "Detener Voz" : "Escuchar Instrucciones" }}
          </Button>
        </div>
      </div>

      <!-- ============================================== -->
      <!-- PANTALLA DE VINCULACIÓN (CUANDO NO HAY ALUMNO) -->
      <!-- ============================================== -->
      <div v-if="!isLinked" class="flex flex-col items-center justify-center py-12">
        <Card class="w-full max-w-lg shadow-xl border-amber-200/60 rounded-2xl overflow-hidden">
          <div class="h-2 w-full bg-gradient-to-r from-amber-400 to-amber-600"></div>
          <CardHeader class="text-center pb-2 pt-8">
            <div class="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4 shadow-inner">
              <UserCheck class="w-8 h-8 text-amber-600" />
            </div>
            <CardTitle class="text-2xl font-black text-gray-900">Vincula la cuenta de tu hijo</CardTitle>
            <CardDescription class="text-base text-gray-600 mt-2">
              Para poder ver su progreso, tareas y recomendaciones, necesitamos que ingreses su código único.
            </CardDescription>
          </CardHeader>
          
          <CardContent class="p-8 pt-6 space-y-6">
            <div class="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex gap-3 text-sm text-blue-800">
              <Info class="w-5 h-5 shrink-0 text-blue-500" />
              <p>
                <strong>¿Dónde encuentro este código?</strong><br/>
                Tu hijo/a puede encontrar su código de 12 caracteres (ej: NEX-ALE-2026) en su perfil de estudiante dentro de la plataforma NEXUS.
              </p>
            </div>

            <div class="space-y-3">
              <label for="pinCode" class="block text-sm font-extrabold text-gray-700 uppercase tracking-wide">
                Código del Estudiante
              </label>
              <div class="relative">
                <KeyRound class="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-4 top-1/2" />
                <Input
                  id="pinCode"
                  v-model="pinCode"
                  placeholder="Ej. NEX-ALE-2026"
                  class="pl-12 h-14 text-lg font-bold border-gray-300 focus:border-amber-500 focus:ring-amber-500 rounded-xl"
                  @keyup.enter="handleLinkStudent"
                />
              </div>
              <p v-if="pinError" class="text-red-600 font-bold text-sm bg-red-50 p-2 rounded-lg border border-red-100 flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-red-600"></span> {{ pinError }}
              </p>
            </div>

            <Button
              @click="handleLinkStudent"
              class="w-full h-14 text-lg font-black text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              :disabled="isLoading"
            >
              <span v-if="isLoading" class="border-2 border-white border-t-transparent animate-spin rounded-full w-5 h-5"></span>
              <span v-else class="flex items-center gap-2">Vincular y Continuar <ArrowRight class="w-5 h-5" /></span>
            </Button>
          </CardContent>
        </Card>
      </div>

      <!-- ============================================== -->
      <!-- DASHBOARD (CUANDO SÍ HAY ALUMNO) -->
      <!-- ============================================== -->
      <div v-else class="space-y-6 animate-in fade-in zoom-in-95 duration-500">
        
        <!-- HEADER ALUMNO -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-white border border-gray-200 shadow-sm rounded-2xl relative overflow-hidden">
          <div class="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-amber-50 to-transparent pointer-events-none"></div>
          
          <div class="flex items-center gap-5 z-10">
            <div class="w-16 h-16 rounded-full bg-amber-100 border-4 border-amber-50 flex items-center justify-center text-amber-700 shadow-sm">
              <span class="text-2xl font-black">{{ auth.state.user?.studentName?.charAt(0) || 'A' }}</span>
            </div>
            <div>
              <span class="text-sm font-bold tracking-wider text-gray-500 uppercase">Hijo(a) Conectado(a)</span>
              <h2 class="font-black text-gray-900 mt-1" :class="vistaFacil ? 'text-3xl' : 'text-2xl'">
                {{ auth.state.user?.studentName }}
              </h2>
              <Badge class="mt-2 bg-amber-100 text-amber-800 border-amber-200 font-extrabold text-xs uppercase px-3 py-1">
                {{ isStudentLinked ? "Estudiante UTP" : "Postulante / Admisión" }}
              </Badge>
            </div>
          </div>
          
          <div class="z-10">
            <Button variant="outline" @click="auth.unlinkStudent()" class="text-gray-500 hover:text-red-600 border-gray-200 text-xs font-bold rounded-xl">
              Desvincular Alumno
            </Button>
          </div>
        </div>

        <!-- MAIN CONTENT COLUMNS -->
        <div class="grid lg:grid-cols-[2fr_1fr] gap-6">
          
          <!-- LEFT COLUMN: PROGRESO Y PASOS -->
          <div class="space-y-6">
            
            <!-- TARJETA: ESTADO PRINCIPAL (Semáforo) -->
            <Card class="p-6 md:p-8 border-2 shadow-sm rounded-2xl bg-white relative overflow-hidden"
              :class="isStudentLinked ? 'border-emerald-300 bg-emerald-50/10' : 'border-blue-300 bg-blue-50/10'">
              
              <div class="absolute -right-10 -top-10 w-40 h-40 rounded-full blur-3xl opacity-50"
                :class="isStudentLinked ? 'bg-emerald-300' : 'bg-blue-300'"></div>

              <div class="relative z-10">
                <div class="flex items-center gap-3 mb-4">
                  <span class="w-4 h-4 rounded-full animate-pulse" :class="isStudentLinked ? 'bg-emerald-500' : 'bg-blue-500'"></span>
                  <span class="text-sm font-black tracking-wider uppercase" :class="isStudentLinked ? 'text-emerald-800' : 'text-blue-800'">
                    Estado: ¡Al Día!
                  </span>
                </div>
                
                <h2 class="font-black leading-tight text-gray-900 mb-3" :class="vistaFacil ? 'text-3xl' : 'text-2xl'">
                  {{ isStudentLinked ? '¡Alejandro va por muy buen camino!' : '¡Camila completó su Test Vocacional!' }}
                </h2>
                
                <p class="leading-relaxed text-gray-700 max-w-2xl" :class="vistaFacil ? 'text-xl' : 'text-lg'">
                  <span v-if="isStudentLinked">
                    Ha completado el <strong>68%</strong> de su plan. No tiene tareas atrasadas. El siguiente paso es muy sencillo y solo tomará 15 minutos de su tiempo.
                  </span>
                  <span v-else>
                    El sistema inteligente recomendó la carrera de <strong>Ingeniería de Sistemas</strong> con <strong>95% de afinidad</strong>.
                  </span>
                </p>

                <!-- CALL TO ACTION / NEXT STEP -->
                <div class="mt-6 p-5 rounded-xl border flex items-start gap-4 shadow-sm bg-white"
                     :class="isStudentLinked ? 'border-emerald-200' : 'border-blue-200'">
                  <div class="p-2 rounded-lg bg-gray-100 shrink-0">
                    <ArrowRight class="w-6 h-6 text-gray-700" />
                  </div>
                  <div>
                    <h4 class="font-black text-gray-900" :class="vistaFacil ? 'text-xl' : 'text-lg'">Siguiente Tarea de tu Hijo/a:</h4>
                    <p class="text-gray-700 mt-1 font-medium" :class="vistaFacil ? 'text-lg' : 'text-base'">
                      {{ isStudentLinked 
                        ? "Conversar 15 minutos en videollamada con su tutor vocacional."
                        : "Subir su certificado de estudios escolares de secundaria." 
                      }}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <!-- TARJETA: LÍNEA DE TIEMPO (TIMELINE) -->
            <Card class="border-gray-200 shadow-sm rounded-2xl overflow-hidden bg-white">
              <CardHeader class="p-6 border-b border-gray-100 bg-gray-50/50">
                <CardTitle class="flex items-center gap-3 font-black text-gray-900" :class="vistaFacil ? 'text-2xl' : 'text-xl'">
                  <TrendingUp class="w-6 h-6 text-amber-600" />
                  Camino de Progreso
                </CardTitle>
                <CardDescription :class="vistaFacil ? 'text-lg' : 'text-base'" class="text-gray-600 font-medium">
                  Revisa qué pasos ya completó tu hijo y cuáles faltan para terminar este ciclo.
                </CardDescription>
              </CardHeader>
              
              <CardContent class="p-6">
                <div class="relative pl-6 ml-4 border-l-[3px] border-gray-100 space-y-8">
                  <div v-for="(m, idx) in (isStudentLinked ? studentMilestones : applicantMilestones)" :key="idx" class="relative">
                    
                    <!-- Milestone Dot -->
                    <span class="absolute -left-[35px] top-1 w-7 h-7 rounded-full flex items-center justify-center border-4"
                      :class="m.completed ? 'bg-amber-500 border-white shadow-sm z-10' : 'bg-gray-200 border-white text-gray-400'">
                      <CheckCircle2 v-if="m.completed" class="w-5 h-5 text-white" />
                    </span>
                    
                    <!-- Milestone Content -->
                    <div class="transition-all" :class="m.completed ? 'opacity-100' : 'opacity-60'">
                      <h4 class="font-black text-gray-900" :class="vistaFacil ? 'text-xl' : 'text-lg'">
                        {{ m.title }}
                      </h4>
                      <p class="text-gray-600 mt-1 font-medium" :class="vistaFacil ? 'text-lg' : 'text-base'">
                        {{ m.desc }}
                      </p>
                      
                      <div class="mt-2">
                        <Badge v-if="m.completed" class="bg-emerald-100 text-emerald-800 border-emerald-200 font-extrabold px-2.5 py-0.5">
                          ✓ Completado
                        </Badge>
                        <Badge v-else class="bg-gray-100 text-gray-600 border-gray-200 font-extrabold px-2.5 py-0.5">
                          ⏳ Próximamente
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
          </div>

          <!-- RIGHT COLUMN: FAQS & RECURSOS -->
          <div class="space-y-6">
            
            <!-- TARJETA: FAQS -->
            <Card class="border-gray-200 shadow-sm rounded-2xl bg-white">
              <CardHeader class="p-5 border-b border-gray-100">
                <CardTitle class="flex items-center gap-2 font-black text-gray-900 text-lg">
                  <HelpCircle class="w-5 h-5 text-amber-600" />
                  Dudas Comunes
                </CardTitle>
              </CardHeader>
              <CardContent class="p-4 space-y-3">
                <div v-for="(faq, i) in (isStudentLinked ? studentFaqs : applicantFaqs)" :key="i"
                  class="border border-gray-200 rounded-xl overflow-hidden transition-all bg-gray-50 hover:border-amber-300"
                  :class="selectedFaq === i ? 'ring-2 ring-amber-500 border-transparent bg-white shadow-sm' : ''"
                >
                  <button @click="toggleFaq(i)" class="w-full flex items-center justify-between p-4 text-left font-bold text-gray-800 focus:outline-none">
                    <span :class="vistaFacil ? 'text-base' : 'text-sm'">{{ faq.q }}</span>
                    <ChevronDown class="w-5 h-5 text-gray-400 transition-transform" :class="selectedFaq === i ? 'rotate-180 text-amber-500' : ''" />
                  </button>
                  <div v-if="selectedFaq === i" class="px-4 pb-4 border-t border-gray-100 mt-1 pt-3 text-gray-600 font-medium leading-relaxed" :class="vistaFacil ? 'text-base' : 'text-sm'">
                    {{ faq.a }}
                    <div class="mt-3 flex gap-2">
                      <Button size="sm" variant="secondary" class="h-8 font-bold text-xs gap-1.5 bg-amber-100 text-amber-800 hover:bg-amber-200" @click.stop="hablar(faq.voiceText)">
                        <Volume2 class="w-3.5 h-3.5" /> Escuchar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <!-- TARJETA: RECURSOS -->
            <Card class="border-gray-200 shadow-sm rounded-2xl bg-white">
              <CardHeader class="p-5 border-b border-gray-100">
                <CardTitle class="text-lg font-black text-gray-900">Ayuda para Padres</CardTitle>
              </CardHeader>
              <CardContent class="p-0">
                <div class="divide-y divide-gray-100">
                  <div v-for="(res, idx) in resources" :key="idx" class="p-5 hover:bg-gray-50 transition-colors">
                    <div class="flex gap-3">
                      <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" :style="{ backgroundColor: `${res.color}15`, color: res.color }">
                        <component :is="res.icon" class="w-5 h-5" />
                      </div>
                      <div>
                        <h4 class="font-bold text-gray-900 text-sm">{{ res.title }}</h4>
                        <p class="text-xs text-gray-600 mt-1 mb-2">{{ res.description }}</p>
                        <Button size="sm" variant="outline" class="h-7 text-xs font-bold gap-1.5 rounded-lg border-gray-300">
                          <Download class="w-3 h-3" /> Descargar PDF
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- CONTACT SUPPORT -->
                <div class="p-4 bg-amber-50 rounded-b-2xl border-t border-amber-100 flex items-center justify-between">
                  <span class="text-xs font-black text-amber-800 uppercase tracking-wider">¿Dudas rápidas?</span>
                  <a href="tel:+51987654321" class="flex items-center gap-1.5 text-xs font-black text-amber-600 hover:text-amber-700 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-amber-200">
                    <Phone class="w-3.5 h-3.5" /> Llamar Soporte
                  </a>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>

    </div>
  </DashboardLayout>
</template>

<style scoped>
.transition-all {
  transition: all 0.3s ease;
}
</style>

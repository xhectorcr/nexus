<script setup lang="ts">
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Activity, ArrowLeft, ArrowRight, Bot, Brain, BookOpen, Building2, Check, Compass, Cpu, FileText, Gamepad2, Heart, Home, Lightbulb, Loader2, MessageCircle, Network, ShieldAlert, Sparkles, TrendingUp, UploadCloud, Users2, XCircle, Zap, MessageSquare } from "lucide-vue-next";
import { computed, markRaw, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

const router = useRouter();
const auth = useAuth();
const { t } = useI18n();

const sidebarItems = computed(() => [
  {
    icon: markRaw(Home),
    label: t("nav.home") || "Inicio",
    href: "/postulante",
  },
  {
    icon: markRaw(Brain),
    label: t("nav.vocational_tests") || "Tests",
    href: "/postulante/test",
  },
  {
    icon: markRaw(Gamepad2),
    label: t("postulante.labyrinth") || "Laberinto",
    href: "/postulante/laberinto",
  },
  {
    icon: markRaw(BookOpen),
    label: t("postulante.digital_log") || "Bitácora",
    href: "/postulante/bitacora",
  },
  {
    icon: markRaw(MessageCircle),
    label: t("postulante.p2p_connection") || "Conexión P2P",
    href: "/postulante/p2p",
  },
  {
    icon: markRaw(MessageSquare),
    label: "Foro UTP+",
    href: "/postulante/foro",
  },
]);

const currentStep = ref(0);
const isProfileComplete = ref<boolean | null>(null);
const aiReaction = ref<string>("");

import { onMounted } from "vue";

onMounted(async () => {
  try {
    const userId = auth.state.user?.id;
    if (!userId) return;

    const [informeRes, postulanteRes] = await Promise.all([
      api.get(`/api/informes-vocacionales/by-usuario/${userId}`),
      api.get(`/api/postulantes/by-usuario/${userId}`)
    ]);

    const informe = informeRes.data?.data;
    const postulante = postulanteRes.data?.data;

    // Verificar que todos los campos del perfil estén llenos
    if (
      informe &&
      informe.intereses &&
      informe.inteligenciasMultiples &&
      informe.inteligenciaEmocional &&
      informe.personalidad &&
      informe.razonamientoAbstracto &&
      informe.perseverancia &&
      postulante &&
      postulante.carrerasInteres &&
      postulante.carrerasInteres.length > 0
    ) {
      isProfileComplete.value = true;
    } else {
      isProfileComplete.value = false;
    }
  } catch (error) {
    console.error("Error validando el perfil:", error);
    isProfileComplete.value = false;
  }
});

// ==========================================
// PREGUNTAS SITUACIONALES (NIVEL AVANZADO)
// ==========================================
const questions = computed(() => [
  {
    id: 1,
    categoryLabel: "Módulo 1: Resolución de Crisis",
    title:
      "El servidor principal colapsa en pleno lanzamiento de un producto. ¿Cuál es tu reacción inmediata?",
    options: [
      {
        text: "Analizar los logs del sistema para aislar el error lógico.",
        category: "sistemas",
        icon: Activity,
        color: "from-blue-500 to-blue-600",
      },
      {
        text: "Diseñar un plan de contingencia visual para informar al cliente.",
        category: "arquitectura",
        icon: Compass,
        color: "from-red-500 to-red-600",
      },
      {
        text: "Organizar al equipo, delegar tareas y gestionar los tiempos.",
        category: "administracion",
        icon: ShieldAlert,
        color: "from-amber-500 to-amber-600",
      },
      {
        text: "Calmar al equipo para evitar el pánico y mantener la moral alta.",
        category: "psicologia",
        icon: Heart,
        color: "from-emerald-500 to-emerald-600",
      },
    ],
  },
  {
    id: 2,
    categoryLabel: "Módulo 2: Visión y Optimización",
    title:
      "Te entregan un proyecto que funciona, pero es un desastre internamente. ¿Qué haces?",
    options: [
      {
        text: "Refactorizar y automatizar los procesos ineficientes.",
        category: "sistemas",
        icon: Cpu,
        color: "from-blue-500 to-blue-600",
      },
      {
        text: "Rediseñar la estructura para que sea estética y funcional.",
        category: "arquitectura",
        icon: Building2,
        color: "from-red-500 to-red-600",
      },
      {
        text: "Revisar el presupuesto y ver si es rentable arreglarlo ahora.",
        category: "administracion",
        icon: TrendingUp,
        color: "from-amber-500 to-amber-600",
      },
      {
        text: "Entrevistar a los usuarios para entender por qué se hizo así.",
        category: "psicologia",
        icon: Users2,
        color: "from-emerald-500 to-emerald-600",
      },
    ],
  },
  {
    id: 3,
    categoryLabel: "Módulo 3: Dinámicas de Equipo",
    title:
      "Dos miembros clave de tu equipo tienen un conflicto que detiene el proyecto. ¿Cómo procedes?",
    options: [
      {
        text: "Busco una solución objetiva basada en datos y resultados.",
        category: "sistemas",
        icon: Network,
        color: "from-blue-500 to-blue-600",
      },
      {
        text: "Propongo una sesión de brainstorming para integrar ambas ideas.",
        category: "arquitectura",
        icon: Lightbulb,
        color: "from-red-500 to-red-600",
      },
      {
        text: "Tomo una decisión ejecutiva rápida para no perder más dinero.",
        category: "administracion",
        icon: Zap,
        color: "from-amber-500 to-amber-600",
      },
      {
        text: "Organizo una mediación privada para resolver el tema de raíz.",
        category: "psicologia",
        icon: MessageCircle,
        color: "from-emerald-500 to-emerald-600",
      },
    ],
  },
  {
    id: 4,
    categoryLabel: "Módulo 4: Innovación",
    title:
      "Tu empresa te da carta blanca para liderar un proyecto de innovación. ¿En qué te enfocas?",
    options: [
      {
        text: "Implementar Inteligencia Artificial o nuevas tecnologías.",
        category: "sistemas",
        icon: Brain,
        color: "from-blue-500 to-blue-600",
      },
      {
        text: "Crear un producto con un diseño revolucionario y sostenible.",
        category: "arquitectura",
        icon: Compass,
        color: "from-red-500 to-red-600",
      },
      {
        text: "Abrir un nuevo mercado que multiplique las ganancias.",
        category: "administracion",
        icon: TrendingUp,
        color: "from-amber-500 to-amber-600",
      },
      {
        text: "Mejorar la cultura organizacional y el bienestar interno.",
        category: "psicologia",
        icon: Users2,
        color: "from-emerald-500 to-emerald-600",
      },
    ],
  },
  {
    id: 5,
    categoryLabel: "Módulo 5: Proyección Futura",
    title:
      "¿Por qué motivo te gustaría ser recordado en tu carrera profesional?",
    options: [
      {
        text: "Por crear sistemas lógicos que resolvieron problemas complejos.",
        category: "sistemas",
        icon: Cpu,
        color: "from-blue-500 to-blue-600",
      },
      {
        text: "Por mis creaciones tangibles que trascendieron en el tiempo.",
        category: "arquitectura",
        icon: Building2,
        color: "from-red-500 to-red-600",
      },
      {
        text: "Por construir imperios y liderar a cientos de personas.",
        category: "administracion",
        icon: ShieldAlert,
        color: "from-amber-500 to-amber-600",
      },
      {
        text: "Por el impacto positivo profundo que dejé en otras personas.",
        category: "psicologia",
        icon: Heart,
        color: "from-emerald-500 to-emerald-600",
      },
    ],
  },
]);

const totalQuestions = computed(() => questions.value.length);
const selectedOptions = ref<Record<number, string>>({});
const aiScanText = ref("Inicializando algoritmos de perfilamiento...");

// Estado de Resultados Avanzados
const computedResult = ref({
  career: "",
  percentage: 0,
  description: "",
  color: "",
  colorBg: "",
  icon: markRaw(Cpu),
  stats: [] as { label: string; value: number; color: string }[],
});

const prevStep = () => {
  if (currentStep.value > 0) currentStep.value--;
};
const nextStep = () => {
  currentStep.value++;
};

// AUTO-AVANCE FLUIDO
const handleSelect = (questionId: number, category: string) => {
  selectedOptions.value[questionId] = category;

  const reactions = [
    "Evaluando heurística...",
    "Patrón de decisión registrado...",
    "Analizando sesgo cognitivo...",
    "Correlacionando variables...",
  ];
  aiReaction.value = reactions[Math.floor(Math.random() * reactions.length)];

  setTimeout(() => {
    aiReaction.value = "";
    if (currentStep.value === totalQuestions.value) {
      currentStep.value = totalQuestions.value + 1;
      runAiScanning();
    } else {
      currentStep.value++;
    }
  }, 700);
};

// ----------------------------------------------------
// AI SCANNING LOGIC & CALCULATION
// ----------------------------------------------------
const runAiScanning = async () => {
  const texts = [
    "Mapeando matrices de comportamiento...",
    "Correlacionando decisiones bajo estrés...",
    "Sintetizando perfil psicométrico...",
    "Generando proyecciones de carrera...",
  ];
  let textIndex = 0;
  const interval = setInterval(() => {
    if (textIndex < texts.length) {
      aiScanText.value = texts[textIndex];
      textIndex++;
    }
  }, 1200);

  try {
    const categories = Object.values(selectedOptions.value);
    let gustos =
      categories.length > 0 ? categories.join(", ") : "Ninguno";
    let habilidades = "Razonamiento lógico, trabajo bajo presión";
    let miedos = "rutina, estancamiento";

    const response = await api.get("/api/v1/ai/perfilar", {
      params: { gustos, habilidades, miedos },
    });

    setTimeout(async () => {
      clearInterval(interval);
      const resData = response.data;
      const firstCareer =
        resData.data && resData.data.length > 0 ? resData.data[0] : null;

      if (firstCareer) {
        let aiStats = generateStats(firstCareer.nombre.toLowerCase());

        computedResult.value = {
          career: firstCareer.nombre,
          percentage: 96,
          description:
            resData.message ||
            "Tu perfil sugiere una alta afinidad cognitiva con este campo.",
          color: "#082065",
          colorBg: "bg-blue-50 border-blue-200 text-blue-900",
          icon: markRaw(Cpu),
          stats: aiStats,
        };
      } else {
        calculateResultsFallback();
      }

      try {
        const usuarioId = auth.state.user?.id || 1;
        await api.post(`/api/journeys/usuario/${usuarioId}/generar`);
      } catch (e) {}

      currentStep.value = totalQuestions.value + 2;
    }, 4500);
  } catch (error) {
    clearInterval(interval);
    calculateResultsFallback();
    currentStep.value = totalQuestions.value + 2;
  }
};

// Generador de Stats para el Perfil Psicométrico
const generateStats = (careerStr: string) => {
  if (careerStr.includes("sistema") || careerStr.includes("software")) {
    return [
      { label: "Pensamiento Lógico", value: 95, color: "bg-blue-600" },
      { label: "Innovación Técnica", value: 88, color: "bg-indigo-500" },
      { label: "Inteligencia Emocional", value: 65, color: "bg-emerald-400" },
      { label: "Liderazgo Directivo", value: 70, color: "bg-amber-500" },
    ];
  } else if (
    careerStr.includes("arquitectura") ||
    careerStr.includes("diseño")
  ) {
    return [
      { label: "Pensamiento Lógico", value: 75, color: "bg-blue-600" },
      { label: "Innovación Técnica", value: 98, color: "bg-indigo-500" },
      { label: "Inteligencia Emocional", value: 70, color: "bg-emerald-400" },
      { label: "Liderazgo Directivo", value: 60, color: "bg-amber-500" },
    ];
  } else if (
    careerStr.includes("administración") ||
    careerStr.includes("negocios")
  ) {
    return [
      { label: "Pensamiento Lógico", value: 85, color: "bg-blue-600" },
      { label: "Innovación Técnica", value: 60, color: "bg-indigo-500" },
      { label: "Inteligencia Emocional", value: 80, color: "bg-emerald-400" },
      { label: "Liderazgo Directivo", value: 95, color: "bg-amber-500" },
    ];
  } else {
    return [
      { label: "Pensamiento Lógico", value: 65, color: "bg-blue-600" },
      { label: "Innovación Técnica", value: 50, color: "bg-indigo-500" },
      { label: "Inteligencia Emocional", value: 98, color: "bg-emerald-400" },
      { label: "Liderazgo Directivo", value: 85, color: "bg-amber-500" },
    ];
  }
};

const calculateResultsFallback = () => {
  const counts: Record<string, number> = {
    sistemas: 0,
    arquitectura: 0,
    administracion: 0,
    psicologia: 0,
  };
  Object.values(selectedOptions.value).forEach((cat) => {
    counts[cat] = (counts[cat] || 0) + 1;
  });
  let topCategory = "sistemas";
  let maxCount = -1;
  Object.entries(counts).forEach(([cat, count]) => {
    if (count > maxCount) {
      maxCount = count;
      topCategory = cat;
    }
  });

  if (topCategory === "sistemas") {
    computedResult.value = {
      career: "Ingeniería de Sistemas",
      percentage: 88,
      description: "Perfil altamente estructurado.",
      color: "#082065",
      colorBg: "bg-blue-50 border-blue-200 text-blue-900",
      icon: markRaw(Cpu),
      stats: generateStats("sistemas"),
    };
  } else {
    computedResult.value = {
      career: "Administración y Negocios",
      percentage: 82,
      description: "Perfil estratégico y de gestión.",
      color: "#D4A017",
      colorBg: "bg-amber-50 border-amber-200 text-amber-900",
      icon: markRaw(TrendingUp),
      stats: generateStats("administración"),
    };
  }
};

const saveAndRedirect = () => {
  auth.updateCareerSuggestion(computedResult.value.career);
  router.push("/postulante/laberinto");
};
</script>

<template>
  <DashboardLayout
    :sidebarItems="sidebarItems"
    title="Assessment Vocacional"
    subtitle="NEXUS Talent Evaluation"
    :breadcrumbs="[
      { label: 'Inicio', href: '/postulante' },
      { label: 'Assessment IA' },
    ]"
    moduleColor="#082065"
  >
    <div
      class="flex flex-col items-center justify-center flex-1 w-full max-w-5xl mx-auto"
    >
      <!-- STEP 0: WELCOME -->
      <Card
        v-if="currentStep === 0"
        class="relative w-full p-4 overflow-hidden border-0 shadow-[0_0_50px_-12px_rgba(59,130,246,0.25)] sm:p-10 bg-white/95 rounded-3xl"
      >
        <div class="absolute top-0 right-0 w-96 h-96 -mt-32 -mr-32 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-[pulse_7s_infinite]" />
        <div class="absolute bottom-0 left-0 w-96 h-96 -mb-32 -ml-32 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-[pulse_7s_infinite_2s]" />

        <CardContent class="relative z-10 pt-6 space-y-6 text-center">
          <div
            class="flex items-center justify-center w-28 h-28 mx-auto text-blue-600 border border-blue-100 shadow-xl bg-gradient-to-br from-blue-50 to-white rounded-[2rem] relative group"
          >
            <Bot class="w-12 h-12 text-blue-600" />
          </div>

          <div class="space-y-4">
            <Badge
              class="mb-2 font-black tracking-widest text-blue-700 uppercase bg-blue-100 border-0 shadow-sm animate-pulse"
              >NEXUS AI Profiler</Badge
            >
            <h1
              class="text-4xl font-black leading-tight tracking-tight sm:text-5xl text-slate-900"
            >
              Test Vocacional
            </h1>
            <p class="max-w-xl mx-auto text-base font-medium text-slate-500">
              Evaluaremos tu comportamiento frente a escenarios reales para
              generar un perfil de talento preciso y armar tu laberinto de
              misiones impulsado por IA.
            </p>
          </div>

          <!-- ESTADO CARGANDO PERFIL -->
          <div v-if="isProfileComplete === null" class="py-12">
            <Loader2 class="w-12 h-12 mx-auto text-blue-600 animate-spin" />
            <p class="mt-4 text-sm font-bold text-slate-500">Validando configuración de perfil...</p>
          </div>

          <!-- BLOQUEO SI FALTA CONFIGURACIÓN -->
          <div v-else-if="isProfileComplete === false" class="max-w-xl p-8 mx-auto mt-8 border shadow-sm bg-red-50/50 border-red-200 rounded-2xl">
            <ShieldAlert class="w-12 h-12 mx-auto mb-4 text-red-500" />
            <h3 class="mb-2 text-xl font-black text-slate-800">
              Perfil Incompleto
            </h3>
            <p class="mb-6 text-sm font-medium text-slate-600">
              Para generar un laberinto vocacional preciso, necesitamos que respondas las 6 preguntas principales y selecciones tus carreras de interés en la configuración de tu perfil.
            </p>
            <Button
              @click="router.push('/configuracion')"
              size="lg"
              class="w-full text-white shadow-lg bg-blue-600 hover:bg-blue-700 font-bold h-14 rounded-xl hover:scale-105 transition-transform"
            >
              Completar Configuración
            </Button>
          </div>

          <!-- BOTÓN INICIAR TEST -->
          <div v-else class="max-w-xl p-6 mx-auto mt-8 border shadow-sm bg-slate-50 border-slate-200 rounded-2xl">
            <h3 class="flex items-center justify-center gap-2 mb-2 text-sm font-black text-slate-800">
              <Sparkles class="w-4 h-4 text-blue-600" />
              Perfil validado exitosamente
            </h3>
            <p class="mb-6 text-xs font-medium text-slate-500">
              Todos tus datos previos han sido cargados. Estás listo para comenzar el assessment de crisis y toma de decisiones.
            </p>
            
            <Button
              @click="nextStep"
              size="lg"
              class="w-full text-white shadow-lg bg-blue-600 hover:bg-blue-700 shadow-blue-500/30 group font-bold h-14 rounded-xl hover:scale-105 transition-transform"
            >
              Iniciar Assessment Interactivo
              <ArrowRight class="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <!-- STEP 1-N: DILEMAS SITUACIONALES -->
      <div
        v-else-if="currentStep >= 1 && currentStep <= totalQuestions"
        class="w-full space-y-6"
      >
        <!-- HEADER DE PROGRESO (Estética Assessment) -->
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              class="rounded-full text-slate-400 hover:text-slate-700"
              @click="prevStep"
              :disabled="currentStep === 1"
            >
              <ArrowLeft class="w-5 h-5" />
            </Button>
            <div>
              <p
                class="text-[10px] font-black text-slate-400 uppercase tracking-widest"
              >
                {{ questions[currentStep - 1].categoryLabel }}
              </p>
              <div class="flex items-center gap-2 mt-0.5">
                <span class="text-sm font-black text-blue-600"
                  >Evaluación {{ currentStep }}</span
                >
                <span class="text-sm font-bold text-slate-400"
                  >/ {{ totalQuestions }}</span
                >
              </div>
            </div>
          </div>
          <Badge
            variant="outline"
            class="font-mono tracking-widest text-blue-700 border-blue-200 bg-blue-50"
          >
            <Activity class="w-3 h-3 mr-1.5 animate-pulse" /> REC_ON
          </Badge>
        </div>

        <Progress
          :value="(currentStep / totalQuestions) * 100"
          class="h-2 bg-slate-100 [&>div]:bg-blue-600 shadow-inner"
        />

        <div class="max-w-3xl py-6 mx-auto text-center sm:py-8">
          <h2
            class="text-2xl font-black leading-snug tracking-tight sm:text-3xl text-slate-800"
          >
            {{ questions[currentStep - 1].title }}
          </h2>
          <p
            class="h-5 mt-4 text-sm font-bold text-blue-500 transition-opacity duration-300"
            :class="aiReaction ? 'opacity-100 animate-pulse' : 'opacity-0'"
          >
            {{ aiReaction }}
          </p>
        </div>

        <!-- GRID DE DECISIONES -->
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div
            v-for="(option, idx) in questions[currentStep - 1].options"
            :key="idx"
            @click="handleSelect(currentStep, option.category)"
            class="group relative overflow-hidden rounded-2xl border-2 cursor-pointer transition-all duration-300 min-h-[140px] flex items-center p-6 bg-white"
            :class="[
              selectedOptions[currentStep] === option.category
                ? 'border-blue-500 ring-4 ring-blue-500/20 scale-[1.02] shadow-xl z-10'
                : 'border-slate-200 hover:border-blue-400 hover:shadow-lg hover:-translate-y-1',
            ]"
          >
            <div class="relative z-10 flex items-center w-full gap-5">
              <div
                class="flex items-center justify-center transition-transform duration-300 shadow-md w-14 h-14 rounded-2xl shrink-0"
                :class="[
                  selectedOptions[currentStep] === option.category
                    ? 'scale-110 bg-gradient-to-br text-white ' + option.color
                    : 'bg-slate-100 border border-slate-200 text-slate-500 group-hover:text-blue-500 group-hover:bg-blue-50 group-hover:border-blue-200',
                ]"
              >
                <component :is="option.icon" class="w-6 h-6" />
              </div>

              <p
                class="flex-1 text-sm font-bold leading-snug sm:text-base"
                :class="
                  selectedOptions[currentStep] === option.category
                    ? 'text-slate-900'
                    : 'text-slate-600 group-hover:text-slate-800'
                "
              >
                {{ option.text }}
              </p>

              <div class="ml-2 shrink-0">
                <div
                  class="flex items-center justify-center w-6 h-6 transition-colors border-2 rounded-full"
                  :class="
                    selectedOptions[currentStep] === option.category
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-slate-300'
                  "
                >
                  <Check
                    v-if="selectedOptions[currentStep] === option.category"
                    class="w-3.5 h-3.5 text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- STEP X: AI SCANNING -->
      <Card
        v-else-if="currentStep === totalQuestions + 1"
        class="border-0 shadow-2xl bg-[#0B1120] text-white w-full p-8 text-center overflow-hidden relative min-h-[500px] flex flex-col justify-center items-center rounded-3xl"
      >
        <div
          class="absolute inset-0 opacity-20 bg-[radial-gradient(#3B82F6_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"
        />
        <CardContent
          class="z-10 flex flex-col items-center max-w-lg mx-auto space-y-8"
        >
          <div class="relative w-32 h-32">
            <div
              class="absolute inset-0 border-4 rounded-full border-blue-500/30 animate-ping"
            />
            <div
              class="absolute inset-2 rounded-full border-4 border-blue-400/50 animate-[ping_1.5s_infinite]"
            />
            <div
              class="absolute flex items-center justify-center bg-blue-600 rounded-full shadow-[0_0_80px_rgba(37,99,235,0.8)] inset-6"
            >
              <Brain class="w-12 h-12 text-white animate-pulse" />
            </div>
          </div>
          <div class="space-y-3">
            <h2 class="text-3xl font-black tracking-tight text-white">
              Procesando Perfil...
            </h2>
            <p
              class="text-blue-300 font-mono text-sm animate-pulse max-w-sm mx-auto min-h-[40px]"
            >
              > {{ aiScanText }}
            </p>
          </div>
          <div
            class="w-full h-1 max-w-xs overflow-hidden rounded-full bg-white/10"
          >
            <div
              class="h-full bg-blue-500 animate-[loading-bar_2s_ease-in-out_infinite]"
              style="width: 50%"
            ></div>
          </div>
        </CardContent>
      </Card>

      <!-- STEP FINAL: PERFIL PSICOMÉTRICO -->
      <Card
        v-else-if="currentStep === totalQuestions + 2"
        class="relative w-full overflow-hidden bg-white border-0 shadow-2xl rounded-3xl"
      >
        <CardContent class="p-0">
          <!-- Top Banner Result -->
          <div
            :class="`p-8 sm:p-12 relative overflow-hidden ${computedResult.colorBg}`"
          >
            <div
              class="absolute top-0 right-0 w-64 h-64 -mt-32 -mr-32 rounded-full pointer-events-none bg-white/30 blur-3xl"
            />
            <div
              class="relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row"
            >
              <div
                class="flex flex-col items-center gap-4 text-center md:items-start md:text-left"
              >
                <Badge
                  class="px-4 py-1.5 text-xs font-black text-emerald-700 bg-emerald-100 border-0 rounded-full shadow-sm"
                >
                  <CheckCircle2 class="w-4 h-4 mr-1.5 inline" /> Perfil Evaluado
                  por NEXUS
                </Badge>
                <div>
                  <span
                    class="text-xs font-black tracking-widest uppercase text-slate-500"
                    >Perfil Recomendado</span
                  >
                  <h2
                    class="mt-1 text-4xl font-black leading-tight"
                    :style="{ color: computedResult.color }"
                  >
                    {{ computedResult.career }}
                  </h2>
                </div>
                <p
                  class="max-w-lg mt-2 text-sm font-medium leading-relaxed text-slate-700"
                >
                  {{ computedResult.description }}
                </p>
              </div>
              <div
                class="flex flex-col items-center justify-center p-8 bg-white shadow-xl rounded-[2rem] shrink-0 min-w-[200px] border border-white/50"
              >
                <div
                  class="flex items-center justify-center w-16 h-16 mb-3 shadow-inner rounded-2xl"
                  :style="{ backgroundColor: `${computedResult.color}15` }"
                >
                  <component
                    :is="computedResult.icon"
                    class="w-8 h-8"
                    :style="{ color: computedResult.color }"
                  />
                </div>
                <span
                  class="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-1"
                  >Afinidad Cognitiva</span
                >
                <span
                  class="text-5xl font-black"
                  :style="{ color: computedResult.color }"
                  >{{ computedResult.percentage }}%</span
                >
              </div>
            </div>
          </div>

          <!-- Bottom Stats (Radar / Barras) -->
          <div class="p-8 bg-white sm:p-12">
            <h3
              class="flex items-center gap-2 mb-6 text-lg font-black text-slate-800"
            >
              <Activity class="w-5 h-5 text-blue-600" /> Resultados del Mapeo
              Cognitivo
            </h3>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
              <div
                v-for="stat in computedResult.stats"
                :key="stat.label"
                class="space-y-2"
              >
                <div class="flex items-end justify-between">
                  <span
                    class="text-xs font-bold tracking-wide uppercase text-slate-600"
                    >{{ stat.label }}</span
                  >
                  <span class="text-sm font-black text-slate-900"
                    >{{ stat.value }}%</span
                  >
                </div>
                <div
                  class="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner"
                >
                  <div
                    class="h-full transition-all duration-1000 ease-out rounded-full"
                    :class="stat.color"
                    :style="{ width: `${stat.value}%` }"
                  ></div>
                </div>
              </div>
            </div>

            <div
              class="flex justify-center pt-10 mt-8 border-t border-slate-100"
            >
              <Button
                class="w-full gap-3 px-12 text-lg font-black text-white transition-transform bg-blue-600 shadow-xl h-14 hover:bg-blue-700 shadow-blue-600/30 rounded-2xl hover:-translate-y-1 sm:w-auto"
                @click="saveAndRedirect"
              >
                Iniciar mi Laberinto Personalizado
                <ArrowRight class="w-6 h-6" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
</template>

<style scoped>
.animate-spin-slow {
  animation: spin 4s linear infinite;
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

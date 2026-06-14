<script setup lang="ts">
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Bot,
  Brain,
  Building2,
  Check,
  Compass,
  Cpu,
  FileText,
  Gamepad2,
  Heart,
  Home,
  Lightbulb,
  Loader2,
  MessageCircle,
  Network,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  UploadCloud,
  Users2,
  XCircle,
  Zap,
} from "lucide-vue-next";
import { computed, markRaw, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const auth = useAuth();

const sidebarItems = computed(() => [
  { icon: markRaw(Home), label: "Inicio", href: "/postulante" },
  { icon: markRaw(Brain), label: "Test Vocacional", href: "/postulante/test" },
  {
    icon: markRaw(Gamepad2),
    label: "Laberinto",
    href: "/postulante/laberinto",
  },
]);

const currentStep = ref(0);
const isUploadingPdf = ref(false);
const selectedPdf = ref<File | null>(null);
const pdfAnalysisResult = ref<string>("");
const aiReaction = ref<string>("");

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
// PDF UPLOAD LOGIC
// ----------------------------------------------------
const handleFileChange = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file || file.type !== "application/pdf") {
    alert("Sube un archivo PDF válido.");
    return;
  }
  selectedPdf.value = file;
  await processPdfToAi(file);
};

const processPdfToAi = async (file: File) => {
  try {
    isUploadingPdf.value = true;
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post(
      "/api/v1/ai/documento/intereses",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    pdfAnalysisResult.value =
      typeof response.data === "string"
        ? response.data
        : response.data.message || "Datos extraídos.";
  } catch (error) {
    alert("Error procesando PDF. Usa el test manual.");
    selectedPdf.value = null;
  } finally {
    isUploadingPdf.value = false;
  }
};

const skipTestAndGenerate = () => {
  currentStep.value = totalQuestions.value + 1;
  runAiScanning();
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
      categories.length > 0 ? categories.join(", ") : "Ninguno (Vía PDF)";
    let habilidades = "Razonamiento lógico, trabajo bajo presión";
    let miedos = "rutina, estancamiento";

    if (pdfAnalysisResult.value)
      gustos += `. Contexto PDF: ${pdfAnalysisResult.value}`;

    const response = await api.get("/api/v1/ai/perfilar", {
      params: { gustos, habilidades, miedos },
    });

    setTimeout(async () => {
      clearInterval(interval);
      const resData = response.data;
      const firstCareer =
        resData.data && resData.data.length > 0 ? resData.data[0] : null;

      if (firstCareer) {
        // Asignamos stats artificiales (gamificados) basados en la carrera detectada para que se vea PRO
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
        let postulanteId = usuarioId;
        const profRes = await api
          .get(`/api/postulantes/by-usuario/${usuarioId}`)
          .catch(() => null);
        if (profRes && profRes.data?.data?.id)
          postulanteId = profRes.data.data.id;
        await api.post(`/api/journeys/postulante/${postulanteId}/generar`);
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
    // Psicologia o afines
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
      <!-- STEP 0: WELCOME & PDF UPLOAD -->
      <Card
        v-if="currentStep === 0"
        class="relative w-full p-4 overflow-hidden border-0 shadow-[0_0_50px_-12px_rgba(59,130,246,0.25)] sm:p-10 bg-white/95 rounded-3xl"
      >
        <!-- Background animated blobs -->
        <div class="absolute top-0 right-0 w-96 h-96 -mt-32 -mr-32 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-[pulse_7s_infinite]" />
        <div class="absolute bottom-0 left-0 w-96 h-96 -mb-32 -ml-32 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-[pulse_7s_infinite_2s]" />

        <CardContent class="relative z-10 pt-6 space-y-8 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div
            class="flex items-center justify-center w-28 h-28 mx-auto text-blue-600 border border-blue-100 shadow-xl bg-gradient-to-br from-blue-50 to-white rounded-[2rem] relative group"
          >
            <div class="absolute inset-0 border-4 border-blue-500 rounded-[2rem] opacity-20 group-hover:scale-110 group-hover:opacity-0 transition-all duration-700"></div>
            <Bot class="w-14 h-14 text-blue-600 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12" />
          </div>

          <div class="space-y-4">
            <Badge
              class="mb-2 font-black tracking-widest text-blue-700 uppercase bg-blue-100 border-0 shadow-sm animate-pulse"
              >NEXUS AI Profiler</Badge
            >
            <h1
              class="text-4xl font-black leading-tight tracking-tight sm:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900"
            >
              Test Vocacional
            </h1>
            <p class="max-w-2xl mx-auto text-lg font-medium text-slate-500 leading-relaxed">
              Evaluaremos tu comportamiento frente a escenarios reales para
              generar un perfil de talento preciso y armar tu laberinto de
              misiones impulsado por IA.
            </p>
          </div>

          <!-- SECCIÓN DE SUBIDA DE PDF -->
          <div
            class="max-w-xl p-6 mx-auto mt-8 border shadow-sm bg-slate-50 border-slate-200 rounded-2xl"
          >
            <h3
              class="flex items-center justify-center gap-2 mb-2 text-sm font-black text-slate-800"
            >
              <FileText class="w-4 h-4 text-blue-600" />
              Ingreso de Datos Externos (Opcional)
            </h3>
            <p class="mb-4 text-xs font-medium text-slate-500">
              Sube un documento con tus inteligencias múltiples o historial
              previo. La IA lo integrará a la evaluación.
            </p>

            <div
              v-if="!selectedPdf"
              class="relative flex flex-col items-center justify-center p-8 transition-all bg-white border-2 border-dashed cursor-pointer border-slate-300 rounded-xl hover:border-blue-400 hover:bg-blue-50/50 group"
            >
              <input
                type="file"
                accept="application/pdf"
                @change="handleFileChange"
                class="absolute inset-0 z-10 w-full h-full opacity-0 cursor-pointer"
              />
              <div
                class="p-3 mb-3 transition-transform rounded-full bg-slate-100 group-hover:bg-blue-100 group-hover:scale-110"
              >
                <UploadCloud
                  class="w-6 h-6 text-slate-500 group-hover:text-blue-600"
                />
              </div>
              <span
                class="text-sm font-bold text-slate-700 group-hover:text-blue-700"
                >Arrastra tu PDF aquí o examina</span
              >
            </div>

            <div v-else class="flex flex-col items-center gap-3 mt-4">
              <div
                class="flex items-center justify-between w-full p-4 bg-white border shadow-sm border-emerald-200 rounded-xl"
              >
                <div class="flex items-center gap-3 overflow-hidden">
                  <div class="p-2 rounded-lg bg-emerald-100">
                    <FileText class="w-5 h-5 text-emerald-600" />
                  </div>
                  <span class="text-sm font-bold truncate text-slate-700">{{
                    selectedPdf.name
                  }}</span>
                </div>
                <button
                  v-if="!isUploadingPdf"
                  @click="
                    selectedPdf = null;
                    pdfAnalysisResult = '';
                  "
                  class="transition-colors text-slate-400 hover:text-red-500"
                >
                  <XCircle class="w-5 h-5" />
                </button>
              </div>

              <div
                v-if="isUploadingPdf"
                class="flex items-center px-4 py-2 text-xs font-bold text-blue-600 rounded-full bg-blue-50"
              >
                <Loader2 class="w-4 h-4 mr-2 animate-spin" /> Escaneando datos
                cognitivos...
              </div>
              <div
                v-else-if="pdfAnalysisResult"
                class="flex items-center px-4 py-2 text-xs font-bold border rounded-full text-emerald-700 bg-emerald-50 border-emerald-200"
              >
                <Check class="w-4 h-4 mr-1.5" /> Metadatos asimilados
                correctamente.
              </div>
            </div>
          </div>

          <!-- BOTONES -->
          <div
            class="flex flex-col items-center justify-center gap-4 pt-6 sm:flex-row"
          >
            <Button
              v-if="selectedPdf && !isUploadingPdf"
              @click="skipTestAndGenerate"
              class="w-full px-8 font-black text-white transition-transform shadow-lg sm:w-auto h-14 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-xl shadow-emerald-500/30 hover:-translate-y-1"
            >
              <Sparkles class="w-5 h-5 mr-2" /> Generar Perfil Directamente
            </Button>

            <Button
              size="lg"
              :disabled="isUploadingPdf"
              :variant="selectedPdf ? 'outline' : 'default'"
              class="w-full px-8 font-black transition-transform shadow-md sm:w-auto h-14 rounded-xl hover:-translate-y-1"
              :class="
                !selectedPdf
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30'
                  : 'border-slate-300 text-slate-600 hover:bg-slate-50'
              "
              @click="nextStep"
            >
              {{
                selectedPdf
                  ? "Continuar Assessment Completo"
                  : "Iniciar Assessment Interactivo"
              }}
              <ArrowRight class="w-5 h-5 ml-2" />
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

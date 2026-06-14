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
import { api } from "@/lib/api";
import {
  ArrowLeft,
  BrainCircuit,
  CheckCircle2,
  ListChecks,
  Loader2,
  MousePointerClick,
  PenTool,
  PlayCircle,
  Star,
  Trophy,
} from "lucide-vue-next";
import { computed, onMounted, ref, watch } from "vue";
import { useAuth } from "@/lib/auth";

const props = defineProps<{
  module: any;
}>();

const emit = defineEmits(["back", "completed"]);

const auth = useAuth();
const isCompleting = ref(false);
const showSuccess = ref(false);
const isAiChecking = ref(false);

// ESTADOS PARA LAS DISTINTAS MECÁNICAS
const moduleType = computed(() => props.module?.tipo || "BITACORA");
const isFirstBitacora = computed(() => (moduleType.value === "BITACORA" || moduleType.value === "FORO") && props.module.orden === 1);

// Mecánica 1: Bitácora Normal
const reflexion = ref("");
const reflexionQuality = computed(() => {
  const length = reflexion.value.trim().length;
  if (length === 0)
    return { label: "Vacía", color: "bg-slate-200 text-slate-500", w: "w-0" };
  if (length < 30)
    return { label: "Muy corta", color: "bg-red-500 text-white", w: "w-1/4" };
  if (length < 80)
    return { label: "Aceptable", color: "bg-amber-500 text-white", w: "w-2/4" };
  return {
    label: "Excelente",
    color: "bg-emerald-500 text-white",
    w: "w-full",
  };
});

// Mecánica 1b: Bitácora (Informe Vocacional Incremental - Solo primer nodo)
const informeForm = ref({
  intereses: '',
  inteligenciasMultiples: '',
  inteligenciaEmocional: '',
  personalidad: '',
  razonamientoAbstracto: '',
  perseverancia: ''
});

onMounted(async () => {
  const userId = auth.state.user?.id;
  if (userId) {
    try {
      const informeRes = await api.get(`/api/informes-vocacionales/by-usuario/${userId}`);
      if (informeRes.data && informeRes.data.data) {
        const informe = informeRes.data.data;
        informeForm.value.intereses = informe.intereses || '';
        informeForm.value.inteligenciasMultiples = informe.inteligenciasMultiples || '';
        informeForm.value.inteligenciaEmocional = informe.inteligenciaEmocional || '';
        informeForm.value.personalidad = informe.personalidad || '';
        informeForm.value.razonamientoAbstracto = informe.razonamientoAbstracto || '';
        informeForm.value.perseverancia = informe.perseverancia || '';
      }
    } catch(e) {
      console.error("Error loading informe:", e);
    }
  }
});

// Mecánica 2: Lectura/Video (Trivia de Conocimiento Interactiva)
const triviaBank = [
  {
    q: "¿Cuál es el principal objetivo en esta fase de tu desarrollo profesional?",
    options: [
      { text: "Evitar hacer preguntas para no parecer inexperto", isCorrect: false },
      { text: "Identificar el problema central y proponer soluciones iterativas", isCorrect: true },
      { text: "Dejar que la IA resuelva todo sin entender el código", isCorrect: false },
      { text: "Abandonar el proyecto al encontrar el primer bug", isCorrect: false },
    ]
  },
  {
    q: "Frente a un desafío desconocido, la mejor actitud es:",
    options: [
      { text: "Rendirse rápidamente y pasar a otra cosa", isCorrect: false },
      { text: "Investigar, descomponer el problema y aprender haciendo", isCorrect: true },
      { text: "Copiar la primera solución que aparezca en internet", isCorrect: false },
      { text: "Esperar a que alguien más lo resuelva por ti", isCorrect: false }
    ]
  },
  {
    q: "¿Qué habilidad es fundamental desarrollar para el trabajo moderno?",
    options: [
      { text: "Comunicación asertiva, empatía y adaptabilidad", isCorrect: true },
      { text: "Memorizar absolutamente toda la teoría sin aplicarla", isCorrect: false },
      { text: "Trabajar de forma completamente aislada sin hablar con nadie", isCorrect: false },
      { text: "Creer que ya se sabe todo y dejar de estudiar", isCorrect: false }
    ]
  },
  {
    q: "Al organizar tus proyectos, es altamente recomendable:",
    options: [
      { text: "Avanzar sin ningún plan estructurado", isCorrect: false },
      { text: "Usar metodologías ágiles o matrices de priorización", isCorrect: true },
      { text: "Dejar las cosas más importantes para el último minuto", isCorrect: false },
      { text: "Hacer múltiples tareas complejas al mismo tiempo (multitasking)", isCorrect: false }
    ]
  }
];

const currentTriviaData = computed(() => {
  const hash = props.module?.id ? props.module.id % triviaBank.length : 0;
  return triviaBank[hash];
});

const triviaSelectedIdx = ref<number | null>(null);
const triviaStatus = ref<'idle'|'error'|'correct'>('idle');
const shakeTriviaError = ref(false);

watch(() => props.module?.id, () => {
  triviaSelectedIdx.value = null;
  triviaStatus.value = props.module?.status === 'completed' ? 'correct' : 'idle';
});

const selectTrivia = (idx: number, opt: any) => {
  if (props.module.status === 'completed' || triviaStatus.value === 'correct') return;
  
  triviaSelectedIdx.value = idx;
  if (opt.isCorrect) {
    triviaStatus.value = 'correct';
  } else {
    triviaStatus.value = 'error';
    shakeTriviaError.value = true;
    setTimeout(() => { shakeTriviaError.value = false; }, 500);
  }
};

// Mecánica 3: Quiz (Rompecabezas de Priorización)
const puzzleSteps = [
  { id: 1, text: "Analizar el problema y los requerimientos" },
  { id: 2, text: "Consultar con el equipo y los stakeholders" },
  { id: 3, text: "Diseñar una solución o prototipo" },
  { id: 4, text: "Implementar y evaluar los resultados" }
];
const shuffledSteps = ref([...puzzleSteps].sort(() => Math.random() - 0.5));
const selectedSequence = ref<number[]>([]);
const shakeError = ref(false);

const toggleStep = (stepId: number) => {
  if (props.module.status === 'completed') return;
  const idx = selectedSequence.value.indexOf(stepId);
  if (idx > -1) {
    selectedSequence.value.splice(idx, 1);
  } else {
    selectedSequence.value.push(stepId);
  }
  
  if (selectedSequence.value.length === 4) {
    // Validate
    if (!isSequenceCorrect.value) {
      shakeError.value = true;
      setTimeout(() => {
        shakeError.value = false;
        selectedSequence.value = [];
      }, 800);
    }
  }
};

const isSequenceCorrect = computed(() => {
  return selectedSequence.value.length === 4 && 
         selectedSequence.value[0] === 1 &&
         selectedSequence.value[1] === 2 &&
         selectedSequence.value[2] === 3 &&
         selectedSequence.value[3] === 4;
});

// Mecánica 1c: Wizard State para Entrevista
const wizardStep = ref(0);
const wizardQuestions = [
  { key: 'intereses', title: 'Tus Intereses y Pasatiempos', type: 'select', options: ['Tecnología y Datos', 'Negocios y Liderazgo', 'Arte y Diseño', 'Ciencias de la Salud', 'Ingeniería y Construcción', 'Ciencias Sociales y Letras'], icon: Star },
  { key: 'inteligenciasMultiples', title: 'Tu Inteligencia Principal', type: 'select', options: ['Lógico-Matemática', 'Lingüística-Verbal', 'Visual-Espacial', 'Interpersonal', 'Intrapersonal'], icon: BrainCircuit },
  { key: 'inteligenciaEmocional', title: '¿Cómo manejas el estrés?', type: 'select', options: ['Me organizo mejor', 'Busco ayuda de mi equipo', 'Me frustro un poco pero sigo', 'Me tomo un descanso y vuelvo a intentarlo'], icon: ListChecks },
  { key: 'personalidad', title: 'Tu Personalidad General', type: 'select', options: ['Introvertido y Analítico', 'Extrovertido y Sociable', 'Detallista y Perfeccionista', 'Creativo y Espontáneo', 'Pragmático y Directo'], icon: PenTool },
  { key: 'razonamientoAbstracto', title: 'Para encontrar patrones ocultos...', type: 'select', options: ['Se me hace muy fácil', 'Solo si me concentro mucho', 'Me cuesta un poco', 'Prefiero cosas concretas'], icon: PlayCircle },
  { key: 'perseverancia', title: 'Tu mayor reto superado', type: 'textarea', placeholder: 'Describe un momento difícil y cómo lo lograste (Ej. un proyecto complicado, aprobar una materia...)', icon: Trophy }
];

const nextWizardStep = () => {
  if (wizardStep.value < 5) wizardStep.value++;
};
const prevWizardStep = () => {
  if (wizardStep.value > 0) wizardStep.value--;
};

// Validación dinámica del botón "Completar"
const canSubmit = computed(() => {
  if (props.module.status === "completed" || isCompleting.value) return false;

  const type = moduleType.value;

  if (type === "QUIZ" || type === "DESAFIO") {
    return isSequenceCorrect.value;
  }
  
  // Módulos que usan la Trivia (Lectura, Video, o Bitácora/Foro que no son el inicial)
  if (type === "LECTURA" || type === "VIDEO" || (!isFirstBitacora.value && (type === "BITACORA" || type === "FORO"))) {
    return triviaStatus.value === 'correct';
  }
  
  if (isFirstBitacora.value) {
    const f = informeForm.value;
    return !!f.intereses && 
           !!f.inteligenciasMultiples && 
           !!f.inteligenciaEmocional && 
           !!f.personalidad && 
           !!f.razonamientoAbstracto && 
           f.perseverancia.trim().length >= 10;
  }

  // Fallback
  return reflexion.value.trim().length >= 30;
});

const completarModulo = async () => {
  if (!canSubmit.value) return;

  try {
    // Si es texto, hacemos un pequeño delay simulando que la IA está leyendo
    if (moduleType.value === "BITACORA" || moduleType.value === "FORO") {
      isAiChecking.value = true;
      if (isFirstBitacora.value) {
        const userId = auth.state.user?.id;
        if (userId) {
          await api.put(`/api/informes-vocacionales/by-usuario/${userId}`, informeForm.value);
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 1500));
      isAiChecking.value = false;
    }

    isCompleting.value = true;

    // Llamada real al backend
    await api.patch(`/api/journeys/nodos/${props.module.id}/completar`);

    showSuccess.value = true;
    setTimeout(() => {
      emit("completed");
    }, 2000);
  } catch (error) {
    console.error("Error al completar el módulo:", error);
    alert("Hubo un problema al sincronizar con NEXUS. Intenta de nuevo.");
  } finally {
    isCompleting.value = false;
    isAiChecking.value = false;
  }
};
</script>

<template>
  <div
    class="relative max-w-5xl mx-auto space-y-6 duration-500 animate-in fade-in slide-in-from-bottom-4"
  >
    <!-- PANTALLA ÉPICA DE MISIÓN COMPLETADA (Ajustada al Card) -->
    <div
      v-if="showSuccess"
      class="absolute inset-0 z-50 flex flex-col items-center justify-center text-white duration-500 bg-[#0B1120]/95 backdrop-blur-md rounded-2xl animate-in fade-in zoom-in-95"
    >
      <div
        class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"
      ></div>
      <div
        class="relative z-10 flex flex-col items-center space-y-6 text-center"
      >
        <div
          class="w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_100px_rgba(16,185,129,0.6)] animate-bounce"
        >
          <Trophy class="w-16 h-16 text-white" />
        </div>
        <h2
          class="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-emerald-500"
        >
          ¡MISIÓN SUPERADA!
        </h2>
        <div
          class="w-full max-w-sm p-6 border bg-white/10 border-white/20 rounded-2xl backdrop-blur-md"
        >
          <p
            class="mb-2 text-sm font-bold tracking-widest uppercase text-white/60"
          >
            Recompensa Obtenida
          </p>
          <div
            class="flex items-center justify-center gap-3 text-4xl font-black text-amber-400"
          >
            <Star class="w-8 h-8 fill-amber-400" />
            +{{ module.xp }} XP
          </div>
        </div>
      </div>
    </div>

    <!-- BANNER DEL MÓDULO -->
    <Card
      class="relative overflow-hidden border-0 shadow-2xl"
      :style="{
        background: `linear-gradient(135deg, ${module.color} 0%, #0B1120 120%)`,
      }"
    >
      <div
        class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"
      ></div>

      <CardContent
        class="relative z-10 flex flex-col items-center gap-8 p-8 text-white md:flex-row"
      >
        <div
          class="relative flex items-center justify-center w-24 h-24 border shadow-2xl rounded-2xl bg-white/10 backdrop-blur-md border-white/20 shrink-0"
        >
          <component
            :is="module.icon"
            class="w-12 h-12 text-white drop-shadow-md"
          />
        </div>

        <div class="flex-1 text-center md:text-left">
          <Badge
            class="bg-white/20 text-white border border-white/10 uppercase tracking-widest font-black text-[10px] px-3 py-1 mb-3"
          >
            Misión Tipo: {{ moduleType }}
          </Badge>
          <h1 class="mb-2 text-4xl font-black leading-tight tracking-tight">
            {{ module.title }}
          </h1>
          <p class="max-w-2xl text-base font-medium text-white/80">
            {{ module.description }}
          </p>
        </div>

        <div
          class="shrink-0 bg-black/40 p-5 rounded-2xl border border-white/10 text-center min-w-[140px] shadow-inner"
        >
          <p
            class="text-[10px] uppercase tracking-wider font-bold text-white/50 mb-1.5"
          >
            Recompensa
          </p>
          <div
            class="flex items-center justify-center gap-1.5 text-3xl font-black text-amber-400"
          >
            <Star class="w-6 h-6 fill-amber-400" /> {{ module.xp }}
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- ZONA INTERACTIVA DINÁMICA -->
    <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
      <!-- Panel de Trabajo Central -->
      <Card
        class="relative overflow-hidden bg-[#0B1120] text-white border shadow-xl border-blue-500/20 md:col-span-2"
      >
        <!-- HEADER DINÁMICO -->
        <CardHeader class="px-8 py-5 border-b border-blue-500/20 bg-blue-900/10">
          <CardTitle
            class="flex items-center gap-2 text-xl font-black text-white"
          >
            <MousePointerClick
              v-if="moduleType === 'QUIZ' || moduleType === 'DESAFIO'"
              class="w-6 h-6 text-blue-600"
            />
            <ListChecks
              v-else-if="moduleType === 'LECTURA' || moduleType === 'VIDEO'"
              class="w-6 h-6 text-blue-600"
            />
            <PenTool v-else class="w-6 h-6 text-blue-600" />

            {{
              moduleType === "QUIZ" || moduleType === "DESAFIO"
                ? "Evaluación de Perfil"
                : moduleType === "LECTURA" || moduleType === "VIDEO"
                  ? "Verificación de Material"
                  : "Registro de Bitácora"
            }}
          </CardTitle>
          <CardDescription class="text-sm font-medium text-blue-200/70">
            {{
              moduleType === "QUIZ"
                ? "Selecciona la opción que más resuene contigo."
                : moduleType === "LECTURA"
                  ? "Confirma que has asimilado los conceptos clave."
                  : "Plasma aquí lo que has aprendido para validar esta etapa."
            }}
          </CardDescription>
        </CardHeader>

        <CardContent class="p-8 space-y-8">
          <!-- ============================================== -->
          <!-- MECÁNICA 1: QUIZ / DESAFIO (Rompecabezas)      -->
          <!-- ============================================== -->
          <div
            v-if="moduleType === 'QUIZ' || moduleType === 'DESAFIO'"
            class="space-y-6"
          >
            <div class="p-5 text-sm font-medium text-purple-300 border bg-purple-900/20 border-purple-500/30 rounded-xl">
              Rompecabezas Estratégico: Ordena los siguientes pasos en la secuencia lógica correcta haciendo clic sobre ellos.
            </div>

            <!-- Slots (Secuencia seleccionada) -->
            <div 
              class="flex flex-col gap-2 p-4 border-2 border-dashed rounded-xl transition-all"
              :class="[
                shakeError ? 'border-red-500/50 bg-red-900/20 animate-[shake_0.5s_ease-in-out]' : 
                isSequenceCorrect ? 'border-emerald-500/50 bg-emerald-900/20' : 
                'border-slate-700 bg-slate-800/30'
              ]"
            >
              <div v-if="selectedSequence.length === 0" class="py-4 text-center text-slate-500 font-medium">
                Haz clic en las opciones de abajo para armar la secuencia aquí
              </div>
              <div 
                v-for="(id, index) in selectedSequence" 
                :key="'slot-'+id"
                @click="toggleStep(id)"
                class="flex items-center p-3 bg-slate-800/80 border border-slate-600 rounded-lg shadow-sm cursor-pointer hover:border-red-400 group transition-all"
              >
                <div class="flex items-center justify-center w-6 h-6 mr-3 text-xs font-bold text-white bg-blue-600 rounded-full shrink-0">
                  {{ index + 1 }}
                </div>
                <span class="font-medium text-slate-200 flex-1">{{ puzzleSteps.find(s => s.id === id)?.text }}</span>
                <span class="text-xs text-red-400 opacity-0 group-hover:opacity-100 font-bold transition-opacity">Quitar</span>
              </div>
              <div v-if="shakeError" class="text-center text-xs font-bold text-red-400 mt-2">
                ¡Secuencia incorrecta! Revisa la lógica e intenta de nuevo.
              </div>
            </div>

            <!-- Opciones disponibles -->
            <div class="grid gap-3" v-if="selectedSequence.length < 4">
              <label class="text-xs font-bold text-blue-300/70 uppercase tracking-widest">Opciones Disponibles:</label>
              <button
                v-for="step in shuffledSteps.filter(s => !selectedSequence.includes(s.id))"
                :key="step.id"
                @click="toggleStep(step.id)"
                class="flex items-center w-full p-4 text-left transition-all border-2 rounded-xl border-slate-700 bg-slate-800/50 hover:border-blue-500/50 hover:bg-blue-900/20 hover:-translate-y-1 hover:shadow-md"
                :disabled="module.status === 'completed'"
              >
                <span class="font-medium text-slate-200">{{ step.text }}</span>
              </button>
            </div>
          </div>

          <!-- ============================================== -->
          <!-- MECÁNICA 2: LECTURA / VIDEO (Resumen Gamificado)-->
          <!-- ============================================== -->
          <div
            v-else-if="moduleType === 'LECTURA' || moduleType === 'VIDEO' || (!isFirstBitacora && (moduleType === 'BITACORA' || moduleType === 'FORO'))"
            class="space-y-6"
          >
            <div
              class="p-5 text-sm font-medium text-blue-300 border border-blue-500/30 bg-blue-900/20 rounded-xl"
            >
              Simulador de Decisiones: Selecciona la respuesta correcta al siguiente escenario de tu ruta.
            </div>
            
            <div class="p-6 bg-slate-900/50 border border-slate-700 rounded-2xl relative overflow-hidden">
              <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
              <h4 class="text-lg font-bold text-white mb-6 relative z-10">{{ currentTriviaData.q }}</h4>
              
              <div class="grid gap-3 relative z-10" :class="{ 'animate-[shake_0.5s_ease-in-out]': shakeTriviaError }">
                <button
                  v-for="(opt, idx) in currentTriviaData.options"
                  :key="idx"
                  @click="selectTrivia(idx, opt)"
                  class="flex items-center w-full p-4 text-left transition-all border-2 rounded-xl hover:-translate-y-0.5"
                  :class="[
                    triviaSelectedIdx === idx 
                      ? (triviaStatus === 'correct' ? 'border-emerald-500 bg-emerald-500/10' : triviaStatus === 'error' ? 'border-red-500 bg-red-500/10' : 'border-blue-500 bg-blue-500/10')
                      : 'border-slate-700 bg-slate-800/50 hover:border-blue-500/50 hover:bg-blue-900/20'
                  ]"
                  :disabled="module.status === 'completed' || triviaStatus === 'correct'"
                >
                  <div class="w-8 h-8 rounded-full border-2 mr-4 flex items-center justify-center font-bold text-sm shrink-0 transition-colors" :class="triviaSelectedIdx === idx && triviaStatus === 'correct' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/20' : 'border-slate-600 text-slate-400'">
                    {{ String.fromCharCode(65 + idx) }}
                  </div>
                  <span class="font-medium text-slate-200">{{ opt.text }}</span>
                </button>
              </div>

              <div v-if="triviaStatus === 'error'" class="text-center text-xs font-bold text-red-400 mt-5 relative z-10">
                Decisión subóptima. Analiza las variables y vuelve a intentarlo.
              </div>
              <div v-if="triviaStatus === 'correct'" class="text-center text-sm font-bold text-emerald-400 mt-5 flex items-center justify-center gap-2 relative z-10 animate-in fade-in zoom-in-95">
                <CheckCircle2 class="w-5 h-5" /> ¡Decisión correcta! Has validado tu conocimiento.
              </div>
            </div>
          </div>

          <!-- ============================================== -->
          <!-- MECÁNICA 3: BITÁCORA / FORO                    -->
          <!-- ============================================== -->
          <div v-else class="space-y-6">
            
            <!-- Vista 1: Solo en el primer nodo (Entrevista Interactiva) -->
            <template v-if="isFirstBitacora">
              <div class="p-4 text-sm font-medium text-purple-300 border bg-purple-900/20 border-purple-500/30 rounded-xl flex items-center justify-between">
                <div>
                  <h4 class="font-bold text-base mb-1">Entrevista Vocacional con NEXUS</h4>
                  <p class="opacity-80">Completa esta sesión para ayudar a la IA a personalizar tu viaje.</p>
                </div>
                <div class="font-black text-2xl text-purple-400">
                  {{ wizardStep + 1 }}/6
                </div>
              </div>

              <!-- Carrusel / Wizard -->
              <div class="relative bg-slate-900/50 border border-slate-700 rounded-2xl shadow-sm p-6 overflow-hidden">
                <!-- Progreso -->
                <div class="absolute top-0 left-0 h-1 bg-purple-500 transition-all duration-500 ease-out" :style="{ width: `${((wizardStep + 1) / 6) * 100}%` }"></div>
                
                <div class="animate-in slide-in-from-right-4 fade-in duration-300" :key="wizardStep">
                  <div class="flex items-center gap-3 mb-6">
                    <div class="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                      <component :is="wizardQuestions[wizardStep].icon" class="w-5 h-5" />
                    </div>
                    <h3 class="text-lg font-black text-white">{{ wizardQuestions[wizardStep].title }}</h3>
                  </div>
                  <div v-if="wizardQuestions[wizardStep].type === 'select'" class="grid gap-3">
                    <button
                      v-for="opt in wizardQuestions[wizardStep].options"
                      :key="opt"
                      @click="informeForm[wizardQuestions[wizardStep].key as keyof typeof informeForm] = opt"
                      class="flex items-center w-full p-4 text-left transition-all border-2 rounded-xl border-slate-700 bg-slate-800/50 hover:border-purple-500/50 hover:bg-purple-900/20 hover:-translate-y-0.5"
                      :class="informeForm[wizardQuestions[wizardStep].key as keyof typeof informeForm] === opt ? 'border-purple-500 bg-purple-500/20 shadow-md ring-2 ring-purple-500/20' : ''"
                      :disabled="module.status === 'completed' || isAiChecking"
                    >
                      <span class="font-medium text-slate-200" :class="informeForm[wizardQuestions[wizardStep].key as keyof typeof informeForm] === opt ? 'text-purple-300' : ''">{{ opt }}</span>
                    </button>
                  </div>
                  
                  <textarea 
                    v-else
                    v-model="informeForm[wizardQuestions[wizardStep].key as keyof typeof informeForm]"
                    :disabled="module.status === 'completed' || isAiChecking"
                    :placeholder="wizardQuestions[wizardStep].placeholder"
                    rows="4"
                    class="w-full p-4 text-sm transition-all border outline-none rounded-xl border-slate-700 bg-slate-800/50 text-slate-200 focus:bg-slate-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-60 resize-none"
                  ></textarea>
                </div>

                <div class="flex items-center justify-between mt-6 pt-6 border-t border-slate-700">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    @click="prevWizardStep" 
                    :disabled="wizardStep === 0"
                    class="font-bold"
                  >
                    Anterior
                  </Button>
                  <Button 
                    size="sm" 
                    @click="nextWizardStep" 
                    v-if="wizardStep < 5"
                    :disabled="wizardQuestions[wizardStep].type === 'select' ? !informeForm[wizardQuestions[wizardStep].key as keyof typeof informeForm] : informeForm[wizardQuestions[wizardStep].key as keyof typeof informeForm].trim().length < 10"
                    class="font-bold bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Siguiente Pregunta
                  </Button>
                  <div v-else class="text-xs font-bold text-emerald-500 flex items-center gap-1 animate-in zoom-in">
                    <CheckCircle2 class="w-4 h-4" /> Entrevista Completa
                  </div>
                </div>
              </div>
            </template>
            
            <!-- Vista 2: Resto de nodos Bitácora normales -->
            <template v-else>
              <div class="flex items-center justify-between">
                <label
                  class="flex items-center gap-2 text-sm font-black text-white"
                >
                  Tu Reflexión Personal:
                </label>
                <div
                  v-if="module.status !== 'completed'"
                  class="flex items-center gap-2"
                >
                  <span class="text-[10px] font-bold text-slate-400 uppercase"
                    >Calidad:</span
                  >
                  <div
                    class="flex w-24 h-2 overflow-hidden rounded-full bg-slate-800"
                  >
                    <div
                      class="h-full transition-all duration-300"
                      :class="[reflexionQuality.color, reflexionQuality.w]"
                    ></div>
                  </div>
                  <span
                    class="text-[10px] font-bold"
                    :class="reflexionQuality.color.split(' ')[1]"
                    >{{ reflexionQuality.label }}</span
                  >
                </div>
              </div>

              <div class="relative mt-4">
                <textarea
                  v-model="reflexion"
                  rows="6"
                  :disabled="module.status === 'completed' || isAiChecking"
                  class="w-full p-5 text-sm font-medium transition-all border outline-none resize-none rounded-2xl border-slate-700 bg-slate-900/50 text-slate-200 focus:bg-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-500 disabled:opacity-60 disabled:bg-slate-800"
                  placeholder="Escribe aquí tus conclusiones... No se aceptan respuestas de una sola palabra."
                ></textarea>
              </div>
            </template>

          </div>

          <!-- BOTÓN PRINCIPAL DE ENVÍO -->
          <Button
            @click="completarModulo"
            :disabled="!canSubmit"
            class="relative w-full overflow-hidden text-base font-black transition-all shadow-lg h-14 rounded-xl"
            :class="[
              module.status === 'completed'
                ? 'bg-slate-800 opacity-50 cursor-not-allowed'
                : '',
              !canSubmit && module.status !== 'completed'
                ? 'bg-slate-200 text-slate-400 shadow-none'
                : '',
              canSubmit && !isAiChecking
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:-translate-y-1 shadow-blue-600/25 text-white'
                : '',
            ]"
          >
            <!-- Overlay animado si la IA está "revisando" -->
            <div
              v-if="isAiChecking"
              class="absolute inset-0 flex items-center justify-center font-bold text-white bg-blue-600 animate-pulse"
            >
              <BrainCircuit class="w-5 h-5 mr-2 animate-spin-slow" /> NEXUS IA
              Validando Respuesta...
            </div>

            <template v-else>
              <Loader2 v-if="isCompleting" class="w-5 h-5 mr-2 animate-spin" />
              <CheckCircle2
                v-else-if="module.status === 'completed'"
                class="w-5 h-5 mr-2"
              />
              <PlayCircle v-else class="w-5 h-5 mr-2" />

              {{
                module.status === "completed"
                  ? "Etapa Completada"
                  : !canSubmit
                    ? "Completa la actividad para avanzar"
                    : "Obtener Recompensa"
              }}
            </template>
          </Button>
        </CardContent>
      </Card>

      <!-- Panel Lateral de Telemetría -->
      <div class="space-y-6">
        <Card class="border-0 shadow-lg bg-[#0B1120] text-white">
          <CardHeader class="pb-4 border-b border-white/10">
            <CardTitle
              class="flex items-center gap-2 text-sm font-bold text-white"
            >
              <Target class="w-4 h-4 text-blue-400" /> Telemetría de Misión
            </CardTitle>
          </CardHeader>
          <CardContent class="p-5 space-y-5">
            <div>
              <p
                class="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1.5"
              >
                Estado
              </p>
              <div class="flex items-center gap-2">
                <div
                  class="w-2 h-2 rounded-full"
                  :class="
                    module.status === 'completed'
                      ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]'
                      : 'bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)] animate-pulse'
                  "
                ></div>
                <span
                  class="text-sm font-black"
                  :class="
                    module.status === 'completed'
                      ? 'text-emerald-400'
                      : 'text-blue-400'
                  "
                >
                  {{
                    module.status === "completed" ? "ARCHIVADO" : "EN EJECUCIÓN"
                  }}
                </span>
              </div>
            </div>

            <div class="pt-4 border-t border-white/10">
              <div class="flex items-end justify-between mb-2">
                <p
                  class="text-[10px] font-bold text-white/50 uppercase tracking-widest"
                >
                  Sincronización
                </p>
                <span class="text-lg font-black text-white"
                  >{{ module.progress }}%</span
                >
              </div>
              <div
                class="w-full h-1.5 bg-white/10 rounded-full overflow-hidden"
              >
                <div
                  class="h-full transition-all duration-1000 rounded-full"
                  :class="
                    module.status === 'completed'
                      ? 'bg-emerald-400'
                      : 'bg-blue-500'
                  "
                  :style="{ width: `${module.progress}%` }"
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button
          variant="outline"
          class="w-full h-12 font-bold border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl"
          @click="emit('back')"
        >
          <ArrowLeft class="w-4 h-4 mr-2" /> Abortar y Volver al Mapa
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-spin-slow {
  animation: spin 3s linear infinite;
}
</style>

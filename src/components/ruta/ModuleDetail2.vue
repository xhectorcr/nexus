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
import { computed, onMounted, ref } from "vue";
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

// Mecánica 2: Lectura/Video (Barra de Energía Gamificada)
const investigationSummary = ref("");
const energyLevel = computed(() => {
  const len = investigationSummary.value.trim().length;
  if (len === 0) return { percent: 0, emoji: '😴', label: 'Esperando', color: 'bg-slate-300' };
  if (len < 20) return { percent: len * 2, emoji: '🐣', label: 'Iniciando', color: 'bg-blue-400' };
  if (len < 50) return { percent: len * 2, emoji: '🚶', label: 'Avanzando', color: 'bg-amber-400' };
  if (len < 100) return { percent: Math.min(100, len), emoji: '🚀', label: 'Explorador', color: 'bg-emerald-400' };
  return { percent: 100, emoji: '🧠', label: 'Sabio', color: 'bg-purple-500' };
});

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
  { key: 'intereses', title: 'Tus Intereses y Pasatiempos', placeholder: 'Ej. Tecnología, negocios, arte...', icon: Star },
  { key: 'inteligenciasMultiples', title: 'Tus Inteligencias Múltiples', placeholder: 'Ej. Lógico-matemática, espacial...', icon: BrainCircuit },
  { key: 'inteligenciaEmocional', title: 'Tu Inteligencia Emocional', placeholder: 'Ej. Alta empatía, capacidad de resolución...', icon: ListChecks },
  { key: 'personalidad', title: 'Tu Personalidad General', placeholder: 'Ej. Introvertido, analítico, detallista...', icon: PenTool },
  { key: 'razonamientoAbstracto', title: 'Tu Razonamiento Abstracto', placeholder: 'Ej. Facilidad para encontrar patrones...', icon: PlayCircle },
  { key: 'perseverancia', title: 'Tu Nivel de Perseverancia', placeholder: 'Ej. Muy constante en metas a largo plazo...', icon: Trophy }
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

  if (moduleType.value === "QUIZ" || moduleType.value === "DESAFIO") {
    return isSequenceCorrect.value;
  }
  if (moduleType.value === "LECTURA" || moduleType.value === "VIDEO") {
    return investigationSummary.value.trim().length >= 50;
  }
  
  if (isFirstBitacora.value) {
    const f = informeForm.value;
    return f.intereses.trim().length > 10 &&
           f.inteligenciasMultiples.trim().length > 10 &&
           f.inteligenciaEmocional.trim().length > 10 &&
           f.personalidad.trim().length > 10 &&
           f.razonamientoAbstracto.trim().length > 10 &&
           f.perseverancia.trim().length > 10;
  }

  // Por defecto (Bitácora, Foro, etc.) normal
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
    <!-- PANTALLA ÉPICA DE MISIÓN COMPLETADA -->
    <div
      v-if="showSuccess"
      class="fixed inset-0 z-[100] flex flex-col items-center justify-center text-white duration-500 bg-[#0B1120]/95 backdrop-blur-md animate-in fade-in zoom-in-95"
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
        class="relative overflow-hidden bg-white border shadow-xl border-slate-200 md:col-span-2"
      >
        <!-- HEADER DINÁMICO -->
        <CardHeader class="px-8 py-5 border-b bg-slate-50/80">
          <CardTitle
            class="flex items-center gap-2 text-xl font-black text-slate-800"
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
          <CardDescription class="text-sm font-medium text-slate-500">
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
            <div class="p-5 text-sm font-medium text-purple-800 border bg-purple-50 border-purple-200 rounded-xl">
              Rompecabezas Estratégico: Ordena los siguientes pasos en la secuencia lógica correcta haciendo clic sobre ellos.
            </div>

            <!-- Slots (Secuencia seleccionada) -->
            <div 
              class="flex flex-col gap-2 p-4 border-2 border-dashed rounded-xl transition-all"
              :class="[
                shakeError ? 'border-red-400 bg-red-50/50 animate-[shake_0.5s_ease-in-out]' : 
                isSequenceCorrect ? 'border-emerald-500 bg-emerald-50/50' : 
                'border-slate-300 bg-slate-50/50'
              ]"
            >
              <div v-if="selectedSequence.length === 0" class="py-4 text-center text-slate-400 font-medium">
                Haz clic en las opciones de abajo para armar la secuencia aquí
              </div>
              <div 
                v-for="(id, index) in selectedSequence" 
                :key="'slot-'+id"
                @click="toggleStep(id)"
                class="flex items-center p-3 bg-white border border-slate-200 rounded-lg shadow-sm cursor-pointer hover:border-red-300 group transition-all"
              >
                <div class="flex items-center justify-center w-6 h-6 mr-3 text-xs font-bold text-white bg-blue-500 rounded-full shrink-0">
                  {{ index + 1 }}
                </div>
                <span class="font-medium text-slate-700 flex-1">{{ puzzleSteps.find(s => s.id === id)?.text }}</span>
                <span class="text-xs text-red-500 opacity-0 group-hover:opacity-100 font-bold transition-opacity">Quitar</span>
              </div>
              <div v-if="shakeError" class="text-center text-xs font-bold text-red-500 mt-2">
                ¡Secuencia incorrecta! Revisa la lógica e intenta de nuevo.
              </div>
            </div>

            <!-- Opciones disponibles -->
            <div class="grid gap-3" v-if="selectedSequence.length < 4">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-widest">Opciones Disponibles:</label>
              <button
                v-for="step in shuffledSteps.filter(s => !selectedSequence.includes(s.id))"
                :key="step.id"
                @click="toggleStep(step.id)"
                class="flex items-center w-full p-4 text-left transition-all border-2 rounded-xl border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 hover:-translate-y-1 hover:shadow-md"
                :disabled="module.status === 'completed'"
              >
                <span class="font-medium text-slate-700">{{ step.text }}</span>
              </button>
            </div>
          </div>

          <!-- ============================================== -->
          <!-- MECÁNICA 2: LECTURA / VIDEO (Resumen Gamificado)-->
          <!-- ============================================== -->
          <div
            v-else-if="moduleType === 'LECTURA' || moduleType === 'VIDEO'"
            class="space-y-6"
          >
            <div
              class="p-5 text-sm font-medium text-blue-800 border border-blue-100 bg-blue-50 rounded-xl"
            >
              Investiga por tu cuenta sobre el tema de esta etapa y escribe un breve resumen de tus descubrimientos.
            </div>
            
            <div class="relative bg-white border border-slate-200 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-transparent transition-all shadow-sm">
              <div class="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <label class="text-sm font-bold text-slate-700">Barra de Energía Cognitiva</label>
                <div class="flex items-center gap-2">
                  <span class="text-xs font-bold text-slate-500">{{ energyLevel.label }}</span>
                  <span class="text-xl">{{ energyLevel.emoji }}</span>
                </div>
              </div>
              
              <!-- Progress bar -->
              <div class="h-1.5 w-full bg-slate-100">
                <div class="h-full transition-all duration-300 ease-out" :class="energyLevel.color" :style="{ width: `${energyLevel.percent}%` }"></div>
              </div>

              <textarea
                v-model="investigationSummary"
                rows="5"
                :disabled="module.status === 'completed'"
                placeholder="Escribe lo que descubriste en tu investigación..."
                class="w-full p-4 text-sm outline-none resize-none bg-transparent disabled:opacity-60"
              ></textarea>
              
              <div class="absolute bottom-4 right-4 flex items-center gap-2">
                <div 
                  v-if="investigationSummary.trim().length > 0 && investigationSummary.trim().length < 50" 
                  class="text-[10px] font-bold text-red-500"
                >
                  Faltan {{ 50 - investigationSummary.trim().length }} caracteres
                </div>
                <div 
                  v-if="investigationSummary.trim().length >= 50" 
                  class="text-emerald-500 flex items-center gap-1 text-xs font-bold animate-in zoom-in"
                >
                  ¡Energía Mínima Alcanzada! <CheckCircle2 class="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          <!-- ============================================== -->
          <!-- MECÁNICA 3: BITÁCORA / FORO                    -->
          <!-- ============================================== -->
          <div v-else class="space-y-6">
            
            <!-- Vista 1: Solo en el primer nodo (Entrevista Interactiva) -->
            <template v-if="isFirstBitacora">
              <div class="p-4 text-sm font-medium text-purple-800 border bg-purple-50 border-purple-200 rounded-xl flex items-center justify-between">
                <div>
                  <h4 class="font-bold text-base mb-1">Entrevista Vocacional con NEXUS</h4>
                  <p class="opacity-80">Completa esta sesión para ayudar a la IA a personalizar tu viaje.</p>
                </div>
                <div class="font-black text-2xl text-purple-300">
                  {{ wizardStep + 1 }}/6
                </div>
              </div>

              <!-- Carrusel / Wizard -->
              <div class="relative bg-white border border-slate-200 rounded-2xl shadow-sm p-6 overflow-hidden">
                <!-- Progreso -->
                <div class="absolute top-0 left-0 h-1 bg-purple-500 transition-all duration-500 ease-out" :style="{ width: `${((wizardStep + 1) / 6) * 100}%` }"></div>
                
                <div class="animate-in slide-in-from-right-4 fade-in duration-300" :key="wizardStep">
                  <div class="flex items-center gap-3 mb-6">
                    <div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                      <component :is="wizardQuestions[wizardStep].icon" class="w-5 h-5" />
                    </div>
                    <h3 class="text-lg font-black text-slate-800">{{ wizardQuestions[wizardStep].title }}</h3>
                  </div>
                  
                  <textarea 
                    v-model="informeForm[wizardQuestions[wizardStep].key as keyof typeof informeForm]"
                    :disabled="module.status === 'completed' || isAiChecking"
                    :placeholder="wizardQuestions[wizardStep].placeholder"
                    rows="4"
                    class="w-full p-4 text-sm transition-all border outline-none rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-60 resize-none"
                  ></textarea>
                </div>

                <div class="flex items-center justify-between mt-6 pt-6 border-t border-slate-100">
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
                    :disabled="informeForm[wizardQuestions[wizardStep].key as keyof typeof informeForm].trim().length < 10"
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
                  class="flex items-center gap-2 text-sm font-black text-slate-800"
                >
                  Tu Reflexión Personal:
                </label>
                <div
                  v-if="module.status !== 'completed'"
                  class="flex items-center gap-2"
                >
                  <span class="text-[10px] font-bold text-slate-500 uppercase"
                    >Calidad:</span
                  >
                  <div
                    class="flex w-24 h-2 overflow-hidden rounded-full bg-slate-100"
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

              <div class="relative">
                <textarea
                  v-model="reflexion"
                  rows="6"
                  :disabled="module.status === 'completed' || isAiChecking"
                  class="w-full p-5 text-sm font-medium transition-all border outline-none resize-none rounded-2xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400 disabled:opacity-60 disabled:bg-slate-100"
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

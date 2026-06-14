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
import { computed, ref } from "vue";

const props = defineProps<{
  module: any;
}>();

const emit = defineEmits(["back", "completed"]);

const isCompleting = ref(false);
const showSuccess = ref(false);
const isAiChecking = ref(false);

// ESTADOS PARA LAS DISTINTAS MECÁNICAS
const moduleType = computed(() => props.module?.tipo || "BITACORA");

// Mecánica 1: Bitácora (Texto)
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

// Mecánica 2: Lectura/Video (Checklist)
const readingChecks = ref([false, false, false]);
const allChecked = computed(() => readingChecks.value.every((v) => v === true));

// Mecánica 3: Quiz (Selección)
const selectedOption = ref<number | null>(null);
const quizOptions = [
  "Analizar datos, investigar y encontrar patrones lógicos.",
  "Hablar con las personas involucradas y entender sus necesidades.",
  "Diseñar un plan visual, prototipos o esquemas creativos.",
  "Liderar al equipo y tomar decisiones rápidas bajo presión.",
];

// Validación dinámica del botón "Completar"
const canSubmit = computed(() => {
  if (props.module.status === "completed" || isCompleting.value) return false;

  if (moduleType.value === "QUIZ" || moduleType.value === "DESAFIO") {
    return selectedOption.value !== null;
  }
  if (moduleType.value === "LECTURA" || moduleType.value === "VIDEO") {
    return allChecked.value;
  }
  // Por defecto (Bitácora, Foro, etc.)
  return reflexion.value.trim().length >= 30;
});

const completarModulo = async () => {
  if (!canSubmit.value) return;

  try {
    // Si es texto, hacemos un pequeño delay simulando que la IA está leyendo
    if (moduleType.value === "BITACORA" || moduleType.value === "FORO") {
      isAiChecking.value = true;
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
          <!-- MECÁNICA 1: QUIZ / DESAFIO (Selección Múltiple)-->
          <!-- ============================================== -->
          <div
            v-if="moduleType === 'QUIZ' || moduleType === 'DESAFIO'"
            class="space-y-4"
          >
            <h3 class="text-lg font-bold text-slate-800">
              ¿Qué actividad disfrutas más al enfrentar un problema complejo?
            </h3>
            <div class="grid gap-3 mt-4">
              <button
                v-for="(option, idx) in quizOptions"
                :key="idx"
                @click="
                  module.status !== 'completed' ? (selectedOption = idx) : null
                "
                class="flex items-center w-full gap-4 p-4 text-left transition-all border-2 rounded-xl"
                :class="
                  selectedOption === idx
                    ? 'border-blue-500 bg-blue-50/50 shadow-md ring-4 ring-blue-500/20'
                    : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                "
                :disabled="module.status === 'completed'"
              >
                <div
                  class="flex items-center justify-center w-6 h-6 border-2 rounded-full shrink-0"
                  :class="
                    selectedOption === idx
                      ? 'border-blue-500'
                      : 'border-slate-300'
                  "
                >
                  <div
                    v-if="selectedOption === idx"
                    class="w-3 h-3 bg-blue-500 rounded-full animate-in zoom-in"
                  ></div>
                </div>
                <span class="font-medium text-slate-700">{{ option }}</span>
              </button>
            </div>
          </div>

          <!-- ============================================== -->
          <!-- MECÁNICA 2: LECTURA / VIDEO (Checklist)        -->
          <!-- ============================================== -->
          <div
            v-else-if="moduleType === 'LECTURA' || moduleType === 'VIDEO'"
            class="space-y-6"
          >
            <div
              class="p-5 text-sm font-medium text-blue-800 border border-blue-100 bg-blue-50 rounded-xl"
            >
              Antes de continuar, marca las casillas para confirmar que has
              procesado el material de estudio asignado.
            </div>
            <div class="space-y-4">
              <label
                class="flex items-center gap-4 p-4 transition-all border cursor-pointer rounded-xl"
                :class="
                  readingChecks[0]
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-slate-200 hover:bg-slate-50'
                "
              >
                <input
                  type="checkbox"
                  v-model="readingChecks[0]"
                  :disabled="module.status === 'completed'"
                  class="w-5 h-5 border-gray-300 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span class="font-medium text-slate-700"
                  >He leído/visto el material completo de esta fase.</span
                >
              </label>
              <label
                class="flex items-center gap-4 p-4 transition-all border cursor-pointer rounded-xl"
                :class="
                  readingChecks[1]
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-slate-200 hover:bg-slate-50'
                "
              >
                <input
                  type="checkbox"
                  v-model="readingChecks[1]"
                  :disabled="module.status === 'completed'"
                  class="w-5 h-5 border-gray-300 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span class="font-medium text-slate-700"
                  >He identificado al menos dos conceptos clave útiles para
                  mí.</span
                >
              </label>
              <label
                class="flex items-center gap-4 p-4 transition-all border cursor-pointer rounded-xl"
                :class="
                  readingChecks[2]
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-slate-200 hover:bg-slate-50'
                "
              >
                <input
                  type="checkbox"
                  v-model="readingChecks[2]"
                  :disabled="module.status === 'completed'"
                  class="w-5 h-5 border-gray-300 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span class="font-medium text-slate-700"
                  >Estoy listo(a) para aplicar este conocimiento en mi test
                  final.</span
                >
              </label>
            </div>
          </div>

          <!-- ============================================== -->
          <!-- MECÁNICA 3: BITÁCORA / FORO (Texto IA)         -->
          <!-- ============================================== -->
          <div v-else class="space-y-4">
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

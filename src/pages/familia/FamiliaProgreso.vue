<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import {
  BarChart3,
  Bell,
  Calendar,
  CheckCircle2,
  Clock,
  Home,
  RefreshCw,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Volume2,
  VolumeX,
} from "lucide-vue-next";
import { computed, markRaw, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useI18n } from "vue-i18n";

const auth = useAuth();
const router = useRouter();
const { t, te } = useI18n();

const vistaFacil = ref(true);
const reproduciendoText = ref("");
const mostrarExplicacionIA = ref(false);
const textoExplicacionIA = ref("");
const isGeneratingIA = ref(false);

// Estado dinámico del backend
const progresoHijo = ref<any>(null);
const isLoading = ref(true);

const fetchProgresoHijo = async () => {
  try {
    isLoading.value = true;
    const response = await api.get("/api/familiar/hijo-progreso");
    progresoHijo.value = response.data.data;
  } catch (error) {
    console.error("Error al obtener el progreso del hijo:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchProgresoHijo();
});

const hablar = (texto: string) => {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    if (reproduciendoText.value === texto) {
      reproduciendoText.value = "";
      return;
    }
    reproduciendoText.value = texto;
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = "es-ES";
    utterance.onend = () => {
      reproduciendoText.value = "";
    };
    window.speechSynthesis.speak(utterance);
  }
};

const fetchExplicacionIA = async () => {
  if (isGeneratingIA.value) return;

  try {
    isGeneratingIA.value = true;
    textoExplicacionIA.value =
      "Pensando... Nexus IA está analizando los datos más recientes de tu hijo/a.";

    const response = await api.get("/api/familiar/hijo-explicacion-ia");
    textoExplicacionIA.value = response.data.data;
  } catch (error) {
    console.error("Error al generar explicación IA:", error);
    textoExplicacionIA.value =
      "Ocurrió un error al contactar con la IA. Por favor, inténtalo de nuevo más tarde.";
  } finally {
    isGeneratingIA.value = false;
  }
};

const handleToggleIA = () => {
  mostrarExplicacionIA.value = !mostrarExplicacionIA.value;
  if (mostrarExplicacionIA.value && !textoExplicacionIA.value) {
    fetchExplicacionIA();
  }
};

// ==========================================
// Cómputos dinámicos del Backend + i18n
// ==========================================

const moduleProgress = computed(() => progresoHijo.value?.modulos || []);
const overallPct = computed(() => progresoHijo.value?.progresoGeneral || 0);

const studentNameReal = computed(
  () =>
    progresoHijo.value?.nombreHijo || auth.state.user?.studentName || "Alumno",
);
const studentNameShort = computed(() => studentNameReal.value.split(" ")[0]);
const careerName = computed(
  () => progresoHijo.value?.carreraRecomendada || "Pendiente",
);

const siguienteTarea = computed(
  () => progresoHijo.value?.siguienteTarea || "Al día",
);
const tiempoEstimado = computed(
  () => progresoHijo.value?.tiempoEstimadoSiguienteTarea || "-",
);
const fechaEstimada = computed(
  () => progresoHijo.value?.fechaEstimadaFinalizacion || "Calculando...",
);
const rachaDias = computed(() => progresoHijo.value?.diasRacha || 0);

const timeline = computed(() => {
  const acts = progresoHijo.value?.actividades || [];
  return acts.map((a: any) => ({
    event: a.event,
    time: a.time,
    color: a.color || "#2E7D32",
    icon: markRaw(CheckCircle2),
  }));
});

const statusConfig = computed<Record<string, any>>(() => ({
  completed: {
    label: t("familia.progreso.status.completed") || "¡Terminado!",
    bg: "bg-emerald-100",
    text: "text-emerald-800 font-bold",
    dot: "#2E7D32",
  },
  in_progress: {
    label: t("familia.progreso.status.in_progress") || "En progreso",
    bg: "bg-amber-100",
    text: "text-amber-800 font-bold",
    dot: "#D4A017",
  },
  pending: {
    label: t("familia.progreso.status.pending") || "Por empezar",
    bg: "bg-gray-100",
    text: "text-gray-600",
    dot: "#9ca3af",
  },
}));

const stats = computed(() => {
  return [
    {
      label: t("familia.progreso.studied_hours") || "Horas dedicadas",
      value: progresoHijo.value?.horasEstudio || "0 horas",
      icon: markRaw(Clock),
      color: "#082065",
    },
    {
      label: t("familia.progreso.completed_topics") || "Temas listos",
      value: progresoHijo.value?.temasCompletados || "0 de 0 listos",
      icon: markRaw(CheckCircle2),
      color: "#2E7D32",
    },
    {
      label: t("familia.progreso.tasks_today") || "Tareas para hoy",
      value: progresoHijo.value?.tareasPendientes || "0 pendientes",
      icon: markRaw(Target),
      color: "#F9A825",
    },
    {
      label: t("familia.progreso.avg_score") || "Calificación",
      value: progresoHijo.value?.calificacionPromedio || "Sin calificar",
      icon: markRaw(Star),
      color: "#D4A017",
    },
  ];
});

const sidebarItems = computed(() => [
  {
    icon: markRaw(Home),
    label: te("nav.home") ? t("nav.home") : "Inicio",
    href: "/familia",
  },
  {
    icon: markRaw(TrendingUp),
    label: t("Ruta de Aprendizaje") || "Ruta de Aprendizaje",
    href: "/familia/progreso",
  },
]);
</script>

<template>
  <DashboardLayout
    :sidebarItems="sidebarItems"
    :title="$t('familia.progreso.title')"
    :subtitle="$t('familia.progreso.subtitle')"
    :breadcrumbs="[
      { label: $t('nav.home'), href: '/familia' },
      { label: $t('Ruta de Aprendizaje') },
    ]"
    moduleColor="#FFB20D"
  >
    <div class="space-y-6">
      <div
        class="flex flex-col items-center justify-between gap-4 p-4 border shadow-sm bg-gradient-to-r from-amber-50 to-amber-100/50 rounded-2xl border-amber-200/60 md:flex-row"
      >
        <div class="flex items-center gap-3">
          <div
            class="flex items-center justify-center w-10 h-10 text-white rounded-full shadow-md bg-amber-500"
          >
            <Sparkles class="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 class="text-lg font-bold text-gray-800">
              {{ $t("familia.progreso.assistant") || "Asistente de Progreso" }}
            </h3>
            <p class="text-xs text-gray-600">
              {{
                $t("familia.progreso.assistant_desc") ||
                "Te explicamos todo paso a paso, con letra grande y audio-lectura."
              }}
            </p>
          </div>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <button
            @click="vistaFacil = !vistaFacil"
            class="flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all shadow-sm rounded-xl"
            :class="
              vistaFacil
                ? 'bg-amber-600 text-white hover:bg-amber-700'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            "
          >
            <span
              class="w-2.5 h-2.5 rounded-full bg-green-400"
              v-if="vistaFacil"
            ></span>
            {{
              vistaFacil
                ? $t("familia.progreso.easy_view_on") || "Vista Fácil: Activada"
                : $t("familia.progreso.easy_view_off") || "Activar Vista Fácil"
            }}
          </button>

          <Button
            @click="handleToggleIA"
            class="bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-semibold gap-1.5 shadow-sm"
          >
            <Sparkles class="w-4 h-4 fill-white" />
            {{
              mostrarExplicacionIA
                ? $t("familia.progreso.close_ai") || "Cerrar Explicación"
                : $t("familia.progreso.ai_explanation") ||
                  "Explicación Sencilla con IA"
            }}
          </Button>
        </div>
      </div>

      <Card
        v-if="mostrarExplicacionIA"
        class="relative p-6 overflow-hidden transition-all shadow-md border-amber-400 bg-amber-50/50 rounded-2xl"
      >
        <div
          class="absolute top-0 right-0 w-32 h-32 -mt-12 -mr-12 rounded-full bg-amber-100 opacity-30"
        ></div>
        <div class="flex flex-col items-start gap-5 md:flex-row">
          <div
            class="flex items-center justify-center w-12 h-12 text-white shadow-lg rounded-2xl bg-amber-600 shrink-0"
          >
            <Sparkles class="w-6 h-6 fill-white" />
          </div>
          <div class="space-y-4">
            <h3
              class="flex items-center gap-2 text-xl font-extrabold text-blue-900"
            >
              {{ $t("familia.progreso.ai_title") || "Explicación IA" }}
            </h3>
            <p
              class="font-medium leading-relaxed text-gray-800"
              :class="vistaFacil ? 'text-lg' : 'text-base'"
            >
              "{{ textoExplicacionIA }}"
            </p>
            <div class="flex flex-wrap items-center gap-3 pt-2">
              <Button
                @click="hablar(textoExplicacionIA)"
                :disabled="isGeneratingIA"
                class="h-10 gap-2 px-5 text-sm font-bold text-white bg-amber-700 hover:bg-amber-800 rounded-xl"
              >
                <component
                  :is="
                    reproduciendoText === textoExplicacionIA ? VolumeX : Volume2
                  "
                  class="w-4.5 h-4.5"
                />
                {{
                  reproduciendoText === textoExplicacionIA
                    ? $t("familia.progreso.stop_voice") || "Detener Voz"
                    : $t("familia.progreso.listen_voice") ||
                      "Escuchar en Voz Alta"
                }}
              </Button>

              <Button
                @click="fetchExplicacionIA"
                :disabled="isGeneratingIA"
                variant="outline"
                class="h-10 gap-2 font-bold text-amber-700 border-amber-300 hover:bg-amber-50 rounded-xl"
              >
                <RefreshCw
                  :class="isGeneratingIA ? 'animate-spin' : ''"
                  class="w-4 h-4"
                />
                {{ isGeneratingIA ? "Generando..." : "Actualizar Resumen" }}
              </Button>

              <Button
                variant="ghost"
                class="font-bold text-amber-700 hover:text-amber-900 hover:bg-amber-100/50"
                @click="mostrarExplicacionIA = false"
              >
                {{ $t("familia.progreso.got_it") || "Entendido, gracias" }}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Card
        class="overflow-hidden border-0 shadow-lg"
        style="
          background: linear-gradient(
            135deg,
            #ffb20d 0%,
            #d4a017 80%,
            #b8870f 100%
          );
        "
      >
        <CardContent class="p-6">
          <div
            class="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center"
          >
            <div class="flex items-center gap-4">
              <Avatar class="w-20 h-20 shadow-md ring-4 ring-white/30">
                <AvatarImage
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop"
                />
                <AvatarFallback
                  class="text-xl font-bold text-white bg-white/20"
                >
                  {{ studentNameShort.charAt(0) }}
                </AvatarFallback>
              </Avatar>
              <div class="space-y-1 text-white">
                <span
                  class="text-white/70 text-xs font-semibold uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded"
                  >{{
                    $t("familia.progreso.registered_child") || "Hijo Registrado"
                  }}</span
                >
                <h1 class="text-2xl font-black">{{ studentNameReal }}</h1>
                <p class="text-sm font-semibold text-white/90">
                  {{
                    $t("familia.progreso.recommended_career") ||
                    "Carrera Recomendada:"
                  }}
                  <span
                    class="bg-white text-[#D4A017] px-2 py-0.5 rounded ml-1 font-extrabold text-xs"
                    >{{ careerName }}</span
                  >
                </p>
              </div>
            </div>

            <div
              class="flex items-center self-stretch justify-between pt-4 text-right text-white border-t md:self-auto md:flex-col md:items-end md:justify-center md:border-t-0 border-white/10 md:pt-0"
            >
              <div>
                <div class="text-4xl font-black md:text-5xl">
                  {{ overallPct }}%
                </div>
                <p class="text-xs font-bold uppercase text-white/70">
                  {{
                    $t("familia.progreso.total_progress") || "Progreso en total"
                  }}
                </p>
              </div>
              <Badge
                class="px-3 py-1 mt-2 text-xs font-bold text-white border-0 shadow-sm bg-emerald-500"
              >
                🔥 {{ rachaDias }}
                {{ $t("familia.progreso.streak") || "días de actividad" }}
              </Badge>
            </div>
          </div>

          <div class="pt-5 mt-6 border-t border-white/10">
            <div class="flex justify-between mb-2 text-sm text-white/90">
              <span class="font-bold">{{
                $t("familia.progreso.general_progress") ||
                "Barra de avance general:"
              }}</span>
              <span class="font-extrabold"
                >{{ overallPct }}%
                {{ $t("familia.progreso.completed") || "completado" }}</span
              >
            </div>
            <div
              class="w-full bg-white/20 rounded-full h-4.5 overflow-hidden p-0.5"
            >
              <div
                class="h-3.5 rounded-full transition-all duration-700 relative overflow-hidden bg-white"
                :style="{ width: `${overallPct}%` }"
              >
                <div
                  class="absolute inset-0 bg-gradient-to-r from-transparent to-white/40 animate-pulse"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card
          v-for="(s, i) in stats"
          :key="i"
          class="border-gray-200 shadow-sm"
          :class="vistaFacil ? 'p-4' : 'p-3'"
        >
          <CardContent class="flex flex-col justify-between h-full p-0">
            <div
              class="flex items-center justify-center w-8 h-8 mb-3 rounded-lg shrink-0"
              :style="{ backgroundColor: `${s.color}15` }"
            >
              <component
                :is="s.icon"
                class="w-4.5 h-4.5"
                :style="{ color: s.color }"
              />
            </div>
            <div>
              <div
                class="mb-1 text-xl font-black leading-none text-gray-900 md:text-2xl"
              >
                {{ s.value }}
              </div>
              <div class="text-xs font-bold leading-snug text-gray-500">
                {{ s.label }}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <Card class="border-gray-200 shadow-sm">
          <CardHeader class="p-5 border-b border-gray-100 bg-gray-50/30">
            <div class="flex flex-wrap items-center justify-between gap-4">
              <div>
                <CardTitle
                  class="flex items-center gap-2 text-lg font-bold text-gray-900"
                >
                  <BarChart3 class="w-5 h-5 text-amber-600" />
                  {{
                    $t("familia.progreso.what_studying") ||
                    "¿Qué está estudiando?"
                  }}
                </CardTitle>
                <CardDescription
                  class="text-gray-600"
                  :class="vistaFacil ? 'text-base' : 'text-sm'"
                >
                  {{
                    $t("familia.progreso.studying_desc") ||
                    "Detalle de los módulos y cursos de Nexus."
                  }}
                </CardDescription>
              </div>
              <div
                class="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 font-bold"
              >
                <span
                  class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"
                ></span>
                {{
                  $t("familia.progreso.real_time") ||
                  "Actualizado en tiempo real"
                }}
              </div>
            </div>
          </CardHeader>
          <CardContent class="p-5 space-y-5">
            <div
              v-for="mod in moduleProgress"
              :key="mod.name"
              class="pb-4 border-b border-gray-100 last:border-0 last:pb-0"
            >
              <div
                class="flex flex-wrap items-start justify-between gap-2 mb-2"
              >
                <div class="space-y-0.5">
                  <span
                    class="font-extrabold text-gray-950"
                    :class="vistaFacil ? 'text-lg' : 'text-base'"
                  >
                    {{ mod.name }}
                  </span>
                  <p
                    v-if="vistaFacil"
                    class="max-w-lg text-xs font-medium leading-relaxed text-gray-500"
                  >
                    {{ mod.desc }}
                  </p>
                </div>

                <div class="flex items-center gap-3">
                  <span
                    :class="`text-xs px-2.5 py-0.5 rounded-full ${statusConfig[mod.status].bg} ${statusConfig[mod.status].text}`"
                  >
                    {{ statusConfig[mod.status].label }}
                  </span>
                  <span class="text-sm font-extrabold text-gray-950">
                    {{ mod.pct }}%
                  </span>
                </div>
              </div>

              <div
                class="w-full bg-gray-100 rounded-full h-3 overflow-hidden p-0.5 border border-gray-200/50"
              >
                <div
                  class="h-2 transition-all duration-700 rounded-full"
                  :style="{ width: `${mod.pct}%`, backgroundColor: mod.color }"
                />
              </div>
            </div>

            <div
              class="flex flex-wrap items-center gap-4 pt-4 text-xs border-t border-gray-100"
            >
              <span class="font-bold text-gray-500">{{
                $t("familia.progreso.color_meaning") || "Significado:"
              }}</span>
              <div
                v-for="s in ['completed', 'in_progress', 'pending']"
                :key="s"
                class="flex items-center gap-1.5"
              >
                <div
                  class="w-3 h-3 border rounded-full"
                  :style="{ backgroundColor: statusConfig[s].dot }"
                />
                <span class="font-semibold text-gray-600">{{
                  statusConfig[s].label
                }}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div class="space-y-6">
          <Card
            class="relative overflow-hidden border-amber-300 bg-amber-50/40"
          >
            <CardHeader class="p-4 pb-2">
              <CardTitle
                class="text-sm font-bold flex items-center gap-1.5 text-amber-900"
              >
                <Target class="w-4 h-4 text-amber-700" />
                {{
                  $t("familia.progreso.next_task", {
                    name: studentNameShort,
                  }) || `Siguiente tarea de ${studentNameShort}:`
                }}
              </CardTitle>
            </CardHeader>
            <CardContent class="p-4 pt-0 space-y-1">
              <p class="text-sm font-bold text-gray-950">
                {{ siguienteTarea }}
              </p>
              <p class="text-xs font-semibold text-amber-800">
                {{
                  $t("familia.progreso.estimated_time") || "Tiempo estimado:"
                }}
                {{ tiempoEstimado }}
              </p>
            </CardContent>
          </Card>

          <Card class="border-gray-200 shadow-sm">
            <CardContent class="flex items-center gap-3 p-4">
              <div
                class="flex items-center justify-center w-10 h-10 border bg-amber-50 border-amber-200 rounded-xl shrink-0"
              >
                <Calendar class="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p
                  class="text-[10px] text-gray-500 font-bold uppercase leading-none"
                >
                  {{
                    $t("familia.progreso.estimated_date") ||
                    "Fecha de finalización"
                  }}
                </p>
                <p class="mt-1 text-sm font-black text-gray-900">
                  {{ fechaEstimada }}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card class="border-gray-200 shadow-sm">
            <CardHeader class="p-4 pb-2 border-b border-gray-100">
              <CardTitle
                class="text-sm font-bold text-gray-900 flex items-center gap-1.5"
              >
                <Bell class="w-4 h-4 text-gray-500" />
                {{
                  $t("familia.progreso.recent_history", {
                    name: studentNameShort,
                  }) || "Historial Reciente"
                }}
              </CardTitle>
            </CardHeader>
            <CardContent class="p-4 space-y-3">
              <div
                v-if="timeline.length === 0"
                class="py-4 text-sm font-medium text-center text-gray-500"
              >
                Aún no hay actividades registradas.
              </div>
              <div
                v-for="(t, i) in timeline"
                :key="i"
                class="flex items-start gap-3"
              >
                <div
                  class="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 border"
                  :style="{
                    backgroundColor: `${t.color}10`,
                    borderColor: `${t.color}30`,
                  }"
                >
                  <component
                    :is="t.icon"
                    class="w-3.5 h-3.5"
                    :style="{ color: t.color }"
                  />
                </div>
                <div class="min-w-0">
                  <p class="text-xs font-bold leading-snug text-gray-900">
                    {{ t.event }}
                  </p>
                  <p class="text-[10px] text-gray-500 font-semibold mt-0.5">
                    {{ t.time }}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <a href="/familia" class="block w-full">
            <Button
              variant="outline"
              class="w-full gap-1.5 font-bold rounded-xl text-sm h-11 border-gray-300"
            >
              {{ $t("familia.progreso.back_home") || "Volver al inicio" }}
            </Button>
          </a>
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

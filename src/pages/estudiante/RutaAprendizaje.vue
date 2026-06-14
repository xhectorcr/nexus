<script setup lang="ts">
import ModuleDetail from "@/components/ruta/ModuleDetail.vue";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  Circle,
  Clock,
  Flame,
  Gamepad2,
  GraduationCap,
  Home,
  Lock,
  Map as MapIcon,
  PlayCircle,
  Sparkles,
  Star,
  Target,
  TrendingUp,
} from "lucide-vue-next";
import { computed, markRaw, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

const auth = useAuth();
const { t } = useI18n();

const modules = ref<any[]>([]);
const selectedModule = ref<any>(null);
const nextNodeRef = ref<any>(null);
const isGenerating = ref(false);

const totalProgress = ref(0);
const userXP = ref(0);
const userLevel = ref(1);
const userStreak = ref(0);
const dynamicStats = ref({ hours: 0, completed: 0, pending: 0, avgScore: 0 });

const dynamicDate = computed(() => {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date.toLocaleDateString("es-PE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
});

const badges = [
  { name: "Explorador", icon: "🧭", earned: true },
  { name: "Constante", icon: "🔥", earned: true },
  { name: "Pensador", icon: "🧠", earned: false },
  { name: "Visionario", icon: "👁️", earned: false },
];

const sidebarItems = computed(() => [
  {
    icon: markRaw(Home),
    label: t("nav.home") || "Inicio",
    href: "/estudiante",
  },
  {
    icon: markRaw(MapIcon),
    label: t("nav.learning_path") || "Ruta Inteligente",
    href: "/estudiante/ruta",
  },
]);

const stats = computed(() => [
  {
    label: t("ruta.studied_hours") || "Horas Estudiadas",
    value: `${dynamicStats.value.hours}h`,
    icon: markRaw(Clock),
    color: "#082065",
  },
  {
    label: t("ruta.completed_modules") || "Completados",
    value: dynamicStats.value.completed.toString(),
    icon: markRaw(CheckCircle2),
    color: "#2E7D32",
  },
  {
    label: t("ruta.pending_activities") || "Pendientes",
    value: dynamicStats.value.pending.toString(),
    icon: markRaw(Circle),
    color: "#F9A825",
  },
  {
    label: t("ruta.average_score") || "Promedio",
    value: dynamicStats.value.avgScore.toString(),
    icon: markRaw(Star),
    color: "#D4A017",
  },
]);

const fetchNextIntelligentNode = async () => {
  try {
    isGenerating.value = true;

    const usuarioId = auth.state.user?.id || 1;
    let postulanteId = usuarioId;
    try {
      const profRes = await api.get(`/api/estudiantes/by-usuario/${usuarioId}`);
      if (profRes.data?.data?.id) postulanteId = profRes.data.data.id;
    } catch (e) {
      console.warn(
        "No se pudo obtener el perfil de postulante, usando fallback ID",
      );
    }

    try {
      const journeyRes = await api.get(
        `/api/journeys/postulante/${postulanteId}/activo`,
      );
      if (journeyRes.data && journeyRes.data.success) {
        const journey = journeyRes.data.data;

        let xpCounter = 0;
        let completedCount = 0;
        let pendingCount = 0;

        modules.value = journey.nodos.map((nodo: any, i: number) => {
          let color = "#082065";
          let icon = Target;
          if (nodo.tipo === "FORO") {
            color = "#FFB20D";
            icon = MapIcon;
          }
          if (nodo.tipo === "LABERINTO" || nodo.tipo === "QUIZ") {
            color = "#B50E30";
            icon = Gamepad2;
          }
          if (nodo.tipo === "MENTORIA") {
            color = "#2E7D32";
            icon = Star;
          }

          const isCompleted = nodo.estado === "COMPLETADO";
          const isAvailable =
            nodo.estado === "PENDIENTE" &&
            (i === 0 || journey.nodos[i - 1].estado === "COMPLETADO");

          if (isCompleted) {
            xpCounter += nodo.xp || 0;
            completedCount++;
          }
          if (nodo.estado === "PENDIENTE") pendingCount++;

          return {
            id: nodo.id,
            title: nodo.titulo,
            description: nodo.descripcion,
            icon: markRaw(icon),
            color,
            status: isCompleted
              ? "completed"
              : isAvailable
                ? "available"
                : "locked",
            progress: isCompleted ? 100 : 0,
            xp: nodo.xp || 10,
          };
        });

        userXP.value = xpCounter;
        userLevel.value = Math.floor(xpCounter / 100) + 1;
        userStreak.value = Math.max(1, completedCount * 2);
        totalProgress.value =
          Math.round((completedCount / journey.nodos.length) * 100) || 0;

        dynamicStats.value.completed = completedCount;
        dynamicStats.value.pending = pendingCount;
        dynamicStats.value.hours = +(completedCount * 1.5).toFixed(1);
        dynamicStats.value.avgScore =
          completedCount > 0
            ? +(14 + (postulanteId % 5) + completedCount * 0.5).toFixed(1)
            : 0;
      }
    } catch (e) {
      console.error(
        "No se encontró un journey activo, usando datos de MOCK para la Demo.",
      );
      totalProgress.value = 45;
      userXP.value = 450;
      userLevel.value = 3;
      userStreak.value = 12;
      dynamicStats.value = {
        hours: 8.5,
        completed: 1,
        pending: 2,
        avgScore: 16.5,
      };

      modules.value = [
        {
          id: 1,
          title: t("familia.progreso.modules.m1_name") || "Módulo 1",
          description: "Desc.",
          icon: markRaw(Target),
          color: "#082065",
          status: "completed",
          progress: 100,
          xp: 100,
        },
        {
          id: 2,
          title: t("familia.progreso.modules.m2_name") || "Módulo 2",
          description: "Desc.",
          icon: markRaw(MapIcon),
          color: "#FFB20D",
          status: "available",
          progress: 60,
          xp: 150,
        },
        {
          id: 3,
          title: t("familia.progreso.modules.m3_name") || "Módulo 3",
          description: "Desc.",
          icon: markRaw(Gamepad2),
          color: "#B50E30",
          status: "locked",
          progress: 0,
          xp: 200,
        },
      ];
    }

    try {
      const aiRes = await api.get(
        `/api/v1/ai/ruta/siguiente-nodo?postulanteId=${postulanteId}`,
      );
      if (aiRes.data && aiRes.data.success) {
        nextNodeRef.value = aiRes.data.data;
      }
    } catch (e) {
      console.warn("No se pudo obtener el nodo de la IA", e);
    }
  } catch (error) {
    console.error("Error crítico cargando la ruta", error);
  } finally {
    isGenerating.value = false;
  }
};

const generarNuevaRutaCompleta = async () => {
  try {
    isGenerating.value = true;
    const usuarioId = auth.state.user?.id || 1;
    let postulanteId = usuarioId;

    try {
      const profRes = await api.get(`/api/postulantes/by-usuario/${usuarioId}`);
      if (profRes.data?.data?.id) postulanteId = profRes.data.data.id;
    } catch (e) {}

    const res = await api.post(
      `/api/v1/ai/ruta/generar-completa?postulanteId=${postulanteId}`,
    );
    if (res.data && res.data.success) {
      alert("¡Ruta completa generada exitosamente con IA!");
      await fetchNextIntelligentNode(); // Recarga la UI dinámicamente
    }
  } catch (error) {
    console.error("Error generando ruta completa", error);
    alert("Ocurrió un error generando la ruta.");
  } finally {
    isGenerating.value = false;
  }
};

onMounted(() => {
  fetchNextIntelligentNode();
});
</script>

<template>
  <DashboardLayout
    v-if="selectedModule"
    :sidebarItems="sidebarItems"
    title="NEXUS Estudiante"
    :subtitle="$t('nav.learning_path')"
    :breadcrumbs="[
      { label: $t('nav.home'), href: '/estudiante' },
      { label: $t('nav.learning_path'), href: '/estudiante/ruta' },
      { label: selectedModule.title },
    ]"
    moduleColor="#B50E30"
  >
    <div class="mb-4">
      <Button
        variant="ghost"
        @click="selectedModule = null"
        class="flex items-center gap-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft class="w-4 h-4" />
        {{ $t("nav.learning_path") }}
      </Button>
    </div>
    <ModuleDetail :module="selectedModule" />
  </DashboardLayout>

  <DashboardLayout
    v-else
    :sidebarItems="sidebarItems"
    title="NEXUS Estudiante"
    :subtitle="$t('ruta.title_dynamic')"
    :breadcrumbs="[
      { label: $t('nav.home'), href: '/estudiante' },
      { label: $t('ruta.breadcrumb_path') },
    ]"
    moduleColor="#B50E30"
  >
    <div class="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
      <div class="space-y-4">
        <Card
          class="relative overflow-hidden border-0 shadow-xl shadow-red-900/10"
          style="
            background: linear-gradient(
              135deg,
              #b50e30 0%,
              #8f0b26 60%,
              #5c0517 100%
            );
          "
        >
          <div
            class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"
          ></div>
          <div
            class="absolute top-0 right-0 w-32 h-32 translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none bg-white/10 blur-2xl"
          ></div>

          <CardContent class="relative z-10 p-6">
            <div
              class="flex flex-col items-start gap-5 sm:flex-row sm:items-center"
            >
              <div class="relative group">
                <div
                  class="absolute inset-0 transition-all duration-300 bg-white/30 blur-lg rounded-xl group-hover:bg-white/40"
                ></div>
                <Avatar
                  class="relative z-10 w-20 h-20 shadow-xl ring-4 ring-white/20"
                >
                  <AvatarImage
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop"
                  />
                  <AvatarFallback class="text-white bg-[#B50E30]"
                    >AL</AvatarFallback
                  >
                </Avatar>
                <div
                  class="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-400 to-amber-600 text-white text-[11px] font-black px-2.5 py-0.5 rounded-lg border-2 border-[#8F0B26] shadow-lg z-20"
                >
                  NIVEL {{ userLevel }}
                </div>
              </div>
              <div class="flex-1 text-white">
                <p
                  class="text-[11px] font-bold text-red-200 tracking-widest uppercase mb-1"
                >
                  {{ $t("ruta.welcome_back") }}
                </p>
                <h2 class="text-2xl font-black leading-tight tracking-tight">
                  {{ auth.state.user?.name || "Alejandro Lastra" }}
                </h2>
                <div
                  class="flex items-center gap-1.5 mt-2 bg-white/10 w-fit px-2.5 py-1 rounded-md backdrop-blur-sm border border-white/10"
                >
                  <GraduationCap class="w-4 h-4 text-amber-300" />
                  <span class="text-xs font-semibold text-amber-100">{{
                    auth.state.user?.careerSuggestion ||
                    "Ingeniería de Sistemas - V Ciclo"
                  }}</span>
                </div>
              </div>

              <div
                class="p-3 mt-4 text-left text-white border sm:text-right sm:mt-0 bg-black/20 rounded-xl border-white/10 backdrop-blur-md"
              >
                <div
                  class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-red-200"
                >
                  {{ Math.round(totalProgress) }}%
                </div>
                <div
                  class="text-[10px] uppercase tracking-wider text-red-200 font-bold mb-1"
                >
                  {{ $t("ruta.completed") }}
                </div>
                <div
                  class="flex items-center justify-start sm:justify-end gap-1.5 mt-2"
                >
                  <Flame class="w-4 h-4 text-orange-400 animate-pulse" />
                  <span class="text-xs font-bold text-orange-200"
                    >{{ userStreak }} días en racha</span
                  >
                </div>
              </div>
            </div>

            <div class="mt-6">
              <div
                class="flex justify-between text-[11px] font-bold text-red-100 uppercase tracking-wider mb-2"
              >
                <span>{{ $t("ruta.progress_nexus") }}</span>
                <span
                  >{{ Math.round(totalProgress) }}% {{ $t("ruta.total") }}</span
                >
              </div>
              <div
                class="w-full h-2.5 rounded-full bg-black/30 shadow-inner overflow-hidden border border-white/5"
              >
                <div
                  class="relative h-full transition-all duration-1000 ease-out rounded-full"
                  :style="{
                    width: `${totalProgress}%`,
                    background: 'linear-gradient(90deg, #F59E0B, #FCD34D)',
                  }"
                >
                  <div
                    class="absolute inset-0 bg-white/20 animate-[pulse_2s_ease-in-out_infinite]"
                  ></div>
                </div>
              </div>
            </div>

            <div
              class="flex items-center gap-3 pt-5 mt-5 border-t border-white/10"
            >
              <div class="flex gap-2">
                <div
                  v-for="b in badges"
                  :key="b.name"
                  :title="b.name"
                  :class="`text-xl w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 hover:scale-110 ${
                    b.earned
                      ? 'bg-gradient-to-br from-white/20 to-white/5 border border-white/20 shadow-lg backdrop-blur-sm'
                      : 'bg-black/20 border border-white/5 grayscale opacity-50'
                  }`"
                >
                  {{ b.icon }}
                </div>
              </div>
              <div class="ml-auto">
                <Badge
                  class="px-3 py-1 text-sm font-black text-white transition-all border-0 shadow-lg bg-gradient-to-r from-amber-500 to-amber-600 shadow-amber-900/50 hover:from-amber-400 hover:to-amber-500"
                >
                  <TrendingUp class="w-4 h-4 mr-1.5" />
                  {{ userXP }} XP
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          class="border-0 overflow-hidden bg-[#121826] text-white shadow-xl"
        >
          <CardHeader
            class="pb-3 pt-5 px-5 border-b border-white/10 relative z-10 bg-[#121826]"
          >
            <div class="flex items-center justify-between">
              <div>
                <CardTitle class="flex items-center gap-2 text-white">
                  <MapIcon class="w-5 h-5 text-[#B50E30]" />
                  {{ $t("ruta.path_title") }}
                </CardTitle>
                <p class="text-sm text-white/50 mt-0.5 font-mono">
                  {{ $t("ruta.dynamic_node") }}
                </p>
              </div>
              <div class="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  class="text-white border-white/20 bg-white/5 hover:bg-white/10"
                  @click="generarNuevaRutaCompleta"
                  :disabled="isGenerating"
                >
                  <Sparkles
                    v-if="!isGenerating"
                    class="w-4 h-4 mr-2 text-yellow-400"
                  />
                  <span v-if="isGenerating">{{ $t("ruta.calculating") }}</span>
                  <span v-else>{{ $t("ruta.generate_ia") }}</span>
                </Button>
                <Badge
                  variant="outline"
                  class="text-white border-white/20 bg-white/5"
                >
                  {{ modules.length }} Módulos
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent class="px-0 pb-0 bg-[#121826]">
            <div class="relative min-h-[800px] w-full overflow-hidden">
              <div
                class="absolute inset-0"
                style="
                  background-image:
                    linear-gradient(
                      rgba(255, 255, 255, 0.02) 1px,
                      transparent 1px
                    ),
                    linear-gradient(
                      90deg,
                      rgba(255, 255, 255, 0.02) 1px,
                      transparent 1px
                    );
                  background-size: 30px 30px;
                "
              />
              <svg
                v-if="modules.length > 1"
                class="absolute inset-0 z-0 w-full h-full pointer-events-none"
              >
                <defs>
                  <filter
                    id="glow-red"
                    x="-20%"
                    y="-20%"
                    width="140%"
                    height="140%"
                  >
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite
                      in="SourceGraphic"
                      in2="blur"
                      operator="over"
                    />
                  </filter>
                </defs>
                <line
                  v-for="i in modules.length - 1"
                  :key="'line-' + i"
                  :x1="(i - 1) % 2 === 0 ? '35%' : '65%'"
                  :y1="`${(100 * (i - 1 + 0.5)) / modules.length}%`"
                  :x2="i % 2 === 0 ? '35%' : '65%'"
                  :y2="`${(100 * (i + 0.5)) / modules.length}%`"
                  :stroke="
                    modules[i - 1].status === 'available' &&
                    modules[i].status === 'available'
                      ? '#EF4444'
                      : modules[i - 1].status === 'available'
                        ? '#991B1B'
                        : '#374151'
                  "
                  stroke-width="3"
                  :stroke-dasharray="
                    modules[i - 1].status === 'available' &&
                    modules[i].status === 'available'
                      ? '8 6'
                      : '0'
                  "
                  :class="
                    modules[i - 1].status === 'available' &&
                    modules[i].status === 'available'
                      ? 'animate-[dash_2s_linear_infinite]'
                      : ''
                  "
                  stroke-linecap="round"
                />
              </svg>

              <div
                class="relative z-10 flex flex-col justify-between w-full h-full py-12"
                :style="{ minHeight: `${modules.length * 150}px` }"
              >
                <div
                  v-for="(mod, idx) in modules"
                  :key="mod.id"
                  class="relative flex items-center flex-1 w-full"
                >
                  <div
                    class="absolute flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2 group"
                    :class="
                      mod.status === 'available'
                        ? 'cursor-pointer'
                        : 'cursor-not-allowed'
                    "
                    :style="{ left: idx % 2 === 0 ? '35%' : '65%', top: '50%' }"
                    @click="
                      mod.status === 'available' && (selectedModule = mod)
                    "
                  >
                    <div
                      v-if="
                        mod.status === 'available' &&
                        mod.progress > 0 &&
                        mod.progress < 100
                      "
                      class="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#EF4444] text-white text-[11px] font-bold px-3 py-1.5 rounded shadow-lg shadow-red-500/30 whitespace-nowrap z-30 tracking-wide uppercase transition-transform group-hover:-translate-y-2"
                    >
                      {{ $t("ruta.continue_route") }}
                      <div
                        class="absolute -bottom-1 left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-[#EF4444]"
                      ></div>
                    </div>

                    <div class="relative z-20">
                      <svg
                        width="150"
                        height="120"
                        viewBox="0 0 150 120"
                        class="overflow-visible drop-shadow-2xl"
                      >
                        <g>
                          <ellipse
                            cx="75"
                            cy="100"
                            rx="45"
                            ry="15"
                            fill="black"
                            fill-opacity="0.5"
                            class="transition-transform duration-500 group-hover:scale-90 opacity-60"
                          />
                          <g class="transform translate-y-6">
                            <polygon
                              points="75,30 135,60 75,90 15,60"
                              fill="#1F2937"
                            />
                            <polygon
                              points="15,60 75,90 75,100 15,70"
                              fill="#111827"
                            />
                            <polygon
                              points="75,90 135,60 135,70 75,100"
                              fill="#030712"
                            />
                            <polygon
                              points="75,30 135,60 75,90 15,60"
                              fill="none"
                              stroke="#374151"
                              stroke-width="1"
                            />
                          </g>
                          <g
                            :class="`transition-all duration-500 ease-out ${mod.status === 'available' ? 'group-hover:-translate-y-4' : 'opacity-60'}`"
                          >
                            <polygon
                              points="75,10 135,40 75,70 15,40"
                              :fill="
                                mod.status === 'available'
                                  ? '#EF4444'
                                  : '#4B5563'
                              "
                            />
                            <polygon
                              points="75,10 135,40 75,70 15,40"
                              fill="white"
                              fill-opacity="0.1"
                            />
                            <polygon
                              v-if="mod.status === 'available'"
                              points="75,22 120,44 75,66 30,44"
                              fill="none"
                              stroke="#FECACA"
                              stroke-width="1.5"
                              opacity="0.6"
                            />
                            <polygon
                              v-if="mod.status === 'available'"
                              points="75,30 105,45 75,60 45,45"
                              :fill="'#B91C1C'"
                              opacity="0.4"
                            />
                            <polygon
                              points="15,40 75,70 75,80 15,50"
                              :fill="
                                mod.status === 'available'
                                  ? '#DC2626'
                                  : '#374151'
                              "
                            />
                            <polygon
                              points="15,40 75,70 75,80 15,50"
                              fill="black"
                              fill-opacity="0.2"
                            />
                            <polygon
                              points="75,70 135,40 135,50 75,80"
                              :fill="
                                mod.status === 'available'
                                  ? '#B91C1C'
                                  : '#1F2937'
                              "
                            />
                            <polygon
                              points="75,70 135,40 135,50 75,80"
                              fill="black"
                              fill-opacity="0.4"
                            />
                          </g>
                        </g>
                      </svg>
                    </div>

                    <div
                      class="absolute whitespace-nowrap top-[45%] -translate-y-1/2 transition-transform duration-500"
                      :class="[
                        idx % 2 === 0
                          ? 'left-[100%] ml-2 text-left'
                          : 'right-[100%] mr-2 text-right',
                        mod.status === 'available'
                          ? 'group-hover:-translate-y-4'
                          : '',
                      ]"
                    >
                      <p
                        class="text-xs text-white/40 font-mono mb-0.5 uppercase tracking-wider"
                      >
                        {{ $t("ruta.module_prefix") || "Módulo" }} {{ idx + 1 }}
                      </p>
                      <h3
                        :class="`text-sm font-bold w-48 whitespace-normal leading-tight ${mod.status === 'available' ? 'text-white drop-shadow-md' : 'text-gray-500'}`"
                      >
                        {{ mod.title }}
                      </h3>
                      <p
                        v-if="mod.status === 'available'"
                        class="text-[11px] mt-1.5 flex items-center font-medium"
                        :class="
                          idx % 2 === 0
                            ? 'justify-start text-[#EF4444]'
                            : 'justify-end text-[#EF4444]'
                        "
                      >
                        <component :is="mod.icon" class="w-3.5 h-3.5 mr-1" />
                        {{ mod.progress }}% completado
                      </p>
                      <p
                        v-else
                        class="text-[11px] text-gray-500 mt-1.5 flex items-center font-medium"
                        :class="idx % 2 === 0 ? 'justify-start' : 'justify-end'"
                      >
                        <Lock class="w-3 h-3 mr-1" />
                        {{ $t("ruta.locked") || "Bloqueado" }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div class="space-y-4">
        <Card
          class="relative overflow-hidden bg-white border-0 shadow-lg group"
        >
          <div
            class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#B50E30] via-red-500 to-[#B50E30] opacity-80"
          ></div>
          <div
            class="absolute w-32 h-32 transition-colors duration-500 rounded-full pointer-events-none -right-10 -top-10 bg-red-50 blur-3xl group-hover:bg-red-100"
          ></div>

          <CardContent class="relative z-10 p-5">
            <div class="flex items-center gap-3 mb-4">
              <div class="relative">
                <div
                  class="absolute inset-0 bg-[#B50E30] blur-sm opacity-40 rounded-xl group-hover:opacity-60 transition-opacity"
                ></div>
                <div
                  class="w-10 h-10 bg-gradient-to-br from-[#B50E30] to-[#8F0B26] rounded-xl flex items-center justify-center relative z-10 shadow-sm"
                >
                  <PlayCircle class="w-5 h-5 text-white" />
                </div>
              </div>
              <div class="flex-1">
                <p
                  class="text-[10px] font-black text-[#B50E30] uppercase tracking-wider mb-0.5 flex items-center gap-1"
                >
                  <Sparkles class="w-3 h-3" />
                  {{ $t("ruta.ai_recommendation") || "Recomendación IA" }}
                </p>
                <p class="text-sm font-bold leading-tight text-slate-800">
                  {{
                    nextNodeRef
                      ? nextNodeRef.tituloNodo
                      : $t("ruta.calculating_short")
                  }}
                </p>
              </div>
            </div>

            <div
              class="p-3 mb-4 border shadow-inner bg-slate-50 border-slate-100 rounded-xl"
            >
              <p
                class="text-xs italic font-medium leading-relaxed text-slate-600 line-clamp-3"
              >
                "{{
                  nextNodeRef
                    ? nextNodeRef.justificacionIA
                    : $t("ruta.evaluating_profile")
                }}"
              </p>
            </div>

            <Button
              class="w-full bg-[#B50E30] hover:bg-[#8F0B26] text-white text-sm gap-2 shadow-lg shadow-red-900/20 font-bold h-11 transition-all hover:-translate-y-0.5"
            >
              <PlayCircle class="w-4 h-4" />
              {{ $t("ruta.start_experience") || "Iniciar Experiencia" }} (+{{
                nextNodeRef?.xpRecompensa || 0
              }}
              XP)
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent class="grid grid-cols-2 gap-3 p-4">
            <div
              v-for="s in stats"
              :key="s.label"
              class="p-3 bg-secondary/50 rounded-xl"
            >
              <component
                :is="s.icon"
                class="w-4 h-4 mb-1.5"
                :style="{ color: s.color }"
              />
              <div class="text-lg font-bold leading-none">{{ s.value }}</div>
              <div class="text-xs text-muted-foreground mt-0.5 leading-tight">
                {{ s.label }}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent class="flex items-center gap-3 p-4">
            <div
              class="w-8 h-8 bg-[#082065]/10 rounded-lg flex items-center justify-center"
            >
              <Award class="w-4 h-4 text-[#082065]" />
            </div>
            <div>
              <p class="text-xs text-muted-foreground">
                {{
                  $t("ruta.estimated_date") || "Fecha estimada de finalización"
                }}
              </p>
              <p class="text-sm font-semibold">{{ dynamicDate }}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </DashboardLayout>
</template>

<style scoped>
.transition-all {
  transition: all 0.25s ease;
}
</style>

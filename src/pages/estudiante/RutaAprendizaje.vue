<script setup lang="ts">
import { ref, markRaw, onMounted, computed } from "vue";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Home,
  Map as MapIcon,
  Star,
  Lock,
  CheckCircle2,
  Circle,
  PlayCircle,
  Clock,
  Zap,
  Brain,
  Target,
  Heart,
  Gamepad2,
  ArrowLeft,
  Award,
  Flame,
  TrendingUp,
  GraduationCap,
  Sparkles,
} from "lucide-vue-next";
import ModuleDetail from "@/components/ruta/ModuleDetail.vue";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { useI18n } from "vue-i18n";

const auth = useAuth();
const { t } = useI18n();

const modules = ref<any[]>([]);

const badges = [
  { name: "Explorador", icon: "🧭", earned: true },
  { name: "Constante", icon: "🔥", earned: true },
  { name: "Pensador", icon: "🧠", earned: false },
  { name: "Visionario", icon: "👁️", earned: false },
];

const sidebarItems = computed(() => [
  { icon: markRaw(Home), label: t("nav.home"), href: "/estudiante" },
  {
    icon: markRaw(MapIcon),
    label: t("nav.learning_path"),
    href: "/estudiante/ruta",
  },
]);

const selectedModule = ref<any>(null);
const totalProgress = ref(20);
const nextNodeRef = ref<any>(null);
const isGenerating = ref(false);
const studentCareer = ref<string>("Ingeniería - I Ciclo");

const fetchNextIntelligentNode = async () => {
  try {
    const usuarioId = auth.state.user?.id;
    if (!usuarioId) return;
    // Get Current Journey
    try {
      const journeyRes = await api.get(
        `/api/journeys/usuario/${usuarioId}/activo`,
      );
      if (journeyRes.data && journeyRes.data.success) {
        const journey = journeyRes.data.data;
        totalProgress.value = journey.porcentajeProgreso || 0;

        // Map nodes to UI modules
        modules.value = journey.nodos.map((nodo: any, i: number) => {
          let color = "#082065";
          let icon = Target;
          if (nodo.tipo === "FORO") {
            color = "#FFB20D";
            icon = MapIcon;
          }
          if (nodo.tipo === "LABERINTO") {
            color = "#B50E30";
            icon = Gamepad2;
          }
          if (nodo.tipo === "MENTORIA") {
            color = "#2E7D32";
            icon = Star;
          }

          return {
            id: nodo.id,
            title: nodo.titulo,
            description: nodo.descripcion,
            icon,
            color,
            status:
              nodo.estado === "COMPLETADO"
                ? "completed"
                : nodo.estado === "PENDIENTE" &&
                    (i === 0 || journey.nodos[i - 1].estado === "COMPLETADO")
                  ? "available"
                  : "locked",
            progress: nodo.estado === "COMPLETADO" ? 100 : 0,
            xp: nodo.xp,
          };
        });
      }
    } catch (e) {
      console.error("No se encontro un journey activo, usando datos de prueba.")
      totalProgress.value = 45;
      modules.value = [
        {
          id: 1,
          title: t('familia.progreso.modules.m1_name'),
          description: t('familia.progreso.modules.m1_desc'),
          icon: Target,
          color: "#082065",
          status: 'completed',
          progress: 100,
          xp: 100
        },
        {
          id: 2,
          title: t('familia.progreso.modules.m2_name'),
          description: t('familia.progreso.modules.m2_desc'),
          icon: MapIcon,
          color: "#FFB20D",
          status: 'available',
          progress: 60,
          xp: 150
        },
        {
          id: 3,
          title: t('familia.progreso.modules.m3_name'),
          description: t('familia.progreso.modules.m3_desc'),
          icon: Gamepad2,
          color: "#B50E30",
          status: 'locked',
          progress: 0,
          xp: 200
        },
        {
          id: 4,
          title: t('familia.progreso.modules.m4_name'),
          description: t('familia.progreso.modules.m4_desc'),
          icon: Target,
          color: "#082065",
          status: 'locked',
          progress: 0,
          xp: 200
        },
        {
          id: 5,
          title: t('familia.progreso.modules.m5_name'),
          description: t('familia.progreso.modules.m5_desc'),
          icon: Gamepad2,
          color: "#B50E30",
          status: 'locked',
          progress: 0,
          xp: 300
        },
        {
          id: 6,
          title: t('familia.progreso.modules.m6_name'),
          description: t('familia.progreso.modules.m6_desc'),
          icon: Star,
          color: "#2E7D32",
          status: 'locked',
          progress: 0,
          xp: 500
        }
      ]
    }
  } catch (error) {
    console.error("No se pudo obtener el nodo de la IA", error);
  }
};

const generarNuevaRutaCompleta = async () => {
  try {
    isGenerating.value = true;
    const usuarioId = auth.state.user?.id;
    if (!usuarioId) return;
    const res = await api.post(
      `/api/v1/ai/ruta/generar-completa?usuarioId=${usuarioId}`,
    );
    if (res.data && res.data.success) {
      // Reload the page or fetch new nodes
      alert("¡Ruta completa generada exitosamente con IA!");
      await fetchNextIntelligentNode();
    }
  } catch (error) {
    console.error("Error generando ruta completa", error);
    alert("Ocurrió un error generando la ruta.");
  } finally {
    isGenerating.value = false;
  }
};

const fetchEstudianteData = async () => {
  const userId = auth.state.user?.id;
  if (!userId) return;

  try {
    const perfilRes = await api.get(`/api/estudiantes/by-usuario/${userId}`);
    if (perfilRes.data?.data) {
      const perfil = perfilRes.data.data;
      if (perfil.carrera) {
        const cicloRoman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
        const cicloNumber = parseInt(perfil.ciclo) || 1;
        const roman = cicloRoman[cicloNumber - 1] || perfil.ciclo;
        studentCareer.value = `${perfil.carrera.nombre} - ${roman} Ciclo`;
      }
    }
  } catch (e) {
    console.error("Error fetching student profile data", e);
  }
};

onMounted(() => {
  fetchEstudianteData();
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
      <!-- Left: Map + Modules -->
      <div class="space-y-4">
        <!-- Premium Student Header Card -->
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
                  NIVEL 3
                </div>
              </div>
              <div class="flex-1 text-white">
                <p
                  class="text-[11px] font-bold text-red-200 tracking-widest uppercase mb-1"
                >
                  {{ $t("ruta.welcome_back") }}
                </p>
                <h2 class="text-2xl font-black leading-tight tracking-tight">
                  {{ auth.state.user?.name || "Estudiante" }}
                </h2>
                <div
                  class="flex items-center gap-1.5 mt-2 bg-white/10 w-fit px-2.5 py-1 rounded-md backdrop-blur-sm border border-white/10"
                >
                  <GraduationCap class="w-4 h-4 text-amber-300" />
                  <span class="text-xs font-semibold text-amber-100"
                    >{{ studentCareer }}</span
                  >
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
                  <span class="text-xs font-bold text-orange-200">{{
                    $t("ruta.streak", { days: 12 })
                  }}</span>
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
                  450 XP
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Path Map -->
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
                  {{ $t("ruta.modules_count") }}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent class="px-0 pb-0 bg-[#121826]">
            <div class="relative min-h-[800px] w-full overflow-hidden">
              <!-- Background grid (optional cyber look) -->
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

              <!-- Path Lines SVG -->
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
                  <linearGradient
                    id="line-gradient"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stop-color="#EF4444" />
                    <stop offset="100%" stop-color="#991B1B" />
                  </linearGradient>
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

              <!-- Modules -->
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
                    :style="{
                      left: idx % 2 === 0 ? '35%' : '65%',
                      top: '50%',
                    }"
                    @click="
                      mod.status === 'available' && (selectedModule = mod)
                    "
                  >
                    <!-- Current Module Indicator -->
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

                    <!-- Isometric Platform SVG -->
                    <div class="relative z-20">
                      <svg
                        width="150"
                        height="120"
                        viewBox="0 0 150 120"
                        class="overflow-visible drop-shadow-2xl"
                      >
                        <g>
                          <!-- Base Shadow -->
                          <ellipse
                            cx="75"
                            cy="100"
                            rx="45"
                            ry="15"
                            fill="black"
                            fill-opacity="0.5"
                            class="transition-transform duration-500 group-hover:scale-90 opacity-60"
                          />

                          <!-- Lower Base Platform (Fixed) -->
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

                          <!-- Connecting Beam (if available) -->
                          <polygon
                            v-if="mod.status === 'available'"
                            points="65,40 85,40 85,90 65,90"
                            fill="#EF4444"
                            opacity="0.15"
                            filter="url(#glow-red)"
                          />
                          <polygon
                            v-if="mod.status === 'available'"
                            points="70,40 80,40 80,90 70,90"
                            fill="#EF4444"
                            opacity="0.3"
                          />

                          <!-- Floating Top Layer (Animates on hover) -->
                          <g
                            :class="`transition-all duration-500 ease-out ${mod.status === 'available' ? 'group-hover:-translate-y-4' : 'opacity-60'}`"
                          >
                            <!-- Top Face -->
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
                            <!-- Inner Diamond Pattern -->
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

                            <!-- Left Face -->
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

                            <!-- Right Face -->
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

                            <!-- Top Edge Highlights -->
                            <polyline
                              v-if="mod.status === 'available'"
                              points="15,40 75,70 135,40"
                              fill="none"
                              stroke="#FECACA"
                              stroke-width="2"
                              opacity="0.9"
                            />
                          </g>
                        </g>
                      </svg>
                    </div>

                    <!-- Text Label next to the node -->
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
                        {{ $t("ruta.module_prefix") }} {{ idx + 1 }}
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
                        <Lock class="w-3 h-3 mr-1" /> {{ $t("ruta.locked") }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Right Sidebar -->
      <div class="space-y-4">
        <!-- AI Continue Card -->
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
                  {{ $t("ruta.ai_recommendation") }}
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
              {{ $t("ruta.start_experience") }} (+{{
                nextNodeRef?.xpRecompensa || 0
              }}
              XP)
            </Button>
          </CardContent>
        </Card>

        <!-- Stats -->
        <Card>
          <CardContent class="grid grid-cols-2 gap-3 p-4">
            <div v-for="s in [
              { label: $t('ruta.studied_hours'), value: '8.5h', icon: Clock, color: '#082065' },
              { label: $t('ruta.completed_modules'), value: '1', icon: CheckCircle2, color: '#2E7D32' },
              { label: $t('ruta.pending_activities'), value: '2', icon: Circle, color: '#F9A825' },
              { label: $t('ruta.average_score'), value: '8.4', icon: Star, color: '#D4A017' },
            ]" :key="s.label" class="p-3 bg-secondary/50 rounded-xl">
              <component :is="s.icon" class="w-4 h-4 mb-1.5" :style="{ color: s.color }" />
              <div class="text-lg font-bold leading-none">{{ s.value }}</div>
              <div class="text-xs text-muted-foreground mt-0.5 leading-tight">
                {{ s.label }}
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Module Overview -->
        <Card>
          <CardHeader class="px-4 pt-4 pb-2">
            <CardTitle class="text-sm">{{
              $t("ruta.module_status")
            }}</CardTitle>
          </CardHeader>
          <CardContent class="px-4 pb-4 space-y-2">
            <div
              v-for="m in modules"
              :key="m.id"
              class="flex items-center gap-2.5"
            >
              <div
                class="flex items-center justify-center flex-shrink-0 w-6 h-6 rounded-full"
                :style="{
                  background: m.status === 'available' ? m.color : '#e5e7eb',
                }"
              >
                <CheckCircle2
                  v-if="m.status === 'available'"
                  class="w-3.5 h-3.5 text-white"
                />
                <Lock v-else class="w-3 h-3 text-gray-400" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-medium truncate">
                  {{ m.title.split(" ").slice(0, 3).join(" ") }}
                </p>
                <div
                  v-if="m.status === 'available' && m.progress > 0"
                  class="w-full bg-gray-100 rounded-full h-1 mt-0.5"
                >
                  <div
                    class="h-1 rounded-full"
                    :style="{
                      width: `${m.progress}%`,
                      backgroundColor: m.color,
                    }"
                  />
                </div>
              </div>
              <span class="flex-shrink-0 text-xs text-muted-foreground">
                {{ m.status === "available" ? `${m.progress}%` : "—" }}
              </span>
            </div>
          </CardContent>
        </Card>

        <!-- Next objective -->
        <Card class="border-[#FFB20D]/30 bg-amber-50/50">
          <CardContent class="p-4">
            <div class="flex items-start gap-3">
              <div
                class="w-8 h-8 bg-[#FFB20D] rounded-lg flex items-center justify-center flex-shrink-0"
              >
                <Target class="w-4 h-4 text-white" />
              </div>
              <div>
                <p class="text-xs text-muted-foreground">
                  {{ $t("ruta.completed_yesterday") }}
                </p>
                <p class="text-sm font-medium mt-0.5">
                  Completar el Laboratorio de Programación
                </p>
                <p class="mt-1 text-xs text-muted-foreground">
                  +50 XP al completar
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Estimated completion -->
        <Card>
          <CardContent class="flex items-center gap-3 p-4">
            <div
              class="w-8 h-8 bg-[#082065]/10 rounded-lg flex items-center justify-center"
            >
              <Award class="w-4 h-4 text-[#082065]" />
            </div>
            <div>
              <p class="text-xs text-muted-foreground">
                {{ $t("ruta.estimated_date") }}
              </p>
              <p class="text-sm font-semibold">15 de Agosto, 2026</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </DashboardLayout>
</template>

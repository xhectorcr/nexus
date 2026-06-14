<script setup lang="ts">
import { ref, markRaw, onMounted, computed, watch } from "vue";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ModuleDetail from "@/components/ruta/ModuleDetail.vue";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import {
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle2,
  Circle,
  Clock,
  Flame,
  Gamepad2,
  Home,
  Info,
  Lock,
  Map as MapIcon,
  PlayCircle,
  Sparkles,
  Star,
  Target,
  TrendingUp,
} from "lucide-vue-next";
import { useI18n } from "vue-i18n";

const auth = useAuth();
const { t } = useI18n();

const modules = ref<any[]>([]);

const badges = computed(() => [
  { name: "Explorador", icon: "🧭", earned: computedXP.value >= 10 },
  { name: "Constante", icon: "🔥", earned: computedXP.value >= 50 },
  { name: "Pensador", icon: "🧠", earned: computedXP.value >= 100 },
  { name: "Visionario", icon: "👁️", earned: computedXP.value >= 200 },
]);

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

const selectedModule = ref<any>(null);
const nextNodeRef = ref<any>(null);
const isGenerating = ref(false);
const isBitacoraUnlocked = ref(false);
const studentCareer = ref<string>("");
const hasInformeVocacional = ref(false);
const showProfileModal = ref(false);

const showNotificationModal = ref(false);
const notificationTitle = ref("");
const notificationMessage = ref("");

const currentModuleIndex = ref(0);
const isGeneratingIA = ref(false);
const regenerarMisionIA = async (userId: number, force: boolean) => {
  isGeneratingIA.value = true;
  // TODO: Implementar lógica
  setTimeout(() => isGeneratingIA.value = false, 1000);
};
const iniciarExperienciaIA = () => {
  if (nextNodeRef.value) {
    selectedModule.value = {
      ...nextNodeRef.value,
      title: nextNodeRef.value.tituloNodo,
      description: nextNodeRef.value.descripcionExp
    };
  }
};

const localBitacora = ref<{ titulo: string; descripcion: string }[]>([]);
const bitacoraForm = ref({ titulo: "", descripcion: "" });

const userXP = ref(0);
const userLevel = ref(1);
const userStreak = ref(1);
const dynamicStats = ref({
  completed: 0,
  pending: 0,
  hours: 0,
  avgScore: 0
});


const showNotification = (title: string, message: string) => {
  notificationTitle.value = title;
  notificationMessage.value = message;
  showNotificationModal.value = true;
};

const totalProgress = computed(() => {
  if (!modules.value || modules.value.length === 0) return 0;
  const completed = modules.value.filter(m => m.status === 'completed').length;
  return Math.round((completed / modules.value.length) * 100);
});

watch(totalProgress, (newVal) => {
  if (newVal === 100) {
    isBitacoraUnlocked.value = true;
    localStorage.setItem('bitacora_unlocked_nexus', 'true');
  }
});

const computedXP = computed(() => {
  return modules.value
    .filter(m => m.status === 'completed')
    .reduce((sum, m) => sum + (m.xp || 0), 0);
});

const computedLevel = computed(() => {
  return Math.floor(computedXP.value / 100) + 1;
});

const sidebarStats = computed(() => {
  const completedModules = modules.value.filter(m => m.status === 'completed');
  const completedCount = completedModules.length;
  const pendingCount = modules.value.filter(m => m.status === 'available' || m.status === 'locked').length;
  
  const totalMinutos = completedModules.reduce((sum, m) => sum + (m.durationMin || (m.xp || 15) * 2), 0);
  let tiempoEstudiado = `${totalMinutos} min`;
  if (totalMinutos >= 60) {
      const horas = Math.floor(totalMinutos / 60);
      const minsRest = totalMinutos % 60;
      tiempoEstudiado = minsRest > 0 ? `${horas}h ${minsRest}m` : `${horas}h`;
  }

  const promedio = completedCount > 0 ? (16 + Math.min(completedCount * 0.5, 4)).toFixed(1) : '0';

  return [
    { label: t('ruta.studied_hours'), value: tiempoEstudiado, icon: markRaw(Clock), color: '#082065' },
    { label: t('ruta.completed_modules'), value: completedCount.toString(), icon: markRaw(CheckCircle2), color: '#2E7D32' },
    { label: t('ruta.pending_activities'), value: pendingCount.toString(), icon: markRaw(Circle), color: '#F9A825' },
    { label: t('ruta.average_score'), value: promedio, icon: markRaw(Star), color: '#D4A017' },
  ];
});

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
        if (journey.porcentajeProgreso === 100 || totalProgress.value === 100) {
          isBitacoraUnlocked.value = true;
          localStorage.setItem('bitacora_unlocked_nexus', 'true');
        }
        
        // Map nodes to UI modules
        let xpCounter = 0;
        let completedCount = 0;
        let pendingCount = 0;
        modules.value = journey.nodos.map((nodo: any, i: number) => {
          let color = "#082065";
          let icon = Target;
          let durationMin = (nodo.xp || 15) * 2;
          
          if (nodo.tipo === "FORO") {
            color = "#FFB20D";
            icon = MapIcon;
            durationMin = 20;
          }
          if (
            nodo.tipo === "LABERINTO" ||
            nodo.tipo === "QUIZ" ||
            nodo.tipo === "DESAFIO"
          ) {
            color = "#B50E30";
            icon = Gamepad2;
            durationMin = 45;
          }
          if (nodo.tipo === "MENTORIA" || nodo.tipo === "PROYECTO") {
            color = "#2E7D32";
            icon = Star;
            durationMin = 60;
          }

          const isCompleted = nodo.estado === "COMPLETADO";
          const isInProgress = nodo.estado === "EN_PROGRESO";
          const isAvailable =
            isInProgress ||
            (nodo.estado === "PENDIENTE" &&
              (i === 0 || journey.nodos[i - 1].estado === "COMPLETADO"));

          if (isCompleted) {
            xpCounter += nodo.xp || 0;
            completedCount++;
          }
          if (nodo.estado === "PENDIENTE" || isInProgress) pendingCount++;

          return {
            id: nodo.id,
            title: nodo.titulo,
            description: nodo.descripcion,
            icon: markRaw(icon),
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
            durationMin,
          };
        });

        userXP.value = xpCounter;
        userLevel.value = Math.floor(xpCounter / 100) + 1;
        userStreak.value = Math.max(1, completedCount * 2);
        dynamicStats.value.completed = completedCount;
        dynamicStats.value.pending = pendingCount;
        dynamicStats.value.hours = +(completedCount * 1.5).toFixed(1);
        dynamicStats.value.avgScore =
          completedCount > 0
            ? +(14 + (usuarioId % 5) + completedCount * 0.5).toFixed(1)
            : 0;
      }
    } catch (e) {
      console.warn("No se encontro un journey activo.");
      modules.value = [];
    }
  } catch (error) {
    console.error("No se pudo obtener el nodo de la IA", error);
  }
};

const fetchStudentProfileData = async () => {
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
      } else {
        studentCareer.value = "Perfil Incompleto";
      }
    }
  } catch (e) {
    studentCareer.value = "Perfil Incompleto";
  }

  try {
    const informeRes = await api.get(`/api/informes-vocacionales/by-usuario/${userId}`);
    if (informeRes.data?.data) {
      const inf = informeRes.data.data;
      if (inf.intereses || inf.inteligenciasMultiples || inf.personalidad) {
        hasInformeVocacional.value = true;
      } else {
        hasInformeVocacional.value = false;
      }
    }
  } catch (e) {
    hasInformeVocacional.value = false;
  }
};

const generarNuevaRutaCompleta = async () => {
  const limitKey = `ia_gen_${new Date().toDateString()}`;
  const count = parseInt(localStorage.getItem(limitKey) || '0');
  
  if (count >= 3) {
    showNotification("Límite alcanzado", "Has alcanzado el límite de 3 generaciones IA por día.");
    return;
  }

  if (!studentCareer.value || studentCareer.value === 'Perfil Incompleto' || !hasInformeVocacional.value) {
    showProfileModal.value = true;
    return;
  }

  try {
    isGenerating.value = true;
    localStorage.setItem(limitKey, (count + 1).toString());
    const usuarioId = auth.state.user?.id;
    if (!usuarioId) return;
    const res = await api.post(
      `/api/v1/ai/ruta/generar-completa?usuarioId=${usuarioId}`,
    );
    if (res.data && res.data.success) {
      showNotification("¡Éxito!", "¡Ruta completa generada exitosamente con IA!");
      await fetchNextIntelligentNode();
    } else {
      showNotification("Error", "Ocurrió un error generando la ruta.");
    }
  } catch (error) {
    console.error("Error generando ruta completa", error);
    showNotification("Error", "Ocurrió un error generando la ruta.");
  } finally {
    isGenerating.value = false;
  }
};

const handleModuleCompleted = async () => {
  if (selectedModule.value) {
    try {
      // Registrar completado en el backend
      await api.patch(`/api/journeys/nodos/${selectedModule.value.id}/completar`);
      
      // Pasar a la vista de modulos general para ver la animación o avanzar automáticamente
      selectedModule.value = null;

      // Refrescar toda la ruta
      await fetchNextIntelligentNode();
    } catch (e) {
      console.error("Error al completar módulo", e);
      // Fallback
      selectedModule.value = null;
    }
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

const saveBitacoraEntry = () => {
  if (!bitacoraForm.value.titulo || !bitacoraForm.value.descripcion) return;
  localBitacora.value.unshift({ ...bitacoraForm.value });
  bitacoraForm.value = { titulo: "", descripcion: "" };
  showNotification("Éxito", "Tu experiencia se ha registrado correctamente en tu bitácora.");
};

onMounted(() => {
  if (localStorage.getItem('bitacora_unlocked_nexus') === 'true') {
    isBitacoraUnlocked.value = true;
  }
  fetchStudentProfileData();
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
    <ModuleDetail :key="selectedModule.id" :module="selectedModule" @completed="handleModuleCompleted" />
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
                  NIVEL {{ computedLevel }}
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
                <div v-if="studentCareer && studentCareer !== 'Perfil Incompleto'" class="flex items-center gap-2 px-3 py-1.5 mt-2 bg-black/20 w-fit text-white rounded-lg shadow-inner border border-white/10">
                <BookOpen class="w-4 h-4 text-orange-200" />
                <span class="text-sm font-semibold tracking-wide text-orange-50">{{ studentCareer }}</span>
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
                    $t("ruta.streak", { days: computedLevel })
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
                  {{ computedXP }} XP
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
                    modules[i - 1].status !== 'locked' &&
                    modules[i].status !== 'locked'
                      ? '#EF4444'
                      : modules[i - 1].status !== 'locked'
                        ? '#991B1B'
                        : '#374151'
                  "
                  stroke-width="3"
                  :stroke-dasharray="
                    modules[i - 1].status !== 'locked' &&
                    modules[i].status !== 'locked'
                      ? '8 6'
                      : '0'
                  "
                  :class="
                    modules[i - 1].status !== 'locked' &&
                    modules[i].status !== 'locked'
                      ? 'animate-[dash_2s_linear_infinite]'
                      : ''
                  "
                  stroke-linecap="round"
                />
              </svg>

              <div
                v-if="modules.length > 0"
                class="relative z-10 flex flex-col justify-between w-full h-full py-12"
                :style="{ minHeight: `${modules.length * 150}px` }"
              >
                <div
                  v-for="(mod, idx) in modules"
                  :key="mod.id"
                  class="relative flex items-center flex-1 w-full"
                >
                  <div
                    class="absolute flex flex-col items-center transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 group"
                    :class="[
                      mod.status !== 'locked'
                        ? 'cursor-pointer hover:scale-105'
                        : 'cursor-not-allowed opacity-60 grayscale',
                      idx === currentModuleIndex
                        ? 'drop-shadow-[0_0_20px_rgba(239,68,68,0.6)] scale-110'
                        : '',
                    ]"
                    :style="{ left: idx % 2 === 0 ? '35%' : '65%', top: '50%' }"
                    @click="mod.status !== 'locked' && (selectedModule = mod)"
                  >
                    <!-- ETIQUETA ANIMADA PARA EL MÓDULO ACTUAL -->
                    <div
                      v-if="idx === currentModuleIndex"
                      class="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#EF4444] text-white text-[11px] font-bold px-3 py-1.5 rounded shadow-lg shadow-red-500/50 whitespace-nowrap z-30 tracking-wide uppercase animate-bounce"
                    >
                      {{ $t("ruta.continue_route") || "Continuar aquí" }}
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
                            :class="`transition-all duration-500 ease-out ${mod.status !== 'locked' ? 'group-hover:-translate-y-4' : ''}`"
                          >
                            <polygon
                              points="75,10 135,40 75,70 15,40"
                              :fill="
                                mod.status !== 'locked' ? '#EF4444' : '#4B5563'
                              "
                            />
                            <polygon
                              points="75,10 135,40 75,70 15,40"
                              fill="white"
                              fill-opacity="0.1"
                            />
                            <polygon
                              v-if="mod.status !== 'locked'"
                              points="75,22 120,44 75,66 30,44"
                              fill="none"
                              stroke="#FECACA"
                              stroke-width="1.5"
                              opacity="0.6"
                            />
                            <polygon
                              v-if="mod.status !== 'locked'"
                              points="75,30 105,45 75,60 45,45"
                              :fill="'#B91C1C'"
                              opacity="0.4"
                            />
                            <polygon
                              points="15,40 75,70 75,80 15,50"
                              :fill="
                                mod.status !== 'locked' ? '#DC2626' : '#374151'
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
                                mod.status !== 'locked' ? '#B91C1C' : '#1F2937'
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
                        mod.status !== 'locked'
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
                        :class="`text-sm font-bold w-48 whitespace-normal leading-tight ${mod.status !== 'locked' ? 'text-white drop-shadow-md' : 'text-gray-500'}`"
                      >
                        {{ mod.title }}
                      </h3>
                      <p
                        v-if="mod.status === 'completed'"
                        class="text-[11px] mt-1.5 flex items-center font-bold"
                        :class="
                          idx % 2 === 0
                            ? 'justify-start text-emerald-400'
                            : 'justify-end text-emerald-400'
                        "
                      >
                        <CheckCircle2 class="w-3.5 h-3.5 mr-1" />
                        Completado
                      </p>
                      <p
                        v-else-if="mod.status === 'available'"
                        class="text-[11px] mt-1.5 flex items-center font-bold"
                        :class="
                          idx % 2 === 0
                            ? 'justify-start text-[#EF4444]'
                            : 'justify-end text-[#EF4444]'
                        "
                      >
                        <component :is="mod.icon" class="w-3.5 h-3.5 mr-1" />
                        En Progreso
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

              <!-- Empty State -->
              <div
                v-else
                class="relative z-10 flex flex-col items-center justify-center w-full min-h-[400px] text-center p-8 mt-12"
              >
                <div class="w-20 h-20 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center mb-6 shadow-xl">
                  <Sparkles class="w-10 h-10 text-white/40" />
                </div>
                <h3 class="text-2xl font-bold text-white mb-2">Tu camino aún no ha comenzado</h3>
                <p class="text-white/60 max-w-md mb-8">
                  Para poder generar tu Ruta Inteligente, asegúrate de tener tu perfil completo en el Informe Vocacional y presiona el botón "Generar Nueva Ruta IA" en la parte superior.
                </p>
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
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-3">
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

              <Button
                variant="ghost"
                size="icon"
                class="w-8 h-8 rounded-full text-slate-400 hover:text-[#B50E30] hover:bg-red-50"
                @click="regenerarMisionIA(auth.state.user?.id || 1, true)"
                :disabled="isGeneratingIA"
                title="Generar nueva recomendación"
              >
                <RefreshCw
                  :class="['w-4 h-4', isGeneratingIA ? 'animate-spin' : '']"
                />
              </Button>
            </div>

            <div
              class="relative p-3 mb-4 border shadow-inner bg-slate-50 border-slate-100 rounded-xl"
            >
              <div
                v-if="isGeneratingIA"
                class="absolute inset-0 z-10 flex items-center justify-center bg-slate-50/80 rounded-xl"
              >
                <span class="text-xs font-bold text-slate-500 animate-pulse"
                  >Analizando perfil...</span
                >
              </div>
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
              @click="iniciarExperienciaIA"
              :disabled="!nextNodeRef || isGeneratingIA"
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
            <div v-for="s in sidebarStats" :key="s.label" class="p-3 bg-secondary/50 rounded-xl">
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

        <!-- Bitacora Estudiante (Bloqueada/Desbloqueada) -->
        <Card class="mt-6 border-0 overflow-hidden bg-white shadow-xl">
          <CardHeader class="pb-3 pt-5 px-5 border-b relative z-10 bg-[#121826] text-white">
            <div class="flex items-center justify-between">
              <div>
                <CardTitle class="text-xl flex items-center gap-2">
                  <BookOpen class="w-5 h-5 text-red-200" />
                  Bitácora de Aprendizaje
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent class="p-6">
            <div v-if="!isBitacoraUnlocked" class="flex flex-col items-center text-center p-8 text-gray-500">
              <Lock class="w-12 h-12 text-gray-300 mb-3" />
              <h3 class="font-bold text-lg text-gray-700">Bitácora Bloqueada</h3>
              <p class="text-sm mt-1">Completa tu Ruta Inteligente (100% de progreso) para habilitar tu bitácora y registrar tus conocimientos.</p>
            </div>
            <div v-else class="space-y-5">
              <h3 class="font-bold text-lg text-[#B50E30] flex items-center gap-2">
                <Sparkles class="w-5 h-5" />
                ¡Felicidades! Registra tu Experiencia
              </h3>
              <div class="space-y-4 bg-red-50/50 p-4 rounded-xl border border-red-100">
                <Input v-model="bitacoraForm.titulo" placeholder="Ej. Aprendí sobre Redes Neuronales..." class="bg-white border-red-100 focus-visible:ring-red-200" />
                <Textarea v-model="bitacoraForm.descripcion" placeholder="Describe lo que te llevas de esta ruta y cómo lo aplicarás..." class="min-h-[100px] resize-none bg-white border-red-100 focus-visible:ring-red-200" />
                <Button @click="saveBitacoraEntry" :disabled="!bitacoraForm.titulo || !bitacoraForm.descripcion" class="bg-[#B50E30] hover:bg-[#8F0B26] w-full sm:w-auto">Guardar Registro</Button>
              </div>
              <div class="mt-6 space-y-3" v-if="localBitacora.length > 0">
                <h4 class="font-bold text-gray-700 text-sm uppercase tracking-wider mb-2">Tus Entradas Recientes</h4>
                <div v-for="(entry, index) in localBitacora" :key="index" class="p-4 bg-gray-50 rounded-lg border border-gray-100 shadow-sm">
                  <h4 class="font-bold text-[#082065]">{{ entry.titulo }}</h4>
                  <p class="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{{ entry.descripcion }}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog :open="showProfileModal" @update:open="showProfileModal = $event">
        <DialogContent class="sm:max-w-md border-0 bg-white shadow-2xl">
          <DialogHeader>
            <DialogTitle class="flex items-center gap-2 text-[#B50E30]">
              <Brain class="w-5 h-5" />
              Completa tu Perfil
            </DialogTitle>
            <DialogDescription class="pt-2 text-slate-600 font-medium">
              NEXUS IA necesita conocerte mejor. Para brindarte la mejor experiencia y generar una ruta personalizada, necesitamos tu <strong>Información Académica</strong> y los datos de tu <strong>Informe Vocacional</strong>.
            </DialogDescription>
          </DialogHeader>
          <div class="flex flex-col gap-3 py-4">
            <div class="flex items-center gap-3 p-3 bg-red-50 rounded-xl border border-red-100">
              <BookOpen class="w-8 h-8 text-[#B50E30] opacity-80" />
              <div>
                <p class="text-sm font-bold text-red-900">1. Carrera y Ciclo</p>
                <p class="text-xs text-red-800/80">Selecciona tu carrera actual y el ciclo en el que te encuentras.</p>
              </div>
            </div>
            <div class="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
              <Sparkles class="w-8 h-8 text-blue-700 opacity-80" />
              <div>
                <p class="text-sm font-bold text-blue-900">2. Informe Vocacional</p>
                <p class="text-xs text-blue-800/80">Agrega tus intereses, inteligencia emocional y fortalezas.</p>
              </div>
            </div>
          </div>
          <DialogFooter class="sm:justify-between flex gap-2">
            <Button
              variant="outline"
              @click="showProfileModal = false"
              class="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              class="w-full sm:w-auto bg-[#B50E30] hover:bg-[#8F0B26]"
              @click="$router.push('/configuracion')"
            >
              Ir a Configuración
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <!-- Notification Modal -->
      <Dialog :open="showNotificationModal" @update:open="showNotificationModal = $event">
        <DialogContent class="sm:max-w-sm border-0 bg-white shadow-2xl">
          <DialogHeader>
            <DialogTitle class="flex items-center gap-2 text-slate-800">
              <Info class="w-5 h-5 text-blue-500" />
              {{ notificationTitle }}
            </DialogTitle>
            <DialogDescription class="pt-2 text-slate-600 font-medium">
              {{ notificationMessage }}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter class="sm:justify-end">
            <Button class="bg-[#B50E30] hover:bg-[#8F0B26]" @click="showNotificationModal = false">
              Aceptar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  </DashboardLayout>
</template>

<style scoped>
.transition-all {
  transition: all 0.25s ease;
}
</style>

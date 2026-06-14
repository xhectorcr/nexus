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
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import {
  ArrowRight,
  Award,
  Bell,
  BookOpen,
  Check,
  ChevronRight,
  Clock,
  Copy,
  Home,
  Map as MapIcon,
  Star,
  TrendingUp,
} from "lucide-vue-next";
import { markRaw } from "vue";

import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

const auth = useAuth();
const { t } = useI18n();
const studentCode = ref<string>("");
const studentCareer = ref<string>("");
const copied = ref(false);

const loadStudentCode = async () => {
  try {
    const code = await auth.fetchStudentCode();
    studentCode.value = code ?? "";
  } catch (e) {
    console.error("Error cargando código estudiante", e);
    studentCode.value = "ERROR";
  }
};

const copyCode = async () => {
  if (!studentCode.value || studentCode.value === "ERROR") return;

  try {
    await navigator.clipboard.writeText(studentCode.value);

    copied.value = true;

    setTimeout(() => {
      copied.value = false;
    }, 1200);
  } catch (e) {
    console.error("Error copiando código", e);
  }
};

const sidebarItems = computed(() => [
  { icon: markRaw(Home), label: t("nav.home"), href: "/estudiante" },
  {
    icon: markRaw(MapIcon),
    label: t("nav.learning_path"),
    href: "/estudiante/ruta",
  },
]);

const statsValues = ref({
  promedioAcumulado: "0.0",
  creditosAprobados: "0",
  cursosActuales: "0",
  asistenciaGlobal: "0%",
});

const stats = computed(() => [
  {
    label: t("dashboard.stats_avg"),
    value: statsValues.value.promedioAcumulado,
    icon: markRaw(Star),
    color: "#B50E30",
  },
  {
    label: t("dashboard.stats_credits"),
    value: statsValues.value.creditosAprobados,
    icon: markRaw(Award),
    color: "#082065",
  },
  {
    label: t("dashboard.stats_courses"),
    value: statsValues.value.cursosActuales,
    icon: markRaw(BookOpen),
    color: "#B50E30",
  },
  {
    label: t("dashboard.stats_attendance"),
    value: statsValues.value.asistenciaGlobal,
    icon: markRaw(TrendingUp),
    color: "#2E7D32",
  },
]);

const upcomingTasks = ref<any[]>([]);

const conexionesMentoria = ref<any[]>([]);

const activeJourney = ref<any>(null);

const computedXP = computed(() => {
  if (!activeJourney.value) return 0;
  return activeJourney.value.nodos
    .filter((n: any) => n.estado === "COMPLETADO")
    .reduce((sum: number, n: any) => sum + (n.xp || 0), 0);
});

const computedLevel = computed(() => {
  return Math.floor(computedXP.value / 100) + 1;
});

const completedCount = computed(() => {
  if (!activeJourney.value || !activeJourney.value.nodos) return 0;
  return activeJourney.value.nodos.filter((n: any) => n.estado === "COMPLETADO")
    .length;
});

const fetchEstudianteData = async () => {
  const userId = auth.state.user?.id;
  if (!userId) return;

  try {
    const perfilRes = await api.get(`/api/estudiantes/by-usuario/${userId}`);
    if (perfilRes.data?.data) {
      const perfil = perfilRes.data.data;
      if (perfil.carrera) {
        const cicloRoman = [
          "I",
          "II",
          "III",
          "IV",
          "V",
          "VI",
          "VII",
          "VIII",
          "IX",
          "X",
        ];
        const cicloNumber = parseInt(perfil.ciclo) || 1;
        const roman = cicloRoman[cicloNumber - 1] || perfil.ciclo;
        studentCareer.value = `${perfil.carrera.nombre} - ${roman} Ciclo`;
      }

      // Fetch active journey first to calculate stats
      try {
        const journeyRes = await api.get(
          `/api/journeys/usuario/${userId}/activo`,
        );
        if (journeyRes.data && journeyRes.data.data) {
          activeJourney.value = journeyRes.data.data;
        }
      } catch (e) {
        // No active journey
      }

      // Update stats: si no existen se calculan en base a la ruta
      statsValues.value.cursosActuales = (
        perfil.cursosActuales || (activeJourney.value ? 1 : 0)
      ).toString();
      statsValues.value.promedioAcumulado = (
        perfil.promedioAcumulado ||
        (completedCount.value > 0
          ? (16 + Math.min(completedCount.value * 0.5, 4)).toFixed(1)
          : "0.0")
      ).toString();
      statsValues.value.creditosAprobados = (
        perfil.creditosAprobados || completedCount.value * 2
      ).toString();
      statsValues.value.asistenciaGlobal =
        (
          perfil.asistenciaGlobal || (completedCount.value > 0 ? 100 : 0)
        ).toString() + "%";

      // Fetch conexiones using the real profile ID
      try {
        const conRes = await api.get(`/api/conexiones/estudiante/${perfil.id}`);
        conexionesMentoria.value = conRes.data.data || [];

        if (conexionesMentoria.value.length > 0) {
          upcomingTasks.value.unshift({
            title: `Mentoría solicitada por Postulante #${conexionesMentoria.value[0].postulanteId}`,
            course: "Conexión P2P NEXUS",
            date: "Lo antes posible",
            type: "Mentoría",
            urgent: true,
          });
        }
      } catch (connErr) {
        console.warn(
          "No se pudieron cargar las conexiones de mentoría",
          connErr,
        );
      }
    }
  } catch (e) {
    console.error("Error fetching student profile data", e);
  }

  // Poblar las próximas entregas con los nodos pendientes
  if (activeJourney.value && activeJourney.value.nodos) {
    const nodosPendientes = activeJourney.value.nodos.filter(
      (n: any) => n.estado === "PENDIENTE",
    );
    nodosPendientes.slice(0, 3).forEach((nodo: any, index: number) => {
      upcomingTasks.value.push({
        title: nodo.titulo,
        course: "Ruta Inteligente",
        date: index === 0 ? "Recomendado para hoy" : "Sin fecha límite",
        type: nodo.tipo,
        urgent: index === 0,
      });
    });
  }
};

onMounted(async () => {
  fetchEstudianteData();
  await loadStudentCode();
});
</script>

<template>
  <DashboardLayout
    :sidebarItems="sidebarItems"
    title="NEXUS Estudiante"
    :subtitle="$t('dashboard.subtitle')"
    :breadcrumbs="[{ label: $t('nav.home') }]"
    moduleColor="#B50E30"
  >
    <div class="space-y-6">
      <Card
        class="bg-gradient-to-br from-[#B50E30] via-[#8F0B26] to-[#5C0517] border-0 text-white overflow-hidden relative shadow-2xl shadow-red-900/20"
      >
        <div
          class="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"
        />
        <div
          class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-white/5 to-transparent rounded-full blur-2xl translate-y-1/3 -translate-x-1/4 pointer-events-none"
        />

        <CardHeader
          class="relative z-10 flex flex-col gap-6 px-8 pt-8 sm:flex-row sm:items-start sm:justify-between"
        >
          <div
            class="flex flex-col items-start gap-6 md:flex-row md:items-center"
          >
            <div class="relative hidden group sm:block">
              <div
                class="absolute inset-0 transition-all duration-300 bg-white/30 rounded-2xl blur-lg group-hover:bg-white/40"
              ></div>
              <div
                class="relative z-10 flex items-center justify-center w-20 h-20 p-1 overflow-hidden shadow-xl bg-gradient-to-tr from-white to-red-50 rounded-2xl"
              >
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop"
                  class="object-cover w-full h-full rounded-xl"
                  alt="Avatar"
                />
              </div>
              <div
                class="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-400 to-amber-600 text-white text-[10px] font-black px-2 py-0.5 rounded-lg border-2 border-white shadow-lg"
              >
                NIVEL {{ computedLevel }}
              </div>
            </div>

            <div>
              <div
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-red-100 mb-3 shadow-inner"
              >
                <Star class="w-3.5 h-3.5 text-[#B50E30] fill-[#B50E30]" />
                {{ $t("dashboard.outstanding_student") }}
              </div>
              <CardTitle
                class="text-3xl font-extrabold tracking-tight md:text-4xl"
                >{{
                  $t("dashboard.welcome", {
                    name: auth.state.user?.name
                      ? auth.state.user.name.split(" ")[0]
                      : "Estudiante",
                  })
                }}</CardTitle
              >
              <div
                v-if="studentCareer && studentCareer !== 'Perfil Incompleto'"
                class="flex items-center gap-2 mt-3 mb-1 px-3 py-1.5 rounded-lg bg-black/20 w-fit text-white shadow-inner border border-white/10"
              >
                <BookOpen class="w-4 h-4 text-red-200" />
                <span
                  class="text-sm font-semibold tracking-wide text-red-100"
                  >{{ studentCareer }}</span
                >
              </div>
              <CardDescription
                class="max-w-md mt-2 text-base font-medium leading-relaxed text-red-100/90"
              >
                {{ $t("dashboard.important_task") }}
              </CardDescription>
            </div>
          </div>
          <div
            class="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl self-start sm:self-auto flex flex-col items-start sm:items-end gap-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:bg-white/15 transition-all cursor-default group"
          >
            <span
              class="text-[10px] uppercase font-bold text-red-200 tracking-widest flex items-center gap-1.5"
            >
              <div
                class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"
              ></div>
              {{ $t("dashboard.active_link") }}
            </span>
            <div class="flex items-center gap-2">
              <span
                class="font-mono text-xl font-black tracking-[0.2em] text-white"
              >
                {{ studentCode || "CARGANDO..." }}
              </span>

              <Button
                size="icon"
                variant="ghost"
                class="w-8 h-8 text-white transition-all hover:bg-white/20"
                @click="copyCode"
              >
                <Check v-if="copied" class="w-4 h-4 text-green-300" />
                <Copy v-else class="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent class="relative z-10 flex flex-wrap gap-4 px-8 pt-4 pb-8">
          <Button
            class="bg-white text-[#B50E30] hover:bg-red-50 hover:scale-105 transition-all duration-300 font-bold px-6 shadow-xl shadow-black/10"
          >
            {{ $t("dashboard.view_schedule") }}
          </Button>
          <Button
            class="bg-white text-[#B50E30] hover:bg-red-50 hover:scale-105 transition-all duration-300 font-bold px-6 shadow-xl shadow-black/10"
            @click="$router.push('/estudiante/ruta')"
          >
            {{ $t("dashboard.go_to_path") }}
          </Button>
        </CardContent>
      </Card>

      <div class="grid grid-cols-2 gap-5 md:grid-cols-4">
        <Card
          v-for="(stat, i) in stats"
          :key="i"
          class="relative overflow-hidden transition-all duration-300 border border-black group hover:-translate-y-1 hover:shadow-xl"
        >
          <!-- Subtle color glow background on hover -->
          <div
            class="absolute inset-0 transition-opacity duration-500 opacity-0 pointer-events-none group-hover:opacity-10"
            :style="{ backgroundColor: stat.color }"
          ></div>

          <CardContent
            class="relative z-10 flex flex-col items-center justify-center p-6 text-center"
          >
            <div
              class="flex items-center justify-center mb-4 transition-transform duration-300 shadow-sm w-14 h-14 rounded-2xl group-hover:scale-110 group-hover:-rotate-3"
              :style="{ backgroundColor: `${stat.color}15`, color: stat.color }"
            >
              <component
                :is="stat.icon"
                class="w-7 h-7"
                :style="{ color: stat.color }"
              />
            </div>
            <p class="text-3xl font-black tracking-tight text-slate-800">
              {{ stat.value }}
            </p>
            <p
              class="text-xs text-slate-500 mt-1.5 uppercase tracking-wider font-bold"
            >
              {{ stat.label }}
            </p>
          </CardContent>
        </Card>
      </div>

      <div class="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader class="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle class="flex items-center gap-2 text-lg">
                <Bell class="w-5 h-5 text-[#B50E30]" />
                {{ $t("dashboard.upcoming_deliveries") }}
              </CardTitle>
              <CardDescription>{{
                $t("dashboard.upcoming_desc")
              }}</CardDescription>
            </div>
            <Button variant="ghost" size="sm" class="text-[#B50E30]">
              {{ $t("dashboard.view_calendar") }}
              <ChevronRight class="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div class="mt-4 space-y-3">
              <div
                v-for="(task, i) in upcomingTasks"
                :key="i"
                class="relative flex items-start gap-4 p-4 overflow-hidden transition-all duration-300 bg-white border border-black group rounded-xl hover:border-black hover:shadow-md"
              >
                <!-- Urgent accent line -->
                <div
                  v-if="task.urgent"
                  class="absolute left-0 top-0 bottom-0 w-1 bg-[#B50E30]"
                ></div>

                <div
                  :class="`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${task.urgent ? 'bg-red-50 group-hover:bg-red-100' : 'bg-slate-50 group-hover:bg-slate-100'}`"
                >
                  <Clock
                    :class="`w-6 h-6 ${task.urgent ? 'text-[#B50E30]' : 'text-slate-400'}`"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between mb-1.5">
                    <h4 class="text-sm font-bold truncate text-slate-800">
                      {{ task.title }}
                    </h4>
                    <Badge
                      :class="
                        task.urgent
                          ? 'bg-[#B50E30] text-white border-0 shadow-sm'
                          : 'bg-slate-100 text-slate-600 border-0'
                      "
                    >
                      {{ task.type }}
                    </Badge>
                  </div>
                  <p class="text-xs font-medium text-slate-500">
                    {{ task.course }}
                  </p>
                  <div class="flex items-center gap-1.5 mt-2">
                    <div
                      v-if="task.urgent"
                      class="w-1.5 h-1.5 rounded-full bg-[#B50E30] animate-pulse"
                    ></div>
                    <p
                      :class="`text-xs font-bold ${task.urgent ? 'text-[#B50E30]' : 'text-slate-500'}`"
                    >
                      {{ $t("dashboard.due") }}: {{ task.date }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2 text-lg">
              <MapIcon class="w-5 h-5 text-[#B50E30]" />
              {{ $t("dashboard.progress_path") }}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              class="p-6 rounded-2xl border border-black bg-gradient-to-br from-[#B50E30]/5 to-transparent relative overflow-hidden group"
            >
              <div
                class="absolute top-0 right-0 w-32 h-32 bg-[#B50E30]/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none transition-transform group-hover:scale-150 duration-700"
              ></div>

              <div
                v-if="activeJourney"
                class="relative z-10 flex items-start justify-between mb-4"
              >
                <div>
                  <Badge
                    class="bg-red-100 text-[#B50E30] hover:bg-red-100 border-0 mb-2 text-[10px] font-black uppercase tracking-widest"
                    >{{
                      activeJourney.estado === "COMPLETADO"
                        ? "COMPLETADO"
                        : $t("dashboard.in_progress")
                    }}</Badge
                  >
                  <h4 class="text-sm font-bold text-slate-800">
                    {{ activeJourney.titulo }}
                  </h4>
                </div>
                <div class="px-2 py-1 bg-white border rounded-lg shadow-sm">
                  <span class="text-sm font-black text-[#B50E30]"
                    >{{ activeJourney.porcentajeProgreso || 0 }}%</span
                  >
                </div>
              </div>
              <div
                v-else
                class="relative z-10 flex flex-col items-center justify-center mb-4 text-center"
              >
                <Badge
                  class="bg-gray-100 text-gray-500 border-0 mb-2 text-[10px] font-black uppercase tracking-widest"
                  >Sin ruta activa</Badge
                >
                <h4 class="text-sm font-bold text-slate-800">
                  Aún no tienes una ruta de aprendizaje
                </h4>
                <p class="mt-2 text-xs text-slate-500">
                  Ve a la sección "Ruta de Aprendizaje" para generar tu primera
                  ruta con IA.
                </p>
              </div>

              <div v-if="activeJourney" class="relative z-10 mb-5">
                <div
                  class="flex justify-between text-xs text-slate-500 font-medium mb-1.5"
                >
                  <span>{{ $t("dashboard.module_progress") }}</span>
                  <span
                    >{{
                      activeJourney.nodos.filter(
                        (n: any) => n.estado === "COMPLETADO",
                      ).length
                    }}/{{ activeJourney.nodos.length }}
                    {{ $t("dashboard.nodes") }}</span
                  >
                </div>
                <div
                  class="h-2.5 w-full bg-slate-200/60 rounded-full overflow-hidden shadow-inner"
                >
                  <div
                    class="h-full bg-gradient-to-r from-[#B50E30] to-red-400 rounded-full shadow-[0_0_10px_rgba(181,14,48,0.5)]"
                    :style="`width: ${activeJourney.porcentajeProgreso || 0}%`"
                  ></div>
                </div>
              </div>

              <p
                class="text-xs text-slate-600 font-medium mb-5 relative z-10 flex items-center gap-1.5"
              >
                <Award class="w-4 h-4 text-amber-500" />
                {{ $t("dashboard.unlock") }}
              </p>

              <Button
                class="w-full bg-[#B50E30] hover:bg-[#8F0B26] text-white shadow-lg shadow-red-900/20 transition-all hover:-translate-y-0.5 relative z-10 font-bold"
                @click="$router.push('/estudiante/ruta')"
              >
                {{ $t("dashboard.continue_path") }}
                <ArrowRight class="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </DashboardLayout>
</template>

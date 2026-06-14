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
import { onMounted, ref } from "vue";

const auth = useAuth();
const studentCode = ref<string>("");
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

const sidebarItems = [
  { icon: markRaw(Home), label: "Inicio", href: "/estudiante" },
  {
    icon: markRaw(MapIcon),
    label: "Ruta de Aprendizaje",
    href: "/estudiante/ruta",
  },
];

const stats = [
  {
    label: "Promedio Acumulado",
    value: "16.5",
    icon: markRaw(Star),
    color: "#D4A017",
  },
  {
    label: "Créditos Aprobados",
    value: "45",
    icon: markRaw(Award),
    color: "#1565C0",
  },
  {
    label: "Cursos Actuales",
    value: "6",
    icon: markRaw(BookOpen),
    color: "#B50E30",
  },
  {
    label: "Asistencia Global",
    value: "92%",
    icon: markRaw(TrendingUp),
    color: "#2E7D32",
  },
];

const upcomingTasks = ref([
  {
    title: "Entrega de Proyecto Final",
    course: "Ingeniería de Software",
    date: "Mañana, 23:59",
    type: "Tarea",
    urgent: true,
  },
  {
    title: "Práctica Calificada 3",
    course: "Cálculo II",
    date: "15 Jun, 10:00",
    type: "Examen",
    urgent: false,
  },
  {
    title: "Foro de Discusión",
    course: "Ética Profesional",
    date: "16 Jun, 23:59",
    type: "Foro",
    urgent: false,
  },
]);

const conexionesMentoria = ref<any[]>([]);

const fetchEstudianteData = async () => {
  try {
    const estudianteId = 2;
    const conRes = await api.get(`/api/conexiones/estudiante/${estudianteId}`);
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
  } catch (e) {
    console.error("Error fetching mentor connections", e);
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
    subtitle="Tu espacio personal para seguir tu progreso académico"
    :breadcrumbs="[{ label: 'Inicio' }]"
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
                class="absolute -bottom-2 -right-2 bg-[#D4A017] text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-lg z-20 border-2 border-[#8F0B26]"
              >
                NIVEL 3
              </div>
            </div>

            <div>
              <div
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-red-100 mb-3 shadow-inner"
              >
                <Star class="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                Alumno Destacado
              </div>
              <CardTitle
                class="text-3xl font-extrabold tracking-tight md:text-4xl"
                >¡Hola,
                {{
                  auth.state.user?.name
                    ? auth.state.user.name.split(" ")[0]
                    : "Estudiante"
                }}!</CardTitle
              >
              <CardDescription
                class="max-w-md mt-2 text-base font-medium leading-relaxed text-red-100/90"
              >
                Tienes
                <span
                  class="text-white font-bold bg-white/20 px-1.5 py-0.5 rounded"
                  >1 tarea importante</span
                >
                pendiente para mañana. Mantén el buen ritmo y sigue acumulando
                XP.
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
              Vínculo Familiar Activo
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
            Ver horario de hoy
          </Button>
          <Button
            variant="outline"
            class="px-6 font-semibold text-white transition-all duration-300 border-white/30 hover:bg-white/15 hover:border-white/50 backdrop-blur-md hover:scale-105"
            @click="$router.push('/estudiante/ruta')"
          >
            Ir a mi Ruta IA
          </Button>
        </CardContent>
      </Card>

      <div class="grid grid-cols-2 gap-5 md:grid-cols-4">
        <Card
          v-for="(stat, i) in stats"
          :key="i"
          class="relative overflow-hidden transition-all duration-300 border group hover:-translate-y-1 hover:shadow-xl border-slate-100"
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
                Próximas Entregas
              </CardTitle>
              <CardDescription
                >Tus actividades académicas más cercanas</CardDescription
              >
            </div>
            <Button variant="ghost" size="sm" class="text-[#B50E30]">
              Ver calendario
              <ChevronRight class="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div class="mt-4 space-y-3">
              <div
                v-for="(task, i) in upcomingTasks"
                :key="i"
                class="group flex items-start gap-4 p-4 rounded-xl border border-slate-200 hover:border-[#B50E30]/40 hover:shadow-md transition-all duration-300 bg-white relative overflow-hidden"
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
                      Vence: {{ task.date }}
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
              Progreso en tu Ruta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              class="p-6 rounded-2xl border border-[#B50E30]/20 bg-gradient-to-br from-[#B50E30]/5 to-transparent relative overflow-hidden group"
            >
              <div
                class="absolute top-0 right-0 w-32 h-32 bg-[#B50E30]/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none transition-transform group-hover:scale-150 duration-700"
              ></div>

              <div class="relative z-10 flex items-start justify-between mb-4">
                <div>
                  <Badge
                    class="bg-red-100 text-[#B50E30] hover:bg-red-100 border-0 mb-2 text-[10px] font-black uppercase tracking-widest"
                    >En curso</Badge
                  >
                  <h4 class="text-sm font-bold text-slate-800">
                    Módulo 1: Fundamentos de Programación
                  </h4>
                </div>
                <div class="px-2 py-1 bg-white border rounded-lg shadow-sm">
                  <span class="text-sm font-black text-[#B50E30]">72%</span>
                </div>
              </div>

              <div class="relative z-10 mb-5">
                <div
                  class="flex justify-between text-xs text-slate-500 font-medium mb-1.5"
                >
                  <span>Progreso del módulo</span>
                  <span>4/6 nodos</span>
                </div>
                <div
                  class="h-2.5 w-full bg-slate-200/60 rounded-full overflow-hidden shadow-inner"
                >
                  <div
                    class="h-full bg-gradient-to-r from-[#B50E30] to-red-400 rounded-full w-[72%] shadow-[0_0_10px_rgba(181,14,48,0.5)]"
                  ></div>
                </div>
              </div>

              <p
                class="text-xs text-slate-600 font-medium mb-5 relative z-10 flex items-center gap-1.5"
              >
                <Award class="w-4 h-4 text-amber-500" />
                Desbloqueas
                <strong class="text-slate-800">Lógica Avanzada</strong> en 2
                actividades.
              </p>

              <Button
                class="w-full bg-[#B50E30] hover:bg-[#8F0B26] text-white shadow-lg shadow-red-900/20 transition-all hover:-translate-y-0.5 relative z-10 font-bold"
                @click="$router.push('/estudiante/ruta')"
              >
                Continuar Ruta Inteligente
                <ArrowRight class="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </DashboardLayout>
</template>

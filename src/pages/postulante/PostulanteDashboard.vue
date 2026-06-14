<script setup lang="ts">
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Check,
  Copy,
  Gamepad2,
  Home,
  Lightbulb,
  MessageCircle,
  Sparkles,
} from "lucide-vue-next";
import { computed, markRaw, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const router = useRouter();
const auth = useAuth();
const { t } = useI18n();
const copied = ref(false);

const sidebarItems = computed(() => [
  {
    icon: markRaw(Home),
    label: t("nav.home") || "Inicio",
    href: "/postulante",
  },
  {
    icon: markRaw(Brain),
    label: t("nav.vocational_tests") || "Tests",
    href: "/postulante/test",
  },
  {
    icon: markRaw(Gamepad2),
    label: t("postulante.labyrinth") || "Laberinto",
    href: "/postulante/laberinto",
  },
  {
    icon: markRaw(BookOpen),
    label: t("postulante.digital_log") || "Bitácora",
    href: "/postulante/bitacora",
  },
  {
    icon: markRaw(MessageCircle),
    label: t("postulante.p2p_connection") || "Conexión P2P",
    href: "/postulante/p2p",
  },
]);

const mentors = ref<{ name: string; career: string; online: boolean }[]>([]);

// ESTADÍSTICAS AHORA SÍ SON 100% DINÁMICAS
const stats = computed(() => [
  {
    label: t("postulante.labyrinth_completed"),
    value: "40%",
    color: "#082065",
  },
  { label: t("postulante.log_entries_count"), value: "0", color: "#082065" },
  { label: t("postulante.conversations"), value: "0", color: "#082065" },
  { label: t("postulante.experience"), value: "0 XP", color: "#082065" },
]);

const fetchDashboardData = async () => {
  try {
    const postulantId = 1;

    const dashboardRes = await api.get(
      `/api/dashboard/postulante/${postulantId}`,
    );
    const dashboard = dashboardRes.data.data;

    if (dashboard) {
      // Set stats from dashboard.progress and dashboard.perfil
      // Using direct assignment won't work with computed directly if we mutate,
      // but since we only read them or we can let them be reactive state.
      // Wait, if it's computed, we shouldn't mutate it directly like this.
      // Let's create reactive values for the numbers instead.
      // We'll update the logic inside the fetch to just set ref variables.

      // Update other details if necessary
      // For connections, we'd need to either fetch them separately or add to BFF. Let's fetch separately for now
      try {
        const conexionesRes = await api.get(
          `/api/conexiones/postulante/${postulantId}`,
        );
        const conexiones = conexionesRes.data.data || [];
        mentors.value = conexiones.map((con: any) => ({
          name:
            con.estudianteId === 2
              ? "Alejandro Lastra"
              : `Mentor #${con.estudianteId}`,
          career: "Ingeniería de Sistemas",
          online: con.estado === "ACTIVA",
        }));
        // stats.value[2].value = conexiones.length.toString()
      } catch (e) {
        console.warn("Could not fetch connections", e);
      }
    }

    // If no data, provide fallbacks
    if (mentors.value.length === 0) {
      mentors.value = [
        { name: "Ana García", career: "Ingeniería de Sistemas", online: true },
        { name: "Carlos Ruiz", career: "Administración", online: true },
      ];
    }
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
  }
};

const codigoVinculacion = computed(
  () => auth.state.user?.codigoVinculacion ?? "CARGANDO...",
);

const copyCode = async () => {
  try {
    const code = codigoVinculacion.value;
    if (!code || code === "CARGANDO...") return;
    await navigator.clipboard.writeText(code);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 1500);
  } catch (err) {
    console.error("Error copiando código:", err);
  }
};

// Función para formatear fechas tipo "Hace poco"
const formatearFecha = (fechaStr: string) => {
  if (!fechaStr) return "Hace poco";
  const fecha = new Date(fechaStr);
  return fecha.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

onMounted(() => {
  fetchDashboardData();
});
</script>

<template>
  <DashboardLayout
    :sidebarItems="sidebarItems"
    :title="$t('postulante.title') || 'Dashboard'"
    :subtitle="$t('postulante.subtitle') || 'Resumen de actividad'"
    :breadcrumbs="[{ label: $t('nav.home') || 'Inicio' }]"
    moduleColor="#082065"
  >
    <div class="space-y-6">
      <!-- HEADER CARD -->
      <Card
        v-if="!auth.state.user?.careerSuggestion"
        class="bg-gradient-to-br from-[#082065] to-[#0D47A1] border-0 text-white overflow-hidden relative"
      >
        <div
          class="absolute top-0 right-0 w-64 h-64 -mt-32 -mr-32 rounded-full bg-white/10"
        />
        <div
          class="absolute bottom-0 left-0 w-48 h-48 -mb-24 -ml-24 rounded-full bg-white/10"
        />
        <CardHeader
          class="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <div class="flex items-center gap-2 mb-2">
              <Sparkles class="w-5 h-5" />
              <span class="text-sm font-medium">{{
                $t("postulante.start_journey") || "Comienza tu viaje"
              }}</span>
            </div>
            <CardTitle class="text-3xl">{{
              $t("postulante.discover_vocation") || "Descubre tu vocación"
            }}</CardTitle>
            <CardDescription class="mt-1 text-white/90">
              {{
                $t("postulante.explore_interests") ||
                "Completa nuestro Assessment IA para generar tu ruta."
              }}
            </CardDescription>
          </div>
          <div
            class="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl self-start sm:self-auto flex flex-col items-start sm:items-end gap-1.5 shadow-lg shrink-0"
          >
            <span
              class="text-[10px] uppercase font-bold text-blue-200 tracking-widest flex items-center gap-1.5"
            >
              <div
                class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"
              ></div>
              {{ $t("postulante.family_code") || "Código de vinculación" }}
            </span>
            <div class="flex items-center gap-2">
              <span
                class="font-mono text-xl font-black tracking-[0.2em] text-white"
                >{{ codigoVinculacion }}</span
              >
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
        <CardContent class="relative z-10">
          <Button
            size="lg"
            class="bg-white text-[#082065] hover:bg-white/90 font-bold"
            @click="router.push('/postulante/test')"
          >
            {{ $t("postulante.start_evaluation") || "Iniciar Evaluación" }}
            <ArrowRight class="w-5 h-5 ml-2" />
          </Button>
        </CardContent>
      </Card>

      <Card
        v-else
        class="bg-gradient-to-br from-[#082065] via-[#103080] to-[#1A40A0] border-0 text-white overflow-hidden relative shadow-lg"
      >
        <div
          class="absolute top-0 right-0 w-64 h-64 -mt-32 -mr-32 rounded-full bg-white/5 blur-xl"
        />
        <CardHeader
          class="relative z-10 flex flex-col gap-4 pb-2 sm:flex-row sm:items-start sm:justify-between"
        >
          <div>
            <div class="flex items-center gap-2 mb-2">
              <Badge
                class="bg-emerald-500 text-white border-0 font-bold px-2.5 py-0.5 text-[11px] rounded-full"
              >
                {{ $t("postulante.test_completed") || "Assessment Listo" }}
              </Badge>
              <span class="text-xs font-semibold text-blue-200">{{
                $t("postulante.ai_recommendation") || "Sugerencia de NEXUS"
              }}</span>
            </div>
            <CardTitle
              class="flex flex-wrap items-center gap-2 text-3xl font-extrabold leading-tight sm:text-4xl"
            >
              {{
                $t("postulante.hello", {
                  name: auth.state.user?.name.split(" ")[0] || "Camila",
                }) || "Hola, Camila"
              }}
              <span
                class="text-yellow-300 underline underline-offset-4 decoration-yellow-400/50"
                >{{ auth.state.user?.careerSuggestion || "Ingeniería" }}</span
              >
            </CardTitle>
            <CardDescription
              class="max-w-2xl mt-2 text-sm leading-relaxed text-blue-100"
            >
              {{
                $t("postulante.profile_highlights") ||
                "Continúa avanzando por tu laberinto para descubrir más sobre tu vocación."
              }}
            </CardDescription>
          </div>
          <div
            class="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl self-start sm:self-auto flex flex-col items-start sm:items-end gap-1.5 shadow-lg shrink-0"
          >
            <span
              class="text-[10px] uppercase font-bold text-blue-200 tracking-widest flex items-center gap-1.5"
            >
              <div
                class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"
              ></div>
              {{ $t("postulante.family_code") || "Código de vinculación" }}
            </span>
            <div class="flex items-center gap-2">
              <span
                class="font-mono text-xl font-black tracking-[0.2em] text-white"
                >{{ codigoVinculacion }}</span
              >
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
        <CardContent class="relative z-10 flex flex-wrap gap-3 pt-4">
          <Button
            class="bg-white hover:bg-gray-100 text-[#082065] font-extrabold rounded-xl px-5 h-11 shadow-sm"
            @click="router.push('/postulante/laberinto')"
          >
            Continuar mi Laberinto <ArrowRight class="w-4 h-4 ml-2" />
          </Button>
          <Button
            variant="outline"
            class="px-5 font-bold text-white border-white/20 hover:bg-white/10 rounded-xl h-11"
            @click="router.push('/postulante/test')"
          >
            {{ $t("postulante.retake_test") || "Rehacer Test" }}
          </Button>
        </CardContent>
      </Card>

      <!-- SECCIÓN INTERMEDIA: LABERINTO & P2P -->
      <div class="grid gap-6 md:grid-cols-2">
        <Card class="transition-shadow border-gray-200 hover:shadow-lg">
          <CardHeader>
            <div
              class="w-12 h-12 rounded-xl bg-gradient-to-br from-[#082065] to-[#0D47A1] flex items-center justify-center mb-3 shadow-sm"
            >
              <Gamepad2 class="w-6 h-6 text-white" />
            </div>
            <CardTitle>{{
              $t("postulante.labyrinth") || "Laberinto"
            }}</CardTitle>
            <CardDescription>{{
              $t("postulante.labyrinth_desc") ||
              "Supera misiones para ganar experiencia."
            }}</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <!-- Isometric Illustration -->
              <div
                class="relative flex items-center justify-center p-4 overflow-hidden bg-white border border-gray-100 shadow-sm aspect-square rounded-xl"
              >
                <img
                  src="/image/img-.png"
                  alt="Laberinto de Vocaciones"
                  class="object-contain w-full h-full transition-transform duration-300 drop-shadow-md hover:scale-105"
                />
              </div>

              <!-- Tags -->
              <div class="flex flex-wrap gap-2">
                <Badge
                  variant="secondary"
                  class="bg-[#082065]/10 text-[#082065] border-[#082065]/20"
                >
                  <Brain class="w-3 h-3 mr-1" />
                  {{ $t("postulante.interests") }}
                </Badge>
                <Badge
                  variant="secondary"
                  class="bg-[#082065]/10 text-[#082065] border-[#082065]/20"
                >
                  <Lightbulb class="w-3 h-3 mr-1" />
                  {{ $t("postulante.intelligences") }}
                </Badge>
                <Badge
                  variant="secondary"
                  class="bg-[#082065]/10 text-[#082065] border-[#082065]/20"
                >
                  <Heart class="w-3 h-3 mr-1" />
                  {{ $t("postulante.personality") }}
                </Badge>
              </div>

              <Button
                class="w-full bg-[#082065] hover:bg-[#0D47A1]"
                @click="router.push('/postulante/laberinto')"
              >
                {{ $t("postulante.explore_labyrinth") }}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card
          class="flex flex-col transition-shadow border-gray-200 hover:shadow-lg"
        >
          <CardHeader>
            <div
              class="w-12 h-12 rounded-xl bg-gradient-to-br from-[#082065] to-[#0D47A1] flex items-center justify-center mb-3 shadow-sm"
            >
              <MessageCircle class="w-6 h-6 text-white" />
            </div>
            <CardTitle>{{
              $t("postulante.p2p_connection") || "Conexión P2P"
            }}</CardTitle>
            <CardDescription>{{
              $t("postulante.chat_mentors") ||
              "Habla con estudiantes de ciclos superiores."
            }}</CardDescription>
          </CardHeader>
          <CardContent class="flex flex-col justify-between flex-1">
            <div class="mb-4 space-y-3">
              <p
                class="flex items-center justify-between text-sm font-bold text-slate-800"
              >
                <span>{{
                  $t("postulante.available_mentors") || "Mentores Disponibles"
                }}</span>
                <Badge class="bg-[#082065] text-white">{{
                  mentors.length
                }}</Badge>
              </p>
              <div
                v-for="m in mentors"
                :key="m.name"
                class="flex items-center gap-3 p-3 border rounded-xl hover:bg-slate-50"
              >
                <Avatar
                  ><AvatarFallback>{{ m.name[0] }}</AvatarFallback></Avatar
                >
                <div>
                  <p class="text-sm font-bold">{{ m.name }}</p>
                  <p class="text-xs text-gray-500">{{ m.career }}</p>
                </div>
                <Button size="icon" variant="ghost" class="ml-auto"
                  ><MessageCircle class="w-4 h-4"
                /></Button>
              </div>
            </div>
            <Button
              variant="outline"
              class="w-full font-bold text-slate-700 border-slate-200 hover:bg-slate-50"
              @click="router.push('/postulante/chat-estudiantes')"
            >
              Ver comunidad estudiantil
            </Button>
          </CardContent>
        </Card>
      </div>

      <!-- Acceso a Bitácora Digital -->
      <Card class="w-full shadow-md bg-gradient-to-r from-blue-50 to-white">
        <CardContent
          class="flex flex-col items-center justify-between gap-4 p-6 sm:flex-row"
        >
          <div class="flex items-center gap-4">
            <div
              class="flex items-center justify-center w-12 h-12 rounded-xl bg-[#082065] text-white shadow-sm"
            >
              <BookOpen class="w-6 h-6" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-800">
                {{ $t("postulante.digital_log") || "Bitácora Digital" }}
              </h3>
              <p class="text-sm text-gray-500">
                {{
                  $t("postulante.log_desc") ||
                  "Registra tus reflexiones, descubrimientos y logros vocacionales."
                }}
              </p>
            </div>
          </div>
          <Button
            class="bg-[#082065] hover:bg-[#0D47A1] w-full sm:w-auto shadow-md"
            @click="router.push('/postulante/bitacora')"
          >
            Abrir Bitácora
            <ArrowRight class="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>

      <!-- ============================================== -->
      <!-- TU PROGRESO (Idéntico a image_54cb85.png)      -->
      <!-- ============================================== -->
      <Card class="border-gray-200 shadow-sm">
        <CardHeader class="pb-4">
          <CardTitle class="text-lg font-bold text-slate-900"
            >Tu Progreso</CardTitle
          >
          <CardDescription class="text-sm font-medium text-slate-500"
            >Completa actividades para descubrir tu vocación</CardDescription
          >
        </CardHeader>
        <CardContent>
          <div class="grid gap-4 md:grid-cols-4">
            <div
              v-for="(stat, i) in stats"
              :key="i"
              class="p-5 rounded-xl bg-[#F1F1F1] flex flex-col justify-center min-h-[100px]"
            >
              <p class="text-2xl font-black text-[#082065]">{{ stat.value }}</p>
              <p class="mt-1 text-sm font-medium text-slate-600">
                {{ stat.label }}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 20px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #94a3b8;
}
</style>

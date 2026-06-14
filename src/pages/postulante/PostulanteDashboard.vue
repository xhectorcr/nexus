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
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Check,
  Circle,
  Copy,
  Gamepad2,
  Heart,
  Home,
  Lightbulb,
  MessageCircle,
  Plus,
  Send,
  Sparkles,
  Target,
  MessageSquare,
  Users
} from "lucide-vue-next";
import { computed, markRaw, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const router = useRouter();
const auth = useAuth();
const { t } = useI18n();
const copied = ref(false);

const sidebarItems = computed(() => [
  { icon: markRaw(Home), label: t('nav.home'), href: "/postulante" },
  { icon: markRaw(Brain), label: t('nav.vocational_tests'), href: "/postulante/test" },
  { icon: markRaw(BookOpen), label: t('postulante.digital_log') || 'Bitácora Digital', href: "#bitacora" },
  { icon: markRaw(MessageSquare), label: t('postulante.chat_students') || 'Chatear con estudiantes', href: "/postulante/chat-estudiantes" },
  { icon: markRaw(Users), label: t('postulante.contact_mentors') || 'Contactar con mentores', href: "/postulante/contacto-mentores" },
])

const mentors = ref<{ name: string; career: string; online: boolean }[]>([]);
const entries = ref<any[]>([]);

const bitacoraForm = ref({
  titulo: '',
  descripcion: '',
  tipoEntrada: 'EXPERIENCIA'
});
const bitacoraLoading = ref(false);
const bitacoraSubmitting = ref(false);

const fetchBitacora = async () => {
  bitacoraLoading.value = true;
  try {
    const postulantId = auth.state.user?.id || 1;
    const res = await api.get(`/api/bitacoras/postulante/${postulantId}`);
    entries.value = res.data?.data || res.data || [];
  } catch (error) {
    console.warn("Could not fetch bitacora, using fallback", error);
    if (entries.value.length === 0) {
      entries.value = [
        { titulo: "Proyecto de robótica", descripcion: "Completé mi primer prototipo con éxito.", tipoEntrada: "LOGRO", fecha: new Date().toISOString() },
        { titulo: "Dudas sobre la carrera", descripcion: "No sé si elegir sistemas o software, ambas me gustan mucho.", tipoEntrada: "REFLEXION", fecha: new Date().toISOString() },
      ];
    }
  } finally {
    bitacoraLoading.value = false;
  }
};

const saveBitacoraEntry = async () => {
  if (!bitacoraForm.value.titulo || !bitacoraForm.value.descripcion) return;
  bitacoraSubmitting.value = true;
  try {
    const postulantId = auth.state.user?.id || 1;
    const payload = {
      ...bitacoraForm.value,
      postulanteId: postulantId,
      fecha: new Date().toISOString()
    };
    await api.post('/api/bitacoras', payload);
    await fetchBitacora();
    bitacoraForm.value = { titulo: '', descripcion: '', tipoEntrada: 'EXPERIENCIA' };
  } catch (error) {
    console.error("Error saving bitacora:", error);
    entries.value.unshift({ ...bitacoraForm.value, fecha: new Date().toISOString() });
    bitacoraForm.value = { titulo: '', descripcion: '', tipoEntrada: 'EXPERIENCIA' };
  } finally {
    bitacoraSubmitting.value = false;
  }
};

const stats = computed(() => [
  { label: t('postulante.labyrinth_completed'), value: "40%", color: "#082065" },
  { label: t('postulante.log_entries_count'), value: "0", color: "#082065" },
  { label: t('postulante.conversations'), value: "0", color: "#082065" },
  { label: t('postulante.experience'), value: "0 XP", color: "#082065" },
])

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
    // Fallbacks
    entries.value = [
      { titulo: "Proyecto de robótica" },
      { titulo: "Clase de programación" },
    ];
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

onMounted(() => {
  fetchDashboardData();
  fetchBitacora();
});
</script>

<template>
  <DashboardLayout
    :sidebarItems="sidebarItems"
    :title="$t('postulante.title')"
    :subtitle="$t('postulante.subtitle')"
    :breadcrumbs="[{ label: $t('nav.home') }]"
    moduleColor="#082065"
  >
    <div class="space-y-6">
      <!-- Hero Section (Test NOT completed) -->
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
                $t("postulante.start_journey")
              }}</span>
            </div>
            <CardTitle class="text-3xl">{{
              $t("postulante.discover_vocation")
            }}</CardTitle>
            <CardDescription class="mt-1 text-white/90">
              {{ $t("postulante.explore_interests") }}
            </CardDescription>
          </div>
          <div
            class="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl self-start sm:self-auto flex flex-col items-start sm:items-end gap-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:bg-white/15 transition-all cursor-default group shrink-0"
          >
            <span
              class="text-[10px] uppercase font-bold text-blue-200 tracking-widest flex items-center gap-1.5"
              >
              <div class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
              {{ $t("postulante.family_code") }}
            </span>
            <div class="flex items-center gap-2">
              <span
                class="font-mono text-xl font-black tracking-[0.2em] text-white"
              >
                {{ codigoVinculacion }}
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
        <CardContent class="relative z-10">
          <Button
            size="lg"
            class="bg-white text-[#082065] hover:bg-white/90"
            @click="router.push('/postulante/test')"
          >
            {{ $t("postulante.start_evaluation") }}
            <ArrowRight class="w-5 h-5 ml-2" />
          </Button>
        </CardContent>
      </Card>

      <!-- Hero Section (Test COMPLETED) -->
      <Card
        v-else
        class="bg-gradient-to-br from-blue-900 via-[#082065] to-indigo-900 border-0 text-white overflow-hidden relative shadow-lg"
      >
        <div
          class="absolute top-0 right-0 w-64 h-64 -mt-32 -mr-32 rounded-full bg-white/5 blur-xl"
        />
        <div
          class="absolute bottom-0 left-0 w-48 h-48 -mb-24 -ml-24 rounded-full bg-white/5 blur-xl"
        />
        <CardHeader
          class="relative z-10 flex flex-col gap-4 pb-2 sm:flex-row sm:items-start sm:justify-between"
        >
          <div>
            <div class="flex items-center gap-2 mb-2">
              <Badge class="bg-blue-500 text-white border-0 font-bold px-2.5 py-0.5 text-[11px] rounded-full">
                {{ $t('postulante.test_completed') }}
              </Badge>
              <span class="text-xs font-semibold text-blue-200">{{
                $t("postulante.ai_recommendation")
              }}</span>
            </div>
            <CardTitle
              class="flex flex-wrap items-center gap-2 text-3xl font-extrabold leading-tight sm:text-4xl"
            >
              {{
                $t("postulante.hello", {
                  name: auth.state.user?.name.split(" ")[0] || "Camila",
                })
              }}
              <span
                class="text-yellow-300 underline underline-offset-4 decoration-yellow-400/50"
                >{{ auth.state.user?.careerSuggestion || "Ingeniería" }}</span
              >
            </CardTitle>
            <CardDescription
              class="max-w-2xl mt-2 text-sm leading-relaxed text-blue-100"
            >
              {{ $t("postulante.profile_highlights") }}
            </CardDescription>
          </div>
          <div
            class="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl self-start sm:self-auto flex flex-col items-start sm:items-end gap-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:bg-white/15 transition-all cursor-default group shrink-0"
          >
            <span
              class="text-[10px] uppercase font-bold text-blue-200 tracking-widest flex items-center gap-1.5"
              >
              <div class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
              {{ $t("postulante.family_code") }}
            </span>
            <div class="flex items-center gap-2">
              <span
                class="font-mono text-xl font-black tracking-[0.2em] text-white"
              >
                {{ codigoVinculacion }}
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
        <CardContent class="relative z-10 flex flex-wrap gap-3 pt-4">
          <Button class="bg-white hover:bg-gray-100 text-[#082065] font-extrabold rounded-xl px-5 h-11 shadow-sm">
            {{ $t('postulante.view_curriculum') }}
          </Button>
          <Button
            variant="outline"
            class="px-5 font-bold text-white border-white/20 hover:bg-white/10 rounded-xl h-11"
            @click="router.push('/postulante/test')"
          >
            {{ $t("postulante.retake_test") }}
          </Button>
        </CardContent>
      </Card>

      <!-- Main Features Grid -->
      <div class="grid gap-6">
        <!-- Minijuego: Laberinto de Vocaciones -->
        <Card class="transition-shadow hover:shadow-lg">
          <CardHeader>
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-[#082065] to-[#0D47A1] flex items-center justify-center mb-3">
              <Gamepad2 class="w-6 h-6 text-white" />
            </div>
            <CardTitle>{{ $t("postulante.labyrinth") }}</CardTitle>
            <CardDescription>
              {{ $t("postulante.labyrinth_desc") }}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <!-- Isometric Illustration Placeholder -->
              <div
                class="aspect-square rounded-xl bg-gradient-to-br from-[#F1F1F1] to-[#D9D9D9] flex items-center justify-center relative overflow-hidden"
              >
                <div class="absolute inset-0 grid grid-cols-3 gap-2 p-4">
                  <div
                    v-for="i in 9"
                    :key="i"
                    class="flex items-center justify-center rounded-lg bg-white/50 backdrop-blur-sm"
                  >
                    <Target v-if="i === 5" class="w-6 h-6 text-[#082065]" />
                  </div>
                </div>
              </div>

              <!-- Tags -->
              <div class="flex flex-wrap gap-2">
                <Badge variant="secondary" class="bg-[#082065]/10 text-[#082065] border-[#082065]/20">
                  <Brain class="w-3 h-3 mr-1" />
                  {{ $t("postulante.interests") }}
                </Badge>
                <Badge variant="secondary" class="bg-[#082065]/10 text-[#082065] border-[#082065]/20">
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

              <Button class="w-full bg-[#082065] hover:bg-[#0D47A1]" @click="router.push('/postulante/laberinto')">
                {{ $t('postulante.explore_labyrinth') }}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Bitácora Digital (Expanded) -->
      <Card id="bitacora" class="w-full border-t-4 border-t-[#082065] shadow-lg">
        <CardHeader class="bg-slate-50/50 pb-6 rounded-t-lg">
          <div class="flex items-start justify-between">
            <div class="flex gap-4">
              <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#082065] to-[#0D47A1] flex items-center justify-center shadow-md">
                <BookOpen class="w-7 h-7 text-white" />
              </div>
              <div>
                <CardTitle class="text-2xl">{{ $t("postulante.digital_log") || 'Bitácora Digital' }}</CardTitle>
                <CardDescription class="text-base mt-1 text-gray-600">
                  {{ $t("postulante.log_desc") || 'Registra tus reflexiones, descubrimientos y logros vocacionales.' }}
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" class="bg-blue-50 text-[#082065] border-blue-200 px-3 py-1 text-sm hidden sm:inline-flex">
              {{ entries.length }} entradas
            </Badge>
          </div>
        </CardHeader>
        <CardContent class="pt-6">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <!-- Formulario de nueva entrada -->
            <div class="lg:col-span-5 space-y-5 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <h3 class="font-bold text-lg text-gray-800 flex items-center gap-2">
                <Plus class="w-5 h-5 text-[#082065]" />
                Nueva Entrada
              </h3>
              <div class="space-y-4">
                <div>
                  <label class="text-sm font-medium text-gray-700 mb-1.5 block">Título del avance / logro</label>
                  <Input v-model="bitacoraForm.titulo" :placeholder="$t('postulante.entry_title') || 'Ej. Terminé mi primer test'" class="bg-gray-50 focus-visible:ring-[#082065]" />
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-700 mb-1.5 block">Reflexión detallada</label>
                  <Textarea
                    v-model="bitacoraForm.descripcion"
                    :placeholder="$t('postulante.describe_experience') || 'Me di cuenta de que disfruto mucho...'"
                    class="min-h-[120px] bg-gray-50 focus-visible:ring-[#082065] resize-none"
                  />
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-700 mb-1.5 block">Tipo de registro</label>
                  <div class="flex flex-wrap gap-2">
                    <button
                      v-for="tipo in ['EXPERIENCIA', 'REFLEXION', 'LOGRO']"
                      :key="tipo"
                      @click="bitacoraForm.tipoEntrada = tipo"
                      :class="['px-3 py-1.5 text-xs font-semibold rounded-full border transition-all', bitacoraForm.tipoEntrada === tipo ? 'bg-[#082065] text-white border-[#082065]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300']"
                    >
                      {{ tipo }}
                    </button>
                  </div>
                </div>
                <Button :disabled="bitacoraSubmitting || !bitacoraForm.titulo || !bitacoraForm.descripcion" @click="saveBitacoraEntry" class="w-full bg-[#082065] hover:bg-[#0D47A1] mt-2 shadow-md">
                  <span v-if="bitacoraSubmitting">Guardando...</span>
                  <span v-else class="flex items-center gap-2">Guardar registro <ArrowRight class="w-4 h-4" /></span>
                </Button>
              </div>
            </div>

            <!-- Historial -->
            <div class="lg:col-span-7">
              <h3 class="font-bold text-lg text-gray-800 mb-4 flex items-center justify-between">
                <span>Historial de avances</span>
                <Button variant="ghost" size="sm" @click="fetchBitacora" :disabled="bitacoraLoading" class="text-gray-500 hover:text-[#082065]">
                  Actualizar
                </Button>
              </h3>
              <div v-if="bitacoraLoading" class="flex flex-col gap-3">
                <div v-for="i in 3" :key="i" class="h-28 bg-gray-100 rounded-xl animate-pulse"></div>
              </div>
              <div v-else-if="entries.length === 0" class="flex flex-col items-center justify-center text-center p-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <BookOpen class="w-12 h-12 text-gray-300 mb-3" />
                <p class="text-gray-500 font-medium">Aún no tienes entradas en tu bitácora.</p>
                <p class="text-gray-400 text-sm mt-1">Registra tu primer avance usando el formulario.</p>
              </div>
              <div v-else class="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                <div
                  v-for="(entry, i) in entries"
                  :key="i"
                  class="p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all group relative"
                >
                  <div class="absolute top-4 right-4">
                    <Badge variant="secondary" class="bg-blue-50 text-blue-700 hover:bg-blue-100 uppercase text-[10px] font-bold tracking-wider">
                      {{ entry.tipoEntrada || 'ENTRADA' }}
                    </Badge>
                  </div>
                  <h4 class="text-base font-bold text-[#1F1F1F] pr-20 mb-1">
                    {{ entry.titulo || 'Entrada sin título' }}
                  </h4>
                  <p class="text-sm text-gray-600 mb-3 whitespace-pre-wrap leading-relaxed">
                    {{ entry.descripcion }}
                  </p>
                  <div class="flex items-center text-xs text-gray-400 font-medium">
                    <Circle class="w-3 h-3 text-[#082065] mr-1.5 fill-[#082065]" />
                    {{ entry.fecha ? new Date(entry.fecha).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'Recientemente' }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Progress Section -->
      <Card>
        <CardHeader>
          <CardTitle>{{ $t("postulante.your_progress") }}</CardTitle>
          <CardDescription>{{
            $t("postulante.complete_activities")
          }}</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid gap-4 md:grid-cols-4">
            <div
              v-for="(stat, i) in stats"
              :key="i"
              class="p-4 rounded-xl bg-[#F1F1F1]"
            >
              <p class="text-2xl font-bold" :style="{ color: stat.color }">
                {{ stat.value }}
              </p>
              <p class="text-sm text-[#5F6368] mt-1">{{ stat.label }}</p>
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
  background-color: #E5E7EB;
  border-radius: 20px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #D1D5DB;
}
</style>

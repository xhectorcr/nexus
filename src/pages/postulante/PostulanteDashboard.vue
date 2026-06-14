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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Plus,
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
]);

const postulanteIdRef = ref<number>(1);
const mentors = ref<{ name: string; career: string; online: boolean }[]>([]);
const entries = ref<any[]>([]);

const journeyProgress = ref(0);
const userXp = ref(0);

const bitacoraForm = ref({
  titulo: "",
  descripcion: "",
  tipoEntrada: "EXPERIENCIA",
});
const bitacoraLoading = ref(false);
const bitacoraSubmitting = ref(false);

const initializeDashboard = async () => {
  const userId = auth.state.user?.id || 1;
  try {
    const profRes = await api.get(`/api/postulantes/by-usuario/${userId}`);
    if (profRes.data?.data?.id) {
      postulanteIdRef.value = profRes.data.data.id;
    }
  } catch (error) {
    console.warn("Usando fallback ID para postulante");
  }

  await Promise.all([fetchBitacora(), fetchJourneyStats(), fetchMentors()]);
};

const fetchJourneyStats = async () => {
  try {
    const res = await api.get(
      `/api/journeys/postulante/${postulanteIdRef.value}/activo`,
    );
    if (res.data && res.data.success) {
      journeyProgress.value = res.data.data.porcentajeProgreso || 0;
      userXp.value = res.data.data.xpCompletado || 0;
    }
  } catch (error) {
    console.log("El usuario aún no tiene un journey activo.");
    journeyProgress.value = 0;
    userXp.value = 0;
  }
};

// 3. Traer Bitácora
const fetchBitacora = async () => {
  bitacoraLoading.value = true;
  try {
    const res = await api.get(
      `/api/bitacoras/postulante/${postulanteIdRef.value}`,
    );
    entries.value = res.data?.data || res.data || [];
  } catch (error) {
    console.error("No se pudo obtener la bitácora desde la BD", error);
    entries.value = [];
  } finally {
    bitacoraLoading.value = false;
  }
};

// 4. Traer Mentores (P2P)
const fetchMentors = async () => {
  try {
    const conexionesRes = await api.get(
      `/api/conexiones/postulante/${postulanteIdRef.value}`,
    );
    const conexiones = conexionesRes.data?.data || [];

    mentors.value = conexiones.map((con: any) => ({
      name:
        con.estudianteId === 2
          ? "Alejandro Lastra"
          : `Mentor #${con.estudianteId}`,
      career: "Ingeniería de Sistemas",
      online: con.estado === "ACTIVA",
    }));

    if (mentors.value.length === 0) {
      // Mock Data si no tiene conexiones para que el UI no se vea vacío
      mentors.value = [
        { name: "Ana García", career: "Ingeniería de Sistemas", online: true },
        { name: "Carlos Ruiz", career: "Administración", online: true },
      ];
    }
  } catch (error) {
    mentors.value = [
      { name: "Ana García", career: "Ingeniería de Sistemas", online: true },
      { name: "Carlos Ruiz", career: "Administración", online: true },
    ];
  }
};

const saveBitacoraEntry = async () => {
  if (!bitacoraForm.value.titulo || !bitacoraForm.value.descripcion) return;
  bitacoraSubmitting.value = true;

  try {
    const payload = {
      ...bitacoraForm.value,
      postulanteId: postulanteIdRef.value,
      emocion: "MOTIVADO",
      nivelConfianza: 8,
      nivelMotivacion: 10,
      tags: ["General"],
    };

    await api.post(`/api/bitacoras`, payload);
    await fetchBitacora();

    bitacoraForm.value = {
      titulo: "",
      descripcion: "",
      tipoEntrada: "EXPERIENCIA",
    };
  } catch (error) {
    console.error("Error al guardar la bitácora en la BD:", error);
  } finally {
    bitacoraSubmitting.value = false;
  }
};

// ESTADÍSTICAS AHORA SÍ SON 100% DINÁMICAS
const stats = computed(() => [
  {
    label: t("postulante.labyrinth_completed") || "Laberinto completado",
    value: `${Math.round(journeyProgress.value)}%`,
  },
  {
    label: t("postulante.log_entries_count") || "Entradas en bitácora",
    value: entries.value.length.toString(),
  },
  {
    label: t("postulante.conversations") || "Conversaciones",
    value: mentors.value.length.toString(),
  },
  {
    label: t("postulante.experience") || "Experiencia (XP)",
    value: `${userXp.value} XP`,
  },
]);

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
  initializeDashboard();
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

      <!-- ============================================== -->
      <!-- BITÁCORA DIGITAL (Idéntica a image_54cb85.png) -->
      <!-- ============================================== -->
      <Card id="bitacora" class="w-full border-gray-200 shadow-md">
        <CardHeader class="pb-6 bg-white border-b border-gray-100 rounded-t-xl">
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-4">
              <div
                class="w-12 h-12 rounded-xl bg-[#082065] flex items-center justify-center shadow-sm"
              >
                <BookOpen class="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle class="text-xl font-bold text-slate-900"
                  >Bitácora Digital</CardTitle
                >
                <CardDescription
                  class="mt-0.5 text-sm font-medium text-slate-500"
                >
                  Registra proyectos, experiencias y metas
                </CardDescription>
              </div>
            </div>
            <Badge
              variant="outline"
              class="px-3 py-1 text-xs font-bold text-blue-700 border-blue-200 bg-slate-50"
            >
              {{ entries.length }} entradas
            </Badge>
          </div>
        </CardHeader>

        <CardContent class="pt-6">
          <div class="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <!-- FORMULARIO NUEVA ENTRADA (Left Side) -->
            <div
              class="p-6 space-y-5 bg-white border shadow-sm lg:col-span-5 border-slate-200 rounded-2xl"
            >
              <h3
                class="flex items-center gap-2 mb-4 text-base font-bold text-slate-900"
              >
                <Plus class="w-5 h-5 text-[#082065]" /> Nueva Entrada
              </h3>
              <div class="space-y-4">
                <div>
                  <label
                    class="text-[13px] font-bold text-slate-700 mb-1.5 block"
                    >Título del avance / logro</label
                  >
                  <Input
                    v-model="bitacoraForm.titulo"
                    placeholder="Título de la entrada..."
                    class="h-10 bg-white shadow-sm border-slate-200 focus-visible:ring-blue-600"
                  />
                </div>
                <div>
                  <label
                    class="text-[13px] font-bold text-slate-700 mb-1.5 block"
                    >Reflexión detallada</label
                  >
                  <Textarea
                    v-model="bitacoraForm.descripcion"
                    placeholder="Describe tu experiencia, proyecto u objetivo..."
                    class="min-h-[120px] bg-white border-slate-200 focus-visible:ring-blue-600 resize-none shadow-sm"
                  />
                </div>
                <div>
                  <label class="text-[13px] font-bold text-slate-700 mb-2 block"
                    >Tipo de registro</label
                  >
                  <div class="flex flex-wrap gap-2">
                    <button
                      v-for="tipo in ['EXPERIENCIA', 'REFLEXION', 'LOGRO']"
                      :key="tipo"
                      @click="bitacoraForm.tipoEntrada = tipo"
                      :class="[
                        'px-4 py-1.5 text-xs font-bold rounded-full transition-all border',
                        bitacoraForm.tipoEntrada === tipo
                          ? 'bg-[#082065] text-white border-[#082065] shadow-md'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50',
                      ]"
                    >
                      {{ tipo }}
                    </button>
                  </div>
                </div>
                <Button
                  :disabled="
                    bitacoraSubmitting ||
                    !bitacoraForm.titulo ||
                    !bitacoraForm.descripcion
                  "
                  @click="saveBitacoraEntry"
                  class="w-full bg-[#7584A9] hover:bg-[#082065] text-white mt-4 font-bold h-11 transition-colors"
                >
                  <span v-if="bitacoraSubmitting">Guardando...</span>
                  <span v-else class="flex items-center gap-2"
                    >Guardar registro <ArrowRight class="w-4 h-4"
                  /></span>
                </Button>
              </div>
            </div>

            <!-- LISTA DE ENTRADAS (Right Side) -->
            <div class="lg:col-span-7">
              <h3
                class="flex items-center justify-between mb-5 text-base font-bold text-slate-900"
              >
                <span>Historial de avances</span>
                <button
                  @click="fetchBitacora"
                  :disabled="bitacoraLoading"
                  class="text-xs font-bold transition-colors text-slate-500 hover:text-blue-600"
                >
                  Actualizar
                </button>
              </h3>

              <div v-if="bitacoraLoading" class="space-y-3">
                <div
                  v-for="i in 3"
                  :key="i"
                  class="h-24 bg-slate-100 rounded-xl animate-pulse"
                ></div>
              </div>

              <div
                v-else-if="entries.length === 0"
                class="flex flex-col items-center justify-center p-10 text-center border-2 border-dashed border-slate-200 bg-slate-50 rounded-2xl"
              >
                <BookOpen class="w-10 h-10 mb-3 text-slate-300" />
                <p class="text-sm font-bold text-slate-500">
                  Aún no tienes entradas en tu bitácora.
                </p>
              </div>

              <div
                v-else
                class="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar"
              >
                <div
                  v-for="(entry, i) in entries"
                  :key="i"
                  class="flex flex-col gap-2 p-5 transition-colors bg-white border shadow-sm border-slate-200 rounded-xl hover:border-blue-200"
                >
                  <div class="flex items-center gap-3 mb-1">
                    <Badge
                      variant="secondary"
                      class="bg-blue-50 text-blue-700 hover:bg-blue-50 uppercase text-[10px] font-black tracking-wider px-2 py-0.5 border-0"
                    >
                      {{ entry.tipoEntrada || "EXPERIENCIA" }}
                    </Badge>
                    <span class="text-xs font-medium text-slate-400">
                      {{ formatearFecha(entry.fecha) }}
                    </span>
                  </div>
                  <p class="text-sm font-bold text-slate-900">
                    {{ entry.titulo || entry }}
                  </p>
                </div>
              </div>
            </div>
          </div>
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

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
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Download,
  FileText,
  HelpCircle,
  Home,
  Info,
  KeyRound,
  Phone,
  Sparkles,
  TrendingUp,
  UserCheck,
  Volume2,
  VolumeX,
} from "lucide-vue-next";
import { computed, markRaw, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
const auth = useAuth();
const { t, te } = useI18n();

const vistaFacil = ref(true);
const reproduciendoText = ref("");

const isUnlinking = ref(false);

// Vinculación State
const pinCode = ref("");
const pinError = ref("");
const isLoading = ref(false);

const isLinked = computed(() => !!auth.state.user?.vinculado);

const handleLinkStudent = async () => {
  if (!pinCode.value) {
    pinError.value = "Por favor, ingresa el código del estudiante.";
    return;
  }

  isLoading.value = true;
  pinError.value = "";

  try {
    const success = await auth.linkStudent(pinCode.value);

    if (!success) {
      pinError.value = t("familia.messages.err_invalid_code");
    } else {
      pinCode.value = "";
      if (isApplicantLinked.value) fetchChildData();
      hablar(t("familia.messages.success_linked"));
    }
  } catch (error) {
    pinError.value = "Ocurrió un error de conexión al vincular.";
  } finally {
    isLoading.value = false;
  }
};

const handleUnlinkStudent = async () => {
  isUnlinking.value = true;
  try {
    const success = await auth.unlinkStudent();
    if (success) {
      detenerLectura();
      hablar("Se ha desvinculado la cuenta correctamente.");
    } else {
      console.error("No se pudo desvincular el alumno.");
    }
  } catch (error) {
    console.error("Error en la petición de desvinculación:", error);
  } finally {
    isUnlinking.value = false;
  }
};

const hablar = (texto: string) => {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  reproduciendoText.value = texto;
  const utterance = new SpeechSynthesisUtterance(texto);
  utterance.lang = "es-PE";
  utterance.rate = 0.95;
  utterance.pitch = 1;
  utterance.onend = () => {
    reproduciendoText.value = "";
  };
  window.speechSynthesis.speak(utterance);
};

const detenerLectura = () => {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    reproduciendoText.value = "";
  }
};

const isApplicantLinked = computed(
  () => auth.state.user?.linkedStudentRole === "postulante",
);
const isStudentLinked = computed(
  () => auth.state.user?.linkedStudentRole === "estudiante",
);

const studentMilestones = computed(() => [
  {
    title: t("familia.milestones.s1_t"),
    completed: true,
    date: "15 May 2026",
    desc: t("familia.milestones.s1_d"),
  },
  {
    title: t("familia.milestones.s2_t"),
    completed: true,
    date: "20 May 2026",
    desc: t("familia.milestones.s2_d"),
  },
  {
    title: t("familia.milestones.s3_t"),
    completed: true,
    date: "5 Jun 2026",
    desc: t("familia.milestones.s3_d"),
  },
  {
    title: t("familia.milestones.s4_t"),
    completed: false,
    date: "Pendiente",
    desc: t("familia.milestones.s4_d"),
  },
  {
    title: t("familia.milestones.s5_t"),
    completed: false,
    date: "Pendiente",
    desc: t("familia.milestones.s5_d"),
  },
]);

const applicantMilestones = ref([
  {
    title: t("familia.milestones.a1_t"),
    completed: true,
    date: "12 Jun 2026",
    desc: t("familia.milestones.a1_d"),
  },
  {
    title: t("familia.milestones.a2_t"),
    completed: true,
    date: "13 Jun 2026",
    desc: t("familia.milestones.a2_d"),
  },
  {
    title: t("familia.milestones.a3_t"),
    completed: false,
    date: "Pendiente",
    desc: t("familia.milestones.a3_d"),
  },
  {
    title: t("familia.milestones.a4_t"),
    completed: false,
    date: "Pendiente",
    desc: t("familia.milestones.a4_d"),
  },
]);

const applicantProgress = ref(100);

const fetchChildData = async () => {
  try {
    const childId = 1;
    const profileRes = await api.get(`/api/postulantes/${childId}`);
    const profile = profileRes.data.data;

    if (profile) {
      applicantMilestones.value[0].completed = profile.cuestionarioCompletado;
      applicantProgress.value = profile.cuestionarioCompletado ? 100 : 20;
    }
  } catch (error) {
    console.warn("Error fetching child data (API may not be running):", error);
  }
};

onMounted(() => {
  if (isApplicantLinked.value) {
    fetchChildData();
  }
});

const studentFaqs = computed(() => [
  {
    q: t("familia.faqs.s1_q"),
    a: t("familia.faqs.s1_a"),
    voiceText: t("familia.faqs.s1_v"),
  },
  {
    q: t("familia.faqs.s2_q"),
    a: t("familia.faqs.s2_a"),
    voiceText: t("familia.faqs.s2_v"),
  },
  {
    q: t("familia.faqs.s3_q"),
    a: t("familia.faqs.s3_a"),
    voiceText: t("familia.faqs.s3_v"),
  },
]);

const applicantFaqs = computed(() => [
  {
    q: t("familia.faqs.a1_q"),
    a: t("familia.faqs.a1_a"),
    voiceText: t("familia.faqs.a1_v"),
  },
  {
    q: t("familia.faqs.a2_q"),
    a: t("familia.faqs.a2_a"),
    voiceText: t("familia.faqs.a2_v"),
  },
]);

const selectedFaq = ref<number | null>(null);

const toggleFaq = (index: number) => {
  selectedFaq.value = selectedFaq.value === index ? null : index;
};

const toggleInstrucciones = () => {
  if (reproduciendoText.value) {
    detenerLectura();
    return;
  }

  if (!isLinked.value) {
    hablar(t("familia.messages.voice_welcome_unlinked"));
  } else {
    hablar(
      t("familia.messages.voice_welcome_linked", {
        name: auth.state.user?.studentName,
      }),
    );
  }
};

const resources = computed(() => [
  {
    title: t("familia.resources.r1_t"),
    description: t("familia.resources.r1_d"),
    downloads: 1243,
    icon: markRaw(FileText),
    color: "#D4A017",
  },
  {
    title: t("familia.resources.r2_t"),
    description: t("familia.resources.r2_d"),
    downloads: 1567,
    icon: markRaw(TrendingUp),
    color: "#D4A017",
  },
]);

const parentTips = [
  "Felicita a tu hijo hoy por su esfuerzo. ¡Tu apoyo le dará más motivación!",
  "Pregúntale qué descubrió sobre sí mismo en el Test Vocacional.",
];

const sidebarItems = computed(() => [
  {
    icon: markRaw(Home),
    label: te("nav.home") ? t("nav.home") : "Inicio",
    href: "/familia",
  },
  {
    icon: markRaw(TrendingUp),
    label: te("nav.child_progress")
      ? t("nav.child_progress")
      : "Progreso de tu hijo",
    href: "/familia/progreso",
  },
]);
</script>

<template>
  <DashboardLayout
    :sidebarItems="sidebarItems"
    :title="$t('familia.title')"
    :subtitle="$t('familia.subtitle')"
    moduleColor="#D4A017"
  >
    <div class="space-y-6">
      <!-- TOP BAR: ASISTENTE DE VOZ (COMÚN) -->
      <div
        class="flex flex-col items-center justify-between gap-4 p-5 border shadow-sm bg-gradient-to-r from-amber-50 to-amber-100/50 rounded-2xl border-amber-200/60 md:flex-row"
      >
        <div class="flex items-center gap-3">
          <div
            class="flex items-center justify-center w-12 h-12 text-white shadow-md bg-amber-500 rounded-2xl shrink-0"
          >
            <Sparkles class="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3
              class="font-extrabold text-gray-800"
              :class="vistaFacil ? 'text-xl' : 'text-lg'"
            >
              {{ $t("familia.voice_assistant") }}
            </h3>
            <p class="text-xs font-medium text-gray-600">
              {{ $t("familia.voice_desc") }}
            </p>
          </div>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <button
            @click="vistaFacil = !vistaFacil"
            class="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm border"
            :class="
              vistaFacil
                ? 'bg-amber-600 text-white border-amber-600 hover:bg-amber-700'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
            "
          >
            <span
              class="w-2.5 h-2.5 rounded-full bg-green-400"
              v-if="vistaFacil"
            ></span>
            {{
              vistaFacil
                ? $t("familia.big_text_on")
                : $t("familia.big_text_off")
            }}
          </button>

          <Button
            @click="toggleInstrucciones"
            variant="outline"
            class="gap-2 text-sm font-bold text-gray-800 rounded-xl border-amber-300 hover:bg-amber-50 h-11"
          >
            <component
              :is="reproduciendoText.length > 0 ? VolumeX : Volume2"
              class="w-4.5 h-4.5 text-amber-700"
            />
            {{
              reproduciendoText.length > 0
                ? $t("familia.stop_voice")
                : $t("familia.listen_instructions")
            }}
          </Button>
        </div>
      </div>

      <!-- ============================================== -->
      <!-- PANTALLA DE VINCULACIÓN (CUANDO NO HAY ALUMNO) -->
      <!-- ============================================== -->
      <div
        v-if="!isLinked"
        class="flex flex-col items-center justify-center py-12"
      >
        <Card
          class="w-full max-w-lg overflow-hidden shadow-xl border-amber-200/60 rounded-2xl"
        >
          <div
            class="w-full h-2 bg-gradient-to-r from-amber-400 to-amber-600"
          ></div>
          <CardHeader class="pt-8 pb-2 text-center">
            <div
              class="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full shadow-inner bg-amber-100"
            >
              <UserCheck class="w-8 h-8 text-amber-600" />
            </div>
            <CardTitle class="text-2xl font-black text-gray-900">{{
              $t("familia.link_account")
            }}</CardTitle>
            <CardDescription class="mt-2 text-base text-gray-600">
              {{ $t("familia.link_desc") }}
            </CardDescription>
          </CardHeader>

          <CardContent class="p-8 pt-6 space-y-6">
            <div
              class="flex gap-3 p-4 text-sm border bg-amber-50/50 border-amber-100 rounded-xl text-amber-800"
            >
              <Info class="w-5 h-5 shrink-0 text-amber-500" />
              <p>
                <strong>{{ $t("familia.where_code") }}</strong
                ><br />
                {{ $t("familia.where_code_desc") }}
              </p>
            </div>

            <div class="space-y-3">
              <label
                for="pinCode"
                class="block text-sm font-extrabold tracking-wide text-gray-700 uppercase"
              >
                {{ $t("familia.student_code") }}
              </label>
              <div class="relative">
                <KeyRound
                  class="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-4 top-1/2"
                />
                <Input
                  id="pinCode"
                  v-model="pinCode"
                  placeholder="Ej. NEX-ALE-2026"
                  class="pl-12 text-lg font-bold border-gray-300 h-14 focus:border-amber-500 focus:ring-amber-500 rounded-xl"
                  @keyup.enter="handleLinkStudent"
                />
              </div>
              <p
                v-if="pinError"
                class="flex items-center gap-2 p-2 text-sm font-bold text-red-600 border border-red-100 rounded-lg bg-red-50"
              >
                <span class="w-2 h-2 bg-red-600 rounded-full"></span>
                {{ pinError }}
              </p>
            </div>

            <Button
              @click="handleLinkStudent"
              class="w-full h-14 text-lg font-black text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              :disabled="isLoading"
            >
              <span
                v-if="isLoading"
                class="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"
              ></span>
              <span v-else class="flex items-center gap-2"
                >{{ $t("familia.link_continue") }} <ArrowRight class="w-5 h-5"
              /></span>
            </Button>
          </CardContent>
        </Card>
      </div>

      <!-- ============================================== -->
      <!-- DASHBOARD (CUANDO SÍ HAY ALUMNO) -->
      <!-- ============================================== -->
      <div v-else class="space-y-6 duration-500 animate-in fade-in zoom-in-95">
        <!-- HEADER ALUMNO -->
        <div
          class="relative flex flex-col items-center justify-between gap-4 p-6 overflow-hidden bg-white border border-gray-200 shadow-sm sm:flex-row rounded-2xl"
        >
          <div
            class="absolute top-0 right-0 w-64 h-full pointer-events-none bg-gradient-to-l from-amber-50 to-transparent"
          ></div>

          <div class="z-10 flex items-center gap-5">
            <div
              class="flex items-center justify-center w-16 h-16 border-4 rounded-full shadow-sm bg-amber-100 border-amber-50 text-amber-700"
            >
              <span class="text-2xl font-black">{{
                auth.state.user?.studentName?.charAt(0) || "A"
              }}</span>
            </div>
            <div>
              <span
                class="text-sm font-bold tracking-wider text-gray-500 uppercase"
                >{{ $t("familia.connected_child") }}</span
              >
              <h2
                class="mt-1 font-black text-gray-900"
                :class="vistaFacil ? 'text-3xl' : 'text-2xl'"
              >
                {{ auth.state.user?.studentName }}
              </h2>
              <Badge
                class="px-3 py-1 mt-2 text-xs font-extrabold uppercase bg-amber-100 text-amber-800 border-amber-200"
              >
                {{
                  isStudentLinked ? "Estudiante UTP" : "Postulante / Admisión"
                }}
              </Badge>
            </div>
          </div>

          <div class="z-10">
            <Button
              variant="outline"
              @click="auth.unlinkStudent()"
              class="text-xs font-bold text-gray-500 border-gray-200 hover:text-red-600 rounded-xl"
            >
              {{ $t("familia.unlink") }}
            </Button>
          </div>
        </div>

        <!-- MAIN CONTENT COLUMNS -->
        <div class="grid lg:grid-cols-[2fr_1fr] gap-6">
          <!-- LEFT COLUMN: PROGRESO Y PASOS -->
          <div class="space-y-6">
            <!-- TARJETA: ESTADO PRINCIPAL (Semáforo) -->
            <Card
              class="relative p-6 overflow-hidden bg-white border-2 shadow-sm md:p-8 rounded-2xl"
              :class="
                isStudentLinked
                  ? 'border-amber-300 bg-amber-50/10'
                  : 'border-amber-300 bg-amber-50/10'
              "
            >
              <div
                class="absolute w-40 h-40 rounded-full opacity-50 -right-10 -top-10 blur-3xl"
                :class="isStudentLinked ? 'bg-amber-300' : 'bg-amber-300'"
              ></div>

              <div class="relative z-10">
                <div class="flex items-center gap-3 mb-4">
                  <span
                    class="w-4 h-4 rounded-full animate-pulse"
                    :class="isStudentLinked ? 'bg-amber-500' : 'bg-amber-500'"
                  ></span>
                  <span
                    class="text-sm font-black tracking-wider uppercase"
                    :class="
                      isStudentLinked ? 'text-amber-800' : 'text-amber-800'
                    "
                  >
                    {{ $t("familia.status_ok") }}
                  </span>
                </div>

                <h2
                  class="mb-3 font-black leading-tight text-gray-900"
                  :class="vistaFacil ? 'text-3xl' : 'text-2xl'"
                >
                  {{
                    isStudentLinked
                      ? $t("familia.student_status", {
                          name: auth.state.user?.studentName,
                        })
                      : $t("familia.applicant_status", {
                          name: auth.state.user?.studentName,
                        })
                  }}
                </h2>

                <p
                  class="max-w-2xl leading-relaxed text-gray-700"
                  :class="vistaFacil ? 'text-xl' : 'text-lg'"
                >
                  <span v-if="isStudentLinked">
                    {{ $t("familia.status_msg_student") }}
                  </span>
                  <span v-else>
                    {{ $t("familia.status_msg_applicant") }}
                  </span>
                </p>

                <!-- NEW PROGRESS BAR -->
                <div class="max-w-xl mt-4">
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-sm font-bold text-gray-700">{{
                      $t("familia.overall_progress")
                    }}</span>
                    <span class="text-sm font-black text-gray-900">{{
                      isStudentLinked ? "68%" : applicantProgress + "%"
                    }}</span>
                  </div>
                  <Progress
                    :value="isStudentLinked ? 68 : applicantProgress"
                    class="h-4 bg-gray-200"
                  />
                </div>

                <!-- CALL TO ACTION / NEXT STEP -->
                <div
                  class="flex items-start gap-4 p-5 mt-6 bg-white border shadow-sm rounded-xl"
                  :class="
                    isStudentLinked ? 'border-amber-200' : 'border-amber-200'
                  "
                >
                  <div class="p-2 bg-gray-100 rounded-lg shrink-0">
                    <ArrowRight class="w-6 h-6 text-gray-700" />
                  </div>
                  <div>
                    <h4
                      class="font-black text-gray-900"
                      :class="vistaFacil ? 'text-xl' : 'text-lg'"
                    >
                      {{ $t("familia.next_task") }}
                    </h4>
                    <p
                      class="mt-1 font-medium text-gray-700"
                      :class="vistaFacil ? 'text-lg' : 'text-base'"
                    >
                      {{
                        isStudentLinked
                          ? $t("familia.student_next_task")
                          : $t("familia.applicant_next_task")
                      }}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <!-- TARJETA: LÍNEA DE TIEMPO (TIMELINE) -->
            <Card
              class="overflow-hidden bg-white border-gray-200 shadow-sm rounded-2xl"
            >
              <CardHeader class="p-6 border-b border-gray-100 bg-gray-50/50">
                <CardTitle
                  class="flex items-center gap-3 font-black text-gray-900"
                  :class="vistaFacil ? 'text-2xl' : 'text-xl'"
                >
                  <TrendingUp class="w-6 h-6 text-amber-600" />
                  {{ $t("familia.timeline_title") }}
                </CardTitle>
                <CardDescription
                  :class="vistaFacil ? 'text-lg' : 'text-base'"
                  class="font-medium text-gray-600"
                >
                  {{ $t("familia.timeline_desc") }}
                </CardDescription>
              </CardHeader>

              <CardContent class="p-6">
                <div
                  class="relative pl-6 ml-4 border-l-[3px] border-gray-100 space-y-8"
                >
                  <div
                    v-for="(m, idx) in isStudentLinked
                      ? studentMilestones
                      : applicantMilestones"
                    :key="idx"
                    class="relative"
                  >
                    <!-- Milestone Dot -->
                    <span
                      class="absolute -left-[35px] top-1 w-7 h-7 rounded-full flex items-center justify-center border-4"
                      :class="
                        m.completed
                          ? 'bg-amber-500 border-white shadow-sm z-10'
                          : 'bg-gray-200 border-white text-gray-400'
                      "
                    >
                      <CheckCircle2
                        v-if="m.completed"
                        class="w-5 h-5 text-white"
                      />
                    </span>

                    <!-- Milestone Content -->
                    <div
                      class="transition-all"
                      :class="m.completed ? 'opacity-100' : 'opacity-60'"
                    >
                      <h4
                        class="font-black text-gray-900"
                        :class="vistaFacil ? 'text-xl' : 'text-lg'"
                      >
                        {{ m.title }}
                      </h4>
                      <p
                        class="mt-1 font-medium text-gray-600"
                        :class="vistaFacil ? 'text-lg' : 'text-base'"
                      >
                        {{ m.desc }}
                      </p>

                      <div class="mt-2">
                        <Badge
                          v-if="m.completed"
                          class="bg-amber-100 text-amber-800 border-amber-200 font-extrabold px-2.5 py-0.5"
                        >
                          ✓ {{ $t("familia.completed") }}
                        </Badge>
                        <Badge
                          v-else
                          class="bg-gray-100 text-gray-600 border-gray-200 font-extrabold px-2.5 py-0.5"
                        >
                          ⏳ {{ $t("familia.upcoming") }}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <!-- RIGHT COLUMN: FAQS & RECURSOS -->
          <div class="space-y-6">
            <!-- TARJETA: FAQS -->
            <Card class="bg-white border-gray-200 shadow-sm rounded-2xl">
              <CardHeader class="p-5 border-b border-gray-100">
                <CardTitle
                  class="flex items-center gap-2 text-lg font-black text-gray-900"
                >
                  <HelpCircle class="w-5 h-5 text-amber-600" />
                  {{ $t("familia.faqs_title") }}
                </CardTitle>
              </CardHeader>
              <CardContent class="p-4 space-y-3">
                <div
                  v-for="(faq, i) in isStudentLinked
                    ? studentFaqs
                    : applicantFaqs"
                  :key="i"
                  class="overflow-hidden transition-all border border-gray-200 rounded-xl bg-gray-50 hover:border-amber-300"
                  :class="
                    selectedFaq === i
                      ? 'ring-2 ring-amber-500 border-transparent bg-white shadow-sm'
                      : ''
                  "
                >
                  <button
                    @click="toggleFaq(i)"
                    class="flex items-center justify-between w-full p-4 font-bold text-left text-gray-800 focus:outline-none"
                  >
                    <span :class="vistaFacil ? 'text-base' : 'text-sm'">{{
                      faq.q
                    }}</span>
                    <ChevronDown
                      class="w-5 h-5 text-gray-400 transition-transform"
                      :class="
                        selectedFaq === i ? 'rotate-180 text-amber-500' : ''
                      "
                    />
                  </button>
                  <div
                    v-if="selectedFaq === i"
                    class="px-4 pt-3 pb-4 mt-1 font-medium leading-relaxed text-gray-600 border-t border-gray-100"
                    :class="vistaFacil ? 'text-base' : 'text-sm'"
                  >
                    {{ faq.a }}
                    <div class="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="secondary"
                        class="h-8 font-bold text-xs gap-1.5 bg-amber-100 text-amber-800 hover:bg-amber-200"
                        @click.stop="hablar(faq.voiceText)"
                      >
                        <Volume2 class="w-3.5 h-3.5" />
                        {{ $t("familia.listen") }}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <!-- TARJETA: RECURSOS -->
            <Card class="bg-white border-gray-200 shadow-sm rounded-2xl">
              <CardHeader class="p-5 border-b border-gray-100">
                <CardTitle class="text-lg font-black text-gray-900">{{
                  $t("familia.help_title")
                }}</CardTitle>
              </CardHeader>
              <CardContent class="p-0">
                <div class="divide-y divide-gray-100">
                  <div
                    v-for="(res, idx) in resources"
                    :key="idx"
                    class="p-5 transition-colors hover:bg-gray-50"
                  >
                    <div class="flex gap-3">
                      <div
                        class="flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
                        :style="{
                          backgroundColor: `${res.color}15`,
                          color: res.color,
                        }"
                      >
                        <component :is="res.icon" class="w-5 h-5" />
                      </div>
                      <div>
                        <h4 class="text-sm font-bold text-gray-900">
                          {{ res.title }}
                        </h4>
                        <p class="mt-1 mb-2 text-xs text-gray-600">
                          {{ res.description }}
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          class="h-7 text-xs font-bold gap-1.5 rounded-lg border-gray-300"
                        >
                          <Download class="w-3 h-3" />
                          {{ $t("familia.download_pdf") }}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  class="flex items-center justify-between p-4 border-t bg-amber-50 rounded-b-2xl border-amber-100"
                >
                  <span
                    class="text-xs font-black tracking-wider uppercase text-amber-800"
                    >{{ $t("familia.quick_doubts") }}</span
                  >
                  <a
                    href="tel:+51987654321"
                    class="flex items-center gap-1.5 text-xs font-black text-amber-600 hover:text-amber-700 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-amber-200"
                  >
                    <Phone class="w-3.5 h-3.5" />
                    {{ $t("familia.call_support") }}
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<style scoped>
.transition-all {
  transition: all 0.3s ease;
}
</style>

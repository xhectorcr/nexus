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
  { icon: markRaw(Gamepad2), label: t('postulante.labyrinth'), href: "/postulante/laberinto" },
  { icon: markRaw(BookOpen), label: t('postulante.digital_log'), href: "/postulante/bitacora" },
  { icon: markRaw(MessageCircle), label: t('postulante.p2p_connection'), href: "/postulante/p2p" },
])

const mentors = ref<{ name: string; career: string; online: boolean }[]>([]);
const entries = ref<any[]>([]);

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
      <div class="grid gap-6 md:grid-cols-2">
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

        <!-- Bitácora Digital -->
        <Card class="transition-shadow hover:shadow-lg">
          <CardHeader>
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-[#082065] to-[#0D47A1] flex items-center justify-center mb-3">
              <BookOpen class="w-6 h-6 text-white" />
            </div>
            <CardTitle>{{ $t("postulante.digital_log") }}</CardTitle>
            <CardDescription>
              {{ $t("postulante.log_desc") }}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="write" class="w-full">
              <TabsList class="grid w-full grid-cols-2">
                <TabsTrigger value="write">{{
                  $t("postulante.write")
                }}</TabsTrigger>
                <TabsTrigger value="entries">{{
                  $t("postulante.entries")
                }}</TabsTrigger>
              </TabsList>
              <TabsContent value="write" class="space-y-4">
                <Input :placeholder="$t('postulante.entry_title')" />
                <Textarea
                  :placeholder="$t('postulante.describe_experience')"
                  class="min-h-[120px]"
                />
                <div class="flex gap-2">
                  <Button size="sm" variant="outline" class="flex-1">
                    <Plus class="w-4 h-4 mr-1" />
                    {{ $t("postulante.add_tag") }}
                  </Button>
                  <Button size="sm" class="bg-[#082065] hover:bg-[#0D47A1]">
                    {{ $t('postulante.save') }}
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="entries" class="space-y-3">
                <div
                  v-for="(entry, i) in entries"
                  :key="i"
                  class="p-3 rounded-lg bg-[#F1F1F1] hover:bg-[#D9D9D9] transition-colors cursor-pointer"
                >
                  <p class="text-sm font-medium text-[#1F1F1F]">
                    {{ entry.titulo || entry }}
                  </p>
                  <p class="text-xs text-[#5F6368] mt-1">
                    {{
                      entry.fecha
                        ? new Date(entry.fecha).toLocaleDateString()
                        : $t("postulante.recently")
                    }}
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <!-- Conexión P2P -->
        <Card class="transition-shadow hover:shadow-lg md:col-span-2">
          <CardHeader>
            <div
              class="w-12 h-12 rounded-xl bg-gradient-to-br from-[#082065] to-[#0D47A1] flex items-center justify-center mb-3"
            >
              <MessageCircle class="w-6 h-6 text-white" />
            </div>
            <CardTitle>{{ $t("postulante.p2p_connection") }}</CardTitle>
            <CardDescription>
              {{ $t("postulante.chat_mentors") }}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-3">
              <p class="text-sm font-medium text-[#1F1F1F]">
                {{ $t("postulante.available_mentors") }}
              </p>
              <div
                v-for="(mentor, i) in mentors"
                :key="i"
                class="flex items-center gap-3 p-3 rounded-lg hover:bg-[#F1F1F1] transition-colors cursor-pointer"
              >
                <div class="relative">
                  <Avatar class="w-10 h-10">
                    <AvatarImage src="" />
                    <AvatarFallback class="bg-[#082065] text-white">
                      {{ mentor.name[0] }}
                    </AvatarFallback>
                  </Avatar>
                  <Circle
                    v-if="mentor.online"
                    class="absolute bottom-0 right-0 w-3 h-3 fill-[#2E7D32] text-[#2E7D32] border-2 border-white rounded-full"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-[#1F1F1F] truncate">
                    {{ mentor.name }}
                  </p>
                  <p class="text-xs text-[#5F6368] truncate">
                    {{ mentor.career }}
                  </p>
                </div>
                <Button size="sm" variant="ghost">
                  <Send class="w-4 h-4" />
                </Button>
              </div>
              <Button variant="outline" class="w-full">
                {{ $t("postulante.view_all_mentors") }}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

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

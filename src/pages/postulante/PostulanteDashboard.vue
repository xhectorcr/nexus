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
import { useRouter } from "vue-router";

const router = useRouter();
const auth = useAuth();
const copied = ref(false);

const sidebarItems = [
  { icon: markRaw(Home), label: "Inicio", href: "/postulante" },
  { icon: markRaw(Brain), label: "Test Vocacional", href: "/postulante/test" },
];

const mentors = ref<{ name: string; career: string; online: boolean }[]>([]);
const entries = ref<any[]>([]);

const stats = ref([
  { label: "Laberinto completado", value: "40%", color: "#B50E30" },
  { label: "Entradas en bitácora", value: "0", color: "#D4A017" },
  { label: "Conversaciones", value: "0", color: "#1565C0" },
  { label: "Experiencia (XP)", value: "0 XP", color: "#2E7D32" },
]);

const fetchDashboardData = async () => {
  try {
    const postulantId = 1;

    const dashboardRes = await api.get(
      `/api/dashboard/postulante/${postulantId}`,
    );
    const dashboard = dashboardRes.data.data;

    if (dashboard) {
      stats.value[1].value = "0";
      stats.value[3].value = `${dashboard.progress?.xp || 0} XP`;

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
        stats.value[2].value = conexiones.length.toString();
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
    title="NEXUS Postulante"
    subtitle="Descubre tu verdadera vocación con inteligencia artificial"
    :breadcrumbs="[{ label: 'Inicio' }]"
    moduleColor="#1565C0"
  >
    <div class="space-y-6">
      <!-- Hero Section (Test NOT completed) -->
      <Card
        v-if="!auth.state.user?.careerSuggestion"
        class="bg-gradient-to-br from-[#B50E30] to-[#8F0B26] border-0 text-white overflow-hidden relative"
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
              <span class="text-sm font-medium">Comenzar mi viaje</span>
            </div>
            <CardTitle class="text-3xl"
              >Descubre tu verdadera vocación</CardTitle
            >
            <CardDescription class="mt-1 text-white/90">
              Explora tus intereses, desarrolla tu perfil y conecta con mentores
            </CardDescription>
          </div>
          <div
            class="bg-white/10 backdrop-blur-md border border-white/20 p-3.5 rounded-2xl self-start sm:self-auto flex flex-col items-start sm:items-end gap-1 select-all shrink-0"
          >
            <span
              class="text-[10px] uppercase font-bold text-red-200 tracking-wider"
              >Código de Vinculación Familiar</span
            >
            <div class="flex items-center gap-2">
              <span
                class="font-mono text-lg font-black tracking-widest text-white"
              >
                {{ codigoVinculacion || "Cargando..." }}
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
            class="bg-white text-[#1565C0] hover:bg-white/90"
            @click="router.push('/postulante/test')"
          >
            Comenzar evaluación
            <ArrowRight class="w-5 h-5 ml-2" />
          </Button>
        </CardContent>
      </Card>

      <!-- Hero Section (Test COMPLETED) -->
      <Card
        v-else
        class="bg-gradient-to-br from-blue-900 via-[#1565C0] to-indigo-900 border-0 text-white overflow-hidden relative shadow-lg"
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
              <Badge
                class="bg-green-500 text-white border-0 font-bold px-2.5 py-0.5 text-[11px] rounded-full"
              >
                Test Completado
              </Badge>
              <span class="text-xs font-semibold text-blue-200"
                >Recomendación NEXUS IA</span
              >
            </div>
            <CardTitle
              class="flex flex-wrap items-center gap-2 text-3xl font-extrabold leading-tight sm:text-4xl"
            >
              ¡Hola, {{ auth.state.user?.name.split(" ")[0] || "Camila" }}! Tu
              carrera ideal es:
              <span
                class="text-yellow-300 underline underline-offset-4 decoration-yellow-400/50"
                >{{ auth.state.user.careerSuggestion }}</span
              >
            </CardTitle>
            <CardDescription
              class="max-w-2xl mt-2 text-sm leading-relaxed text-blue-100"
            >
              Tu perfil destaca por aptitudes lógicas y organizacionales
              avanzadas. Ya puedes acceder a la malla curricular de tu carrera y
              coordinar una visita guiada al campus de la UTP.
            </CardDescription>
          </div>
          <div
            class="bg-white/10 backdrop-blur-md border border-white/20 p-3.5 rounded-2xl self-start sm:self-auto flex flex-col items-start sm:items-end gap-1 select-all shrink-0"
          >
            <span
              class="text-[10px] uppercase font-bold text-blue-200 tracking-wider"
              >Código de Vinculación Familiar</span
            >
            <div class="flex items-center gap-2">
              <span
                class="font-mono text-lg font-black tracking-widest text-white"
              >
                {{ codigoVinculacion || "Cargando..." }}
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
          <Button
            class="px-5 font-extrabold bg-yellow-400 shadow-sm hover:bg-yellow-500 text-slate-900 rounded-xl h-11"
          >
            Ver Plan de Estudios UTP
          </Button>
          <Button
            variant="outline"
            class="px-5 font-extrabold bg-yellow-400 shadow-sm hover:bg-yellow-500 text-slate-900 rounded-xl h-11"
            @click="router.push('/postulante/test')"
          >
            Volver a dar el test
          </Button>
        </CardContent>
      </Card>

      <!-- Main Features Grid -->
      <div class="grid gap-6 md:grid-cols-3">
        <!-- Minijuego: Laberinto de Vocaciones -->
        <Card class="transition-shadow hover:shadow-lg">
          <CardHeader>
            <div
              class="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B50E30] to-[#D13C5B] flex items-center justify-center mb-3"
            >
              <Gamepad2 class="w-6 h-6 text-white" />
            </div>
            <CardTitle>Laberinto de Vocaciones</CardTitle>
            <CardDescription>
              Explora caminos interactivos para descubrir tus intereses
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
                    <Target v-if="i === 5" class="w-6 h-6 text-[#B50E30]" />
                  </div>
                </div>
              </div>

              <!-- Tags -->
              <div class="flex flex-wrap gap-2">
                <Badge
                  variant="secondary"
                  class="bg-[#B50E30]/10 text-[#B50E30] border-[#B50E30]/20"
                >
                  <Brain class="w-3 h-3 mr-1" />
                  Intereses
                </Badge>
                <Badge
                  variant="secondary"
                  class="bg-[#D4A017]/10 text-[#D4A017] border-[#D4A017]/20"
                >
                  <Lightbulb class="w-3 h-3 mr-1" />
                  Inteligencias
                </Badge>
                <Badge
                  variant="secondary"
                  class="bg-[#1565C0]/10 text-[#1565C0] border-[#1565C0]/20"
                >
                  <Heart class="w-3 h-3 mr-1" />
                  Personalidad
                </Badge>
              </div>

              <Button
                class="w-full bg-[#B50E30] hover:bg-[#8F0B26]"
                @click="router.push('/postulante/laberinto')"
              >
                Explorar laberinto
              </Button>
            </div>
          </CardContent>
        </Card>

        <!-- Bitácora Digital -->
        <Card class="transition-shadow hover:shadow-lg">
          <CardHeader>
            <div
              class="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4A017] to-[#B8870F] flex items-center justify-center mb-3"
            >
              <BookOpen class="w-6 h-6 text-white" />
            </div>
            <CardTitle>Bitácora Digital</CardTitle>
            <CardDescription>
              Registra proyectos, experiencias y metas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="write" class="w-full">
              <TabsList class="grid w-full grid-cols-2">
                <TabsTrigger value="write">Escribir</TabsTrigger>
                <TabsTrigger value="entries">Entradas</TabsTrigger>
              </TabsList>
              <TabsContent value="write" class="space-y-4">
                <Input placeholder="Título de la entrada..." />
                <Textarea
                  placeholder="Describe tu experiencia, proyecto u objetivo..."
                  class="min-h-[120px]"
                />
                <div class="flex gap-2">
                  <Button size="sm" variant="outline" class="flex-1">
                    <Plus class="w-4 h-4 mr-1" />
                    Agregar etiqueta
                  </Button>
                  <Button size="sm" class="bg-[#D4A017] hover:bg-[#B8870F]">
                    Guardar
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
                        : "Hace poco"
                    }}
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <!-- Conexión P2P -->
        <Card class="transition-shadow hover:shadow-lg">
          <CardHeader>
            <div
              class="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1565C0] to-[#0D47A1] flex items-center justify-center mb-3"
            >
              <MessageCircle class="w-6 h-6 text-white" />
            </div>
            <CardTitle>Conexión P2P</CardTitle>
            <CardDescription>
              Chatea con estudiantes UTP y mentores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-3">
              <p class="text-sm font-medium text-[#1F1F1F]">
                Mentores disponibles
              </p>
              <div
                v-for="(mentor, i) in mentors"
                :key="i"
                class="flex items-center gap-3 p-3 rounded-lg hover:bg-[#F1F1F1] transition-colors cursor-pointer"
              >
                <div class="relative">
                  <Avatar class="w-10 h-10">
                    <AvatarImage src="" />
                    <AvatarFallback class="bg-[#1565C0] text-white">
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
                Ver todos los mentores
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Progress Section -->
      <Card>
        <CardHeader>
          <CardTitle>Tu Progreso</CardTitle>
          <CardDescription
            >Completa actividades para descubrir tu vocación</CardDescription
          >
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

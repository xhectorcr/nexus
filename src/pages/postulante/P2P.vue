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
import { useAuth } from "@/lib/auth";
import {
  BookOpen,
  Brain,
  Gamepad2,
  Home,
  MessageCircle,
  MessageSquare,
  Search,
  Send,
  User,
  Users,
} from "lucide-vue-next";
import { computed, markRaw, ref } from "vue";
import { useI18n } from "vue-i18n";

const auth = useAuth();
const { t } = useI18n();

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

const activeTab = ref<"estudiantes" | "mentores">("estudiantes");
const searchQuery = ref("");
const chatMessage = ref("");

const currentChat = ref<any>(null);

const students = [
  {
    id: 1,
    name: "María Fernanda",
    carrera: "Ingeniería de Sistemas",
    online: true,
    messages: [
      { sender: "other", text: "¡Hola! Vi que te interesa la misma carrera." },
    ],
  },
  {
    id: 2,
    name: "Diego López",
    carrera: "Administración",
    online: false,
    messages: [{ sender: "other", text: "¿Ya hiciste el test vocacional?" }],
  },
  {
    id: 3,
    name: "Lucía Pérez",
    carrera: "Ingeniería de Software",
    online: true,
    messages: [],
  },
];

const mentors = [
  {
    id: 4,
    name: "Alejandro Lastra",
    especialidad: "Arquitectura Cloud",
    empresa: "TechCorp",
    online: true,
    messages: [
      {
        sender: "other",
        text: "Hola, soy Alejandro. ¿En qué te puedo orientar hoy?",
      },
    ],
  },
  {
    id: 5,
    name: "Valeria Gómez",
    especialidad: "Gestión de Proyectos",
    empresa: "Innovate Solutions",
    online: false,
    messages: [],
  },
];

const filteredContacts = computed(() => {
  const list = activeTab.value === "estudiantes" ? students : mentors;
  return list.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
  );
});

const selectChat = (contact: any) => {
  currentChat.value = contact;
};

const sendMessage = () => {
  if (!chatMessage.value.trim() || !currentChat.value) return;
  currentChat.value.messages.push({ sender: "me", text: chatMessage.value });
  chatMessage.value = "";
};
</script>

<template>
  <DashboardLayout
    :sidebarItems="sidebarItems"
    title="Conexión P2P"
    subtitle="Conecta y chatea con estudiantes y mentores de tu interés."
    :breadcrumbs="[
      { label: 'Inicio', href: '/postulante' },
      { label: 'Conexión P2P' },
    ]"
    moduleColor="#082065"
  >
    <div
      class="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-200px)] min-h-[600px]"
    >
      <!-- Panel lateral de contactos -->
      <Card class="flex flex-col border-0 shadow-lg lg:col-span-4">
        <CardHeader class="pb-4 border-b bg-slate-50">
          <div class="flex items-center gap-3 mb-4">
            <div
              class="w-10 h-10 rounded-xl bg-[#082065] flex items-center justify-center text-white"
            >
              <Users class="w-5 h-5" />
            </div>
            <div>
              <CardTitle class="text-lg">Comunidad</CardTitle>
              <CardDescription>Encuentra con quién hablar</CardDescription>
            </div>
          </div>
          <div class="flex gap-2 p-1 bg-gray-100 rounded-lg">
            <button
              @click="
                activeTab = 'estudiantes';
                currentChat = null;
              "
              :class="[
                'flex-1 py-1.5 text-sm font-semibold rounded-md transition-colors',
                activeTab === 'estudiantes'
                  ? 'bg-white shadow-sm text-[#082065]'
                  : 'text-gray-500 hover:text-gray-700',
              ]"
            >
              Estudiantes
            </button>
            <button
              @click="
                activeTab = 'mentores';
                currentChat = null;
              "
              :class="[
                'flex-1 py-1.5 text-sm font-semibold rounded-md transition-colors',
                activeTab === 'mentores'
                  ? 'bg-white shadow-sm text-[#082065]'
                  : 'text-gray-500 hover:text-gray-700',
              ]"
            >
              Mentores
            </button>
          </div>
          <div class="relative mt-4">
            <Search
              class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            />
            <Input
              v-model="searchQuery"
              placeholder="Buscar contacto..."
              class="pl-9 bg-white"
            />
          </div>
        </CardHeader>

        <CardContent class="flex-1 p-0 overflow-y-auto">
          <div
            v-if="filteredContacts.length === 0"
            class="p-8 text-center text-gray-500"
          >
            No se encontraron contactos.
          </div>
          <div v-else class="divide-y divide-gray-100">
            <div
              v-for="contact in filteredContacts"
              :key="contact.id"
              @click="selectChat(contact)"
              class="flex items-center gap-3 p-4 transition-colors cursor-pointer hover:bg-gray-50"
              :class="{
                'bg-blue-50/50 border-l-4 border-[#082065]':
                  currentChat?.id === contact.id,
              }"
            >
              <div class="relative">
                <div
                  class="flex items-center justify-center w-12 h-12 text-gray-500 bg-gray-200 rounded-full"
                >
                  <User class="w-6 h-6" />
                </div>
                <div
                  class="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white"
                  :class="contact.online ? 'bg-green-500' : 'bg-gray-400'"
                ></div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-bold text-gray-900 truncate">
                  {{ contact.name }}
                </p>
                <p class="text-xs text-gray-500 truncate">
                  {{ contact.carrera || contact.especialidad }}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Panel de Chat -->
      <Card class="flex flex-col border-0 shadow-lg lg:col-span-8">
        <template v-if="currentChat">
          <!-- Chat Header -->
          <CardHeader
            class="flex flex-row items-center justify-between py-4 bg-white border-b"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-full bg-[#082065] flex items-center justify-center text-white font-bold"
              >
                {{ currentChat.name.charAt(0) }}
              </div>
              <div>
                <CardTitle class="text-base">{{ currentChat.name }}</CardTitle>
                <div class="flex items-center gap-1.5 mt-0.5">
                  <div
                    class="w-2 h-2 rounded-full"
                    :class="
                      currentChat.online ? 'bg-green-500' : 'bg-gray-400'
                    "
                  ></div>
                  <span class="text-xs font-medium text-gray-500">
                    {{ currentChat.online ? "En línea" : "Desconectado" }}
                  </span>
                </div>
              </div>
            </div>
            <Badge
              variant="secondary"
              class="bg-blue-50 text-[#082065] capitalize"
            >
              {{ currentChat.carrera ? "Estudiante" : "Mentor" }}
            </Badge>
          </CardHeader>

          <!-- Mensajes -->
          <CardContent
            class="flex flex-col flex-1 gap-4 p-4 overflow-y-auto bg-gray-50/50"
          >
            <div class="my-4 text-center">
              <Badge
                variant="outline"
                class="text-xs text-gray-400 border-gray-200"
                >Hoy</Badge
              >
            </div>

            <div
              v-if="currentChat.messages.length === 0"
              class="flex flex-col items-center justify-center flex-1 p-8 text-center"
            >
              <MessageSquare class="w-12 h-12 mb-3 text-gray-300" />
              <p class="font-medium text-gray-500">No hay mensajes aún.</p>
              <p class="mt-1 text-sm text-gray-400">
                ¡Escribe algo para romper el hielo!
              </p>
            </div>

            <div
              v-for="(msg, i) in currentChat.messages"
              :key="i"
              class="flex w-full"
              :class="msg.sender === 'me' ? 'justify-end' : 'justify-start'"
            >
              <div
                class="max-w-[70%] px-4 py-2.5 rounded-2xl"
                :class="
                  msg.sender === 'me'
                    ? 'bg-[#082065] text-white rounded-tr-sm'
                    : 'bg-white border text-gray-800 rounded-tl-sm shadow-sm'
                "
              >
                <p class="text-sm">{{ msg.text }}</p>
              </div>
            </div>
          </CardContent>

          <!-- Input Area -->
          <div class="p-4 bg-white border-t">
            <form @submit.prevent="sendMessage" class="flex gap-2">
              <Input
                v-model="chatMessage"
                placeholder="Escribe un mensaje..."
                class="flex-1 bg-gray-50 focus-visible:ring-[#082065]"
              />
              <Button
                type="submit"
                :disabled="!chatMessage.trim()"
                class="bg-[#082065] hover:bg-[#0D47A1]"
              >
                <Send class="w-4 h-4" />
              </Button>
            </form>
          </div>
        </template>

        <template v-else>
          <div
            class="flex flex-col items-center justify-center flex-1 p-8 text-center bg-gray-50 rounded-xl"
          >
            <div
              class="flex items-center justify-center mb-4 bg-blue-100 rounded-full w-20 h-20"
            >
              <MessageCircle class="w-10 h-10 text-[#082065]" />
            </div>
            <h3 class="mb-2 text-xl font-bold text-gray-800">Conexión P2P</h3>
            <p class="max-w-md mx-auto text-gray-500">
              Selecciona un estudiante o mentor de la lista lateral para
              comenzar a chatear. Intercambia experiencias, pide consejos y
              resuelve tus dudas vocacionales.
            </p>
          </div>
        </template>
      </Card>
    </div>
  </DashboardLayout>
</template>

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
import { computed, markRaw, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { api } from "@/lib/api";

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
  {
    icon: markRaw(MessageSquare),
    label: "Foro UTP+",
    href: "/postulante/foro",
  },
]);

const activeTab = ref<"disponibles" | "mis_conexiones">("disponibles");
const searchQuery = ref("");
const chatMessage = ref("");
const currentChat = ref<any>(null);

const disponibles = ref<any[]>([]);
const conexiones = ref<any[]>([]);
const isLoading = ref(true);

let pollingInterval: any = null;

const fetchDisponibles = async () => {
  try {
    const res = await api.get("/api/conexiones/disponibles");
    disponibles.value = res.data?.data || [];
  } catch (error) {
    console.error("Error fetching disponibles", error);
  }
};

const fetchMisConexiones = async () => {
  if (!auth.state.user?.id) return;
  try {
    const res = await api.get(`/api/conexiones/usuario/${auth.state.user.id}`);
    conexiones.value = res.data?.data || [];
  } catch (error) {
    console.error("Error fetching conexiones", error);
  }
};

const loadMessages = async () => {
  if (!currentChat.value?.id) return;
  try {
    const res = await api.get(`/api/v1/conexiones/${currentChat.value.id}/mensajes`);
    currentChat.value.messages = res.data || [];
  } catch (error) {
    console.error("Error fetching messages", error);
  }
};

onMounted(async () => {
  await Promise.all([fetchDisponibles(), fetchMisConexiones()]);
  isLoading.value = false;

  // Emulate realtime chat
  pollingInterval = setInterval(() => {
    if (currentChat.value && currentChat.value.estado === 'ACEPTADA') {
      loadMessages();
    }
  }, 3000);
});

const filteredContacts = computed(() => {
  if (activeTab.value === "disponibles") {
    return disponibles.value.filter((c) =>
      c.nombreCompleto.toLowerCase().includes(searchQuery.value.toLowerCase()),
    );
  } else {
    // Para 'mis_conexiones', mostrar al otro usuario
    return conexiones.value.map(c => {
      const otro = getOtroUsuario(c);
      return { ...c, nombreCompleto: otro.nombreCompleto, carrera: otro.carrera || 'Estudiante UTP', isConexion: true };
    }).filter((c) => {
      return c.nombreCompleto.toLowerCase().includes(searchQuery.value.toLowerCase());
    });
  }
});

const getOtroUsuario = (conexion: any) => {
  const yoId = auth.state.user?.id;
  if (conexion.solicitante?.id === yoId) return { ...conexion.receptor, nombreCompleto: (conexion.receptor?.nombre || '') + ' ' + (conexion.receptor?.apellido || '') };
  return { ...conexion.solicitante, nombreCompleto: (conexion.solicitante?.nombre || '') + ' ' + (conexion.solicitante?.apellido || '') };
};

const selectChat = async (contact: any) => {
  if (activeTab.value === "disponibles") {
    currentChat.value = { ...contact, isNewRequest: true };
  } else {
    currentChat.value = { ...contact, isNewRequest: false, messages: [] };
    await loadMessages();
  }
};

const sendConnectionRequest = async () => {
  if (!currentChat.value) return;
  try {
    await api.post("/api/conexiones", {
      receptorId: currentChat.value.idUsuario
    });
    alert("Solicitud de mentoría enviada con éxito.");
    currentChat.value = null;
    await fetchMisConexiones();
    activeTab.value = "mis_conexiones";
  } catch (error) {
    console.error("Error sending request", error);
    alert("Hubo un error al enviar la solicitud.");
  }
};

const sendMessage = async () => {
  if (!chatMessage.value.trim() || !currentChat.value) return;
  
  try {
    await api.post(`/api/v1/conexiones/${currentChat.value.id}/mensajes`, {
      contenido: chatMessage.value
    });
    chatMessage.value = "";
    await loadMessages();
  } catch (error) {
    console.error("Error sending message", error);
  }
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
                activeTab = 'disponibles';
                currentChat = null;
              "
              :class="[
                'flex-1 py-1.5 text-sm font-semibold rounded-md transition-colors',
                activeTab === 'disponibles'
                  ? 'bg-white shadow-sm text-[#082065]'
                  : 'text-gray-500 hover:text-gray-700',
              ]"
            >
              Comunidad
            </button>
            <button
              @click="
                activeTab = 'mis_conexiones';
                currentChat = null;
              "
              :class="[
                'flex-1 py-1.5 text-sm font-semibold rounded-md transition-colors',
                activeTab === 'mis_conexiones'
                  ? 'bg-white shadow-sm text-[#082065]'
                  : 'text-gray-500 hover:text-gray-700',
              ]"
            >
              Mis Conexiones
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
                  currentChat && ((activeTab === 'disponibles' && currentChat.idUsuario === contact.idUsuario) || (activeTab === 'mis_conexiones' && currentChat.id === contact.id)),
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
                  {{ contact.nombreCompleto }}
                </p>
                <p class="text-xs text-gray-500 truncate">
                  {{ activeTab === 'disponibles' ? contact.carrera : 'Conexión P2P' }}
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
                {{ currentChat.nombreCompleto ? currentChat.nombreCompleto.charAt(0) : 'U' }}
              </div>
              <div>
                <CardTitle class="text-base">{{ currentChat.nombreCompleto }}</CardTitle>
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
            <div v-if="currentChat.isNewRequest" class="flex flex-col items-center justify-center flex-1">
              <MessageSquare class="w-12 h-12 mb-3 text-gray-300" />
              <p class="font-medium text-gray-500 mb-4">¿Te gustaría conectar con {{ currentChat.nombreCompleto }}?</p>
              <Button @click="sendConnectionRequest" class="bg-[#082065] text-white">Solicitar Conexión P2P</Button>
            </div>
            
            <div v-else-if="currentChat.estado === 'PENDIENTE'" class="flex flex-col items-center justify-center flex-1">
              <MessageSquare class="w-12 h-12 mb-3 text-gray-300" />
              <p class="font-medium text-gray-500">Solicitud Pendiente</p>
              <p class="mt-1 text-sm text-gray-400">
                Esperando a que {{ currentChat.nombreCompleto }} acepte tu solicitud.
              </p>
            </div>
            
            <template v-else>
              <div class="my-4 text-center">
                <Badge
                  variant="outline"
                  class="text-xs text-gray-400 border-gray-200"
                  >Hoy</Badge
                >
              </div>

              <div
                v-if="!currentChat.messages || currentChat.messages.length === 0"
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
                :class="msg.remitenteId === auth.state.user?.id ? 'justify-end' : 'justify-start'"
              >
                <div
                  class="max-w-[70%] px-4 py-2.5 rounded-2xl"
                  :class="
                    msg.remitenteId === auth.state.user?.id
                      ? 'bg-[#082065] text-white rounded-tr-sm'
                      : 'bg-white border text-gray-800 rounded-tl-sm shadow-sm'
                  "
                >
                  <p class="text-sm">{{ msg.contenido }}</p>
                </div>
              </div>
            </template>
          </CardContent>

          <!-- Input Area -->
          <div v-if="!currentChat.isNewRequest && currentChat.estado === 'ACEPTADA'" class="p-4 bg-white border-t">
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

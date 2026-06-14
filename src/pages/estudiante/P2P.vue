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
  { icon: markRaw(Home), label: t("nav.home"), href: "/estudiante" },
  {
    icon: markRaw(MapIcon),
    label: t("nav.learning_path"),
    href: "/estudiante/ruta",
  },
  {
    icon: markRaw(MessageCircle),
    label: "Conexión P2P",
    href: "/estudiante/p2p",
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

  pollingInterval = setInterval(() => {
    if (currentChat.value && currentChat.value.estado === 'ACEPTADA') {
      loadMessages();
    }
  }, 3000);
});

const filteredContacts = computed(() => {
  if (activeTab.value === "disponibles") {
    return disponibles.value.filter((c) =>
      c.nombreCompleto.toLowerCase().includes(searchQuery.value.toLowerCase()) && c.idUsuario !== auth.state.user?.id
    );
  } else {
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
    alert("Solicitud de conexión enviada con éxito.");
    currentChat.value = null;
    await fetchMisConexiones();
    activeTab.value = "mis_conexiones";
  } catch (error) {
    console.error("Error sending request", error);
    alert("Hubo un error al enviar la solicitud.");
  }
};

const changeConnectionStatus = async (status: string) => {
  if (!currentChat.value) return;
  try {
    await api.patch(`/api/conexiones/${currentChat.value.id}/estado`, {
      estado: status
    });
    alert(`Conexión ${status.toLowerCase()} con éxito.`);
    await fetchMisConexiones();
    currentChat.value.estado = status;
    if(status === 'ACEPTADA') {
        await loadMessages();
    }
  } catch (error) {
    console.error("Error updating connection", error);
    alert("Hubo un error al actualizar la conexión.");
  }
}

const sendMessage = async () => {
  if (!chatMessage.value.trim() || !currentChat.value) return;
  
  try {
    await api.post(`/api/v1/conexiones/${currentChat.value.id}/mensajes`, {
      contenido: chatMessage.value,
      remitenteId: auth.state.user?.id,
      conexionId: currentChat.value.id
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
    subtitle="Conecta y chatea con postulantes y otros estudiantes."
    :breadcrumbs="[
      { label: 'Inicio', href: '/estudiante' },
      { label: 'Conexión P2P' },
    ]"
    moduleColor="#B50E30"
  >
    <div
      class="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-200px)] min-h-[600px]"
    >
      <Card class="flex flex-col border-0 shadow-lg lg:col-span-4">
        <CardHeader class="pb-4 border-b bg-slate-50">
          <div class="flex items-center gap-3 mb-4">
            <div
              class="w-10 h-10 rounded-xl bg-[#B50E30] flex items-center justify-center text-white"
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
                  ? 'bg-white shadow-sm text-[#B50E30]'
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
                  ? 'bg-white shadow-sm text-[#B50E30]'
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
                'bg-red-50/50 border-l-4 border-[#B50E30]':
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
                <p class="font-bold text-gray-900 truncate flex items-center gap-2">
                  {{ contact.nombreCompleto }}
                  <span v-if="contact.estado === 'PENDIENTE' && contact.receptor?.id === auth.state.user?.id" class="w-2 h-2 bg-red-500 rounded-full"></span>
                </p>
                <p class="text-xs text-gray-500 truncate">
                  {{ activeTab === 'disponibles' ? contact.carrera : (contact.estado === 'PENDIENTE' ? 'Solicitud pendiente' : 'Conexión P2P') }}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="flex flex-col border-0 shadow-lg lg:col-span-8">
        <template v-if="currentChat">
          <CardHeader
            class="flex flex-row items-center justify-between py-4 bg-white border-b"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-full bg-[#B50E30] flex items-center justify-center text-white font-bold"
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
          </CardHeader>

          <CardContent
            class="flex flex-col flex-1 gap-4 p-4 overflow-y-auto bg-gray-50/50"
          >
            <div v-if="currentChat.isNewRequest" class="flex flex-col items-center justify-center flex-1">
              <MessageSquare class="w-12 h-12 mb-3 text-gray-300" />
              <p class="font-medium text-gray-500 mb-4">¿Te gustaría conectar con {{ currentChat.nombreCompleto }}?</p>
              <Button @click="sendConnectionRequest" class="bg-[#B50E30] text-white">Solicitar Conexión P2P</Button>
            </div>
            
            <div v-else-if="currentChat.estado === 'PENDIENTE' && currentChat.receptor?.id === auth.state.user?.id" class="flex flex-col items-center justify-center flex-1">
              <MessageSquare class="w-12 h-12 mb-3 text-[#B50E30]" />
              <p class="font-bold text-gray-800 text-lg">Nueva Solicitud P2P</p>
              <p class="mt-1 text-sm text-gray-500 mb-6 text-center max-w-sm">
                {{ currentChat.nombreCompleto }} quiere conectar contigo para intercambiar conocimientos.
              </p>
              <div class="flex gap-4">
                  <Button @click="changeConnectionStatus('RECHAZADA')" variant="outline" class="text-gray-500">Rechazar</Button>
                  <Button @click="changeConnectionStatus('ACEPTADA')" class="bg-[#B50E30] text-white">Aceptar Conexión</Button>
              </div>
            </div>

            <div v-else-if="currentChat.estado === 'PENDIENTE'" class="flex flex-col items-center justify-center flex-1">
              <MessageSquare class="w-12 h-12 mb-3 text-gray-300" />
              <p class="font-medium text-gray-500">Solicitud Pendiente</p>
              <p class="mt-1 text-sm text-gray-400">
                Esperando a que {{ currentChat.nombreCompleto }} acepte tu solicitud.
              </p>
            </div>
            
            <template v-else-if="currentChat.estado === 'ACEPTADA'">
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
                      ? 'bg-[#B50E30] text-white rounded-tr-sm'
                      : 'bg-white border text-gray-800 rounded-tl-sm shadow-sm'
                  "
                >
                  <p class="text-sm">{{ msg.contenido }}</p>
                </div>
              </div>
            </template>
          </CardContent>

          <div v-if="!currentChat.isNewRequest && currentChat.estado === 'ACEPTADA'" class="p-4 bg-white border-t">
            <form @submit.prevent="sendMessage" class="flex gap-2">
              <Input
                v-model="chatMessage"
                placeholder="Escribe un mensaje..."
                class="flex-1 bg-gray-50 focus-visible:ring-[#B50E30]"
              />
              <Button
                type="submit"
                :disabled="!chatMessage.trim()"
                class="bg-[#B50E30] hover:bg-red-800"
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
              class="flex items-center justify-center mb-4 bg-red-100 rounded-full w-20 h-20"
            >
              <MessageCircle class="w-10 h-10 text-[#B50E30]" />
            </div>
            <h3 class="mb-2 text-xl font-bold text-gray-800">Conexión P2P</h3>
            <p class="max-w-md mx-auto text-gray-500">
              Selecciona a un compañero de la lista lateral para
              comenzar a chatear o aprobar su solicitud.
            </p>
          </div>
        </template>
      </Card>
    </div>
  </DashboardLayout>
</template>

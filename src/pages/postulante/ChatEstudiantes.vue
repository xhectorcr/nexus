<script setup lang="ts">
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import {
  Brain,
  Home,
  MessageSquare,
  MoreVertical,
  Paperclip,
  Search,
  Send,
  Smile,
} from "lucide-vue-next";
import { computed, markRaw, nextTick, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const auth = useAuth();

const sidebarItems = computed(() => [
  {
    icon: markRaw(Home),
    label: t("nav.home") || "Inicio",
    href: "/postulante",
  },
  {
    icon: markRaw(Brain),
    label: t("nav.vocational_tests") || "Test Vocacional",
    href: "/postulante/test",
  },
]);

const postulanteIdRef = ref<number>(1);
const contacts = ref<any[]>([]);
const activeContact = ref<any>(null);
const messagesMap = ref<Record<number, any[]>>({});
const isLoading = ref(true);

const initializeChat = async () => {
  const userId = auth.state.user?.id || 1;
  try {
    const profRes = await api.get(`/api/postulantes/by-usuario/${userId}`);
    if (profRes.data?.data?.id) {
      postulanteIdRef.value = profRes.data.data.id;
    }
  } catch (error) {
    console.warn("Usando fallback ID para postulante");
  }
  await fetchMentors();
};

const fetchMentors = async () => {
  try {
    const conexionesRes = await api.get(
      `/api/conexiones/postulante/${postulanteIdRef.value}`,
    );
    const conexiones = conexionesRes.data?.data || [];

    contacts.value = conexiones.map((con: any) => ({
      id: con.id,
      estudianteId: con.estudianteId,
      name:
        con.estudianteId === 2
          ? "Alejandro Lastra"
          : `Estudiante #${con.estudianteId}`,
      career: "Ingeniería de Sistemas",
      online: con.estado === "ACTIVA",
      unread: 0,
      avatar: con.estudianteId === 2 ? "AL" : `E${con.estudianteId}`,
      time: "Reciente",
    }));

    if (contacts.value.length > 0) {
      activeContact.value = contacts.value[0];
      await fetchMessages(activeContact.value.id);
    }
  } catch (error) {
    console.error("Error fetching mentors:", error);
  } finally {
    isLoading.value = false;
  }
};

const fetchMessages = async (conexionId: number) => {
  try {
    const res = await api.get(`/api/v1/conexiones/${conexionId}/mensajes`);
    const msgs = res.data || [];
    
    // Transformar al formato de la UI
    messagesMap.value[conexionId] = msgs.map((m: any) => ({
      id: m.id,
      senderId: m.remitenteId === postulanteIdRef.value ? "me" : m.remitenteId,
      text: m.contenido,
      time: m.fechaEnvio 
        ? new Date(m.fechaEnvio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));
    scrollToBottom();
  } catch (error) {
    console.error("Error fetching messages:", error);
  }
};

const currentMessages = computed(
  () => (activeContact.value ? messagesMap.value[activeContact.value.id] || [] : []),
);

const newMessage = ref("");
const messagesContainer = ref<HTMLElement | null>(null);

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

const sendMessage = async () => {
  const text = newMessage.value.trim();
  if (!text || !activeContact.value) return;

  const conexionId = activeContact.value.id;
  const tempId = Date.now();

  if (!messagesMap.value[conexionId]) {
    messagesMap.value[conexionId] = [];
  }

  // Optimistic UI update
  messagesMap.value[conexionId].push({
    id: tempId,
    senderId: "me",
    text: text,
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  });

  newMessage.value = "";
  scrollToBottom();

  try {
    const payload = {
      conexionId: conexionId,
      remitenteId: postulanteIdRef.value,
      contenido: text,
    };
    
    await api.post(`/api/v1/conexiones/${conexionId}/mensajes`, payload);
    // Refresh to get actual DB generated timestamp and ID if needed, 
    // or we just trust our optimistic update to keep the UI fast.
  } catch (error) {
    console.error("Error enviando el mensaje", error);
    // Rollback the optimistic message
    messagesMap.value[conexionId] = messagesMap.value[conexionId].filter((m) => m.id !== tempId);
  }
};

const selectContact = async (contact: any) => {
  activeContact.value = contact;
  contact.unread = 0;
  if (!messagesMap.value[contact.id]) {
    await fetchMessages(contact.id);
  } else {
    scrollToBottom();
  }
};

const handleEnter = (e: KeyboardEvent) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
};

onMounted(() => {
  initializeChat();
});
</script>

<template>
  <DashboardLayout
    :sidebarItems="sidebarItems"
    :title="$t('postulante.chat_students') || 'Chatear con estudiantes'"
    :breadcrumbs="[
      { label: $t('nav.home') || 'Inicio', href: '/postulante' },
      { label: 'Chat' },
    ]"
    moduleColor="#082065"
  >
    <Card
      class="w-full h-[calc(100vh-12rem)] min-h-[600px] flex flex-col overflow-hidden border-0 shadow-lg rounded-2xl"
    >
      <div class="flex flex-1 overflow-hidden bg-white/50 backdrop-blur-sm">
        <!-- Sidebar (Contact List) -->
        <div
          class="flex flex-col hidden w-full border-r md:w-80 border-slate-200 bg-white/80 md:flex shrink-0"
        >
          <div class="flex flex-col gap-4 p-4 border-b border-slate-200">
            <h2
              class="flex items-center gap-2 text-lg font-bold text-slate-800"
            >
              <MessageSquare class="w-5 h-5 text-[#082065]" />
              Comunidad
            </h2>
            <div class="relative">
              <Search
                class="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-slate-400"
              />
              <Input
                placeholder="Buscar estudiante..."
                class="h-10 pl-9 bg-slate-50 border-slate-200 focus-visible:ring-blue-600 rounded-xl"
              />
            </div>
          </div>

          <div class="flex-1 overflow-y-auto custom-scrollbar">
            <div v-if="isLoading" class="p-6 text-center text-slate-400 text-sm">
              Cargando conexiones...
            </div>
            <div v-else-if="contacts.length === 0" class="p-6 text-center text-slate-400 text-sm">
              Aún no tienes conexiones.
            </div>
            <div
              v-else
              v-for="contact in contacts"
              :key="contact.id"
              @click="selectContact(contact)"
              class="relative flex items-center gap-3 p-4 transition-all border-b cursor-pointer border-slate-100 hover:bg-slate-50"
              :class="{
                'bg-blue-50/50 hover:bg-blue-50/80':
                  activeContact?.id === contact.id,
              }"
            >
              <div
                v-if="activeContact?.id === contact.id"
                class="absolute left-0 top-0 bottom-0 w-1 bg-[#082065]"
              ></div>

              <div class="relative shrink-0">
                <Avatar class="w-12 h-12 border-2 border-white shadow-sm">
                  <AvatarFallback
                    class="bg-gradient-to-br from-[#082065] to-[#103080] text-white font-bold"
                    >{{ contact.avatar }}</AvatarFallback
                  >
                </Avatar>
                <div
                  v-if="contact.online"
                  class="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"
                ></div>
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex justify-between items-center mb-0.5">
                  <h3
                    class="text-sm font-bold truncate text-slate-800"
                    :class="{ 'text-[#082065]': contact.unread > 0 }"
                  >
                    {{ contact.name }}
                  </h3>
                  <span
                    class="text-[11px]"
                    :class="
                      contact.unread > 0
                        ? 'text-[#082065] font-bold'
                        : 'text-slate-400'
                    "
                    >{{ contact.time }}</span
                  >
                </div>
                <div class="flex items-center justify-between">
                  <p
                    class="text-xs truncate"
                    :class="
                      contact.unread > 0
                        ? 'text-slate-800 font-medium'
                        : 'text-slate-500'
                    "
                  >
                    {{ contact.career }}
                  </p>
                  <Badge
                    v-if="contact.unread > 0"
                    class="bg-[#082065] text-white px-1.5 py-0 min-w-[20px] flex justify-center text-[10px]"
                    >{{ contact.unread }}</Badge
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Area -->
        <div class="flex-1 flex flex-col bg-[#F8FAFC]">
          <template v-if="activeContact">
            <!-- Chat Header -->
            <div
              class="z-10 flex items-center justify-between h-16 px-4 border-b shadow-sm border-slate-200 bg-white/80 md:px-6 shrink-0"
            >
              <div class="flex items-center gap-3">
                <Avatar
                  class="w-10 h-10 border shadow-sm border-slate-200 shrink-0"
                >
                  <AvatarFallback
                    class="bg-gradient-to-br from-[#082065] to-[#103080] text-white font-bold"
                    >{{ activeContact.avatar }}</AvatarFallback
                  >
                </Avatar>
                <div>
                  <h3 class="text-sm font-bold leading-tight text-slate-800">
                    {{ activeContact.name }}
                  </h3>
                  <p
                    class="text-[11px] font-medium flex items-center gap-1.5 mt-0.5"
                    :class="
                      activeContact.online ? 'text-green-600' : 'text-slate-400'
                    "
                  >
                    <span
                      v-if="activeContact.online"
                      class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"
                    ></span>
                    {{ activeContact.online ? "En línea" : "Desconectado" }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-1 md:gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  class="text-slate-500 hover:text-[#082065] hover:bg-blue-50 rounded-full w-9 h-9"
                >
                  <MoreVertical class="w-4 h-4" />
                </Button>
              </div>
            </div>

            <!-- Messages Container -->
            <div
              class="flex-1 p-4 space-y-6 overflow-y-auto md:p-6 custom-scrollbar"
              ref="messagesContainer"
            >
              <div
                v-if="currentMessages.length === 0"
                class="flex flex-col items-center justify-center h-full gap-3 text-slate-400"
              >
                <div
                  class="flex items-center justify-center w-16 h-16 rounded-full bg-slate-100"
                >
                  <MessageSquare class="w-8 h-8 text-slate-300" />
                </div>
                <p class="text-sm font-medium">
                  Envía un mensaje para iniciar la conversación
                </p>
              </div>

              <template v-else>
                <div class="flex justify-center my-4">
                  <Badge
                    variant="outline"
                    class="bg-slate-50 text-slate-500 border-slate-200 text-[10px] font-medium px-3 py-1"
                  >
                    HOY
                  </Badge>
                </div>

                <div
                  v-for="msg in currentMessages"
                  :key="msg.id"
                  class="flex flex-col max-w-[85%] md:max-w-[70%]"
                  :class="
                    msg.senderId === 'me'
                      ? 'self-end items-end ml-auto'
                      : 'self-start items-start'
                  "
                >
                  <div
                    class="relative px-5 py-3 shadow-sm rounded-2xl group"
                    :class="
                      msg.senderId === 'me'
                        ? 'bg-gradient-to-br from-[#082065] to-[#103080] text-white rounded-tr-sm'
                        : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm'
                    "
                  >
                    <p
                      class="text-sm leading-relaxed break-words whitespace-pre-wrap"
                    >
                      {{ msg.text }}
                    </p>
                  </div>
                  <span
                    class="text-[10px] text-slate-400 mt-1.5 font-medium px-1 flex items-center gap-1"
                  >
                    {{ msg.time }}
                    <template v-if="msg.senderId === 'me'">
                      <span class="text-blue-500">✓✓</span>
                    </template>
                  </span>
                </div>
              </template>
            </div>

            <!-- Input Area -->
            <div
              class="p-3 border-t md:p-4 bg-white/80 border-slate-200 shrink-0"
            >
              <div
                class="flex items-end gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-200 focus-within:ring-2 focus-within:ring-[#082065]/20 focus-within:border-[#082065]/40 transition-all shadow-inner"
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  class="w-10 h-10 shrink-0 text-slate-400 hover:text-slate-600 rounded-xl"
                >
                  <Paperclip class="w-5 h-5" />
                </Button>
                <textarea
                  v-model="newMessage"
                  placeholder="Escribe un mensaje..."
                  class="flex-1 bg-transparent border-0 focus:ring-0 resize-none py-2.5 px-2 text-sm text-slate-700 max-h-32 min-h-[44px] custom-scrollbar outline-none"
                  rows="1"
                  @keydown="handleEnter"
                ></textarea>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  class="w-10 h-10 shrink-0 text-slate-400 hover:text-slate-600 rounded-xl"
                >
                  <Smile class="w-5 h-5" />
                </Button>
                <Button
                  @click="sendMessage"
                  size="icon"
                  class="shrink-0 bg-[#082065] hover:bg-[#103080] text-white rounded-xl h-10 w-10 shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                  :disabled="!newMessage.trim()"
                >
                  <Send class="w-4 h-4 ml-0.5" />
                </Button>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="flex flex-col items-center justify-center h-full gap-3 text-slate-400 p-6 text-center">
              <div
                class="flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 mb-2"
              >
                <MessageSquare class="w-10 h-10 text-slate-300" />
              </div>
              <h3 class="text-lg font-bold text-slate-600">Comunidad NEXUS</h3>
              <p class="text-sm">
                Selecciona una conexión en el panel izquierdo para comenzar a chatear.
              </p>
            </div>
          </template>
        </div>
      </div>
    </Card>
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

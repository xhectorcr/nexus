<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import { useAuth } from "@/lib/auth";
import { BookOpen, Brain, Gamepad2, Home, MessageCircle, MessageSquare } from "lucide-vue-next";
import { computed, markRaw } from "vue";
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
    <Card class="w-full">
      <CardHeader>
        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-[#082065] to-[#0D47A1] flex items-center justify-center mb-3">
          <MessageSquare class="w-6 h-6 text-white" />
        </div>
        <CardTitle>{{ $t('postulante.chat_students_title') || 'Comunidad Estudiantil' }}</CardTitle>
        <CardDescription>
          {{ $t('postulante.chat_students_desc') || 'Esta sección estará disponible próximamente para conectar y chatear con estudiantes de la universidad.' }}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="h-[300px] flex items-center justify-center border-2 border-dashed rounded-xl border-gray-200">
          <p class="font-medium text-gray-500">Próximamente...</p>
        </div>
      </CardContent>
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

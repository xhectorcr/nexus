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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { ArrowRight, BookOpen, Eye, Home, Map as MapIcon, Plus, MessageSquare } from "lucide-vue-next";
import { computed, markRaw, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

const auth = useAuth();
const { t } = useI18n();

const sidebarItems = computed(() => [
  { icon: markRaw(Home), label: t("nav.home") || "Inicio", href: "/estudiante" },
  {
    icon: markRaw(MapIcon),
    label: t("nav.learning_path") || "Ruta de Aprendizaje",
    href: "/estudiante/ruta",
  },
  {
    icon: markRaw(BookOpen),
    label: t("postulante.digital_log") || "Bitácora",
    href: "/estudiante/bitacora",
  },
  {
    icon: markRaw(MessageSquare),
    label: "Foro UTP+",
    href: "/estudiante/foro",
  },
]);

const entries = ref<any[]>([]);

const bitacoraForm = ref({
  titulo: "",
  descripcion: "",
  tipoEntrada: "EXPERIENCIA",
});
const bitacoraLoading = ref(false);
const bitacoraSubmitting = ref(false);

const fetchBitacora = async () => {
  bitacoraLoading.value = true;
  try {
    const userId = auth.state.user?.id || 1;
    const res = await api.get(`/api/bitacoras/postulante/${userId}`);
    entries.value = res.data?.data || res.data || [];
  } catch (error) {
    console.error("No se pudo obtener la bitácora desde la BD", error);
  } finally {
    bitacoraLoading.value = false;
  }
};

const saveBitacoraEntry = async () => {
  if (!bitacoraForm.value.titulo || !bitacoraForm.value.descripcion) return;
  bitacoraSubmitting.value = true;

  try {
    const userId = auth.state.user?.id || 1;
    const payload = {
      ...bitacoraForm.value,
      postulanteId: userId,
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

onMounted(() => {
  fetchBitacora();
});
</script>

<template>
  <DashboardLayout
    :sidebarItems="sidebarItems"
    :title="$t('postulante.digital_log') || 'Bitácora Digital'"
    :subtitle="$t('postulante.log_desc') || 'Registra tus reflexiones, descubrimientos y logros.'"
    :breadcrumbs="[
      { label: $t('nav.home') || 'Inicio', href: '/estudiante' },
      { label: $t('postulante.digital_log') || 'Bitácora' }
    ]"
    moduleColor="#B50E30"
  >
    <div class="space-y-6">
      <Card class="w-full border-t-4 border-t-[#B50E30] shadow-lg">
        <CardHeader class="pb-6 rounded-t-lg bg-slate-50/50">
          <div class="flex items-start justify-between">
            <div class="flex gap-4">
              <div
                class="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#B50E30] to-[#8F0B26] flex items-center justify-center shadow-md"
              >
                <BookOpen class="text-white w-7 h-7" />
              </div>
              <div>
                <CardTitle class="text-2xl">{{
                  $t("postulante.digital_log") || "Bitácora Digital"
                }}</CardTitle>
                <CardDescription class="mt-1 text-base text-gray-600">
                  Historial de tus entradas
                </CardDescription>
              </div>
            </div>
            <Badge
              variant="outline"
              class="bg-red-50 text-[#B50E30] border-red-200 px-3 py-1 text-sm hidden sm:inline-flex"
            >
              {{ entries.length }} entradas
            </Badge>
          </div>
        </CardHeader>
        <CardContent class="pt-6">
          <div class="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div
              class="p-5 space-y-5 bg-white border border-gray-100 shadow-sm lg:col-span-5 rounded-xl"
            >
              <h3
                class="flex items-center gap-2 text-lg font-bold text-gray-800"
              >
                <Plus class="w-5 h-5 text-[#B50E30]" />
                Nueva Entrada
              </h3>
              <div class="space-y-4">
                <div>
                  <label class="text-sm font-medium text-gray-700 mb-1.5 block"
                    >Título del avance / logro</label
                  >
                  <Input
                    v-model="bitacoraForm.titulo"
                    :placeholder="
                      $t('postulante.entry_title') ||
                      'Ej. Terminé mi primer test'
                    "
                    class="bg-gray-50 focus-visible:ring-[#B50E30]"
                  />
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-700 mb-1.5 block"
                    >Reflexión detallada</label
                  >
                  <Textarea
                    v-model="bitacoraForm.descripcion"
                    :placeholder="
                      $t('postulante.describe_experience') ||
                      'Me di cuenta de que disfruto mucho...'
                    "
                    class="min-h-[120px] bg-gray-50 focus-visible:ring-[#B50E30] resize-none"
                  />
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-700 mb-1.5 block"
                    >Tipo de registro</label
                  >
                  <div class="flex flex-wrap gap-2">
                    <button
                      v-for="tipo in ['EXPERIENCIA', 'REFLEXION', 'LOGRO']"
                      :key="tipo"
                      @click="bitacoraForm.tipoEntrada = tipo"
                      :class="[
                        'px-3 py-1.5 text-xs font-semibold rounded-full border transition-all',
                        bitacoraForm.tipoEntrada === tipo
                          ? 'bg-[#B50E30] text-white border-[#B50E30]'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300',
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
                  class="w-full bg-[#B50E30] hover:bg-[#8F0B26] mt-2 shadow-md"
                >
                  <span v-if="bitacoraSubmitting">Guardando...</span>
                  <span v-else class="flex items-center gap-2"
                    >Guardar registro <ArrowRight class="w-4 h-4"
                  /></span>
                </Button>
              </div>
            </div>

            <div class="lg:col-span-7">
              <h3
                class="flex items-center justify-between mb-4 text-lg font-bold text-gray-800"
              >
                <span>Historial de avances</span>
                <Button
                  variant="ghost"
                  size="sm"
                  @click="fetchBitacora"
                  :disabled="bitacoraLoading"
                  class="text-gray-500 hover:text-[#B50E30]"
                >
                  Actualizar
                </Button>
              </h3>
              <div v-if="bitacoraLoading" class="flex flex-col gap-3">
                <div
                  v-for="i in 3"
                  :key="i"
                  class="bg-gray-100 h-28 rounded-xl animate-pulse"
                ></div>
              </div>
              <div
                v-else-if="entries.length === 0"
                class="flex flex-col items-center justify-center p-10 text-center border border-gray-200 border-dashed bg-gray-50 rounded-xl"
              >
                <BookOpen class="w-12 h-12 mb-3 text-gray-300" />
                <p class="font-medium text-gray-500">
                  Aún no tienes entradas en tu bitácora.
                </p>
                <p class="mt-1 text-sm text-gray-400">
                  Registra tu primer avance usando el formulario.
                </p>
              </div>
              <div
                v-else
                class="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar"
              >
                <div
                  v-for="(entry, i) in entries"
                  :key="i"
                  class="relative flex flex-col gap-2 p-4 transition-all bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md group"
                >
                  <div class="flex items-start justify-between gap-4">
                    <div>
                      <div class="flex items-center gap-2 mb-1">
                        <Badge
                          variant="secondary"
                          class="bg-red-50 text-red-700 hover:bg-red-100 uppercase text-[10px] font-bold tracking-wider"
                        >
                          {{ entry.tipoEntrada || "ENTRADA" }}
                        </Badge>
                        <p class="text-xs text-[#5F6368]">
                          {{
                            entry.fecha
                              ? new Date(entry.fecha).toLocaleDateString()
                              : $t("postulante.recently")
                          }}
                        </p>
                      </div>
                      <p class="text-sm font-bold text-[#1F1F1F]">
                        {{ entry.titulo || entry }}
                      </p>
                    </div>
                    <Dialog v-if="entry.descripcion">
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          class="h-8 w-8 p-0 text-gray-400 hover:text-[#B50E30] transition-colors rounded-full"
                          :title="
                            $t('postulante.view_details') || 'Ver detalles'
                          "
                        >
                          <Eye class="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent class="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle class="flex items-center gap-2">
                            <Badge
                              variant="secondary"
                              class="bg-red-50 text-red-700 uppercase text-[10px] font-bold"
                            >
                              {{ entry.tipoEntrada || "ENTRADA" }}
                            </Badge>
                            <span class="truncate">{{
                              entry.titulo || "Entrada"
                            }}</span>
                          </DialogTitle>
                          <DialogDescription
                            class="pt-4 text-sm leading-relaxed text-left text-gray-700 whitespace-pre-wrap"
                          >
                            {{ entry.descripcion }}
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
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
  background-color: #e5e7eb;
  border-radius: 20px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #d1d5db;
}
</style>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import {
  BookOpen,
  BrainCircuit,
  Home,
  Save,
  User as UserIcon,
} from "lucide-vue-next";
import { computed, markRaw, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const auth = useAuth();
const router = useRouter();
const { t } = useI18n();

const role = computed(() => auth.state.user?.role || "estudiante");
const isStudent = computed(() => role.value === "estudiante");
const isPostulant = computed(() => role.value === "postulante");

const sidebarItems = computed(() => {
  if (isStudent.value) {
    return [
      { icon: markRaw(Home), label: t("nav.home"), href: "/estudiante" },
      {
        icon: markRaw(BookOpen),
        label: t("nav.learning_path"),
        href: "/estudiante/ruta",
      },
    ];
  } else if (isPostulant.value) {
    return [{ icon: markRaw(Home), label: t("nav.home"), href: "/postulante" }];
  }
  return [{ icon: markRaw(Home), label: t("nav.home"), href: "/" }];
});

// Data
const loading = ref(true);
const saving = ref(false);
const message = ref<{ type: "success" | "error"; text: string } | null>(null);

const carrerasList = ref<any[]>([]);

// Form models
const studentForm = ref({
  id: 0,
  carreraId: 1,
  ciclo: "1",
  testimonioAcademico: "",
});

const postulantForm = ref({
  id: 0,
  carrerasInteresIds: [] as number[],
});

const informeForm = ref({
  intereses: "",
  inteligenciasMultiples: "",
  inteligenciaEmocional: "",
  personalidad: "",
  razonamientoAbstracto: "",
  perseverancia: "",
});

const loadData = async () => {
  loading.value = true;
  try {
    // Cargar carreras
    const carrerasRes = await api.get("/api/carreras");
    carrerasList.value = carrerasRes.data.data || [];

    const userId = auth.state.user?.id;
    if (!userId) return;

    if (isStudent.value) {
      const perfilRes = await api.get(`/api/estudiantes/by-usuario/${userId}`);
      if (perfilRes.data && perfilRes.data.data) {
        const perfil = perfilRes.data.data;
        studentForm.value.id = perfil.id;
        studentForm.value.carreraId = perfil.carrera?.id || 1;
        studentForm.value.ciclo = perfil.ciclo || "1";
        studentForm.value.testimonioAcademico =
          perfil.testimonioAcademico || "";
      }
    } else if (isPostulant.value) {
      const perfilRes = await api.get(`/api/postulantes/by-usuario/${userId}`);
      if (perfilRes.data && perfilRes.data.data) {
        const perfil = perfilRes.data.data;
        postulantForm.value.id = perfil.id;
        postulantForm.value.carrerasInteresIds =
          perfil.carrerasInteres?.map((c: any) => c.id) || [];
      }
    }

    // Cargar informe vocacional
    const informeRes = await api.get(
      `/api/informes-vocacionales/by-usuario/${userId}`,
    );
    if (informeRes.data && informeRes.data.data) {
      const informe = informeRes.data.data;
      informeForm.value.intereses = informe.intereses || "";
      informeForm.value.inteligenciasMultiples =
        informe.inteligenciasMultiples || "";
      informeForm.value.inteligenciaEmocional =
        informe.inteligenciaEmocional || "";
      informeForm.value.personalidad = informe.personalidad || "";
      informeForm.value.razonamientoAbstracto =
        informe.razonamientoAbstracto || "";
      informeForm.value.perseverancia = informe.perseverancia || "";
    }
  } catch (err) {
    console.error("Error cargando perfil:", err);
  } finally {
    loading.value = false;
  }
};

const saveProfile = async () => {
  saving.value = true;
  message.value = null;
  const userId = auth.state.user?.id;

  try {
    if (isStudent.value) {
      const payload = {
        usuarioId: userId,
        carreraId: studentForm.value.carreraId,
        ciclo: studentForm.value.ciclo.toString(),
        testimonioAcademico: studentForm.value.testimonioAcademico || "",
      };
      await api.put(`/api/estudiantes/by-usuario/${userId}`, payload);
    } else if (isPostulant.value) {
      if (postulantForm.value.id) {
        const payload = {
          usuarioId: userId,
        };
        await api.put(`/api/postulantes/${postulantForm.value.id}`, payload);

        await api.put(
          `/api/postulantes/${postulantForm.value.id}/seleccionar-carreras`,
          {
            carreraIds: postulantForm.value.carrerasInteresIds,
          },
        );
      }
    }

    // Guardar informe vocacional
    await api.put(
      `/api/informes-vocacionales/by-usuario/${userId}`,
      informeForm.value,
    );

    await loadData(); // Recargar datos para asegurar sincronización con el backend

    message.value = {
      type: "success",
      text: "Datos actualizados exitosamente.",
    };

    setTimeout(() => {
      message.value = null;
    }, 3000);
  } catch (err) {
    console.error("Error guardando perfil:", err);
    message.value = {
      type: "error",
      text: "Hubo un error al actualizar los datos.",
    };
  } finally {
    saving.value = false;
  }
};

// Checkbox para postulant
const toggleCarreraInteres = (carreraId: number) => {
  const index = postulantForm.value.carrerasInteresIds.indexOf(carreraId);
  if (index === -1) {
    postulantForm.value.carrerasInteresIds.push(carreraId);
  } else {
    postulantForm.value.carrerasInteresIds.splice(index, 1);
  }
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <DashboardLayout
    :sidebarItems="sidebarItems"
    title="Configuración de Perfil"
    subtitle="Administra tu información académica"
    :breadcrumbs="[
      { label: $t('nav.home'), href: '/' },
      { label: 'Configuración' },
    ]"
    :moduleColor="isStudent ? '#B50E30' : '#082065'"
  >
    <div class="max-w-3xl mx-auto space-y-6">
      <div
        v-if="message"
        :class="`p-4 rounded-lg font-medium text-sm flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`"
      >
        <span
          class="w-2 h-2 rounded-full"
          :class="message.type === 'success' ? 'bg-green-600' : 'bg-red-600'"
        ></span>
        {{ message.text }}
      </div>

      <Card
        class="border-t-4 shadow-md"
        :style="{ borderTopColor: isStudent ? '#B50E30' : '#082065' }"
      >
        <CardHeader class="pb-6 rounded-t-lg bg-slate-50/50">
          <div class="flex items-center gap-4">
            <div
              class="flex items-center justify-center w-12 h-12 text-white shadow-sm rounded-xl"
              :style="{ background: isStudent ? '#B50E30' : '#082065' }"
            >
              <UserIcon class="w-6 h-6" />
            </div>
            <div>
              <CardTitle class="text-xl">Información Académica</CardTitle>
              <CardDescription class="mt-1 text-base">
                Completa estos datos para personalizar tu experiencia en NEXUS.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent class="pt-6">
          <div v-if="loading" class="space-y-4 animate-pulse">
            <div class="h-10 rounded-md bg-slate-100"></div>
            <div class="h-10 rounded-md bg-slate-100"></div>
          </div>

          <div v-else class="space-y-6">
            <!-- Estudiante Form -->
            <template v-if="isStudent">
              <div class="space-y-2">
                <label class="text-sm font-bold text-slate-700"
                  >Carrera Universitaria</label
                >
                <select
                  v-model="studentForm.carreraId"
                  class="flex w-full h-10 px-3 py-2 text-sm bg-white border rounded-md border-slate-200 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option
                    v-for="carrera in carrerasList"
                    :key="carrera.id"
                    :value="carrera.id"
                  >
                    {{ carrera.nombre }}
                  </option>
                </select>
              </div>

              <div class="space-y-2">
                <label class="text-sm font-bold text-slate-700"
                  >Ciclo Actual</label
                >
                <select
                  v-model="studentForm.ciclo"
                  class="flex w-full h-10 px-3 py-2 text-sm bg-white border rounded-md border-slate-200 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="1">1er Ciclo</option>
                  <option value="2">2do Ciclo</option>
                  <option value="3">3er Ciclo</option>
                  <option value="4">4to Ciclo</option>
                  <option value="5">5to Ciclo</option>
                  <option value="6">6to Ciclo</option>
                  <option value="7">7mo Ciclo</option>
                  <option value="8">8vo Ciclo</option>
                  <option value="9">9no Ciclo</option>
                  <option value="10">10mo Ciclo</option>
                </select>
              </div>
            </template>

            <!-- Postulante Form -->
            <template v-if="isPostulant">
              <div class="space-y-4">
                <label class="text-sm font-bold text-slate-700"
                  >Selecciona tus Carreras de Interés</label
                >
                <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div
                    v-for="carrera in carrerasList"
                    :key="carrera.id"
                    @click="toggleCarreraInteres(carrera.id)"
                    class="flex items-start p-4 space-x-3 space-y-0 transition-colors border rounded-md cursor-pointer"
                    :class="
                      postulantForm.carrerasInteresIds.includes(carrera.id)
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-white hover:bg-slate-50'
                    "
                  >
                    <div class="flex items-center h-5">
                      <input
                        type="checkbox"
                        :checked="
                          postulantForm.carrerasInteresIds.includes(carrera.id)
                        "
                        class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>
                    <div class="flex flex-col">
                      <span class="text-sm font-semibold text-slate-800">{{
                        carrera.nombre
                      }}</span>
                      <span class="mt-1 text-xs text-slate-500">{{
                        carrera.facultad
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </CardContent>
      </Card>

      <!-- Informe Vocacional Section -->
      <Card class="mt-6 border-t-4 shadow-md" style="border-top-color: #9c27b0">
        <CardHeader class="pb-6 rounded-t-lg bg-slate-50/50">
          <div class="flex items-center gap-4">
            <div
              class="flex items-center justify-center w-12 h-12 text-white shadow-sm rounded-xl"
              style="background: #9c27b0"
            >
              <BrainCircuit class="w-6 h-6" />
            </div>
            <div>
              <CardTitle class="text-xl">Informe Vocacional</CardTitle>
              <CardDescription class="mt-1 text-base">
                Datos de análisis vocacional que utilizará la IA para adaptar tu
                experiencia.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent class="pt-6">
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div class="space-y-2">
              <label class="text-sm font-bold text-slate-700">Intereses</label>
              <textarea
                v-model="informeForm.intereses"
                placeholder="Ej. Interés por la tecnología, los negocios..."
                class="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              ></textarea>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-bold text-slate-700"
                >Inteligencias múltiples</label
              >
              <textarea
                v-model="informeForm.inteligenciasMultiples"
                placeholder="Ej. Inteligencia lógico-matemática, espacial..."
                class="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              ></textarea>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-bold text-slate-700"
                >Inteligencia emocional</label
              >
              <textarea
                v-model="informeForm.inteligenciaEmocional"
                placeholder="Ej. Alta empatía, capacidad de resolución..."
                class="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              ></textarea>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-bold text-slate-700"
                >Personalidad</label
              >
              <textarea
                v-model="informeForm.personalidad"
                placeholder="Ej. Introvertido, analítico, detallista..."
                class="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              ></textarea>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-bold text-slate-700"
                >Razonamiento abstracto</label
              >
              <textarea
                v-model="informeForm.razonamientoAbstracto"
                placeholder="Ej. Capacidad superior al promedio..."
                class="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              ></textarea>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-bold text-slate-700"
                >Perseverancia</label
              >
              <textarea
                v-model="informeForm.perseverancia"
                placeholder="Ej. Muy constante en metas a largo plazo..."
                class="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              ></textarea>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end pt-6 mt-6 border-t border-slate-100">
            <Button
              @click="saveProfile"
              :disabled="saving"
              :style="{ backgroundColor: isStudent ? '#B50E30' : '#082065' }"
              class="text-white hover:opacity-90 min-w-[150px] font-bold shadow-md"
            >
              <span v-if="saving">Guardando...</span>
              <span v-else class="flex items-center gap-2"
                ><Save class="w-4 h-4" /> Guardar Cambios</span
              >
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
</template>

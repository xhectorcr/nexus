<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth";
import {
  ArrowRight,
  GraduationCap,
  KeyRound,
  Mail,
  UserCheck,
  UserPlus,
} from "lucide-vue-next";
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const auth = useAuth();

const initialRole =
  (route.query.role as "estudiante" | "familia" | "postulante") || "estudiante";
const activeRole = ref<"estudiante" | "familia" | "postulante">(initialRole);

const isRegister = ref(route.path === "/register");

watch(
  () => route.path,
  (newPath) => {
    isRegister.value = newPath === "/register";
    error.value = "";
  },
);

// Credentials
const email = ref("");
const password = ref("");
const fullName = ref("");
const confirmPassword = ref("");
const studentPin = ref("");

const error = ref("");
const isLoading = ref(false);

const updateDefaultCredentials = (
  role: "estudiante" | "familia" | "postulante",
) => {
  if (role === "estudiante") {
    email.value = "estudiante@nexus.edu.pe";
    password.value = "nexus2026";
  } else if (role === "familia") {
    email.value = "familia@nexus.edu.pe";
    password.value = "nexus2026";
  } else if (role === "postulante") {
    email.value = "postulante@nexus.edu.pe";
    password.value = "nexus2026";
  }
};

updateDefaultCredentials(initialRole);

const handleTabChange = (val: string | number) => {
  activeRole.value = val as "estudiante" | "familia" | "postulante";
  updateDefaultCredentials(activeRole.value);
  error.value = "";
};

const toggleMode = () => {
  const newPath = isRegister.value ? "/login" : "/register";
  router.replace({ path: newPath, query: route.query });
  error.value = "";
  fullName.value = "";
  confirmPassword.value = "";
  studentPin.value = "";
  updateDefaultCredentials(activeRole.value);
};

const handleLogin = async () => {
  if (!email.value || !password.value) {
    error.value = "Por favor, completa todos los campos.";
    return;
  }

  isLoading.value = true;
  error.value = "";

  try {
    await auth.login(activeRole.value, email.value, password.value);
    isLoading.value = false;

    const redirectPath =
      (route.query.redirect as string) || `/${activeRole.value}`;
    router.push(redirectPath);
  } catch (err: any) {
    isLoading.value = false;
    error.value = err.response?.data?.message || "Error de autenticación";
  }
};

const handleRegister = async () => {
  if (
    !fullName.value ||
    !email.value ||
    !password.value ||
    !confirmPassword.value
  ) {
    error.value = "Por favor, completa todos los campos.";
    return;
  }
  if (password.value !== confirmPassword.value) {
    error.value = "Las contraseñas no coinciden.";
    return;
  }

  isLoading.value = true;
  error.value = "";

  try {
    await auth.login(
      activeRole.value,
      email.value,
      password.value,
      fullName.value,
    );
    isLoading.value = false;

    if (activeRole.value === "familia" && studentPin.value) {
      auth.linkStudent(studentPin.value);
    }

    const redirectPath = `/${activeRole.value}`;
    router.push(redirectPath);
  } catch (err: any) {
    isLoading.value = false;
    error.value = err.response?.data?.message || "Error en el registro";
  }
};

const handleGoogleCallback = async (response: any) => {
  try {
    await auth.loginWithGoogle(response.credential, activeRole.value);

    const redirectPath =
      (route.query.redirect as string) || `/${activeRole.value}`;

    router.push(redirectPath);
  } catch (err: any) {
    error.value =
      err.response?.data?.message || "Error al iniciar sesión con Google";
  }
};
const themeColors = computed(() => {
  switch (activeRole.value) {
    case "estudiante":
      return {
        primary: "#B50E30",
        hover: "#8F0B26",
        bgLight: "bg-[#B50E30]/5",
        border: "border-[#B50E30]/20",
        gradient: "from-[#B50E30] to-[#8F0B26]",
        text: "text-[#B50E30]",
      };
    case "familia":
      return {
        primary: "#D4A017",
        hover: "#B8870F",
        bgLight: "bg-[#D4A017]/5",
        border: "border-[#D4A017]/20",
        gradient: "from-[#D4A017] to-[#B8870F]",
        text: "text-[#D4A017]",
      };
    case "postulante":
      return {
        primary: "#1565C0",
        hover: "#0D47A1",
        bgLight: "bg-[#1565C0]/5",
        border: "border-[#1565C0]/20",
        gradient: "from-[#1565C0] to-[#0D47A1]",
        text: "text-[#1565C0]",
      };
  }
});
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-[#FAF7F7] via-white to-[#F1F1F1] flex flex-col justify-center py-12 px-6 lg:px-8 relative overflow-hidden"
  >
    <!-- Background Decorative Elements -->
    <div
      class="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#B50E30]/5 blur-3xl pointer-events-none"
    />
    <div
      class="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-[#1565C0]/5 blur-3xl pointer-events-none"
    />

    <div class="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
      <!-- Logo and Title -->
      <div class="flex flex-col items-center mb-6">
        <router-link to="/" class="flex items-center gap-2 mb-2">
          <div
            class="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#B50E30] to-[#8F0B26] flex items-center justify-center shadow-lg shadow-red-500/10"
          >
            <GraduationCap class="text-white w-7 h-7" />
          </div>
          <span class="font-extrabold text-2xl text-[#1F1F1F] tracking-tight"
            >NEXUS</span
          >
        </router-link>
        <h2 class="text-center text-3xl font-extrabold text-[#1F1F1F]">
          {{ isRegister ? "Crear tu Cuenta" : "Iniciar Sesión" }}
        </h2>
        <p class="mt-2 text-center text-sm text-[#5F6368]">
          Accede a tu portal personalizado de orientación vocacional UTP
        </p>
      </div>
    </div>

    <!-- Centered Card Container -->
    <div class="relative z-10 mt-2 sm:mx-auto sm:w-full sm:max-w-md">
      <Card class="border-[#D9D9D9] shadow-xl bg-white/80 backdrop-blur-md">
        <CardHeader class="pb-4">
          <CardTitle class="text-xl font-bold text-[#1F1F1F]">
            {{ isRegister ? "Formulario de Registro" : "Formulario de Acceso" }}
          </CardTitle>
          <CardDescription>
            {{
              isRegister
                ? "Completa tus datos para registrarte."
                : "Selecciona tu rol y escribe tus credenciales."
            }}
          </CardDescription>
        </CardHeader>

        <CardContent class="space-y-5">
          <!-- Role selector (Tabs) -->
          <Tabs
            :modelValue="activeRole"
            @update:modelValue="handleTabChange"
            class="w-full"
          >
            <TabsList class="grid grid-cols-3 bg-[#F1F1F1] p-1 rounded-xl">
              <TabsTrigger
                value="estudiante"
                class="rounded-lg font-bold text-xs transition-all py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Estudiante
              </TabsTrigger>
              <TabsTrigger
                value="familia"
                class="rounded-lg font-bold text-xs transition-all py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Familia
              </TabsTrigger>
              <TabsTrigger
                value="postulante"
                class="rounded-lg font-bold text-xs transition-all py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Postulante
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <!-- Traditional Form (Login or Register) -->
          <form
            v-if="!isRegister"
            @submit.prevent="handleLogin"
            class="space-y-4"
          >
            <div class="space-y-1.5">
              <Label for="email" class="text-sm font-semibold text-[#1F1F1F]"
                >Correo Electrónico</Label
              >
              <div class="relative">
                <Mail
                  class="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2"
                />
                <Input
                  id="email"
                  type="email"
                  v-model="email"
                  placeholder="nombre@correo.com"
                  class="pl-10 border-[#D9D9D9] focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div class="space-y-1.5">
              <Label for="password" class="text-sm font-semibold text-[#1F1F1F]"
                >Contraseña</Label
              >
              <div class="relative">
                <KeyRound
                  class="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2"
                />
                <Input
                  id="password"
                  type="password"
                  v-model="password"
                  placeholder="••••••••"
                  class="pl-10 border-[#D9D9D9] focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <!-- Error Alert -->
            <div
              v-if="error"
              class="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 p-2.5 rounded-lg"
            >
              {{ error }}
            </div>

            <!-- Login Button -->
            <Button
              type="submit"
              class="flex items-center justify-center w-full gap-2 py-6 font-bold text-white transition-all shadow-md rounded-xl"
              :class="`bg-gradient-to-r ${themeColors.gradient} hover:scale-[1.01]`"
              :disabled="isLoading"
            >
              <span
                v-if="isLoading"
                class="border-2 border-white border-t-transparent animate-spin rounded-full w-4.5 h-4.5"
              ></span>
              <span v-else class="flex items-center gap-2">
                Ingresar al Portal
                <ArrowRight class="w-4 h-4" />
              </span>
            </Button>
          </form>

          <!-- Register Form -->
          <form v-else @submit.prevent="handleRegister" class="space-y-4">
            <div class="space-y-1.5">
              <Label for="fullName" class="text-sm font-semibold text-[#1F1F1F]"
                >Nombre Completo</Label
              >
              <div class="relative">
                <UserCheck
                  class="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2"
                />
                <Input
                  id="fullName"
                  type="text"
                  v-model="fullName"
                  placeholder="Ej. Marisela Torres"
                  class="pl-10 border-[#D9D9D9] focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div class="space-y-1.5">
              <Label for="regEmail" class="text-sm font-semibold text-[#1F1F1F]"
                >Correo Electrónico</Label
              >
              <div class="relative">
                <Mail
                  class="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2"
                />
                <Input
                  id="regEmail"
                  type="email"
                  v-model="email"
                  placeholder="nombre@correo.com"
                  class="pl-10 border-[#D9D9D9] focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div class="space-y-1.5">
              <Label
                for="regPassword"
                class="text-sm font-semibold text-[#1F1F1F]"
                >Contraseña</Label
              >
              <div class="relative">
                <KeyRound
                  class="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2"
                />
                <Input
                  id="regPassword"
                  type="password"
                  v-model="password"
                  placeholder="Mínimo 6 caracteres"
                  class="pl-10 border-[#D9D9D9] focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div class="space-y-1.5">
              <Label
                for="confirmPassword"
                class="text-sm font-semibold text-[#1F1F1F]"
                >Confirmar Contraseña</Label
              >
              <div class="relative">
                <KeyRound
                  class="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2"
                />
                <Input
                  id="confirmPassword"
                  type="password"
                  v-model="confirmPassword"
                  placeholder="Repetir contraseña"
                  class="pl-10 border-[#D9D9D9] focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <!-- PIN del Alumno (Sólo Familia) -->
            <div v-if="activeRole === 'familia'" class="space-y-1.5">
              <Label
                for="studentPin"
                class="text-sm font-semibold text-[#1F1F1F]"
                >Pin del Alumno (Opcional)</Label
              >
              <div class="relative">
                <KeyRound
                  class="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2"
                />
                <Input
                  id="studentPin"
                  type="text"
                  v-model="studentPin"
                  placeholder="Ej. NEX-ALE-2026"
                  class="pl-10 border-[#D9D9D9] focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <!-- Error Alert -->
            <div
              v-if="error"
              class="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 p-2.5 rounded-lg"
            >
              {{ error }}
            </div>

            <!-- Register Button -->
            <Button
              type="submit"
              class="flex items-center justify-center w-full gap-2 py-6 font-bold text-white transition-all shadow-md rounded-xl"
              :class="`bg-gradient-to-r ${themeColors.gradient} hover:scale-[1.01]`"
              :disabled="isLoading"
            >
              <span
                v-if="isLoading"
                class="border-2 border-white border-t-transparent animate-spin rounded-full w-4.5 h-4.5"
              ></span>
              <span v-else class="flex items-center gap-2">
                Crear Cuenta
                <UserPlus class="w-4 h-4 ml-1" />
              </span>
            </Button>
          </form>

          <!-- GOOGLE SIGN-IN FOR FAMILY -->
          <div
            v-if="activeRole === 'familia'"
            class="pt-2 space-y-4 border-t border-gray-100"
          >
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <span class="w-full border-t border-gray-200" />
              </div>
              <div class="relative flex justify-center text-xs uppercase">
                <span class="px-3 font-bold text-gray-500 bg-white"
                  >O continuar con</span
                >
              </div>
            </div>
            <GoogleLogin :callback="handleGoogleCallback" class="w-full" />
          </div>

          <!-- Toggle between Login and Register -->
          <div class="pt-2 text-center">
            <button
              type="button"
              @click="toggleMode"
              class="text-sm font-bold underline transition-colors"
              :style="{ color: themeColors.primary }"
            >
              {{
                isRegister
                  ? "¿Ya tienes una cuenta? Inicia sesión"
                  : "¿No tienes cuenta? Regístrate gratis"
              }}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

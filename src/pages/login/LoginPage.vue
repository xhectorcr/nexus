<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '@/lib/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  GraduationCap,
  ArrowRight,
  Mail,
  UserCheck,
  KeyRound,
  UserPlus
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const auth = useAuth()

// Check if a role was requested via query param, default to 'estudiante'
const initialRole = (route.query.role as 'estudiante' | 'familia' | 'postulante') || 'estudiante'
const activeRole = ref<'estudiante' | 'familia' | 'postulante'>(initialRole)

// Tab state: login or register
const isRegister = ref(route.path === '/register')

watch(() => route.path, (newPath) => {
  isRegister.value = newPath === '/register'
  error.value = ''
})

// Credentials
const email = ref('')
const password = ref('')
const fullName = ref('')
const confirmPassword = ref('')
const studentPin = ref('')

const error = ref('')
const isLoading = ref(false)

// Set default credentials helper
const updateDefaultCredentials = (role: 'estudiante' | 'familia' | 'postulante') => {
  if (role === 'estudiante') {
    email.value = 'estudiante@nexus.edu.pe'
    password.value = 'nexus2026'
  } else if (role === 'familia') {
    email.value = 'familia@nexus.edu.pe'
    password.value = 'nexus2026'
  } else if (role === 'postulante') {
    email.value = 'postulante@nexus.edu.pe'
    password.value = 'nexus2026'
  }
}

// Pre-fill initial credentials
updateDefaultCredentials(initialRole)

const handleTabChange = (val: string | number) => {
  activeRole.value = val as 'estudiante' | 'familia' | 'postulante'
  updateDefaultCredentials(activeRole.value)
  error.value = ''
}

const toggleMode = () => {
  const newPath = isRegister.value ? '/login' : '/register'
  router.replace({ path: newPath, query: route.query })
  error.value = ''
  fullName.value = ''
  confirmPassword.value = ''
  studentPin.value = ''
  updateDefaultCredentials(activeRole.value)
}

const handleLogin = async () => {
  if (!email.value || !password.value) {
    error.value = 'Por favor, completa todos los campos.'
    return
  }
  
  isLoading.value = true
  error.value = ''
  
  // Simulated authentication delay
  setTimeout(() => {
    isLoading.value = false
    auth.login(activeRole.value, email.value)
    
    // Redirect logic
    const redirectPath = (route.query.redirect as string) || `/${activeRole.value}`
    router.push(redirectPath)
  }, 800)
}

const handleRegister = async () => {
  if (!fullName.value || !email.value || !password.value || !confirmPassword.value) {
    error.value = 'Por favor, completa todos los campos.'
    return
  }
  if (password.value !== confirmPassword.value) {
    error.value = 'Las contraseñas no coinciden.'
    return
  }

  isLoading.value = true
  error.value = ''

  setTimeout(() => {
    isLoading.value = false
    // Log in with registered credentials and name
    auth.login(activeRole.value, email.value, fullName.value)

    if (activeRole.value === 'familia' && studentPin.value) {
      auth.linkStudent(studentPin.value)
    }

    const redirectPath = `/${activeRole.value}`
    router.push(redirectPath)
  }, 800)
}

const handleGoogleLogin = () => {
  isLoading.value = true
  error.value = ''
  
  setTimeout(() => {
    isLoading.value = false
    // Simulate successful Google auth for Marisela Torres (Family)
    auth.login('familia', 'marisela.torres@gmail.com', 'Marisela Torres')
    router.push('/familia')
  }, 1000)
}

// Color schemes matching dashboard styles
const themeColors = computed(() => {
  switch (activeRole.value) {
    case 'estudiante':
      return {
        primary: '#B50E30',
        hover: '#8F0B26',
        bgLight: 'bg-[#B50E30]/5',
        border: 'border-[#B50E30]/20',
        gradient: 'from-[#B50E30] to-[#8F0B26]',
        text: 'text-[#B50E30]'
      }
    case 'familia':
      return {
        primary: '#D4A017',
        hover: '#B8870F',
        bgLight: 'bg-[#D4A017]/5',
        border: 'border-[#D4A017]/20',
        gradient: 'from-[#D4A017] to-[#B8870F]',
        text: 'text-[#D4A017]'
      }
    case 'postulante':
      return {
        primary: '#1565C0',
        hover: '#0D47A1',
        bgLight: 'bg-[#1565C0]/5',
        border: 'border-[#1565C0]/20',
        gradient: 'from-[#1565C0] to-[#0D47A1]',
        text: 'text-[#1565C0]'
      }
  }
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-[#FAF7F7] via-white to-[#F1F1F1] flex flex-col justify-center py-12 px-6 lg:px-8 relative overflow-hidden">
    <!-- Background Decorative Elements -->
    <div class="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#B50E30]/5 blur-3xl pointer-events-none" />
    <div class="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-[#1565C0]/5 blur-3xl pointer-events-none" />
    
    <div class="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
      <!-- Logo and Title -->
      <div class="flex flex-col items-center mb-6">
        <router-link to="/" class="flex items-center gap-2 mb-2">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#B50E30] to-[#8F0B26] flex items-center justify-center shadow-lg shadow-red-500/10">
            <GraduationCap class="w-7 h-7 text-white" />
          </div>
          <span class="font-extrabold text-2xl text-[#1F1F1F] tracking-tight">NEXUS</span>
        </router-link>
        <h2 class="text-center text-3xl font-extrabold text-[#1F1F1F]">
          {{ isRegister ? 'Crear tu Cuenta' : 'Iniciar Sesión' }}
        </h2>
        <p class="mt-2 text-center text-sm text-[#5F6368]">
          Accede a tu portal personalizado de orientación vocacional UTP
        </p>
      </div>
    </div>

    <!-- Centered Card Container -->
    <div class="mt-2 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
      
      <Card class="border-[#D9D9D9] shadow-xl bg-white/80 backdrop-blur-md">
        <CardHeader class="pb-4">
          <CardTitle class="text-xl font-bold text-[#1F1F1F]">
            {{ isRegister ? 'Formulario de Registro' : 'Formulario de Acceso' }}
          </CardTitle>
          <CardDescription>
            {{ isRegister ? 'Completa tus datos para registrarte.' : 'Selecciona tu rol y escribe tus credenciales.' }}
          </CardDescription>
        </CardHeader>
        
        <CardContent class="space-y-5">
          <!-- Role selector (Tabs) -->
          <Tabs :modelValue="activeRole" @update:modelValue="handleTabChange" class="w-full">
            <TabsList class="grid grid-cols-3 bg-[#F1F1F1] p-1 rounded-xl">
              <TabsTrigger value="estudiante" class="rounded-lg font-bold text-xs transition-all py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Estudiante
              </TabsTrigger>
              <TabsTrigger value="familia" class="rounded-lg font-bold text-xs transition-all py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Familia
              </TabsTrigger>
              <TabsTrigger value="postulante" class="rounded-lg font-bold text-xs transition-all py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Postulante
              </TabsTrigger>
            </TabsList>
          </Tabs>



          <!-- Traditional Form (Login or Register) -->
          <form v-if="!isRegister" @submit.prevent="handleLogin" class="space-y-4">
            <div class="space-y-1.5">
              <Label for="email" class="text-sm font-semibold text-[#1F1F1F]">Correo Electrónico</Label>
              <div class="relative">
                <Mail class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
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
              <Label for="password" class="text-sm font-semibold text-[#1F1F1F]">Contraseña</Label>
              <div class="relative">
                <KeyRound class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
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
            <div v-if="error" class="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 p-2.5 rounded-lg">
              {{ error }}
            </div>

            <!-- Login Button -->
            <Button
              type="submit"
              class="w-full text-white transition-all py-6 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md"
              :class="`bg-gradient-to-r ${themeColors.gradient} hover:scale-[1.01]`"
              :disabled="isLoading"
            >
              <span v-if="isLoading" class="border-2 border-white border-t-transparent animate-spin rounded-full w-4.5 h-4.5"></span>
              <span v-else class="flex items-center gap-2">
                Ingresar al Portal
                <ArrowRight class="w-4 h-4" />
              </span>
            </Button>
          </form>

          <!-- Register Form -->
          <form v-else @submit.prevent="handleRegister" class="space-y-4">
            <div class="space-y-1.5">
              <Label for="fullName" class="text-sm font-semibold text-[#1F1F1F]">Nombre Completo</Label>
              <div class="relative">
                <UserCheck class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
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
              <Label for="regEmail" class="text-sm font-semibold text-[#1F1F1F]">Correo Electrónico</Label>
              <div class="relative">
                <Mail class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
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
              <Label for="regPassword" class="text-sm font-semibold text-[#1F1F1F]">Contraseña</Label>
              <div class="relative">
                <KeyRound class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
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
              <Label for="confirmPassword" class="text-sm font-semibold text-[#1F1F1F]">Confirmar Contraseña</Label>
              <div class="relative">
                <KeyRound class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
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
              <Label for="studentPin" class="text-sm font-semibold text-[#1F1F1F]">Pin del Alumno (Opcional)</Label>
              <div class="relative">
                <KeyRound class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
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
            <div v-if="error" class="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 p-2.5 rounded-lg">
              {{ error }}
            </div>

            <!-- Register Button -->
            <Button
              type="submit"
              class="w-full text-white transition-all py-6 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md"
              :class="`bg-gradient-to-r ${themeColors.gradient} hover:scale-[1.01]`"
              :disabled="isLoading"
            >
              <span v-if="isLoading" class="border-2 border-white border-t-transparent animate-spin rounded-full w-4.5 h-4.5"></span>
              <span v-else class="flex items-center gap-2">
                Crear Cuenta
                <UserPlus class="w-4 h-4 ml-1" />
              </span>
            </Button>
          </form>

          <!-- GOOGLE SIGN-IN FOR FAMILY -->
          <div v-if="activeRole === 'familia'" class="space-y-4 pt-2 border-t border-gray-100">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <span class="w-full border-t border-gray-200" />
              </div>
              <div class="relative flex justify-center text-xs uppercase">
                <span class="bg-white px-3 text-gray-500 font-bold">O continuar con</span>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              class="w-full py-6 rounded-xl border-gray-300 hover:bg-slate-50 flex items-center justify-center gap-2 font-bold shadow-sm"
              @click="handleGoogleLogin"
              :disabled="isLoading"
            >
              <svg class="w-5 h-5 mr-1" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              Continuar con Google
            </Button>
          </div>

          <!-- Toggle between Login and Register -->
          <div class="text-center pt-2">
            <button
              type="button"
              @click="toggleMode"
              class="text-sm font-bold underline transition-colors"
              :style="{ color: themeColors.primary }"
            >
              {{ isRegister ? '¿Ya tienes una cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate gratis' }}
            </button>
          </div>
        </CardContent>
      </Card>
      
    </div>
  </div>
</template>

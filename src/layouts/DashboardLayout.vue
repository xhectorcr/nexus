<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Bell,
  Search,
  Menu,
  X,
  GraduationCap,
  Home,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-vue-next'
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from '@/components/ui/breadcrumb'

interface SidebarItem {
  icon: any
  label: string
  href?: string
  onClick?: () => void
}

const props = withDefaults(defineProps<{
  sidebarItems: SidebarItem[]
  title: string
  subtitle?: string
  breadcrumbs?: { label: string; href?: string }[]
  moduleColor?: string
}>(), {
  moduleColor: '#B50E30'
})

const sidebarOpen = ref(true)
const route = useRoute()

const logoGradient = computed(() => `linear-gradient(135deg, ${props.moduleColor} 0%, ${props.moduleColor}DD 100%)`)
</script>

<template>
  <div class="min-h-screen bg-[#FAF7F7]">
    <!-- Sidebar -->
    <aside
      :class="`fixed left-0 top-0 h-full bg-white border-r border-[#D9D9D9] transition-all duration-300 z-40 ${
        sidebarOpen ? 'w-64' : 'w-20'
      }`"
    >
      <!-- Logo -->
      <div class="h-16 border-b border-[#D9D9D9] flex items-center justify-between px-4">
        <template if="sidebarOpen">
          <router-link to="/" class="flex items-center gap-2" v-if="sidebarOpen">
            <div
              class="w-10 h-10 rounded-xl flex items-center justify-center"
              :style="{ background: logoGradient }"
            >
              <GraduationCap class="w-6 h-6 text-white" />
            </div>
            <span class="font-semibold text-lg text-[#1F1F1F]">NEXUS</span>
          </router-link>
        </template>
        <template v-if="!sidebarOpen">
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center mx-auto"
            :style="{ background: logoGradient }"
          >
            <GraduationCap class="w-6 h-6 text-white" />
          </div>
        </template>
      </div>

      <!-- Navigation -->
      <nav class="p-4 space-y-2">
        <template v-for="(item, index) in sidebarItems" :key="index">
          <router-link v-if="item.href" :to="item.href">
            <div
              :class="`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer ${
                route.path === item.href
                  ? 'text-white'
                  : 'text-[#5F6368] hover:bg-[#F1F1F1]'
              }`"
              :style="route.path === item.href ? { backgroundColor: moduleColor } : undefined"
            >
              <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
              <span v-if="sidebarOpen" class="text-sm font-medium">{{ item.label }}</span>
            </div>
          </router-link>
          
          <button v-else @click="item.onClick" class="w-full text-left">
            <div
              class="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer text-[#5F6368] hover:bg-[#F1F1F1]"
            >
              <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
              <span v-if="sidebarOpen" class="text-sm font-medium">{{ item.label }}</span>
            </div>
          </button>
        </template>
      </nav>

      <!-- Collapse Button -->
      <button
        @click="sidebarOpen = !sidebarOpen"
        class="absolute bottom-6 left-4 right-4 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#F1F1F1] hover:bg-[#D9D9D9] transition-colors"
      >
        <X v-if="sidebarOpen" class="w-4 h-4" />
        <Menu v-else class="w-4 h-4" />
        <span v-if="sidebarOpen" class="text-sm">Contraer</span>
      </button>
    </aside>

    <!-- Main Content -->
    <div
      :class="`transition-all duration-300 ${
        sidebarOpen ? 'ml-64' : 'ml-20'
      }`"
    >
      <!-- Top Navbar -->
      <header class="h-16 bg-white border-b border-[#D9D9D9] sticky top-0 z-30">
        <div class="h-full px-6 flex items-center justify-between">
          <!-- Search -->
          <div class="flex-1 max-w-md">
            <div class="relative">
              <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5F6368]" />
              <Input
                placeholder="Buscar en NEXUS..."
                class="pl-10 bg-[#F1F1F1] border-transparent focus:bg-white"
              />
            </div>
          </div>

          <!-- Right Actions -->
          <div class="flex items-center gap-4">
            <!-- Notifications -->
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button variant="ghost" size="icon" class="relative">
                  <Bell class="w-5 h-5" />
                  <span class="absolute top-1 right-1 w-2 h-2 bg-[#B50E30] rounded-full" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" class="w-80">
                <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <div class="flex flex-col gap-1">
                    <span class="font-medium text-sm">Nuevo mensaje</span>
                    <span class="text-xs text-[#5F6368]">Tienes un nuevo mentor disponible</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div class="flex flex-col gap-1">
                    <span class="font-medium text-sm">Progreso actualizado</span>
                    <span class="text-xs text-[#5F6368]">Has completado el 75% de tu evaluación</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <!-- User Menu -->
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button variant="ghost" class="flex items-center gap-2 px-2">
                  <Avatar class="w-8 h-8">
                    <AvatarImage src="" />
                    <AvatarFallback :style="{ backgroundColor: moduleColor }" class="text-white">
                      U
                    </AvatarFallback>
                  </Avatar>
                  <span class="text-sm font-medium hidden md:block">Usuario</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Home class="w-4 h-4 mr-2" />
                  Inicio
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings class="w-4 h-4 mr-2" />
                  Configuración
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut class="w-4 h-4 mr-2" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <!-- Page Header -->
      <div class="bg-white border-b border-[#D9D9D9] px-6 py-6">
        <Breadcrumb v-if="breadcrumbs && breadcrumbs.length > 0" class="mb-4">
          <BreadcrumbList>
            <template v-for="(crumb, index) in breadcrumbs" :key="index">
              <div class="flex items-center">
                <BreadcrumbSeparator v-if="index > 0">
                  <ChevronRight class="w-4 h-4" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink v-if="crumb.href" :href="crumb.href">{{ crumb.label }}</BreadcrumbLink>
                  <BreadcrumbPage v-else>{{ crumb.label }}</BreadcrumbPage>
                </BreadcrumbItem>
              </div>
            </template>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 class="text-2xl font-bold text-[#1F1F1F]">{{ title }}</h1>
        <p v-if="subtitle" class="text-[#5F6368] mt-1">{{ subtitle }}</p>
      </div>

      <!-- Main Content Area -->
      <main class="p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

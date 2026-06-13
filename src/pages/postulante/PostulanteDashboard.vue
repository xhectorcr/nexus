<script setup lang="ts">
import { markRaw } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Home,
  Gamepad2,
  BookOpen,
  MessageCircle,
  Trophy,
  Sparkles,
  ArrowRight,
  Brain,
  Lightbulb,
  Heart,
  Target,
  Plus,
  Send,
  Circle,
  Map as MapIcon,
} from 'lucide-vue-next'

const sidebarItems = [
  { icon: markRaw(Home), label: "Inicio", href: "/postulante" },
]

const mentors = [
  { name: "Ana García", career: "Ingeniería de Sistemas", online: true },
  { name: "Carlos Ruiz", career: "Administración", online: true },
  { name: "María López", career: "Arquitectura", online: false },
]

const stats = [
  { label: "Laberinto completado", value: "40%", color: "#B50E30" },
  { label: "Entradas en bitácora", value: "12", color: "#D4A017" },
  { label: "Conversaciones", value: "5", color: "#1565C0" },
  { label: "Nivel actual", value: "3", color: "#2E7D32" },
]

const entries = ["Proyecto de robótica", "Clase de programación", "Meta: aprender IA"]
</script>

<template>
  <DashboardLayout
    :sidebarItems="sidebarItems"
    title="NEXUS Postulante"
    subtitle="Descubre tu verdadera vocación con inteligencia artificial"
    :breadcrumbs="[
      { label: 'Inicio', href: '/' },
      { label: 'Postulante' }
    ]"
    moduleColor="#B50E30"
  >
    <div class="space-y-6">
      <!-- Hero Section -->
      <Card class="bg-gradient-to-br from-[#B50E30] to-[#8F0B26] border-0 text-white overflow-hidden relative">
        <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
        <div class="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />
        <CardHeader class="relative z-10">
          <div class="flex items-center gap-2 mb-2">
            <Sparkles class="w-5 h-5" />
            <span class="text-sm font-medium">Comenzar mi viaje</span>
          </div>
          <CardTitle class="text-3xl">Descubre tu verdadera vocación</CardTitle>
          <CardDescription class="text-white/90">
            Explora tus intereses, desarrolla tu perfil y conecta con mentores
          </CardDescription>
        </CardHeader>
        <CardContent class="relative z-10">
          <Button size="lg" class="bg-white text-[#B50E30] hover:bg-white/90">
            Comenzar evaluación
            <ArrowRight class="w-5 h-5 ml-2" />
          </Button>
        </CardContent>
      </Card>

      <!-- Main Features Grid -->
      <div class="grid md:grid-cols-3 gap-6">
        <!-- Minijuego: Laberinto de Vocaciones -->
        <Card class="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B50E30] to-[#D13C5B] flex items-center justify-center mb-3">
              <Gamepad2 class="w-6 h-6 text-white" />
            </div>
            <CardTitle>Laberinto de Vocaciones</CardTitle>
            <CardDescription>
              Explora caminos interactivos para descubrir tus intereses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <!-- Isometric Illustration Placeholder -->
              <div class="aspect-square rounded-xl bg-gradient-to-br from-[#F1F1F1] to-[#D9D9D9] flex items-center justify-center relative overflow-hidden">
                <div class="absolute inset-0 grid grid-cols-3 gap-2 p-4">
                  <div
                    v-for="i in 9"
                    :key="i"
                    class="rounded-lg bg-white/50 backdrop-blur-sm flex items-center justify-center"
                  >
                    <Target v-if="i === 5" class="w-6 h-6 text-[#B50E30]" />
                  </div>
                </div>
              </div>

              <!-- Tags -->
              <div class="flex flex-wrap gap-2">
                <Badge variant="secondary" class="bg-[#B50E30]/10 text-[#B50E30] border-[#B50E30]/20">
                  <Brain class="w-3 h-3 mr-1" />
                  Intereses
                </Badge>
                <Badge variant="secondary" class="bg-[#D4A017]/10 text-[#D4A017] border-[#D4A017]/20">
                  <Lightbulb class="w-3 h-3 mr-1" />
                  Inteligencias
                </Badge>
                <Badge variant="secondary" class="bg-[#1565C0]/10 text-[#1565C0] border-[#1565C0]/20">
                  <Heart class="w-3 h-3 mr-1" />
                  Personalidad
                </Badge>
              </div>

              <Button class="w-full bg-[#B50E30] hover:bg-[#8F0B26]">
                Explorar laberinto
              </Button>
            </div>
          </CardContent>
        </Card>

        <!-- Bitácora Digital -->
        <Card class="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4A017] to-[#B8870F] flex items-center justify-center mb-3">
              <BookOpen class="w-6 h-6 text-white" />
            </div>
            <CardTitle>Bitácora Digital</CardTitle>
            <CardDescription>
              Registra proyectos, experiencias y metas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="write" class="w-full">
              <TabsList class="grid w-full grid-cols-2">
                <TabsTrigger value="write">Escribir</TabsTrigger>
                <TabsTrigger value="entries">Entradas</TabsTrigger>
              </TabsList>
              <TabsContent value="write" class="space-y-4">
                <Input placeholder="Título de la entrada..." />
                <Textarea
                  placeholder="Describe tu experiencia, proyecto u objetivo..."
                  class="min-h-[120px]"
                />
                <div class="flex gap-2">
                  <Button size="sm" variant="outline" class="flex-1">
                    <Plus class="w-4 h-4 mr-1" />
                    Agregar etiqueta
                  </Button>
                  <Button size="sm" class="bg-[#D4A017] hover:bg-[#B8870F]">
                    Guardar
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="entries" class="space-y-3">
                <div
                  v-for="(entry, i) in entries"
                  :key="i"
                  class="p-3 rounded-lg bg-[#F1F1F1] hover:bg-[#D9D9D9] transition-colors cursor-pointer"
                >
                  <p class="text-sm font-medium text-[#1F1F1F]">{{ entry }}</p>
                  <p class="text-xs text-[#5F6368] mt-1">Hace {{ i + 1 }} día{{ i > 0 ? 's' : '' }}</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <!-- Conexión P2P -->
        <Card class="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1565C0] to-[#0D47A1] flex items-center justify-center mb-3">
              <MessageCircle class="w-6 h-6 text-white" />
            </div>
            <CardTitle>Conexión P2P</CardTitle>
            <CardDescription>
              Chatea con estudiantes UTP y mentores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-3">
              <p class="text-sm font-medium text-[#1F1F1F]">Mentores disponibles</p>
              <div
                v-for="(mentor, i) in mentors"
                :key="i"
                class="flex items-center gap-3 p-3 rounded-lg hover:bg-[#F1F1F1] transition-colors cursor-pointer"
              >
                <div class="relative">
                  <Avatar class="w-10 h-10">
                    <AvatarImage src="" />
                    <AvatarFallback class="bg-[#B50E30] text-white">
                      {{ mentor.name[0] }}
                    </AvatarFallback>
                  </Avatar>
                  <Circle
                    v-if="mentor.online"
                    class="absolute bottom-0 right-0 w-3 h-3 fill-[#2E7D32] text-[#2E7D32] border-2 border-white rounded-full"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-[#1F1F1F] truncate">
                    {{ mentor.name }}
                  </p>
                  <p class="text-xs text-[#5F6368] truncate">
                    {{ mentor.career }}
                  </p>
                </div>
                <Button size="sm" variant="ghost">
                  <Send class="w-4 h-4" />
                </Button>
              </div>
              <Button variant="outline" class="w-full">
                Ver todos los mentores
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Progress Section -->
      <Card>
        <CardHeader>
          <CardTitle>Tu Progreso</CardTitle>
          <CardDescription>Completa actividades para descubrir tu vocación</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid md:grid-cols-4 gap-4">
            <div
              v-for="(stat, i) in stats"
              :key="i"
              class="p-4 rounded-xl bg-[#F1F1F1]"
            >
              <p class="text-2xl font-bold" :style="{ color: stat.color }">
                {{ stat.value }}
              </p>
              <p class="text-sm text-[#5F6368] mt-1">{{ stat.label }}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
</template>

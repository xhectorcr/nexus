<script setup lang="ts">
import { markRaw } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Home,
  TrendingUp,
  FileText,
  MessageSquare,
  Heart,
  Download,
  CheckCircle2,
  Circle,
  Plus,
  ThumbsUp,
  MessageCircle,
} from 'lucide-vue-next'

const sidebarItems = [
  { icon: markRaw(Home), label: "Inicio", href: "/familia" },
  { icon: markRaw(TrendingUp), label: "Progreso de tu hijo", href: "/familia/progreso" },
]

const milestones = [
  { title: "Plan de acción creado", completed: true, date: "15 May 2026" },
  { title: "Primera evaluación", completed: true, date: "20 May 2026" },
  { title: "Autoconocimiento 50%", completed: true, date: "5 Jun 2026" },
  { title: "Chat con mentor", completed: false, date: "Pendiente" },
  { title: "Evaluación vocacional completa", completed: false, date: "Pendiente" },
]

const resources = [
  {
    title: "Guía para padres",
    description: "Cómo apoyar la orientación vocacional",
    downloads: 1243,
    icon: markRaw(FileText),
    color: "#B50E30",
  },
  {
    title: "Adaptación universitaria",
    description: "Preparando el camino hacia la universidad",
    downloads: 892,
    icon: markRaw(Heart),
    color: "#D4A017",
  },
  {
    title: "Consejos vocacionales",
    description: "Estrategias para encontrar la vocación",
    downloads: 1567,
    icon: markRaw(TrendingUp),
    color: "#1565C0",
  },
  {
    title: "Salud emocional",
    description: "Gestionar el estrés del proceso",
    downloads: 743,
    icon: markRaw(Heart),
    color: "#2E7D32",
  },
]

const forumPosts = [
  {
    user: "María P.",
    question: "¿Cómo apoyar a mi hijo en la elección de carrera?",
    replies: 12,
    likes: 24,
    time: "2 horas",
  },
  {
    user: "Carlos R.",
    question: "Orientación para padres de estudiantes indecisos",
    replies: 8,
    likes: 15,
    time: "5 horas",
  },
  {
    user: "Ana G.",
    question: "Experiencias con la plataforma NEXUS",
    replies: 19,
    likes: 31,
    time: "1 día",
  },
]

const categories = ["Orientación", "Adaptación", "Bienestar", "Decisiones", "Experiencias"]

const stats = [
  { label: "Progreso general", value: "68%", icon: markRaw(TrendingUp), color: "#D4A017" },
  { label: "Hitos completados", value: "3/5", icon: markRaw(CheckCircle2), color: "#2E7D32" },
  { label: "Días activos", value: "24", icon: markRaw(Heart), color: "#B50E30" },
  { label: "Recursos descargados", value: "7", icon: markRaw(FileText), color: "#1565C0" },
]
</script>

<template>
  <DashboardLayout
    :sidebarItems="sidebarItems"
    title="NEXUS Familia"
    subtitle="Dashboard para padres - Acompaña el viaje vocacional de tu hijo"
    :breadcrumbs="[
      { label: 'Inicio', href: '/' },
      { label: 'Familia' },
    ]"
    moduleColor="#D4A017"
  >
    <div class="space-y-6">
      <!-- Hero Stats -->
      <div class="grid md:grid-cols-4 gap-4">
        <Card v-for="(stat, i) in stats" :key="i">
          <CardContent class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-2xl font-bold text-[#1F1F1F]">{{ stat.value }}</p>
                <p class="text-sm text-[#5F6368] mt-1">{{ stat.label }}</p>
              </div>
              <div
                class="w-12 h-12 rounded-xl flex items-center justify-center"
                :style="{ backgroundColor: `${stat.color}15` }"
              >
                <component :is="stat.icon" class="w-6 h-6" :style="{ color: stat.color }" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Panel de Progreso -->
      <Card>
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle>Panel de Progreso</CardTitle>
              <CardDescription>Seguimiento de hitos y evaluaciones de tu hijo</CardDescription>
            </div>
            <Badge class="bg-[#2E7D32] text-white">
              <CheckCircle2 class="w-3 h-3 mr-1" />
              60% Completado
            </Badge>
          </div>
        </CardHeader>
        <CardContent class="space-y-6">
          <!-- Overall Progress Bar -->
          <div class="space-y-2">
            <div class="flex items-center justify-between text-sm">
              <span class="font-medium text-[#1F1F1F]">Progreso total</span>
              <span class="text-[#5F6368]">68%</span>
            </div>
            <Progress :value="68" class="h-3" />
          </div>

          <!-- Milestones -->
          <div class="space-y-4">
            <h4 class="font-medium text-[#1F1F1F]">Hitos del viaje vocacional</h4>
            <div class="space-y-3">
              <div
                v-for="(milestone, i) in milestones"
                :key="i"
                :class="`flex items-start gap-3 p-4 rounded-lg ${
                  milestone.completed ? 'bg-[#2E7D32]/10' : 'bg-[#F1F1F1]'
                }`"
              >
                <CheckCircle2 v-if="milestone.completed" class="w-5 h-5 text-[#2E7D32] flex-shrink-0 mt-0.5" />
                <Circle v-else class="w-5 h-5 text-[#5F6368] flex-shrink-0 mt-0.5" />
                <div class="flex-1">
                  <p
                    :class="`font-medium ${
                      milestone.completed ? 'text-[#2E7D32]' : 'text-[#1F1F1F]'
                    }`"
                  >
                    {{ milestone.title }}
                  </p>
                  <p class="text-sm text-[#5F6368] mt-1">{{ milestone.date }}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Recursos y Guías -->
      <Card>
        <CardHeader>
          <CardTitle>Recursos y Guías</CardTitle>
          <CardDescription>Material descargable para apoyar el proceso</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid md:grid-cols-2 gap-4">
            <Card v-for="(resource, i) in resources" :key="i" class="hover:shadow-md transition-shadow">
              <CardContent class="p-5">
                <div class="flex items-start gap-4">
                  <div
                    class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    :style="{ backgroundColor: `${resource.color}15` }"
                  >
                    <component :is="resource.icon" class="w-6 h-6" :style="{ color: resource.color }" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <h4 class="font-medium text-[#1F1F1F]">{{ resource.title }}</h4>
                    <p class="text-sm text-[#5F6368] mt-1">{{ resource.description }}</p>
                    <div class="flex items-center justify-between mt-3">
                      <span class="text-xs text-[#5F6368]">
                        {{ resource.downloads.toLocaleString() }} descargas
                      </span>
                      <Button size="sm" variant="ghost" class="gap-2">
                        <Download class="w-4 h-4" />
                        Descargar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <!-- Foro Moderado -->
      <Card>
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle>Foro Moderado</CardTitle>
              <CardDescription>Conecta con otros padres y comparte experiencias</CardDescription>
            </div>
            <Button class="bg-[#D4A017] hover:bg-[#B8870F]">
              <Plus class="w-4 h-4 mr-2" />
              Nueva consulta
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div
              v-for="(post, i) in forumPosts"
              :key="i"
              class="p-4 rounded-lg border border-[#D9D9D9] hover:border-[#D4A017] hover:shadow-sm transition-all cursor-pointer"
            >
              <div class="flex items-start gap-3">
                <Avatar class="w-10 h-10">
                  <AvatarFallback class="bg-[#D4A017] text-white">
                    {{ post.user[0] }}
                  </AvatarFallback>
                </Avatar>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="font-medium text-sm text-[#1F1F1F]">{{ post.user }}</span>
                    <span class="text-xs text-[#5F6368]">· {{ post.time }}</span>
                  </div>
                  <p class="text-[#1F1F1F] font-medium mb-3">{{ post.question }}</p>
                  <div class="flex items-center gap-4 text-sm text-[#5F6368]">
                    <button class="flex items-center gap-1 hover:text-[#D4A017] transition-colors">
                      <ThumbsUp class="w-4 h-4" />
                      {{ post.likes }}
                    </button>
                    <button class="flex items-center gap-1 hover:text-[#D4A017] transition-colors">
                      <MessageCircle class="w-4 h-4" />
                      {{ post.replies }} respuestas
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar Categories (Mobile: Below, Desktop: Side) -->
          <div class="mt-6 p-4 rounded-lg bg-[#F1F1F1]">
            <h4 class="font-medium text-[#1F1F1F] mb-3">Categorías populares</h4>
            <div class="flex flex-wrap gap-2">
              <Badge
                v-for="category in categories"
                :key="category"
                variant="secondary"
                class="bg-white hover:bg-[#D4A017]/10 cursor-pointer"
              >
                {{ category }}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
</template>

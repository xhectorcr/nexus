<script setup lang="ts">
import { markRaw } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Home, BookOpen, Map as MapIcon, GraduationCap } from 'lucide-vue-next'

const sidebarItems = [
  { icon: markRaw(Home), label: "Inicio", href: "/estudiante" },
  { icon: markRaw(MapIcon), label: "Ruta de Aprendizaje", href: "/estudiante/ruta" },
  { icon: markRaw(BookOpen), label: "Mis Cursos" },
  { icon: markRaw(GraduationCap), label: "Logros" },
]
</script>

<template>
  <DashboardLayout
    :sidebarItems="sidebarItems"
    title="NEXUS Estudiante"
    subtitle="Tu espacio personal para seguir tu progreso académico"
    :breadcrumbs="[
      { label: 'Inicio', href: '/' },
      { label: 'Estudiante' }
    ]"
    moduleColor="#1565C0"
  >
    <div class="space-y-6">
      <Card class="bg-gradient-to-br from-[#1565C0] to-[#0D47A1] border-0 text-white overflow-hidden relative">
        <CardHeader class="relative z-10">
          <CardTitle class="text-3xl">Bienvenido, Estudiante</CardTitle>
          <CardDescription class="text-white/90">
            Aquí podrás ver tu progreso, acceder a tu ruta de aprendizaje y gestionar tu vida universitaria.
          </CardDescription>
        </CardHeader>
      </Card>
      
      <div class="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Mi Ruta</CardTitle>
            <CardDescription>Continúa donde lo dejaste</CardDescription>
          </CardHeader>
          <CardContent>
            <p class="text-sm text-gray-500">Pronto verás tus próximos pasos en la ruta de aprendizaje.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  </DashboardLayout>
</template>

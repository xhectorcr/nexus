<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  PlayCircle,
  BookOpen,
  CheckSquare,
  Brain,
  Gamepad2,
  PenLine,
  FileText,
  Clock,
  CheckCircle2,
  Circle,
  Lock,
  Star,
  Flame,
} from 'lucide-vue-next'

const props = defineProps<{
  module: any
}>()

const activityIcons: Record<string, any> = {
  video: PlayCircle,
  reading: BookOpen,
  activity: CheckSquare,
  quiz: Brain,
  game: Gamepad2,
  exercise: FileText,
  reflection: PenLine,
}

const activityLabels: Record<string, string> = {
  video: "Video introductorio",
  reading: "Lectura",
  activity: "Actividad",
  quiz: "Quiz",
  game: "Minijuego",
  exercise: "Ejercicio práctico",
  reflection: "Reflexión · Bitácora",
}

const sampleActivities = [
  { id: "a1", type: "video", title: "¿Quién soy? Introducción al autoconocimiento", duration: "12 min", completed: true, xp: 20 },
  { id: "a2", type: "reading", title: "Teoría de las inteligencias vocacionales", duration: "15 min", completed: true, xp: 15 },
  { id: "a3", type: "activity", title: "Rueda de la vida: mis fortalezas y áreas de mejora", duration: "20 min", completed: true, xp: 30 },
  { id: "a4", type: "quiz", title: "Quiz: Conoce tu perfil de autoconocimiento", duration: "10 min", completed: true, xp: 40 },
  { id: "a5", type: "game", title: "Laberinto de Vocaciones · Nivel 1", duration: "25 min", completed: false, xp: 50 },
  { id: "a6", type: "exercise", title: "Árbol de mis valores personales y profesionales", duration: "30 min", completed: false, xp: 35 },
  { id: "a7", type: "reflection", title: "Reflexión final: Mi primera entrada en la Bitácora", duration: "15 min", completed: false, xp: 25 },
]

const activities = ref(sampleActivities)

const toggle = (id: string) => {
  activities.value = activities.value.map(a => 
    a.id === id ? { ...a, completed: !a.completed } : a
  )
}
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
    <!-- Main content -->
    <div class="space-y-5">
      <!-- Module hero -->
      <div
        class="rounded-2xl p-6 text-white relative overflow-hidden"
        :style="{ background: `linear-gradient(135deg, ${module.color} 0%, ${module.color}CC 100%)` }"
      >
        <div class="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-16 -mt-16" />
        <div class="absolute bottom-0 left-0 w-28 h-28 bg-white/5 rounded-full -ml-12 -mb-12" />
        <div class="relative z-10">
          <Badge class="bg-white/20 text-white border-0 mb-3">{{ module.badge }}</Badge>
          <h1 class="text-xl font-bold leading-tight mb-1">{{ module.title }}</h1>
          <p class="text-white/80 text-sm">{{ module.description }}</p>
          <div class="flex items-center gap-4 mt-4 text-sm text-white/80">
            <span class="flex items-center gap-1"><Clock class="w-4 h-4" />{{ module.duration }}</span>
            <span class="flex items-center gap-1"><CheckCircle2 class="w-4 h-4" />{{ activities.length }} actividades</span>
            <span class="flex items-center gap-1"><Star class="w-4 h-4 text-yellow-300" />{{ activities.reduce((sum, a) => sum + a.xp, 0) }} XP</span>
          </div>
        </div>
      </div>

      <!-- Video placeholder -->
      <Card class="overflow-hidden border-0 shadow-sm">
        <div
          class="aspect-video bg-gray-900 flex items-center justify-center relative cursor-pointer group"
          style="min-height: 220px;"
        >
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=450&fit=crop"
            alt="Video introductorio"
            class="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          <div class="relative z-10 flex flex-col items-center gap-2">
            <div class="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
              <PlayCircle class="w-9 h-9 text-[#B50E30]" />
            </div>
            <span class="text-white text-sm font-medium">¿Quién soy? Introducción al autoconocimiento</span>
            <span class="text-white/60 text-xs">12 minutos</span>
          </div>
        </div>
      </Card>

      <!-- Activity checklist -->
      <Card>
        <CardHeader class="pb-3 pt-5 px-5">
          <CardTitle class="flex items-center gap-2 text-base">
            <CheckSquare class="w-4 h-4" :style="{ color: module.color }" />
            Actividades del módulo
          </CardTitle>
        </CardHeader>
        <CardContent class="px-5 pb-5 space-y-2">
          <div
            v-for="(activity, idx) in activities"
            :key="activity.id"
            @click="() => {
              const prevCompleted = idx === 0 || activities[idx - 1].completed
              const isUnlocked = activity.completed || prevCompleted
              if (isUnlocked) toggle(activity.id)
            }"
            :class="`flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-150 ${
              activity.completed
                ? 'bg-green-50 border-green-200'
                : (idx === 0 || activities[idx - 1].completed) || activity.completed
                ? 'bg-card border-border hover:border-gray-300 cursor-pointer'
                : 'bg-gray-50 border-gray-100 opacity-50 cursor-not-allowed'
            }`"
          >
            <div
              class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              :style="{
                backgroundColor: activity.completed
                  ? '#dcfce7'
                  : (idx === 0 || activities[idx - 1].completed) || activity.completed
                  ? `${module.color}12`
                  : '#f3f4f6',
              }"
            >
              <Lock v-if="!((idx === 0 || activities[idx - 1].completed) || activity.completed)" class="w-4 h-4 text-gray-300" />
              <component
                v-else
                :is="activityIcons[activity.type]"
                class="w-4 h-4"
                :style="{ color: activity.completed ? '#16a34a' : module.color }"
              />
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-1.5 mb-0.5">
                <span class="text-xs text-muted-foreground">{{ activityLabels[activity.type] }}</span>
              </div>
              <p :class="`text-sm font-medium leading-tight ${!((idx === 0 || activities[idx - 1].completed) || activity.completed) ? 'text-muted-foreground' : ''}`">
                {{ activity.title }}
              </p>
            </div>

            <div class="flex items-center gap-3 flex-shrink-0">
              <span class="text-xs text-muted-foreground hidden sm:block">{{ activity.duration }}</span>
              <span class="text-xs font-medium" :style="{ color: activity.completed ? '#16a34a' : '#D4A017' }">
                +{{ activity.xp }} XP
              </span>
              <CheckCircle2 v-if="activity.completed" class="w-5 h-5 text-green-500" />
              <Circle v-else-if="(idx === 0 || activities[idx - 1].completed) || activity.completed" class="w-5 h-5 text-gray-300" />
              <Lock v-else class="w-4 h-4 text-gray-300" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Sidebar -->
    <div class="space-y-4">
      <!-- Progress card -->
      <Card class="border" :style="{ borderColor: `${module.color}30` }">
        <CardContent class="p-5">
          <div class="text-center mb-4">
            <div class="text-4xl font-bold" :style="{ color: module.color }">{{ Math.round((activities.filter(a => a.completed).length / activities.length) * 100) }}%</div>
            <p class="text-sm text-muted-foreground">completado</p>
          </div>
          <Progress :value="Math.round((activities.filter(a => a.completed).length / activities.length) * 100)" class="h-2.5 mb-3" />
          <div class="flex justify-between text-xs text-muted-foreground mb-4">
            <span>{{ activities.filter(a => a.completed).length }} de {{ activities.length }} actividades</span>
            <span>{{ activities.filter((a) => a.completed).reduce((sum, a) => sum + a.xp, 0) }} / {{ activities.reduce((sum, a) => sum + a.xp, 0) }} XP</span>
          </div>
          <Button class="w-full text-white text-sm gap-2" :style="{ backgroundColor: module.color }">
            <PlayCircle class="w-4 h-4" />
            Continuar donde lo dejaste
          </Button>
        </CardContent>
      </Card>

      <!-- Time remaining -->
      <Card>
        <CardContent class="p-4 flex items-center gap-3">
          <div class="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <Clock class="w-5 h-5 text-[#1565C0]" />
          </div>
          <div>
            <p class="text-xs text-muted-foreground">Tiempo estimado restante</p>
            <p class="text-sm font-semibold">{{ activities.filter(a => !a.completed).reduce((sum, a) => sum + parseInt(a.duration), 0) }} minutos</p>
          </div>
        </CardContent>
      </Card>

      <!-- Streak reminder -->
      <Card class="bg-orange-50 border-orange-100">
        <CardContent class="p-4 flex items-center gap-3">
          <Flame class="w-7 h-7 text-orange-500" />
          <div>
            <p class="text-xs text-orange-600 font-semibold">¡Racha activa!</p>
            <p class="text-xs text-orange-500 mt-0.5">12 días consecutivos de estudio</p>
          </div>
        </CardContent>
      </Card>

      <!-- Badge unlock -->
      <Card class="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-100">
        <CardContent class="p-4 text-center">
          <div class="text-3xl mb-2">🧭</div>
          <p class="text-sm font-semibold text-amber-800">Insignia: Explorador</p>
          <p class="text-xs text-amber-600 mt-1">Completa este módulo para ganar esta insignia</p>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

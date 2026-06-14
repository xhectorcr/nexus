<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
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
  Loader2,
  Trophy,
  ArrowRight,
} from 'lucide-vue-next'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { api } from '@/lib/api'
import { useAuth } from '@/lib/auth'

const props = defineProps<{
  module: any
}>()

const emit = defineEmits(['completed'])

const auth = useAuth()

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

const activities = ref<any[]>([])
const isLoadingActivities = ref(false)

const minijuego = ref<any>(null)
const isLoadingMinijuego = ref(false)
const showMinijuego = ref(false)
const minijuegoCurrentQuestion = ref(0)
const minijuegoScore = ref(0)
const minijuegoFinished = ref(false)
const selectedAnswerIndex = ref<number | null>(null)
const showAnswerExplanation = ref(false)

const selectedActivity = ref<any>(null)
const isActivityModalOpen = ref(false)

const openActivityModal = (activity: any, isUnlocked: boolean) => {
  if (!isUnlocked) return
  selectedActivity.value = activity
  isActivityModalOpen.value = true
}

const completeSelectedActivity = () => {
  if (selectedActivity.value) {
    activities.value = activities.value.map(a => 
      a.id === selectedActivity.value.id ? { ...a, completed: true } : a
    )
  }
  isActivityModalOpen.value = false
  selectedActivity.value = null
}

const allActivitiesCompleted = computed(() => {
  return activities.value.length > 0 && activities.value.every(a => a.completed)
})

const fetchActivities = async () => {
  try {
    isLoadingActivities.value = true
    const usuarioId = auth.state.user?.id
    if (!usuarioId) return
    const res = await api.get(`/api/v1/ai/ruta/nodos/${props.module.id}/actividades?usuarioId=${usuarioId}`)
    if (res.data && res.data.success) {
      activities.value = res.data.data
    }
  } catch (error) {
    console.error("Error fetching activities", error)
  } finally {
    isLoadingActivities.value = false
  }
}

const startMinijuego = async () => {
  try {
    showMinijuego.value = true
    if (!minijuego.value) {
      isLoadingMinijuego.value = true
      const usuarioId = auth.state.user?.id
      const res = await api.get(`/api/v1/ai/ruta/nodos/${props.module.id}/minijuego?usuarioId=${usuarioId}`)
      if (res.data && res.data.success) {
        minijuego.value = res.data.data
      }
    }
  } catch (error) {
    console.error("Error fetching minijuego", error)
    showMinijuego.value = false
  } finally {
    isLoadingMinijuego.value = false
  }
}

const submitAnswer = (idx: number) => {
  if (showAnswerExplanation.value) return
  selectedAnswerIndex.value = idx
  showAnswerExplanation.value = true
  if (idx === minijuego.value.preguntas[minijuegoCurrentQuestion.value].indiceCorrecto) {
    minijuegoScore.value += 1
  }
}

const nextQuestion = () => {
  if (minijuegoCurrentQuestion.value < minijuego.value.preguntas.length - 1) {
    minijuegoCurrentQuestion.value++
    selectedAnswerIndex.value = null
    showAnswerExplanation.value = false
  } else {
    minijuegoFinished.value = true
  }
}

onMounted(() => {
  fetchActivities()
})
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

      <!-- Loading State -->
      <Card v-if="isLoadingActivities" class="border-0 shadow-sm py-12 flex flex-col items-center justify-center">
        <Loader2 class="w-8 h-8 text-primary animate-spin mb-4" />
        <p class="text-muted-foreground font-medium">La IA está generando tus actividades personalizadas...</p>
      </Card>

      <!-- Minijuego View -->
      <Card v-else-if="showMinijuego" class="border-2 border-primary shadow-lg overflow-hidden">
        <div v-if="isLoadingMinijuego" class="py-16 flex flex-col items-center justify-center">
          <Loader2 class="w-10 h-10 text-primary animate-spin mb-4" />
          <p class="text-muted-foreground font-medium">Creando minijuego interactivo...</p>
        </div>
        <div v-else-if="minijuego && !minijuegoFinished">
          <div class="bg-primary text-primary-foreground p-6 text-center">
            <h2 class="text-2xl font-bold">{{ minijuego.titulo }}</h2>
            <p class="opacity-90 mt-2">{{ minijuego.descripcion }}</p>
            <div class="mt-4 flex justify-center gap-2">
              <div v-for="(_, idx) in minijuego.preguntas" :key="idx" class="w-3 h-3 rounded-full" :class="idx === minijuegoCurrentQuestion ? 'bg-white' : idx < minijuegoCurrentQuestion ? 'bg-green-300' : 'bg-primary-foreground/30'"></div>
            </div>
          </div>
          <div class="p-6">
            <h3 class="text-xl font-medium text-center mb-6">{{ minijuego.preguntas[minijuegoCurrentQuestion].pregunta }}</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                v-for="(opcion, idx) in minijuego.preguntas[minijuegoCurrentQuestion].opciones"
                :key="idx"
                @click="submitAnswer(idx)"
                :disabled="showAnswerExplanation"
                class="p-4 rounded-xl border-2 text-left font-medium transition-all"
                :class="{
                  'border-gray-200 hover:border-primary hover:bg-primary/5': selectedAnswerIndex !== idx && !showAnswerExplanation,
                  'border-primary bg-primary/10': selectedAnswerIndex === idx && !showAnswerExplanation,
                  'border-green-500 bg-green-50 text-green-700': showAnswerExplanation && idx === minijuego.preguntas[minijuegoCurrentQuestion].indiceCorrecto,
                  'border-red-500 bg-red-50 text-red-700': showAnswerExplanation && selectedAnswerIndex === idx && idx !== minijuego.preguntas[minijuegoCurrentQuestion].indiceCorrecto,
                  'border-gray-200 opacity-50': showAnswerExplanation && idx !== minijuego.preguntas[minijuegoCurrentQuestion].indiceCorrecto && selectedAnswerIndex !== idx
                }"
              >
                {{ opcion }}
              </button>
            </div>
            
            <div v-if="showAnswerExplanation" class="mt-6 p-4 rounded-xl border" :class="selectedAnswerIndex === minijuego.preguntas[minijuegoCurrentQuestion].indiceCorrecto ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'">
              <div class="flex items-start gap-3">
                <CheckCircle2 v-if="selectedAnswerIndex === minijuego.preguntas[minijuegoCurrentQuestion].indiceCorrecto" class="w-6 h-6 text-green-600 mt-0.5" />
                <Circle v-else class="w-6 h-6 text-red-600 mt-0.5" />
                <div>
                  <h4 class="font-bold" :class="selectedAnswerIndex === minijuego.preguntas[minijuegoCurrentQuestion].indiceCorrecto ? 'text-green-800' : 'text-red-800'">
                    {{ selectedAnswerIndex === minijuego.preguntas[minijuegoCurrentQuestion].indiceCorrecto ? '¡Correcto!' : 'Incorrecto' }}
                  </h4>
                  <p class="mt-1" :class="selectedAnswerIndex === minijuego.preguntas[minijuegoCurrentQuestion].indiceCorrecto ? 'text-green-700' : 'text-red-700'">
                    {{ minijuego.preguntas[minijuegoCurrentQuestion].explicacion }}
                  </p>
                </div>
              </div>
              <Button class="w-full mt-4" @click="nextQuestion">Continuar <ArrowRight class="w-4 h-4 ml-2" /></Button>
            </div>
          </div>
        </div>
        <div v-else-if="minijuegoFinished" class="py-12 px-6 text-center flex flex-col items-center">
          <div class="w-20 h-20 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-6">
            <Trophy class="w-10 h-10" />
          </div>
          <h2 class="text-3xl font-bold mb-2">¡Módulo Completado!</h2>
          <p class="text-muted-foreground mb-6">Obtuviste {{ minijuegoScore }} de {{ minijuego.preguntas.length }} respuestas correctas.</p>
          <div class="flex gap-4">
            <Button variant="outline" @click="showMinijuego = false">Volver a Actividades</Button>
            <Button class="bg-yellow-500 hover:bg-yellow-600 text-white" @click="emit('completed')">Continuar al siguiente módulo</Button>
          </div>
        </div>
      </Card>

      <!-- Activity checklist -->
      <Card v-else>
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
              openActivityModal(activity, isUnlocked)
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
              <span class="text-xs font-medium" :style="{ color: activity.completed ? '#16a34a' : '#FFB20D' }">
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
          <div v-if="allActivitiesCompleted" class="mt-4">
            <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center mb-4">
              <Trophy class="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <h4 class="font-bold text-yellow-800">¡Minijuego Desbloqueado!</h4>
              <p class="text-xs text-yellow-700 mt-1">Completa el desafío final para ganar la insignia del módulo.</p>
            </div>
            <Button class="w-full text-white text-sm gap-2" :style="{ backgroundColor: module.color }" @click="startMinijuego">
              <Gamepad2 class="w-4 h-4" />
              Jugar y Completar Módulo
            </Button>
          </div>
          <Button v-else class="w-full text-white text-sm gap-2" :style="{ backgroundColor: module.color }">
            <PlayCircle class="w-4 h-4" />
            Continuar donde lo dejaste
          </Button>
        </CardContent>
      </Card>

      <!-- Time remaining -->
      <Card>
        <CardContent class="p-4 flex items-center gap-3">
          <div class="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <Clock class="w-5 h-5 text-[#082065]" />
          </div>
          <div>
            <p class="text-xs text-muted-foreground">Tiempo estimado restante</p>
            <p class="text-sm font-semibold">{{ activities.filter(a => !a.completed).reduce((sum, a) => sum + parseInt(a.duration || '0'), 0) }} minutos</p>
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

    <!-- Modal de Actividad -->
    <Dialog :open="isActivityModalOpen" @update:open="val => isActivityModalOpen = val">
      <DialogContent class="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div class="flex items-center gap-2 mb-2">
            <component
              v-if="selectedActivity"
              :is="activityIcons[selectedActivity.type]"
              class="w-5 h-5"
              :style="{ color: module.color }"
            />
            <span v-if="selectedActivity" class="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              {{ activityLabels[selectedActivity.type] }}
            </span>
          </div>
          <DialogTitle class="text-2xl font-bold leading-tight" v-if="selectedActivity">
            {{ selectedActivity.title }}
          </DialogTitle>
          <DialogDescription class="flex gap-4 items-center mt-2" v-if="selectedActivity">
            <span class="flex items-center gap-1"><Clock class="w-4 h-4"/> {{ selectedActivity.duration }}</span>
            <span class="flex items-center gap-1 font-semibold text-yellow-600"><Star class="w-4 h-4"/> +{{ selectedActivity.xp }} XP</span>
          </DialogDescription>
        </DialogHeader>

        <div class="py-6 whitespace-pre-wrap text-base leading-relaxed text-gray-700 dark:text-gray-300" v-if="selectedActivity">
          {{ selectedActivity.contenido || "No hay contenido disponible para esta actividad." }}
        </div>

        <DialogFooter class="sm:justify-between">
          <Button variant="outline" @click="isActivityModalOpen = false">Cerrar</Button>
          <Button :style="{ backgroundColor: module.color }" class="text-white gap-2" @click="completeSelectedActivity" v-if="selectedActivity && !selectedActivity.completed">
            <CheckCircle2 class="w-4 h-4" />
            Completar Actividad
          </Button>
          <Button variant="outline" disabled class="gap-2" v-if="selectedActivity && selectedActivity.completed">
            <CheckCircle2 class="w-4 h-4 text-green-500" />
            Completada
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

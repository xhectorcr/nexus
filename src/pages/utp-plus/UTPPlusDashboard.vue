<script setup lang="ts">
import { markRaw, ref, computed } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Home,
  MessageSquare,
  ThumbsUp,
  Search,
  Filter,
  Plus,
  TrendingUp,
  Award,
  Users,
  Sparkles,
  Share2
} from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const sidebarItems = computed(() => [
  { icon: markRaw(Home), label: t('nav.home') || 'Inicio', href: "/utp-plus" },
])

const categories = [
  "Todos",
  "Admisión",
  "Vida Universitaria",
  "Carreras",
  "Mentorías",
  "Dudas Generales"
]
const selectedCategory = ref("Todos")

const posts = ref([
  {
    id: 1,
    author: "María López",
    avatar: "M",
    role: "Estudiante de 5to ciclo",
    time: "hace 2 horas",
    title: "¿Cómo es el primer ciclo de Ingeniería de Sistemas?",
    content: "Hola a todos, estoy pensando en postular a Sistemas y quería saber qué tan difíciles son los primeros cursos de programación. ¿Algún consejo para empezar a estudiar antes de entrar?",
    category: "Carreras",
    likes: 15,
    comments: 8,
    isLiked: false
  },
  {
    id: 2,
    author: "Carlos Ruiz",
    avatar: "C",
    role: "Mentor UTP",
    time: "hace 5 horas",
    title: "Tips para organizar tu tiempo en la universidad",
    content: "El cambio del colegio a la universidad puede ser fuerte. Aquí les dejo 3 técnicas que me ayudaron a sobrevivir los parciales sin morir en el intento. La clave está en la técnica Pomodoro y en no dejar todo para el final.",
    category: "Vida Universitaria",
    likes: 42,
    comments: 12,
    isLiked: true
  },
  {
    id: 3,
    author: "Ana García",
    avatar: "A",
    role: "Postulante",
    time: "hace 1 día",
    title: "¿Qué documentos necesito para la matrícula?",
    content: "Ya pasé el examen de admisión (¡yay!) pero no estoy segura de qué documentos debo llevar presencialmente a la sede. ¿Alguien sabe si el certificado de estudios debe estar visado?",
    category: "Admisión",
    likes: 5,
    comments: 3,
    isLiked: false
  }
])

const filteredPosts = computed(() => {
  if (selectedCategory.value === "Todos") return posts.value;
  return posts.value.filter(p => p.category === selectedCategory.value);
})

const toggleLike = (id: number) => {
  const post = posts.value.find(p => p.id === id)
  if (post) {
    post.isLiked = !post.isLiked
    post.likes += post.isLiked ? 1 : -1
  }
}

const isWriting = ref(false)
const newPostTitle = ref("")
const newPostContent = ref("")
const newPostCategory = ref("Dudas Generales")

const submitPost = () => {
  if (!newPostTitle.value || !newPostContent.value) return;
  
  posts.value.unshift({
    id: Date.now(),
    author: "Tú",
    avatar: "T",
    role: "Postulante",
    time: "hace un momento",
    title: newPostTitle.value,
    content: newPostContent.value,
    category: newPostCategory.value,
    likes: 0,
    comments: 0,
    isLiked: false
  });
  
  newPostTitle.value = "";
  newPostContent.value = "";
  isWriting.value = false;
}
</script>

<template>
  <DashboardLayout
    :sidebarItems="sidebarItems"
    :title="'Foro NEXUS UTP+'"
    :subtitle="'La comunidad oficial para conectar, debatir y resolver tus dudas universitarias.'"
    :breadcrumbs="[
      { label: $t('nav.home') || 'Inicio', href: '/' },
      { label: 'Foro UTP+' }
    ]"
    moduleColor="#082065"
  >
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      <!-- Columna Principal: Lista de Posts -->
      <div class="lg:col-span-8 space-y-6">
        
        <!-- Header del Foro y Buscador -->
        <Card class="border-gray-200 shadow-sm bg-white overflow-hidden">
          <div class="h-2 bg-gradient-to-r from-[#082065] to-[#0D47A1]"></div>
          <CardContent class="p-5">
            <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div class="relative w-full md:max-w-md">
                <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input placeholder="Buscar discusiones, preguntas o temas..." class="pl-9 bg-gray-50 border-gray-200 focus-visible:ring-[#082065]" />
              </div>
              <Button @click="isWriting = true" class="w-full md:w-auto bg-[#082065] hover:bg-[#0D47A1] text-white shadow-md">
                <Plus class="w-4 h-4 mr-2" />
                Nueva Publicación
              </Button>
            </div>

            <!-- Filtros de Categorías -->
            <div class="flex flex-wrap gap-2 mt-5">
              <button
                v-for="cat in categories"
                :key="cat"
                @click="selectedCategory = cat"
                class="px-4 py-1.5 rounded-full text-sm font-semibold transition-all border"
                :class="selectedCategory === cat ? 'bg-[#082065] text-white border-[#082065] shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'"
              >
                {{ cat }}
              </button>
            </div>
          </CardContent>
        </Card>

        <!-- Formulario de Nueva Publicación (Expandible) -->
        <Card v-if="isWriting" class="border-[#082065]/20 shadow-md bg-blue-50/30">
          <CardHeader class="pb-3 border-b border-gray-100">
            <CardTitle class="text-lg flex items-center gap-2">
              <MessageSquare class="w-5 h-5 text-[#082065]" />
              Crear nueva publicación
            </CardTitle>
          </CardHeader>
          <CardContent class="pt-5 space-y-4">
            <div>
              <label class="text-sm font-medium text-gray-700 mb-1 block">Título de tu publicación</label>
              <Input v-model="newPostTitle" placeholder="Ej. ¿Alguien conoce buenos libros para cálculo?" class="bg-white border-gray-300" />
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700 mb-1 block">Detalles</label>
              <Textarea v-model="newPostContent" placeholder="Explica tu duda o comparte tu experiencia aquí..." class="min-h-[120px] bg-white border-gray-300 resize-none" />
            </div>
            <div class="flex items-center justify-between pt-2">
              <div class="flex items-center gap-2">
                <span class="text-sm font-medium text-gray-600">Categoría:</span>
                <select v-model="newPostCategory" class="text-sm border-gray-300 rounded-md bg-white py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-[#082065]">
                  <option v-for="cat in categories.filter(c => c !== 'Todos')" :key="cat" :value="cat">{{ cat }}</option>
                </select>
              </div>
              <div class="flex gap-2">
                <Button variant="ghost" @click="isWriting = false" class="text-gray-500 hover:bg-gray-100">Cancelar</Button>
                <Button @click="submitPost" class="bg-[#082065] hover:bg-[#0D47A1]">Publicar</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Lista de Publicaciones -->
        <div class="space-y-4">
          <Card v-for="post in filteredPosts" :key="post.id" class="border-gray-200 hover:border-gray-300 transition-all hover:shadow-md cursor-pointer group">
            <CardContent class="p-5">
              <div class="flex items-start gap-4">
                <Avatar class="w-10 h-10 ring-2 ring-gray-100">
                  <AvatarFallback class="bg-[#082065] text-white font-bold">{{ post.avatar }}</AvatarFallback>
                </Avatar>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1 flex-wrap">
                    <span class="font-bold text-gray-900">{{ post.author }}</span>
                    <Badge variant="secondary" class="bg-blue-50 text-[#082065] hover:bg-blue-100 text-[10px] uppercase font-bold tracking-wider">
                      {{ post.role }}
                    </Badge>
                    <span class="text-xs text-gray-500 flex items-center before:content-['•'] before:mr-2">{{ post.time }}</span>
                  </div>
                  
                  <h3 class="text-lg font-bold text-gray-900 mt-2 mb-1 group-hover:text-[#082065] transition-colors">
                    {{ post.title }}
                  </h3>
                  <p class="text-gray-600 text-sm leading-relaxed line-clamp-2">
                    {{ post.content }}
                  </p>
                  
                  <div class="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                    <button 
                      @click.stop="toggleLike(post.id)" 
                      class="flex items-center gap-1.5 text-sm font-medium transition-colors"
                      :class="post.isLiked ? 'text-emerald-600' : 'text-gray-500 hover:text-emerald-600'"
                    >
                      <ThumbsUp class="w-4 h-4" :class="post.isLiked ? 'fill-emerald-600' : ''" />
                      {{ post.likes }}
                    </button>
                    <button class="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-[#082065] transition-colors">
                      <MessageSquare class="w-4 h-4" />
                      {{ post.comments }} Respuestas
                    </button>
                    <Badge variant="outline" class="ml-auto text-xs font-semibold text-gray-500 border-gray-200">
                      {{ post.category }}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div v-if="filteredPosts.length === 0" class="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
            <MessageSquare class="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 class="text-lg font-bold text-gray-700">No hay publicaciones</h3>
            <p class="text-gray-500 text-sm">Sé el primero en iniciar una discusión en esta categoría.</p>
            <Button @click="isWriting = true" variant="outline" class="mt-4 border-[#082065] text-[#082065]">Crear publicación</Button>
          </div>
        </div>
      </div>

      <!-- Columna Derecha: Sidebar del Foro -->
      <div class="lg:col-span-4 space-y-6">
        
        <!-- Comunidad UTP+ -->
        <Card class="border-gray-200 shadow-sm bg-gradient-to-br from-[#082065] to-[#0D47A1] text-white">
          <CardContent class="p-6">
            <div class="flex items-center gap-3 mb-4">
              <div class="p-2 bg-white/10 rounded-xl">
                <Sparkles class="w-6 h-6 text-white" />
              </div>
              <h3 class="font-bold text-lg">Comunidad UTP+</h3>
            </div>
            <p class="text-blue-100 text-sm leading-relaxed mb-6">
              El lugar perfecto para resolver tus dudas, compartir experiencias y conectar con futuros compañeros y mentores.
            </p>
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-black/20 p-3 rounded-lg text-center">
                <div class="text-2xl font-black">2.4k</div>
                <div class="text-xs text-blue-200 font-medium">Miembros</div>
              </div>
              <div class="bg-black/20 p-3 rounded-lg text-center">
                <div class="text-2xl font-black">156</div>
                <div class="text-xs text-blue-200 font-medium">Online</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Temas Populares -->
        <Card class="border-gray-200 shadow-sm">
          <CardHeader class="pb-3 border-b border-gray-100">
            <CardTitle class="text-base flex items-center gap-2">
              <TrendingUp class="w-4 h-4 text-[#082065]" />
              Temas Populares
            </CardTitle>
          </CardHeader>
          <CardContent class="p-0">
            <div class="divide-y divide-gray-100">
              <a href="#" class="block p-4 hover:bg-gray-50 transition-colors">
                <h4 class="font-bold text-sm text-gray-800 mb-1 line-clamp-1">¿Qué laptop recomiendan para Ingeniería?</h4>
                <p class="text-xs text-gray-500">45 respuestas • Carreras</p>
              </a>
              <a href="#" class="block p-4 hover:bg-gray-50 transition-colors">
                <h4 class="font-bold text-sm text-gray-800 mb-1 line-clamp-1">Proceso de matrícula paso a paso</h4>
                <p class="text-xs text-gray-500">32 respuestas • Admisión</p>
              </a>
              <a href="#" class="block p-4 hover:bg-gray-50 transition-colors">
                <h4 class="font-bold text-sm text-gray-800 mb-1 line-clamp-1">Conociendo el campus central</h4>
                <p class="text-xs text-gray-500">18 respuestas • Vida Universitaria</p>
              </a>
            </div>
          </CardContent>
        </Card>

        <!-- Mentores Destacados -->
        <Card class="border-gray-200 shadow-sm">
          <CardHeader class="pb-3 border-b border-gray-100">
            <CardTitle class="text-base flex items-center gap-2">
              <Award class="w-4 h-4 text-amber-500" />
              Mentores Destacados
            </CardTitle>
          </CardHeader>
          <CardContent class="p-4 space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <Avatar class="w-8 h-8">
                  <AvatarFallback class="bg-amber-100 text-amber-700 font-bold">C</AvatarFallback>
                </Avatar>
                <div>
                  <p class="text-sm font-bold text-gray-900">Carlos Ruiz</p>
                  <p class="text-xs text-gray-500">Ing. de Sistemas</p>
                </div>
              </div>
              <Badge variant="secondary" class="bg-amber-50 text-amber-700 text-[10px]">Top Contribuidor</Badge>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <Avatar class="w-8 h-8">
                  <AvatarFallback class="bg-blue-100 text-blue-700 font-bold">S</AvatarFallback>
                </Avatar>
                <div>
                  <p class="text-sm font-bold text-gray-900">Sofía Mendoza</p>
                  <p class="text-xs text-gray-500">Psicología</p>
                </div>
              </div>
              <Badge variant="secondary" class="bg-gray-100 text-gray-600 text-[10px]">Mentor Activo</Badge>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  </DashboardLayout>
</template>

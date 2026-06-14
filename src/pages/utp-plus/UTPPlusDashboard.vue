<script setup lang="ts">
import { markRaw, ref, computed, onMounted } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Home,
  MessageSquare,
  ThumbsUp,
  Search,
  Plus,
  Lock
} from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { api } from '@/lib/api'
import { useAuth } from '@/lib/auth'
import type { PublicacionForo } from '@/types/models'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const auth = useAuth()
const router = useRouter()

const sidebarItems = computed(() => [
  { icon: markRaw(Home), label: t('nav.home') || 'Inicio', href: "/utp-plus" },
])

const categories = [
  "Todos",
  "Ingeniería de Sistemas",
  "Ingeniería Civil",
  "Psicología",
  "Derecho",
  "Medicina"
]
const selectedCategory = ref("Todos")

const posts = ref<PublicacionForo[]>([])
const isWriting = ref(false)
const newPostTitle = ref("")
const newPostContent = ref("")
const newPostCategory = ref("Ingeniería de Sistemas")
const expandedPostId = ref<number | null>(null)
const newCommentContent = ref<Record<number, string>>({})

const showAuthModal = ref(false)

const filteredPosts = computed(() => {
  if (selectedCategory.value === "Todos") return posts.value;
  return posts.value.filter(p => p.carrera === selectedCategory.value);
})

const fetchPosts = async () => {
  try {
    const response = await api.get('/api/foro');
    posts.value = response.data.data;
  } catch (error) {
    console.error("Error cargando foro:", error);
  }
}

const requireAuth = (): boolean => {
  if (!auth.state.user) {
    showAuthModal.value = true;
    return false;
  }
  return true;
}

const toggleLike = async (post: PublicacionForo) => {
  if (!requireAuth()) return;
  try {
    const res = await api.post(`/api/foro/${post.id}/like`);
    if (res.data.success) {
      post.likedByCurrentUser = res.data.data.liked;
      post.conteoLikes = res.data.data.likes;
    }
  } catch (e) {
    console.error("Error al dar like", e);
  }
}

const submitPost = async () => {
  if (!requireAuth()) return;
  if (!newPostTitle.value || !newPostContent.value) return;
  
  // Buscar el id de la carrera seleccionada (mock simple para el seeder)
  let carreraId = 1; // Sistemas por defecto
  if (newPostCategory.value === "Ingeniería Civil") carreraId = 2;
  else if (newPostCategory.value === "Psicología") carreraId = 3;
  else if (newPostCategory.value === "Derecho") carreraId = 4;
  else if (newPostCategory.value === "Medicina") carreraId = 5;

  try {
    const res = await api.post('/api/foro', {
      titulo: newPostTitle.value,
      contenido: newPostContent.value,
      carreraId: carreraId,
      etiquetas: ["General"]
    });
    if (res.data.success) {
      posts.value.unshift(res.data.data);
      newPostTitle.value = "";
      newPostContent.value = "";
      isWriting.value = false;
    }
  } catch (e) {
    console.error("Error creando publicación", e);
  }
}

const submitComment = async (postId: number) => {
  if (!requireAuth()) return;
  const content = newCommentContent.value[postId];
  if (!content || content.trim() === "") return;

  try {
    const res = await api.post(`/api/foro/${postId}/comentarios`, {
      contenido: content
    });
    if (res.data.success) {
      const post = posts.value.find(p => p.id === postId);
      if (post) {
        if (!post.comentarios) post.comentarios = [];
        post.comentarios.push(res.data.data);
      }
      newCommentContent.value[postId] = ""; // Limpiar input
    }
  } catch (e) {
    console.error("Error creando comentario", e);
  }
}

const toggleComments = (postId: number) => {
  if (expandedPostId.value === postId) {
    expandedPostId.value = null;
  } else {
    expandedPostId.value = postId;
  }
}

const formatDate = (dateString: string) => {
  const d = new Date(dateString);
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const getInitials = (nombre: string, apellido: string) => {
  return `${nombre?.charAt(0) || ''}${apellido?.charAt(0) || ''}`.toUpperCase() || 'U';
}

const goToLogin = () => {
  showAuthModal.value = false;
  router.push('/login');
}

onMounted(() => {
  fetchPosts();
})

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
    <div class="max-w-4xl mx-auto">
      
      <!-- Contenedor Principal: Lista de Posts -->
      <div class="space-y-6">
        
        <!-- Header del Foro y Buscador -->
        <Card class="border-gray-200 shadow-sm bg-white overflow-hidden">
          <div class="h-2 bg-gradient-to-r from-[#082065] to-[#0D47A1]"></div>
          <CardContent class="p-5">
            <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div class="relative w-full md:max-w-md">
                <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input placeholder="Buscar discusiones, preguntas o temas..." class="pl-9 bg-gray-50 border-gray-200 focus-visible:ring-[#082065]" />
              </div>
              <Button @click="() => requireAuth() && (isWriting = true)" class="w-full md:w-auto bg-[#082065] hover:bg-[#0D47A1] text-white shadow-md">
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
                <Button @click="submitPost" class="bg-[#082065] hover:bg-[#0D47A1]" :disabled="!newPostTitle || !newPostContent">Publicar</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Lista de Publicaciones -->
        <div class="space-y-4">
          <Card v-for="post in filteredPosts" :key="post.id" class="border-gray-200 transition-all shadow-sm group">
            <CardContent class="p-5">
              <div class="flex items-start gap-4">
                <Avatar class="w-10 h-10 ring-2 ring-gray-100">
                  <AvatarFallback class="bg-[#082065] text-white font-bold">{{ getInitials(post.autor?.nombre, post.autor?.apellido) }}</AvatarFallback>
                </Avatar>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1 flex-wrap">
                    <span class="font-bold text-gray-900">{{ post.autor?.nombre }} {{ post.autor?.apellido }}</span>
                    <Badge variant="secondary" class="bg-blue-50 text-[#082065] text-[10px] uppercase font-bold tracking-wider">
                      Lvl {{ post.nivelAutor || 1 }}
                    </Badge>
                    <span class="text-xs text-gray-500 flex items-center before:content-['•'] before:mr-2">{{ formatDate(post.fechaCreacion) }}</span>
                  </div>
                  
                  <h3 class="text-lg font-bold text-gray-900 mt-2 mb-1 transition-colors cursor-pointer hover:text-[#082065]" @click="toggleComments(post.id)">
                    {{ post.titulo }}
                  </h3>
                  <p class="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                    {{ post.contenido }}
                  </p>
                  
                  <div class="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                    <button 
                      @click="toggleLike(post)" 
                      class="flex items-center gap-1.5 text-sm font-medium transition-colors"
                      :class="post.likedByCurrentUser ? 'text-emerald-600' : 'text-gray-500 hover:text-emerald-600'"
                    >
                      <ThumbsUp class="w-4 h-4" :class="post.likedByCurrentUser ? 'fill-emerald-600' : ''" />
                      {{ post.conteoLikes || 0 }}
                    </button>
                    <button @click="toggleComments(post.id)" class="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-[#082065] transition-colors">
                      <MessageSquare class="w-4 h-4" />
                      {{ post.comentarios?.length || 0 }} Respuestas
                    </button>
                    <Badge variant="outline" class="ml-auto text-xs font-semibold text-gray-500 border-gray-200">
                      {{ post.carrera || 'General' }}
                    </Badge>
                  </div>

                  <!-- Sección de Comentarios (Expandible) -->
                  <div v-if="expandedPostId === post.id" class="mt-4 pt-4 border-t border-gray-100 space-y-4">
                    <div v-for="comentario in post.comentarios" :key="comentario.id" class="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <div class="flex items-center gap-2 mb-2">
                        <Avatar class="w-6 h-6">
                          <AvatarFallback class="bg-gray-200 text-gray-700 text-xs font-bold">{{ getInitials(comentario.autor?.nombre, comentario.autor?.apellido) }}</AvatarFallback>
                        </Avatar>
                        <span class="font-bold text-sm text-gray-900">{{ comentario.autor?.nombre }} {{ comentario.autor?.apellido }}</span>
                        <span class="text-xs text-gray-500">{{ formatDate(comentario.fechaCreacion) }}</span>
                      </div>
                      <p class="text-sm text-gray-700 pl-8 whitespace-pre-wrap">{{ comentario.contenido }}</p>
                    </div>

                    <!-- Escribir Comentario -->
                    <div class="flex gap-3 mt-4 items-start">
                      <Avatar class="w-8 h-8">
                        <AvatarFallback class="bg-[#082065] text-white font-bold">Tú</AvatarFallback>
                      </Avatar>
                      <div class="flex-1 space-y-2">
                        <Textarea 
                          v-model="newCommentContent[post.id]" 
                          placeholder="Escribe una respuesta..." 
                          class="min-h-[60px] resize-none bg-white border-gray-300"
                          @click="requireAuth()"
                        />
                        <div class="flex justify-end">
                          <Button size="sm" @click="submitComment(post.id)" class="bg-[#082065] hover:bg-[#0D47A1]" :disabled="!newCommentContent[post.id]">Responder</Button>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </CardContent>
          </Card>
          
          <div v-if="filteredPosts.length === 0" class="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
            <MessageSquare class="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 class="text-lg font-bold text-gray-700">No hay publicaciones</h3>
            <p class="text-gray-500 text-sm">Sé el primero en iniciar una discusión en esta categoría.</p>
            <Button @click="() => requireAuth() && (isWriting = true)" variant="outline" class="mt-4 border-[#082065] text-[#082065]">Crear publicación</Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Autenticación Requerida -->
    <Dialog :open="showAuthModal" @update:open="showAuthModal = $event">
      <DialogContent class="sm:max-w-md border-0 bg-white shadow-2xl">
        <DialogHeader>
          <DialogTitle class="flex items-center gap-2 text-[#082065]">
            <Lock class="w-5 h-5 text-amber-500" />
            Autenticación Requerida
          </DialogTitle>
          <DialogDescription class="pt-2 text-slate-600 font-medium">
            Para interactuar con la comunidad (crear publicaciones, dar Me Gusta o comentar), necesitas iniciar sesión en tu cuenta de NEXUS. Puedes seguir leyendo libremente.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter class="sm:justify-between flex gap-2 mt-4">
          <Button
            variant="outline"
            @click="showAuthModal = false"
            class="border-gray-200"
          >
            Seguir leyendo
          </Button>
          <Button
            @click="goToLogin"
            class="bg-[#082065] hover:bg-[#0D47A1]"
          >
            Iniciar Sesión
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

  </DashboardLayout>
</template>

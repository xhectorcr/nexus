<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GraduationCap, Users, Sparkles, ArrowRight } from 'lucide-vue-next'

const router = useRouter()
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-[#FAF7F7] via-white to-[#F1F1F1]">
    <!-- Header -->
    <header class="border-b border-[#D9D9D9] bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div class="container mx-auto px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#B50E30] to-[#8F0B26] flex items-center justify-center">
            <GraduationCap class="w-6 h-6 text-white" />
          </div>
          <span class="font-semibold text-xl text-[#1F1F1F]">NEXUS</span>
        </div>
        <nav class="flex items-center gap-4">
          <Button variant="ghost">Sobre nosotros</Button>
          <Button variant="ghost" @click="router.push('/login')">Iniciar Sesión</Button>
          <Button class="bg-[#B50E30] hover:bg-[#8F0B26] text-white" @click="router.push('/register')">Registrarse</Button>
        </nav>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="container mx-auto px-6 py-20">
      <div class="max-w-4xl mx-auto text-center">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#B50E30]/10 border border-[#B50E30]/20 mb-6">
          <Sparkles class="w-4 h-4 text-[#B50E30]" />
          <span class="text-sm text-[#B50E30] font-medium">Powered by AI</span>
        </div>
        <h1 class="text-5xl md:text-6xl font-bold text-[#1F1F1F] mb-6 leading-tight">
          Tu camino hacia la<br />
          <span class="bg-gradient-to-r from-[#B50E30] to-[#D13C5B] bg-clip-text text-transparent">
            orientación vocacional
          </span>
        </h1>
        <p class="text-xl text-[#5F6368] mb-12 max-w-2xl mx-auto">
          NEXUS conecta estudiantes, familias y la UTP para descubrir tu verdadera vocación 
          a través de inteligencia artificial y experiencias personalizadas.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" class="bg-[#B50E30] hover:bg-[#8F0B26] text-white" @click="router.push('/register')">
            Comenzar ahora
            <ArrowRight class="w-5 h-5 ml-2" />
          </Button>
          <Button size="lg" variant="outline" @click="router.push('/login')">
            Ya tengo cuenta
          </Button>
        </div>
      </div>
    </section>

    <!-- Modules Section -->
    <section class="container mx-auto px-6 py-20">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-[#1F1F1F] mb-4">
          Tres módulos diseñados para ti
        </h2>
        <p class="text-lg text-[#5F6368]">
          Una plataforma completa para cada etapa de tu viaje
        </p>
      </div>

      <div class="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <!-- NEXUS Postulante -->
        <router-link to="/postulante">
          <Card class="h-full hover:shadow-xl transition-all duration-300 border-[#D9D9D9] group cursor-pointer">
            <CardHeader>
              <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#B50E30] to-[#8F0B26] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <GraduationCap class="w-7 h-7 text-white" />
              </div>
              <CardTitle class="text-[#1F1F1F]">NEXUS Postulante</CardTitle>
              <CardDescription class="text-[#5F6368]">
                Descubre tu vocación con IA, minijuegos y conexión P2P
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul class="space-y-2 text-sm text-[#5F6368]">
                <li class="flex items-center gap-2">
                  <div class="w-1.5 h-1.5 rounded-full bg-[#B50E30]" />
                  Laberinto de Vocaciones
                </li>
                <li class="flex items-center gap-2">
                  <div class="w-1.5 h-1.5 rounded-full bg-[#B50E30]" />
                  Bitácora Digital
                </li>
                <li class="flex items-center gap-2">
                  <div class="w-1.5 h-1.5 rounded-full bg-[#B50E30]" />
                  Chat con Mentores
                </li>
              </ul>
              <Button variant="ghost" class="w-full mt-6 text-[#B50E30] group-hover:bg-[#B50E30]/10">
                Explorar módulo
                <ArrowRight class="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </router-link>

        <!-- NEXUS Familia -->
        <router-link to="/familia">
          <Card class="h-full hover:shadow-xl transition-all duration-300 border-[#D9D9D9] group cursor-pointer">
            <CardHeader>
              <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D4A017] to-[#B8870F] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users class="w-7 h-7 text-white" />
              </div>
              <CardTitle class="text-[#1F1F1F]">NEXUS Familia</CardTitle>
              <CardDescription class="text-[#5F6368]">
                Dashboard para padres con progreso, recursos y foro
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul class="space-y-2 text-sm text-[#5F6368]">
                <li class="flex items-center gap-2">
                  <div class="w-1.5 h-1.5 rounded-full bg-[#D4A017]" />
                  Panel de Progreso
                </li>
                <li class="flex items-center gap-2">
                  <div class="w-1.5 h-1.5 rounded-full bg-[#D4A017]" />
                  Recursos y Guías
                </li>
                <li class="flex items-center gap-2">
                  <div class="w-1.5 h-1.5 rounded-full bg-[#D4A017]" />
                  Foro Moderado
                </li>
              </ul>
              <Button variant="ghost" class="w-full mt-6 text-[#D4A017] group-hover:bg-[#D4A017]/10">
                Explorar módulo
                <ArrowRight class="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </router-link>

        <!-- NEXUS UTP+ -->
        <router-link to="/utp-plus">
          <Card class="h-full hover:shadow-xl transition-all duration-300 border-[#D9D9D9] group cursor-pointer">
            <CardHeader>
              <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1565C0] to-[#0D47A1] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sparkles class="w-7 h-7 text-white" />
              </div>
              <CardTitle class="text-[#1F1F1F]">NEXUS UTP+</CardTitle>
              <CardDescription class="text-[#5F6368]">
                Intermediario inteligente con IA y matchmaking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul class="space-y-2 text-sm text-[#5F6368]">
                <li class="flex items-center gap-2">
                  <div class="w-1.5 h-1.5 rounded-full bg-[#1565C0]" />
                  Perfil de Carrera
                </li>
                <li class="flex items-center gap-2">
                  <div class="w-1.5 h-1.5 rounded-full bg-[#1565C0]" />
                  Matchmaking IA
                </li>
                <li class="flex items-center gap-2">
                  <div class="w-1.5 h-1.5 rounded-full bg-[#1565C0]" />
                  Análisis de Bitácora
                </li>
              </ul>
              <Button variant="ghost" class="w-full mt-6 text-[#1565C0] group-hover:bg-[#1565C0]/10">
                Explorar módulo
                <ArrowRight class="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </router-link>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-[#D9D9D9] mt-20">
      <div class="container mx-auto px-6 py-8">
        <div class="flex flex-col md:flex-row items-center justify-between">
          <div class="flex items-center gap-2 mb-4 md:mb-0">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-[#B50E30] to-[#8F0B26] flex items-center justify-center">
              <GraduationCap class="w-5 h-5 text-white" />
            </div>
            <span class="font-semibold text-[#1F1F1F]">NEXUS</span>
            <span class="text-sm text-[#5F6368]">by UTP</span>
          </div>
          <p class="text-sm text-[#5F6368]">
            © 2026 NEXUS - Universidad Tecnológica del Perú
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

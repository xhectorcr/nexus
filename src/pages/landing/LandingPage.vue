<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GraduationCap, Users, Sparkles, ArrowRight, Menu, X } from 'lucide-vue-next'
import LanguageSelector from '@/components/LanguageSelector.vue'
import ThreeBook from '@/components/ThreeBook.vue'

const router = useRouter()

// Mobile menu state
const isMobileMenuOpen = ref(false)
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

// Scroll tracking for Scrollytelling
const scrollProgress = ref(0)

const onScroll = () => {
  const maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1)
  scrollProgress.value = window.scrollY / maxScroll
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

const heroOpacity = computed(() => {
  if (scrollProgress.value < 0.2) return 1
  if (scrollProgress.value > 0.35) return 0
  return 1 - ((scrollProgress.value - 0.2) / 0.15)
})

const modulesOpacity = computed(() => {
  if (scrollProgress.value < 0.75) return 0
  if (scrollProgress.value > 0.9) return 1
  return (scrollProgress.value - 0.75) / 0.15
})

const modulesPointerEvents = computed(() => scrollProgress.value > 0.8 ? 'auto' : 'none')
</script>

<template>
  <div class="h-[400vh] relative bg-transparent">
    <!-- Premium Vibrant Mesh Gradient Background -->
    <div class="fixed inset-0 pointer-events-none z-[-20] overflow-hidden bg-[#FAFAFA]">
      <div class="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-rose-200/40 to-orange-100/40 blur-[100px]"></div>
      <div class="absolute top-[20%] right-[-20%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-bl from-violet-200/40 to-fuchsia-200/40 blur-[120px]"></div>
      <div class="absolute bottom-[-10%] left-[10%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-tr from-blue-200/30 to-cyan-100/30 blur-[130px]"></div>
    </div>
    <ThreeBook />
    <!-- Header -->
    <header class="fixed inset-x-0 border-b border-[#D9D9D9] bg-white/80 backdrop-blur-md top-0 z-50 transition-opacity duration-500" :style="{ opacity: Math.max(0.7, heroOpacity) }">
      <div class="container flex items-center justify-between px-6 py-4 mx-auto">
        <div class="flex items-center gap-2">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#B50E30] to-[#8F0B26] flex items-center justify-center">
            <GraduationCap class="w-6 h-6 text-white" />
          </div>
          <span class="font-semibold text-xl text-[#1F1F1F]">NEXUS</span>
        </div>
        <!-- Desktop Nav -->
        <nav class="hidden md:flex items-center gap-4">
          <LanguageSelector />
          <Button variant="ghost" @click="router.push('/login')">{{ $t('landing.login') }}</Button>
          <Button class="bg-[#B50E30] hover:bg-[#8F0B26] text-white" @click="router.push('/register')">{{ $t('landing.register') }}</Button>
        </nav>

        <!-- Mobile Nav Toggle -->
        <div class="md:hidden flex items-center gap-2">
          <LanguageSelector />
          <button @click="toggleMobileMenu" class="text-[#1F1F1F] p-2 focus:outline-none">
            <Menu v-if="!isMobileMenuOpen" class="w-6 h-6" />
            <X v-else class="w-6 h-6" />
          </button>
        </div>
      </div>

      <!-- Mobile Dropdown -->
      <transition 
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform -translate-y-4 opacity-0"
        enter-to-class="transform translate-y-0 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="transform translate-y-0 opacity-100"
        leave-to-class="transform -translate-y-4 opacity-0"
      >
        <div v-if="isMobileMenuOpen" class="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-[#D9D9D9] shadow-lg p-4 flex flex-col gap-2">
          <Button variant="ghost" class="w-full justify-center" @click="router.push('/login'); isMobileMenuOpen = false">
            {{ $t('landing.login') }}
          </Button>
          <Button class="w-full bg-[#B50E30] hover:bg-[#8F0B26] text-white justify-center" @click="router.push('/register'); isMobileMenuOpen = false">
            {{ $t('landing.register') }}
          </Button>
        </div>
      </transition>
    </header>

    <!-- Fixed Overlay for Scroll Narrative -->
    <div class="fixed inset-0 z-10 pointer-events-none flex flex-col justify-center pt-20">
      
      <!-- Hero Section -->
      <section class="container px-6 mx-auto absolute inset-0 flex flex-col justify-center" 
               :style="{ opacity: heroOpacity, pointerEvents: heroOpacity > 0.5 ? 'auto' : 'none', transition: 'opacity 0.1s' }">
        <div class="max-w-4xl mx-auto text-center transform lg:translate-x-[-15%] xl:translate-x-[-20%]">

          <h1 class="text-5xl md:text-6xl font-bold text-[#1F1F1F] mb-6 leading-tight">
            {{ $t('landing.hero_title_1') }}<br />
            <span class="bg-gradient-to-r from-[#B50E30] to-[#D13C5B] bg-clip-text text-transparent">
              {{ $t('landing.hero_title_2') }}
            </span>
          </h1>
          <p class="text-xl text-[#5F6368] mb-12 max-w-2xl mx-auto">
            {{ $t('landing.hero_desc') }}
          </p>
          <div class="flex flex-col justify-center gap-4 sm:flex-row">
            <Button size="lg" class="bg-[#B50E30] hover:bg-[#8F0B26] text-white" @click="router.push('/register')">
              {{ $t('landing.start_now') }}
              <ArrowRight class="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" @click="router.push('/login')">
              {{ $t('landing.have_account') }}
            </Button>
          </div>
        </div>
      </section>

      <!-- Modules Section (Hidden initially, appears over the open book) -->
      <section class="container px-6 mx-auto absolute inset-0 flex flex-col justify-center items-center"
               :style="{ opacity: modulesOpacity, pointerEvents: modulesPointerEvents, transition: 'opacity 0.1s' }">
      <div class="mb-12 text-center">
        <div class="inline-block bg-white/95 backdrop-blur-md py-6 px-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/20">
          <h2 class="text-3xl font-bold text-[#1F1F1F] mb-3">
            {{ $t('landing.modules_title') }}
          </h2>
          <p class="text-lg text-[#5F6368]">
            {{ $t('landing.modules_subtitle') }}
          </p>
        </div>
      </div>

      <div class="grid max-w-6xl gap-6 mx-auto md:grid-cols-3">
        <!-- NEXUS Postulante -->
        <router-link to="/postulante">
          <Card class="h-full hover:shadow-xl transition-all duration-300 border-[#D9D9D9] group cursor-pointer">
            <CardHeader>
              <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#082065] to-[#0D47A1] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md">
                <GraduationCap class="text-white w-7 h-7" />
              </div>
              <CardTitle class="text-[#1F1F1F]">{{ $t('landing.module1_title') }}</CardTitle>
              <CardDescription class="text-[#5F6368]">
                {{ $t('landing.module1_desc') }}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul class="space-y-2 text-sm text-[#5F6368]">
                <li class="flex items-center gap-2">
                  <div class="w-1.5 h-1.5 rounded-full bg-[#082065]" />
                  {{ $t('landing.module1_f1') }}
                </li>
                <li class="flex items-center gap-2">
                  <div class="w-1.5 h-1.5 rounded-full bg-[#082065]" />
                  {{ $t('landing.module1_f2') }}
                </li>
                <li class="flex items-center gap-2">
                  <div class="w-1.5 h-1.5 rounded-full bg-[#082065]" />
                  {{ $t('landing.module1_f3') }}
                </li>
              </ul>
              <Button variant="ghost" class="w-full mt-6 text-[#082065] group-hover:bg-[#082065]/10">
                {{ $t('landing.explore') }}
                <ArrowRight class="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </router-link>

        <!-- NEXUS Familia -->
        <router-link to="/familia">
          <Card class="h-full hover:shadow-xl transition-all duration-300 border-[#D9D9D9] group cursor-pointer">
            <CardHeader>
              <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFB20D] to-[#B8870F] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users class="text-white w-7 h-7" />
              </div>
              <CardTitle class="text-[#1F1F1F]">{{ $t('landing.module2_title') }}</CardTitle>
              <CardDescription class="text-[#5F6368]">
                {{ $t('landing.module2_desc') }}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul class="space-y-2 text-sm text-[#5F6368]">
                <li class="flex items-center gap-2">
                  <div class="w-1.5 h-1.5 rounded-full bg-[#D4A017]" />
                  {{ $t('landing.module2_f1') }}
                </li>
                <li class="flex items-center gap-2">
                  <div class="w-1.5 h-1.5 rounded-full bg-[#D4A017]" />
                  {{ $t('landing.module2_f2') }}
                </li>
                <li class="flex items-center gap-2">
                  <div class="w-1.5 h-1.5 rounded-full bg-[#D4A017]" />
                  {{ $t('landing.module2_f3') }}
                </li>
              </ul>
              <Button variant="ghost" class="w-full mt-6 text-[#D4A017] group-hover:bg-[#D4A017]/10">
                {{ $t('landing.explore') }}
                <ArrowRight class="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </router-link>

        <!-- NEXUS UTP+ -->
        <router-link to="/utp-plus">
          <Card class="h-full hover:shadow-xl transition-all duration-300 border-[#D9D9D9] group cursor-pointer">
            <CardHeader>
              <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#B50E30] to-[#8F0B26] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md">
                <Sparkles class="text-white w-7 h-7" />
              </div>
              <CardTitle class="text-[#1F1F1F]">{{ $t('landing.module3_title') }}</CardTitle>
              <CardDescription class="text-[#5F6368]">
                {{ $t('landing.module3_desc') }}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul class="space-y-2 text-sm text-[#5F6368]">
                <li class="flex items-center gap-2">
                  <div class="w-1.5 h-1.5 rounded-full bg-[#B50E30]" />
                  {{ $t('landing.module3_f1') }}
                </li>
                <li class="flex items-center gap-2">
                  <div class="w-1.5 h-1.5 rounded-full bg-[#B50E30]" />
                  {{ $t('landing.module3_f2') }}
                </li>
                <li class="flex items-center gap-2">
                  <div class="w-1.5 h-1.5 rounded-full bg-[#B50E30]" />
                  {{ $t('landing.module3_f3') }}
                </li>
              </ul>
              <Button variant="ghost" class="w-full mt-6 text-[#B50E30] group-hover:bg-[#B50E30]/10">
                {{ $t('landing.explore') }}
                <ArrowRight class="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </router-link>
      </div>
    </section>
    </div>

    <!-- Footer (Fixed at the bottom but fades in) -->
    <footer class="fixed bottom-0 inset-x-0 pointer-events-none z-50 transition-opacity duration-300" :style="{ opacity: modulesOpacity }">
      <div class="container px-6 py-4 mx-auto border-t border-[#D9D9D9] bg-white/50 backdrop-blur-sm pointer-events-auto rounded-t-2xl">
        <div class="flex flex-col items-center justify-between md:flex-row">
          <div class="flex items-center gap-2 mb-2 md:mb-0">
            <div class="w-6 h-6 rounded bg-gradient-to-br from-[#B50E30] to-[#8F0B26] flex items-center justify-center">
              <GraduationCap class="w-4 h-4 text-white" />
            </div>
            <span class="font-semibold text-[#1F1F1F] text-sm">NEXUS</span>
            <span class="text-xs text-[#5F6368]">by UTP</span>
          </div>
          <p class="text-xs text-[#5F6368]">
            {{ $t('landing.footer') }}
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

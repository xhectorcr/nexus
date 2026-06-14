<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GraduationCap, Users, Sparkles, ArrowRight } from 'lucide-vue-next'
import LanguageSelector from '@/components/LanguageSelector.vue'

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
          <LanguageSelector />
          <Button variant="ghost">{{ $t('landing.about') }}</Button>
          <Button variant="ghost" @click="router.push('/login')">{{ $t('landing.login') }}</Button>
          <Button class="bg-[#B50E30] hover:bg-[#8F0B26] text-white" @click="router.push('/register')">{{ $t('landing.register') }}</Button>
        </nav>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="container mx-auto px-6 py-20">
      <div class="max-w-4xl mx-auto text-center">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#B50E30]/10 border border-[#B50E30]/20 mb-6">
          <Sparkles class="w-4 h-4 text-[#B50E30]" />
          <span class="text-sm text-[#B50E30] font-medium">{{ $t('landing.powered') }}</span>
        </div>
        <h1 class="text-5xl md:text-6xl font-bold text-[#1F1F1F] mb-6 leading-tight">
          {{ $t('landing.hero_title_1') }}<br />
          <span class="bg-gradient-to-r from-[#B50E30] to-[#D13C5B] bg-clip-text text-transparent">
            {{ $t('landing.hero_title_2') }}
          </span>
        </h1>
        <p class="text-xl text-[#5F6368] mb-12 max-w-2xl mx-auto">
          {{ $t('landing.hero_desc') }}
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
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

    <!-- Modules Section -->
    <section class="container mx-auto px-6 py-20">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-[#1F1F1F] mb-4">
          {{ $t('landing.modules_title') }}
        </h2>
        <p class="text-lg text-[#5F6368]">
          {{ $t('landing.modules_subtitle') }}
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
              <CardTitle class="text-[#1F1F1F]">{{ $t('landing.module1_title') }}</CardTitle>
              <CardDescription class="text-[#5F6368]">
                {{ $t('landing.module1_desc') }}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul class="space-y-2 text-sm text-[#5F6368]">
                <li class="flex items-center gap-2">
                  <div class="w-1.5 h-1.5 rounded-full bg-[#B50E30]" />
                  {{ $t('landing.module1_f1') }}
                </li>
                <li class="flex items-center gap-2">
                  <div class="w-1.5 h-1.5 rounded-full bg-[#B50E30]" />
                  {{ $t('landing.module1_f2') }}
                </li>
                <li class="flex items-center gap-2">
                  <div class="w-1.5 h-1.5 rounded-full bg-[#B50E30]" />
                  {{ $t('landing.module1_f3') }}
                </li>
              </ul>
              <Button variant="ghost" class="w-full mt-6 text-[#B50E30] group-hover:bg-[#B50E30]/10">
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
                <Users class="w-7 h-7 text-white" />
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
              <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#082065] to-[#0D47A1] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sparkles class="w-7 h-7 text-white" />
              </div>
              <CardTitle class="text-[#1F1F1F]">{{ $t('landing.module3_title') }}</CardTitle>
              <CardDescription class="text-[#5F6368]">
                {{ $t('landing.module3_desc') }}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul class="space-y-2 text-sm text-[#5F6368]">
                <li class="flex items-center gap-2">
                  <div class="w-1.5 h-1.5 rounded-full bg-[#082065]" />
                  {{ $t('landing.module3_f1') }}
                </li>
                <li class="flex items-center gap-2">
                  <div class="w-1.5 h-1.5 rounded-full bg-[#082065]" />
                  {{ $t('landing.module3_f2') }}
                </li>
                <li class="flex items-center gap-2">
                  <div class="w-1.5 h-1.5 rounded-full bg-[#082065]" />
                  {{ $t('landing.module3_f3') }}
                </li>
              </ul>
              <Button variant="ghost" class="w-full mt-6 text-[#082065] group-hover:bg-[#082065]/10">
                {{ $t('landing.explore') }}
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
            {{ $t('landing.footer') }}
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

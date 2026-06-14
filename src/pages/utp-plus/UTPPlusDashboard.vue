<script setup lang="ts">
import { markRaw } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Home,
  Sparkles,
  Network,
  Brain,
  GraduationCap,
  Briefcase,
  DollarSign,
  Clock,
  Star,
  TrendingUp,
  Users,
  BookOpen,
  Target,
  MessageSquare,
  ChevronRight,
  ArrowRight
} from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const { t } = useI18n()

const sidebarItems = computed(() => [
  { icon: markRaw(Home), label: t('nav.home'), href: "/utp-plus" },
])

const careers = computed(() => [
  {
    name: t('utpplus.data.careers.c1'),
    match: 92,
    salary: "S/ 3,500 - S/ 6,000",
    duration: t('utpplus.data.careers.years'),
    field: t('utpplus.data.careers.f1'),
    color: "#B50E30",
  },
  {
    name: t('utpplus.data.careers.c2'),
    match: 88,
    salary: "S/ 4,000 - S/ 7,500",
    duration: t('utpplus.data.careers.years'),
    field: t('utpplus.data.careers.f1'),
    color: "#082065",
  },
  {
    name: t('utpplus.data.careers.c3'),
    match: 75,
    salary: "S/ 3,000 - S/ 5,500",
<<<<<<< HEAD
    duration: "5 años",
    field: "Ingeniería",
    color: "#FFB20D",
=======
    duration: t('utpplus.data.careers.years'),
    field: t('utpplus.data.careers.f2'),
    color: "#D4A017",
>>>>>>> 9e9480f0ebfe4d84286064d4259a62bd87af7fed
  },
])

const matchmakingNodes = computed(() => [
  { type: "student", label: t('utpplus.you'), color: "#B50E30" },
  { type: "mentor", label: "Ana García", color: "#082065" },
<<<<<<< HEAD
  { type: "course", label: "Intro a Programación", color: "#FFB20D" },
  { type: "club", label: "Club de Robótica", color: "#2E7D32" },
  { type: "resource", label: "Taller IA", color: "#F9A825" },
]
=======
  { type: "course", label: t('utpplus.data.nodes.n1'), color: "#D4A017" },
  { type: "club", label: t('utpplus.data.nodes.n2'), color: "#2E7D32" },
  { type: "resource", label: t('utpplus.data.nodes.n3'), color: "#F9A825" },
])
>>>>>>> 9e9480f0ebfe4d84286064d4259a62bd87af7fed

const insights = computed(() => [
  {
    icon: markRaw(Brain),
    title: t('utpplus.data.insights.t1'),
    items: [t('utpplus.data.insights.t1_i1'), t('utpplus.data.insights.t1_i2'), t('utpplus.data.insights.t1_i3')],
  },
  {
    icon: markRaw(Star),
    title: t('utpplus.data.insights.t2'),
    items: [t('utpplus.data.insights.t2_i1'), t('utpplus.data.insights.t2_i2'), t('utpplus.data.insights.t2_i3')],
  },
  {
    icon: markRaw(Target),
    title: t('utpplus.data.insights.t3'),
    items: [t('utpplus.data.insights.t3_i1'), t('utpplus.data.insights.t3_i2'), t('utpplus.data.insights.t3_i3')],
  },
])

const actions = computed(() => [
  {
    icon: markRaw(BookOpen),
    title: t('utpplus.data.actions.a1_t'),
    description: t('utpplus.data.actions.a1_d'),
    color: "#B50E30",
  },
  {
    icon: markRaw(Users),
    title: t('utpplus.data.actions.a2_t'),
    description: t('utpplus.data.actions.a2_d'),
    color: "#082065",
  },
  {
    icon: markRaw(Target),
<<<<<<< HEAD
    title: "Completar evaluación vocacional",
    description: "Mejora tu perfil en un 20%",
    color: "#FFB20D",
=======
    title: t('utpplus.data.actions.a3_t'),
    description: t('utpplus.data.actions.a3_d'),
    color: "#D4A017",
>>>>>>> 9e9480f0ebfe4d84286064d4259a62bd87af7fed
  },
])

const stats = computed(() => [
  { label: t('utpplus.data.stats.s1'), value: "85%", icon: markRaw(TrendingUp) },
  { label: t('utpplus.data.stats.s2'), value: "12", icon: markRaw(GraduationCap) },
  { label: t('utpplus.data.stats.s3'), value: "8", icon: markRaw(Users) },
])
</script>

<template>
  <DashboardLayout
    :sidebarItems="sidebarItems"
    :title="$t('utpplus.title')"
    :subtitle="$t('utpplus.subtitle')"
    :breadcrumbs="[
      { label: $t('nav.home') }
    ]"
    moduleColor="#082065"
  >
    <div class="space-y-6">
      <!-- AI Hero Banner -->
      <Card class="bg-gradient-to-br from-[#082065] to-[#0D47A1] border-0 text-white overflow-hidden relative">
        <div class="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48" />
        <div class="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32" />
        <CardHeader class="relative z-10">
          <div class="flex items-center gap-2 mb-2">
            <Sparkles class="w-5 h-5" />
            <span class="text-sm font-medium">{{ $t('utpplus.ai_tag') }}</span>
          </div>
          <CardTitle class="text-3xl">{{ $t('utpplus.ai_title') }}</CardTitle>
          <CardDescription class="text-white/90">
            {{ $t('utpplus.ai_desc') }}
          </CardDescription>
        </CardHeader>
        <CardContent class="relative z-10">
          <div class="grid md:grid-cols-3 gap-4">
            <div v-for="(stat, i) in stats" :key="i" class="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div class="flex items-center gap-3">
                <component :is="stat.icon" class="w-5 h-5" />
                <div>
                  <p class="text-2xl font-bold">{{ stat.value }}</p>
                  <p class="text-sm text-white/80">{{ stat.label }}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Perfil de Carrera -->
      <Card>
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle>{{ $t('utpplus.career_profile') }}</CardTitle>
              <CardDescription>{{ $t('utpplus.career_desc') }}</CardDescription>
            </div>
            <Button variant="outline">{{ $t('utpplus.view_all') }}</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <Card v-for="(career, i) in careers" :key="i" class="hover:shadow-md transition-shadow border-l-4" :style="{ borderLeftColor: career.color }">
              <CardContent class="p-6">
                <div class="flex items-start justify-between mb-4">
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                      <h3 class="font-semibold text-lg text-[#1F1F1F]">{{ career.name }}</h3>
                      <Badge class="text-white" :style="{ backgroundColor: career.color }">
                        {{ career.match }}{{ $t('utpplus.match') }}
                      </Badge>
                    </div>
                    <p class="text-sm text-[#5F6368]">{{ career.field }}</p>
                  </div>
                </div>

                <div class="grid grid-cols-3 gap-4 mb-4">
                  <div class="flex items-center gap-2">
                    <DollarSign class="w-4 h-4 text-[#5F6368]" />
                    <div>
                      <p class="text-xs text-[#5F6368]">{{ $t('utpplus.salary') }}</p>
                      <p class="text-sm font-medium text-[#1F1F1F]">{{ career.salary }}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <Clock class="w-4 h-4 text-[#5F6368]" />
                    <div>
                      <p class="text-xs text-[#5F6368]">{{ $t('utpplus.duration') }}</p>
                      <p class="text-sm font-medium text-[#1F1F1F]">{{ career.duration }}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <Briefcase class="w-4 h-4 text-[#5F6368]" />
                    <div>
                      <p class="text-xs text-[#5F6368]">{{ $t('utpplus.field') }}</p>
                      <p class="text-sm font-medium text-[#1F1F1F]">{{ $t('utpplus.field_wide') }}</p>
                    </div>
                  </div>
                </div>

                <div class="flex items-center justify-between pt-4 border-t border-[#D9D9D9]">
                  <div class="flex items-center gap-2 text-sm text-[#5F6368]">
                    <Users class="w-4 h-4" />
                    <span>3 {{ $t('utpplus.mentors_avail') }}</span>
                  </div>
                  <div class="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Star class="w-4 h-4 mr-1" />
                      {{ $t('utpplus.testimonials') }}
                    </Button>
                    <Button size="sm" :style="{ backgroundColor: career.color }" class="text-white hover:opacity-90">
                      {{ $t('utpplus.view_details') }}
                      <ChevronRight class="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <div class="grid md:grid-cols-2 gap-6">
        <!-- Matchmaking -->
        <Card>
          <CardHeader>
            <div class="flex items-center gap-2">
              <Network class="w-5 h-5 text-[#082065]" />
              <CardTitle>{{ $t('utpplus.matchmaking') }}</CardTitle>
            </div>
            <CardDescription>{{ $t('utpplus.matchmaking_desc') }}</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="relative aspect-square">
              <!-- Central Node -->
              <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <div class="w-20 h-20 rounded-full bg-gradient-to-br from-[#B50E30] to-[#8F0B26] flex items-center justify-center text-white font-medium shadow-lg">
                  {{ $t('utpplus.you') }}
                </div>
              </div>

              <!-- Connected Nodes -->
              <div v-for="(node, i) in matchmakingNodes.slice(1)" :key="i">
                <!-- Connection Line -->
                <svg
                  class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none"
                  style="z-index: 0;"
                >
                  <line
                    x1="50%"
                    y1="50%"
                    :x2="`calc(50% + ${Math.cos((i * 360 / 4 * Math.PI) / 180) * 140}px)`"
                    :y2="`calc(50% + ${Math.sin((i * 360 / 4 * Math.PI) / 180) * 140}px)`"
                    :stroke="node.color"
                    stroke-width="2"
                    stroke-dasharray="4 4"
                    opacity="0.3"
                  />
                </svg>

                <!-- Node -->
                <div
                  class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  :style="{
                    transform: `translate(-50%, -50%) translate(${Math.cos((i * 360 / 4 * Math.PI) / 180) * 140}px, ${Math.sin((i * 360 / 4 * Math.PI) / 180) * 140}px)`,
                  }"
                >
                  <div
                    class="w-16 h-16 rounded-full flex items-center justify-center text-white text-xs font-medium shadow-lg text-center p-2 leading-tight"
                    :style="{ backgroundColor: node.color }"
                  >
                    {{ node.label }}
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-4 pt-4 border-t border-[#D9D9D9]">
              <p class="text-sm text-[#5F6368] mb-3">{{ $t('utpplus.recommended_connections') }}</p>
              <div class="space-y-2">
                <div v-for="(node, i) in matchmakingNodes.slice(1)" :key="i" class="flex items-center gap-2 text-sm">
                  <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: node.color }" />
                  <span class="text-[#1F1F1F]">{{ node.label }}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Análisis de Bitácora -->
        <Card>
          <CardHeader>
            <div class="flex items-center gap-2">
              <Brain class="w-5 h-5 text-[#082065]" />
              <CardTitle>{{ $t('utpplus.log_analysis') }}</CardTitle>
            </div>
            <CardDescription>{{ $t('utpplus.log_insights') }}</CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <!-- AI Chat Message -->
            <div class="p-4 rounded-lg bg-gradient-to-br from-[#082065]/10 to-[#0D47A1]/10 border border-[#082065]/20">
              <div class="flex items-start gap-3">
                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-[#082065] to-[#0D47A1] flex items-center justify-center flex-shrink-0">
                  <Sparkles class="w-4 h-4 text-white" />
                </div>
                <div class="flex-1">
                  <p class="text-sm text-[#1F1F1F] mb-2" v-html="$t('utpplus.chat_message', { strong: '<strong>', '/strong': '</strong>' })"></p>
                  <Button
                    size="sm"
                    variant="ghost"
                    class="text-[#082065] hover:bg-[#082065]/10 p-0 h-auto"
                  >
                    {{ $t('utpplus.view_explanation') }}
                    <ArrowRight class="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>
            </div>

            <!-- Insights Grid -->
            <div class="space-y-4">
              <div v-for="(insight, i) in insights" :key="i" class="space-y-2">
                <div class="flex items-center gap-2">
                  <component :is="insight.icon" class="w-4 h-4 text-[#082065]" />
                  <h4 class="font-medium text-sm text-[#1F1F1F]">{{ insight.title }}</h4>
                </div>
                <div class="flex flex-wrap gap-2">
                  <Badge
                    v-for="(item, j) in insight.items"
                    :key="j"
                    variant="secondary"
                    class="bg-[#F1F1F1] text-[#1F1F1F]"
                  >
                    {{ item }}
                  </Badge>
                </div>
              </div>
            </div>

            <Button class="w-full bg-[#082065] hover:bg-[#0D47A1]">
              <MessageSquare class="w-4 h-4 mr-2" />
              {{ $t('utpplus.chat_ai') }}
            </Button>
          </CardContent>
        </Card>
      </div>

      <!-- Recommended Actions -->
      <Card>
        <CardHeader>
          <CardTitle>{{ $t('utpplus.next_steps') }}</CardTitle>
          <CardDescription>{{ $t('utpplus.steps_desc') }}</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid md:grid-cols-3 gap-4">
            <Card v-for="(action, i) in actions" :key="i" class="hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent class="p-5">
                <div
                  class="w-12 h-12 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"
                  :style="{ backgroundColor: `${action.color}15` }"
                >
                  <component :is="action.icon" class="w-6 h-6" :style="{ color: action.color }" />
                </div>
                <h4 class="font-medium text-[#1F1F1F] mb-2">{{ action.title }}</h4>
                <p class="text-sm text-[#5F6368] mb-4">{{ action.description }}</p>
                <Button
                  size="sm"
                  variant="ghost"
                  class="p-0 h-auto"
                  :style="{ color: action.color }"
                >
                  {{ $t('utpplus.start') }}
                  <ChevronRight class="w-4 h-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
</template>

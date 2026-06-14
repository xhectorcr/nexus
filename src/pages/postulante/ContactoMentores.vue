<script setup lang="ts">
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Home, Brain } from "lucide-vue-next";
import { computed, markRaw } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

// Simple sidebar for placeholder
const sidebarItems = computed(() => [
  { icon: markRaw(Home), label: t('nav.home') || 'Inicio', href: "/postulante" },
  { icon: markRaw(Brain), label: t('nav.vocational_tests') || 'Test Vocacional', href: "/postulante/test" },
]);
</script>

<template>
  <DashboardLayout
    :sidebarItems="sidebarItems"
    :title="$t('postulante.contact_mentors') || 'Contactar con mentores'"
    :subtitle="$t('postulante.p2p_subtitle') || 'Conecta con expertos para guiar tu camino'"
    :breadcrumbs="[{ label: $t('nav.home') || 'Inicio', href: '/postulante' }, { label: 'Mentores' }]"
    moduleColor="#082065"
  >
    <Card class="w-full">
      <CardHeader>
        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-[#082065] to-[#0D47A1] flex items-center justify-center mb-3">
          <Users class="w-6 h-6 text-white" />
        </div>
        <CardTitle>{{ $t('postulante.contact_mentors_title') || 'Red de Mentores' }}</CardTitle>
        <CardDescription>
          {{ $t('postulante.contact_mentors_desc') || 'Esta sección estará disponible próximamente para ayudarte a agendar citas o contactar mentores.' }}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="h-[300px] flex items-center justify-center border-2 border-dashed rounded-xl border-gray-200">
          <p class="text-gray-500 font-medium">Próximamente...</p>
        </div>
      </CardContent>
    </Card>
  </DashboardLayout>
</template>

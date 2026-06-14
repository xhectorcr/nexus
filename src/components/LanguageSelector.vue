<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-vue-next';
import { computed } from 'vue';

const { locale } = useI18n();

const changeLanguage = (lang: string) => {
  locale.value = lang;
  localStorage.setItem('nexus_lang', lang);
};

const currentLangLabel = computed(() => {
  if (locale.value === 'en') return 'EN';
  if (locale.value === 'qu') return 'QU';
  return 'ES';
});
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" size="sm" class="gap-1 px-2 font-bold text-gray-600 border border-transparent hover:border-gray-200">
        <Globe class="w-4 h-4 text-gray-500" />
        {{ currentLangLabel }}
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="min-w-[100px]">
      <DropdownMenuItem @click="changeLanguage('es')" :class="{ 'bg-gray-100 font-bold': locale === 'es' }">
        🇪🇸 Español (ES)
      </DropdownMenuItem>
      <DropdownMenuItem @click="changeLanguage('en')" :class="{ 'bg-gray-100 font-bold': locale === 'en' }">
        🇬🇧 English (EN)
      </DropdownMenuItem>
      <DropdownMenuItem @click="changeLanguage('qu')" :class="{ 'bg-gray-100 font-bold': locale === 'qu' }">
        🇵🇪 Runa Simi (QU)
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

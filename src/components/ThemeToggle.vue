<script setup lang="ts">
import { computed } from "vue";
import { MoonStar, SunMedium } from "lucide-vue-next";
import type { ThemeMode } from "@/data";

const props = defineProps<{
  preference: ThemeMode;
}>();

const emit = defineEmits<{
  cycle: [];
}>();

const icon = computed(() => {
  if (props.preference === "light") {
    return SunMedium;
  }

  return MoonStar;
});
</script>

<template>
  <button
    class="theme-toggle"
    type="button"
    :aria-label="`Switch to ${props.preference === 'light' ? 'dark' : 'light'} mode.`"
    @click="emit('cycle')"
  >
    <component
      :is="icon"
      :size="18"
    />
  </button>
</template>

<script setup lang="ts">
import { ArrowUpRight } from "lucide-vue-next";
import type { LinkItem } from "@/data";

const props = withDefaults(defineProps<{
  activeLabel?: string;
  links: LinkItem[];
  variant: "drawer" | "top";
}>(), {
  activeLabel: "",
});

const emit = defineEmits<{
  navigate: [];
}>();
</script>

<template>
  <template v-if="variant === 'top'">
    <a
      v-for="item in links"
      :key="`top-${item.label}`"
      class="top-nav__link"
      :class="{ 'is-active': item.label === activeLabel }"
      :href="item.href"
      :target="item.external ? '_blank' : undefined"
      :rel="item.external ? 'noopener noreferrer' : undefined"
      @click="emit('navigate')"
    >
      {{ item.label }}
    </a>
  </template>

  <template v-else>
    <a
      v-for="(item, index) in links"
      :key="`drawer-${item.label}`"
      class="menu-link"
      :style="{ '--menu-item-delay': `${index * 70 + 90}ms` }"
      :href="item.href"
      :target="item.external ? '_blank' : undefined"
      :rel="item.external ? 'noopener noreferrer' : undefined"
      @click="emit('navigate')"
    >
      <div class="menu-link__main">
        <component
          :is="item.icon"
          :size="16"
        />
        <span>{{ item.label }}</span>
      </div>
      <ArrowUpRight :size="16" />
    </a>
  </template>
</template>

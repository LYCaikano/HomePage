<script setup lang="ts">
import { computed } from "vue";
import { Menu, X } from "lucide-vue-next";
import ThemeToggle from "@/components/ThemeToggle.vue";
import NavLinks from "@/components/site/NavLinks.vue";
import type { LinkItem, ThemeMode } from "@/data";

const props = withDefaults(defineProps<{
  activeNavLabel?: string;
  drawerOpen: boolean;
  homeHref?: string;
  navigationLinks: LinkItem[];
  preference: ThemeMode;
  siteName: string;
}>(), {
  activeNavLabel: "",
  homeHref: "/",
});

const emit = defineEmits<{
  cycleTheme: [];
  closeDrawer: [];
  toggleDrawer: [];
}>();

const menuIcon = computed(() => (props.drawerOpen ? X : Menu));
</script>

<template>
  <div class="top-bar__inner">
    <a
      class="site-brand"
      :href="homeHref"
      @click="emit('closeDrawer')"
    >
      <span class="site-brand__mark" aria-hidden="true"></span>
      <span>{{ siteName }}</span>
    </a>

    <div class="top-bar__actions">
      <ThemeToggle
        class="top-bar__theme-toggle"
        :preference="preference"
        @cycle="emit('cycleTheme')"
      />

      <button
        class="menu-button"
        type="button"
        aria-label="Toggle navigation"
        :aria-expanded="drawerOpen"
        aria-controls="mobile-nav"
        @click="emit('toggleDrawer')"
      >
        <component
          :is="menuIcon"
          :size="22"
        />
      </button>
    </div>

    <nav class="top-nav" aria-label="Primary">
      <NavLinks
        :active-label="activeNavLabel"
        :links="navigationLinks"
        variant="top"
        @navigate="emit('closeDrawer')"
      />
      <ThemeToggle
        :preference="preference"
        @cycle="emit('cycleTheme')"
      />
    </nav>
  </div>
</template>

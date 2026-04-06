<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import MobileDrawer from "@/components/site/MobileDrawer.vue";
import SiteFooter from "@/components/site/SiteFooter.vue";
import SiteHeader from "@/components/site/SiteHeader.vue";
import { useLayoutMetrics } from "@/composables/useLayoutMetrics";
import { useTheme } from "@/composables/useTheme";
import type { FooterInfo, LinkItem } from "@/data";

const props = withDefaults(defineProps<{
  activeNavLabel?: string;
  footer: FooterInfo;
  homeHref?: string;
  navigationLinks: LinkItem[];
  pageClass?: string;
  showAmbient?: boolean;
  siteName: string;
}>(), {
  activeNavLabel: "",
  homeHref: "/",
  pageClass: "",
  showAmbient: false,
});

const menuOpen = ref(false);
const { footerRef, topBarRef } = useLayoutMetrics();
const { cycleTheme, preference } = useTheme();

const closeMenu = () => {
  menuOpen.value = false;
};

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    closeMenu();
  }
};

const handleResize = () => {
  if (window.innerWidth >= 900) {
    closeMenu();
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  document.body.classList.remove("menu-open");
  window.removeEventListener("keydown", handleKeydown);
  window.removeEventListener("resize", handleResize);
});

watch(menuOpen, (isOpen) => {
  document.body.classList.toggle("menu-open", isOpen);
});
  </script>

<template>
  <div :class="['page-shell', pageClass]">
    <button
      class="mobile-nav-backdrop"
      type="button"
      aria-label="Close navigation overlay"
      @click="closeMenu"
    ></button>

    <header ref="topBarRef" class="top-bar">
      <SiteHeader
        :active-nav-label="activeNavLabel"
        :drawer-open="menuOpen"
        :home-href="homeHref"
        :navigation-links="navigationLinks"
        :preference="preference"
        :site-name="siteName"
        @close-drawer="closeMenu"
        @cycle-theme="cycleTheme"
        @toggle-drawer="toggleMenu"
      />
    </header>

    <MobileDrawer
      :active-nav-label="activeNavLabel"
      :links="navigationLinks"
      :open="menuOpen"
      @close="closeMenu"
    />

    <main class="page-content">
      <slot />
    </main>

    <footer ref="footerRef" class="site-footer">
      <SiteFooter :footer="footer" />
    </footer>
  </div>
</template>

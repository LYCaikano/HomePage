<script setup lang="ts">
import { footerInfo, heroPhotos, navigationLinks, profile, selectLinks } from "@/data";
import { useRevealOnScroll } from "@/composables/useRevealOnScroll";
import AppShell from "@/layout/AppShell.vue";
import HeroSection from "@/sections/HeroSection.vue";

const actionLinks = selectLinks(["Blog", "GitHub", "Email"]);

useRevealOnScroll();
</script>

<template>
  <AppShell
    :footer="footerInfo"
    home-href="#home"
    :navigation-links="navigationLinks"
    :show-ambient="true"
    :site-name="profile.name"
  >
      <HeroSection
        :profile="profile"
        :action-links="actionLinks"
        :photos="heroPhotos"
      />
  </AppShell>
</template>

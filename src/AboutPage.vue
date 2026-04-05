<script setup lang="ts">
import AppShell from "@/layout/AppShell.vue";
import { aboutParagraphs, footerInfo, navigationLinks, profile } from "@/data";
</script>

<template>
  <AppShell
    active-nav-label="About"
    :footer="footerInfo"
    home-href="/"
    :navigation-links="navigationLinks"
    page-class="about-layout"
    :site-name="profile.name"
  >
    <section class="about-page">
      <div class="about-page__inner">
        <p class="about-page__eyebrow">About</p>
        <h1>Hello, I'm {{ profile.name }}.</h1>
        <p class="about-page__role">{{ profile.role }}</p>
        <div class="about-page__copy">
          <p
            v-for="paragraph in aboutParagraphs"
            :key="paragraph"
          >
            {{ paragraph }}
          </p>
        </div>
      </div>
    </section>
  </AppShell>
</template>

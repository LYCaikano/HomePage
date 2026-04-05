<script setup lang="ts">
import MarkdownContent from "@/components/MarkdownContent.vue";
import aboutSource from "@/content/about.md?raw";
import { renderMarkdown } from "@/content/markdown";
import AppShell from "@/layout/AppShell.vue";
import { footerInfo, navigationLinks, profile } from "@/data";

const aboutHtml = renderMarkdown(aboutSource, "./about.md");
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
        <MarkdownContent :html="aboutHtml" />
      </div>
    </section>
  </AppShell>
</template>

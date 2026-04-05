<script setup lang="ts">
import type { FooterInfo } from "@/data";

defineProps<{
  footer: FooterInfo;
}>();
</script>

<template>
  <div class="site-footer__inner">
    <a
      :href="footer.filingHref"
      target="_blank"
      rel="noopener noreferrer"
    >
      {{ footer.filingLabel }}
    </a>
  </div>
</template>

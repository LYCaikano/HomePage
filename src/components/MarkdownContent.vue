<script setup lang="ts">
defineProps<{
  html: string;
}>();
</script>

<template>
  <article
    class="markdown-content"
    v-html="html"
  ></article>
</template>

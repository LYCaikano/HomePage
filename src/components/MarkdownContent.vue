<script setup lang="ts">
defineProps<{
  html: string;
}>();
</script>

<template>
  <article
    class="markdown-content markdown-body"
    v-html="html"
  ></article>
</template>

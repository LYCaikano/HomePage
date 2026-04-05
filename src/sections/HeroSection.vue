<script setup lang="ts">
import HeroGallery from "@/components/HeroGallery.vue";
import type { HeroPhoto, LinkItem, ProfileInfo } from "@/data";

defineProps<{
  profile: ProfileInfo;
  actionLinks: LinkItem[];
  photos: HeroPhoto[];
}>();
</script>

<template>
  <section
    id="home"
    class="hero"
  >
    <div class="hero__copy" data-reveal>
      <h1
        v-if="profile.title"
        class="hero__name"
      >
        {{ profile.title }}
      </h1>
      <p
        v-if="profile.subtitle"
        class="hero__role"
      >
        {{ profile.subtitle }}
      </p>
      <p
        v-if="profile.description"
        class="hero__intro"
      >
        {{ profile.description }}
      </p>

      <div class="hero__actions">
        <a
          v-for="(item, index) in actionLinks"
          :key="item.label"
          class="button"
          :class="index === 0 ? 'button--primary' : 'button--secondary'"
          :href="item.href"
          :target="item.external ? '_blank' : undefined"
          :rel="item.external ? 'noopener noreferrer' : undefined"
        >
          <span>{{ item.label }}</span>
        </a>
      </div>
    </div>

    <div class="hero__visual" data-reveal>
      <HeroGallery :photos="photos" />
    </div>
  </section>
</template>

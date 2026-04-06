<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import type { HeroPhoto } from "@/data";

const props = defineProps<{
  photos: HeroPhoto[];
}>();

const activeIndex = ref(0);
const touchStartX = ref<number | null>(null);
let autoplayId: number | null = null;

const slideState = (index: number) => {
  const total = props.photos.length;
  const raw = (index - activeIndex.value + total) % total;

  if (raw === 0) return "active";
  if (raw === 1) return "next";
  if (raw === total - 1) return "prev";
  return "hidden";
};

const goTo = (index: number) => {
  const total = props.photos.length;
  activeIndex.value = (index + total) % total;
};

const next = () => goTo(activeIndex.value + 1);
const previous = () => goTo(activeIndex.value - 1);

const stopAutoplay = () => {
  if (autoplayId !== null) {
    window.clearInterval(autoplayId);
    autoplayId = null;
  }
};

const startAutoplay = () => {
  stopAutoplay();
  autoplayId = window.setInterval(() => {
    next();
  }, 4200);
};

const handleTouchStart = (event: TouchEvent) => {
  touchStartX.value = event.touches[0]?.clientX ?? null;
  stopAutoplay();
};

const handleTouchEnd = (event: TouchEvent) => {
  const startX = touchStartX.value;
  const endX = event.changedTouches[0]?.clientX ?? null;
  touchStartX.value = null;

  if (startX === null || endX === null) {
    startAutoplay();
    return;
  }

  const delta = endX - startX;
  if (Math.abs(delta) > 40) {
    if (delta < 0) next();
    else previous();
  }

  startAutoplay();
};

const handleSelect = (index: number) => {
  if (index === (activeIndex.value + 1) % props.photos.length) next();
  else if (index === (activeIndex.value - 1 + props.photos.length) % props.photos.length) previous();
  else goTo(index);

  startAutoplay();
};

onMounted(() => {
  startAutoplay();
});

onBeforeUnmount(() => {
  stopAutoplay();
});
</script>

<template>
  <div
    class="gallery-shell"
    @touchstart.passive="handleTouchStart"
    @touchend.passive="handleTouchEnd"
  >
    <div class="gallery-stack">
      <button
        v-for="(photo, photoIndex) in photos"
        :key="`${photo.alt}-${photoIndex}`"
        type="button"
        class="gallery-card"
        :class="`gallery-card--${slideState(photoIndex)}`"
        :aria-label="`Show image ${photoIndex + 1}`"
        @click="handleSelect(photoIndex)"
      >
        <img
          class="gallery-card__image"
          :src="photo.src"
          :alt="photo.alt"
          loading="eager"
        />
      </button>
    </div>
  </div>
</template>

<style scoped>
.gallery-shell {
  position: relative;
  display: grid;
  place-items: center;
  width: 100%;
  min-height: 29rem;
  overflow: visible;
}

.gallery-stack {
  position: relative;
  width: 20.5rem;
  height: 27.5rem;
  overflow: visible;
}

.gallery-card {
  position: absolute;
  top: 0;
  left: 50%;
  width: 17.2rem;
  height: 27.5rem;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  transform-origin: center center;
  transition:
    transform 620ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 620ms ease,
    filter 620ms ease;
}

.gallery-card__image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 26px;
  box-shadow: 0 18px 38px rgba(20, 18, 14, 0.12);
  background: var(--bg);
  -webkit-mask-image: radial-gradient(112% 108% at 50% 45%, #000 72%, rgba(0, 0, 0, 0.95) 80%, transparent 100%);
  mask-image: radial-gradient(112% 108% at 50% 45%, #000 72%, rgba(0, 0, 0, 0.95) 80%, transparent 100%);
}

.gallery-card--active {
  z-index: 3;
  transform: translateX(-50%) rotate(0deg) scale(1);
  opacity: 1;
  filter: saturate(1) blur(0);
}

.gallery-card--prev {
  z-index: 2;
  transform: translateX(-87%) rotate(-5deg) scale(0.84);
  opacity: 0.74;
  filter: saturate(0.88) blur(1.6px);
}

.gallery-card--next {
  z-index: 2;
  transform: translateX(-13%) rotate(5deg) scale(0.84);
  opacity: 0.74;
  filter: saturate(0.88) blur(1.6px);
}

.gallery-card--hidden {
  z-index: 1;
  transform: translateX(-50%) scale(0.72);
  opacity: 0;
  pointer-events: none;
}

@media (max-width: 760px) {
  .gallery-shell {
    min-height: min(24.5rem, calc(100vw * 1.16));
  }

  .gallery-stack {
    width: min(17.25rem, calc(100vw - 4.5rem));
    height: min(22.75rem, calc((100vw - 4.5rem) * 1.32));
  }

  .gallery-card {
    width: min(14.8rem, calc((100vw - 4.5rem) * 0.86));
    height: 100%;
  }

  .gallery-card--prev {
    transform: translateX(-80%) rotate(-4deg) scale(0.86);
  }

  .gallery-card--next {
    transform: translateX(-20%) rotate(4deg) scale(0.86);
  }
}

@media (prefers-reduced-motion: reduce) {
  .gallery-card {
    transition: none;
  }
}
</style>

<script setup lang="ts">
import { X } from "lucide-vue-next";
import NavLinks from "@/components/site/NavLinks.vue";
import type { LinkItem } from "@/data";

defineProps<{
  activeNavLabel?: string;
  links: LinkItem[];
  open: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();
</script>

<template>
  <aside
    id="mobile-nav"
    class="mobile-nav"
    :aria-hidden="!open"
  >
    <div class="mobile-nav__header">
      <span>Menu</span>
      <button
        type="button"
        aria-label="Close navigation"
        @click="emit('close')"
      >
        <X :size="18" />
      </button>
    </div>

    <section class="menu-panel">
      <NavLinks
        :active-label="activeNavLabel"
        :links="links"
        variant="drawer"
        @navigate="emit('close')"
      />
    </section>
  </aside>
</template>

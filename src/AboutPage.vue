<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import MarkdownContent from "@/components/MarkdownContent.vue";
import aboutSource from "@/content/about.md?raw";
import { parseMarkdownDocument } from "@/content/markdown";
import AppShell from "@/layout/AppShell.vue";
import { footerInfo, navigationLinks, profile } from "@/data";

const aboutDocument = parseMarkdownDocument(aboutSource, "./about.md");
const articleRef = ref<HTMLElement | null>(null);
const tocInnerRef = ref<HTMLElement | null>(null);
const progress = ref(0);
const activeHeading = ref("");

const articleDate = computed(() =>
  typeof aboutDocument.meta.date === "string" ? aboutDocument.meta.date : "2026-04-06",
);
const articleTags = computed(() =>
  Array.isArray(aboutDocument.meta.tags)
    ? aboutDocument.meta.tags
    : typeof aboutDocument.meta.tags === "string"
      ? [aboutDocument.meta.tags]
      : ["about", "notes"],
);
const readingWordCount = computed(() => aboutDocument.wordCount);
const readingMinutes = computed(() => aboutDocument.readingMinutes);

function updateReadingState() {
  const article = articleRef.value;
  if (!article) {
    return;
  }

  const rootStyles = getComputedStyle(document.documentElement);
  const topBarHeight = Number.parseFloat(rootStyles.getPropertyValue("--top-bar-height")) || 0;
  const articleTop = article.getBoundingClientRect().top + window.scrollY;
  const articleHeight = article.offsetHeight;
  const viewportHeight = window.innerHeight;
  const scrollTop = window.scrollY;
  const start = Math.max(articleTop - topBarHeight - 24, 0);
  const end = Math.max(articleTop + articleHeight - viewportHeight + 40, start + 1);
  const rawProgress = ((scrollTop - start) / (end - start)) * 100;
  const maxScrollTop = Math.max(document.documentElement.scrollHeight - viewportHeight, 0);
  const isAtPageBottom = scrollTop >= maxScrollTop - 2;
  progress.value = isAtPageBottom ? 100 : Math.max(0, Math.min(100, rawProgress));

  const headingElements = Array.from(
    article.querySelectorAll<HTMLElement>("h2[id], h3[id]"),
  );

  let currentSlug = headingElements[0]?.id ?? "";
  for (const heading of headingElements) {
    if (heading.getBoundingClientRect().top <= viewportHeight * 0.3) {
      currentSlug = heading.id;
    } else {
      break;
    }
  }

  activeHeading.value = currentSlug;

  if (currentSlug && tocInnerRef.value) {
    const activeLink = tocInnerRef.value.querySelector<HTMLElement>(`.about-toc__link[data-slug="${currentSlug}"]`);
    activeLink?.scrollIntoView({
      block: "nearest",
      inline: "nearest",
      behavior: "smooth",
    });
  }
}

onMounted(() => {
  updateReadingState();
  window.addEventListener("scroll", updateReadingState, { passive: true });
  window.addEventListener("resize", updateReadingState);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", updateReadingState);
  window.removeEventListener("resize", updateReadingState);
});
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
    <div class="about-progress">
      <span class="about-progress__bar" :style="{ width: `${progress}%` }"></span>
    </div>

    <section class="about-page">
      <aside class="about-toc">
        <div ref="tocInnerRef" class="about-toc__inner">
          <p class="about-toc__title">Contents</p>
          <a
            v-for="heading in aboutDocument.headings"
            :key="heading.slug"
            class="about-toc__link"
            :data-slug="heading.slug"
            :class="[
              `level-${heading.level}`,
              { 'is-active': heading.slug === activeHeading },
            ]"
            :href="`#${heading.slug}`"
          >
            {{ heading.text }}
          </a>
        </div>
      </aside>

      <div ref="articleRef" class="about-page__inner">
        <p class="about-page__eyebrow">About</p>
        <div class="about-meta">
          <span
            v-for="tag in articleTags"
            :key="tag"
            class="about-meta__tag"
          >
            {{ tag }}
          </span>
          <span class="about-meta__divider">/</span>
          <span class="about-meta__item">{{ articleDate }}</span>
          <span class="about-meta__divider">/</span>
          <span class="about-meta__item">{{ readingWordCount }} words</span>
          <span class="about-meta__divider">/</span>
          <span class="about-meta__item">{{ readingMinutes }} min read</span>
        </div>
        <MarkdownContent :html="aboutDocument.html" />
      </div>
    </section>
  </AppShell>
</template>

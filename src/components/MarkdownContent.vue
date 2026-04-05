<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

defineProps<{
  html: string;
}>();

const containerRef = ref<HTMLElement | null>(null);
const copyResetTimers = new Map<HTMLButtonElement, number>();

async function writeClipboardText(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  textarea.style.top = "0";
  textarea.style.left = "0";
  document.body.appendChild(textarea);
  textarea.focus({ preventScroll: true });
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);
  document.execCommand("copy");
  textarea.remove();
}

function resetCopyAction(button: HTMLButtonElement) {
  button.dataset.copied = "false";
  const label = button.querySelector<HTMLElement>(".copy-action__label");
  if (label) {
    label.textContent = "复制";
  }
}

function markCopyAction(button: HTMLButtonElement) {
  const previousTimer = copyResetTimers.get(button);
  if (previousTimer) {
    window.clearTimeout(previousTimer);
  }

  button.dataset.copied = "true";
  const label = button.querySelector<HTMLElement>(".copy-action__label");
  if (label) {
    label.textContent = "已复制";
  }

  const timer = window.setTimeout(() => {
    resetCopyAction(button);
    copyResetTimers.delete(button);
  }, 1800);

  copyResetTimers.set(button, timer);
}

async function handleClick(event: Event) {
  const target = event.target;
  if (!(target instanceof Element)) {
    return;
  }

  const button = target.closest<HTMLButtonElement>(".copy-action");
  if (!button || !containerRef.value?.contains(button)) {
    return;
  }

  const codeElement = button.closest(".code-block-container")?.querySelector("code");
  const codeText = codeElement?.textContent ?? "";
  if (!codeText) {
    return;
  }

  try {
    await writeClipboardText(codeText);
    markCopyAction(button);
  } catch (error) {
    resetCopyAction(button);
    console.error("Failed to copy code block.", error);
  }
}

onMounted(() => {
  containerRef.value?.addEventListener("click", handleClick, { capture: true });
});

onBeforeUnmount(() => {
  containerRef.value?.removeEventListener("click", handleClick, { capture: true });

  copyResetTimers.forEach((timer, button) => {
    window.clearTimeout(timer);
    resetCopyAction(button);
  });
  copyResetTimers.clear();
});
</script>

<template>
  <article
    ref="containerRef"
    class="markdown-content markdown-body"
    v-html="html"
  ></article>
</template>

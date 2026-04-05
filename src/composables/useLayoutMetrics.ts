import { onBeforeUnmount, onMounted, ref } from "vue";

export function useLayoutMetrics() {
  const topBarRef = ref<HTMLElement | null>(null);
  const footerRef = ref<HTMLElement | null>(null);
  let layoutObserver: ResizeObserver | null = null;

  const syncLayoutHeights = () => {
    const topBarHeight = topBarRef.value?.offsetHeight ?? 0;
    const footerHeight = footerRef.value?.offsetHeight ?? 0;
    document.documentElement.style.setProperty("--top-bar-height", `${topBarHeight}px`);
    document.documentElement.style.setProperty("--footer-height", `${footerHeight}px`);
  };

  onMounted(() => {
    syncLayoutHeights();
    window.addEventListener("resize", syncLayoutHeights);

    if (typeof ResizeObserver !== "undefined") {
      layoutObserver = new ResizeObserver(() => {
        syncLayoutHeights();
      });

      if (topBarRef.value) {
        layoutObserver.observe(topBarRef.value);
      }

      if (footerRef.value) {
        layoutObserver.observe(footerRef.value);
      }
    }
  });

  onBeforeUnmount(() => {
    layoutObserver?.disconnect();
    window.removeEventListener("resize", syncLayoutHeights);
  });

  return {
    footerRef,
    topBarRef,
  };
}

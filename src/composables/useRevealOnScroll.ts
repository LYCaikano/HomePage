import { onBeforeUnmount, onMounted } from "vue";

export function useRevealOnScroll(selector = "[data-reveal]") {
  let observer: IntersectionObserver | null = null;

  onMounted(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(selector));

    if (typeof IntersectionObserver === "undefined") {
      elements.forEach((element) => {
        element.classList.add("is-visible");
      });
      return;
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer?.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
      },
    );

    elements.forEach((element) => {
      observer?.observe(element);
    });
  });

  onBeforeUnmount(() => {
    observer?.disconnect();
  });
}

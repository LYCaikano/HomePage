import { onMounted, ref } from "vue";
import type { ThemeMode } from "@/data";

const STORAGE_KEY = "personal-homepage-theme";

export function useTheme() {
  const preference = ref<ThemeMode>("light");
  const systemDarkQuery =
    typeof window !== "undefined" ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  const applyTheme = () => {
    document.documentElement.dataset.theme = preference.value;
  };

  const setPreference = (value: ThemeMode) => {
    preference.value = value;
    window.localStorage.setItem(STORAGE_KEY, value);
    applyTheme();
  };

  const cycleTheme = () => {
    setPreference(preference.value === "light" ? "dark" : "light");
  };

  onMounted(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    if (saved === "light" || saved === "dark") {
      preference.value = saved;
    } else {
      preference.value = systemDarkQuery?.matches ? "dark" : "light";
    }

    applyTheme();
  });

  return {
    cycleTheme,
    preference,
    setPreference,
  };
}

// src/composables/useTheme.ts

import { ref } from "vue";

const theme = ref();
const themeVars = ref();

export function useTheme(vars) {
  vars && (themeVars.value = vars);

  function toggleTheme(mode) {
    theme.value = mode || (theme.value === "light" ? "dark" : "light");
  }

  return {
    theme,
    themeVars,
    toggleTheme,
  };
}

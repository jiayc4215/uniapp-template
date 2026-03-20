<!-- src/App.ku.vue | App.ku.vue -->

<script setup>
import { useTheme } from "./composables/useTheme";

const { theme, themeVars } = useTheme({
  "color-theme": "#00B652",
  "color-success": "#34d19d",
  "color-warning": "#f0883a",
  "color-danger": "#fa4350",
  "color-white": "#ffffff",
});
</script>

<template>
  <!-- 需要确保已注册 WdConfigProvider 组件 -->
  <wd-config-provider :theme="theme" :theme-vars="themeVars">
    <KuRootView />
  </wd-config-provider>
</template>

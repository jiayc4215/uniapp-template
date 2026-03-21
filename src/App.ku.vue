<!-- src/App.ku.vue | App.ku.vue -->

<script setup>
import { useTheme } from "./composables/useTheme";
const { themeVars, theme } = useTheme();
</script>

<template>
  <!-- 需要确保已注册 WdConfigProvider 组件 -->
  <wd-config-provider
    :theme-vars="themeVars"
    :theme="theme"
    :custom-class="`page-wraper ${theme}`"
  >
    <KuRootView />
  </wd-config-provider>
</template>

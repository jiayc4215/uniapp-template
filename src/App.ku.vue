<!-- src/App.ku.vue | App.ku.vue -->

<script setup>
import { useTheme } from "./composables/useTheme"
import Tabbar from "@/tabbar/index.vue"
import { isPageTabbar } from "./tabbar/store"
import { currRoute } from "./utils/router"
const { themeVars, theme } = useTheme()
const isCurrentPageTabbar = ref(true)
onShow(() => {
  const { path } = currRoute()
  // 线上是 '/' 导致线上 tabbar 不见了
  // 所以这里需要判断一下，如果是 '/' 就当做首页，也要显示 tabbar
  if (path === "/") {
    isCurrentPageTabbar.value = true
  } else {
    isCurrentPageTabbar.value = isPageTabbar(path)
  }
})
const showTabbar = () => {
  isCurrentPageTabbar.value = true
}
const hideTabbar = () => {
  isCurrentPageTabbar.value = false
}
defineExpose({
  showTabbar,
  hideTabbar
})
</script>

<template>
  <view>
    <!-- 需要确保已注册 WdConfigProvider 组件 
   :theme="theme" 这个主题配置是针对组件库的 你自己写一个view 就要自己适配 
   （项目不需要 后期可手动添加）
    -->
    <wd-config-provider :theme-vars="themeVars" :custom-class="`page-wraper ${theme}`">
      <KuRootView />
      <block v-if="isCurrentPageTabbar">
        <wd-gap safe-area-bottom height="var(--wot-tabbar-height, 50px)" />
        <Tabbar />
      </block>
    </wd-config-provider>
  </view>
</template>

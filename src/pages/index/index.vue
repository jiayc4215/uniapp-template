<script setup>
import { useManualTheme } from "@/composables/useManualTheme"
definePage({
  style: {
    navigationBarTitleText: "首页"
  },
  rules: ["admin", "user"]
})

const {
  theme,
  toggleTheme,
  currentThemeColor,
  showThemeColorSheet,
  themeColorOptions,
  openThemeColorPicker,
  closeThemeColorPicker,
  selectThemeColor,
  setFollowSystem
} = useManualTheme()

const isDark = computed({
  get() {
    return theme.value === "dark"
  },
  set() {
    toggleTheme()
  }
})

// 处理主题色选择
function handleThemeColorSelect(option) {
  selectThemeColor(option)
}

function openUrl(url) {
  window.open(url, "_blank")
}
</script>

<template>
  <view class="box-border py-3">
    <view class="rounded-3 mx-3 box-border bg-white px-4 py-6 text-center dark:bg-zinc-900">
      <text class="text-5 mb-3 block text-left font-bold text-zinc-900 dark:text-zinc-100"> Wot Starter </text>
      <text class="text-30rpx mb-3 block text-left leading-relaxed text-zinc-600 dark:text-zinc-300">
        ⚡️ 基于 vitesse-uni-app 由 vite & uni-app 驱动的、深度整合 Wot UI 组件库的快速启动模板
      </text>
      <text class="text-3 block text-left leading-relaxed text-zinc-500 dark:text-zinc-400">
        背靠 Uni Helper、Wot UI 团队，告别 HBuilderX ，拥抱现代前端开发工具链
      </text>
    </view>

    <demo-block title="基础设置" transparent>
      <wd-cell-group border custom-class="rounded-2! overflow-hidden">
        <wd-cell title="暗黑模式">
          <wd-switch v-model="isDark" size="18px" />
        </wd-cell>
        <wd-cell title="跟随系统">
          <wd-button size="small" @click="setFollowSystem"> 跟随系统 </wd-button>
        </wd-cell>
        <wd-cell title="选择主题色" is-link @click="openThemeColorPicker">
          <view class="flex items-center justify-end gap-2">
            <view class="h-4 w-4 rounded-full" :style="{ backgroundColor: currentThemeColor.primary }" />
            <text>{{ currentThemeColor.name }}</text>
          </view>
        </wd-cell>
      </wd-cell-group>
    </demo-block>

    <demo-block title="工具链介绍" transparent>
      <wd-cell-group border custom-class="rounded-2! overflow-hidden">
        <wd-cell title="🧩 WotUI组件库" is-link @click="openUrl('https://wot-ui.cn/')" />
        <!-- <wd-cell title="🧠 Agent Skills" is-link @click="navigateTo('skills')" /> -->

        <wd-cell title="🚦 Router 路由管理" is-link @click="navigateTo('router')" />
        <wd-cell title="🌐 Alova 网络请求" is-link @click="navigateTo('request')" />
        <wd-cell title="🎨 Icon 图标" is-link @click="navigateTo('icon')" />
        <wd-cell title="✨ Unocss 原子化" is-link @click="navigateTo('styles')" />
        <wd-cell title="🍍 Pinia 持久化" is-link @click="navigateTo('pinia')" />
        <wd-cell title="💬 Fedback 反馈组件" is-link @click="navigateTo('feedback')" />
        <!-- <wd-cell title="🌱 CreateUni 脚手架" is-link @click="navigateTo('create-uni') " /> -->
        <wd-cell title="🔄 CI/CD 持续集成" is-link @click="navigateTo('ci')" />
        <wd-cell title="🦾  uni-ku/root" is-link @click="navigateTo('root')" />
        <wd-cell title="📊 uni-echarts" is-link @click="navigateTo('echarts')" />
      </wd-cell-group>
    </demo-block>

    <!-- 主题色选择 ActionSheet -->
    <wd-action-sheet
      v-model="showThemeColorSheet"
      title="选择主题色"
      :close-on-click-action="true"
      @cancel="closeThemeColorPicker"
    >
      <view class="px-4 pb-4">
        <view
          v-for="option in themeColorOptions"
          :key="option.value"
          class="flex items-center justify-between border-b border-zinc-200 py-3 last:border-b-0 dark:border-zinc-700"
          @click="handleThemeColorSelect(option)"
        >
          <view class="flex items-center gap-3">
            <view
              class="h-6 w-6 rounded-full border-2 border-zinc-200 dark:border-zinc-700"
              :style="{ backgroundColor: option.primary }"
            />
            <text class="text-4 text-zinc-900 dark:text-zinc-100">
              {{ option.name }}
            </text>
          </view>
          <wd-icon v-if="currentThemeColor.value === option.value" name="check" :color="option.primary" size="20px" />
        </view>
      </view>
      <wd-gap :height="50" />
    </wd-action-sheet>
  </view>
</template>

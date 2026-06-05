<script setup>
import { useManualTheme } from "@/composables/useManualTheme"
import { useI18nSync } from "@/composables/useI18nSync"
import { useI18n } from "vue-i18n"

definePage({
  style: {
    navigationBarTitleText: "%index-title%"
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

const { currentLang, setLocale } = useI18nSync()
const { t } = useI18n()

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

// 语言切换相关
const showLangSheet = ref(false)
const langOptions = computed(() => [
  { name: t("jian-ti-zhong-wen"), value: "zh-CN" },
  { name: t("english"), value: "en-US" }
])

const currentLangText = computed(() => {
  const option = langOptions.value.find(opt => opt.value === currentLang.value)
  return option ? option.name : currentLang.value
})

function handleLangSelect(langValue) {
  setLocale(langValue)
  showLangSheet.value = false
}

// 动态监听语言更新导航栏标题（支持小程序/H5/App在切换语言时实时刷新）
watch(
  currentLang,
  () => {
    uni.setNavigationBarTitle({
      title: t("index-title")
    })
  },
  { immediate: true }
)

function openUrl(url) {
  window.open(url, "_blank")
}
</script>

<template>
  <view class="bg-fill-bottom text-text-main box-border py-3">
    <view class="rounded-3 bg-fill-oppo mx-3 box-border px-4 py-6 text-center">
      <text class="text-5 text-text-main mb-3 block text-left font-bold">
        {{ t("greeting", ["uniapp-template"]) }}
      </text>
      <text>{{ $t("ha-ha-ha-232111", 232, 111) }}</text>
      <text class="text-30rpx text-text-secondary mb-3 block text-left leading-relaxed">
        {{ $t("ji-yu-vitesseuniapp-you-vite") }}
        {{ $t("uniapp-qu-dong-de-shen-du-zheng-he-wot-ui-zu-jian-ku-de-kuai-su-qi-dong-mo-ban") }}
      </text>
      <text class="text-3 text-text-auxiliary block text-left leading-relaxed">
        {{ $t("bei-kao-uni-helperwot-ui-tuan-dui-gao-bie-hbuilderx-yong-bao-xian-dai-qian-duan-kai-fa-gong-ju-lian") }}
      </text>
    </view>

    <demo-block :title="t('settings.title')" transparent>
      <wd-cell-group border custom-class="rounded-2! overflow-hidden">
        <wd-cell :title="t('settings.darkMode')">
          <wd-switch v-model="isDark" size="18px" />
        </wd-cell>
        <wd-cell :title="t('settings.followSystem')">
          <wd-button size="small" @click="setFollowSystem"> {{ t("settings.followSystem") }} </wd-button>
        </wd-cell>
        <wd-cell :title="t('settings.themeColor')" is-link @click="openThemeColorPicker">
          <view class="flex items-center justify-end gap-2">
            <view class="h-4 w-4 rounded-full" :style="{ backgroundColor: currentThemeColor.primary }" />
            <text>{{ currentThemeColor.name }}</text>
          </view>
        </wd-cell>
        <wd-cell :title="t('settings.language')" is-link @click="showLangSheet = true">
          <view class="flex items-center justify-end gap-2">
            <text>{{ currentLangText }}</text>
          </view>
        </wd-cell>
      </wd-cell-group>
    </demo-block>

    <demo-block :title="t('gong-ju-lian-jie-shao')" transparent>
      <wd-cell-group border custom-class="rounded-2! overflow-hidden">
        <wd-cell :title="t('wotui-zu-jian-ku')" is-link @click="openUrl('https://wot-ui.cn/')" />
        <wd-cell :title="t('h5-sao-miao-jsqr')" is-link @click="openUrl('https://ext.dcloud.net.cn/plugin?id=7007')" />
        <wd-cell :title="t('mock-shu-ju')" is-link @click="openUrl('https://lavyun.github.io/better-mock')" />
        <wd-cell :title="t('uni-helper')" is-link @click="openUrl('https://uni-helper.js.org/')" />
        <wd-cell :title="t('icon-tu-biao')" is-link @click="openUrl('https://iconify.design/')" />
        <wd-cell :title="t('tailwindcss-yuan-zi-hua')" is-link @click="openUrl('https://tw.icebreaker.top/')" />
        <wd-cell :title="t('pinia-chi-jiu-hua')" is-link @click="openUrl('https://pinia.vuejs.org/')" />
        <wd-cell :title="t('uqrcode-er-wei-ma')" is-link @click="openUrl('https://ext.dcloud.net.cn/plugin?id=1287')" />
        <wd-cell
          :title="t('xiao-cheng-xu-fen-bao-you-hua')"
          is-link
          @click="openUrl('https://github.com/uni-ku/bundle-optimizer')"
        />
        <wd-cell
          :title="t('cicd-chi-xu-ji-cheng')"
          is-link
          @click="openUrl('https://github.com/Moonofweisheng/uni-mini-ci')"
        />
        <wd-cell :title="t('uni-ku-root')" is-link @click="openUrl('https://github.com/uni-ku/root')" />
        <wd-cell :title="t('uni-echarts')" is-link @click="openUrl('https://uni-echarts.xiaohe.ink/')" />
      </wd-cell-group>
    </demo-block>

    <!-- 主题色选择 ActionSheet -->
    <wd-action-sheet
      v-model="showThemeColorSheet"
      :title="t('settings.themeColor')"
      :close-on-click-action="true"
      @cancel="closeThemeColorPicker"
    >
      <view class="px-4 pb-4">
        <view
          v-for="option in themeColorOptions"
          :key="option.value"
          class="border-line-main flex items-center justify-between border-b py-3 last:border-b-0"
          @click="handleThemeColorSelect(option)"
        >
          <view class="flex items-center gap-3">
            <view class="border-line-main h-6 w-6 rounded-full border-2" :style="{ backgroundColor: option.primary }" />
            <text class="text-4 text-text-main">
              {{ option.name }}
            </text>
          </view>
          <wd-icon v-if="currentThemeColor.value === option.value" name="check" :color="option.primary" size="20px" />
        </view>
      </view>
      <wd-gap :height="50" />
    </wd-action-sheet>

    <!-- 语言选择 ActionSheet -->
    <wd-action-sheet v-model="showLangSheet" :title="$t('xuan-ze-yu-yan')" :close-on-click-action="true">
      <view class="px-4 pb-4">
        <view
          v-for="option in langOptions"
          :key="option.value"
          class="border-line-main flex items-center justify-between border-b py-3 last:border-b-0"
          @click="handleLangSelect(option.value)"
        >
          <text class="text-4 text-text-main">
            {{ option.name }}
          </text>
          <wd-icon v-if="currentLang === option.value" name="check" :color="currentThemeColor.primary" size="20px" />
        </view>
      </view>
      <wd-gap :height="50" />
    </wd-action-sheet>
  </view>
</template>

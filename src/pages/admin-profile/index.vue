<template>
  <view class="px-4">
    <!-- 头像区域 -->
    <view class="mb-4 flex items-center rounded-[24rpx] bg-white p-4" @click="handleInfo">
      <wd-icon name="user" size="38" color="#11a64a"></wd-icon>
      <view class="ml-4 flex-1">
        <view class="flex items-center">
          <text class="text-[36rpx] font-bold">管理员</text>
          <wd-tag type="primary" plain class="ml-[16rpx]">{{ userInfo?.role || "--" }}</wd-tag>
        </view>
        <view class="mt-[12rpx] text-[26rpx] text-gray-500">{{ userInfo?.username || "--" }}</view>
      </view>
    </view>

    <!-- 主模块 -->
    <view class="mb-4 rounded-[24rpx] bg-white">
      <wd-cell title="切换版本" center size="large" border is-link @click="versionPopupVisible = true">
        <text class="text-[24rpx] text-gray-400">{{ versionLabel }}</text>
      </wd-cell>
    </view>

    <!-- 退出登录按钮 -->
    <wd-button block plain @click="handleLogout" size="large" type="error"> 退出登录 </wd-button>

    <version-switch-popup v-model="versionPopupVisible" :value="rootFontSize" @confirm="handleVersionConfirm" />
  </view>
</template>

<script setup>
import VersionSwitchPopup from "@/components/version-switch-popup/version-switch-popup.vue"
import { useFont } from "@/composables/useFont"
import { useTokenStore } from "@/store/token"
import { useUserStore } from "@/store/user"

import { toLoginPage } from "@/utils/toLoginPage"

definePage({
  style: {
    navigationBarTitleText: "我的"
  },
  rules: ["admin"]
})

const tokenStore = useTokenStore()
const store = useUserStore()
const userInfo = store.userInfo
const versionPopupVisible = ref(false)
const { rootFontSize, setRootFontSize } = useFont()
const versionMap = {
  16: "标准版",
  20: "关怀版"
}
const versionLabel = computed(() => versionMap[rootFontSize.value] || `${rootFontSize.value}px`)
/** 跳转个人信息页面 */
function handleInfo() {
  uni.navigateTo({
    url: "/public-modules/shop-info/index"
  })
}

async function handleLogout() {
  let isOk = await uni.modal({
    title: "提示",
    content: "确定要退出登录吗？"
  })
  if (!isOk) return
  try {
    await tokenStore.logout()
    toLoginPage({ mode: "reLaunch" })
  } catch (error) {
    console.error(error)
  }
}

const handleVersionConfirm = value => {
  setRootFontSize(value)
  uni.toast({
    title: `已切换为${versionMap[value] || `${value}px`}`,
    icon: "none"
  })
}
</script>

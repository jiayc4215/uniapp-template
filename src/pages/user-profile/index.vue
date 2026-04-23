<template>
  <view class="bg-(--wot-filled-bottom) px-4 text-(--wot-text-main)">
    <!-- 头像区域 -->
    <view class="mb-4 flex items-center rounded-[24rpx] bg-(--wot-filled-oppo) p-4" @click="handleInfo">
      <wd-icon name="user" size="38" color="var(--wot-primary-6)"></wd-icon>
      <view class="ml-4 flex-1">
        <view class="flex items-center">
          <text class="text-[36rpx] font-bold">用户</text>
          <wd-tag type="primary" plain class="ml-[16rpx]">{{ userInfo?.role || "--" }}</wd-tag>
        </view>
        <view class="mt-[12rpx] text-[26rpx] text-(--wot-text-auxiliary)">{{ userInfo?.username || "--" }}</view>
      </view>
    </view>

    <!-- 主模块 -->
    <view class="mb-4 rounded-[24rpx] bg-(--wot-filled-oppo)">
      <wd-cell title="扫一扫" center size="large" border is-link @click="scanChange"> </wd-cell>
    </view>

    <!-- 退出登录按钮 -->
    <wd-button class="w-full" round @click="handleLogout" size="large" type="danger"> 退出登录 </wd-button>
  </view>
</template>

<script setup>
import { useTokenStore } from "@/store/token"
import { useUserStore } from "@/store/user"
import { toLoginPage } from "@/utils/toLoginPage"
import { isMp } from "@uni-helper/uni-env"

definePage({
  style: {
    navigationBarTitleText: "我的"
  },
  rules: ["user"]
})
const tokenStore = useTokenStore()
const store = useUserStore()
const userInfo = store.userInfo

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
const scanChange = () => {
  if (!isMp) {
    uni.navigateTo({
      url: "/public-modules/scan-page/scan-page"
    })
    return
  }
  uni.scanCode({
    scanType: ["qrCode"],
    success: function (res) {
      console.log(res)
    },
    fail: err => {
      console.log(err)
    }
  })
}
</script>

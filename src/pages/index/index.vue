<template>
  <view class="content">
    <image class="logo" src="/static/logo.png"></image>
    <view class="text-area">
      <text class="title">{{ title }}</text>
    </view>
    <view class="mt-8">
      <wd-button @click="handleLogout">退出登录</wd-button>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue"
import { useTokenStore } from "@/store/token"

const tokenStore = useTokenStore()

definePage({
  style: {
    navigationBarTitleText: "首页"
  },
  rules: ["admin", "user"]
})

const title = ref("角色演示首页")

const handleLogout = async () => {
  await tokenStore.logout()
  uni.reLaunch({
    url: "/pages/login/index"
  })
}
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>

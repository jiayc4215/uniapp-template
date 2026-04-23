<template>
  <view class="bg-fill-bottom text-text-main px-[32rpx] py-[120rpx] text-center">
    <view class="text-warning text-[44rpx] font-bold">无权限访问</view>
    <view class="text-text-secondary my-[12rpx]"> 当前角色没有这个页面的访问权限，请切换角色后重试。 </view>
    <wd-button type="primary" @click="goHome">返回首页</wd-button>
  </view>
</template>

<script setup>
definePage({
  style: {
    navigationBarTitleText: "权限提示"
  },
  excludeLoginPath: true
})

function goHome() {
  uni.reLaunch({
    url: "/pages/index/index"
  })
}
</script>

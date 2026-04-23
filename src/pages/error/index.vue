<template>
  <view class="bg-(--wot-filled-bottom) px-[32rpx] py-[120rpx] text-center text-(--wot-text-main)">
    <view class="text-[44rpx] font-bold text-(--wot-warning-main)">无权限访问</view>
    <view class="my-[12rpx] text-(--wot-text-secondary)"> 当前角色没有这个页面的访问权限，请切换角色后重试。 </view>
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

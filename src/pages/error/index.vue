<template>
  <view class="min-h-screen bg-[#fff7ed] px-[32rpx] py-[120rpx] text-center">
    <view class="mb-[24rpx] text-[44rpx] font-bold text-[#c2410c]">无权限访问</view>
    <view class="mb-[48rpx] text-[28rpx] leading-[42rpx] text-[#7c2d12]">
      当前角色没有这个页面的访问权限，请切换角色后重试。
    </view>
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

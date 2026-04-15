<template>
  <view class="min-h-screen bg-[#fff8f1] px-[32rpx] py-[40rpx]">
    <view class="mb-[24rpx] text-[40rpx] font-bold text-[#9a3412]">User Profile</view>
    <view class="rounded-[32rpx] bg-white p-[32rpx] shadow-sm">
      <view class="mb-[16rpx] text-[30rpx] font-semibold text-[#c2410c]">用户中心</view>
      <view class="text-[26rpx] leading-[42rpx] text-[#4b5563]">
        这个页面用于演示 `user` 角色的第三个 tab，可放个人资料、订单入口或设置项。
      </view>
    </view>
  </view>
</template>

<script setup>
definePage({
  style: {
    navigationBarTitleText: "我的"
  },
  rules: ["user"]
})
</script>

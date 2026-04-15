<template>
  <view class="min-h-screen bg-[#f5f7fb] px-[32rpx] py-[40rpx]">
    <view class="mb-[24rpx] text-[40rpx] font-bold text-[#1f2937]">Admin Dashboard</view>
    <view class="mb-[32rpx] text-[26rpx] leading-[40rpx] text-[#6b7280]">
      这个页面用于演示 `admin` 角色的专属 tab，你可以在这里放后台概览、审批列表或统计卡片。
    </view>

    <view class="rounded-[32rpx] bg-white p-[32rpx] shadow-sm">
      <view class="mb-[24rpx] text-[30rpx] font-semibold text-[#111827]">演示内容</view>
      <view class="text-[26rpx] leading-[42rpx] text-[#4b5563]">当前角色看到的第二个 tab 是“管理台”。</view>
    </view>
  </view>
</template>

<script setup>
definePage({
  style: {
    navigationBarTitleText: "管理台"
  },
  rules: ["admin"]
})
</script>

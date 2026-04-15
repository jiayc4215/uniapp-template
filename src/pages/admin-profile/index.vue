<template>
  <view class="min-h-screen bg-[#f3f6f4] px-[32rpx] py-[40rpx]">
    <view class="mb-[24rpx] text-[40rpx] font-bold text-[#14532d]">Admin Profile</view>
    <view class="rounded-[32rpx] bg-white p-[32rpx] shadow-sm">
      <view class="mb-[16rpx] text-[30rpx] font-semibold text-[#166534]">管理员信息</view>
      <view class="text-[26rpx] leading-[42rpx] text-[#4b5563]">
        这个页面用于演示 `admin` 角色的第三个 tab，可放账号资料、权限说明和退出登录按钮。
      </view>
    </view>
  </view>
</template>

<script setup>
definePage({
  style: {
    navigationBarTitleText: "我的"
  },
  rules: ["admin"]
})
</script>

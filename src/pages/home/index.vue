<template>
  <view class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    内容区域
  </view>
  <view
    class="bg-white dark:bg-(--wot-dark-background) text-gray-800 dark:text-(--wot-dark-color)"
  >
    自动适配暗黑模式的内容
  </view>
  <view class="i-mdi-home text-3xl text-red-600"></view>
  <view class="i-mdi-airballoon text-3xl text-red-600"></view>
  <demo></demo>
</template>

<script setup>
definePage({
  style: {
    navigationBarTitleText: "home",
  },
  type: "home",
});

const title = ref("home");
onShow(() => {
  console.log("onShow");
});
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

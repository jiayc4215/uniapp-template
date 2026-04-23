<template>
  <view class="bg-(--wot-filled-bottom) p-5 text-(--wot-text-main)">
    <!-- 异步 Echarts 入口 -->
    <view class="rounded-3 mb-2 bg-(--wot-filled-oppo) p-3 shadow-sm">
      <view
        class="rounded-2 bg-primary hover:bg-primary/80 px-6 py-3 text-center font-medium text-(--wot-text-white) transition-colors"
        @click="jumpSubEcharts"
      >
        跳转分包
      </view>
    </view>
    <!-- 饼图 -->
    <view class="rounded-3 mb-5 bg-(--wot-filled-oppo) p-5 shadow-sm">
      <view class="mb-5 text-center text-base font-medium text-(--wot-text-main)"> 异步分包Echarts </view>
      <Chart />
    </view>
  </view>
</template>

<script setup>
import Chart from "@/echarts-modules/components/chart/chart.vue"
definePage({
  style: {
    navigationBarTitleText: "发现"
  },
  rules: ["user"]
})
defineOptions({
  componentPlaceholder: {
    Chart: "view"
  }
})
const jumpSubEcharts = () => {
  uni.navigateTo({
    url: "/echarts-modules/index"
  })
}
</script>

<style lang="scss" scoped></style>

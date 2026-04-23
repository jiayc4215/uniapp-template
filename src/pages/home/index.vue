<template>
  <view class="bg-fill-bottom text-text-main p-5">
    <!-- 异步 Echarts 入口 -->
    <view class="rounded-3 bg-fill-oppo mb-2 p-3 shadow-sm">
      <view
        class="rounded-2 bg-primary hover:bg-primary/80 text-text-white px-6 py-3 text-center font-medium transition-colors"
        @click="jumpSubEcharts"
      >
        跳转分包
      </view>
    </view>
    <!-- 饼图 -->
    <view class="rounded-3 bg-fill-oppo mb-5 p-5 shadow-sm">
      <view class="text-text-main mb-5 text-center text-base font-medium"> 异步分包Echarts </view>
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

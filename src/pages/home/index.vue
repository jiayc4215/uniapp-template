<template>
  <view class="bg-gray-50 p-5">
    <!-- 异步 Echarts 入口 -->
    <view class="rounded-3 mb-2 bg-white p-3 shadow-sm">
      <view
        class="rounded-2 bg-primary hover:bg-primary/80 px-6 py-3 text-center font-medium text-white transition-colors"
        @click="jumpSubEcharts"
      >
        跳转分包
      </view>
    </view>
    <!-- 饼图 -->
    <view class="rounded-3 mb-5 bg-white p-5 shadow-sm">
      <view class="mb-5 text-center text-base font-medium text-gray-800"> 异步分包Echarts </view>
      <Chart />
    </view>
  </view>
</template>

<script setup>
import Chart from "@/subEcharts/components/chart/chart.vue"
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
    url: "/subEcharts/index"
  })
}
</script>

<style lang="scss" scoped></style>

<template>
  <view @tap="jumpSubEcharts">跳转分包</view>
  <Chart />
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

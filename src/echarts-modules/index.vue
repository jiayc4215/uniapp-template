<template>
  <view class="bg-fill-bottom text-text-main p-5">
    <!-- 饼图 -->
    <view class="rounded-3 bg-fill-oppo mb-5 p-5 shadow-sm">
      <view class="text-text-main mb-5 text-center text-base font-medium"> 饼图示例 </view>
      <Chart />
    </view>
  </view>
</template>

<script setup lang="ts">
import Chart from "./components/chart/chart.vue"
</script>

<style lang="scss" scoped></style>

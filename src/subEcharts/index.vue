<template>
  <view class="bg-gray-50 p-5">
    <!-- 饼图 -->
    <view class="rounded-3 mb-5 bg-white p-5 shadow-sm">
      <view class="mb-5 text-center text-base font-medium text-gray-800"> 饼图示例 </view>
      <Chart />
    </view>
  </view>
</template>

<script setup lang="ts">
import Chart from "./components/chart/chart.vue"
</script>

<style lang="scss" scoped></style>

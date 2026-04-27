<script setup>
defineProps({
  item: Object,
  index: Number,
  isBulge: Boolean
})
</script>

<template>
  <view class="tabbar-item-root">
    <template v-if="item.iconType === 'uiLib'">
      <wd-icon :name="item.icon" :size="isBulge ? '50' : '20'" />
    </template>

    <template v-if="item.iconType === 'tailwind'">
      <view :class="[item.icon, isBulge ? 'text-80px' : 'text-20px']" />
    </template>

    <view v-if="!isBulge" class="tabbar-text">
      {{ item.text }}
    </view>
  </view>
</template>

<style scoped lang="scss">
.tabbar-item-root {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.tabbar-text {
  margin-top: 2px;
  font-size: 0.75rem;
}

.text-20px {
  font-size: 20px;
}

.text-80px {
  font-size: 80px;
}
</style>

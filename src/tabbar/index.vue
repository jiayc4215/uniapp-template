<script setup>
// i-carbon-code
import { customTabbarEnable, needHideNativeTabbar, tabbarCacheEnable } from "./config"
import { tabbarList, tabbarStore } from "./store"
import TabbarItem from "./TabbarItem.vue"

// #ifdef MP-WEIXIN
defineOptions({
  virtualHost: true
})
// #endif

//鼓包点击
function handleClickBulge() {}

function handleClick(index) {
  if (index === tabbarStore.curIdx) {
    return
  }

  const list = tabbarList.value
  if (!list[index]) {
    return
  }

  //鼓包拦截
  if (list[index].isBulge) {
    handleClickBulge()
  }

  const url = list[index].pagePath
  tabbarStore.setCurIdx(index)

  if (tabbarCacheEnable) {
    uni.switchTab({ url })
  } else {
    uni.navigateTo({ url })
  }
}

// #ifndef MP-WEIXIN
onLoad(() => {
  needHideNativeTabbar &&
    uni.hideTabBar({
      fail(err) {
        console.log("hideTabBar fail: ", err)
      },
      success() {}
    })
})
// #endif

const activeColor = "var(--wot-primary-6)"
const inactiveColor = "var(--wot-text-auxiliary)"

function getColorByIndex(index) {
  return tabbarStore.curIdx === index ? activeColor : inactiveColor
}
</script>
<template>
  <view v-if="customTabbarEnable" class="tabbar-wrapper">
    <view class="border-and-fixed" @touchmove.stop.prevent>
      <view class="tabbar-content">
        <view
          v-for="(item, index) in tabbarList"
          :key="index"
          class="tabbar-item"
          :style="{ color: getColorByIndex(index) }"
          @click="handleClick(index)"
        >
          <!--  鼓包 -->
          <view v-if="item.isBulge" class="relative">
            <view class="bulge">
              <TabbarItem :item="item" :index="index" class="tabbar-item-inner" is-bulge />
            </view>
          </view>

          <!--  普通 -->
          <TabbarItem v-else :item="item" :index="index" class="tabbar-item-inner normal-item" />
        </view>
      </view>

      <view class="safe-area-bottom" />
    </view>
  </view>
</template>
<style scoped lang="scss">
.tabbar-wrapper {
  height: var(--wot-tabbar-height, 50px);
  padding-bottom: env(safe-area-inset-bottom);
}

.border-and-fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  border-top: 1px solid var(--wot-border-main);
  box-sizing: border-box;
  background: var(--wot-filled-oppo);
}

.tabbar-content {
  height: var(--wot-tabbar-height, 50px);
  display: flex;
  align-items: center;
}

.tabbar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

.tabbar-item-inner {
  position: relative;
  text-align: center;
  padding: 0 12px;
}

.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}

/* 鼓包样式 */
.bulge {
  position: absolute;
  top: -20px;
  left: 50%;
  transform-origin: top center;
  transform: translateX(-50%) scale(0.5) translateY(-33%);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 250rpx;
  height: 250rpx;
  border-radius: 50%;
  background-color: var(--wot-filled-oppo);
  box-shadow: inset 0 0 0 2px var(--wot-border-light);
}
</style>

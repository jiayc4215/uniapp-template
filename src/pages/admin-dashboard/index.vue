<template>
  <view class="bg-(--wot-filled-bottom) p-5 text-(--wot-text-main)">
    <!-- 异步 Echarts 入口 -->
    <view class="rounded-3 mb-2 bg-(--wot-filled-oppo) p-3 shadow-sm">
      <view
        class="rounded-2 bg-primary hover:bg-primary/80 px-6 py-3 text-center font-medium text-(--wot-text-white) transition-colors"
        @click="onSave"
      >
        保存二维码
      </view>
    </view>
    <!-- 饼图 -->
    <view class="rounded-3 mb-5 flex flex-col items-center justify-center bg-(--wot-filled-oppo) p-5 shadow-sm">
      <view class="mb-5 text-center text-base font-medium text-(--wot-text-main)"> 扫描下方二维码，加我为好友 </view>
      <u-qrcode ref="qrcode" canvas-id="qrcode" :value="inviteUrl" @complete="onComplete"></u-qrcode>
    </view>
  </view>
</template>

<script setup>
import uQrcode from "@/public-modules/components/u-qrcode/u-qrcode.vue"
const qrcode = ref()
const isComplete = ref(false)
const { proxy } = getCurrentInstance()

definePage({
  style: {
    navigationBarTitleText: "管理台"
  },
  rules: ["admin"]
})
defineOptions({
  componentPlaceholder: {
    "u-qrcode": "view"
  }
})

const inviteUrl = ref("https://u.wechat.com/MK_C26y1TlFztvccVZaf1_M?s=3")
/**
 * 二维码生成完成
 */
const onComplete = e => {
  if (e.success) {
    isComplete.value = true
  }
}

/**
 * 保存二维码
 */
const onSave = () => {
  if (!isComplete.value) {
    uni.showToast({ title: "二维码生成中...", icon: "none" })
    return
  }

  const qrcodeCom = qrcode.value || proxy.$refs.qrcode
  if (!qrcodeCom) {
    uni.showToast({ title: "二维码实例未准备好", icon: "none" })
    return
  }

  qrcodeCom.save({
    success: () => {
      console.log("成功回调")
    },
    fail: async err => {
      console.log(err)
      // 处理权限被拒绝的情况
      if (err.errMsg.includes("auth deny") || err.errMsg.includes("auth denied")) {
        showAuthModal()
        return
      }
      uni.showToast({ title: "保存失败", icon: "none" })
    }
  })
}
// 引导用户去设置页开启权限
const showAuthModal = () => {
  uni.showModal({
    title: "提示",
    content: "需要您授权保存图片到相册",
    confirmText: "去设置",
    success: res => {
      if (res.confirm) uni.openSetting()
    }
  })
}
</script>

<style lang="scss" scoped></style>

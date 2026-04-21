<template>
  <view class="scan-page">
    <scan @success="qrcodeSucess" @error="qrcodeError" />
  </view>
</template>

<script setup>
const qrcodeSucess = data => {
  uni.$emit("scanResult", data)
  // 返回
  uni.navigateBack()
}
const qrcodeError = err => {
  console.log(err)
  uni.showModal({
    title: "摄像头授权失败",
    content: "摄像头授权失败，请检测当前浏览器是否有摄像头权限。",
    success: () => {
      uni.navigateBack({})
    }
  })
}
</script>

<style lang="scss" scoped>
.scan-page {
  width: 100%;
  height: 100%;
}
</style>

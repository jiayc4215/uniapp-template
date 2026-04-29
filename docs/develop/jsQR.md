# H5 扫码

H5 扫码基于 `jsQR` 和 `navigator.mediaDevices.getUserMedia` 实现。摄像头画面绘制到 `canvas` 后，由 `jsQR` 解析二维码内容。

## 项目文件

- `src/public-modules/components/scan/scan.vue`
- `src/public-modules/scan-page/scan-page.vue`

`jsqr` 已在根目录 `package.json` 中声明，无需额外安装。

## 运行环境

- 仅 H5 环境使用浏览器摄像头能力。
- 页面需要运行在 HTTPS 环境下。
- iOS 浏览器均使用 Safari 内核，权限表现以 Safari 为准。
- 部分安卓浏览器内核较旧，可能不支持 `getUserMedia` 或闪光灯能力。

## 使用方式

扫码页面位于 `src/public-modules/scan-page/scan-page.vue`：

```vue
<template>
  <view class="scan-page">
    <scan @success="qrcodeSucess" @error="qrcodeError" />
  </view>
</template>

<script setup>
const qrcodeSucess = data => {
  uni.$emit("scanResult", data)
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
```

扫码组件会在识别成功后触发 `success` 事件，扫码页通过 `uni.$emit("scanResult", data)` 抛出结果。

## 组件参数

| 参数         | 说明                                                | 类型      | 默认值        |
| ------------ | --------------------------------------------------- | --------- | ------------- |
| `continue`   | 是否连续识别                                        | `boolean` | `false`       |
| `exact`      | 摄像头方向，`environment` 后摄像头，`user` 前摄像头 | `string`  | `environment` |
| `size`       | 扫码区域大小，`whole` 全屏，`balf` 半屏             | `string`  | `whole`       |
| `definition` | 是否高清                                            | `boolean` | `false`       |

## 事件

| 事件名    | 说明                     | 回调参数   |
| --------- | ------------------------ | ---------- |
| `success` | 识别到二维码内容         | 二维码内容 |
| `error`   | 摄像头调用失败或权限失败 | 错误对象   |

## 常见错误

- `NotAllowedError`：用户拒绝摄像头权限，或浏览器禁止摄像头访问。
- `NotFoundError`：未找到符合条件的摄像头。
- `NotReadableError`：摄像头被占用或硬件不可用。
- `OverconstrainedError`：指定摄像头参数无法满足。
- `SecurityError`：非安全上下文或浏览器策略禁止。

## 注意事项

- `scan.vue` 内部直接使用 DOM、`canvas` 和 `document`，不适合作为小程序组件复用。
- 开发调试 H5 时，`vite.config.js` 已启用 `basicSsl()`，可以使用 HTTPS 本地服务测试摄像头权限。
- 离开扫码页时需要停止摄像头流，组件内部的 `closeCamera()` 会释放 `MediaStreamTrack`。

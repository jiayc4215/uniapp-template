# Uniapp 使用 UQRCode 创建二维码

`uQRCode` 是一款基于 `Javascript` 环境开发的二维码生成插件，适用所有 `Javascript` 运行环境的前端应用和 `Node.js` 应用。

`uQRCode` 可扩展性高，它支持自定义渲染二维码，可通过 `uQRCode API` 得到二维码绘制关键信息后，使用 `canvas` 、 `svg` 或 `js` 操作 `dom` 的方式绘制二维码图案。还可自定义二维码样式，如随机颜色、圆点、方块、块与块之间的间距等。

## 快速上手

> 在 `uni-app` 中，我们更推荐使用组件方式来生成二维码，组件方式大大提高了页面的可读性以及避开了一些平台容易出问题的地方，当组件无法满足需求的时候，再考虑切换成原生方式。

github地址： [https://github.com/Sansnn/uQRCode](https://github.com/Sansnn/uQRCode) 。

npm地址： [https://www.npmjs.com/package/uqrcodejs](https://www.npmjs.com/package/uqrcodejs) 。

uni-app插件市场地址： [https://ext.dcloud.net.cn/plugin?id=1287](https://ext.dcloud.net.cn/plugin?id=1287) 。

### 安装

通过包管理器安装，成功后即可使用 `import` 或 `require` 进行引用。

```bash
pnpm add uqrcodejs
# 或者
pnpm add @uqrcode/js
```

通过项目开源地址获取 `uqrcode.js` ，下载 `uqrcode.js` 后，将其复制到您项目指定目录，在页面中引入 `uqrcode.js` 文件即可开始使用。

### 引入

通过 `import` 引入。

```cobol
import UQRCode from 'uqrcodejs'
// 或者
import UQRCode from '@uqrcode/js'
```

`Node.js` 通过 `require` 引入。

```cobol
const UQRCode = require('uqrcodejs')
// 或者
const UQRCode = require('@uqrcode/js')
```

原生浏览器环境，在js脚本加载时添加到 `window` 。

```cobol
<script type="text/javascript" src="uqrcode.js"></script>
<script>
    var UQRCode = window.UQRCode;
</script>
```

### 简单用法

`uQRCode` 基于 `Canvas API` 封装了一套方法，建议开发者使用 `canvas` 生成，一键调用，非常方便。以下是示例：

Template部分

```cobol
<canvas id="qrcode" canvas-id="qrcode" style="width: 200px;height: 200px;"></canvas>
```

JS部分

```cobol
onMounted() {
  // 获取uQRCode实例
  var qr = new UQRCode();
  // 设置二维码内容
  qr.data = "https://uqrcode.cn/doc";
  // 设置二维码大小，必须与canvas设置的宽高一致
  qr.size = 200;
  // 调用制作二维码方法
  qr.make();
  // 获取canvas上下文
  var canvasContext = uni.createCanvasContext('qrcode', this); // 如果是组件，this必须传入
  // 设置uQRCode实例的canvas上下文
  qr.canvasContext = canvasContext;
  // 调用绘制方法将二维码图案绘制到canvas上
  qr.drawCanvas();
}
```

微信小程序，推荐使用Canvas2D，关于Canvas 2D的使用请参考微信开放文档。

```cobol
<template>
  <view class="flex items-center justify-center p-4">
    <!-- 微信小程序推荐使用 type="2d" 以获得更好性能 -->
    <!-- 如果需要跨平台，建议保留 canvas-id -->
    <canvas type="2d" id="qrcode" canvas-id="qrcode" style="width: 200px; height: 200px"></canvas>
  </view>
</template>

<script setup>
import { onMounted, getCurrentInstance } from "vue"
import UQRCode from "@uqrcode/js"

const instance = getCurrentInstance()

onMounted(() => {
  // #ifdef MP-WEIXIN
  drawMpCanvas()
  // #endif

  // #ifndef MP-WEIXIN
  drawNormalCanvas()
  // #endif
})

/**
 * 微信小程序 Canvas 2D 绘制
 */
function drawMpCanvas() {
  // 将选择器的选取范围更改为自定义组件 component 内。（初始时，选择器仅选取页面范围的节点，不会选取任何自定义组件中的节点）
  const query = uni.createSelectorQuery().in(instance)

  query
    // 在当前页面下选择第一个匹配选择器 selector 的节点。返回一个 NodesRef 对象实例，可以用于获取节点信息。
    .select("#qrcode")
    // 获取节点的相关信息。需要获取的字段在fields中指定。「是否返回节点对应的 Node 实例，是否返回节点尺寸（width height）」
    .fields({ node: true, size: true })
    // 执行所有的请求。请求结果按请求次序构成数组，在callback的第一个参数中返回。
    .exec(res => {
      // 微信小程序中的 Canvas 2D 逻辑
      if (res && res[0] && res[0].node) {
        const canvas = res[0].node

        // 该方法返回 Canvas 的绘图上下文
        const ctx = canvas.getContext("2d")

        // 设备像素比
        const dpr = uni.getSystemInfoSync().pixelRatio

        // 分辨率缩放，防止模糊
        canvas.width = res[0].width * dpr
        canvas.height = res[0].height * dpr

        // 在调用后，之后创建的路径其横纵坐标会被缩放。多次调用倍数会相乘。
        ctx.scale(dpr, dpr)

        const qr = new UQRCode()

        qr.data = "https://uqrcode.cn/doc"

        qr.size = 200

        qr.make()

        qr.canvasContext = ctx

        qr.drawCanvas()
      }
    })
}

/**
 * H5 / App / 其它平台绘制
 */
function drawNormalCanvas() {
  // 获取uQRCode实例
  const qr = new UQRCode()

  // 设置二维码内容
  qr.data = "https://uqrcode.cn/doc"

  // 设置二维码大小，必须与canvas设置的宽高一致
  qr.size = 200

  // 调用制作二维码方法
  qr.make()

  // 获取canvas上下文
  const canvasContext = uni.createCanvasContext("qrcode", instance) // 如果是组件，this必须传入

  // 设置uQRCode实例的canvas上下文
  qr.canvasContext = canvasContext

  // 调用绘制方法将二维码图案绘制到canvas上
  qr.drawCanvas()
}
</script>

<style scoped>
.flex {
  display: flex;
}
.justify-center {
  justify-content: center;
}
.items-center {
  align-items: center;
}
.p-4 {
  padding: 1rem;
}
</style>
```

## 高级用法

考虑到部分平台可能不支持 `canvas` ，所以 `uQRCode` 并没有强制要求和 `canvas` 一起使用，您还可以选择其他方式来生成二维码，例如使用 `js` 操作 `dom` 进行绘制或是使用 `svg` 绘制等。以下是示例：

uni-app v-for+view

```cobol
<template>
  <view>
    <view class="qrcode">
      <view
        v-for="(row, rowI) in modules"
        :key="rowI"
        style="display: flex; flex-direction: row"
      >
        <view v-for="(col, colI) in row" :key="colI">
          <view
            v-if="col.isBlack"
            style="width: 10px; height: 10px; background-color: black"
          />
          <view
            v-else
            style="width: 10px; height: 10px; background-color: white"
          />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import UQRCode from "@uqrcode/js";

// 1. 定义响应式数据
const modules = ref([]);

// 2. 使用 UniApp 专用的生命周期钩子
onLoad(() => {
  console.log("onLoad - Vue3");

  const qr = new UQRCode();
  qr.data = "https://uqrcode.cn/doc";
  qr.size = 200; // 建议指定大小，虽然你是手动循环渲染

  // 执行生成
  qr.make();

  // 3. 赋值给响应式变量 (Vue3 需要 .value)
  modules.value = qr.modules;
});
</script>

<style scoped>
.qrcode {
  /* 可以在这里添加容器样式，例如居中 */
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50rpx;
}
</style>
```

### 导出临时文件路径

原生方式基于 `Canvas` 的，请自行参阅各平台 `Canvas` 的导出方式。以下是部分示例：

uni-app

```cobol
function exportNormalCanvasTempFile() {
  return new Promise((resolve, reject) => {
    // 调用完ctx.draw()方法后不能第一时间导出，否则会异常，需要有一定的延时
    setTimeout(() => {
      uni.canvasToTempFilePath(
        {
          // 标识，传入 canvas 组件的 canvas-id
          canvasId: "qrcode",
          // 	目标文件的类型
          fileType: "png",
          // 指定的画布区域的宽度
          width: 200,
          // 指定的画布区域的高度
          height: 200,
          // 输出的图片的宽度
          destWidth: 200,
          //输出的图片的高度
          destHeight: 200,

          success: (res) => {
            resolve(res.tempFilePath);
          },

          fail: (err) => {
            reject(err);
          },
        },
        instance,
      );
    }, 300);
  });
}
```

Canvas2D

```javascript
function exportMpCanvasTempFile() {
  return new Promise((resolve, reject) => {
    try {
      // 返回一个包含图片展示的 data URI 。可以使用 type 参数其类型，默认为 PNG 格式。
      const tempFilePath = canvasNode.toDataURL()

      resolve(tempFilePath)
    } catch (err) {
      reject(err)
    }
  })
}
```

### 保存二维码到本地相册

必须在导出临时文件路径成功后再执行保存。uni-app通用保存方式（H5除外）：

```javascript
function saveNativeQrcode(tempFilePath) {
  uni.saveImageToPhotosAlbum({
    filePath: tempFilePath,

    success: res => {
      uni.showToast({
        title: "保存成功"
      })

      console.log(res)
    },

    fail: err => {
      console.log(err)
    }
  })
}
```

H5可以通过设置 `<a>` 标签 `href` 属性的方式进行保存：

```cobol
/**
 * H5 下载保存
 */
function saveH5Qrcode(tempFilePath) {
  const aEle = document.createElement("a");

  aEle.download = "uQRCode";

  aEle.href = tempFilePath;

  document.body.appendChild(aEle);

  aEle.click();

  aEle.remove();
}
```

经过测试，PC端浏览器可以下载，部分安卓自带或第三方浏览器可以下载，安卓微信浏览器不适用，移动端iOS所有浏览器均不适用，差异较大，还是推荐各位导出文件给图片组件显示，然后提示用户通过长按图片进行保存这种方式。

## uni-app组件方式

### 安装

通过uni-app插件市场地址安装： [https://ext.dcloud.net.cn/plugin?id=1287](https://ext.dcloud.net.cn/plugin?id=1287)

### 引入

uni-app默认为easycom模式，可直接键入 `<uqrcode>` 标签。

### 简单用法

安装 `uqrcode` 组件后，在 `template` 中键入 `<uqrcode/>` 。设置 `ref` 属性可使用组件内部方法， `canvas-id` 属性为组件内部的canvas组件标识， `value` 属性为二维码生成对应内容， `options` 为配置选项，可配置二维码样式，绘制Logo等，

```cobol
<uqrcode ref="uqrcode" canvas-id="qrcode" value="https://uqrcode.cn/doc" :options="{ margin: 10 }"></uqrcode>
```

### 导出临时文件路径

为了保证方法调用成功，请在 [complete](https://uqrcode.cn/doc/document/uni-app.html#complete) 事件返回 `success=true` 后调用。

```cobol
// uqrcode为组件的ref名称
this.$refs.uqrcode.toTempFilePath({
  success: res => {
    console.log(res);
  }
});
```

### 保存二维码到本地相册

为了保证方法调用成功，请在 [complete](https://uqrcode.cn/doc/document/uni-app.html#complete) 事件返回 `success=true` 后调用。

```php
// uqrcode为组件的ref名称
this.$refs.uqrcode.save({
  success: () => {
    uni.showToast({
      icon: 'success',
      title: '保存成功'
    });
  }
});
```

> 工程已安装 `uqrcodejs`，公共二维码组件位于 `src/public-modules/components/u-qrcode`。

## 完整演示demo

```cobol
<template>
  <view class="flex justify-center items-center p-4 flex-col">
    <!-- 微信小程序推荐使用 type="2d" 以获得更好性能 -->
    <!-- 如果需要跨平台，建议保留 canvas-id -->
    <canvas
      type="2d"
      id="qrcode"
      canvas-id="qrcode"
      style="width: 200px; height: 200px"
    ></canvas>

    <button @click="previewQrcode" class="mt-4">预览二维码</button>

    <button @click="saveQrcode" class="mt-4">保存二维码</button>
  </view>
</template>

<script setup>
import { onMounted, getCurrentInstance } from "vue";
import UQRCode from "@uqrcode/js";

const instance = getCurrentInstance();

let canvasNode = null;

onMounted(() => {
  // #ifdef MP-WEIXIN
  drawMpCanvas();
  // #endif

  // #ifndef MP-WEIXIN
  drawNormalCanvas();
  // #endif
});

/**
 * 微信小程序 Canvas 2D 绘制
 */
function drawMpCanvas() {
  const query = uni.createSelectorQuery().in(instance);

  query
    .select("#qrcode")
    .fields({ node: true, size: true })
    .exec((res) => {
      canvasNode = res[0].node;

      const ctx = canvasNode.getContext("2d");

      const dpr = uni.getSystemInfoSync().pixelRatio;

      canvasNode.width = res[0].width * dpr;
      canvasNode.height = res[0].height * dpr;

      ctx.scale(dpr, dpr);

      const qr = new UQRCode();

      qr.data = "https://uqrcode.cn/doc";

      qr.size = 200;

      qr.make();

      qr.canvasContext = ctx;

      qr.drawCanvas();
    });
}

/**
 * H5 / App / 普通 Canvas 绘制
 */
function drawNormalCanvas() {
  const qr = new UQRCode();

  qr.data = "https://uqrcode.cn/doc";

  qr.size = 200;

  qr.make();

  const ctx = uni.createCanvasContext("qrcode", instance);

  qr.canvasContext = ctx;

  qr.drawCanvas();
}

/**
 * 微信小程序 2D Canvas 导出
 */
function exportMpCanvasTempFile() {
  return new Promise((resolve, reject) => {
    try {
      const tempFilePath = canvasNode.toDataURL();

      resolve(tempFilePath);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * H5 / 普通 Canvas 导出
 */
function exportNormalCanvasTempFile() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      uni.canvasToTempFilePath(
        {
          canvasId: "qrcode",

          fileType: "png",

          width: 200,

          height: 200,

          destWidth: 200,

          destHeight: 200,

          success: (res) => {
            resolve(res.tempFilePath);
          },

          fail: (err) => {
            reject(err);
          },
        },
        instance,
      );
    }, 300);
  });
}

/**
 * 预览二维码
 */
async function previewQrcode() {
  try {
    let tempFilePath = "";

    // #ifdef MP-WEIXIN
    tempFilePath = await exportMpCanvasTempFile();
    // #endif

    // #ifndef MP-WEIXIN
    tempFilePath = await exportNormalCanvasTempFile();
    // #endif

    uni.previewImage({
      urls: [tempFilePath],
    });
  } catch (err) {
    console.error("预览失败", err);
  }
}

/**
 * 小程序 / App 保存到相册
 */
function saveNativeQrcode(tempFilePath) {
  uni.saveImageToPhotosAlbum({
    filePath: tempFilePath,

    success: (res) => {
      uni.showToast({
        title: "保存成功",
      });

      console.log(res);
    },

    fail: (err) => {
      console.log(err);
    },
  });
}

/**
 * H5 下载保存
 */
function saveH5Qrcode(tempFilePath) {
  const aEle = document.createElement("a");

  aEle.download = "uQRCode";

  aEle.href = tempFilePath;

  document.body.appendChild(aEle);

  aEle.click();

  aEle.remove();
}

/**
 * 保存二维码
 */
async function saveQrcode() {
  try {
    let tempFilePath = "";

    // #ifdef MP-WEIXIN
    tempFilePath = await exportMpCanvasTempFile();

    saveNativeQrcode(tempFilePath);
    // #endif

    // #ifdef APP-PLUS
    tempFilePath = await exportNormalCanvasTempFile();

    saveNativeQrcode(tempFilePath);
    // #endif

    // #ifdef H5
    tempFilePath = await exportNormalCanvasTempFile();

    saveH5Qrcode(tempFilePath);
    // #endif
  } catch (err) {
    console.error("保存失败", err);
  }
}
</script>

<style scoped>
.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.justify-center {
  justify-content: center;
}

.items-center {
  align-items: center;
}

.p-4 {
  padding: 1rem;
}

.mt-4 {
  margin-top: 1rem;
}
</style>
```

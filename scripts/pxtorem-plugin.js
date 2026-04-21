import pxtorem from "postcss-pxtorem"

export default function pxtoremPlugin(options = {}) {
  // 自定义默认配置
  const defaultOptions = {
    rootValue: 16, // 根元素字体大小，1rem = 16px
    unitPrecision: 5, // 转换精度
    propList: ["font", "font-size", "line-height", "letter-spacing", "*-fs", "*-fs-*", "*-font-size", "--wot-fs-*"],
    selectorBlackList: [], // 忽略的选择器
    replace: true, // 是否替换
    mediaQuery: false, // 是否转换媒体查询
    minPixelValue: 0, // 最小转换像素值
    exclude: null, // 排除的文件
    unit: "px" // 转换单位
  }

  // 合并参数配置
  const mergedOptions = { ...defaultOptions, ...options }

  return {
    name: "vite-pxtorem-plugin",
    enforce: "post",

    // 配置PostCSS
    config: () => {
      return {
        css: {
          postcss: {
            plugins: [pxtorem(mergedOptions)]
          }
        }
      }
    }
  }
}

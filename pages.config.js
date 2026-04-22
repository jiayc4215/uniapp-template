import { defineUniPages } from "@uni-helper/vite-plugin-uni-pages"
import { tabBar } from "./src/tabbar/config"

export default defineUniPages({
  globalStyle: {
    navigationBarBackgroundColor: "@navBgColor",
    navigationBarTextStyle: "@navTxtStyle",
    navigationBarTitleText: "uniapp",

    // 页面背景配置
    backgroundColor: "@bgColor",
    backgroundTextStyle: "@bgTxtStyle",
    backgroundColorTop: "@bgColorTop",
    backgroundColorBottom: "@bgColorBottom"
  },
  easycom: {
    autoscan: true,
    custom: {
      "^wd-(.*)": "@wot-ui/ui/components/wd-$1/wd-$1.vue"
    }
  },
  tabBar
})

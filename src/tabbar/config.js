/**
 * 当前项目固定使用 自定义 tabbar
 * 温馨提示：本文件修改后需要重新运行，否则 pages.json 不会更新
 */

/**
 * 自定义 tabbar 配置
 */
export const customTabbarList = [
  {
    text: "首页",
    pagePath: "pages/index/index",
    icon: "i-mdi-home",
    roles: ["admin"],
    iconType: "tailwind"
  },
  {
    pagePath: "pages/admin-dashboard/index",
    text: "管理台",
    icon: "i-mdi-view-dashboard",
    roles: ["admin"],
    iconType: "tailwind"
  },
  {
    pagePath: "pages/admin-profile/index",
    text: "我的",
    icon: "i-mdi-account",
    roles: ["admin"],
    iconType: "tailwind"
  },
  {
    pagePath: "pages/index/index",
    text: "首页",
    icon: "i-mdi-home",
    roles: ["user"],
    iconType: "tailwind"
  },
  {
    pagePath: "pages/home/index",
    text: "发现",
    icon: "i-mdi-compass",
    roles: ["user"],
    iconType: "tailwind"
  },
  {
    pagePath: "pages/user-profile/index",
    text: "我的",
    icon: "i-mdi-account",
    roles: ["user"],
    iconType: "tailwind"
  }
]

/**
 * 是否启用 tabbar 缓存
 * 自定义 tabbar 必须启用缓存
 */
export const tabbarCacheEnable = true

/**
 * 是否启用自定义 tabbar
 */
export const customTabbarEnable = true

/**
 * 是否隐藏原生 tabbar
 */
export const needHideNativeTabbar = true

/**
 * tabbar 列表
 */
export const tabbarList = customTabbarList

/**
 * 生成 pages.json 所需的 tabBar 配置
 * 只有微信小程序支持 custom
 */
export const tabBar = {
  custom: true,
  height: "0",
  fontSize: "10px",
  iconWidth: "24px",
  spacing: "3px",
  color: "@tabColor",
  selectedColor: "@tabSelectedColor",
  backgroundColor: "@tabBgColor",
  borderStyle: "@tabBorderStyle",
  list: customTabbarList.map(item => ({
    text: item.text,
    pagePath: item.pagePath
  }))
}

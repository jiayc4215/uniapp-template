import { computed, reactive } from "vue"
import { useUserStore } from "@/store/user"

import { tabbarList as _tabbarList } from "./config"

/** tabbarList 里面的 path 从 pages.config.ts 得到 */
const baseTabbarList = reactive(
  _tabbarList.map(item => ({
    ...item,
    pagePath: item.pagePath.startsWith("/") ? item.pagePath : `/${item.pagePath}` // 统一成 '/' 开头的路径
  }))
)

// 获取用户角色
const userRoles = computed(() => {
  const userStore = useUserStore()
  const userInfo = userStore.userInfo
  //  业务角色只有1个，所以直接返回 roles代表所有角色
  // if (Array.isArray(userInfo?.roles) && userInfo.roles.length > 0) {
  //   return userInfo.roles
  // }
  if (userInfo?.role) {
    return [userInfo.role]
  }
  return []
})

// 过滤tabbar列表
const tabbarList = computed(() => {
  const roles = userRoles.value

  if (roles.length === 0) {
    return baseTabbarList.filter(item => !item.roles || item.roles.length === 0)
  }
  return baseTabbarList.filter(
    item => !item.roles || item.roles.length === 0 || item.roles.some(role => roles.includes(role))
  )
})

export function isPageTabbar(path) {
  const _path = path.split("?")[0]
  return tabbarList.value.some(item => item.pagePath === _path)
}

/**
 * 自定义 tabbar 的状态管理，原生 tabbar 无需关注本文件
 * tabbar 状态，增加 storageSync 保证刷新浏览器时在正确的 tabbar 页面
 * 使用 reactive 简单状态，而不是 pinia 全局状态
 */
const tabbarStore = reactive({
  curIdx: uni.getStorageSync("app-tabbar-index") || 0,
  prevIdx: uni.getStorageSync("app-tabbar-index") || 0,

  setCurIdx(idx) {
    this.curIdx = idx
    uni.setStorageSync("app-tabbar-index", idx)
  },

  setAutoCurIdx(path) {
    const list = tabbarList.value
    if (list.length === 0) {
      this.setCurIdx(0)
      return
    }

    // '/' 当做首页
    if (path === "/") {
      this.setCurIdx(0)
      return
    }

    const index = list.findIndex(item => item.pagePath === path)

    if (index === -1) {
      const pagesPathList = getCurrentPages().map(item => (item.route.startsWith("/") ? item.route : `/${item.route}`))

      const flag = list.some(item => pagesPathList.includes(item.pagePath))

      if (!flag) {
        this.setCurIdx(0)
        return
      }
    } else {
      this.setCurIdx(index)
    }
  },

  restorePrevIdx() {
    if (this.prevIdx === this.curIdx) return

    this.setCurIdx(this.prevIdx)
    this.prevIdx = uni.getStorageSync("app-tabbar-index") || 0
  }
})

export { tabbarList, tabbarStore }

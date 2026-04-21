import { tabbarStore } from "@/tabbar/store"
import { getAllPages } from "@/utils/router"
import { useTokenStore } from "@/store/token"
import { useUserStore } from "@/store/user"
import { LOGIN_PAGE, EXCLUDE_LOGIN_PATH_LIST } from "./config"
export function judgeIsExcludePath(path) {
  // 1. 先校验静态排除列表（生产和开发环境通用，性能最高）
  if (EXCLUDE_LOGIN_PATH_LIST.includes(path)) {
    return true
  }

  // 2. 如果静态列表没匹配上，且处于开发环境，则尝试动态获取
  if (import.meta.env.DEV) {
    const allExcludeLoginPages = getAllPages("excludeLoginPath")
    return allExcludeLoginPages.some(page => page.path === path)
  }

  return false
}
// 校验权限
const checkPermission = path => {
  const { userInfo } = useUserStore()

  // 1. 提取角色逻辑：更加简洁且具备防御性
  const userRoles = [].concat(userInfo?.roles || userInfo?.role || [])

  // 2. 获取页面配置
  const pageConfig = getAllPages("rules").find(p => p.path === path)

  // 3. 如果页面没有定义规则，通常默认放行
  if (!pageConfig?.rules || !Array.isArray(pageConfig.rules)) {
    return true
  }

  // 4. 权限校验
  return pageConfig.rules.some(rule => userRoles.includes(rule))
}
export const permission = {
  install(router) {
    router.beforeEach((to, from, next) => {
      const tokenStore = useTokenStore()
      let path = to.path
      const fullPath = to.fullPath
      // 2. 更新 Tabbar 索引
      tabbarStore.setAutoCurIdx(path)

      console.log("tokenStore.hasLogin", tokenStore.hasLogin)

      /* has token*/
      if (tokenStore.hasLogin) {
        // 如果是登录页，重定向到首页
        if (path === LOGIN_PAGE) {
          next({ path: "/" })
        } else if (judgeIsExcludePath(path)) {
          // 如果是白名单页面，直接进入
          next()
        } else {
          // 校验权限
          if (checkPermission(path)) {
            next()
          } else {
            // 权限不足，重定向到首页
            next({ path: "/pages/error/index" })
          }
        }
      } else {
        // 没有token
        if (judgeIsExcludePath(path)) {
          // 在免登录白名单，直接进入
          next()
        } else {
          // 否则全部重定向到登录页
          next(`${LOGIN_PAGE}?redirect=${encodeURIComponent(fullPath)}`)
        }
      }
    })
  }
}

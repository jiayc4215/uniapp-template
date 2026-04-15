/**

 * 路由拦截，通常也是登录拦截
 * 黑、白名单的配置，请看 config.ts 文件， EXCLUDE_LOGIN_PATH_LIST
 * 仅支持小程序环境 H5环境采用beforeRouteEnter
 */
import { isMp } from "@uni-helper/uni-env"
import { tabbarStore } from "@/tabbar/store"
import { parseUrlToObj } from "@/utils/router"
export const navigateToInterceptor = {
  invoke({ url }) {
    if (url === undefined) {
      return
    }
    if (!isMp) {
      return
    }
    let { path } = parseUrlToObj(url)
    // 处理直接进入路由非首页时，tabbarIndex 不正确的问题
    tabbarStore.setAutoCurIdx(path)
  }
}
// 针对 chooseLocation 的特殊处理
export const chooseLocationInterceptor = {
  invoke() {
    // 直接放行 chooseLocation 调用
    return true
  }
}
export const routeInterceptor = {
  install() {
    uni.addInterceptor("navigateTo", navigateToInterceptor)
    uni.addInterceptor("reLaunch", navigateToInterceptor)
    uni.addInterceptor("redirectTo", navigateToInterceptor)
    uni.addInterceptor("switchTab", navigateToInterceptor)

    // 添加 chooseLocation 的拦截器，确保直接放行
    uni.addInterceptor("chooseLocation", chooseLocationInterceptor)
  }
}

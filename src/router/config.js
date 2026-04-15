import { getAllPages } from "@/utils"

export const LOGIN_STRATEGY_MAP = {
  DEFAULT_NEED_LOGIN: 1 // 白名单策略，默认不可以进入APP，需要强制登录
}

export const LOGIN_STRATEGY = LOGIN_STRATEGY_MAP.DEFAULT_NEED_LOGIN

export const isNeedLoginMode = LOGIN_STRATEGY === LOGIN_STRATEGY_MAP.DEFAULT_NEED_LOGIN

export const LOGIN_PAGE = "/pages/login/index"
export const REGISTER_PAGE = "/pages/auth/register"
export const ERROR_PAGE = "/pages/error/index"
// 默认白名单( /是预防直接进入网站 )
export const LOGIN_PAGE_LIST = [LOGIN_PAGE, REGISTER_PAGE, ERROR_PAGE, "/"]

// 在 definePage 里面配置了 excludeLoginPath 的页面，功能与 EXCLUDE_LOGIN_PATH_LIST 相同
export const excludeLoginPathList = getAllPages("excludeLoginPath").map(page => page.path)

// 排除在外的列表，白名单策略指白名单列表
// 在 definePage 配置 excludeLoginPath，或者在下面配置 EXCLUDE_LOGIN_PATH_LIST
export const EXCLUDE_LOGIN_PATH_LIST = [
  ...excludeLoginPathList, // 都是以 / 开头的 path
  ...LOGIN_PAGE_LIST
]

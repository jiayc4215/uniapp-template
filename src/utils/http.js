import { WxRequest } from "@/utils/request"
import { toLoginPage } from "@/utils/toLoginPage"
import { useTokenStore } from "@/store/token"
import { getBaseUrl } from "@/utils/env"

// 是否显示重新登录
const isRelogin = {
  show: false
}

// ----------------- 实例化 ----------------------
// 对 WxRequest 进行实例化
const instance = new WxRequest({
  baseURL: getBaseUrl(),
  timeout: 60000
})

// 配置请求拦截器
instance.interceptors.request = config => {
  const tokenStore = useTokenStore()
  let token = tokenStore.validToken
  if (token) {
    config.header.Authorization = `Bearer ${token}`
  }
  return config
}

// 响应拦截器
instance.interceptors.response = async response => {
  const { isSuccess, data, statusCode, config } = response

  // isSuccess: false 表示是网络超时或其他问题，提示 网络异常，同时将返回即可
  if (!isSuccess && !config.isMessage) {
    handleAuthorized("网络异常，请稍后重试~")
    return response
  }
  if (data instanceof ArrayBuffer) {
    return data
  }
  // 成功
  if (statusCode === 200 && data.code == 200) {
    return data?.data || {}
  }
  // 401 未登录
  if (statusCode === 200 && data.code == 401) {
    handleAuthorized(data?.message || "请重新登录", true)
    return Promise.reject(response?.data || response)
  }
  // 其他错误
  if (config.isMessage) {
    handleAuthorized(data?.message || "未知错误")
  }

  return Promise.reject(response?.data || response)
}

/**
 * // 控制多个接口触发，弹框只出现一次
 * @param {提示信息} title
 * @param {是否重新登录} isGologin
 */
async function handleAuthorized(title, isGologin = false) {
  const tokenStore = useTokenStore()
  if (isRelogin.show) {
    return
  }

  isRelogin.show = true
  await uni.modal({
    showCancel: false,
    title: "提示",
    content: title
  })

  if (isGologin) {
    // 清除用户信息
    tokenStore.logoutClear()
    // 切换到登录页
    toLoginPage({ mode: "reLaunch" })
  }

  // 重置弹框状态
  setTimeout(() => {
    isRelogin.show = false
  }, 1000)
}

// 将 WxRequest 的实例通过模块化的方式暴露出去
export default instance

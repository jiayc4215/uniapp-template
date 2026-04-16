const PROXY_PREFIX = import.meta.env.VITE_APP_PROXY_PREFIX
const isMock = import.meta.env.VITE_APP_MOCK
const NODE_ENV = import.meta.env.MODE
import { isMp } from "@uni-helper/uni-env"

// 获取小程序账号信息
export function getEnvBaseUrl() {
  const accountInfo = uni.getAccountInfoSync()

  // 基础配置
  const commonConfig = {
    BASE_URL: "https://xxx.xxx.com"
  }
  const testConfig = {
    BASE_URL: "https://xxx.xxx.com"
  }

  // 本地开发配置
  const localConfig = {
    BASE_URL: "https://xxx.xxx.com"
  }

  // 环境配置
  const baseApi = {
    // 开发环境
    develop: {
      ...localConfig
    },
    // 测试环境
    trial: {
      ...testConfig
    },
    // 正式环境
    release: {
      ...commonConfig
    }
  }

  // 获取当前环境的配置
  const getEnvConfig = () => {
    try {
      const envVersion = accountInfo.miniProgram.envVersion || "release"
      return baseApi[envVersion] || baseApi.release
    } catch {
      // 降级使用正式环境配置
      return baseApi.release
    }
  }

  const config = getEnvConfig()

  return config
}
export const getBaseUrl = () => {
  // 生产环境不开启mock
  if (isMock === "true" && NODE_ENV === "development") {
    return "/mock"
  }

  // 对于非小程序端 (网页)
  if (!isMp) {
    // 如果是在本地运行（Vite serve) 且配置了代理但是前缀为空
    // 我们必须提供一个默认的前缀，保持与 vite proxy 一致，不然会导致全部静态资源被代理走
    if (import.meta.env.DEV && !PROXY_PREFIX) {
      return "/api"
    }
    return PROXY_PREFIX
  }

  return getEnvBaseUrl().BASE_URL
}
console.log("http ==>", getBaseUrl(), NODE_ENV)

import { defineStore } from "pinia"
import { computed, ref } from "vue"
import { login as _login, logout as _logout } from "@/api/login"
import { useUserStore } from "./user"

// 单 token 初始化状态
const tokenInfoState = {
  token: ""
}

export const useTokenStore = defineStore(
  "token",
  () => {
    const tokenInfo = ref({ ...tokenInfoState })

    const setTokenInfo = val => {
      tokenInfo.value = val
    }

    async function _postLogin(tokenInfoVal) {
      setTokenInfo(tokenInfoVal)
      const userStore = useUserStore()
      try {
        await userStore.fetchUserInfo()
      } catch (err) {
        return Promise.reject(err)
      }
    }

    const login = async loginForm => {
      try {
        const res = await _login(loginForm)
        await _postLogin(res)
        return res
      } catch (err) {
        return Promise.reject(err)
      }
    }
    const logout = async () => {
      try {
        await _logout()
      } catch (error) {
        return Promise.reject(error)
      } finally {
        tokenInfo.value = { ...tokenInfoState }
        uni.removeStorageSync("token")

        const userStore = useUserStore()
        userStore.clearUserInfo()
      }
    }
    /**
     * 获取有效的token
     */
    const getValidToken = computed(() => {
      return "token" in tokenInfo.value ? tokenInfo.value.token : ""
    })

    /**
     * 检查是否有登录信息
     */
    const hasLoginInfo = computed(() => {
      return "token" in tokenInfo.value && !!tokenInfo.value.token
    })

    return {
      login,
      logout,
      hasLogin: hasLoginInfo,
      validToken: getValidToken,
      tokenInfo,
      setTokenInfo
    }
  },
  {
    persist: true
  }
)

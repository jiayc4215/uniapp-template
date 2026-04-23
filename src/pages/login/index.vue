<template>
  <view
    class="box-border flex flex-col items-center bg-(--wot-filled-bottom) px-[32rpx] pt-[64rpx] text-(--wot-text-main)"
  >
    <view class="mb-[64rpx] flex flex-col items-center">
      <image
        src="/static/logo.png"
        class="mb-[32rpx] h-[180rpx] w-[180rpx] rounded-[32rpx] bg-(--wot-filled-content)"
      />
      <view class="text-[40rpx] font-bold tracking-wider">uniapp</view>
      <view class="mt-[16rpx] text-[24rpx] text-(--wot-text-auxiliary)">vite+vue3+js模版</view>
    </view>

    <view class="relative mb-[64rpx] flex w-full overflow-hidden rounded-[24rpx] bg-(--wot-filled-content) p-[8rpx]">
      <view
        class="bg-primary absolute top-[8rpx] left-[8rpx] h-[calc(100%-16rpx)] w-[calc(50%-8rpx)] rounded-[20rpx] transition-transform duration-300"
        :style="{ transform: isUser ? 'translateX(100%)' : 'translateX(0)' }"
      />
      <view
        class="relative z-10 flex-1 py-[24rpx] text-center transition-colors"
        :class="!isUser ? 'text-(--wot-text-white)' : 'text-(--wot-text-auxiliary)'"
        @click="switchRole('admin')"
      >
        admin
      </view>
      <view
        class="relative z-10 flex-1 py-[24rpx] text-center transition-colors"
        :class="isUser ? 'text-(--wot-text-white)' : 'text-(--wot-text-auxiliary)'"
        @click="switchRole('user')"
      >
        user
      </view>
    </view>

    <view class="mb-[64rpx] w-full rounded-[48rpx] bg-(--wot-filled-oppo) p-[48rpx] shadow-sm">
      <view class="mb-[48rpx] text-center text-[32rpx] font-bold">账号密码登录</view>

      <wd-form ref="formRef" :model="form">
        <view
          class="mb-[32rpx] overflow-hidden rounded-[24rpx] border border-(--wot-border-main) bg-(--wot-filled-bottom)"
        >
          <wd-input
            v-model="form.username"
            prop="username"
            :rules="rules.username"
            placeholder="请输入账号"
            no-border
            clearable
            custom-style="background:transparent;"
          />
        </view>

        <view
          class="mb-[32rpx] overflow-hidden rounded-[24rpx] border border-(--wot-border-main) bg-(--wot-filled-bottom)"
        >
          <wd-input
            v-model="form.password"
            prop="password"
            :rules="rules.password"
            type="password"
            placeholder="请输入密码"
            no-border
            show-password
            clearable
            custom-style="background:transparent;"
          />
        </view>
      </wd-form>

      <wd-button block @click="doLogin" size="large" shape="circle"> 登 录 </wd-button>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed } from "vue"
import { useTokenStore } from "@/store/token"
const tokenStore = useTokenStore()

definePage({
  style: {
    navigationBarTitleText: "登录"
  },
  type: "home"
})

const currentRole = ref("admin")

const formRef = ref(null)

const form = reactive({
  username: "",
  password: ""
})

const isUser = computed(() => currentRole.value === "user")

/* 校验规则 */
const rules = {
  username: [{ required: true, message: "请输入账号" }],
  password: [{ required: true, message: "请输入密码" }]
}

function switchRole(role) {
  currentRole.value = role
}

/* 登录提交 */
async function doLogin() {
  try {
    const { valid } = await formRef.value.validate()
    if (!valid) return
    uni.showLoading({ title: "登录中..." })

    await tokenStore.login({ ...form, role: currentRole.value })
    const url = "/pages/index/index"

    uni.reLaunch({
      url,
      complete() {
        uni.hideLoading()
      }
    })
  } catch (error) {
    console.error(error)
    uni.hideLoading()
  }
}
</script>

<style scoped>
/* 如果需要深度修改 wot-ui 样式，可以在此处理 */
:deep(.wd-input) {
  padding: 24rpx 32rpx !important;
}
</style>

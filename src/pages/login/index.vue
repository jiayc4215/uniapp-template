<template>
  <view class="flex min-h-screen flex-col items-center bg-gray-50 transition-colors duration-300 dark:bg-gray-900">
    <!-- Header Section -->
    <view class="animate-fade-in mt-16 mb-12 flex flex-col items-center">
      <view
        class="bg-primary/10 border-primary/20 from-primary/20 to-primary/5 mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border backdrop-blur-sm"
      >
        <image class="h-12 w-12" src="/static/logo.png" mode="aspectFit"></image>
      </view>
      <text class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Wot Starter</text>
      <text class="mt-2 text-sm text-gray-500 dark:text-gray-400">Empower your coding efficiency</text>
    </view>

    <!-- Form Section -->
    <view class="animate-slide-up w-full max-w-md flex-1 px-6">
      <wd-form ref="form" :model="loginForm" class="space-y-6">
        <!-- Account Input -->
        <view class="group relative">
          <wd-input
            v-model="loginForm.username"
            label-width="0"
            no-border
            placeholder="Username / Email"
            prefix-icon="user"
            class="custom-input focus-within:border-primary focus-within:ring-primary/20 h-14 rounded-xl border border-gray-200 bg-white px-4 transition-all focus-within:ring-2 dark:border-gray-700 dark:bg-gray-800"
          />
        </view>

        <!-- Password Input -->
        <view class="group relative">
          <wd-input
            v-model="loginForm.password"
            label-width="0"
            no-border
            type="password"
            placeholder="Password"
            prefix-icon="lock"
            show-password
            class="custom-input focus-within:border-primary focus-within:ring-primary/20 h-14 rounded-xl border border-gray-200 bg-white px-4 transition-all focus-within:ring-2 dark:border-gray-700 dark:bg-gray-800"
          />
        </view>

        <!-- Options Section -->
        <view class="flex items-center justify-between py-2 text-sm">
          <wd-checkbox v-model="loginForm.remember" class="custom-checkbox"> Remember Me </wd-checkbox>
          <text class="text-primary hover:text-primary-dark font-medium transition-colors">Forgot Password?</text>
        </view>

        <!-- Agreement Section -->
        <view class="flex items-start gap-2 pt-4">
          <wd-checkbox v-model="loginForm.agreement" shape="square" class="mt-0.5">
            <view class="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
              I have read and agree to the
              <text class="text-primary font-semibold">User Agreement</text> and
              <text class="text-primary font-semibold">Privacy Policy</text>.
            </view>
          </wd-checkbox>
        </view>

        <!-- Login Button -->
        <view class="pt-6">
          <wd-button
            block
            size="large"
            type="primary"
            class="shadow-primary/30 h-14 rounded-xl shadow-lg transition-transform active:scale-[0.98]"
            @click="handleLogin"
            :loading="loading"
          >
            Sign In
          </wd-button>
        </view>
      </wd-form>

      <!-- Footer Action -->
      <view class="mt-8 text-center">
        <text class="text-sm text-gray-500 dark:text-gray-400">Don't have an account? </text>
        <text class="text-primary pointer-events-auto ml-1 text-sm font-bold underline-offset-4 hover:underline"
          >Create Account</text
        >
      </view>

      <!-- Social Login -->
      <view class="relative mt-16">
        <wd-divider>Or continue with</wd-divider>
        <view class="mt-8 flex justify-center gap-8">
          <view
            v-for="social in socialLogins"
            :key="social.icon"
            class="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition-colors duration-200 hover:bg-gray-50 active:scale-90 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <view :class="social.icon + ' text-2xl text-gray-600 dark:text-gray-300'"></view>
          </view>
        </view>
      </view>
    </view>

    <!-- Toast for Notifications -->
    <wd-toast />
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue"
import { useToast } from "wot-design-uni"

definePage({
  style: {
    navigationBarTitleText: "Sign In",
    navigationBarBackgroundColor: "#f9fafb",
    navigationBarTextStyle: "black",
    navigationStyle: "custom" // Custom navbar for cleaner look
  }
})

const toast = useToast()
const loading = ref(false)

const loginForm = reactive({
  username: "",
  password: "",
  remember: true,
  agreement: false
})

const socialLogins = [
  { icon: "i-mdi-wechat", name: "Wechat" },
  { icon: "i-mdi-github", name: "Github" },
  { icon: "i-mdi-google", name: "Google" }
]

const handleLogin = async () => {
  if (!loginForm.agreement) {
    toast.warning("Please agree to the terms first")
    return
  }

  if (!loginForm.username || !loginForm.password) {
    toast.error("Please enter username and password")
    return
  }

  loading.value = true

  // Simulate API call
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    toast.success("Login Successful!")
    // Redirect logic would go here
  } catch {
    toast.error("Login Failed")
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss">
:deep(.wd-input) {
  --wd-input-bg: transparent;
  --wd-input-padding: 0;
}

:deep(.wd-checkbox) {
  --wd-checkbox-checked-color: var(--wot-color-theme, #3c82fe);
}

.animate-fade-in {
  animation: fadeIn 0.8s ease-out;
}

.animate-slide-up {
  animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

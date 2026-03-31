<template>
  <view class="min-h-screen flex flex-col items-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <!-- Header Section -->
    <view class="mt-16 mb-12 flex flex-col items-center animate-fade-in">
      <view class="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm border border-primary/20 bg-gradient-to-br from-primary/20 to-primary/5">
        <image class="w-12 h-12" src="/static/logo.png" mode="aspectFit"></image>
      </view>
      <text class="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Wot Starter</text>
      <text class="mt-2 text-gray-500 dark:text-gray-400 text-sm">Empower your coding efficiency</text>
    </view>

    <!-- Form Section -->
    <view class="w-full px-6 flex-1 max-w-md animate-slide-up">
      <wd-form ref="form" :model="loginForm" class="space-y-6">
        <!-- Account Input -->
        <view class="relative group">
          <wd-input
            v-model="loginForm.username"
            label-width="0"
            no-border
            placeholder="Username / Email"
            prefix-icon="user"
            class="custom-input h-14 bg-white dark:bg-gray-800 rounded-xl px-4 border border-gray-200 dark:border-gray-700 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all"
          />
        </view>

        <!-- Password Input -->
        <view class="relative group">
          <wd-input
            v-model="loginForm.password"
            label-width="0"
            no-border
            type="password"
            placeholder="Password"
            prefix-icon="lock"
            show-password
            class="custom-input h-14 bg-white dark:bg-gray-800 rounded-xl px-4 border border-gray-200 dark:border-gray-700 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all"
          />
        </view>

        <!-- Options Section -->
        <view class="flex items-center justify-between text-sm py-2">
          <wd-checkbox v-model="loginForm.remember" class="custom-checkbox">
            Remember Me
          </wd-checkbox>
          <text class="text-primary hover:text-primary-dark font-medium transition-colors">Forgot Password?</text>
        </view>

        <!-- Agreement Section -->
        <view class="flex items-start gap-2 pt-4">
          <wd-checkbox v-model="loginForm.agreement" shape="square" class="mt-0.5">
            <view class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
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
            class="h-14 rounded-xl shadow-lg shadow-primary/30 active:scale-[0.98] transition-transform"
            @click="handleLogin"
            :loading="loading"
          >
            Sign In
          </wd-button>
        </view>
      </wd-form>

      <!-- Footer Action -->
      <view class="mt-8 text-center">
        <text class="text-gray-500 dark:text-gray-400 text-sm">Don't have an account? </text>
        <text class="text-primary font-bold text-sm ml-1 hover:underline underline-offset-4 pointer-events-auto">Create Account</text>
      </view>

      <!-- Social Login -->
      <view class="mt-16 relative">
        <wd-divider>Or continue with</wd-divider>
        <view class="flex justify-center gap-8 mt-8">
          <view v-for="social in socialLogins" :key="social.icon" 
            class="w-12 h-12 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm active:scale-90 duration-200">
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
import { ref, reactive } from 'vue'
import { useToast } from 'wot-design-uni'

definePage({
  style: {
    navigationBarTitleText: 'Sign In',
    navigationBarBackgroundColor: '#f9fafb',
    navigationBarTextStyle: 'black',
    navigationStyle: 'custom' // Custom navbar for cleaner look
  }
})

const toast = useToast()
const loading = ref(false)

const loginForm = reactive({
  username: '',
  password: '',
  remember: true,
  agreement: false
})

const socialLogins = [
  { icon: 'i-mdi-wechat', name: 'Wechat' },
  { icon: 'i-mdi-github', name: 'Github' },
  { icon: 'i-mdi-google', name: 'Google' }
]

const handleLogin = async () => {
  if (!loginForm.agreement) {
    toast.warning('Please agree to the terms first')
    return
  }

  if (!loginForm.username || !loginForm.password) {
    toast.error('Please enter username and password')
    return
  }

  loading.value = true
  
  // Simulate API call
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    toast.success('Login Successful!')
    // Redirect logic would go here
  } catch (error) {
    toast.error('Login Failed')
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
  from { opacity: 0; }
  to { opacity: 1; }
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

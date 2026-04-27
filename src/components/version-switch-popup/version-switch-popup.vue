<template>
  <wd-popup
    v-model="visible"
    position="bottom"
    round
    root-portal
    :z-index="99999"
    custom-class="wot-font-scale-vars"
    :custom-style="'padding-bottom: max(24rpx, env(safe-area-inset-bottom));'"
  >
    <wd-config-provider :theme="theme" :theme-vars="themeVars" custom-class="wot-font-scale-vars">
      <view class="bg-fill-oppo px-[24rpx] pt-[32rpx] text-text-main">
        <view class="mb-6 text-center font-bold">{{ title }}</view>

        <view class="mb-6 flex flex-col gap-3">
          <view
            v-for="item in options"
            :key="item.value"
            class="flex items-center justify-between rounded-2xl border bg-fill-oppo px-4 py-4"
            :class="
              selectedValue === item.value
                ? 'border-primary bg-primary text-text-main shadow-sm'
                : 'border-line-main text-text-main'
            "
            @click="handleSelect(item.value)"
          >
            <view class="flex min-w-0 flex-1 items-center">
              <view
                class="mr-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-semibold"
                :class="item.value > 16 ? 'bg-warning-soft text-warning' : 'bg-primary-soft text-primary'"
              >
                <text>{{ item.iconText }}</text>
              </view>
              <view class="min-w-0">
                <view class="font-medium">{{ item.label }}</view>
                <view class="mt-1 text-sm text-text-auxiliary">{{ item.description }}</view>
              </view>
            </view>

            <view class="ml-3">
              <view
                class="flex h-[34rpx] w-[34rpx] items-center justify-center rounded-full border"
                :class="selectedValue === item.value ? 'border-primary bg-primary' : 'border-line-main'"
              >
                <wd-icon v-if="selectedValue === item.value" name="check" size="20rpx" color="var(--wot-text-white)" />
              </view>
            </view>
          </view>
        </view>

        <wd-button block size="large" round custom-class="!bg-primary !border-none" @click="handleConfirm">
          {{ confirmText }}
        </wd-button>
      </view>
    </wd-config-provider>
  </wd-popup>
</template>

<script setup>
import { useManualThemeStore } from "@/store/manualThemeStore"
import { useFont } from "@/composables/useFont"

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  value: { type: Number, default: 16 },
  title: { type: String, default: "大字模式" },
  confirmText: { type: String, default: "确认切换" },
  options: {
    type: Array,
    default: () => [
      { label: "标准", description: "常规字体大小，适合日常使用", value: 16, iconText: "A" },
      { label: "舒适", description: "稍大字体，阅读更轻松", value: 18, iconText: "A+" },
      { label: "关怀", description: "大字体高对比，视觉更清晰", value: 20, iconText: "Aa" }
    ]
  }
})

const emit = defineEmits(["update:modelValue", "confirm"])
const themeStore = useManualThemeStore()
const { previewFontSize, revertPreview } = useFont()

const visible = computed({
  get: () => props.modelValue,
  set: val => emit("update:modelValue", val)
})

const theme = computed(() => themeStore.theme)
const themeVars = computed(() => themeStore.themeVars)

const selectedValue = ref(props.value)
const originalSize = ref(props.value)

watch(
  () => props.value,
  val => {
    selectedValue.value = val
  }
)

watch(
  () => props.modelValue,
  val => {
    if (val) {
      selectedValue.value = props.value
      originalSize.value = props.value
    } else {
      revertPreview(originalSize.value)
    }
  }
)

function handleSelect(value) {
  selectedValue.value = value
  previewFontSize(value)
}

const handleConfirm = () => {
  originalSize.value = selectedValue.value
  emit("confirm", selectedValue.value)
  visible.value = false
}
</script>

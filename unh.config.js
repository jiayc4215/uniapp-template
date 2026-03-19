import { defineConfig } from "@uni-helper/unh";

export default defineConfig({
  // 平台配置
  platform: {
    // 默认平台，当不指定平台时使用此平台
    default: "h5",
    // 平台别名，可以使用短名称代替完整平台名称
    alias: {
      h5: ["w", "h"],
      "mp-weixin": ["wx"],
    },
  },
  // 调试工具配置 自动打开
  devtools: {
    open: true,
  },
  // 自动生成配置
  autoGenerate: {
    pages: true,
    manifest: true,
  },
});

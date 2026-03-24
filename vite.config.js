import { defineConfig } from "vite";
import process from "node:process";

const isH5 = process.env.UNI_PLATFORM === "h5";
const isApp = process.env.UNI_PLATFORM === "app";
const WeappTailwindcssDisabled = isH5 || isApp;
import Uni from "@uni-helper/plugin-uni";
import { UnifiedViteWeappTailwindcssPlugin } from "weapp-tailwindcss/vite";
import tailwindcss from "@tailwindcss/postcss";
import UniPages from "@uni-helper/vite-plugin-uni-pages";
import UniManifest from "@uni-helper/vite-plugin-uni-manifest";
import UniKuRoot from "@uni-ku/root";
import Components from "@uni-helper/vite-plugin-uni-components";
import AutoImport from "unplugin-auto-import/vite";
import path from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  envDir: "./env", // 自定义env目录
  plugins: [
    UniPages({
      exclude: ["**/components/**/**.*"],
      // pages 目录为 src/pages，分包目录不能配置在pages目录下！！
      // 是个数组，可以配置多个，但是不能为pages里面的目录！！
      subPackages: [],
      dts: "src/types/pages.d.ts",
    }),
    UniKuRoot({
      // 排除组件目录下的页面
      excludePages: ["**/components/**/**.*"],
    }),
    UniManifest(),
    // 改成 mts，则爆 uni is not a function
    Components({
      // 扫描组件目录
      dirs: ["src/components"],
      // 扫描子目录
      deep: true,
      // 组件类型声明文件
      dts: "src/types/components.d.ts",
      // 组件名是否包含目录名
      directoryAsNamespace: false,
    }), // 必须在 Uni() 之前
    Uni(),
    AutoImport({
      // 自动导入的模块
      imports: ["vue", "uni-app"],
      dts: "src/types/auto-imports.d.ts",
      vueTemplate: true, //解析模板中的自动导入、
      // eslint配置
      eslintrc: {
        enabled: true,
        // 自动导入的变量
        filepath: "src/types/eslintrc-auto-import.json",
      },
    }),
    UnifiedViteWeappTailwindcssPlugin({
      rem2rpx: true,
      disabled: WeappTailwindcssDisabled,
      cssEntries: [path.resolve(__dirname, "src/main.css")],
    }),
  ],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
});

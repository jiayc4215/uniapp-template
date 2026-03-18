import { defineConfig } from "vite";
import process from "node:process";

const isH5 = process.env.UNI_PLATFORM === "h5";
const isApp = process.env.UNI_PLATFORM === "app";
const WeappTailwindcssDisabled = isH5 || isApp;
import Uni from "@uni-helper/plugin-uni";
import { UnifiedViteWeappTailwindcssPlugin } from "weapp-tailwindcss/vite";
import tailwindcss from "@tailwindcss/postcss";
import UniPages from "@uni-helper/vite-plugin-uni-pages";
import path from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    UniPages(),
    // 改成 mts，则爆 uni is not a function
    Uni(),
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

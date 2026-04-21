import { defineConfig, loadEnv } from "vite"
import process from "node:process"
import { UniEcharts } from "uni-echarts/vite"
import { UniEchartsResolver } from "uni-echarts/resolver"
const isH5 = process.env.UNI_PLATFORM === "h5"
const isApp = process.env.UNI_PLATFORM === "app"
const WeappTailwindcssDisabled = isH5 || isApp
import Uni from "@uni-helper/plugin-uni"
import { UnifiedViteWeappTailwindcssPlugin } from "weapp-tailwindcss/vite"
import tailwindcss from "@tailwindcss/postcss"
import UniPages from "@uni-helper/vite-plugin-uni-pages"
import UniManifest from "@uni-helper/vite-plugin-uni-manifest"
import UniKuRoot from "@uni-ku/root"
import Components from "@uni-helper/vite-plugin-uni-components"
import AutoImport from "unplugin-auto-import/vite"
import path from "node:path"
import ViteRestart from "vite-plugin-restart"
import dayjs from "dayjs"
import eruda from "./scripts/vite-plugin-eruda"
import Optimization from "@uni-ku/bundle-optimizer"
import { isMpWeixin } from "@uni-helper/uni-env"
import basicSsl from "@vitejs/plugin-basic-ssl"
import postcssLogical from "postcss-logical"
import postcssOKLabFunction from "@csstools/postcss-oklab-function"
import postcssRemToResponsivePixel from "postcss-rem-to-responsive-pixel"
import pxtoremPlugin from "./scripts/pxtorem-plugin"
import PageRootInsertElement from "./scripts/page-root-insert-element"
// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, path.resolve(process.cwd(), "env"))
  const {
    VITE_APP_PUBLIC_BASE,
    VITE_APP_TITLE,
    VITE_APP_PORT,
    VITE_APP_PROXY_ENABLE,
    VITE_APP_PROXY_PREFIX,
    VITE_DELETE_CONSOLE,
    VITE_SERVER_BASEURL,
    VITE_SHOW_SOURCEMAP
  } = env
  const { UNI_PLATFORM } = process.env
  // 开发环境下如果没配置代理前缀，我们要默认一个，否则空字符串会拦截所有本地页面并代理到后端导致所有页面超时！
  let proxyPrefix = VITE_APP_PROXY_PREFIX
  if (command === "serve" && !proxyPrefix) {
    proxyPrefix = "/api"
  }

  console.log("command, mode -> ", command, mode)
  return defineConfig({
    envDir: "./env", // 自定义env目录
    base: VITE_APP_PUBLIC_BASE,
    plugins: [
      basicSsl(),
      UniEcharts(),
      UniPages({
        exclude: ["**/components/**/**.*"],
        // pages 目录为 src/pages，分包目录不能配置在pages目录下！！
        // 是个数组，可以配置多个，但是不能为pages里面的目录！！
        subPackages: ["src/echarts-modules", "src/public-modules"],
        dts: "src/types/pages.d.ts"
      }),
      UniKuRoot({
        // 排除组件目录下的页面
        excludePages: ["**/components/**/**.*"]
      }),
      UniManifest(),
      // 改成 mts，则爆 uni is not a function
      Components({
        resolvers: [UniEchartsResolver()],
        // 扫描组件目录
        dirs: ["src/components", "src/public-modules/components", "src/echarts-modules/components"],
        // 扫描子目录
        deep: true,
        // 组件类型声明文件
        dts: "src/types/components.d.ts",
        // 组件名是否包含目录名
        directoryAsNamespace: false
      }), // 必须在 Uni() 之前
      Uni({
        viteLegacyOptions: {
          targets: ["defaults", "android >= 6", "ios >= 10"]
        }
      }),
      // 处理 twindcss text-[22rpx]
      pxtoremPlugin({
        rootValue: 32, // 16px=32rpx默认根节点字体大小
        unit: "rpx"
      }),
      // 转换px为rem 处理wot-ui的px
      pxtoremPlugin({
        rootValue: 16,
        unit: "px"
      }),

      // 此处不适应默认转换，需要自定义配置
      // 1.要忽略font
      // 2.要注意执行顺序，应该在rem转换之前
      UnifiedViteWeappTailwindcssPlugin({
        // rem2rpx: true,
        // disabled: WeappTailwindcssDisabled,
        cssEntries: [
          // tailwindcss@4 必须配置 cssEntries 并且使用绝对路径，否则 tailwindcss 生成的类名不会参与转译。
          path.resolve(__dirname, "src/main.css")
        ]
      }),

      // 插入page-meta
      PageRootInsertElement(`\n  <page-meta :root-font-size="$getRootFontSize()"></page-meta>`),

      Optimization({
        enable: isMpWeixin,
        logger: false
      }),
      ViteRestart({
        // 通过这个插件，在修改vite.config.js文件则不需要重新运行也生效配置
        restart: ["vite.config.js"]
      }),
      AutoImport({
        // 自动导入的模块
        imports: ["vue", "uni-app"],
        dts: "src/types/auto-imports.d.ts",
        vueTemplate: true, //解析模板中的自动导入、
        // eslint配置
        eslintrc: {
          enabled: true,
          // 自动导入的变量
          filepath: "src/types/eslintrc-auto-import.json"
        }
      }),
      UNI_PLATFORM === "h5" && {
        name: "html-transform",
        transformIndexHtml(html) {
          return html
            .replace("%BUILD_TIME%", dayjs().format("YYYY-MM-DD HH:mm:ss"))
            .replace("%VITE_APP_TITLE%", VITE_APP_TITLE)
        }
      },
      eruda({
        open: UNI_PLATFORM === "h5" && mode !== "production"
      })
    ],
    css: {
      postcss: {
        plugins: [
          tailwindcss(),
          postcssLogical(),
          postcssOKLabFunction(),
          postcssRemToResponsivePixel({
            // 32 意味着 1rem = 32rpx
            rootValue: 32,
            // 这里使用的是白名单匹配，不支持 postcss-pxtorem 的 ! 排除语法 不处理font
            propList: ["*", "!font", "!font-size", "!line-height", "!letter-spacing"],
            // 转化的单位,可以变成 px / rpx
            transformUnit: "rpx",
            disabled: WeappTailwindcssDisabled
          })
        ]
      }
    },
    server: {
      https: true,
      host: "0.0.0.0",
      hmr: true,
      port: Number.parseInt(VITE_APP_PORT, 10),
      // 仅 H5 端生效，其他端不生效（其他端走build，不走devServer)
      proxy: JSON.parse(VITE_APP_PROXY_ENABLE)
        ? {
            [proxyPrefix]: {
              target: VITE_SERVER_BASEURL,
              changeOrigin: true,
              secure: false, // 解决代理到 https 导致的超时问题
              // 后端有/api前缀则不做处理，没有则需要去掉
              rewrite: path => path.replace(new RegExp(`^${proxyPrefix}`), "")
            }
          }
        : undefined
    },
    resolve: {
      alias: {
        "@": path.join(process.cwd(), "./src"),
        "@img": path.join(process.cwd(), "./src/static/images")
      }
    },
    esbuild: {
      drop: VITE_DELETE_CONSOLE === "true" ? ["console", "debugger"] : []
    },
    build: {
      // 方便非h5端调试
      sourcemap: VITE_SHOW_SOURCEMAP === "true", // 默认是false
      ...(isH5 ? {} : { target: "es6" }),
      // 开发环境不用压缩
      minify: mode === "development" ? false : "esbuild"
    }
  })
})

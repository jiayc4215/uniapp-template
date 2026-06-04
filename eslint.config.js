import js from "@eslint/js" //js规范（标准的）
import globals from "globals" //环境
import pluginVue from "eslint-plugin-vue" //vue规范
import { defineConfig } from "eslint/config" //配置
import eslintConfigPrettier from "eslint-config-prettier" // prettier
import { FlatCompat } from "@eslint/eslintrc"
import fs from "node:fs"

const ignores = ["**/dist/**", "**/node_modules/**", ".*"]
const compat = new FlatCompat()

// 安全检查预防断层文件不存在
const autoImportPath = "./src/types/eslintrc-auto-import.json"
const autoImportConfig = fs.existsSync(autoImportPath) ? compat.extends(autoImportPath) : []

export default defineConfig([
  // 1. 全局忽略
  {
    ignores
  },
  // 2. 继承各个插件的推荐配置 (它们是独立的配置对象)
  pluginVue.configs["flat/essential"], //vue规范
  // 自动导入的配置 兼容AutoImport
  ...autoImportConfig,
  // 3. 自定义全局设置
  {
    files: ["**/*.{js,mjs,cjs,vue}"], //匹配文件
    plugins: { js },
    extends: ["js/recommended"], //js规范

    //全局变量 window
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        uni: true,
        definePage: true,
        getCurrentPages: true,
        wx: true
      }
    },
    ...eslintConfigPrettier,
    rules: {
      "vue/multi-word-component-names": "off"
    }
  }
])

import { parse } from "@vue/compiler-dom"

export default function pageRootinsertElementPlugin(content = "") {
  return {
    name: "vite-pageRootInsertElement-plugin",
    enforce: "pre",

    transform(code, id) {
      // 排除node_modules
      if (id.includes("node_modules")) return

      // 排除不是pages目录下的文件
      const pathRegex = /(pages|[\w-]+-modules)\//
      if (!pathRegex.test(id)) return

      // 排除components目录下的文件
      if (id.includes("components/")) return

      // 排除不是.vue结尾的文件
      if (!id.endsWith(".vue")) return

      console.log("id", id)

      try {
        // 解析文.vue文件内容为虚拟节点: code为.vue文件内容
        const parsed = parse(code, {
          comments: true,
          onError: err => {
            console.log("解析错误id", id)
            console.warn("code解析错误:", err.message)
          }
        })
        // 查找template虚拟节点，即虚拟dom
        const templateNode = parsed.children.find(node => node.tag === "template")
        if (!templateNode) return

        // 获取template内容，即<template>...省略中间内容</template>模板字符串
        const templateContent = code.slice(templateNode.loc.start.offset, templateNode.loc.end.offset)

        /** 对template标签下的内容进行头尾拆分，方便在头部插入page-meta标签 */

        // 1.获取第一个template标签的>位置索引
        const insertPosition = templateContent.indexOf(">") + 1

        // 2.获取template标签的头部：<template>
        const beforeInsert = templateContent.slice(0, insertPosition)

        // 3.获取template标签的尾部
        const afterInsert = templateContent.slice(insertPosition)

        // 4.头部插入page-meta，拼接成新的template内容
        const newTemplateContent = beforeInsert + content + afterInsert

        // 替换原template内容
        const newCode = code.replace(templateContent, newTemplateContent)

        return newCode
      } catch (e) {
        console.warn("page-root-insert-element插件处理失败:", e.message)
        return code
      }
    }
  }
}

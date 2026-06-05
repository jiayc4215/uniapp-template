// src/locale/utils.ts
/**
 * 替换字符串中的占位符
 * @param template 模板字符串，如 "Hello {0}, welcome to {1}"
 * @param values 要替换的值数组
 * @returns 替换后的字符串
 */
export function interpolateTemplate(template, values) {
  return template.replace(/{(\d+)}/g, (_, index) => values[index] ?? "")
}

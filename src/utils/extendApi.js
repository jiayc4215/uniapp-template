/**
 * @description 封装消息提示组件
 * @param {*} title 提示的内容
 * @param {*} icon 图标
 * @param {*} duration 提示的延迟时间
 * @param {*} mask 是否显示透明蒙层，防止触摸穿透
 */
// 如果用户传入对象作为参数，在形参位置通过解构赋值的方式获取用户传入的参数，同时设置默认值
const toast = ({ title = "数据加载中", icon = "none", mask = true, duration = 3000 } = {}) => {
  uni.showToast({
    title,
    icon,
    mask,
    duration
  })
}
/**
 * @description 封装 uni.showModal  方法
 * @param {*} options 同 uni.showModal 配置项
 */
export const modal = (options = {}) => {
  // 使用 Promise 处理 uni.showModal 的返回结果
  return new Promise(resolve => {
    // 默认的参数
    const defaultOpt = {
      title: "提示",
      content: "您确定执行该操作吗?",
      confirmColor: "#f3514f"
    }

    // 将传入的参数和默认的参数进行合并
    const opts = Object.assign({}, defaultOpt, options)

    uni.showModal({
      // 将合并的参数赋值传递给 showModal 方法
      ...opts,
      complete({ confirm, cancel }) {
        // 如果用户点击了确定，通过 resolve 抛出 true
        // 如果用户点击了取消，通过 resolve 抛出 false
        confirm && resolve(true)
        cancel && resolve(false)
      }
    })
  })
}
/**
 * URL解码工具函数（支持多次编码）
 * @param {string} str - 需要解码的字符串
 * @returns {string} 解码后的字符串
 */
export const safeDecodeURIComponent = str => {
  if (!str || typeof str !== "string") {
    return str
  }

  let decoded = str
  // 如果包含%符号，说明可能是URL编码的
  if (decoded.includes("%")) {
    try {
      decoded = decodeURIComponent(decoded)
      // 如果解码后仍然包含%，尝试再次解码
      if (decoded.includes("%")) {
        decoded = decodeURIComponent(decoded)
      }
    } catch (error) {
      console.warn("URL解码失败，使用原始值", error)
      decoded = str
    }
  }

  return decoded
}
/**
 * 解析URL参数
 * @param {string} url - 需要解析的URL
 * @returns {Object} 返回解析后的参数对象
 */
export const parseUrlParams = url => {
  const queryIndex = url.indexOf("?")
  if (queryIndex === -1) return {}

  const queryStr = url.slice(queryIndex + 1)
  const result = {}

  // 按 & 分割
  const parts = queryStr.split("&")

  parts.forEach((item, index) => {
    if (item.includes("=")) {
      const [key, value] = item.split("=")
      result[decodeURIComponent(key)] = decodeURIComponent(value || "")
    } else {
      // 没有 key=value 的情况
      result[`param${index}`] = decodeURIComponent(item)
    }
  })

  return result
}
// 格式化金额
export const formatAmount = val => {
  if (val === null || val === undefined) return ""

  let value = String(val)

  // 只保留数字和 .
  value = value.replace(/[^\d.]/g, "")

  // 只能有一个小数点
  const firstDotIndex = value.indexOf(".")
  if (firstDotIndex !== -1) {
    value = value.slice(0, firstDotIndex + 1) + value.slice(firstDotIndex + 1).replace(/\./g, "")
  }

  // 以 . 开头，补 0
  if (value.startsWith(".")) {
    value = "0" + value
  }

  // 去掉整数部分多余的前导 0
  if (value.includes(".")) {
    const [int, dec] = value.split(".")
    value = (int.replace(/^0+(?=\d)/, "") || "0") + "." + dec.slice(0, 2)
  } else {
    value = value.replace(/^0+(?=\d)/, "")
  }

  return value
}

// 模块化的方式使用

export default { toast, modal, safeDecodeURIComponent, parseUrlParams, formatAmount }

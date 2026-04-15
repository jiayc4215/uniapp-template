import { toValue, watch, reactive, ref } from "vue"

const cloneDeep = obj => {
  if (typeof obj !== "object" || obj === null) {
    return obj
  }
  return JSON.parse(JSON.stringify(obj))
}
/**
 * 监听源数据的变化，回调函数中可以获取到旧值和新值
 * @param {*} source  监听的源数据
 * @param {*} cb  回调函数
 * @param {*} options  监听选项
 * @returns
 */
export const watchOldValue = (source, cb, options) => {
  const { clone = cloneDeep } = options || {}
  let val = toValue(source)
  if (typeof val !== "object" || val === null) {
    return watch(source, cb, options)
  }
  let oldVal = clone(val)
  return watch(
    source,
    (newVal, _, onCleanup) => {
      cb(newVal, oldVal, onCleanup)
      oldVal = clone(newVal)
    },
    options
  )
}
/**
 * 响应式数据，支持重置数据 reactive
 * @param {*} data  原始数据
 * @param {*} clone  深拷贝函数
 * @returns [state,reset]
 */
export const useReactiveReset = (data, clone = cloneDeep) => {
  // 使用深拷贝确保 state 是原始数据的副本
  const state = reactive(clone(data))
  // 重置 state 数据为原始数据
  const reset = () => {
    // 删除现有的属性
    Object.keys(state).forEach(key => delete state[key])
    // 重新赋值为原始数据
    Object.assign(state, clone(data))
  }
  //  支持  【state,reset】  或者  {state,reset}
  return Object.assign([state, reset], { state, reset })
}
/**
 * 响应式数据，支持重置数据 ref
 * @param {*} data  原始数据
 * @param {*} clone  深拷贝函数
 * @returns [state,reset]
 */
export const useRefReset = (data, clone = cloneDeep) => {
  const initVal = clone(data)
  const state = ref(data)
  const reset = () => {
    state.value = clone(initVal)
  }
  return Object.assign([state, reset], { state, reset })
}

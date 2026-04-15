// fork from https://github.com/toss/es-toolkit/blob/main/src/function/debounce.ts
// 文档可查看：https://es-toolkit.dev/reference/function/debounce.html
// 如需要 throttle 功能，可 copy https://github.com/toss/es-toolkit/blob/main/src/function/throttle.ts

/**
 * Creates a debounced function that delays invoking the provided function until after `debounceMs` milliseconds
 * have elapsed since the last time the debounced function was invoked. The debounced function also has a `cancel`
 * method to cancel any pending execution.
 *
 * @param {Function} func - The function to debounce.
 * @param {number} debounceMs - The number of milliseconds to delay.
 * @param {object} options - The options object
 * @param {AbortSignal} options.signal - An optional AbortSignal to cancel the debounced function.
 * @param {Array<'leading'|'trailing'>} options.edges - Optional, call on leading/trailing/both edges
 * @returns {Function} A new debounced function with `cancel`, `flush`, and `schedule` methods.
 */
export function debounce(func, debounceMs, { signal, edges } = {}) {
  let pendingThis
  let pendingArgs = null

  const leading = edges != null && edges.includes("leading")
  const trailing = edges == null || edges.includes("trailing")

  const invoke = () => {
    if (pendingArgs !== null) {
      func.apply(pendingThis, pendingArgs)
      pendingThis = undefined
      pendingArgs = null
    }
  }

  const onTimerEnd = () => {
    if (trailing) {
      invoke()
    }
    cancel()
  }

  let timeoutId = null

  const schedule = () => {
    if (timeoutId != null) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      timeoutId = null
      onTimerEnd()
    }, debounceMs)
  }

  const cancelTimer = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  const cancel = () => {
    cancelTimer()
    pendingThis = undefined
    pendingArgs = null
  }

  const flush = () => {
    invoke()
  }

  const debounced = function (...args) {
    if (signal?.aborted) {
      return
    }

    pendingThis = this
    pendingArgs = args

    const isFirstCall = timeoutId == null

    schedule()

    if (leading && isFirstCall) {
      invoke()
    }
  }

  debounced.schedule = schedule
  debounced.cancel = cancel
  debounced.flush = flush

  signal?.addEventListener("abort", cancel, { once: true })

  return debounced
}

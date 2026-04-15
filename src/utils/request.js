// 创建 WxRequest 类，通过类的方式进行封装，会让代码更具有复用性，也可以方便添加新的属性和方法
export class WxRequest {
  // 默认参数对象
  defaults = {
    baseURL: "", // 请求基准地址
    url: "", // 开发者服务器接口地址
    data: null, // 请求参数
    method: "GET", // 默认请求方法
    // 请求头
    header: {
      "Content-type": "application/x-www-form-urlencoded" // 设置数据的交互格式
    },
    timeout: 60000, // 小程序默认超时时间是 60000，一分钟
    isLoading: true, // 是否显示 loading 提示框
    isMessage: true // 是否显示 message 提示框
  }

  // 定义拦截器对象，包含请求拦截器和响应拦截器方法，方便在请求或响应之前进行处理。
  interceptors = {
    // 请求拦截器
    request: config => config,
    // 响应拦截器
    response: response => response
  }

  // 定义数组队列，用来存储请求队列、存储请求标识
  queue = []

  /**
   * @description 定义 constructor 构造函数，用于创建和初始化类的属性和方法
   * @param {*} params 用户传入的请求配置项
   */
  constructor(params) {
    // 在实例化时传入的参数能够被 constructor 进行接收
    // 使用 Object.assign 合并默认参数以及传递的请求参数
    this.defaults = Object.assign({}, this.defaults, params)
  }

  /**
   * @description 发起请求的方法
   * @param {object} options 请求配置选项，同 uni.request 请求配置选项
   * @returns Promise
   */
  request(options) {
    // 如果有新的请求，就清除上一次的定时器
    this.timerId && clearTimeout(this.timerId)

    // 拼接完整的请求地址
    options.url = this.defaults.baseURL + options.url

    // 合并请求参数
    options = {
      ...this.defaults,
      ...options
    }
    // 控制 loading 的显示与隐藏
    if (options.isLoading && options.method !== "UPLOAD") {
      // 如果不是空就显示loading
      this.queue.length === 0 &&
        uni.showLoading({
          title: "加载中...",
          mask: true
        })

      // 然后立刻向队列中添加请求标识
      this.queue.push("request")
    }

    // 在发送请求之前调用请求拦截器
    options = this.interceptors.request(options)

    // 实例方法：需要使用 promise 封装 uni.request，处理异步请求
    return new Promise((resolve, reject) => {
      // 如果 method 等于 UPLOAD 说明需要调用 uni.uploadFile() 方法
      // 否则调用的是 uni.request() 方法
      if (options.method === "UPLOAD") {
        uni.uploadFile({
          ...options,

          success: res => {
            // 需要将服务器返回的 JSON 字符串 通过 JSON.parse 转成对象
            res.data = (res.data && JSON.parse(res.data)) || undefined

            // 合并参数
            const mergeRes = Object.assign({}, res, {
              config: options,
              isSuccess: true
            })

            resolve(this.interceptors.response(mergeRes))
          },

          fail: err => {
            // 合并参数
            const mergeErr = Object.assign({}, err, {
              config: options,
              isSuccess: false
            })

            reject(this.interceptors.response(mergeErr))
          }
        })
      } else {
        uni.request({
          ...options,

          // 接口调用成功的回调函数
          success: res => {
            // 不管接口成功还是失败，都需要调用响应拦截器
            const mergeRes = Object.assign({}, res, {
              config: options, // 请求参数
              isSuccess: true // 执行了isSuccess
            })
            resolve(this.interceptors.response(mergeRes))
          },

          // 接口调用失败的回调函数
          fail: err => {
            // 不管接口成功还是失败，都需要调用响应拦截器
            const mergeRes = Object.assign({}, err, {
              config: options, // 请求参数
              isSuccess: false // 执行了fail
            })
            reject(this.interceptors.response(mergeRes))
          },
          complete: () => {
            // 如果需要显示 loading ，那么就需要控制 loading 的隐藏
            if (options.isLoading) {
              // 在每一个请求结束以后，都会执行 complete 回调函数
              // 每次从 queue 队列中删除一个标识
              this.queue.pop()
              // 解决并发请求，loading 闪烁问题

              // ===== (假设有两个请求，b请求依赖于a请求，a请求执行完毕后队列立刻推入一条请求，
              // ====== b请求立刻执行把定时器清除（前一条定时器不会执行）并且不会在开启loadding，且队列推入一条
              // =====  b请求执行完毕后，队列有两条，定时器执行清空队列 关闭ladding)
              this.queue.length === 0 && uni.hideLoading()
              // this.timerId = setTimeout(() => {
              //   this.queue.pop()
              //   this.queue.length === 0 && uni.hideLoading()
              //   clearTimeout(this.timerId)
              // }, 1)
            }
          }
        })
      }
    })
  }

  /**
   * @description 封装 GET 实例方法
   * @param {*} url 请求地址
   * @param {*} data 请求参数
   * @param {*} config 其他请求配置项
   * @returns Promise
   */
  get(url, data = {}, config = {}) {
    return this.request(
      Object.assign(
        {
          url,
          data,
          method: "GET"
        },
        config
      )
    )
  }

  /**
   * @description 封装 POST 实例方法
   * @param {*} url 请求地址
   * @param {*} data 请求参数
   * @param {*} config 其他请求配置项
   * @returns Promise
   */
  post(url, data = {}, config = {}) {
    return this.request(
      Object.assign(
        {
          url,
          data,
          method: "POST",
          header: {
            "Content-type": "application/json" // 设置数据的交互格式
          }
        },
        config
      )
    )
  }

  /**
   * @description 封封装 PUT 实例方法
   * @param {*} url 请求地址
   * @param {*} data 请求参数
   * @param {*} config 其他请求配置项
   * @returns Promise
   */
  put(url, data = {}, config = {}) {
    return this.request(
      Object.assign(
        {
          url,
          data,
          method: "PUT"
        },
        config
      )
    )
  }

  /**
   * @description 封装 DELETE 实例方法
   * @param {*} url 请求地址
   * @param {*} data 请求参数
   * @param {*} config 其他请求配置项
   * @returns Promise
   */
  delete(url, data = {}, config = {}) {
    return this.request(
      Object.assign(
        {
          url,
          data,
          method: "DELETE"
        },
        config
      )
    )
  }

  /**
   * @description upload 实例方法，用来对 uni.uploadFile 进行封装
   * @param {*} url 文件的上传地址、接口地址
   * @param {*} filePath 要上传的文件资源路径
   * @param {*} name 文件对应的 key
   * @param {*} config 其他配置项
   */
  upload(url, filePath, name = "file", config = {}) {
    return this.request(
      Object.assign(
        {
          url,
          filePath,
          name,
          method: "UPLOAD"
        },
        config
      )
    )
  }

  /**
   * @description 处理并发请求
   * @param  {...promise} promise 传入的每一项需要是 Promise
   * @returns Promise
   */
  all(...promise) {
    // 通过展开运算符结束参数 会将传入的参数转为数组
    return Promise.all(promise)
  }
}

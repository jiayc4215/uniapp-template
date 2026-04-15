import { pages, subPackages } from "@/pages.json"
/**
 * 解析 url 得到 path 和 query
 * 比如输入url: /pages/login/login?redirect=%2Fpages%2Fdemo%2Fbase%2Froute-interceptor
 * 输出: {path: /pages/login/login, query: {redirect: /pages/demo/base/route-interceptor}}
 */
export function parseUrlToObj(url) {
  const [path, queryStr] = url.split("?")
  // console.log(path, queryStr)

  if (!queryStr) {
    return {
      path,
      query: {}
    }
  }
  const query = {}
  queryStr.split("&").forEach(item => {
    const [key, value] = item.split("=")
    // console.log(key, value)
    query[key] = ensureDecodeURIComponent(value) // 这里需要统一 decodeURIComponent 一下，可以兼容h5和微信y
  })
  return { path, query }
}

export function getLastPage() {
  // getCurrentPages() 至少有1个元素，所以不再额外判断
  // const lastPage = getCurrentPages().at(-1)
  // 上面那个在低版本安卓中打包会报错，所以改用下面这个【虽然我加了 src/interceptions/prototype.ts，但依然报错】
  const pages = getCurrentPages()
  return pages[pages.length - 1]
}
/**
 * 首页路径，通过 page.json 里面的 type 为 home 的页面获取，如果没有，则默认是第一个页面
 * 通常为 /pages/index/index
 */
export const HOME_PAGE = `/${pages.find(page => page.type === "home")?.path || pages[0].path}`

/**
 * 得到所有的需要登录的 pages，包括主包和分包的
 * 这里设计得通用一点，可以传递 key 作为判断依据，默认是 excludeLoginPath, 与 route-block 配对使用
 * 如果没有传 key，则表示所有的 pages，如果传递了 key, 则表示通过 key 过滤
 */
export function getAllPages(key) {
  // 这里处理主包
  const mainPages = pages
    .filter(page => !key || page[key])
    .map(page => ({
      ...page,
      path: `/${page.path}`
    }))

  // 这里处理分包
  const subPages = []
  subPackages.forEach(subPageObj => {
    // console.log(subPageObj)
    const { root } = subPageObj
    subPageObj.pages
      .filter(page => !key || page[key])
      .forEach(page => {
        subPages.push({
          ...page,
          path: `/${root}/${page.path}`
        })
      })
  })
  const result = [...mainPages, ...subPages]
  // console.log(`getAllPages by ${key} result: `, result)
  return result
}
export function ensureDecodeURIComponent(url) {
  if (url.startsWith("%")) {
    return ensureDecodeURIComponent(decodeURIComponent(url))
  }
  return url
}

export function currRoute() {
  const lastPage = getLastPage()
  if (!lastPage) {
    return {
      path: "",
      query: {}
    }
  }
  const currRoute = lastPage.$page

  // 经过多端测试，只有 fullPath 靠谱，其他都不靠谱
  const { fullPath } = currRoute
  return parseUrlToObj(fullPath)
}

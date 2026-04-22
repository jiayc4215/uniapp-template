<script setup>
import { onHide, onLaunch, onShow } from "@dcloudio/uni-app"
import { getCurrentInstance } from "vue"
import { permission } from "./router/permission"

const { proxy } = getCurrentInstance()
const router = proxy.$router

router && permission.install(router)

onLaunch(options => {
  console.log("App.vue onLaunch", options)
})
onShow(() => {})
onHide(() => {
  console.log("App Hide")
})
</script>
<style lang="scss">
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
@use "@wot-ui/ui/styles/theme/index.scss" as *;
.page-wraper {
  font-size: 28rpx;
  color: #333333;
  background-color: #f7f8fa;
  box-sizing: border-box;
  min-height: calc(100vh - var(--window-top));
}
.wot-theme-dark.page-wraper {
  background: #222;
}
</style>

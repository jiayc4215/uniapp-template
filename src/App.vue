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
</style>

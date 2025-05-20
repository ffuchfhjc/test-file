import { createApp } from "vue"
import App from "./App.vue"
import owl from "@/owl"
import ToastPlugin from "@/plugins/toast"
import getSearchObject from "@/utils/getSearchObject"
import VConsole from "vconsole"
import checkInWhiteList from "./utils/whiteList"
import "./mock/index"

// import vant from 'vant'
// import 'vant/lib/index.css'
H5guard.init({
  //xhrhook、fetchhook和domains必须同时使用才会生效,为可选参数
  xhrHook: true, //与domains配合使用，开启状态才行
  fetchHook: true, //与domains配合使用，开启状态才行
  domains: ["44204-wtoqu-sl-kk.wpt.test.sankuai.com", "kk.meituan.com"], //该域名下的请求会在header中携带mtgsig，注意跨域配置
})
const searchObject = getSearchObject()
window.searchObject = searchObject

const KNBP = KNB.getPromiseInstance()
window.KNBP = KNBP

const config = import.meta.env.NODE_CONFIG_ENV
if (config !== "prod" || window.searchObject.isTest || window.searchObject.showLog || checkInWhiteList()) {
  const vConsole = new VConsole()
}
window.isTest = config !== "prod"
owl(config)
const app = createApp(App)
app.use(ToastPlugin)
// app.use(vant)
app.mount("#app")

console.info("main5.js")

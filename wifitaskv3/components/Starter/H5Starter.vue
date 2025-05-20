<template>
  <div class="h5Starter-wrap">
    <GreetingPage :source="'share'" @close="onCloseGreetingPage" @appJoin="onClickMtBtn" @miniProgramJoin="onClickWxBtn"> </GreetingPage>
  </div>
</template>

<script setup>
import GreetingPage from "../GreetingPage.vue"
import { WIFITASKV3_STARTER_MP_WEB_PARAMS_KEY } from "@/utils/consts"
import { ref } from "vue"

defineEmits(["closeGreetingPage"])

const createWebParams = () => {
  const { inviterUserId, inviterUuid } = window.searchObject
  const webParams = { inviterUserId, inviterUuid }
  Object.keys(webParams).forEach((key) => {
    if (webParams[key] === undefined) {
      delete webParams[key]
    }
  })
  return webParams
}

const createMtAppUrl = () => {
  const webParams = createWebParams()
  let url = window.origin + "/kk/fetools/pages/wifitaskv3?" + new URLSearchParams(webParams).toString()
  url = "imeituan://web?url=" + encodeURIComponent(url)
  // url = origin + "/kk/fetools/pages/wifitaskv3?isH5Starter=1&inviterUserId=" + window.searchObject.userid + "&inviterUuid=" + window.searchObject.uuid
  url = "https://w.dianping.com/cube/evoke/meituan.html?url=" + encodeURIComponent(url)
  return url
}

/**
 * 创建微信小程序的URL
 * @param webParams
 */
const createWxAppUrl = () => {
  const webParams = createWebParams()
  const h5Url =
    window.origin +
    "/kk/fetools/pages/wifitaskv2?" +
    new URLSearchParams({
      ...webParams,
      isStartupPage: 1,
      // shareTitle: "手慢无！参与门店淘金活动，立得50元现金",
      // shareUrl: "https://p0.meituan.net/undertake/6fd547cece0fb37c54fb5dc9b5ee3719322032.png",
    }).toString()

  const wxUrl =
    "https://servicewechat.com/wxascheme/jump_wxa?url=" +
    encodeURIComponent(
      "weixin://dl/business/?t=L0oYDXNKbAh&cq=" + encodeURIComponent("url=" + encodeURIComponent(h5Url)) + "&domain=cube.meituan.com"
    )
  return wxUrl
}

const onClickMtBtn = () => {
  console.log("onClickMtBtn")
  const mtLandingUrl = createMtAppUrl()
  console.log("mtLandingUrl", mtLandingUrl)
  location.href = mtLandingUrl
}

const onClickWxBtn = () => {
  console.log("onClickWxBtn")
  const wxLandingUrl = createWxAppUrl()
  console.log("wxLandingUrl", wxLandingUrl)
  location.href = wxLandingUrl
}

const onCloseGreetingPage = () => {
  emit("closeGreetingPage")
}
</script>

<style scoped lang="scss">
.h5Starter-wrap {
  width: 100vw;
  height: 100vh;
  background-color: white;
}
.btn {
  border-radius: 8px;
  height: 88px;
  font-size: 30px;
  font-weight: 500;
  color: #ffffff;
  background: #00b300;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  margin: 0 28px;
}
</style>

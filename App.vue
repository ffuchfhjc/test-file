<template>
  <div class="page">
    <div class="loading-wrap" v-if="showLoading">
      <Loading />
    </div>
    <SharePage v-if="pageTypeFromStore === 'sharePage'"></SharePage>
    <template v-if="pageTypeFromStore === 'mainPage'">
      <div class="content">
        <template v-if="showActivityRule">
          <ActivityRule v-if="false" @close="showActivityRule = false" showMode="bottomReturn" />
          <!-- source 分为分享页和欢迎页面 -->
          <GreetingPage v-else :source="'greet'" @close="showActivityRule = false" @miniProgramJoin="" @appJoin="" />
        </template>
        <TaskModule v-if="pageStatus === 'TaskModule'" @init-complete="showLoading = false" />
        <ShareModule v-if="pageStatus === 'ShareModule'" @init-complete="showLoading = false" />
        <PersonalCenter v-if="pageStatus === 'PersonalCenter'" />
      </div>
      <BottomNavs v-show="store.showBottomNavs" />
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import Loading from "@/components/Loading.vue"
import TaskModule from "./components/TaskModule/index.vue"
import PersonalCenter from "./components/PersonalCenter/index.vue"
import SharePage from "./page-share/index.vue"
import BottomNavs from "./components/BottomNavs.vue"
import ShareModule from "./components/ShareModule/index.vue"
import { store } from "./store"
import { getLocation, getPageInfo, login } from "./utils/utils"
import { bindShareInfo } from "./request"
import createMpUrl from "./utils/mpUrlCreator"
import logger from "./utils/logger"
import ActivityRule from "./components/ActivityRule.vue"
import GreetingPage from "./components/GreetingPage.vue"
import { WIFITASKV3_STARTER_MP_WEB_PARAMS_KEY } from "@/utils/consts"
import checkWhiteList from "./utils/whiteList"
import VConsole from "vconsole"

const log = logger("App")

const tracker = window.LXAnalytics("getTracker")
window.pageCase = tracker("pageView", {}, {}, "c_lintopt_jpnzfkyp")

const pageStatus = computed(() => store.pageStatus)
const pageTypeFromStore = computed(() => store.pageType)
const showLoading = ref(true)
const hasShowActivityRule = localStorage.getItem("ActivityRule") || false
const showActivityRule = ref(true)

/**
 * 判断是否是启动页，如果是启动页，判断是否为ios，然后跳转到目标页
 */
const checkIsStartupPage = async function () {
  // return false;

  const { isStartupPage } = window.searchObject
  const flagIsStartupPage = isStartupPage === "1"
  console.log('deviceInfo',{ isStartupPage, flagIsStartupPage })
  if (flagIsStartupPage) {
    const pageInfo = await getPageInfo()
    const { pageQuery: mpPageQuery } = pageInfo
    let isIOS = /iPad|iPhone|iPod/.test(window.navigator.userAgent)
    // if(window.searchObject.isGzzTest) {
    //   isIOS = true
    // }
    if (isIOS) {
      alert("苹果设备暂不支持")
    } else {
      // anxinlian-task/pages/webview/index?delayClosePageTime=100&initWifi=1&loopWifi=1&wifiLoopInterval=60000&listenLocation=1&isHighAccuracy=1&locationLoopInterval=60000&shareTitle=分享标题&shareUrl=https%3A%2F%2Fp1.meituan.net%2Ftravelcube%2F00522bf51ed1cc3f88265f937f9f45db1628097.png&url=https%3A%2F%2F44204-wtoqu-sl-kk.wpt.test.sankuai.com%2Fkk%2Ffetools%2Fpages%2Fwifitaskv2
      const mpUrl = createMpUrl(
        mpPageQuery, // 小程序页面参数
        {
          delayClosePageTime: "100",
          initWifi: "1",
          loopWifi: "1",
          wifiLoopInterval: "35000",
          listenLocation: "1",
          isHighAccuracy: "1",
          locationLoopInterval: "60000",
          shareTitle: "手慢无！参与门店淘金活动，立得50元现金",
          shareUrl: encodeURIComponent("https://p0.meituan.net/undertake/6fd547cece0fb37c54fb5dc9b5ee3719322032.png"),
        }, // 小程序页面参数需要添加的参数
        {}, // web页面参数需要添加的参数
        ["isStartupPage"], // 小程序页面参数需要删除的参数
        ["isStartupPage"] // web页面参数需要删除的参数
      )
      log("checkIsStartupPage", {
        mpUrl,
        mpPageQuery,
        isStartupPage,
        isIOS,
        userAgent: window.navigator.userAgent,
        pageInfo,
      })
      console.info("111")
      // wx.ready(function(){
      // 延迟2秒，token获取成功后，再跳转
      wx.miniProgram.reLaunch({ url: mpUrl })
      // });
    }
  }
  return flagIsStartupPage
}

const init = async function () {
  // store.setPageType('sharePage')
  // showLoading.value = false
  // return;
  // 判断是否是启动页
  const isStartupPage = await checkIsStartupPage()
  if (isStartupPage) {
    return
  }
  // 获取位置信息和页面信息
  const [location, pageInfo] = await Promise.all([
    getLocation().then((location) => {
      log("location", location)
      store.setLocation(location)
      return location
    }),
    // 由于 getLocation 获取速度比较慢，getPageInfo 获取速度较快；所以部分逻辑单独放这里处理
    getPageInfo().then((pageInfo) => {
      log("pageInfo", pageInfo)
      // 判断是否需要登录
      if (!pageInfo?.authInfo?.token) {
        log("need login")
        login().then(() => {
          log("login success")
          const { pageQuery } = pageInfo
          const mpUrl = createMpUrl(pageQuery)
          // wx.ready(function(){
          setTimeout(() => {
            wx.miniProgram.reLaunch({ url: mpUrl })
          }, 2000)
          // });
        })
        throw new Error("need login")
      }

      const inWhiteList = checkWhiteList(pageInfo?.authInfo?.userId)
      console.log("inWhiteList", inWhiteList)

      if (inWhiteList) {
        const vConsole = new VConsole()
        // vConsole.show()
      }
      log("page url-------:", window.location.href.split("#")[0])

      return pageInfo
    }),
  ])

  log("Promise.all", location, pageInfo)

  // 判断是否是分享页，当 "存在inviterUserId" 且 "inviterUserId和当前用户id一致" 时，是分享页
  let { inviterUserId, inviterWXOpenId, inviterUuid } = window.searchObject

  const pageType =
    // 判断页面类型
    inviterUserId && inviterUserId === pageInfo?.authInfo?.userId?.toString() ? "sharePage" : "mainPage"
  log({ inviterUserId, inviterWXOpenId, inviterUuid, pageInfo, userId: pageInfo?.authInfo?.userId })

  // 初始化个人信息 & 位置信息
  store.initPersonalInfo(pageInfo.authInfo || {})
  pageInfo.authInfo.userId && tracker("set", "uid", pageInfo.authInfo.userId)
  log("pageInfo, location, pageType: ", pageInfo, location, pageType)
  const { latitude: lat, longitude: lng } = location
  store.setLocation({ lat, lng })
  store.setMpPageQuery(pageInfo.pageQuery)

  log("store-1", store)

  // 如果是分享页，引导提示去分享
  if (pageType === "sharePage") {
    store.setPageType(pageType)
    showLoading.value = false // 如果是分享页，直接设置loading为false
    log("store-2", store)

    // 如果是新用户打开页面，调用绑定方法，传入邀请者的参数，设置pagestatus=taskmodule
  } else {
    if (inviterUserId) {
      const bindShareInfoRes = await bindShareInfo({
        // mock begin ===========>
        // inviterUserId: '1234567890',
        inviterUserId,
        // mock end ===========>
        ...(inviterWXOpenId ? { inviterWXOpenId } : {}),
        ...(inviterUuid ? { inviterUuid } : {}),
      }).catch((err) => {
        console.error("绑定邀请关系失败", err)
        if (window.searchObject.isTest) {
          window.toast("绑定邀请关系失败")
        }
      })
      log("bindShareInfoRes", bindShareInfoRes)
      // 绑定成功
      // mock begin ===========>
      // bindShareInfoRes.data = true
      // mock end ===========>
      if (bindShareInfoRes && bindShareInfoRes?.data) {
        // store.setPageType(pageType)
        showLoading.value = false // 如果是分享页，直接设置loading为false
      } else {
        console.error("绑定邀请关系失败")
        if (window.searchObject.isTest) {
          window.toast("绑定邀请关系失败")
        }
      }
      // TODO：无论绑定成功还是失败，应该都能继续。这里需要上报日志。
    }
    store.setPageType(pageType)
    store.getWalletStatisticsFun()
    store.setPageStatus("TaskModule")
  }
  log("store-3", store)

  // 在这个地方判断，是新用户打开页面，还是用户打开了分享页
  // 如果是新用户打开页面，调用绑定方法，传入邀请者的参数，设置pagestatus=taskmodule
  // bindShareInfo({ inviterUserId, inviterWXOpenId }).then((res) => {
  //   if (!res.data) { window.toast('绑定邀请关系失败，请稍后重试') }
  // })
  // store.setPageStatus('TaskModule')
  // 如果是打开了分享页，直接设置pagestatus为ShareModule
  // store.setPageStatus('ShareModule')
  // store.setPageStatus('TaskModule')
}
init()
// mock code -----------------------
// store.setLocation()
// store.setPageStatus('TaskModule')
</script>

<style scoped lang="scss">
.page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

.content {
  flex: 1;
  overflow: hidden;
}

.loading-wrap {
  position: absolute;
  z-index: 3;
  background-color: #fff;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>

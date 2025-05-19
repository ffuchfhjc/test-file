<template>
  <H5Starter :source="'share'" v-if="isH5Starter" @closeGreetingPage="onCloseGreetingPageWhenShare" />
  <div v-else-if="showMainPage" class="page">
    <div class="loading-wrap" v-if="showLoading">
      <Loading />
    </div>
    <!-- <template> -->

    <div class="content">
      <!-- 
      
      逻辑是这样，判断来源，如果是新用户，则展示落地页海报，如果是通过邀请海报来的，展示规则内容-->
      <template v-if="showActivityRule">
        <ActivityRule v-if="false" @close="showActivityRule = false" showMode="bottomReturn" />
        <!-- source 分为分享页和欢迎页面 -->
        <!-- <GreetingPage v-else :source="'share'" @close="showActivityRule = false" @miniProgramJoin="" @appJoin="" /> -->
      </template>

      <TaskModule v-if="pageStatus === 'TaskModule'" @init-complete="showLoading = false" />
      <ShareModule v-if="pageStatus === 'ShareModule'" @init-complete="showLoading = false" />
      <PersonalCenter v-if="pageStatus === 'PersonalCenter'" />
    </div>
    <BottomNavs v-show="store.showBottomNavs" />
    <!-- </template> -->
  </div>
  <GreetingPage v-if="showGreetingPage && !showMainPage" :source="'greet'" @close="onCloseGreetingPageWhenGreet" />
  <ConfirmLeave v-if="store.showConfirmLeave" @leave="onLeave" @close="store.showConfirmLeave = false" />
  <ImgPoster
    v-show="store.showNewLearnImgPoster"
    :show-close="true"
    :btn-text="'开始做任务'"
    :src="'https://p0.meituan.net/undertake/809a58d2df4e4bc1c81c425a886f66be1535871.jpg'"
    @close="onCloseNewLearnImgPoster"
  />
</template>

<script setup>
console.log("0")
import { ref, computed } from "vue"
import Loading from "@/components/Loading.vue"
import TaskModule from "./components/TaskModule/index.vue"
import PersonalCenter from "./components/PersonalCenter/index.vue"
import BottomNavs from "./components/BottomNavs.vue"
import ShareModule from "./components/ShareModule/index.vue"
import H5Starter from "./components/Starter/H5Starter.vue"
import { store } from "./store"
import { getLocation, getPageInfo, login } from "./utils/utils"
import { bindShareInfo } from "./request"
import createMpUrl from "./utils/mpUrlCreator"
import logger from "./utils/logger.js"
import { checkIsAndroid } from "./utils/index"
import RealtimeReport from "./utils/realtimeReport"
import ConfirmLeave from "./components/ConfirmLeave.vue"
import ActivityRule from "./components/ActivityRule.vue"
import GreetingPage from "./components/GreetingPage.vue"
import ImgPoster from "./components/Common/ImgPoster.vue"
import checkArriveMaxTimes from "./utils/checkArriveMaxTimes"

const realtimeReport = new RealtimeReport()

const log = logger("App")
log("page url:", window.location.href)
log("web queries:", window.searchObject)

const tracker = window.LXAnalytics("getTracker")
window.pageCase = tracker("pageView", {}, {}, "c_lintopt_jpnzfkyp")

const pageStatus = computed(() => store.pageStatus)

const hasShowActivityRule = localStorage.getItem("ActivityRule") || false
const showActivityRule = ref(true)

const showLoading = ref(true)
const isH5Starter = ref(window.searchObject.isH5Starter === "1")
const showGreetingPage = ref(!checkArriveMaxTimes("__kk_taskwifi_v3_show_new_greeting_page__", 3) && !isH5Starter.value)
store.showNewLearnImgPoster = !checkArriveMaxTimes("__kk_taskwifi_v3_show_new_learn_img_poster__", 3)
// const showMainPage = ref(!showLoading && !isH5Starter.value && !showGreetingPage.value && !store.showNewLearnImgPoster)
const showMainPage = computed(() => !isH5Starter.value && !showGreetingPage.value && !store.showNewLearnImgPoster)

console.log("isH5Starter:", isH5Starter.value)
console.log("showMainPage:", showMainPage.value)
console.log("showGreetingPage:", showGreetingPage.value)
console.log("store.showNewLearnImgPoster:", store.showNewLearnImgPoster)

const initMainPage = async function () {
  console.log("2---222")
  log("2")
  // showLoading.value = false
  // return;
  // 判断是否是启动页
  const isAndroid = await checkIsAndroid()
  log("3", { isAndroid })
  if (!isAndroid) {
    alert("暂不支持该设备")
    return
  }
  // 获取位置信息和页面信息
  const [location, pageInfo] = await Promise.all([
    getLocation().then((location) => {
      log("location", location)
      if (location.lat && location.lng) {
        store.setLocation(location)
      }
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
          KNBP.jumpPage({
            url:
              window.location.href.split("?")[0] + (window.searchObject.inviterUserId ? "?inviterUserId=" + window.searchObject.inviterUserId : ""),
          })
        })
        throw new Error("need login")
      }
      return pageInfo
    }),
  ])

  log("Promise.all", location, pageInfo)

  // 初始化个人信息 & 位置信息
  await store.initPersonalInfo(pageInfo.authInfo || {})
  pageInfo.authInfo.userId && tracker("set", "uid", pageInfo.authInfo.userId)
  log("pageInfo, location: ", pageInfo, location)
  store.setMpPageQuery(pageInfo.pageQuery)

  log("store-1", store)

  const inviterUserId = window.searchObject.inviterUserId
  const inviterUuid = window.searchObject.inviterUuid

  if (inviterUserId) {
    const bindShareInfoRes = await bindShareInfo({
      // mock begin ===========>
      // inviterUserId: '1234567890',
      inviterUserId,
      inviterUuid,
      // mock end ===========>
      // inviterWXOpenId: window.searchObject.inviterWXOpenId,
    }).catch((err) => {
      console.error("绑定邀请关系失败", err)
      if (window.searchObject.isTest) {
        window.toast("绑定邀请关系失败")
      }
    })
    realtimeReport.reportRealTime(
      "bindShareInfo",
      {},
      {
        inviterUserId,
        inviterUuid,
        userid: store.personalInfo.userId,
        bindShareInfoRes,
      }
    )
    log("bindShareInfoRes", bindShareInfoRes)
    // 绑定成功
    // mock begin ===========>
    // bindShareInfoRes.data = true
    // mock end ===========>
    if (bindShareInfoRes?.data) {
      showLoading.value = false // 如果是分享页，直接设置loading为false
    } else {
      console.error("绑定邀请关系失败")
      if (window.searchObject.isTest) {
        window.toast("绑定邀请关系失败")
      }
    }
    // TODO：无论绑定成功还是失败，应该都能继续。这里需要上报日志。
  }

  showLoading.value = false
  store.setPageStatus("TaskModule")
  store.getWalletStatisticsFun()
  log("store-4", store)

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

initMainPage()
if (!window.searchObject.isH5Starter) {
  console.log("xxxx1-window.searchObject.isH5Starter", window.searchObject.isH5Starter)
  // showMainPage.value = true
  // initMainPage()
}

const onCloseGreetingPageWhenShare = () => {
  console.log("xxxx2")
  // showMainPage.value = true

  initMainPage()
}

const onCloseGreetingPageWhenGreet = () => {
  showGreetingPage.value = false
  // showMainPage.value = true
  initMainPage()
}

KNBP.setLLButton({
  handle: () => (store.showConfirmLeave = true),
})
const onLeave = () => {
  log("onLeave")
  KNBP.closePage()
}

const onCloseNewLearnImgPoster = () => {
  store.showNewLearnImgPoster = false
  log("onCloseNewLearnImgPoster", store.showNewLearnImgPoster)
}

// mock code -----------------------
// store.setLocation()
// store.getWalletStatisticsFun()
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

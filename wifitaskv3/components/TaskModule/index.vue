<template>
  <div class="module">
    <TopNavs />
    <div class="main">
      <div class="loading" v-if="showLoading">
        <Loading />
      </div>
      <div v-else class="container">
        <!-- <ActivityRule v-if="true" @close="showActivityRule = false" showMode="bottomReturn" /> -->
        <TaskBundle
          v-if="taskModuleTab === 'TaskBundle'"
          :bundles
          :showkey
          @choose-bundle="chooseBundle"
          @refresh="updatePageData('TaskBundle', false)"
        />
        <TaskDetail v-if="taskModuleTab === 'TaskDetail'" :tasks :bundle :showkey @refresh="updatePageData('TaskDetail', false)" />
        <NearWiFi v-if="taskModuleTab === 'NearWiFi'" v-model="wifiList" :address @refresh="updatePageData('NearWiFi')" />
        <TaskRecord v-if="taskModuleTab === 'TaskRecord'" :userTasks />
      </div>
      <OpenWifi v-if="showOpenWifi" @hasOpenWifi="hasOpenWifi" @close="rejectOpenWifi" />
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue"
import Loading from "@/components/Loading.vue"
import TopNavs from "./TopNavs.vue"
import TaskBundle from "./TaskBundle.vue"
import NearWiFi from "./NearWiFi.vue"
import TaskRecord from "./TaskRecord.vue"
import TaskDetail from "./TaskDetail.vue"
import OpenWifi from "./OpenWifi.vue"
import { store } from "../../store"
import { getNearbyPackageInfo, getTaskInfoInPackage, getUserTasks, getNearbyWifiTask, showNearbyWifiTask } from "../../request"
import { getAddress } from "@/services/mapApi"
import { getScanWifiList } from "../../utils/utils"
import { getLocation } from "../../utils/utils"
import logger from "../../utils/logger"
import { sendMv } from "../../lxreport"
import RealtimeReport from "../../utils/RealtimeReportV2"
const realtimeReport = new RealtimeReport()

sendMv("b_lintopt_ii1z36b6_mv")
realtimeReport.reportRealTime("TaskModuleInit")

const log = logger("TaskModule")

const emit = defineEmits(["init-complete"])
const taskModuleTab = computed(() => store.taskModuleTab)
const bundles = ref([])
const tasks = ref([])
const userTasks = ref({})
const wifiList = ref([])
const address = ref("")
const bundle = ref(null)
const showLoading = ref(false)
const showkey = ref(0)
const showOpenWifi = ref(false)

const chooseBundle = (item) => {
  bundle.value = item
  store.setTaskModuleTab("TaskDetail")
}
const refreshLocation = async () => {
  // 获取位置
  const location = await getLocation()
  realtimeReport.reportRealTime("getNearbyPackageInfoFun_GetLocation", { location })
  log("getLocation-location", location)
  const { lat, lng } = location
  store.setLocation({ lat, lng })
  return { lat, lng }
}
const getNearbyPackageInfoFun = async () => {
  await refreshLocation()
  getNearbyPackageInfo().then((res) => {
    log("getNearbyPackageInfo", res.data)
    bundles.value = res.data
    showLoading.value = false
    emit("init-complete")
    showkey.value++
  })
}
const getTaskInfoInPackageFun = async () => {
  await refreshLocation()
  getTaskInfoInPackage({
    packageId: bundle.value.packageId,
  }).then((res) => {
    log("getTaskInfoInPackage", res.data)
    tasks.value = res.data
    showLoading.value = false
    showkey.value++
  })
}
const getUserTasksFun = () => {
  getUserTasks().then((res) => {
    log("getUserTasks", res.data)
    userTasks.value = res.data
    showLoading.value = false
  })
}
const getWifiPremission = async () => {
  return KNBP.use("meituan.pinBossWifiCommonJsHandler", {
    clazz: "BossWifiKnbInterface",
    method: "isWifiEnabled",
  })
    .then((res) => {
      return res.data.enabled
    })
    .catch(() => {
      return true
    })
}
const getNearbyWifiTaskFun = async (option = {}) => {
  if (!option.noScan) {
    const enable = await getWifiPremission()
    console.log("wifi是否打开", enable)
    showOpenWifi.value = !enable
    if (!enable) return
  }
  realtimeReport.reportRealTime("TaskModuleInit_GetNearbyWifiTaskFun")
  const { lat, lng } = await refreshLocation()
  // 获取地址
  getAddress({ lat, lng }, "base").then((res) => {
    log("getAddress", res.regeocode[0])
    address.value = res.regeocode[0].formatted_address || "定位失败"
  })
  log("getNearbyWifiTaskFun-getScanWifiList")

  try {
    let scanWifiName = []
    if (!option.noScan) {
      // 获取wifi列表
      scanWifiName = await getScanWifiList()
        .then((res) => {
          // 上报获取wifi列表
          realtimeReport.reportRealTime("TaskModuleInit_GetScanWifiList", { res })
          const { data: scanWifiList } = res
          store.scanWifiList = scanWifiList || []
          log("scanWifiList", scanWifiList)
          // wifi名去掉异常情况
          let scanWifiName = scanWifiList.map((item) => item.ssid).filter((item) => item)
          // wifi名去重
          scanWifiName = [...new Set(scanWifiName)]

          return scanWifiName
        })
        .catch((err) => {
          // 上报获取wifi列表失败
          realtimeReport.reportRealTime("TaskModuleInit_GetScanWifiList_Error", { err })
          log("getScanWifiList-err", err)
          // 获取wifi列表失败，返回空数组
          store.scanWifiList = scanWifiList || []
          return []
        })
    }
    // 若获取wifi列表成功，则展示匹配的wifi任务，否则展示附近的wifi任务
    let apiRes
    if (scanWifiName.length > 0) {
      apiRes = await getNearbyWifiTask({ scanWifiName })
    } else {
      apiRes = await showNearbyWifiTask()
    }

    // 上报获取wifi任务
    log("getNearbyWifiTask", apiRes.data)
    wifiList.value = apiRes.data
    showLoading.value = false

    // 上报获取wifi任务
    realtimeReport.reportRealTime("TaskModuleInit_GetNearbyWifiTask", {
      scanWifiNameLength: scanWifiName.length,
      nearbyWifiTask: apiRes,
      nearbyWifiTaskLength: apiRes?.data?.length,
    })
  } catch (err) {
    wifiList.value = []
    showLoading.value = false
    realtimeReport.reportRealTime("TaskModuleInit_GetNearbyWifiTask_Error", { err })
  }
}
// 更新逻辑，曝光时，更新当时taskModuleTab的页面数据，切换再更新
const updatePageData = (moduleTab, loading = true) => {
  showLoading.value = loading
  log("updatePageData", moduleTab)
  if (moduleTab === "TaskBundle") {
    getNearbyPackageInfoFun()
  } else if (moduleTab === "TaskDetail") {
    getTaskInfoInPackageFun()
  } else if (moduleTab === "NearWiFi") {
    getNearbyWifiTaskFun()
  } else if (moduleTab === "TaskRecord") {
    getUserTasksFun()
  }
}

watch(taskModuleTab, (newVal) => {
  updatePageData(newVal)
})

updatePageData(taskModuleTab.value)
const hasOpenWifi = () => {
  getNearbyWifiTaskFun()
}
const rejectOpenWifi = () => {
  showOpenWifi.value = false
  getNearbyWifiTaskFun({ noScan: true })
}
</script>

<style scoped lang="scss">
.module {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.main {
  flex: 1;
  position: relative;
  overflow: hidden;
  display: flex;
}

.loading {
  position: absolute;
  inset: 0;
  z-index: 2000;
  display: flex;
  background-color: #f5f5f5;
}

.container {
  flex: 1;
  display: flex;
  overflow: hidden;
}
</style>

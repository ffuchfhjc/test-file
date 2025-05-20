import { reactive } from "vue"
import { getWalletStatistics } from "./request"
import logger, { setLoggerInWhiteList } from "./utils/logger"
import checkInWhiteList from "./utils/whiteList"
const log = logger("store")

export const store = reactive({
  location: { lat: 27.717639, lng: 106.918715 },
  loadingPage: true,
  pageStatus: "",
  taskModuleTab: "TaskBundle",
  directShowApprove: false,
  showBottomNavs: true,
  personalInfo: {
    token: "",
    userId: "",
    wxOpenId: "",
    wxUnionId: "",
    wxUserName: "",
    regCityId: "",
    userAvatar: "",
    totalIncome: "",
    totalJob: "",
    totalActivity: "",
    totalShare: "",
    balance: "",
    firstJob: 0,
    mobileNum: "",
  },
  extraParams: {},
  scanWifiList: [],
  pageType: "", // 页面类型， mainPage、sharePage
  mpPageQuery: {},

  setPageStatus(status) {
    this.pageStatus = status
  },
  setLocation(location) {
    this.location = location
    // this.location = window.isTest ? { lat: 27.717639, lng: 106.918715 } : location
  },
  setTaskModuleTab(tab) {
    this.taskModuleTab = tab
  },
  initPersonalInfo(authInfo) {
    const { openId: wxOpenId, cityId: regCityId, userId, userInfo, token, unionId: wxUnionId, uuid } = authInfo
    const { mtAvatar: userAvatar, mtNickName: wxUserName, mobile: mobileNum } = userInfo || {}
    this.personalInfo = {
      ...this.personalInfo,
      wxUserName,
      wxOpenId,
      wxUnionId,
      userId,
      regCityId,
      userAvatar,
      token,
      mobileNum,
      uuid,
    }

    // begin: mock code -----------------------
    // if(window.isTest) {
    //   this.personalInfo.userId = 5186813815
    //   this.personalInfo.token = 'AgEGJX1UtJ_m54qYd2S9GNXGy6pjNT9471IG9dVRMUxVjftUHnxCNDpK04KiE4veId4R3hbOv2HPOgwAAADt6QoAsVsQq7ffjzPiCr2ec_beLaCSTPOyaOs1VgvGeaOPYeHMg661kA0zwd6uNceWdToI'
    // }
    // end: mock code -----------------------
    this.initExtraParams(authInfo)
    setLoggerInWhiteList(checkInWhiteList(userId))
  },
  initExtraParams(authInfo) {
    const { model, version, brand } = authInfo?.sysInfo || {}
    const { uuid, openIdCipher } = authInfo
    this.extraParams = {
      deviceModel: model,
      version: version,
      deviceBrand: brand,
      uuid,
      platform: 13,
      appId: "wxde8ac0a21135c07d",
      expoId: openIdCipher,
      h5Fingerprint: window.H5guard.getfp(),
    }
  },
  setPersonalInfo(info) {
    this.personalInfo = {
      ...this.personalInfo,
      ...info,
    }
  },
  setMpPageQuery(query) {
    this.mpPageQuery = query
  },
  getWalletStatisticsFun() {
    getWalletStatistics().then((res) => {
      log("getWalletStatistics", res)
      this.personalInfo = {
        ...this.personalInfo,
        ...res.data,
      }
    })
  },
  setPageType(type) {
    this.pageType = type
  },
})

import { reactive } from "vue";
import { getWalletStatistics } from "./request";
import logger from "./utils/logger";
import { checkIsAndroid } from "./utils/index";
import { getFingerprint, getUA, getUserInfo } from "./utils/mtApp";
const log = logger("store");

export const store = reactive({
  location: { lat: 27.717639, lng: 106.918715 },
  loadingPage: true,
  pageStatus: "",
  taskModuleTab: "TaskBundle",
  directShowApprove: false,
  showBottomNavs: true,
  showConfirmLeave: false,
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
    orderActivityProgress: []
  },
  extraParams: {},
  scanWifiList: [],
  mpPageQuery: {},
  showMap: false,
  showNewLearnImgPoster: false,

  setPageStatus(status) {
    this.pageStatus = status;
  },
  setLocation(location) {
    log("setLocation", location);
    this.location = location;
    this.location = (window.searchObject.isMockGps)
      ? { lat: 27.717639, lng: 106.918715 }
      : location
  },
  setTaskModuleTab(tab) {
    this.taskModuleTab = tab;
  },
  async initPersonalInfo(authInfo) {
    const userInfoFromApp = await getUserInfo();
    const {
      openId: wxOpenId,
      cityId: regCityId,
      userId,
      userInfo,
      token,
      unionId: wxUnionId,
      uuid,
    } = authInfo;
    const { mtAvatar: userAvatar, mobile: mobileNum } = userInfo || {};

    const mtNickName = userInfoFromApp.userName;
    this.personalInfo = {
      ...this.personalInfo,
      wxUserName: mtNickName,
      wxOpenId,
      wxUnionId,
      userId,
      regCityId,
      userAvatar,
      token,
      mobileNum,
      uuid,
    };
    // begin: mock code -----------------------
    // if(window.isTest) {
    //   this.personalInfo.userId = 5186813815
    //   this.personalInfo.token = 'AgEGJX1UtJ_m54qYd2S9GNXGy6pjNT9471IG9dVRMUxVjftUHnxCNDpK04KiE4veId4R3hbOv2HPOgwAAADt6QoAsVsQq7ffjzPiCr2ec_beLaCSTPOyaOs1VgvGeaOPYeHMg661kA0zwd6uNceWdToI'
    // }
    // end: mock code -----------------------
    await this.initExtraParams(authInfo);
  },
  async initExtraParams(authInfo) {
    const { model, version, brand } = authInfo?.sysInfo || {};
    const { uuid, openIdCipher } = authInfo;
    const h5Fingerprint = window.H5guard.getfp();
    const fingerprint = await getFingerprint();
    const ua = await getUA();
    log("initExtraParams-ua", ua);
    this.extraParams = {
      deviceModel: model,
      version: version,
      deviceBrand: brand,
      uuid,
      platform: checkIsAndroid() ? 4 : 5,
      // appId: 'wxde8ac0a21135c07d',
      // expoId: openIdCipher,
      appType: 0,
      h5Fingerprint_1: h5Fingerprint,
      fingerprint,
    };
  },
  setPersonalInfo(info) {
    this.personalInfo = {
      ...this.personalInfo,
      ...info,
    };
  },
  setMpPageQuery(query) {
    this.mpPageQuery = query;
  },
  getWalletStatisticsFun() {
    getWalletStatistics().then((res) => {
      log("getWalletStatistics", res);
      this.personalInfo = {
        ...this.personalInfo,
        ...res.data,
      };
    });
  },
  resetBack(){
    KNBP.setLLButton({
      handle: () => (this.showConfirmLeave = true),
    })
  }
});

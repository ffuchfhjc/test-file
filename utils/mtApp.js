import logger from "./logger";

const log = logger("utils/app");

const fnKnbReadyWrapper = (fn, fnName) => {
  // 返回一个新的函数，接收任意参数
  return (...args) => {
    return new Promise((resolve, reject) => {
      if (!window.KNB || typeof window.KNB.ready !== "function") {
        return reject(new Error("KNB.ready 方法不可用"));
      }
      window.KNB.ready(() => {
        if (!window.KNBP) {
          window.KNBP = window.KNB.getPromiseInstance();
        }
        // 等待 fn 执行完（支持同步返回或返回 Promise）
        Promise.resolve()
          .then(() => fn(...args))
          .then((res) => {
            log(`${fnName}-consoleResult:`, res);
            return res;
          })
          .then(resolve)
          .catch((err) => {
            log(`${fnName}-consoleResult-err:`, err);
            reject(err);
          });
      });
    });
  };
};

const fnGetDeviceInfo = () => {
  return KNBP.getDeviceInfo();
};

/**
 * 获取扫描到的wifi列表
 * @returns
 */
const fnGetScanWifiList = async () => {
  const tryGetScanWifiList = async () => {
    return window.KNBP.use("meituan.pinBossWifiCommonJsHandler", {
      clazz: "BossWifiKnbInterface",
      method: "onceScanWifi",
      params: {
        timeout: 5000,
      },
    });
  };

  try {
    return await tryGetScanWifiList();
  } catch (err) {
    // 定位权限未开启
    await requestLocationPermission();
    return await tryGetScanWifiList();
  }
};

/**
 * 请求定位权限
 * @returns
 */
const requestLocationPermission = async () => {
  return await KNBP.requestPermission({
    sceneToken: "pt-146a6409787f8720",
    type: "location",
    readonly: false,
  }).catch((err) => {
    window.toast?.show?.({
      message: "请在设置中开启定位权限",
      duration: 2000,
    });
    throw new Error("请在设置中开启定位权限");
  });
};

/**
 * 获取位置
 * @returns
 */
const fnGetLocation = async () => {
  const tryGetLocation = () => {
    return window.KNBP.getLocation({
      sceneToken: 'pt-146a6409787f8720',
      type: 'GCJ02',
      timeout: 5000,
      cache: false,
    }).then((res) => {
      // if (window.isTest) {
      //   log("tryGetLocation-res", { res });
      //   log("测试环境临时修改位置为遵义");
      //   return { lat: 27.717639, lng: 106.918715 };
      // }
      return res;
    });
  };

  try {
    // 尝试获取位置
    return await tryGetLocation();
  } catch (err) {
    // 尝试开启定位权限
    await requestLocationPermission();
    // 再次尝试获取位置
    return await tryGetLocation();
  }
};

const fnOpenMapApp = () => {
  // TODO: 打开地图app
};

const fnConnectWifi = ({ ssid, password }) => {
  return window.KNBP.use("meituan.pinBossWifiCommonJsHandler", {
    clazz: "BossWifiKnbInterface",
    method: "connect",
    params: { ssid, password },
  });
};

const fnGetPageInfo = async () => {
  const deviceInfo = await fnGetDeviceInfo();
  // todo: model/brand 获取
  const {
    token,
    uuid,
    userid,
    p_appid,
    ci,
    version_name,
    shareTitle,
    shareUrl,
  } = window.searchObject;
  return {
    authInfo: {
      token,
      uuid,
      userId: userid,
      appid: p_appid,
      cityId: ci,
      sysInfo: {
        model: deviceInfo.model,
        brand: deviceInfo.manufacturer,
        version: version_name,
      },
    },
    pageQuery: {
      url: window.location.href.split("#")[0],
    },
  };
};

const fnLogin = (options = {}) => {
  return window.KNBP.login(options);
};

const fnShareToWx = ({ title, desc, image, url }) => {
  return KNBP.share({
    sceneToken: "*", // 受隐私合规中长期方案影响，如果分享的是本地图片，新增sceneToken字段，权限说明参考如下表格
    //标题
    title,
    // 分享描述
    desc,
    //只出现在分享到朋友圈，如果未提供content，则读取【title】+desc
    // content: "分享到朋友圈专属",
    //分享图标，建议分享图片尺寸 100X100~120X120, 大小不超过32K
    image,
    //分享链接，分享出去时share SDK会进行short url处理
    url,
    // 传给客户端的也是数组; 如果只提供了一个渠道，直接调起分享即可
    // 无需弹出modal窗口（单一渠道直接调起美团实现，见下方表格）
    channel: [KNB.share.WECHAT_FRIENDS, KNB.share.WECHAT_TIMELINE],
  });

  // // 美团内监听用户点击分享面板的哪个渠道
  // // 美团11.3.2xx开始支持
  // window.addEventListener("knb-share", function (data) {
  //   // const { sharedTo } = data.detail;
  //   console.log("knb-share-event", data);
  // });
};

const fnGetFingerprint = () => {
  return KNBP.getFingerprint().then((res) => {
    log("getFingerprint-res", res);
    return res.fingerprint;
  });
};

const fnGetUA = () => {
  return KNBP.getUA();
};

const fnGetUserInfo = () => {
  return KNBP.getUserInfo();
};

export const env = "app";
export const getScanWifiList = fnKnbReadyWrapper(
  fnGetScanWifiList,
  "getScanWifiList"
);
export const getLocation = fnKnbReadyWrapper(fnGetLocation, "getLocation");
export const connectWifi = fnKnbReadyWrapper(fnConnectWifi, "connectWifi");
export const getPageInfo = fnKnbReadyWrapper(fnGetPageInfo, "getPageInfo");
export const login = fnKnbReadyWrapper(fnLogin, "login");
export const shareToWx = fnKnbReadyWrapper(fnShareToWx, "shareToWx");
export const getFingerprint = fnKnbReadyWrapper(
  fnGetFingerprint,
  "getFingerprint"
);
export const getUA = fnKnbReadyWrapper(fnGetUA, "getUA");
export const getUserInfo = fnKnbReadyWrapper(fnGetUserInfo, "getUserInfo");
export const getDeviceInfo = fnKnbReadyWrapper(fnGetDeviceInfo, "getDeviceInfo");

export const generateMeituanMapUrl = function generateMeituanMapUrl(options = {}) {
  const defaultParams = {
    initTimestamp: Date.now(),
    sname: '当前位置',
    slat: '',
    slon: '',
    spoi_id: '',
    stpoi_id: '',
    dname: '',
    dlat: '',
    dlon: '',
    dpoi_id: '',
    mode: 'walking',
    dtpoi_id: '',
    mapsource: 'wifi',
    actionType: 'business_select',
    pagetype: '4',
    routetype: '0',
  }

  const queryParams = new URLSearchParams({
    ...defaultParams,
    ...options,
  }).toString()
  return `imeituan://www.meituan.com/mapchannel?${queryParams}`
}

// knb-api.js

const fnGetScanWifiList = () => {
  return window.KNBP.use("meituan.pinBossWifiCommonJsHandler", {
    clazz: "BossWifiKnbInterface",
    method: "onceScanWifi",
    params: {
      timeout: 5000,
    },
  });
};

const fnGetLocation = () => {
  return window.KNBP.getLocation();
};

const fnOpenMapApp = () => {
  // TODO: 打开地图app
};

const fnConnectWifi = ({ ssid, password }) => {
  return window.KNBP.use("meituan.pinBossWifiCommonJsHandler", {
    clazz: "BossWifiKnbInterface",
    method: "connect",
    params: {
      ssid,
      password,
    },
  });
};

const fnGetPageInfo = () => {
  return Promise.resolve(new URLSearchParams(window.location.search));
};

const fnLogin = (options = {}) => {
  return window.KNBP.login(options);
};

const fnKnbReadyWrapper = (fn) => {
  // 返回一个新的函数，接收任意参数
  return (...args) => {
    return new Promise((resolve, reject) => {
      if (!window.KNB || typeof window.KNB.ready !== "function") {
        return reject(new Error("KNB.ready 方法不可用"));
      }
      window.KNB.ready(() => {
        // 等待 fn 执行完（支持同步返回或返回 Promise）
        Promise.resolve()
          .then(() => fn(...args))
          .then(resolve)
          .catch(reject);
      });
    });
  };
};

export const env = 'app'
export const getScanWifiList = async () => fnKnbReadyWrapper(fnGetScanWifiList)();
export const getLocation = async () => fnKnbReadyWrapper(fnGetLocation)();
export const openMapApp = async () => fnKnbReadyWrapper(fnOpenMapApp)();
export const connectWifi = async ({ ssid, password }) => fnKnbReadyWrapper(fnConnectWifi)({ ssid, password });
export const getPageInfo = async () => fnKnbReadyWrapper(fnGetPageInfo)();
export const login = async (options = {}) => fnKnbReadyWrapper(fnLogin)(options);

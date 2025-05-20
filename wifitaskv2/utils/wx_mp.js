import { bridge } from '../../../utils/kk-mp-bridge-h5-sdk'
import cacheWrapper, { setCache } from './cacheWrapper'
import logger from './logger'
import { retryAsyncFunction } from './retry'
import createMpUrl from './mpUrlCreator'
const log = logger("utils");

function callMpAsync(methodName, params) {
  return new Promise((resolve, reject) => {
    bridge.callMpAsync(methodName, {
      ...params,
      success: function (res) {
        log(`${methodName}-success`, res)
        resolve(res)
      },
      fail: function (res) {
        log(`${methodName}-fail`, res)
        reject(res)
      },
    })
  })
}

function callMpCustom(methodName, params) {
  return new Promise((resolve, reject) => {
    bridge.callMpCustom(methodName, {
      ...params,
      success: function (res) {
        log(`${methodName}-success`, res)
        resolve(res)
      },
      fail: function (res) {
        log(`${methodName}-fail`, res)
        reject(res)
      },
    })
  })
}

// 存储监听事件的最新回调结果
const listenResults = new Map()
// 存储等待回调的Promise
const listenPromises = new Map()
function listenMpAsync(eventName, callback) {
  // 如果已经有监听器，直接返回结果或等待结果
  if (!listenPromises.has(eventName)) {
    // 创建新的Promise
    listenPromises.set(eventName, new Promise((resolve, reject) => {
      // 设置监听
      bridge.listenMp(eventName, (res) => {
        if(res.err) {
          log(`listenMp-${eventName}-err`, res)
          reject(res)
          return
        }
        // log(`listenMp-${eventName}`, res)
        setCache(eventName, res)
        // 保存最新结果
        log(`listenMpAsync-listenMp-${eventName}-保存最新结果`, res)
        listenResults.set(eventName, res)
        // 如果有回调函数，执行回调
        if (callback && typeof callback === 'function') {
          callback(res)
        }
        // 解决Promise
        resolve(res)
      })
    }))
  }

  // 如果已经有结果，直接返回结果
  if (listenResults.has(eventName)) {
    log(`listenMpAsync-listenResults.has-${eventName}`, listenResults.get(eventName))
    return Promise.resolve(listenResults.get(eventName))
  }

  // 否则等待结果
  return listenPromises.get(eventName)
}

// transformLat 和 transformLng 可以查找常用开源实现

function getLocation() {
  return cacheWrapper(listenMpAsync('onLocationCustom').then((res) => {
    if(!res.err) return res
    log('getLocation-res', res)
  }), {
    cacheKey: "onLocationCustom",
    cacheConfig: [{ 
      // 代表 30 秒内的缓存，可以直接用
      promiseTimeout: 0, 
      cacheExpireTime: 30*1000 
    }, { 
      // 代表如果 1 秒内没有获取到， 1 分钟内的缓存，可以使用
      promiseTimeout: 1000,
      cacheExpireTime: 60*1000
    }, { 
      // 代表如果 2 秒内没有获取到， 2 分钟内的缓存，可以使用
      promiseTimeout: 2000,
      cacheExpireTime: 2*60*1000
    }, {
      // 代表如果 5 秒内没有获取到， 5分钟内的缓存，可以使用
      promiseTimeout: 3500,
      cacheExpireTime: 3.5*60*1000
    },{
      // 代表如果 4 秒内没有获取到， 尝试重新获取
      promiseTimeout: 10000,
      defaultFunction: () => retryAsyncFunction(async () => {
        const pageInfo = await getPageInfo()
        const { pageQuery: mpPageQuery } = pageInfo
        const mpUrl = createMpUrl(
          mpPageQuery, // 小程序页面参数
          {
            // delayClosePageTime: '100',
            initWifi: '1',
            listenLocation: '1',
          }, // 小程序页面参数需要添加的参数
          {}, // web页面参数需要添加的参数
          ['isStartupPage'], // 小程序页面参数需要删除的参数
          ['isStartupPage']  // web页面参数需要删除的参数
        )
        log("defaultFunction-reLaunch:", {
          mpUrl,
          mpPageQuery,
          userAgent: window.navigator.userAgent,
          pageInfo
        })
        wx.miniProgram.reLaunch({ url: mpUrl })

        // // 尝试重新获取一次
        // return new Promise((resolve) => {
        //   bridge.callMpBatch([
        //     {
        //       apiHandler: "callMpAsync",
        //       apiName: "getLocation",
        //       apiParams: {
        //         type: "wgs84",
        //         isHighAccuracy: true,
        //         success: function (res) {
        //           resolve(res)
        //           console.log("getLocation-success", res)
        //         },
        //         fail: function (res) {
        //           console.log("getLocation-fail", res)
        //         },
        //       },
        //     },
        //     { // 顺便获取wifi列表，结果从onGetWifiList获取
        //       apiHandler: "callMpAsync",
        //       apiName: "getWifiList",
        //       apiParams: {
        //         success: res => {
        //           console.log("getWifiList-success", res)
        //         },
        //         fail: res => {
        //           console.log("getWifiList-fail", res)
        //         },
        //       },
        //     },
        //   ])
        // })
      }, {
        retryTimes: 3,
        delay: 5000,
        abortTimeout: 3000,
      })
    }]
  })
}
function callGetWifiList() {
  log('callGetWifiList-callMpAsync')
  // 调用就行，不用等结果，结果从onGetWifiList获取
  callMpAsync('getWifiList', {}).then((res) => {
    log('callGetWifiList-res', res)
  }).catch((err) => {
    log('callGetWifiList-err', err)
  })
  // 等待一秒
  return new Promise((resolve) => {
    log('callGetWifiList-setTimeout')
    setTimeout(() => {
      log('callGetWifiList-setTimeout-resolve')
      resolve()
    }, 1000)
  })
}

console.info("[tmp----------test:] - listenMpAsync('onGetWifiList')")
listenMpAsync('onGetWifiList') // 提前调用，存入缓存，不然短时间（2分钟）内，可能出现拿不到wifi列表的情况。
async function getScanWifiList(forceReGetWifiList = true) {
  log('getScanWifiList-callGetWifiList')
  // if(forceReGetWifiList) {
  //   await callGetWifiList().then((res) => {
  //     log('getScanWifiList-callGetWifiList-then', res)
  //   })
  // }
  log('getScanWifiList-cacheWrapper-listenMpAsync-onGetWifiList')
  return cacheWrapper(listenMpAsync('onGetWifiList'), { 
    cacheKey: "onGetWifiList",
    cacheConfig: [{ 
      // 代表如果 2 秒内没有获取到， 2 分钟内的缓存，可以使用
      promiseTimeout: 2000,
      cacheExpireTime: 40*1000
    }, {
      // 代表如果 10 秒内没有获取到， 10 分钟内的缓存，可以使用
      promiseTimeout: 5000,
      defaultValue: {wifiList: []} // TODO: 服务端不让传空？？，临时返回随机做默认值，代表没扫到
    }]
  })
}
function openMapApp(params) {
  return callMpAsync('openMapApp', params)
}
function connectWifi(params) {
  return callMpAsync('connectWifi', params)
}
function getPageInfo() {
  return listenMpAsync('onGetPageInfo').then((res) => {
    window.__kk_wifi_task_v2_pageInfo = res
    return res
  })
}
function login() {
  return callMpCustom('login', {})
}

export { getScanWifiList, getLocation, openMapApp, connectWifi, getPageInfo, login, cacheWrapper }

const knbProxy = {
  getPromiseInstance: () => {
    return new Proxy(
      {},
      {
        get(target, prop) {
          return () =>
            new Promise(async (resolve, reject) => {
              const hasKey = knbProxy[prop]
              if (hasKey) {
                try {
                  knbProxy[prop]({ success: resolve, fail: reject })
                } catch (error) {
                  reject(error)
                }
              } else {
                reject(new Error("Mock KNB：没有该方法:" + prop))
              }
            })
        },
      }
    )
  },
  ready: (fn) => {
    fn()
  },
  getUserInfo: ({ success = () => {}, fail = () => {} } = {}) => {
    success({
      userName: "zhangsan",
    })
  },
  setLLButton: ({ success = () => {}, fail = () => {} } = {}) => {
    success()
  },
  getDeviceInfo: ({ success = () => {}, fail = () => {} } = {}) => {
    success({
      os: "Android",
      manufacturer: "HUAWEI",
      model: "P30",
    })
  },
  requestPermission: ({ success = () => {}, fail = () => {} } = {}) => {
    success()
  },
  getLocation: ({ success = () => {}, fail = () => {} } = {}) => {
    // 遵义
    success({
      lat: 27.717639,
      lng: 106.918715,
    })
    // // 北京恒电
    // success({
    //   lat: 40.006756,
    //   lng: 116.480813,
    // })
  },
  getFingerprint: ({ success = () => {}, fail = () => {} } = {}) => {
    success({
      fingerprint: "asdkfnaisdnf[as",
    })
  },
  getUA: ({ success = () => {}, fail = () => {} } = {}) => {
    success()
  },
}

// const wrappedKnbProxy = () => {
//   const ignoreKeys = ["getPromiseInstance"]
//   const res = {}
//   for (const key in knbProxy) {
//     if (ignoreKeys.includes(key)) {
//       res[key] = knbProxy[key]
//     } else {
//       res[key] = async () => {
//         return Promise.resolve(knbProxy[key]())
//       }
//     }
//   }
//   return res
// }

export default knbProxy

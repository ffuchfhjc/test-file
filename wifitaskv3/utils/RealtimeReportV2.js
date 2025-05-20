export default class RealtimeReport {
  commonParams
  constructor(commonParams = {}) {
    this.commonParams = {
      ...commonParams,
      userId: window.searchObject?.userid,
      uuid: window.searchObject?.uuid,
    }
  }

  getCommonParams() {
    // window.searchObject 不是在最前面初始化的，并不可靠，所以需要延迟获取
    this.commonParams = {
      ...this.commonParams,
      userId: window.searchObject?.userid,
      uuid: window.searchObject?.uuid,
    }
    return this.commonParams
  }

  /**
   * 获取上报参数
   * @param {*} reportParams 上报参数
   * @returns
   */
  getParams(params = {}) {
    const arrParamsLevel1 = ["userId", "uuid", "deviceBrand"]
    const allParams = {
      ...this.getCommonParams(),
      ...params,
    }
    const level1Params = Object.fromEntries(arrParamsLevel1.map((key) => [key, allParams[key] || "-999"]))
    const qaExtraInfo = Object.fromEntries(Object.entries(allParams).filter(([key]) => !arrParamsLevel1.includes(key)))
    return {
      level1Params,
      qaExtraInfo: JSON.stringify(qaExtraInfo),
    }
  }

  /**
   * 上报数据
   * @param {*} eventType 事件类型
   * @param {*} qaExtraInfo 上报参数
   */
  async reportRealTime(eventType, params = {}) {
    console.log('reportRealTime', eventType, params)
    const { level1Params, qaExtraInfo } = this.getParams(params)
    const now = Date.now()

    // 上报数据
    const valLab = {
      reportTime: now,
      ...level1Params,
      events: [
        {
          channel: "H5_Report",
          source: "H5_Report",
          modelName: "H5_WIFI_TASK_V3",
          eventType,
          eventTime: now,
          custom: { qaExtraInfo },
        },
      ],
    }
    await fetch("/aggroup/widget/report/reportProductLink", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(valLab),
    })
  }
}

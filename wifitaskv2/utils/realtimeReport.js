export default class RealtimeReport {
  commonParams;
  constructor(commonParams = {}) {
    this.commonParams = commonParams || {};
    this.commonParams.userId = this.commonParams.userId || window.__kk_wifi_task_v2_pageInfo?.authInfo?.userId || '';
    this.commonParams.qaExtraInfo = this.commonParams.qaExtraInfo || {};
  }
  getParams(custom, qaExtraInfo = {}) {
    custom = custom && typeof custom === "object" ? custom : {};
    return {
      ...this.commonParams,
      ...custom,
      qaExtraInfo: { 
        pageInfo: window.__kk_wifi_task_v2_pageInfo,
        ...this.commonParams.qaExtraInfo, 
        ...qaExtraInfo,
      },
      
    };
  }
  async reportRealTime(eventType, custom, qaExtraInfo = {}) {
    let params = this.getParams(custom, qaExtraInfo);
    // params 中二级对象转json
    params = Object.fromEntries(
      Object.entries(params).map(([key, value]) => [
        key,
        typeof value === "object" && value !== null
          ? JSON.stringify(value)
          : value,
      ])
    );
    // params 中直接可以传的字段
    const arr = ["userId", "uuid", "deviceBrand"];
    const obj = Object.fromEntries(
      arr.map((key) => [key, params[key] || "-999"])
    );
    // 删除 params 中直接可以传的字段
    arr.forEach((key) => delete params[key]);
    // 上报数据
    const valLab = {
      reportTime: Date.now(),
      ...obj,
      events: [
        {
          channel: "H5_Report",
          source: "H5_Report",
          modelName: "H5_WIFI_TASK_V2",
          eventType: eventType,
          eventTime: Date.now(),
          custom: params,
        },
      ],
    };
    await fetch("/aggroup/widget/report/reportProductLink", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(valLab),
    });
  }
}

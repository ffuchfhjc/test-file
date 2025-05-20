import RealtimeReport from './realtimeReport'
const realtimeReport = new RealtimeReport()

let _inWhiteList = false
export const setLoggerInWhiteList = (inWhiteList) => {
  _inWhiteList = inWhiteList
}

export default (logKey) => {
  logKey = logKey || "defaultLog";
  return (...args) => {
    const logContent = [`[${logKey}]: `].concat(args).concat(new Date().toISOString());
    if (window.searchObject.showLog || _inWhiteList) {
      console.log.apply(console, logContent);
    }
    // realtimeReport.reportRealTime("Logger", {}, {
    //   logKey,
    //   logContent: args
    // })
  };
};

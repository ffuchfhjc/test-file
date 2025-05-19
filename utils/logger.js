import RealtimeReport from './RealtimeReportV2'
import checkInWhiteList from './whiteList'

const realtimeReport = new RealtimeReport()

// 日志缓冲数组
const logBuffer = []

// 定时器标记
let reportTimer = null

function report(logKey, logContent) {
  // 将日志追加进缓冲池
  logBuffer.push({ logKey, logContent })

  // 启动节流定时器（3 秒 聚合一次）
  if (!reportTimer) {
    reportTimer = setTimeout(() => {
      // 一次性上报缓冲区中所有日志
      realtimeReport.reportRealTime('Logger', {
        logs: JSON.stringify(logBuffer)
      })

      // 清空缓冲并重置定时器
      logBuffer.length = 0
      reportTimer = null
    }, 3000)
  }
}

export default function (logKey) {
  logKey = logKey || 'defaultLog'
  return function (...args) {
    // 控制台日志内容，带 timestamp
    const logContent = [
      `[${logKey}]:`,
      ...args,
      new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
    ]

    if (checkInWhiteList()) {
      console.log.apply(console, logContent)
    }

    // 上报只上传真正的 args，不包含控制台 timestamp
    report(logKey, logContent)
  }
}

/**
 * 重试指定次数的函数
 * @param asyncFunction - 返回Promise的异步函数
 * @param options - 配置选项
 * @param options.retryTimes - 重试次数
 * @param options.delay - 每次重试之间的延迟时间（毫秒）
 * @returns 返回传入函数的返回Promise
 */
export async function retryAsyncFunction(
  asyncFunction,
  options
) {
  const { retryTimes, delay, abortTimeout = 10000 } = options
  let attempts = 0

  const errors = []
  while (attempts < retryTimes) {
    try {
      const result = await Promise.race([
        asyncFunction(),
        new Promise((resolve, reject) => {
          setTimeout(() => reject(new Error('Timeout')), abortTimeout)
        })
      ])
      return result // 成功后返回结果并退出函数
      // const result = await asyncFunction()
      // return result // 成功后返回结果并退出函数
    } catch (error) {
      errors.push(`Attempt ${attempts + 1} failed:` + error.message)
      console.error(`Attempt ${attempts + 1} failed:`, error)
      attempts++
      if (attempts < retryTimes) {
        await new Promise((resolve) => setTimeout(resolve, delay)) // 休眠指定时间后再次尝试
      }
    }
  }

  throw new Error(`Failed after ${retryTimes} attempts\n` + errors.join('\n'))
}

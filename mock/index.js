import knb from "./knb"

if (import.meta.env.NODE_USE_MOCK === "1" || import.meta.env.NODE_USE_MOCK_KNB === "1") {
  // 保留原生的 KNB 引用
  const originalKNB = window.KNB || {}

  // 创建一个 Proxy，只代理 knb 中存在的 key
  const proxyKNB = new Proxy(
    {},
    {
      get(target, prop) {
        if (prop in knb) {
          const val = knb[prop]
          // 如果是函数，绑定到 knb 上执行
          return typeof val === "function" ? val.bind(knb) : val
        }
        // 否则调用原生 KNB
        return originalKNB[prop]
      },
    }
  )
  // 覆盖 window.KNB
  window.KNB = proxyKNB
}

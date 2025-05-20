export default function checkArriveMaxTimes(storageKey, times) {
  let count = 0
  try {
    const stored = localStorage.getItem(storageKey)
    count = stored ? parseInt(stored, 10) : 0
  } catch (e) {
    console.warn("读取 localStorage 失败：", e)
  }

  if (count >= times) {
    return true
  }

  try {
    localStorage.setItem(storageKey, String(count + 1))
  } catch (e) {
    console.warn("写入 localStorage 失败：", e)
  }

  return false
}

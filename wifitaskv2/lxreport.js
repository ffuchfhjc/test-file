import { store } from './store'

const sendMv = (bid, params) => {
  window.pageCase &&
    window.pageCase('moduleView', bid, {
      userid: store.personalInfo.userId,
      ...params,
    })
}
const sendMc = (bid, params) => {
  window.pageCase &&
    window.pageCase('moduleClick', bid, {
      userid: store.personalInfo.userId,
      ...params,
    })
}

export { sendMv, sendMc }

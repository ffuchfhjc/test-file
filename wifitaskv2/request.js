import { get, post } from '@/request'
import { store } from './store'

const getNearbyPackageInfoUrl = '/aggroup/widget/wifi/task/getNearbyPackageInfo'
const getTaskInfoInPackageUrl = '/aggroup/widget/wifi/task/getTaskInfoInPackage'
const getUserTasksUrl = '/aggroup/widget/wifi/task/getUserTasks'
const walletStatisticsUrl = '/aggroup/widget/wifi/wallet/bill/statistics'
const withdrawHistoryUrl = '/aggroup/widget/wifi/wallet/withdraw/query'
const createWithdrawUrl = '/aggroup/widget/wifi/wallet/withdraw/create'
const getNearbyWifiTaskUrl = '/aggroup/widget/wifi/task/getNearbyWifiTask'
const showNearbyWifiTaskUrl = '/aggroup/widget/wifi/task/showNearbyWifiTask'
const reportTaskWifiUrl = '/aggroup/widget/wifi/task/reportTaskWifi'
const shareRecordsUrl = '/aggroup/widget/wifi/share/shareRecords'
const bindShareInfoUrl = '/aggroup/widget/wifi/share/bindShareInfo'
const checkSharePermissionUrl = '/aggroup/widget/wifi/share/checkSharePermission'
const getNearbyPackageInfoForMapUrl = '/aggroup/widget/wifi/task/getNearbyPackageInfoForMap'

const setParams = (params) => {
  return {
    lat: store.location.lat || '',
    lng: store.location.lng || '',
    userId: store.personalInfo.userId || '',
    wxAppId: 'wxde8ac0a21135c07d',
    wxOpenId: store.personalInfo.wxOpenId || '',
    wxUnionId: store.personalInfo.wxUnionId || '',
    wxUserName: store.personalInfo.wxUserName || '',
    regCityId: store.personalInfo.regCityId || '',
    uuid: store.personalInfo.uuid || '',
    // mobileNum: store.personalInfo.mobileNum || '',
    extraParams: store.extraParams, // 风控所需
    ...params
  }
}

export const getNearbyPackageInfo = (params) => {
  return post(getNearbyPackageInfoUrl, setParams(params), { token: store.personalInfo.token })
}
export const getTaskInfoInPackage = (params) => {
  return post(getTaskInfoInPackageUrl, setParams(params), { token: store.personalInfo.token })
}
export const getUserTasks = (params) => {
  return post(getUserTasksUrl, setParams(params), { token: store.personalInfo.token })
}
export const getWalletStatistics = (params) => {
  return post(walletStatisticsUrl, setParams(params), { token: store.personalInfo.token })
}
export const getWithdrawHistory = (params) => {
  return post(withdrawHistoryUrl, setParams(params), { token: store.personalInfo.token })
}
export const createWithdraw = (params) => {
  return post(createWithdrawUrl, setParams(params), { token: store.personalInfo.token })
}
export const getNearbyWifiTask = (params) => {
  return post(getNearbyWifiTaskUrl, setParams(params), { token: store.personalInfo.token })
}
export const showNearbyWifiTask = () => {
  return post(showNearbyWifiTaskUrl, setParams({}), { token: store.personalInfo.token })
}
export const reportTaskWifi = (params) => {
  return post(reportTaskWifiUrl, setParams(params), { token: store.personalInfo.token })
}
export const getShareRecords = (params) => {
  return post(shareRecordsUrl, setParams(params), { token: store.personalInfo.token })
}
export const bindShareInfo = (params) => {
  return post(bindShareInfoUrl, setParams(params), { token: store.personalInfo.token })
}
export const checkSharePermission = (params) => {
  return post(checkSharePermissionUrl, setParams(params), { token: store.personalInfo.token })
}
export const getNearbyPackageInfoForMap = (params) => {
  return post(getNearbyPackageInfoForMapUrl, setParams(params), { token: store.personalInfo.token })
}
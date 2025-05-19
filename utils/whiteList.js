export default function checkInWhiteList() {
  const userid = window.searchObject.userid
  return [
    122907849, // 陈晨
    4262500947, // 李明
    188677989, // 振泽小
    567012373, // 子龙
    1007397062,//益民
  ].includes(+userid)
}

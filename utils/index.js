import { getDeviceInfo } from "./mtApp";

/**
 * 检查是否是ios
 * @returns
 */
export const checkIsAndroid = async function () {
  const deviceInfo = await getDeviceInfo().catch((err) => {
    return { os: "Android" };
  });
  return deviceInfo.os === "Android";
};

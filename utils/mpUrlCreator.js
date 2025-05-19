import logger from "./logger";

/**
 * 创建小程序页面url
 * @param {Object} mpPageQuery - 小程序页面参数
 * @param {Object} additionalMpPageParams - 小程序页面参数
 * @param {Object} additionalWebUrlParams - web页面参数
 * @param {Array} mpPageQueryShouldBeDeleted - 小程序页面参数需要删除的参数
 * @param {Array} webUrlParamsShouldBeDeleted - web页面参数需要删除的参数
 * @returns {string} - 小程序页面url
 */
export default function createMpUrl(
  mpPageQuery,
  additionalMpPageParams = {},
  additionalWebUrlParams = {},
  mpPageQueryShouldBeDeleted = [],
  webUrlParamsShouldBeDeleted = []
) {
  const log = logger("createMpUrl");
  // 构造小程序页面参数
  const newMpPageQuery = {
    ...mpPageQuery,
    ...additionalMpPageParams,
  };
  // 删除小程序页面参数
  mpPageQueryShouldBeDeleted.forEach((key) => delete newMpPageQuery[key]);
  // 构造web页面参数
  const { protocol, host, pathname } = window.location;
  const webUrl = `${protocol}//${host}${pathname}`;
  const webSearchParams = new URLSearchParams(window.location.search);
  const webParamsObj = Object.fromEntries(webSearchParams.entries());
  const newWebUrlParams = {
    ...webParamsObj,
    ...additionalWebUrlParams,
  };
  // 删除web页面参数
  webUrlParamsShouldBeDeleted.forEach((key) => delete newWebUrlParams[key]);
  const newWebUrl = `${webUrl}?${new URLSearchParams(
    newWebUrlParams
  ).toString()}`;
  newMpPageQuery["url"] = encodeURIComponent(newWebUrl);
  const url =
    "/anxinlian-task/pages/webview/index?" +
    Object.entries(newMpPageQuery)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
  log("createMpUrl:", {
    url,
    mpPageQuery,
    newMpPageQuery,
    additionalMpPageParams,
    additionalWebUrlParams,
    mpPageQueryShouldBeDeleted,
    webUrlParamsShouldBeDeleted,
  });
  return url;
}

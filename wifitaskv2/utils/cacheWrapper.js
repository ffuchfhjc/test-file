import logger from './logger'

const log = logger("cacheWrapper");

const STORAGE_KEY = "__kk_wifi_task_bridge_cache";

export function setCache(cacheKey, value) {
  const cacheData = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  cacheData[cacheKey] = {
    value,
    timestamp: Date.now(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cacheData));
}

export default function cacheWrapper(promiseInst, options) {
  const { cacheKey, cacheConfig } = options;

  function getCache() {
    const cacheData = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return cacheData[cacheKey] || null;
  }

  return new Promise((resolve) => {
    log('cacheWrapper-promiseInst-resolve', {
      cacheKey,
      cacheConfig,
    });
    
    const cache = getCache();
    const now = Date.now();

    let resolved = false;
    const arrTimeoutId = [];
    const doSetTimeout = (fn, timeout) => {
      const timeoutId = setTimeout(fn, timeout);
      arrTimeoutId.push(timeoutId);
    }

    const doResolve = (value) => {
      if (resolved) return;
      arrTimeoutId.forEach(timeoutId => clearTimeout(timeoutId));
      resolved = true;
      resolve(value);
    }

    if (cache) {
      const diffTime = now - cache.timestamp;

      for (let config of cacheConfig) {
        const expireTime = config.cacheExpireTime || 0;
        if (diffTime <= expireTime) {
          if (config.promiseTimeout === 0) {
            log(`命中缓存-${cacheKey}`, {
              config,
              cache: cache.value,
            });
            doResolve(cache.value);
          } else {
            doSetTimeout(() => {
              log(`命中缓存-setTimeout-${cacheKey}`, {
                resolved: resolved ? "已提前resolve" : "准备resolve",
                config,
                cache: cache.value,
              });
              if (!resolved) {
                doResolve(cache.value);
              }
            }, config.promiseTimeout);
          }
          break;
        }
      }
    }

    // 默认值兜底
    const { defaultFunction, defaultValue, promiseTimeout } =
      cacheConfig.find((config) => config.defaultValue !== undefined || config.defaultFunction !== undefined) || {};

    // 如果 promiseTimeout > 0，并且有默认值或默认函数，则设置超时
    log(`cacheWrapper-promiseTimeout-${cacheKey}`, {
      promiseTimeout,
      defaultValue,
      defaultFunction,
    });
    if (promiseTimeout > 0 && (defaultValue !== undefined || defaultFunction !== undefined)) {
      log(`cacheWrapper-promiseTimeout-doSetTimeout-${cacheKey}`);
      doSetTimeout(() => {
        log(`cacheWrapper-promiseTimeout-doSetTimeout-setTimeout-${cacheKey}`);
        if (!resolved) {
          log(`cacheWrapper-promiseTimeout-doSetTimeout-setTimeout-if-${cacheKey}`);
          console.info(`未命中缓存-取默认值-setTimeout-${cacheKey}`, {
            resolved,
          });
          if (defaultFunction) {
            log(`cacheWrapper-promiseTimeout-doSetTimeout-setTimeout-if-defaultFunction-${cacheKey}`);
            Promise.resolve(defaultFunction()).then(doResolve);
          }
          if (defaultValue) {
            log(`cacheWrapper-promiseTimeout-doSetTimeout-setTimeout-if-defaultValue-${cacheKey}`);
            doResolve(defaultValue);
          }
        }
      }, promiseTimeout);
    }

    // 无论是否命中缓存，都执行 Promise
    promiseInst
      .then((result) => {
        log(`cacheWrapper-promiseInst-then-result-${cacheKey}`, result);
        setCache(cacheKey, result);
        if (!resolved) {
          doResolve(result);
        }
      })
      .catch((err) => {
        if (!resolved) {
          // 兜底处理
          if (cache) {
            doResolve(cache.value);
          } else {
            doResolve(null);
          }
        }
      });
  });
}

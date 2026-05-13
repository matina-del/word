/**
 * 防抖工具函数
 * 用于防止快速重复点击等操作
 */

/**
 * 防抖函数
 * @param {Function} fn - 要防抖的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @param {boolean} immediate - 是否立即执行
 * @returns {Function} 防抖后的函数
 * 
 * @example
 * const debouncedFn = debounce(() => {
 *   console.log('执行');
 * }, 300);
 */
function debounce(fn, delay = 300, immediate = false) {
  let timer = null;
  
  return function(...args) {
    const context = this;
    
    if (immediate && !timer) {
      fn.apply(context, args);
    }
    
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (!immediate) {
        fn.apply(context, args);
      }
      timer = null;
    }, delay);
  };
}

/**
 * 节流函数
 * @param {Function} fn - 要节流的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Function} 节流后的函数
 * 
 * @example
 * const throttledFn = throttle(() => {
 *   console.log('执行');
 * }, 300);
 */
function throttle(fn, delay = 300) {
  let lastTime = 0;
  
  return function(...args) {
    const context = this;
    const now = Date.now();
    
    if (now - lastTime >= delay) {
      fn.apply(context, args);
      lastTime = now;
    }
  };
}

module.exports = {
  debounce,
  throttle
};





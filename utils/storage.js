/**
 * 本地存储封装工具类
 * 提供统一的本地存储接口，自动处理JSON序列化
 */

const Storage = {
  /**
   * 保存数据到本地存储
   * @param {string} key - 存储的键名
   * @param {*} value - 要存储的值（可以是任意类型，会自动序列化为JSON）
   * @returns {boolean} 是否保存成功
   * 
   * @example
   * Storage.setItem('user', { name: 'John', age: 20 });
   */
  setItem(key, value) {
    try {
      const jsonStr = JSON.stringify(value);
      wx.setStorageSync(key, jsonStr);
      return true;
    } catch (e) {
      console.error('存储失败:', e);
      return false;
    }
  },

  /**
   * 读取数据
   * @param {string} key - 存储的键名
   * @param {*} defaultValue - 默认值（当键不存在时返回）
   * @returns {*} 存储的值，如果不存在则返回默认值
   * 
   * @example
   * const user = Storage.getItem('user', { name: 'Guest' });
   */
  getItem(key, defaultValue = null) {
    try {
      const value = wx.getStorageSync(key);
      if (value === '' || value === undefined || value === null) {
        return defaultValue;
      }
      // 尝试解析JSON
      try {
        return JSON.parse(value);
      } catch (e) {
        // 如果不是JSON格式，直接返回原始值
        return value;
      }
    } catch (e) {
      console.error('读取失败:', e);
      return defaultValue;
    }
  },

  /**
   * 删除指定数据
   * @param {string} key - 要删除的键名
   * @returns {boolean} 是否删除成功
   * 
   * @example
   * Storage.removeItem('user');
   */
  removeItem(key) {
    try {
      wx.removeStorageSync(key);
      return true;
    } catch (e) {
      console.error('删除失败:', e);
      return false;
    }
  },

  /**
   * 清空所有数据
   * @returns {boolean} 是否清空成功
   * 
   * @example
   * Storage.clear();
   */
  clear() {
    try {
      wx.clearStorageSync();
      return true;
    } catch (e) {
      console.error('清空失败:', e);
      return false;
    }
  },

  /**
   * 兼容旧版本的get方法
   * @deprecated 推荐使用 getItem
   */
  get(key, defaultValue = null) {
    return this.getItem(key, defaultValue);
  },

  /**
   * 兼容旧版本的set方法
   * @deprecated 推荐使用 setItem
   */
  set(key, value) {
    return this.setItem(key, value);
  },

  /**
   * 兼容旧版本的remove方法
   * @deprecated 推荐使用 removeItem
   */
  remove(key) {
    return this.removeItem(key);
  }
};

module.exports = Storage;

/**
 * 网络工具类
 * 提供网络状态检测、错误处理等功能
 */

const Network = {
  /**
   * 检测网络状态
   * @returns {Promise<Object>} 网络状态对象
   * 
   * @example
   * Network.checkNetwork().then(status => {
   *   if (!status.isConnected) {
   *     wx.showToast({ title: '网络未连接' });
   *   }
   * });
   */
  checkNetwork() {
    return new Promise((resolve, reject) => {
      wx.getNetworkType({
        success: (res) => {
          resolve({
            isConnected: res.networkType !== 'none',
            networkType: res.networkType
          });
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  },

  /**
   * 监听网络状态变化
   * @param {Function} callback - 回调函数
   * @returns {Function} 取消监听的函数
   * 
   * @example
   * const unsubscribe = Network.onNetworkChange((status) => {
   *   console.log('网络状态:', status);
   * });
   */
  onNetworkChange(callback) {
    wx.onNetworkStatusChange((res) => {
      callback({
        isConnected: res.isConnected,
        networkType: res.networkType
      });
    });

    return () => {
      // 小程序没有取消监听的API，这里返回空函数
    };
  },

  /**
   * 带重试的网络请求
   * @param {Object} options - 请求选项
   * @param {number} maxRetries - 最大重试次数
   * @returns {Promise} 请求结果
   * 
   * @example
   * Network.requestWithRetry({
   *   url: 'https://example.com/api',
   *   method: 'GET'
   * }, 3).then(res => {
   *   console.log(res);
   * });
   */
  async requestWithRetry(options, maxRetries = 3) {
    let lastError = null;

    for (let i = 0; i < maxRetries; i++) {
      try {
        // 检查网络状态
        const networkStatus = await this.checkNetwork();
        if (!networkStatus.isConnected) {
          throw new Error('网络未连接');
        }

        // 发起请求
        const result = await new Promise((resolve, reject) => {
          wx.request({
            ...options,
            success: resolve,
            fail: reject
          });
        });

        return result;
      } catch (error) {
        lastError = error;
        
        // 如果不是最后一次重试，等待后重试
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
      }
    }

    throw lastError;
  },

  /**
   * 显示网络错误提示
   * @param {string} message - 错误消息
   */
  showNetworkError(message = '网络连接失败，请检查网络设置') {
    wx.showModal({
      title: '网络错误',
      content: message,
      showCancel: false,
      confirmText: '知道了'
    });
  }
};

module.exports = Network;





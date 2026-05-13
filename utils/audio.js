/**
 * 音频播放封装工具类
 * 提供单词发音播放功能，使用有道词典API
 */

let audioContext = null;
let isPlaying = false;
let retryCount = 0;
const MAX_RETRY = 2;

/**
 * 获取音频上下文实例
 * @returns {InnerAudioContext} 音频上下文对象
 */
function getContext() {
  if (!audioContext) {
    audioContext = wx.createInnerAudioContext();
    audioContext.obeyMuteSwitch = false;
    
    // 监听播放结束
    audioContext.onEnded(() => {
      isPlaying = false;
      retryCount = 0;
    });
    
    // 监听播放错误
    audioContext.onError((err) => {
      isPlaying = false;
      retryCount = 0;
      // 把这行注释掉或删掉
      // console.warn('音频播放失败（可能需要在微信公众平台配置合法域名）:', err.errMsg || err);
    });
  }
  return audioContext;
}

const Audio = {
  /**
   * 播放单词发音
   * @param {string} word - 要播放的单词
   * @returns {boolean} 是否开始播放
   * 
   * @example
   * Audio.playWord('hello');
   */
  playWord(word) {
    if (!word || typeof word !== 'string') {
      console.error('播放失败: 单词参数无效');
      return false;
    }

    try {
      const ctx = getContext();
      
      // 如果正在播放，先停止
      if (isPlaying) {
        this.stop();
      }
      
      // 构建音频URL
     // 改用有道词典另一个语音接口，更稳定
const url = `https://dict.youdao.com/speech?audio=${encodeURIComponent(word)}&le=eng`
      ctx.src = url;
      ctx.play();
      isPlaying = true;
      retryCount = 0;
      
      return true;
    } catch (e) {
      console.error('播放失败:', e);
      wx.showToast({
        title: '播放失败',
        icon: 'none'
      });
      return false;
    }
  },

  /**
   * 播放指定URL的音频
   * @param {string} url - 音频URL
   * @returns {boolean} 是否开始播放
   * 
   * @example
   * Audio.playUrl('https://example.com/audio.mp3');
   */
  playUrl(url) {
    if (!url || typeof url !== 'string') {
      console.error('播放失败: URL参数无效');
      return false;
    }

    try {
      const ctx = getContext();
      
      // 如果正在播放，先停止
      if (isPlaying) {
        this.stop();
      }
      
      ctx.src = url;
      ctx.play();
      isPlaying = true;
      retryCount = 0;
      
      return true;
    } catch (e) {
      console.error('播放失败:', e);
      wx.showToast({
        title: '播放失败',
        icon: 'none'
      });
      return false;
    }
  },

  /**
   * 停止播放
   * 
   * @example
   * Audio.stop();
   */
  stop() {
    try {
      if (audioContext) {
        audioContext.stop();
        isPlaying = false;
        retryCount = 0;
      }
    } catch (e) {
      console.error('停止播放失败:', e);
    }
  },

  /**
   * 暂停播放
   * 
   * @example
   * Audio.pause();
   */
  pause() {
    try {
      if (audioContext && isPlaying) {
        audioContext.pause();
        isPlaying = false;
      }
    } catch (e) {
      console.error('暂停播放失败:', e);
    }
  },

  /**
   * 获取播放状态
   * @returns {boolean} 是否正在播放
   * 
   * @example
   * if (Audio.isPlaying()) {
   *   Audio.stop();
   * }
   */
  isPlaying() {
    return isPlaying;
  },

  /**
   * 销毁音频上下文
   * 在页面卸载时调用，释放资源
   * 
   * @example
   * onUnload() {
   *   Audio.destroy();
   * }
   */
  destroy() {
    try {
      if (audioContext) {
        audioContext.stop();
        audioContext.destroy();
        audioContext = null;
        isPlaying = false;
        retryCount = 0;
      }
    } catch (e) {
      console.error('销毁音频上下文失败:', e);
    }
  }
};

module.exports = Audio;

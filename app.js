App({
  globalData: {
    selectedWordset: 'cet4',
    dailyGoal: 50
  },
  onLaunch() {
    // 可做初始化，如读取缓存配置
    try {
      const conf = wx.getStorageSync('app_config');
      if (conf) {
        this.globalData.selectedWordset = conf.selectedWordset || 'cet4';
        this.globalData.dailyGoal = conf.dailyGoal || 50;
      }
    } catch (e) {}
  }
});


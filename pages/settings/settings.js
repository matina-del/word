const Storage = require('../../utils/storage.js');

Page({
  data: {
    settings: {
      level: 'CET4',
      dailyGoal: 50,
      autoPlayAudio: true,
      reminderEnabled: false,
      reminderTime: '20:00'
    }
  },
  onLoad() {
    this.loadSettings();
  },
  loadSettings() {
    let settings = Storage.get('app_settings');
    if (!settings) {
      // 默认设置
      settings = {
        level: 'CET4',
        dailyGoal: 50,
        autoPlayAudio: true,
        reminderEnabled: false,
        reminderTime: '20:00'
      };
      // 兼容旧数据
      const app = getApp();
      if (app && app.globalData) {
        if (app.globalData.selectedWordset) {
          settings.level = app.globalData.selectedWordset.toUpperCase() === 'CET6' ? 'CET6' : 'CET4';
        }
        if (app.globalData.dailyGoal) {
          settings.dailyGoal = app.globalData.dailyGoal;
        }
      }
      Storage.set('app_settings', settings);
    }
    this.setData({ settings });
    // 同步到 globalData
    const app = getApp();
    if (app && app.globalData) {
      app.globalData.selectedWordset = settings.level.toLowerCase();
      app.globalData.dailyGoal = settings.dailyGoal;
      app.globalData.autoPlayAudio = settings.autoPlayAudio;
    }
  },
  switchLevel(e) {
    const level = e.currentTarget.dataset.level;
    if (level === this.data.settings.level) return;
    
    wx.showModal({
      title: '切换词库',
      content: '切换词库将重置学习进度，是否继续？',
      success: (res) => {
        if (res.confirm) {
          const settings = { ...this.data.settings, level };
          this.setData({ settings });
          Storage.set('app_settings', settings);
          
          // 清空学习记录
          const user = Storage.get('user_data') || {};
          user.learnedWords = [];
          user.wordbookWords = [];
          user.todayLearned = 0;
          user.checkInDates = [];
          Storage.set('user_data', user);
          
          // 清空每日记录
          Storage.remove('checkIn_records');
          
          // 更新 globalData
          const app = getApp();
          if (app && app.globalData) {
            app.globalData.selectedWordset = level.toLowerCase();
          }
          
          wx.showToast({ title: '词库已切换', icon: 'success' });
        }
      }
    });
  },
  onGoalChanging(e) {
    // 实时更新显示
    const value = Number(e.detail.value);
    this.setData({ 'settings.dailyGoal': value });
  },
  onGoalChange(e) {
    const value = Number(e.detail.value);
    const settings = { ...this.data.settings, dailyGoal: value };
    this.setData({ settings });
    Storage.set('app_settings', settings);
    
    // 更新 globalData
    const app = getApp();
    if (app && app.globalData) {
      app.globalData.dailyGoal = value;
    }
    
    wx.showToast({ title: `每日目标已更新为 ${value} 个单词`, icon: 'success' });
  },
  onAutoPlayChange(e) {
    const value = e.detail.value;
    const settings = { ...this.data.settings, autoPlayAudio: value };
    this.setData({ settings });
    Storage.set('app_settings', settings);
    
    // 更新 globalData
    const app = getApp();
    if (app && app.globalData) {
      app.globalData.autoPlayAudio = value;
    }
  },
  onReminderSwitch(e) {
    const value = e.detail.value;
    const settings = { ...this.data.settings, reminderEnabled: value };
    this.setData({ settings });
    Storage.set('app_settings', settings);
    
    if (value) {
      // 请求订阅消息权限
      wx.requestSubscribeMessage({
        tmplIds: [], // 如果有模板ID，填入
        success: (res) => {
          console.log('订阅消息结果', res);
        },
        fail: (err) => {
          console.log('订阅消息失败', err);
        }
      });
    }
  },
  onReminderTimeChange(e) {
    const time = e.detail.value;
    const settings = { ...this.data.settings, reminderTime: time };
    this.setData({ settings });
    Storage.set('app_settings', settings);
    
    // 这里可以设置本地通知
    // 注意：微信小程序需要服务端配合，这里仅保存设置
    wx.showToast({ title: '提醒时间已设置', icon: 'success' });
  },
  exportData() {
    try {
      const user = Storage.get('user_data') || {};
      const settings = Storage.get('app_settings') || {};
      const checkInRecords = Storage.get('checkIn_records') || [];
      
      const exportData = {
        exportTime: new Date().toISOString(),
        user: {
          level: user.level,
          learnedWords: user.learnedWords || [],
          wordbookWords: user.wordbookWords || [],
          todayLearned: user.todayLearned || 0,
          totalDays: user.totalDays || 0,
          continuousDays: user.continuousDays || 0
        },
        settings: settings,
        checkInRecords: checkInRecords
      };
      
      const jsonStr = JSON.stringify(exportData, null, 2);
      const fileName = `vocab_data_${new Date().toISOString().slice(0,10)}.json`;
      
      // 保存到本地文件
      const fs = wx.getFileSystemManager();
      const filePath = `${wx.env.USER_DATA_PATH}/${fileName}`;
      
      fs.writeFileSync(filePath, jsonStr, 'utf8');
      
      // 分享文件
      wx.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage', 'shareTimeline']
      });
      
      wx.showToast({ 
        title: '数据已导出', 
        icon: 'success',
        duration: 2000
      });
      
      // 提示用户文件路径
      wx.showModal({
        title: '导出成功',
        content: `文件已保存：${fileName}\n可通过分享功能发送文件`,
        showCancel: false
      });
    } catch (e) {
      wx.showToast({ title: '导出失败', icon: 'error' });
      console.error('导出失败', e);
    }
  },
  clearData() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有学习记录吗？此操作不可恢复！',
      confirmText: '确认清空',
      confirmColor: '#f87171',
      success: (res) => {
        if (res.confirm) {
          // 保留设置
          const settings = Storage.get('app_settings') || this.data.settings;
          
          // 清空所有学习数据
          Storage.remove('user_data');
          Storage.remove('checkIn_records');
          Storage.remove('review_queue');
          
          // 重新初始化用户数据
          const user = {
            level: settings.level || 'CET4',
            dailyGoal: settings.dailyGoal || 50,
            todayLearned: 0,
            totalDays: 0,
            continuousDays: 0,
            learnedWords: [],
            wordbookWords: [],
            lastCheckInDate: ''
          };
          Storage.set('user_data', user);
          
          // 更新 globalData
          const app = getApp();
          if (app && app.globalData) {
            app.globalData.selectedWordset = settings.level.toLowerCase();
            app.globalData.dailyGoal = settings.dailyGoal;
          }
          
          wx.showToast({ title: '学习记录已清空', icon: 'success' });
          
          // 返回首页
          setTimeout(() => {
            wx.switchTab({ url: '/pages/index/index' });
          }, 1500);
        }
      }
    });
  }
});

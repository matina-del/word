const Storage = require('../../utils/storage.js');
const { formatDate } = require('../../utils/date.js');

Page({
  data: {
    loading: true,
    greeting: '',
    levelText: '四级',
    user: {
      level: 'CET4',
      dailyGoal: 50,
      todayLearned: 0,
      totalDays: 0,
      continuousDays: 0,
      learnedWords: [],
      wordbookWords: [],
      lastCheckInDate: ''
    },
    learnedCount: 0,
    wordbookCount: 0,
    masteryRate: 0
  },
  onLoad() {
    this.loadData();
  },
  async loadData() {
    wx.showLoading({ title: '加载中...', mask: true });
    try {
      await this.ensureUserData();
      this.updateGreetingAndLevel();
      this.computeDerived();
    } catch (error) {
      console.error('加载失败:', error);
      wx.showToast({ title: '加载失败', icon: 'none' });
    } finally {
      wx.hideLoading();
      this.setData({ loading: false });
    }
  },
  onShow() {
    // 返回首页时刷新数据（例如其他页面变更了 todayLearned 或生词本）
    this.ensureUserData(false);
    this.updateGreetingAndLevel();
    this.computeDerived();
  },
  ensureUserData(checkIn = true) {
    const today = formatDate(new Date());
    let data = Storage.get('user_data');
    if (!data) {
      data = {
        level: 'CET4',
        dailyGoal: 50,
        todayLearned: 0,
        totalDays: 0,
        continuousDays: 0,
        learnedWords: [],
        wordbookWords: [],
        lastCheckInDate: ''
      };
    }

    // 首次打开当天：打卡逻辑
    if (checkIn) {
      if (data.lastCheckInDate !== today) {
        // 判断是否是昨天
        const d = new Date();
        d.setDate(d.getDate() - 1);
        const yesterday = formatDate(d);
        data.continuousDays = data.lastCheckInDate === yesterday ? (data.continuousDays + 1) : 1;
        data.totalDays = (data.totalDays || 0) + 1;
        data.lastCheckInDate = today;
        Storage.set('user_data', data);
      }
    }

    // 同步全局每日目标（可从设置页修改）
    const app = getApp();
    if (app && app.globalData) {
      data.dailyGoal = app.globalData.dailyGoal || data.dailyGoal || 50;
      if (app.globalData.selectedWordset) {
        data.level = app.globalData.selectedWordset.toUpperCase() === 'CET6' ? 'CET6' : 'CET4';
      }
    }
    this.setData({ user: data });
  },
  updateGreetingAndLevel() {
    const hour = new Date().getHours();
    let greeting = '';
    if (hour >= 6 && hour < 12) greeting = '早上好';
    else if (hour >= 12 && hour < 18) greeting = '下午好';
    else greeting = '晚上好';
    const levelText = this.data.user.level === 'CET6' ? '六级' : '四级';
    this.setData({ greeting, levelText });
  },
  computeDerived() {
    const totals = { CET4: 4500, CET6: 2800 };
    const { user } = this.data;
    const totalWords = totals[user.level] || 4500;
    const learnedCount = (user.learnedWords || []).length;
    const wordbookCount = (user.wordbookWords || []).length;
    const mastery = totalWords > 0 ? Math.round((learnedCount / totalWords) * 100) : 0;
    this.setData({
      learnedCount,
      wordbookCount,
      masteryRate: mastery
    });
  },
  goLearn() {
    wx.navigateTo({ url: '/pages/learn/learn' });
  },
  goTest() {
    wx.navigateTo({ url: '/pages/test/test' });
  }
});



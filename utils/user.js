/**
 * 用户数据管理工具类
 * 提供用户数据的初始化、更新、打卡等功能
 */

const Storage = require('./storage.js');
const DateUtil = require('./date.js');

const UserData = {
  /**
   * 初始化用户数据（第一次使用时）
   * @param {string} level - 词库级别：'CET4' 或 'CET6'
   * @param {number} dailyGoal - 每日学习目标
   * @returns {Object} 初始化后的用户数据对象
   * 
   * @example
   * const userData = UserData.initUserData('CET4', 50);
   */
  initUserData(level = 'CET4', dailyGoal = 50) {
    const defaultData = {
      level: level,
      dailyGoal: dailyGoal,
      todayLearned: 0,
      totalDays: 0,
      continuousDays: 0,
      learnedWords: [], // 已学单词ID数组
      wordbookWords: [], // 生词本单词ID数组（可能是对象数组）
      checkInDates: [], // 打卡日期数组
      lastCheckInDate: '', // 最后打卡日期
      checkInRecords: [] // 每日学习记录 [{ date: '2025-11-05', count: 30 }]
    };

    Storage.setItem('user_data', defaultData);
    return defaultData;
  },

  /**
   * 获取用户数据
   * @returns {Object} 用户数据对象
   * 
   * @example
   * const user = UserData.getUserData();
   */
  getUserData() {
    let userData = Storage.getItem('user_data');
    
    // 如果不存在，初始化默认数据
    if (!userData) {
      const app = getApp();
      const level = (app && app.globalData && app.globalData.selectedWordset) 
        ? app.globalData.selectedWordset.toUpperCase() 
        : 'CET4';
      const dailyGoal = (app && app.globalData && app.globalData.dailyGoal) || 50;
      userData = this.initUserData(level, dailyGoal);
    }

    // 确保所有字段存在
    if (!Array.isArray(userData.learnedWords)) {
      userData.learnedWords = [];
    }
    if (!Array.isArray(userData.wordbookWords)) {
      userData.wordbookWords = [];
    }
    if (!Array.isArray(userData.checkInDates)) {
      userData.checkInDates = [];
    }
    if (!Array.isArray(userData.checkInRecords)) {
      userData.checkInRecords = [];
    }

    return userData;
  },

  /**
   * 更新用户数据
   * @param {Object} data - 要更新的数据对象（部分更新）
   * @returns {boolean} 是否更新成功
   * 
   * @example
   * UserData.updateUserData({ todayLearned: 10, dailyGoal: 60 });
   */
  updateUserData(data) {
    if (!data || typeof data !== 'object') {
      console.error('更新失败: 数据格式错误');
      return false;
    }

    const userData = this.getUserData();
    const updatedData = { ...userData, ...data };
    
    // 同步到 globalData
    const app = getApp();
    if (app && app.globalData) {
      if (updatedData.level) {
        app.globalData.selectedWordset = updatedData.level.toLowerCase();
      }
      if (updatedData.dailyGoal !== undefined) {
        app.globalData.dailyGoal = updatedData.dailyGoal;
      }
    }

    return Storage.setItem('user_data', updatedData);
  },

  /**
   * 每日打卡
   * @returns {Object} 打卡结果 { success: boolean, continuousDays: number, totalDays: number }
   * 
   * @example
   * const result = UserData.checkIn();
   * if (result.success) {
   *   console.log(`连续打卡 ${result.continuousDays} 天`);
   * }
   */
  checkIn() {
    const userData = this.getUserData();
    const today = DateUtil.formatDate(new Date());
    
    // 如果今天已经打卡，直接返回
    if (userData.lastCheckInDate === today) {
      return {
        success: true,
        continuousDays: userData.continuousDays,
        totalDays: userData.totalDays,
        alreadyChecked: true
      };
    }

    // 判断是否连续
    const yesterday = DateUtil.getDaysAgo(1);
    let continuousDays = 1;
    if (userData.lastCheckInDate === yesterday) {
      // 连续打卡
      continuousDays = (userData.continuousDays || 0) + 1;
    }

    // 更新打卡日期
    const checkInDates = [...(userData.checkInDates || [])];
    if (!checkInDates.includes(today)) {
      checkInDates.push(today);
    }

    // 更新数据
    const updated = {
      ...userData,
      lastCheckInDate: today,
      checkInDates: checkInDates,
      continuousDays: continuousDays,
      totalDays: checkInDates.length
    };

    Storage.setItem('user_data', updated);

    return {
      success: true,
      continuousDays: continuousDays,
      totalDays: updated.totalDays,
      alreadyChecked: false
    };
  },

  /**
   * 添加已学单词
   * @param {number} wordId - 单词ID
   * @returns {boolean} 是否添加成功
   * 
   * @example
   * UserData.addLearnedWord(123);
   */
  addLearnedWord(wordId) {
    if (!wordId) {
      return false;
    }

    const userData = this.getUserData();
    const learnedWords = [...(userData.learnedWords || [])];
    
    // 如果已存在，不重复添加
    if (!learnedWords.includes(wordId)) {
      learnedWords.push(wordId);
      
      // 更新今日已学数量
      const today = DateUtil.formatDate(new Date());
      const lastCheckIn = userData.lastCheckInDate || '';
      let todayLearned = userData.todayLearned || 0;
      
      if (lastCheckIn === today) {
        todayLearned++;
      } else {
        // 新的一天，重置今日已学
        todayLearned = 1;
      }

      // 更新学习记录
      this.updateTodayRecord(today, todayLearned);

      this.updateUserData({
        learnedWords: learnedWords,
        todayLearned: todayLearned,
        lastCheckInDate: today
      });
    }

    return true;
  },

  /**
   * 添加生词到生词本
   * @param {number} wordId - 单词ID
   * @returns {boolean} 是否添加成功
   * 
   * @example
   * UserData.addWordbookWord(123);
   */
  addWordbookWord(wordId) {
    if (!wordId) {
      return false;
    }

    const userData = this.getUserData();
    let wordbookWords = [...(userData.wordbookWords || [])];
    
    // 检查是否已存在
    const exists = wordbookWords.some(item => {
      if (typeof item === 'number') {
        return item === wordId;
      } else if (typeof item === 'object' && item.wordId) {
        return item.wordId === wordId;
      }
      return false;
    });

    if (!exists) {
      // 添加新的生词记录
      const today = DateUtil.formatDate(new Date());
      const newItem = {
        wordId: wordId,
        addTime: today,
        reviewCount: 0,
        lastReviewTime: '',
        status: 'unreviewed'
      };
      wordbookWords.push(newItem);

      this.updateUserData({
        wordbookWords: wordbookWords
      });
    }

    return true;
  },

  /**
   * 从生词本移除单词
   * @param {number} wordId - 单词ID
   * @returns {boolean} 是否移除成功
   * 
   * @example
   * UserData.removeWordbookWord(123);
   */
  removeWordbookWord(wordId) {
    if (!wordId) {
      return false;
    }

    const userData = this.getUserData();
    let wordbookWords = [...(userData.wordbookWords || [])];
    
    // 过滤掉指定的单词
    wordbookWords = wordbookWords.filter(item => {
      if (typeof item === 'number') {
        return item !== wordId;
      } else if (typeof item === 'object' && item.wordId) {
        return item.wordId !== wordId;
      }
      return true;
    });

    this.updateUserData({
      wordbookWords: wordbookWords
    });

    return true;
  },

  /**
   * 更新今日学习记录
   * @param {string} date - 日期字符串（格式：YYYY-MM-DD）
   * @param {number} count - 今日学习的单词数量
   * @returns {boolean} 是否更新成功
   */
  updateTodayRecord(date, count) {
    let records = Storage.getItem('checkIn_records', []);
    
    if (!Array.isArray(records)) {
      records = [];
    }

    // 查找或创建当天的记录
    const index = records.findIndex(r => r.date === date);
    if (index >= 0) {
      records[index].count = count;
    } else {
      records.push({ date: date, count: count });
    }

    // 按日期排序
    records.sort((a, b) => a.date.localeCompare(b.date));

    return Storage.setItem('checkIn_records', records);
  },

  /**
   * 获取今日学习记录
   * @returns {Object} 今日学习记录 { date: string, count: number }
   * 
   * @example
   * const record = UserData.getTodayRecord();
   * console.log(`今日已学 ${record.count} 个单词`);
   */
  getTodayRecord() {
    const today = DateUtil.formatDate(new Date());
    const records = Storage.getItem('checkIn_records', []);
    const record = records.find(r => r.date === today);
    
    return record || { date: today, count: 0 };
  },

  /**
   * 获取指定日期的学习记录
   * @param {string} date - 日期字符串（格式：YYYY-MM-DD）
   * @returns {Object} 学习记录 { date: string, count: number } 或 null
   */
  getRecordByDate(date) {
    if (!date) {
      return null;
    }

    const records = Storage.getItem('checkIn_records', []);
    return records.find(r => r.date === date) || null;
  },

  /**
   * 重置今日学习数量
   * @returns {boolean} 是否重置成功
   */
  resetTodayLearned() {
    const today = DateUtil.formatDate(new Date());
    const userData = this.getUserData();
    
    // 如果最后打卡日期不是今天，重置今日已学
    if (userData.lastCheckInDate !== today) {
      this.updateUserData({
        todayLearned: 0,
        lastCheckInDate: today
      });
      return true;
    }
    
    return false;
  },

  /**
   * 清空所有学习数据（保留设置）
   * @returns {boolean} 是否清空成功
   * 
   * @example
   * UserData.clearAllData();
   */
  clearAllData() {
    const settings = Storage.getItem('app_settings');
    
    // 初始化用户数据
    const level = settings ? (settings.level || 'CET4') : 'CET4';
    const dailyGoal = settings ? (settings.dailyGoal || 50) : 50;
    this.initUserData(level, dailyGoal);
    
    // 清空学习记录
    Storage.removeItem('checkIn_records');
    Storage.removeItem('review_queue');
    
    return true;
  },

  /**
   * 获取学习统计信息
   * @returns {Object} 统计信息对象
   * 
   * @example
   * const stats = UserData.getStats();
   * console.log(`已学 ${stats.learnedCount} 个单词`);
   */
  getStats() {
    const userData = this.getUserData();
    
    return {
      learnedCount: (userData.learnedWords || []).length,
      wordbookCount: (userData.wordbookWords || []).length,
      totalDays: userData.totalDays || 0,
      continuousDays: userData.continuousDays || 0,
      todayLearned: userData.todayLearned || 0,
      dailyGoal: userData.dailyGoal || 50
    };
  }
};

module.exports = UserData;





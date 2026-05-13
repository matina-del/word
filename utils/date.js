/**
 * 日期工具函数
 * 提供日期格式化、计算、判断等功能
 */

const DateUtil = {
  /**
   * 格式化日期
   * @param {Date|string} date - 日期对象或日期字符串
   * @param {string} format - 格式化模板，默认 'YYYY-MM-DD'
   * @param {string} sep - 分隔符，默认 '-'
   * @returns {string} 格式化后的日期字符串
   * 
   * @example
   * DateUtil.formatDate(new Date()); // '2025-11-05'
   * DateUtil.formatDate(new Date(), 'YYYY/MM/DD', '/'); // '2025/11/05'
   */
  formatDate(date = new Date(), format = 'YYYY-MM-DD', sep = '-') {
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) {
      console.error('无效的日期:', date);
      return '';
    }

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hour = String(d.getHours()).padStart(2, '0');
    const minute = String(d.getMinutes()).padStart(2, '0');
    const second = String(d.getSeconds()).padStart(2, '0');

    return format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hour)
      .replace('mm', minute)
      .replace('ss', second);
  },

  /**
   * 判断是否是今天
   * @param {string} dateString - 日期字符串（格式：YYYY-MM-DD）
   * @returns {boolean} 是否是今天
   * 
   * @example
   * DateUtil.isToday('2025-11-05'); // 如果今天是2025-11-05则返回true
   */
  isToday(dateString) {
    if (!dateString) return false;
    const today = this.formatDate(new Date());
    return dateString === today;
  },

  /**
   * 判断是否是昨天
   * @param {string} dateString - 日期字符串（格式：YYYY-MM-DD）
   * @returns {boolean} 是否是昨天
   * 
   * @example
   * DateUtil.isYesterday('2025-11-04'); // 如果今天是2025-11-05则返回true
   */
  isYesterday(dateString) {
    if (!dateString) return false;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return dateString === this.formatDate(yesterday);
  },

  /**
   * 获取N天前的日期
   * @param {number} days - 天数（正数表示过去，负数表示未来）
   * @returns {string} 日期字符串（格式：YYYY-MM-DD）
   * 
   * @example
   * DateUtil.getDaysAgo(7); // 7天前的日期
   * DateUtil.getDaysAgo(-3); // 3天后的日期
   */
  getDaysAgo(days) {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return this.formatDate(date);
  },

  /**
   * 获取相对时间（例如：2天前、3周前）
   * @param {string} dateString - 日期字符串（格式：YYYY-MM-DD）
   * @returns {string} 相对时间描述
   * 
   * @example
   * DateUtil.getRelativeTime('2025-11-03'); // '2天前'
   * DateUtil.getRelativeTime('2025-10-15'); // '3周前'
   */
  getRelativeTime(dateString) {
    if (!dateString) return '';
    
    if (this.isToday(dateString)) {
      return '今天';
    }
    
    if (this.isYesterday(dateString)) {
      return '昨天';
    }

    const now = new Date();
    const past = new Date(dateString);
    const diffTime = now - past;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return '未来';
    }

    if (diffDays < 7) {
      return `${diffDays}天前`;
    }

    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks}周前`;
    }

    if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months}个月前`;
    }

    const years = Math.floor(diffDays / 365);
    return `${years}年前`;
  },

  /**
   * 获取最近N天的日期数组
   * @param {number} days - 天数，默认7
   * @returns {Array<string>} 日期字符串数组（格式：YYYY-MM-DD）
   * 
   * @example
   * DateUtil.getLast7Days(); // ['2025-10-29', '2025-10-30', ..., '2025-11-05']
   * DateUtil.getLast7Days(14); // 最近14天
   */
  getLast7Days(days = 7) {
    const dates = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(this.formatDate(date));
    }
    return dates;
  },

  /**
   * 计算连续天数
   * @param {Array<string>} dates - 日期字符串数组（格式：YYYY-MM-DD）
   * @returns {number} 连续天数
   * 
   * @example
   * DateUtil.calculateContinuousDays(['2025-11-05', '2025-11-04', '2025-11-03']); // 3
   */
  calculateContinuousDays(dates) {
    if (!Array.isArray(dates) || dates.length === 0) {
      return 0;
    }

    // 去重并排序（降序）
    const sortedDates = [...new Set(dates)].sort((a, b) => {
      return new Date(b) - new Date(a);
    });

    if (sortedDates.length === 0) return 0;

    // 检查是否从今天开始连续
    const today = this.formatDate(new Date());
    if (sortedDates[0] !== today && sortedDates[0] !== this.getDaysAgo(1)) {
      // 如果不是今天或昨天，从最近的日期开始计算
      return 1;
    }

    let continuous = 1;
    for (let i = 0; i < sortedDates.length - 1; i++) {
      const current = new Date(sortedDates[i]);
      const next = new Date(sortedDates[i + 1]);
      const diffDays = (current - next) / (1000 * 60 * 60 * 24);
      
      if (diffDays === 1) {
        continuous++;
      } else {
        break;
      }
    }

    return continuous;
  },

  /**
   * 计算连续打卡天数（从今天往前计算）
   * @param {Array<string>} dates - 日期字符串数组（格式：YYYY-MM-DD）
   * @returns {number} 连续打卡天数
   * 
   * @example
   * DateUtil.calcStreak(['2025-11-05', '2025-11-04', '2025-11-03']); // 3
   */
  calcStreak(dates) {
    if (!Array.isArray(dates) || dates.length === 0) return 0;
    
    const set = new Set(dates);
    let streak = 0;
    let dt = new Date();
    
    while (true) {
      const key = this.formatDate(dt);
      if (set.has(key)) {
        streak += 1;
        dt.setDate(dt.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  },

  /**
   * 判断两个日期是否相邻（相差1天）
   * @param {string} date1 - 日期字符串1
   * @param {string} date2 - 日期字符串2
   * @returns {boolean} 是否相邻
   * 
   * @example
   * DateUtil.isAdjacent('2025-11-05', '2025-11-04'); // true
   */
  isAdjacent(date1, date2) {
    if (!date1 || !date2) return false;
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffDays = Math.abs((d1 - d2) / (1000 * 60 * 60 * 24));
    return diffDays === 1;
  }
};

module.exports = DateUtil;

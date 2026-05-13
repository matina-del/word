const Storage = require('../../utils/storage.js');

// 工具函数
function calculateStudyDays(checkInDates) {
  return (checkInDates || []).length;
}
function calculateContinuousDays(checkInDates) {
  const arr = (checkInDates || []).slice().sort((a,b) => new Date(b) - new Date(a));
  if (!arr.length) return 0;
  let continuous = 1;
  for (let i = 0; i < arr.length - 1; i++) {
    const diff = (new Date(arr[i]) - new Date(arr[i + 1])) / (1000 * 60 * 60 * 24);
    if (diff === 1) continuous++; else break;
  }
  return continuous;
}
function calculateMasteryRate(learnedWords, totalWords) {
  if (!totalWords) return 0;
  const len = (learnedWords || []).length;
  return Math.round((len / totalWords) * 100);
}
function getLast7Days() {
  const dates = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}
function getDailyWordCount(checkInRecords, last7Days) {
  return last7Days.map(date => {
    const r = (checkInRecords || []).find(x => x.date === date);
    return r ? (r.count || 0) : 0;
  });
}
function checkAchievements(stats) {
  return [
    { id: 1, name: '初学者', desc: '学习1天', icon: '🌱', unlocked: stats.studyDays >= 1 },
    { id: 2, name: '坚持者', desc: '连续打卡7天', icon: '🔥', unlocked: stats.continuousDays >= 7 },
    { id: 3, name: '勤奋者', desc: '连续打卡30天', icon: '💪', unlocked: stats.continuousDays >= 30 },
    { id: 4, name: '词汇新手', desc: '学习100个单词', icon: '📖', unlocked: stats.learnedWords >= 100 },
    { id: 5, name: '词汇达人', desc: '学习500个单词', icon: '🎓', unlocked: stats.learnedWords >= 500 },
    { id: 6, name: '词汇大师', desc: '学习1000个单词', icon: '👑', unlocked: stats.learnedWords >= 1000 }
  ];
}

Page({
  data: {
    cards: { studyDays: 0, learnedWords: 0, continuousDays: 0, masteryRate: 0 },
    achievements: [],
    chartData: [], // 图表数据（占位）
    wordStats: null // 单词统计（占位）
  },
  onLoad() {
    this.prepareStats();
  },
  prepareStats() {
    const user = Storage.get('user_data') || { learnedWords: [], wordbookWords: [], dailyGoal: 50 };
    const totals = { CET4: 4500, CET6: 2800 };
    const totalWords = totals[(user.level || 'CET4')] || 4500;

    // 假设存在打卡日期与每日学习记录
    // checkInDates: ['2025-11-01', ...]
    // checkInRecords: [{ date: '2025-11-01', count: 30 }, ...]
    const checkInDates = user.checkInDates || (user.lastCheckInDate ? [user.lastCheckInDate] : []);
    const checkInRecords = Storage.get('checkIn_records') || [];

    const studyDays = calculateStudyDays(checkInDates);
    const continuousDays = user.continuousDays || calculateContinuousDays(checkInDates);
    const learnedLen = (user.learnedWords || []).length;
    const masteryRate = calculateMasteryRate(user.learnedWords || [], totalWords);

    this.setData({
      cards: {
        studyDays,
        learnedWords: learnedLen,
        continuousDays,
        masteryRate
      },
      achievements: checkAchievements({ studyDays, continuousDays, learnedWords: learnedLen })
    });

    // 准备图表数据（占位，待集成ECharts）
    const last7 = getLast7Days();
    const chartData = last7.map(date => {
      const record = checkInRecords.find(r => r.date === date);
      return {
        date: date.slice(5), // 格式：MM-DD
        count: record ? record.count : 0
      };
    });

    const learned = learnedLen;
    const learning = (user.wordbookWords || []).length;
    const unlearned = Math.max(totalWords - learned - learning, 0);

    // 更新占位数据
    this.setData({
      chartData: chartData,
      wordStats: {
        mastered: learned,
        learning: learning,
        unlearned: unlearned
      }
    });
  }
});



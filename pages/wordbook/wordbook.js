const Storage = require('../../utils/storage.js');
const Audio = require('../../utils/audio.js');

let CET4 = [];

function getRelativeTime(dateString) {
  if (!dateString) return '';
  const now = new Date();
  const past = new Date(dateString);
  const diffDays = Math.floor((now - past) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return '今天';
  if (diffDays === 1) return '昨天';
  if (diffDays < 7) return `${diffDays}天前`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`;
  return `${Math.floor(diffDays / 30)}个月前`;
}

function ensureStructure(rawIds) {
  // 兼容旧结构（仅ID数组）转为对象数组
  if (!Array.isArray(rawIds)) return [];
  return rawIds.map(id => ({ wordId: id, addTime: new Date().toISOString().slice(0,10), reviewCount: 0, lastReviewTime: '', status: 'unreviewed' }));
}

Page({
  data: {
    filter: 'all',
    counts: { all: 0, unreviewed: 0, reviewed: 0 },
    sourceList: [], // 完整带细节的数据
    displayList: [], // 根据筛选展示
  },
  onShow() {
    this.loadData();
  },
  loadData() {
    try {
      // 读取词库
      CET4 = require('../../data/cet4.js');
    } catch (e) {
      console.error('读取词库失败:', e);
      wx.showModal({ title: '数据错误', content: '读取词库失败，使用备用数据', showCancel: false });
      // 使用备用数据
      CET4 = [
        { id: 1, word: 'abandon', phonetic: '/əˈbændən/', translation: 'v. 放弃；抛弃', example: 'He abandoned the project.', exampleTranslation: '他放弃了项目。', frequency: 5 }
      ];
    }

    // 读取生词本
    const user = Storage.get('user_data') || {};
    let wb = user.wordbookWords;
    if (!wb) wb = [];
    if (wb.length && typeof wb[0] === 'number') {
      // 旧结构迁移
      wb = ensureStructure(wb);
    }

    // 合并详细数据
    const map = new Map(CET4.map(w => [w.id, w]));
    const merged = wb
      .map(rec => {
        const w = map.get(rec.wordId);
        if (!w) return null;
        return {
          wordId: rec.wordId,
          addTime: rec.addTime,
          reviewCount: rec.reviewCount || 0,
          lastReviewTime: rec.lastReviewTime || '',
          status: rec.status || (rec.reviewCount > 0 ? 'reviewed' : 'unreviewed'),
          expanded: false,
          relativeTime: getRelativeTime(rec.addTime),
          anim: null,
          // 词库字段
          word: w.word,
          phonetic: w.phonetic,
          translation: w.translation,
          example: w.example,
          exampleTranslation: w.exampleTranslation
        };
      })
      .filter(Boolean)
      .sort((a,b) => (b.addTime || '').localeCompare(a.addTime || ''));

    const counts = {
      all: merged.length,
      unreviewed: merged.filter(x => (x.reviewCount || 0) === 0).length,
      reviewed: merged.filter(x => (x.reviewCount || 0) > 0).length
    };
    this.setData({ sourceList: merged, counts }, () => this.applyFilter());
  },
  applyFilter() {
    const { filter, sourceList } = this.data;
    let list = sourceList.slice();
    if (filter === 'unreviewed') list = list.filter(x => (x.reviewCount || 0) === 0);
    if (filter === 'reviewed') list = list.filter(x => (x.reviewCount || 0) > 0);
    this.setData({ displayList: list });
  },
  onSwitchFilter(e) {
    const filter = e.currentTarget.dataset.filter;
    this.setData({ filter }, () => this.applyFilter());
  },
  toggleExpand(e) {
    const idx = e.currentTarget.dataset.index;
    const list = this.data.displayList.slice();
    const item = list[idx];
    if (!item) return;
    item.expanded = !item.expanded;
    // 简单淡入动画
    const animation = wx.createAnimation({ duration: 180, timingFunction: 'ease-out' });
    animation.opacity(0.6).step({ duration: 0 });
    animation.opacity(1).step();
    item.anim = animation.export();
    this.setData({ displayList: list });
  },
  onSpeak(e) {
    const word = e.currentTarget.dataset.word;
    if (!word) return;
    const url = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(word)}&type=1`;
    Audio.playUrl(url);
  },
  onRemove(e) {
    const idx = e.currentTarget.dataset.index;
    const list = this.data.displayList.slice();
    const target = list[idx];
    if (!target) return;
    wx.showModal({
      title: '确认移除',
      content: `移除 “${target.word}” 出生词本？`,
      success: (res) => {
        if (!res.confirm) return;
        // 从 sourceList 移除
        const sourceList = this.data.sourceList.filter(x => x.wordId !== target.wordId);
        // 更新 user_data
        const user = Storage.get('user_data') || {};
        let wb = user.wordbookWords || [];
        if (wb.length && typeof wb[0] !== 'number') {
          wb = wb.filter(r => r.wordId !== target.wordId);
        } else {
          wb = wb.filter(id => id !== target.wordId);
        }
        user.wordbookWords = wb;
        Storage.set('user_data', user);
        const counts = {
          all: sourceList.length,
          unreviewed: sourceList.filter(x => (x.reviewCount || 0) === 0).length,
          reviewed: sourceList.filter(x => (x.reviewCount || 0) > 0).length
        };
        this.setData({ sourceList, counts }, () => this.applyFilter());
        wx.showToast({ title: '已移除', icon: 'success' });
      }
    });
  },
  startReview() {
    const ids = this.data.displayList.map(x => x.wordId);
    // 将复习队列暂存，学习页读取此键决定复习模式
    Storage.set('review_queue', ids);
    wx.navigateTo({ url: '/pages/learn/learn?mode=review' });
  },
  goLearn() {
    wx.navigateTo({ url: '/pages/learn/learn' });
  }
});



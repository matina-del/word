const Storage = require('../../utils/storage.js');
const Audio = require('../../utils/audio.js');
const WordUtil = require('../../utils/word.js');
const { debounce } = require('../../utils/debounce.js');
const Network = require('../../utils/network.js');
const Youdao = require('../../utils/youdao.js'); // ← 新增

let wordsData = [];
const PAGE_SIZE = 50; // 每页加载50个单词

Page({
  data: {
    list: [],
    allWordsPool: [], // 所有待学习的单词池
    currentPage: 0, // 当前页码
    hasMore: true, // 是否还有更多
    index: 0,
    targetCount: 0,
    displayIndex: 0,
    current: {},
    finished: false,
    cardAnim: null,
    loading: false, // 加载状态
    loadingMore: false // 加载更多状态
  },
  onLoad(options) {
    // 检查是否是复习模式
    this.isReviewMode = options.mode === 'review';
    this.bootstrap();
  },
  async bootstrap() {
    wx.showLoading({ title: '加载中...', mask: true });
    this.setData({ loading: true });

    try {
      // 检查网络状态
      const networkStatus = await Network.checkNetwork();
      if (!networkStatus.isConnected) {
        Network.showNetworkError();
        this.setData({ finished: true, loading: false });
        return;
      }

      // 读取本地词库数据（使用JS模块）
      let loaded = false;
      
      try {
        wordsData = require('../../data/cet4.js');
        if (wordsData && Array.isArray(wordsData) && wordsData.length > 0) {
          loaded = true;
          console.log('词库加载成功，共', wordsData.length, '个单词');
        }
      } catch (e1) {
        console.warn('词库加载失败:', e1.message);
      }
      
      // 如果加载失败，使用备用数据
      if (!loaded) {
        console.warn('使用备用单词数据');
        wordsData = [
          { id: 1, word: 'abandon', phonetic: '/əˈbændən/', translation: 'v. 放弃；抛弃', example: 'He abandoned the project.', exampleTranslation: '他放弃了项目。', frequency: 5 },
          { id: 2, word: 'ability', phonetic: '/əˈbɪləti/', translation: 'n. 能力；才能', example: 'She has the ability to lead.', exampleTranslation: '她有领导能力。', frequency: 5 },
          { id: 3, word: 'accept', phonetic: '/əkˈsept/', translation: 'v. 接受；同意', example: 'He accepted the invitation.', exampleTranslation: '他接受了邀请。', frequency: 5 },
          { id: 4, word: 'access', phonetic: '/ˈækses/', translation: 'n./v. 访问；进入', example: 'You need access to the system.', exampleTranslation: '你需要访问系统。', frequency: 5 },
          { id: 5, word: 'achieve', phonetic: '/əˈtʃiːv/', translation: 'v. 实现；达到', example: 'She achieved success.', exampleTranslation: '她取得了成功。', frequency: 5 },
          { id: 6, word: 'act', phonetic: '/ækt/', translation: 'v. 行动；表演', example: 'We must act quickly.', exampleTranslation: '我们必须迅速行动。', frequency: 5 },
          { id: 7, word: 'active', phonetic: '/ˈæktɪv/', translation: 'adj. 积极的', example: 'She is very active.', exampleTranslation: '她很积极。', frequency: 4 },
          { id: 8, word: 'add', phonetic: '/æd/', translation: 'v. 添加', example: 'Add some salt.', exampleTranslation: '加点盐。', frequency: 5 },
          { id: 9, word: 'address', phonetic: '/əˈdres/', translation: 'n. 地址', example: 'What is your address?', exampleTranslation: '你的地址是什么？', frequency: 5 },
          { id: 10, word: 'admit', phonetic: '/ədˈmɪt/', translation: 'v. 承认', example: 'He admitted the mistake.', exampleTranslation: '他承认了错误。', frequency: 4 }
        ];
        wx.showToast({ title: '使用备用数据（10个单词）', icon: 'none', duration: 2000 });
      }

      // 获取用户数据
      const user = Storage.get('user_data') || {
        level: 'CET4', dailyGoal: 50, todayLearned: 0, totalDays: 0, continuousDays: 0,
        learnedWords: [], wordbookWords: [], lastCheckInDate: ''
      };

      // 判断是复习模式还是学习模式
      if (this.isReviewMode) {
        const reviewQueue = Storage.get('review_queue', []);
        if (!reviewQueue || reviewQueue.length === 0) {
          wx.showToast({ title: '复习队列为空', icon: 'none' });
          this.setData({ finished: true, loading: false });
          return;
        }
        
        const wordMap = new Map(wordsData.map(w => [w.id, w]));
        const reviewWords = reviewQueue.map(id => wordMap.get(id)).filter(Boolean);
        
        if (reviewWords.length === 0) {
          wx.showToast({ title: '复习单词不存在', icon: 'none' });
          this.setData({ finished: true, loading: false });
          return;
        }

        const shuffled = WordUtil.shuffleArray(reviewWords);
        this.setData({ 
          allWordsPool: shuffled,
          targetCount: shuffled.length,
          loading: false,
          hasMore: shuffled.length > 0,
          currentPage: 0,
          list: [],
          index: 0
        });
        this.loadNextPage();
      } else {
        const dailyGoal = user.dailyGoal || 50;
        const learnedSet = new Set(user.learnedWords || []);
        const unlearned = WordUtil.filterLearnedWords(wordsData, Array.from(learnedSet));
        
        if (unlearned.length === 0) {
          wx.showToast({ title: '已学完所有单词', icon: 'success' });
          this.setData({ finished: true, loading: false });
          return;
        }

        const shuffled = WordUtil.shuffleArray(unlearned);
        const targetCount = Math.min(dailyGoal, shuffled.length);
        const selectedWords = shuffled.slice(0, targetCount);
        
        this.setData({ 
          allWordsPool: selectedWords,
          targetCount: targetCount,
          loading: false,
          hasMore: selectedWords.length > 0,
          currentPage: 0,
          list: [],
          index: 0
        });
        this.loadNextPage();
      }
    } catch (error) {
      console.error('初始化失败:', error);
      wx.showModal({
        title: '加载失败',
        content: '数据加载失败，请重试',
        showCancel: false
      });
      this.setData({ finished: true, loading: false });
    } finally {
      wx.hideLoading();
    }
  },
  /**
   * 加载下一页单词（分页加载）
   */
  loadNextPage() {
    if (this.data.loadingMore) return;

    const { allWordsPool, currentPage, list } = this.data;
    
    if (!allWordsPool || allWordsPool.length === 0) {
      console.warn('allWordsPool为空，无法加载单词');
      this.setData({ hasMore: false, finished: true });
      return;
    }

    const startIndex = currentPage * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const pageWords = allWordsPool.slice(startIndex, endIndex);

    if (pageWords.length === 0) {
      this.setData({ hasMore: false });
      if (!list || list.length === 0) {
        this.setData({ finished: true });
      }
      return;
    }

    this.setData({ loadingMore: true });

    const newList = [...(list || []), ...pageWords];
    const hasMore = endIndex < allWordsPool.length;
    const newIndex = list && list.length > 0 ? list.length : 0;

    this.setData({
      list: newList,
      currentPage: currentPage + 1,
      hasMore: hasMore,
      loadingMore: false,
      index: newIndex,
      displayIndex: newList.length > 0 ? newIndex + 1 : 0
    }, () => {
      this.updateCurrent(true);
    });
  },
  /**
   * 更新当前单词
   */
  updateCurrent(initial = false) {
    const { list, index } = this.data;
    
    if (!list || list.length === 0) {
      if (this.data.hasMore) {
        this.loadNextPage();
        return;
      }
      this.setData({ finished: true });
      return;
    }

    if (index >= list.length) {
      if (this.data.hasMore) {
        this.loadNextPage();
        return;
      }
      this.setData({ finished: true });
      return;
    }

    const item = list[index];
    
    if (!item || !item.word) {
      if (index < list.length - 1) {
        this.setData({ index: index + 1 }, () => this.updateCurrent(initial));
        return;
      }
      if (this.data.hasMore) {
        this.loadNextPage();
        return;
      }
      this.setData({ finished: true });
      return;
    }
    
    this.setData({ current: item, displayIndex: index + 1 });
    
    if (!initial) {
      this.runFadeIn();
    }

    // 自动播放发音（如果开启）
    const app = getApp();
    if (app && app.globalData && app.globalData.autoPlayAudio && !initial) {
      setTimeout(() => this.onSpeak(), 300);
    }
  },
  /**
   * 卡片淡入动画
   */
  runFadeIn() {
    const animation = wx.createAnimation({ duration: 220, timingFunction: 'ease-out' });
    animation.opacity(0).step({ duration: 0 });
    animation.opacity(1).step();
    this.setData({ cardAnim: animation.export() });
  },
  /**
   * 播放发音（使用有道语音，防抖处理）
   */
  onSpeak: debounce(function() {
    const w = this.data.current && this.data.current.word;
    if (!w) return;
    // type=1 美式发音，type=2 英式发音
    const url = Youdao.getSpeakUrl(w, 1);
    Audio.playUrl(url);
  }, 300),
  /**
   * 不认识（加入生词本，防抖处理）
   */
  onUnknown: debounce(function() {
    const user = Storage.get('user_data') || {};
    const id = this.data.current.id;
    const wb = new Set(user.wordbookWords || []);
    wb.add(id);
    Storage.setItem('user_data', { ...user, wordbookWords: Array.from(wb) });
    this.nextWord();
  }, 300),
  /**
   * 认识（记录学习进度，防抖处理）
   */
  onKnown: debounce(function() {
    const user = Storage.get('user_data') || {};
    const id = this.data.current.id;
    const learned = new Set(user.learnedWords || []);
    
    if (!learned.has(id)) {
      learned.add(id);
      const today = new Date().toISOString().slice(0, 10);
      const lastCheckIn = user.lastCheckInDate || '';
      let todayLearned = user.todayLearned || 0;
      
      if (lastCheckIn !== today) {
        todayLearned = 1;
      } else {
        todayLearned++;
      }

      const checkInDates = [...(user.checkInDates || [])];
      if (!checkInDates.includes(today)) {
        checkInDates.push(today);
      }

      const updatedUser = {
        ...user,
        learnedWords: Array.from(learned),
        todayLearned: todayLearned,
        lastCheckInDate: today,
        checkInDates: checkInDates,
        totalDays: checkInDates.length
      };

      const DateUtil = require('../../utils/date.js');
      updatedUser.continuousDays = DateUtil.calculateContinuousDays(checkInDates);
      Storage.setItem('user_data', updatedUser);
    }
    
    this.nextWord();
  }, 300),
  /**
   * 下一个单词
   */
  nextWord() {
    const { index, list } = this.data;
    
    if (!list || list.length === 0) {
      if (this.data.hasMore) {
        this.loadNextPage();
        return;
      }
      this.setData({ finished: true });
      wx.showToast({ title: '学习完成', icon: 'success' });
      return;
    }
    
    if (index >= list.length - 1) {
      if (this.data.hasMore) {
        this.loadNextPage();
        return;
      }
      this.setData({ finished: true });
      wx.showToast({ title: '学习完成', icon: 'success' });
      return;
    }

    const nextIndex = index + 1;
    this.setData({ index: nextIndex }, () => {
      this.updateCurrent();
    });
  },
  /**
   * 返回上一页
   */
  onBack() {
    wx.navigateBack({ 
      fail: () => wx.switchTab({ url: '/pages/index/index' }) 
    });
  },
  /**
   * 关闭，回到首页
   */
  onClose() {
    wx.switchTab({ url: '/pages/index/index' });
  }
});
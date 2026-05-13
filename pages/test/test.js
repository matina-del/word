const Storage = require('../../utils/storage.js');
const WordUtil = require('../../utils/word.js');

let wordsData = []; // 词库数据

Page({
  data: {
    mode: 'en2cn', // 测试模式：en2cn(英译中)、cn2en(中译英)、spell(拼写)
    qIndex: 0, // 当前题目索引
    totalQ: 0, // 总题数
    testWords: [], // 测试单词列表
    currentWord: null, // 当前单词
    
    // 选择题
    questionText: '', // 题目文本
    options: [], // 选项
    optionClasses: [], // 选项样式
    correctIndex: -1, // 正确答案索引
    
    // 拼写题
    spellHint: '', // 拼写提示
    spellInput: '', // 拼写输入
    
    // 状态
    finished: false, // 是否完成
    showNext: false, // 显示下一题按钮
    feedback: { show: false, correct: false, correctText: '' }, // 反馈信息
    feedbackAnim: null, // 反馈动画
    
    // 结果
    correctCount: 0, // 正确数量
    startTime: 0, // 开始时间
    duration: { min: 0, sec: 0 }, // 用时
    wrongList: [] // 错题列表
  },
  
  onLoad() {
    this.initTest();
  },
  
  /**
   * 初始化测试
   */
  async initTest() {
    wx.showLoading({ title: '加载中...', mask: true });
    
    try {
      // 加载词库数据
      try {
        wordsData = require('../../data/cet4.js');
      } catch (e) {
        console.warn('加载词库失败，使用备用数据');
        wordsData = [
          { id: 1, word: 'abandon', phonetic: '/əˈbændən/', translation: 'v. 放弃；抛弃', example: 'He abandoned the project.', exampleTranslation: '他放弃了项目。', frequency: 5 },
          { id: 2, word: 'ability', phonetic: '/əˈbɪləti/', translation: 'n. 能力；才能', example: 'She has the ability to lead.', exampleTranslation: '她有领导能力。', frequency: 5 },
          { id: 3, word: 'accept', phonetic: '/əkˈsept/', translation: 'v. 接受；同意', example: 'He accepted the invitation.', exampleTranslation: '他接受了邀请。', frequency: 5 },
          { id: 4, word: 'access', phonetic: '/ˈækses/', translation: 'n./v. 访问；进入', example: 'You need access to the system.', exampleTranslation: '你需要访问系统。', frequency: 5 },
          { id: 5, word: 'achieve', phonetic: '/əˈtʃiːv/', translation: 'v. 实现；达到', example: 'She achieved success.', exampleTranslation: '她取得了成功。', frequency: 5 }
        ];
      }
      
      // 获取用户数据
      const user = Storage.get('user_data') || {};
      const learnedWords = user.learnedWords || [];
      
      if (learnedWords.length < 20) {
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          content: '请先学习至少20个单词才能进行测试',
          showCancel: false,
          success: () => {
            wx.navigateBack();
          }
        });
        return;
      }
      
      // 从已学单词中随机选择20个
      const wordMap = new Map(wordsData.map(w => [w.id, w]));
      const learnedWordList = learnedWords
        .map(id => wordMap.get(id))
        .filter(Boolean);
      
      if (learnedWordList.length === 0) {
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          content: '没有已学单词，请先学习单词',
          showCancel: false,
          success: () => {
            wx.navigateBack();
          }
        });
        return;
      }
      
      // 随机选择20个单词
      const shuffled = WordUtil.shuffleArray(learnedWordList);
      const testWords = shuffled.slice(0, Math.min(20, shuffled.length));
      
      // 初始化测试数据
      this.setData({
        testWords: testWords,
        totalQ: testWords.length,
        qIndex: 0,
        correctCount: 0,
        wrongList: [],
        startTime: Date.now(),
        finished: false
      });
      
      // 加载第一题
      this.loadQuestion();
      
    } catch (error) {
      console.error('初始化测试失败:', error);
      wx.hideLoading();
      wx.showModal({
        title: '错误',
        content: '初始化测试失败，请重试',
        showCancel: false
      });
    } finally {
      wx.hideLoading();
    }
  },
  
  /**
   * 加载题目
   */
  loadQuestion() {
    const { testWords, qIndex, mode } = this.data;
    
    if (qIndex >= testWords.length) {
      // 测试完成
      this.finishTest();
      return;
    }
    
    const currentWord = testWords[qIndex];
    
    this.setData({
      currentWord: currentWord,
      spellInput: '',
      showNext: false,
      optionClasses: [],
      feedback: { show: false, correct: false, correctText: '' }
    });
    
    if (mode === 'en2cn') {
      // 英译中：显示英文单词，选项是中文翻译
      const options = this.generateOptions(currentWord, 'en2cn');
      this.setData({
        questionText: currentWord.word,
        options: options
        // correctIndex 由 generateOptions 函数设置
      });
    } else if (mode === 'cn2en') {
      // 中译英：显示中文翻译，选项是英文单词
      const options = this.generateOptions(currentWord, 'cn2en');
      this.setData({
        questionText: currentWord.translation,
        options: options
        // correctIndex 由 generateOptions 函数设置
      });
    } else if (mode === 'spell') {
      // 拼写测试：显示中文翻译，用户输入英文单词
      this.setData({
        spellHint: currentWord.translation
      });
    }
  },
  
  /**
   * 生成选项
   */
  generateOptions(correctWord, mode) {
    // 获取所有单词
    const allWords = wordsData.filter(w => w.id !== correctWord.id);
    const shuffled = WordUtil.shuffleArray(allWords);
    
    // 选择3个错误选项
    const wrongOptions = shuffled.slice(0, 3);
    
    // 生成选项列表
    let options = [];
    let correctAnswer = '';
    if (mode === 'en2cn') {
      // 英译中：选项是中文翻译
      correctAnswer = correctWord.translation;
      options = [
        correctAnswer,
        ...wrongOptions.map(w => w.translation)
      ];
    } else {
      // 中译英：选项是英文单词
      correctAnswer = correctWord.word;
      options = [
        correctAnswer,
        ...wrongOptions.map(w => w.word)
      ];
    }
    
    // 打乱顺序
    const shuffledOptions = WordUtil.shuffleArray([...options]);
    
    // 找到正确答案的新位置
    const correctIndex = shuffledOptions.findIndex(opt => opt === correctAnswer);
    
    console.log('生成选项:', {
      mode,
      correctWord: correctWord.word,
      correctAnswer,
      correctIndex,
      shuffledOptions: shuffledOptions
    });
    
    // 设置正确答案索引
    this.setData({ correctIndex: correctIndex });
    
    return shuffledOptions;
  },
  
  /**
   * 切换模式
   */
  switchMode(e) {
    const mode = e.currentTarget.dataset.mode;
    if (mode === this.data.mode) return;
    
    this.setData({ mode: mode });
    this.loadQuestion();
  },
  
  /**
   * 选择选项
   */
  chooseOption(e) {
    console.log('chooseOption 被调用', e);
    
    const { showNext, feedback } = this.data;
    if (showNext || (feedback && feedback.show)) {
      console.log('已经回答过，忽略点击');
      return; // 已经回答过
    }
    
    const index = parseInt(e.currentTarget.dataset.index);
    console.log('选择的索引:', index);
    
    const { correctIndex, options, currentWord } = this.data;
    console.log('当前数据:', { correctIndex, optionsLength: options ? options.length : 0, currentWord: currentWord ? currentWord.word : 'null' });
    
    if (correctIndex === undefined || correctIndex < 0) {
      console.error('correctIndex无效:', correctIndex);
      wx.showToast({ title: '数据错误，请重试', icon: 'none' });
      return;
    }
    
    const isCorrect = index === correctIndex;
    console.log('判断结果:', isCorrect ? '正确' : '错误', '正确答案索引:', correctIndex);
    
    const optionClasses = ['', '', '', ''];
    optionClasses[correctIndex] = 'correct';
    if (!isCorrect) {
      optionClasses[index] = 'incorrect';
    }
    
    // 更新数据
    this.setData({
      optionClasses: optionClasses,
      showNext: true,
      feedback: {
        show: true,
        correct: isCorrect,
        correctText: options[correctIndex]
      }
    }, () => {
      console.log('setData完成，反馈应该显示');
    });
    
    // 播放反馈动画
    this.showFeedback();
    
    // 更新统计
    if (isCorrect) {
      this.setData({
        correctCount: this.data.correctCount + 1
      });
      console.log('回答正确，正确数:', this.data.correctCount + 1);
    } else {
      // 添加到错题列表
      const wrongList = [...this.data.wrongList, currentWord];
      this.setData({ wrongList: wrongList });
      console.log('回答错误，加入错题列表');
      
      // 添加到生词本
      const user = Storage.get('user_data') || {};
      const wordbookWords = new Set(user.wordbookWords || []);
      wordbookWords.add(currentWord.id);
      user.wordbookWords = Array.from(wordbookWords);
      Storage.set('user_data', user);
    }
  },
  
  /**
   * 拼写输入
   */
  onSpellInput(e) {
    this.setData({
      spellInput: e.detail.value
    });
  },
  
  /**
   * 提交拼写
   */
  submitSpell() {
    const { spellInput, currentWord, showNext, feedback } = this.data;
    
    // 检查是否已经回答过
    if (showNext || (feedback && feedback.show)) {
      console.log('已经回答过，忽略提交');
      return;
    }
    
    // 检查输入是否为空
    if (!spellInput || spellInput.trim() === '') {
      wx.showToast({ title: '请输入答案', icon: 'none' });
      return;
    }
    
    const userInput = (spellInput || '').trim().toLowerCase();
    const correctAnswer = (currentWord.word || '').toLowerCase();
    const isCorrect = userInput === correctAnswer;
    
    console.log('拼写提交:', {
      userInput,
      correctAnswer,
      isCorrect,
      currentWord: currentWord ? currentWord.word : 'null'
    });
    
    // 立即显示反馈（无论对错）
    // 先设置反馈数据，然后播放动画
    const feedbackData = {
      show: true,
      correct: isCorrect,
      correctText: currentWord.word
    };
    
    this.setData({
      feedback: feedbackData
    }, () => {
      console.log('反馈已设置，isCorrect:', isCorrect, 'feedback:', this.data.feedback);
      
      // 播放反馈动画
      this.showFeedback();
      
      // 更新统计
      if (isCorrect) {
        this.setData({
          correctCount: this.data.correctCount + 1
        });
        // 立即显示Toast提示
        wx.showToast({ title: '回答正确！', icon: 'success', duration: 2000 });
      } else {
        // 添加到错题列表
        const wrongList = [...this.data.wrongList, currentWord];
        this.setData({ wrongList: wrongList });
        
        // 添加到生词本
        const user = Storage.get('user_data') || {};
        const wordbookWords = new Set(user.wordbookWords || []);
        wordbookWords.add(currentWord.id);
        user.wordbookWords = Array.from(wordbookWords);
        Storage.set('user_data', user);
        
        // 立即显示Toast提示
        wx.showToast({ title: '回答错误', icon: 'none', duration: 2000 });
      }
      
      // 延迟显示"下一题"按钮，让用户有时间看到反馈
      setTimeout(() => {
        this.setData({
          showNext: true
        });
      }, isCorrect ? 2000 : 3000); // 错误时延迟更久，让用户看清楚
    });
  },
  
  /**
   * 显示反馈动画
   */
  showFeedback() {
    console.log('showFeedback 被调用');
    const animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease-out'
    });
    animation.opacity(0).scale(0.8).step({ duration: 0 });
    animation.opacity(1).scale(1).step();
    this.setData({ feedbackAnim: animation.export() }, () => {
      console.log('反馈动画设置完成');
    });
  },
  
  /**
   * 下一题
   */
  nextQuestion() {
    const { qIndex, totalQ } = this.data;
    
    if (qIndex >= totalQ - 1) {
      // 最后一题，完成测试
      this.finishTest();
    } else {
      // 加载下一题
      this.setData({
        qIndex: qIndex + 1
      });
      this.loadQuestion();
    }
  },
  
  /**
   * 完成测试
   */
  finishTest() {
    const { startTime, correctCount, totalQ, wrongList } = this.data;
    
    // 计算用时
    const durationMs = Date.now() - startTime;
    const duration = {
      min: Math.floor(durationMs / 60000),
      sec: Math.floor((durationMs % 60000) / 1000)
    };
    
    this.setData({
      finished: true,
      duration: duration
    });
  },
  
  /**
   * 查看错题
   */
  viewWrong() {
    const { wrongList } = this.data;
    if (wrongList.length === 0) {
      wx.showToast({ title: '没有错题', icon: 'none' });
      return;
    }
    
    // 将错题加入复习队列
    const wrongIds = wrongList.map(w => w.id);
    Storage.set('review_queue', wrongIds);
    
    // 跳转到学习页（复习模式）
    wx.navigateTo({
      url: '/pages/learn/learn?mode=review'
    });
  },
  
  /**
   * 再测一次
   */
  restart() {
    this.initTest();
  },
  
  /**
   * 返回首页
   */
  goHome() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  }
});

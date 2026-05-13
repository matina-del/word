/**
 * 单词处理工具类
 * 提供单词数组的随机选择、打乱、过滤等功能
 */

const WordUtil = {
  /**
   * 从单词数组中随机选择N个单词
   * @param {Array} words - 单词数组
   * @param {number} count - 要选择的单词数量
   * @returns {Array} 随机选择的单词数组
   * 
   * @example
   * const selected = WordUtil.getRandomWords(allWords, 50);
   */
  getRandomWords(words, count) {
    if (!Array.isArray(words) || words.length === 0) {
      return [];
    }
    if (count <= 0) {
      return [];
    }
    if (count >= words.length) {
      return this.shuffleArray([...words]);
    }

    const shuffled = this.shuffleArray([...words]);
    return shuffled.slice(0, count);
  },

  /**
   * 打乱数组顺序（Fisher-Yates洗牌算法）
   * @param {Array} array - 要打乱的数组
   * @returns {Array} 打乱后的新数组（不修改原数组）
   * 
   * @example
   * const shuffled = WordUtil.shuffleArray([1, 2, 3, 4, 5]);
   */
  shuffleArray(array) {
    if (!Array.isArray(array)) {
      return [];
    }
    
    const arr = [...array]; // 创建副本，不修改原数组
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  },

  /**
   * 获取错误选项（用于选择题）
   * @param {Object} correctWord - 正确答案的单词对象
   * @param {Array} allWords - 所有单词数组
   * @param {number} count - 错误选项数量，默认3
   * @param {string} mode - 模式：'en2cn'（英译中）或 'cn2en'（中译英）
   * @returns {Array} 错误选项数组
   * 
   * @example
   * // 英译中模式：返回中文释义数组
   * const wrongOptions = WordUtil.getWrongOptions(correctWord, allWords, 3, 'en2cn');
   * // 中译英模式：返回英文单词数组
   * const wrongOptions = WordUtil.getWrongOptions(correctWord, allWords, 3, 'cn2en');
   */
  getWrongOptions(correctWord, allWords, count = 3, mode = 'en2cn') {
    if (!correctWord || !allWords || !Array.isArray(allWords)) {
      return [];
    }

    // 过滤掉正确答案，获取其他单词
    const wrongWords = allWords.filter(w => w.id !== correctWord.id);
    
    if (wrongWords.length === 0) {
      return [];
    }

    // 随机选择N个错误单词
    const selected = this.getRandomWords(wrongWords, Math.min(count, wrongWords.length));

    // 根据模式返回对应的字段
    if (mode === 'en2cn') {
      // 英译中：返回中文释义
      return selected.map(w => w.translation || '');
    } else if (mode === 'cn2en') {
      // 中译英：返回英文单词
      return selected.map(w => w.word || '');
    } else {
      // 默认返回完整对象
      return selected;
    }
  },

  /**
   * 过滤已学单词
   * @param {Array} allWords - 所有单词数组
   * @param {Array} learnedIds - 已学单词ID数组
   * @returns {Array} 未学单词数组
   * 
   * @example
   * const unlearned = WordUtil.filterLearnedWords(allWords, [1, 2, 3]);
   */
  filterLearnedWords(allWords, learnedIds) {
    if (!Array.isArray(allWords)) {
      return [];
    }
    if (!Array.isArray(learnedIds) || learnedIds.length === 0) {
      return [...allWords];
    }

    const learnedSet = new Set(learnedIds);
    return allWords.filter(w => !learnedSet.has(w.id));
  },

  /**
   * 过滤未学单词（获取已学单词）
   * @param {Array} allWords - 所有单词数组
   * @param {Array} learnedIds - 已学单词ID数组
   * @returns {Array} 已学单词数组
   * 
   * @example
   * const learned = WordUtil.filterUnlearnedWords(allWords, [1, 2, 3]);
   */
  filterUnlearnedWords(allWords, learnedIds) {
    if (!Array.isArray(allWords)) {
      return [];
    }
    if (!Array.isArray(learnedIds) || learnedIds.length === 0) {
      return [];
    }

    const learnedSet = new Set(learnedIds);
    return allWords.filter(w => learnedSet.has(w.id));
  },

  /**
   * 计算掌握率
   * @param {number} learnedCount - 已学单词数量
   * @param {number} totalCount - 总单词数量
   * @returns {number} 掌握率（0-100的整数）
   * 
   * @example
   * const rate = WordUtil.calculateMasteryRate(100, 4500); // 2
   */
  calculateMasteryRate(learnedCount, totalCount) {
    if (!totalCount || totalCount <= 0) {
      return 0;
    }
    if (learnedCount < 0) {
      learnedCount = 0;
    }
    if (learnedCount > totalCount) {
      learnedCount = totalCount;
    }
    
    return Math.round((learnedCount / totalCount) * 100);
  },

  /**
   * 根据词频筛选单词
   * @param {Array} words - 单词数组
   * @param {number} minFrequency - 最小词频（1-5）
   * @param {number} maxFrequency - 最大词频（1-5）
   * @returns {Array} 筛选后的单词数组
   * 
   * @example
   * // 筛选高频词汇（词频4-5）
   * const highFreq = WordUtil.filterByFrequency(words, 4, 5);
   */
  filterByFrequency(words, minFrequency = 1, maxFrequency = 5) {
    if (!Array.isArray(words)) {
      return [];
    }
    
    return words.filter(w => {
      const freq = w.frequency || 0;
      return freq >= minFrequency && freq <= maxFrequency;
    });
  },

  /**
   * 根据词库级别筛选单词
   * @param {Array} words - 单词数组
   * @param {string} level - 词库级别：'CET4' 或 'CET6'
   * @returns {Array} 筛选后的单词数组
   * 
   * @example
   * const cet4Words = WordUtil.filterByLevel(words, 'CET4');
   */
  filterByLevel(words, level) {
    if (!Array.isArray(words) || !level) {
      return [];
    }
    
    return words.filter(w => {
      return w.level === level || (!w.level && level === 'CET4'); // 默认CET4
    });
  },

  /**
   * 搜索单词（根据单词或释义）
   * @param {Array} words - 单词数组
   * @param {string} keyword - 搜索关键词
   * @returns {Array} 匹配的单词数组
   * 
   * @example
   * const results = WordUtil.searchWords(allWords, 'hello');
   */
  searchWords(words, keyword) {
    if (!Array.isArray(words) || !keyword || keyword.trim() === '') {
      return [];
    }

    const lowerKeyword = keyword.toLowerCase().trim();
    
    return words.filter(w => {
      const word = (w.word || '').toLowerCase();
      const translation = (w.translation || '').toLowerCase();
      return word.includes(lowerKeyword) || translation.includes(lowerKeyword);
    });
  },

  /**
   * 按字母顺序排序单词
   * @param {Array} words - 单词数组
   * @param {boolean} ascending - 是否升序（true：A-Z，false：Z-A）
   * @returns {Array} 排序后的单词数组
   * 
   * @example
   * const sorted = WordUtil.sortByAlphabet(words, true);
   */
  sortByAlphabet(words, ascending = true) {
    if (!Array.isArray(words)) {
      return [];
    }

    const sorted = [...words].sort((a, b) => {
      const wordA = (a.word || '').toLowerCase();
      const wordB = (b.word || '').toLowerCase();
      if (ascending) {
        return wordA.localeCompare(wordB);
      } else {
        return wordB.localeCompare(wordA);
      }
    });

    return sorted;
  }
};

module.exports = WordUtil;





# 词汇通 - 四六级背单词小程序

一款专为大学生设计的四六级单词学习微信小程序，界面简洁，功能实用。

## 预览

> 首页展示今日学习进度、连续打卡天数、累计学习数据

## 功能特点

- 📚 完整的四级单词词库（共 4500+ 单词）
- 🎯 每日学习目标设置
- 📊 学习数据统计和图表
- 🔥 连续打卡功能
- 📖 生词本管理
- 🔊 单词发音（有道语音）
- ✅ 单词测试功能

## 项目结构

```
word/
├── app.js              # 应用入口
├── app.json            # 应用配置
├── app.wxss            # 全局样式
├── components/         # 自定义组件
│   ├── progress-bar/   # 进度条组件
│   ├── skeleton/       # 骨架屏组件
│   └── word-card/      # 单词卡片组件
├── data/
│   └── cet4.js         # 四级词库
├── pages/
│   ├── index/          # 首页
│   ├── learn/          # 学习页
│   ├── test/           # 测试页
│   ├── wordbook/       # 生词本
│   ├── stats/          # 统计页
│   └── settings/       # 设置页
└── utils/
    ├── audio.js        # 音频播放
    ├── date.js         # 日期工具
    ├── debounce.js     # 防抖工具
    ├── md5.js          # MD5加密
    ├── network.js      # 网络检测
    ├── storage.js      # 本地存储
    ├── user.js         # 用户数据
    ├── word.js         # 单词处理
    └── youdao.js       # 有道API（本地配置，不上传）
```

## 使用方法

### 1. 克隆项目

```bash
git clone https://github.com/matina-del/word.git
```

### 2. 配置有道 API

在 `utils/` 目录下新建 `youdao.js`，填入你自己的 AppKey 和 AppSecret：

```javascript
const md5 = require('./md5.js')

const AppKey = '你的AppKey'
const AppSecret = '你的AppSecret'

function translateWord(word) {
  const salt = Date.now().toString()
  const sign = md5(AppKey + word + salt + AppSecret)
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'https://openapi.youdao.com/api',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: { q: word, from: 'en', to: 'zh-CHS', appKey: AppKey, salt, sign },
      success: (res) => {
        if (res.data && res.data.errorCode === '0') {
          resolve({ translation: res.data.translation[0] })
        } else {
          reject(res.data ? res.data.errorCode : 'unknown')
        }
      },
      fail: reject
    })
  })
}

function getSpeakUrl(word, type = 1) {
  return `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(word)}&type=${type}`
}

module.exports = { translateWord, getSpeakUrl }
```

> 前往 [有道智云](https://ai.youdao.com) 注册并创建应用获取密钥

### 3. 配置服务器域名

在微信公众平台 → 开发管理 → 服务器域名中添加：

```
request合法域名：
https://openapi.youdao.com
https://dict.youdao.com
```

### 4. 导入项目

用微信开发者工具导入项目，AppID 填写你自己的小程序 AppID。

## 技术栈

- 微信小程序原生开发
- 有道智云 API（单词发音）
- 本地存储（wx.storage）

## 开发计划

- [ ] 六级词库支持
- [ ] 艾宾浩斯记忆曲线复习
- [ ] 单词联想记忆
- [ ] 排行榜功能

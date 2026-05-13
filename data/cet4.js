// 四级单词数据
const cet4Words = [
  {
    "id": 1,
    "word": "abandon",
    "phonetic": "/əˈbændən/",
    "translation": "v. 放弃；抛弃",
    "example": "He abandoned the project due to a lack of funds.",
    "exampleTranslation": "由于资金不足，他放弃了该项目。",
    "frequency": 5
  },
  {
    "id": 2,
    "word": "ability",
    "phonetic": "/əˈbɪləti/",
    "translation": "n. 能力；才能",
    "example": "She has the ability to lead a team effectively.",
    "exampleTranslation": "她有有效领导团队的能力。",
    "frequency": 5
  },
  {
    "id": 3,
    "word": "able",
    "phonetic": "/ˈeɪbl/",
    "translation": "adj. 能够的；有才干的",
    "example": "He is able to solve the problem quickly.",
    "exampleTranslation": "他能够迅速解决这个问题。",
    "frequency": 5
  },
  {
    "id": 4,
    "word": "about",
    "phonetic": "/əˈbaʊt/",
    "translation": "prep. 关于；在…周围 adv. 大约",
    "example": "They talked about their plans for the holiday.",
    "exampleTranslation": "他们谈论了假期的计划。",
    "frequency": 5
  },
  {
    "id": 5,
    "word": "above",
    "phonetic": "/əˈbʌv/",
    "translation": "prep. 在…之上；高于",
    "example": "The temperature is above average this week.",
    "exampleTranslation": "本周气温高于平均水平。",
    "frequency": 4
  },
  {
    "id": 6,
    "word": "abroad",
    "phonetic": "/əˈbrɔːd/",
    "translation": "adv. 在国外；到海外",
    "example": "She plans to study abroad next year.",
    "exampleTranslation": "她计划明年出国留学。",
    "frequency": 4
  },
  {
    "id": 7,
    "word": "absence",
    "phonetic": "/ˈæbsəns/",
    "translation": "n. 缺席；缺乏",
    "example": "His absence from the meeting was noticed by everyone.",
    "exampleTranslation": "他缺席会议被所有人注意到了。",
    "frequency": 4
  },
  {
    "id": 8,
    "word": "absolute",
    "phonetic": "/ˈæbsəluːt/",
    "translation": "adj. 绝对的；完全的",
    "example": "She has absolute confidence in her team.",
    "exampleTranslation": "她对团队有绝对的信心。",
    "frequency": 3
  },
  {
    "id": 9,
    "word": "absorb",
    "phonetic": "/əbˈzɔːrb/",
    "translation": "v. 吸收；吸引（注意）",
    "example": "Plants absorb water through their roots.",
    "exampleTranslation": "植物通过根部吸收水分。",
    "frequency": 4
  },
  {
    "id": 10,
    "word": "abstract",
    "phonetic": "/ˈæbstrækt/",
    "translation": "adj. 抽象的 n. 摘要",
    "example": "The concept is too abstract for beginners.",
    "exampleTranslation": "这个概念对初学者来说太抽象了。",
    "frequency": 3
  },
  {
    "id": 11,
    "word": "academic",
    "phonetic": "/ˌækəˈdemɪk/",
    "translation": "adj. 学术的 n. 学者",
    "example": "She has strong academic interests in economics.",
    "exampleTranslation": "她在经济学方面有强烈的学术兴趣。",
    "frequency": 4
  },
  {
    "id": 12,
    "word": "accept",
    "phonetic": "/əkˈsept/",
    "translation": "v. 接受；同意",
    "example": "He accepted the invitation to the conference.",
    "exampleTranslation": "他接受了参加会议的邀请。",
    "frequency": 5
  },
  {
    "id": 13,
    "word": "access",
    "phonetic": "/ˈækses/",
    "translation": "n./v. 进入；获取",
    "example": "Students have access to the library 24/7.",
    "exampleTranslation": "学生可以全天候进入图书馆。",
    "frequency": 5
  },
  {
    "id": 14,
    "word": "accident",
    "phonetic": "/ˈæksɪd(ə)nt/",
    "translation": "n. 事故；意外",
    "example": "No one was hurt in the car accident.",
    "exampleTranslation": "车祸中没有人受伤。",
    "frequency": 5
  },
  {
    "id": 15,
    "word": "accompany",
    "phonetic": "/əˈkʌmpəni/",
    "translation": "v. 陪伴；伴随",
    "example": "I will accompany you to the station.",
    "exampleTranslation": "我会陪你去车站。",
    "frequency": 4
  },
  {
    "id": 16,
    "word": "accomplish",
    "phonetic": "/əˈkʌmplɪʃ/",
    "translation": "v. 完成；实现",
    "example": "They accomplished their goals on time.",
    "exampleTranslation": "他们按时完成了目标。",
    "frequency": 4
  },
  {
    "id": 17,
    "word": "according",
    "phonetic": "/əˈkɔːrdɪŋ/",
    "translation": "adv. 根据；按照",
    "example": "According to the report, sales increased.",
    "exampleTranslation": "根据报告，销售额增加了。",
    "frequency": 5
  },
  {
    "id": 18,
    "word": "account",
    "phonetic": "/əˈkaʊnt/",
    "translation": "n. 账户；描述 v. 解释",
    "example": "Please create an online account.",
    "exampleTranslation": "请创建一个在线账户。",
    "frequency": 5
  },
  {
    "id": 19,
    "word": "accurate",
    "phonetic": "/ˈækjərət/",
    "translation": "adj. 精确的；准确的",
    "example": "The data must be accurate and reliable.",
    "exampleTranslation": "数据必须准确可靠。",
    "frequency": 4
  },
  {
    "id": 20,
    "word": "achieve",
    "phonetic": "/əˈtʃiːv/",
    "translation": "v. 实现；达到",
    "example": "She worked hard to achieve success.",
    "exampleTranslation": "她努力工作以取得成功。",
    "frequency": 5
  },
  {
    "id": 21,
    "word": "acquire",
    "phonetic": "/əˈkwaɪər/",
    "translation": "v. 获得；习得",
    "example": "It takes time to acquire new skills.",
    "exampleTranslation": "习得新技能需要时间。",
    "frequency": 4
  },
  {
    "id": 22,
    "word": "across",
    "phonetic": "/əˈkrɔːs/",
    "translation": "prep. 横过；在…对面",
    "example": "There is a bank across the street.",
    "exampleTranslation": "街对面有一家银行。",
    "frequency": 4
  },
  {
    "id": 23,
    "word": "act",
    "phonetic": "/ækt/",
    "translation": "v. 行动；表演 n. 行为；法令",
    "example": "We must act quickly to solve this issue.",
    "exampleTranslation": "我们必须迅速行动来解决这个问题。",
    "frequency": 5
  },
  {
    "id": 24,
    "word": "active",
    "phonetic": "/ˈæktɪv/",
    "translation": "adj. 积极的；活跃的",
    "example": "She plays an active role in the club.",
    "exampleTranslation": "她在俱乐部中扮演积极角色。",
    "frequency": 4
  },
  {
    "id": 25,
    "word": "activity",
    "phonetic": "/ækˈtɪvəti/",
    "translation": "n. 活动；行动",
    "example": "Outdoor activity is good for health.",
    "exampleTranslation": "户外活动有益健康。",
    "frequency": 4
  },
  {
    "id": 26,
    "word": "actually",
    "phonetic": "/ˈæktʃuəli/",
    "translation": "adv. 实际上；事实上",
    "example": "He actually finished the work early.",
    "exampleTranslation": "他实际上很早就完成了工作。",
    "frequency": 4
  },
  {
    "id": 27,
    "word": "adapt",
    "phonetic": "/əˈdæpt/",
    "translation": "v. 适应；改编",
    "example": "You must adapt to the new environment.",
    "exampleTranslation": "你必须适应新环境。",
    "frequency": 4
  },
  {
    "id": 28,
    "word": "add",
    "phonetic": "/æd/",
    "translation": "v. 添加；相加",
    "example": "Add some salt to the soup.",
    "exampleTranslation": "在汤里加点盐。",
    "frequency": 5
  },
  {
    "id": 29,
    "word": "addition",
    "phonetic": "/əˈdɪʃ(ə)n/",
    "translation": "n. 添加；加法",
    "example": "In addition, we need more data.",
    "exampleTranslation": "此外，我们需要更多数据。",
    "frequency": 4
  },
  {
    "id": 30,
    "word": "address",
    "phonetic": "/əˈdres/",
    "translation": "n. 地址 v. 演说；处理",
    "example": "Please send it to my new address.",
    "exampleTranslation": "请寄到我的新地址。",
    "frequency": 5
  },
  {
    "id": 31,
    "word": "adjust",
    "phonetic": "/əˈdʒʌst/",
    "translation": "v. 调整；适应",
    "example": "You need time to adjust to college life.",
    "exampleTranslation": "你需要时间适应大学生活。",
    "frequency": 4
  },
  {
    "id": 32,
    "word": "administration",
    "phonetic": "/ədˌmɪnɪˈstreɪʃ(ə)n/",
    "translation": "n. 管理；行政",
    "example": "The administration announced new policies.",
    "exampleTranslation": "行政部门宣布了新政策。",
    "frequency": 4
  },
  {
    "id": 33,
    "word": "admit",
    "phonetic": "/ədˈmɪt/",
    "translation": "v. 承认；允许进入",
    "example": "He admitted that he made a mistake.",
    "exampleTranslation": "他承认自己犯了错。",
    "frequency": 4
  },
  {
    "id": 34,
    "word": "adult",
    "phonetic": "/ˈædʌlt/",
    "translation": "n. 成人 adj. 成年的",
    "example": "This movie is only for adults.",
    "exampleTranslation": "这部电影只适合成年人观看。",
    "frequency": 3
  },
  {
    "id": 35,
    "word": "advance",
    "phonetic": "/ədˈvæns/",
    "translation": "v. 前进；促进 n. 进步",
    "example": "Technology continues to advance rapidly.",
    "exampleTranslation": "技术持续快速发展。",
    "frequency": 5
  },
  {
    "id": 36,
    "word": "advantage",
    "phonetic": "/ədˈvɑːntɪdʒ/",
    "translation": "n. 优势；好处",
    "example": "Bilingual students have an advantage in the job market.",
    "exampleTranslation": "双语学生在就业市场上更有优势。",
    "frequency": 5
  },
  {
    "id": 37,
    "word": "advice",
    "phonetic": "/ədˈvaɪs/",
    "translation": "n. 建议；忠告",
    "example": "Take your teacher's advice seriously.",
    "exampleTranslation": "认真对待你老师的建议。",
    "frequency": 5
  },
  {
    "id": 38,
    "word": "advise",
    "phonetic": "/ədˈvaɪz/",
    "translation": "v. 建议；忠告",
    "example": "I advise you to start early.",
    "exampleTranslation": "我建议你早点开始。",
    "frequency": 4
  },
  {
    "id": 39,
    "word": "affect",
    "phonetic": "/əˈfekt/",
    "translation": "v. 影响；感动",
    "example": "The weather can affect your mood.",
    "exampleTranslation": "天气会影响你的情绪。",
    "frequency": 5
  },
  {
    "id": 40,
    "word": "afford",
    "phonetic": "/əˈfɔːrd/",
    "translation": "v. 负担得起；提供",
    "example": "I can't afford a new laptop right now.",
    "exampleTranslation": "我目前买不起一台新笔记本电脑。",
    "frequency": 4
  },
  {
    "id": 41,
    "word": "afterward",
    "phonetic": "/ˈæftərwərd/",
    "translation": "adv. 后来；随后",
    "example": "We went to a cafe afterward.",
    "exampleTranslation": "随后我们去了咖啡馆。",
    "frequency": 3
  },
  {
    "id": 42,
    "word": "agency",
    "phonetic": "/ˈeɪdʒənsi/",
    "translation": "n. 代理机构；机构",
    "example": "She works at a travel agency.",
    "exampleTranslation": "她在一家旅行社工作。",
    "frequency": 4
  },
  {
    "id": 43,
    "word": "agenda",
    "phonetic": "/əˈdʒendə/",
    "translation": "n. 议程；日程表",
    "example": "Let's move to the next item on the agenda.",
    "exampleTranslation": "我们进入议程的下一项。",
    "frequency": 3
  },
  {
    "id": 44,
    "word": "aggressive",
    "phonetic": "/əˈɡresɪv/",
    "translation": "adj. 侵略性的；有进取心的",
    "example": "He has an aggressive marketing strategy.",
    "exampleTranslation": "他有积极进取的营销策略。",
    "frequency": 3
  },
  {
    "id": 45,
    "word": "aid",
    "phonetic": "/eɪd/",
    "translation": "n./v. 援助；帮助",
    "example": "The organization sent medical aid to the area.",
    "exampleTranslation": "该组织向该地区提供了医疗援助。",
    "frequency": 4
  },
  {
    "id": 46,
    "word": "aim",
    "phonetic": "/eɪm/",
    "translation": "v. 瞄准；旨在 n. 目标",
    "example": "We aim to finish the task by Friday.",
    "exampleTranslation": "我们的目标是在周五前完成任务。",
    "frequency": 4
  },
  {
    "id": 47,
    "word": "airline",
    "phonetic": "/ˈerlaɪn/",
    "translation": "n. 航空公司；航线",
    "example": "The airline announced a new route.",
    "exampleTranslation": "该航空公司宣布了一条新航线。",
    "frequency": 3
  },
  {
    "id": 48,
    "word": "alarm",
    "phonetic": "/əˈlɑːrm/",
    "translation": "n. 警报；惊恐 v. 使惊慌",
    "example": "The smoke set off the fire alarm.",
    "exampleTranslation": "烟雾触发了火警报警器。",
    "frequency": 3
  },
  {
    "id": 49,
    "word": "album",
    "phonetic": "/ˈælbəm/",
    "translation": "n. 相册；专辑",
    "example": "They released their first album last year.",
    "exampleTranslation": "他们去年发行了第一张专辑。",
    "frequency": 2
  },
  {
    "id": 50,
    "word": "alcohol",
    "phonetic": "/ˈælkəhɔːl/",
    "translation": "n. 酒精；含酒精饮料",
    "example": "Excessive alcohol is harmful to health.",
    "exampleTranslation": "过量饮酒有害健康。",
    "frequency": 4
  },
  {
    "id": 51,
    "word": "alive",
    "phonetic": "/əˈlaɪv/",
    "translation": "adj. 活着的；有活力的",
    "example": "The fish is still alive.",
    "exampleTranslation": "这条鱼还活着。",
    "frequency": 4
  },
  {
    "id": 52,
    "word": "allow",
    "phonetic": "/əˈlaʊ/",
    "translation": "v. 允许；使能够",
    "example": "They don't allow smoking here.",
    "exampleTranslation": "这里不允许吸烟。",
    "frequency": 5
  },
  {
    "id": 53,
    "word": "alphabet",
    "phonetic": "/ˈælfəbet/",
    "translation": "n. 字母表",
    "example": "Children learn the alphabet first.",
    "exampleTranslation": "孩子们首先学习字母表。",
    "frequency": 3
  },
  {
    "id": 54,
    "word": "amaze",
    "phonetic": "/əˈmeɪz/",
    "translation": "v. 使惊奇；使惊叹",
    "example": "The result amazed everyone.",
    "exampleTranslation": "结果让所有人都感到惊讶。",
    "frequency": 3
  },
  {
    "id": 55,
    "word": "ambition",
    "phonetic": "/æmˈbɪʃ(ə)n/",
    "translation": "n. 雄心；抱负",
    "example": "He has the ambition to start his own company.",
    "exampleTranslation": "他有创办自己公司的雄心。",
    "frequency": 4
  },
  {
    "id": 56,
    "word": "amount",
    "phonetic": "/əˈmaʊnt/",
    "translation": "n. 数量 v. 总计",
    "example": "The total amount is higher than expected.",
    "exampleTranslation": "总金额高于预期。",
    "frequency": 4
  },
  {
    "id": 57,
    "word": "analysis",
    "phonetic": "/əˈnæləsɪs/",
    "translation": "n. 分析",
    "example": "We need a deeper analysis of the data.",
    "exampleTranslation": "我们需要对数据进行更深入的分析。",
    "frequency": 4
  },
  {
    "id": 58,
    "word": "ancient",
    "phonetic": "/ˈeɪnʃənt/",
    "translation": "adj. 古老的；古代的",
    "example": "They studied ancient Greek culture.",
    "exampleTranslation": "他们研究古希腊文化。",
    "frequency": 4
  },
  {
    "id": 59,
    "word": "anger",
    "phonetic": "/ˈæŋɡər/",
    "translation": "n. 愤怒 v. 使生气",
    "example": "He couldn't hide his anger.",
    "exampleTranslation": "他无法掩饰自己的愤怒。",
    "frequency": 4
  },
  {
    "id": 60,
    "word": "angle",
    "phonetic": "/ˈæŋɡl/",
    "translation": "n. 角度；观点",
    "example": "Consider the issue from another angle.",
    "exampleTranslation": "从另一个角度考虑这个问题。",
    "frequency": 3
  },
  {
    "id": 61,
    "word": "announce",
    "phonetic": "/əˈnaʊns/",
    "translation": "v. 宣布；通知",
    "example": "They will announce the results tomorrow.",
    "exampleTranslation": "他们将于明天公布结果。",
    "frequency": 5
  },
  {
    "id": 62,
    "word": "annual",
    "phonetic": "/ˈænjuəl/",
    "translation": "adj. 每年的；年度的",
    "example": "The annual meeting is held in June.",
    "exampleTranslation": "年度会议在六月举行。",
    "frequency": 4
  },
  {
    "id": 63,
    "word": "anxiety",
    "phonetic": "/æŋˈzaɪəti/",
    "translation": "n. 焦虑；担心",
    "example": "Exercise can help reduce anxiety.",
    "exampleTranslation": "锻炼有助于减轻焦虑。",
    "frequency": 4
  },
  {
    "id": 64,
    "word": "anyhow",
    "phonetic": "/ˈenihaʊ/",
    "translation": "adv. 无论如何；总之",
    "example": "Anyhow, we managed to finish it.",
    "exampleTranslation": "总之，我们还是设法完成了。",
    "frequency": 2
  },
  {
    "id": 65,
    "word": "appeal",
    "phonetic": "/əˈpiːl/",
    "translation": "v. 呼吁；上诉 n. 吸引力",
    "example": "The charity appealed for donations.",
    "exampleTranslation": "该慈善机构呼吁捐款。",
    "frequency": 4
  },
  {
    "id": 66,
    "word": "appear",
    "phonetic": "/əˈpɪr/",
    "translation": "v. 出现；似乎",
    "example": "He appears to be very confident.",
    "exampleTranslation": "他看起来很自信。",
    "frequency": 5
  },
  {
    "id": 67,
    "word": "application",
    "phonetic": "/ˌæplɪˈkeɪʃ(ə)n/",
    "translation": "n. 申请；应用",
    "example": "Your application has been approved.",
    "exampleTranslation": "你的申请已获批准。",
    "frequency": 5
  },
  {
    "id": 68,
    "word": "apply",
    "phonetic": "/əˈplaɪ/",
    "translation": "v. 申请；应用；适用",
    "example": "You can apply for the scholarship online.",
    "exampleTranslation": "你可以在线申请奖学金。",
    "frequency": 5
  },
  {
    "id": 69,
    "word": "appoint",
    "phonetic": "/əˈpɔɪnt/",
    "translation": "v. 任命；指定",
    "example": "She was appointed manager last year.",
    "exampleTranslation": "她去年被任命为经理。",
    "frequency": 4
  },
  {
    "id": 70,
    "word": "appreciate",
    "phonetic": "/əˈpriːʃieɪt/",
    "translation": "v. 感激；欣赏；理解",
    "example": "I really appreciate your help.",
    "exampleTranslation": "我非常感谢你的帮助。",
    "frequency": 5
  },
  {
    "id": 71,
    "word": "approach",
    "phonetic": "/əˈproʊtʃ/",
    "translation": "v./n. 接近；方法",
    "example": "We need a new approach to this problem.",
    "exampleTranslation": "我们需要一个解决该问题的新方法。",
    "frequency": 5
  },
  {
    "id": 72,
    "word": "appropriate",
    "phonetic": "/əˈproʊpriət/",
    "translation": "adj. 适当的；恰当的",
    "example": "Wear appropriate clothes for the interview.",
    "exampleTranslation": "面试时穿着得体的衣服。",
    "frequency": 4
  },
  {
    "id": 73,
    "word": "approve",
    "phonetic": "/əˈpruːv/",
    "translation": "v. 批准；赞成",
    "example": "The committee approved the plan.",
    "exampleTranslation": "委员会批准了该计划。",
    "frequency": 4
  },
  {
    "id": 74,
    "word": "argue",
    "phonetic": "/ˈɑːrɡjuː/",
    "translation": "v. 争论；主张",
    "example": "They argued about the best solution.",
    "exampleTranslation": "他们就最佳解决方案争论。",
    "frequency": 5
  },
  {
    "id": 75,
    "word": "arise",
    "phonetic": "/əˈraɪz/",
    "translation": "v. 出现；产生",
    "example": "Problems may arise during the process.",
    "exampleTranslation": "过程中可能会出现问题。",
    "frequency": 4
  },
  {
    "id": 76,
    "word": "arrange",
    "phonetic": "/əˈreɪndʒ/",
    "translation": "v. 安排；整理",
    "example": "She arranged a meeting for next Monday.",
    "exampleTranslation": "她安排了下周一的会议。",
    "frequency": 5
  },
  {
    "id": 77,
    "word": "arrest",
    "phonetic": "/əˈrest/",
    "translation": "v. 逮捕；阻止 n. 逮捕",
    "example": "The police arrested the suspect.",
    "exampleTranslation": "警方逮捕了嫌疑人。",
    "frequency": 3
  },
  {
    "id": 78,
    "word": "arrival",
    "phonetic": "/əˈraɪv(ə)l/",
    "translation": "n. 到达；到来",
    "example": "We are waiting for the arrival of the train.",
    "exampleTranslation": "我们在等待火车的到来。",
    "frequency": 4
  },
  {
    "id": 79,
    "word": "artificial",
    "phonetic": "/ˌɑːrtɪˈfɪʃ(ə)l/",
    "translation": "adj. 人工的；人造的",
    "example": "The park has an artificial lake.",
    "exampleTranslation": "公园里有一个人工湖。",
    "frequency": 3
  },
  {
    "id": 80,
    "word": "aside",
    "phonetic": "/əˈsaɪd/",
    "translation": "adv. 在旁边；撇开",
    "example": "She set the book aside and stood up.",
    "exampleTranslation": "她把书放到一边站了起来。",
    "frequency": 2
  },
  {
    "id": 81,
    "word": "aspect",
    "phonetic": "/ˈæspekt/",
    "translation": "n. 方面；外观",
    "example": "We considered every aspect of the plan.",
    "exampleTranslation": "我们考虑了计划的各个方面。",
    "frequency": 5
  },
  {
    "id": 82,
    "word": "assess",
    "phonetic": "/əˈses/",
    "translation": "v. 评估；评价",
    "example": "It's important to assess the risks.",
    "exampleTranslation": "评估风险很重要。",
    "frequency": 4
  },
  {
    "id": 83,
    "word": "assign",
    "phonetic": "/əˈsaɪn/",
    "translation": "v. 分配；指派",
    "example": "The teacher assigned homework for the weekend.",
    "exampleTranslation": "老师布置了周末作业。",
    "frequency": 4
  },
  {
    "id": 84,
    "word": "assist",
    "phonetic": "/əˈsɪst/",
    "translation": "v. 协助；帮助",
    "example": "Can you assist me with this task?",
    "exampleTranslation": "你能帮我完成这个任务吗？",
    "frequency": 4
  },
  {
    "id": 85,
    "word": "assume",
    "phonetic": "/əˈsuːm/",
    "translation": "v. 假设；承担",
    "example": "Don't assume everyone agrees with you.",
    "exampleTranslation": "不要假设每个人都同意你。",
    "frequency": 5
  },
  {
    "id": 86,
    "word": "attempt",
    "phonetic": "/əˈtempt/",
    "translation": "v./n. 尝试；企图",
    "example": "They attempted to climb the mountain.",
    "exampleTranslation": "他们尝试攀登这座山。",
    "frequency": 5
  },
  {
    "id": 87,
    "word": "attend",
    "phonetic": "/əˈtend/",
    "translation": "v. 出席；参加；照顾",
    "example": "Thousands attended the concert.",
    "exampleTranslation": "数千人出席了音乐会。",
    "frequency": 5
  },
  {
    "id": 88,
    "word": "attention",
    "phonetic": "/əˈtenʃ(ə)n/",
    "translation": "n. 注意；关注",
    "example": "Pay attention to the instructions.",
    "exampleTranslation": "注意这些说明。",
    "frequency": 5
  },
  {
    "id": 89,
    "word": "attitude",
    "phonetic": "/ˈætɪtuːd/",
    "translation": "n. 态度；看法",
    "example": "Her positive attitude inspires others.",
    "exampleTranslation": "她积极的态度激励着他人。",
    "frequency": 5
  },
  {
    "id": 90,
    "word": "attract",
    "phonetic": "/əˈtrækt/",
    "translation": "v. 吸引；引起",
    "example": "The event attracted a large audience.",
    "exampleTranslation": "该活动吸引了大量观众。",
    "frequency": 5
  },
  {
    "id": 91,
    "word": "audience",
    "phonetic": "/ˈɔːdiəns/",
    "translation": "n. 听众；观众",
    "example": "The audience applauded loudly.",
    "exampleTranslation": "观众热烈鼓掌。",
    "frequency": 5
  },
  {
    "id": 92,
    "word": "available",
    "phonetic": "/əˈveɪləbl/",
    "translation": "adj. 可获得的；有空的",
    "example": "The professor is available on Monday.",
    "exampleTranslation": "教授周一有空。",
    "frequency": 5
  },
  {
    "id": 93,
    "word": "average",
    "phonetic": "/ˈævərɪdʒ/",
    "translation": "n. 平均数 adj. 平均的；一般的",
    "example": "The average score increased this year.",
    "exampleTranslation": "今年的平均分提高了。",
    "frequency": 4
  },
  {
    "id": 94,
    "word": "avoid",
    "phonetic": "/əˈvɔɪd/",
    "translation": "v. 避免；躲开",
    "example": "You should avoid making the same mistake.",
    "exampleTranslation": "你应避免犯同样的错误。",
    "frequency": 5
  },
  {
    "id": 95,
    "word": "aware",
    "phonetic": "/əˈwer/",
    "translation": "adj. 意识到的；知道的",
    "example": "Be aware of potential risks.",
    "exampleTranslation": "要意识到潜在的风险。",
    "frequency": 5
  },
  {
    "id": 96,
    "word": "award",
    "phonetic": "/əˈwɔːrd/",
    "translation": "n. 奖；奖品 v. 授予",
    "example": "She won an award for her research.",
    "exampleTranslation": "她因研究获得了一个奖项。",
    "frequency": 4
  },
  {
    "id": 97,
    "word": "aware",
    "phonetic": "/əˈwer/",
    "translation": "adj. 知道的；意识到的",
    "example": "We are fully aware of the situation.",
    "exampleTranslation": "我们完全了解情况。",
    "frequency": 4
  },
  {
    "id": 98,
    "word": "awesome",
    "phonetic": "/ˈɔːsəm/",
    "translation": "adj. 令人敬畏的；很棒的",
    "example": "The view from the mountain was awesome.",
    "exampleTranslation": "山上的景色令人惊叹。",
    "frequency": 2
  },
  {
    "id": 99,
    "word": "awful",
    "phonetic": "/ˈɔːf(ə)l/",
    "translation": "adj. 糟糕的；可怕的",
    "example": "The weather was awful yesterday.",
    "exampleTranslation": "昨天的天气很糟糕。",
    "frequency": 3
  },
  {
    "id": 100,
    "word": "awkward",
    "phonetic": "/ˈɔːkwərd/",
    "translation": "adj. 尴尬的；笨拙的",
    "example": "There was an awkward silence in the room.",
    "exampleTranslation": "房间里出现了尴尬的沉默。",
    "frequency": 3
  }
]



module.exports = cet4Words;
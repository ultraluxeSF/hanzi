// Dictionary: words grouped by topic. Format per line: hanzi | pinyin (one syllable per character) | English
// Course words are merged in automatically (see buildDictionary).

export const TOPICS = [
  ['greetings', 'Greetings & phrases', '👋'],
  ['pronouns', 'Pronouns', '🙋'],
  ['people', 'People & family', '👨‍👩‍👧'],
  ['numbers', 'Numbers', '🔢'],
  ['time', 'Time', '🕒'],
  ['food', 'Food & drink', '🍜'],
  ['animals', 'Animals', '🐼'],
  ['technology', 'Technology', '📱'],
  ['transport', 'Transport', '🚕'],
  ['places', 'Places', '🏙️'],
  ['countries', 'Countries', '🌏'],
  ['colours', 'Colours', '🎨'],
  ['body', 'Body', '✋'],
  ['weather', 'Weather', '☀️'],
  ['clothes', 'Clothes', '👕'],
  ['verbs', 'Common verbs', '🏃'],
  ['adjectives', 'Describing words', '✨'],
  ['question words', 'Question words', '❓'],
  ['grammar', 'Grammar words', '🧩'],
];

const RAW = {
  greetings: `
早上好 | zǎo shang hǎo | good morning
晚上好 | wǎn shang hǎo | good evening
请 | qǐng | please
请问 | qǐng wèn | excuse me (may I ask)
没问题 | méi wèn tí | no problem
好的 | hǎo de | OK, sure
欢迎 | huān yíng | welcome
`,
  pronouns: `
你们 | nǐ men | you (plural)
他们 | tā men | they (male / mixed)
她们 | tā men | they (female)
您 | nín | you (polite)
`,
  people: `
家 | jiā | family; home
爸爸 | bà ba | dad
妈妈 | mā ma | mum
哥哥 | gē ge | older brother
姐姐 | jiě jie | older sister
弟弟 | dì di | younger brother
妹妹 | mèi mei | younger sister
儿子 | ér zi | son
女儿 | nǚ ér | daughter
孩子 | hái zi | child
丈夫 | zhàng fu | husband
妻子 | qī zi | wife
朋友 | péng you | friend
老师 | lǎo shī | teacher
学生 | xué sheng | student
医生 | yī shēng | doctor
设计师 | shè jì shī | designer
男人 | nán rén | man
女人 | nǚ rén | woman
`,
  numbers: `
零 | líng | zero
一 | yī | one
二 | èr | two
三 | sān | three
四 | sì | four
五 | wǔ | five
六 | liù | six
七 | qī | seven
八 | bā | eight
九 | jiǔ | nine
十 | shí | ten
百 | bǎi | hundred
千 | qiān | thousand
万 | wàn | ten thousand
两 | liǎng | two (of something)
`,
  time: `
今天 | jīn tiān | today
明天 | míng tiān | tomorrow
昨天 | zuó tiān | yesterday
现在 | xiàn zài | now
早上 | zǎo shang | morning
中午 | zhōng wǔ | noon
晚上 | wǎn shang | evening
小时 | xiǎo shí | hour
分钟 | fēn zhōng | minute
星期 | xīng qī | week
月 | yuè | month; moon
年 | nián | year
点 | diǎn | o'clock
`,
  food: `
水 | shuǐ | water
茶 | chá | tea
咖啡 | kā fēi | coffee
牛奶 | niú nǎi | milk
果汁 | guǒ zhī | juice
啤酒 | pí jiǔ | beer
米饭 | mǐ fàn | cooked rice
面条 | miàn tiáo | noodles
饺子 | jiǎo zi | dumplings
包子 | bāo zi | steamed bun
面包 | miàn bāo | bread
鸡蛋 | jī dàn | egg
肉 | ròu | meat
牛肉 | niú ròu | beef
鸡肉 | jī ròu | chicken (meat)
羊肉 | yáng ròu | lamb
猪肉 | zhū ròu | pork
蔬菜 | shū cài | vegetables
水果 | shuǐ guǒ | fruit
苹果 | píng guǒ | apple
香蕉 | xiāng jiāo | banana
西瓜 | xī guā | watermelon
葡萄 | pú tao | grapes
汤 | tāng | soup
辣 | là | spicy
甜 | tián | sweet
菜单 | cài dān | menu
`,
  animals: `
动物 | dòng wù | animal
狗 | gǒu | dog
猫 | māo | cat
鸟 | niǎo | bird
鱼 | yú | fish
马 | mǎ | horse
牛 | niú | cow, ox
羊 | yáng | sheep
猪 | zhū | pig
鸡 | jī | chicken
鸭子 | yā zi | duck
兔子 | tù zi | rabbit
老虎 | lǎo hǔ | tiger
狮子 | shī zi | lion
熊 | xióng | bear
熊猫 | xióng māo | panda
猴子 | hóu zi | monkey
大象 | dà xiàng | elephant
蛇 | shé | snake
骆驼 | luò tuo | camel
狼 | láng | wolf
老鼠 | lǎo shǔ | mouse, rat
`,
  technology: `
手机 | shǒu jī | mobile phone
电脑 | diàn nǎo | computer
笔记本电脑 | bǐ jì běn diàn nǎo | laptop
平板电脑 | píng bǎn diàn nǎo | tablet
电视 | diàn shì | television
网络 | wǎng luò | network, internet
上网 | shàng wǎng | to go online
无线网 | wú xiàn wǎng | Wi-Fi
密码 | mì mǎ | password
充电 | chōng diàn | to charge (a battery)
充电器 | chōng diàn qì | charger
耳机 | ěr jī | headphones
相机 | xiàng jī | camera
照片 | zhào piàn | photo
软件 | ruǎn jiàn | software
应用 | yìng yòng | app
屏幕 | píng mù | screen
键盘 | jiàn pán | keyboard
鼠标 | shǔ biāo | computer mouse
电子邮件 | diàn zǐ yóu jiàn | email
微信 | Wēi xìn | WeChat
二维码 | èr wéi mǎ | QR code
`,
  transport: `
车 | chē | vehicle
汽车 | qì chē | car
出租车 | chū zū chē | taxi
公共汽车 | gōng gòng qì chē | bus
地铁 | dì tiě | metro
火车 | huǒ chē | train
高铁 | gāo tiě | high-speed train
飞机 | fēi jī | plane
机场 | jī chǎng | airport
火车站 | huǒ chē zhàn | train station
自行车 | zì xíng chē | bicycle
票 | piào | ticket
司机 | sī jī | driver
`,
  places: `
酒店 | jiǔ diàn | hotel
饭店 | fàn diàn | restaurant
商店 | shāng diàn | shop
超市 | chāo shì | supermarket
医院 | yī yuàn | hospital
银行 | yín háng | bank
学校 | xué xiào | school
洗手间 | xǐ shǒu jiān | restroom, toilet
公园 | gōng yuán | park
城市 | chéng shì | city
国家 | guó jiā | country, nation
`,
  countries: `
英国 | Yīng guó | United Kingdom
日本 | Rì běn | Japan
韩国 | Hán guó | South Korea
土耳其 | Tǔ ěr qí | Turkey
哈萨克斯坦 | Hā sà kè sī tǎn | Kazakhstan
`,
  colours: `
颜色 | yán sè | colour
红色 | hóng sè | red
黄色 | huáng sè | yellow
蓝色 | lán sè | blue
绿色 | lǜ sè | green
白色 | bái sè | white
黑色 | hēi sè | black
灰色 | huī sè | grey
粉色 | fěn sè | pink
紫色 | zǐ sè | purple
橙色 | chéng sè | orange
`,
  body: `
身体 | shēn tǐ | body
头 | tóu | head
头发 | tóu fa | hair
眼睛 | yǎn jing | eye
耳朵 | ěr duo | ear
鼻子 | bí zi | nose
嘴 | zuǐ | mouth
牙 | yá | tooth
手 | shǒu | hand
脚 | jiǎo | foot
肚子 | dù zi | belly
`,
  weather: `
天气 | tiān qì | weather
热 | rè | hot
冷 | lěng | cold
下雨 | xià yǔ | to rain
下雪 | xià xuě | to snow
太阳 | tài yáng | sun
风 | fēng | wind
晴天 | qíng tiān | sunny day
阴天 | yīn tiān | cloudy day
`,
  clothes: `
衣服 | yī fu | clothes
衬衫 | chèn shān | shirt
裤子 | kù zi | trousers
裙子 | qún zi | skirt
鞋 | xié | shoes
袜子 | wà zi | socks
帽子 | mào zi | hat
外套 | wài tào | coat, jacket
包 | bāo | bag
`,
  verbs: `
吃 | chī | to eat
喝 | hē | to drink
去 | qù | to go
来 | lái | to come
看 | kàn | to look, to watch
听 | tīng | to listen
说 | shuō | to speak, to say
买 | mǎi | to buy
卖 | mài | to sell
要 | yào | to want; will
想 | xiǎng | to want to; to think
喜欢 | xǐ huan | to like
知道 | zhī dào | to know
学习 | xué xí | to study
工作 | gōng zuò | to work; job
睡觉 | shuì jiào | to sleep
住 | zhù | to live (somewhere)
有 | yǒu | to have; there is
做 | zuò | to do, to make
等 | děng | to wait
帮 | bāng | to help
`,
  adjectives: `
大 | dà | big
小 | xiǎo | small
多 | duō | many, much
少 | shǎo | few, little
贵 | guì | expensive
便宜 | pián yi | cheap
快 | kuài | fast
慢 | màn | slow
新 | xīn | new
旧 | jiù | old (things)
漂亮 | piào liang | beautiful
高兴 | gāo xìng | happy, glad
`,
  'question words': `
谁 | shéi | who
哪儿 | nǎr | where
几 | jǐ | how many (small numbers)
多少 | duō shao | how many, how much
怎么 | zěn me | how
为什么 | wèi shén me | why
`,
};

export function dictionaryRaw() {
  const out = [];
  for (const [topic, block] of Object.entries(RAW)) {
    for (const line of block.trim().split('\n')) {
      const [hz, py, en] = line.split('|').map(s => s.trim());
      if (hz) out.push({ id: 'd_' + hz, hz, py, en, topic });
    }
  }
  return out;
}

// Merge course words (they carry lessonId) with dictionary entries, de-duplicated by hanzi+pinyin.
export function buildDictionary(courseWords) {
  const map = new Map();
  for (const w of dictionaryRaw()) map.set(w.hz + '|' + w.py, w);
  for (const w of courseWords) {
    const key = w.hz + '|' + w.py;
    const prev = map.get(key);
    map.set(key, { ...(prev || {}), ...w, topic: w.topic || prev?.topic });
  }
  return [...map.values()];
}

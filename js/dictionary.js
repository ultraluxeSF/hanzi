// Dictionary: words grouped by topic. Format per line: hanzi | pinyin (one syllable per character) | English
// Within each topic, lines are in logical order (that order is the default "By topic" sort).
// Course words are merged in automatically (see buildDictionary).

export const TOPICS = [
  ['greetings', 'Greetings & phrases'],
  ['pronouns', 'Pronouns'],
  ['people', 'People & family'],
  ['jobs', 'Jobs & work'],
  ['numbers', 'Numbers'],
  ['measure', 'Measure words'],
  ['time', 'Time & days'],
  ['food', 'Food & drink'],
  ['animals', 'Animals'],
  ['nature', 'Nature'],
  ['weather', 'Weather & seasons'],
  ['home', 'Home'],
  ['clothes', 'Clothes'],
  ['body', 'Body'],
  ['health', 'Health'],
  ['colours', 'Colours'],
  ['transport', 'Transport & travel'],
  ['directions', 'Directions & position'],
  ['places', 'Places'],
  ['countries', 'Countries'],
  ['languages', 'Languages'],
  ['shopping', 'Shopping & money'],
  ['school', 'School & study'],
  ['technology', 'Technology'],
  ['hobbies', 'Hobbies & sport'],
  ['feelings', 'Feelings'],
  ['verbs', 'Common verbs'],
  ['adjectives', 'Describing words'],
  ['question words', 'Question words'],
  ['grammar', 'Grammar words'],
];

const RAW = {
  greetings: `
早上好 | zǎo shang hǎo | good morning
晚上好 | wǎn shang hǎo | good evening
晚安 | wǎn ān | good night
好久不见 | hǎo jiǔ bú jiàn | long time no see
请 | qǐng | please
请问 | qǐng wèn | excuse me (may I ask)
不好意思 | bù hǎo yì si | excuse me; sorry (mild)
麻烦你 | má fan nǐ | sorry to trouble you
没事 | méi shì | it's nothing; no worries
没问题 | méi wèn tí | no problem
好的 | hǎo de | OK, sure
可以 | kě yǐ | can; OK
当然 | dāng rán | of course
对 | duì | correct, right
是的 | shì de | yes, that's right
欢迎 | huān yíng | welcome
慢走 | màn zǒu | take care (to someone leaving)
加油 | jiā yóu | come on! you can do it
恭喜 | gōng xǐ | congratulations
生日快乐 | shēng rì kuài lè | happy birthday
新年快乐 | xīn nián kuài lè | happy new year
`,
  pronouns: `
你们 | nǐ men | you (plural)
他们 | tā men | they (male / mixed)
她们 | tā men | they (female)
您 | nín | you (polite)
大家 | dà jiā | everyone
自己 | zì jǐ | oneself
`,
  people: `
家 | jiā | family; home
爸爸 | bà ba | dad
妈妈 | mā ma | mum
哥哥 | gē ge | older brother
姐姐 | jiě jie | older sister
弟弟 | dì di | younger brother
妹妹 | mèi mei | younger sister
爷爷 | yé ye | grandpa (father's father)
奶奶 | nǎi nai | grandma (father's mother)
外公 | wài gōng | grandpa (mother's father)
外婆 | wài pó | grandma (mother's mother)
叔叔 | shū shu | uncle
阿姨 | ā yí | aunt; auntie
丈夫 | zhàng fu | husband
妻子 | qī zi | wife
儿子 | ér zi | son
女儿 | nǚ ér | daughter
孩子 | hái zi | child
宝宝 | bǎo bao | baby
朋友 | péng you | friend
男朋友 | nán péng you | boyfriend
女朋友 | nǚ péng you | girlfriend
邻居 | lín jū | neighbour
客人 | kè rén | guest
男人 | nán rén | man
女人 | nǚ rén | woman
`,
  jobs: `
工作 | gōng zuò | to work; job
老师 | lǎo shī | teacher
学生 | xué sheng | student
医生 | yī shēng | doctor
护士 | hù shi | nurse
设计师 | shè jì shī | designer
工程师 | gōng chéng shī | engineer
律师 | lǜ shī | lawyer
警察 | jǐng chá | police officer
厨师 | chú shī | chef
服务员 | fú wù yuán | waiter, waitress
司机 | sī jī | driver
经理 | jīng lǐ | manager
老板 | lǎo bǎn | boss
同事 | tóng shì | colleague
记者 | jì zhě | journalist
画家 | huà jiā | painter, artist
歌手 | gē shǒu | singer
演员 | yǎn yuán | actor
农民 | nóng mín | farmer
公司 | gōng sī | company
办公室 | bàn gōng shì | office
会议 | huì yì | meeting
上班 | shàng bān | to go to work
下班 | xià bān | to finish work
工资 | gōng zī | salary
`,
  numbers: `
零 | líng | zero
一 | yī | one
二 | èr | two
两 | liǎng | two (of something)
三 | sān | three
四 | sì | four
五 | wǔ | five
六 | liù | six
七 | qī | seven
八 | bā | eight
九 | jiǔ | nine
十 | shí | ten
十一 | shí yī | eleven
二十 | èr shí | twenty
百 | bǎi | hundred
千 | qiān | thousand
万 | wàn | ten thousand
半 | bàn | half
第一 | dì yī | first
`,
  measure: `
个 | gè | general measure word
本 | běn | for books
张 | zhāng | for flat things (paper, tickets)
杯 | bēi | a cup of
瓶 | píng | a bottle of
块 | kuài | a piece of; yuan (money)
件 | jiàn | for clothes and matters
只 | zhī | for animals
辆 | liàng | for vehicles
双 | shuāng | a pair of
次 | cì | time (occurrence)
`,
  time: `
现在 | xiàn zài | now
今天 | jīn tiān | today
明天 | míng tiān | tomorrow
后天 | hòu tiān | the day after tomorrow
昨天 | zuó tiān | yesterday
前天 | qián tiān | the day before yesterday
早上 | zǎo shang | early morning
上午 | shàng wǔ | morning (before noon)
中午 | zhōng wǔ | noon
下午 | xià wǔ | afternoon
晚上 | wǎn shang | evening
点 | diǎn | o'clock
小时 | xiǎo shí | hour
分钟 | fēn zhōng | minute
秒 | miǎo | second
天 | tiān | day; sky
星期 | xīng qī | week
星期一 | xīng qī yī | Monday
星期二 | xīng qī èr | Tuesday
星期三 | xīng qī sān | Wednesday
星期四 | xīng qī sì | Thursday
星期五 | xīng qī wǔ | Friday
星期六 | xīng qī liù | Saturday
星期天 | xīng qī tiān | Sunday
周末 | zhōu mò | weekend
月 | yuè | month; moon
年 | nián | year
时候 | shí hou | time, moment
刚才 | gāng cái | just now
以前 | yǐ qián | before; ago
以后 | yǐ hòu | after; later
`,
  food: `
早饭 | zǎo fàn | breakfast
午饭 | wǔ fàn | lunch
晚饭 | wǎn fàn | dinner
饿 | è | hungry
渴 | kě | thirsty
水 | shuǐ | water
茶 | chá | tea
红茶 | hóng chá | black tea
绿茶 | lǜ chá | green tea
咖啡 | kā fēi | coffee
牛奶 | niú nǎi | milk
果汁 | guǒ zhī | juice
可乐 | kě lè | cola
酒 | jiǔ | alcohol, wine
啤酒 | pí jiǔ | beer
冰 | bīng | ice
米 | mǐ | rice (uncooked)
米饭 | mǐ fàn | cooked rice
炒饭 | chǎo fàn | fried rice
面 | miàn | noodles; flour
面条 | miàn tiáo | noodles
饺子 | jiǎo zi | dumplings
包子 | bāo zi | steamed bun
面包 | miàn bāo | bread
火锅 | huǒ guō | hot pot
烤鸭 | kǎo yā | roast duck
汤 | tāng | soup
菜 | cài | dish; vegetable
鸡蛋 | jī dàn | egg
豆腐 | dòu fu | tofu
肉 | ròu | meat
牛肉 | niú ròu | beef
羊肉 | yáng ròu | lamb
鸡肉 | jī ròu | chicken (meat)
猪肉 | zhū ròu | pork
蔬菜 | shū cài | vegetables
土豆 | tǔ dòu | potato
西红柿 | xī hóng shì | tomato
黄瓜 | huáng guā | cucumber
洋葱 | yáng cōng | onion
胡萝卜 | hú luó bo | carrot
水果 | shuǐ guǒ | fruit
苹果 | píng guǒ | apple
香蕉 | xiāng jiāo | banana
橙子 | chéng zi | orange (fruit)
梨 | lí | pear
葡萄 | pú tao | grapes
草莓 | cǎo méi | strawberry
西瓜 | xī guā | watermelon
蛋糕 | dàn gāo | cake
糖 | táng | sugar; sweets
盐 | yán | salt
好吃 | hǎo chī | tasty
好喝 | hǎo hē | tasty (drinks)
甜 | tián | sweet
酸 | suān | sour
咸 | xián | salty
辣 | là | spicy
苦 | kǔ | bitter
菜单 | cài dān | menu
筷子 | kuài zi | chopsticks
勺子 | sháo zi | spoon
碗 | wǎn | bowl
盘子 | pán zi | plate
杯子 | bēi zi | cup, glass
`,
  animals: `
动物 | dòng wù | animal
宠物 | chǒng wù | pet
狗 | gǒu | dog
猫 | māo | cat
鸟 | niǎo | bird
鸽子 | gē zi | pigeon
鱼 | yú | fish
马 | mǎ | horse
牛 | niú | cow, ox
羊 | yáng | sheep
猪 | zhū | pig
鸡 | jī | chicken
鸭子 | yā zi | duck
兔子 | tù zi | rabbit
老鼠 | lǎo shǔ | mouse, rat
骆驼 | luò tuo | camel
老虎 | lǎo hǔ | tiger
狮子 | shī zi | lion
熊 | xióng | bear
熊猫 | xióng māo | panda
猴子 | hóu zi | monkey
大象 | dà xiàng | elephant
长颈鹿 | cháng jǐng lù | giraffe
鹿 | lù | deer
狼 | láng | wolf
狐狸 | hú li | fox
蛇 | shé | snake
乌龟 | wū guī | tortoise, turtle
青蛙 | qīng wā | frog
企鹅 | qǐ é | penguin
海豚 | hǎi tún | dolphin
鲨鱼 | shā yú | shark
虫子 | chóng zi | insect, bug
蝴蝶 | hú dié | butterfly
蚊子 | wén zi | mosquito
龙 | lóng | dragon
`,
  nature: `
天空 | tiān kōng | sky
太阳 | tài yáng | sun
月亮 | yuè liang | moon
星星 | xīng xing | star
地球 | dì qiú | Earth
山 | shān | mountain
河 | hé | river
湖 | hú | lake
海 | hǎi | sea
树 | shù | tree
森林 | sēn lín | forest
花 | huā | flower
草 | cǎo | grass
石头 | shí tou | stone
沙漠 | shā mò | desert
`,
  weather: `
天气 | tiān qì | weather
热 | rè | hot
暖和 | nuǎn huo | warm
凉快 | liáng kuai | cool
冷 | lěng | cold
度 | dù | degree
晴天 | qíng tiān | sunny day
阴天 | yīn tiān | cloudy day
云 | yún | cloud
风 | fēng | wind
雨 | yǔ | rain
下雨 | xià yǔ | to rain
雪 | xuě | snow
下雪 | xià xuě | to snow
雾 | wù | fog
季节 | jì jié | season
春天 | chūn tiān | spring
夏天 | xià tiān | summer
秋天 | qiū tiān | autumn
冬天 | dōng tiān | winter
`,
  home: `
房子 | fáng zi | house
房间 | fáng jiān | room
客厅 | kè tīng | living room
卧室 | wò shì | bedroom
厨房 | chú fáng | kitchen
卫生间 | wèi shēng jiān | bathroom
门 | mén | door
窗户 | chuāng hu | window
桌子 | zhuō zi | table
椅子 | yǐ zi | chair
沙发 | shā fā | sofa
床 | chuáng | bed
灯 | dēng | lamp, light
钥匙 | yào shi | key
冰箱 | bīng xiāng | fridge
空调 | kōng tiáo | air conditioner
洗衣机 | xǐ yī jī | washing machine
`,
  clothes: `
衣服 | yī fu | clothes
穿 | chuān | to wear (clothes, shoes)
戴 | dài | to wear (hat, glasses, watch)
衬衫 | chèn shān | shirt
毛衣 | máo yī | sweater
外套 | wài tào | coat, jacket
大衣 | dà yī | overcoat
裤子 | kù zi | trousers
裙子 | qún zi | skirt
袜子 | wà zi | socks
鞋 | xié | shoes
运动鞋 | yùn dòng xié | trainers
帽子 | mào zi | hat
围巾 | wéi jīn | scarf
手套 | shǒu tào | gloves
眼镜 | yǎn jìng | glasses
手表 | shǒu biǎo | watch
包 | bāo | bag
`,
  body: `
身体 | shēn tǐ | body
头 | tóu | head
头发 | tóu fa | hair
脸 | liǎn | face
眼睛 | yǎn jing | eye
耳朵 | ěr duo | ear
鼻子 | bí zi | nose
嘴 | zuǐ | mouth
牙 | yá | tooth
脖子 | bó zi | neck
肩膀 | jiān bǎng | shoulder
背 | bèi | back
胳膊 | gē bo | arm
手 | shǒu | hand
手指 | shǒu zhǐ | finger
肚子 | dù zi | belly
腿 | tuǐ | leg
脚 | jiǎo | foot
心 | xīn | heart
皮肤 | pí fū | skin
`,
  health: `
健康 | jiàn kāng | healthy
舒服 | shū fu | comfortable; feeling well
病 | bìng | illness
生病 | shēng bìng | to get ill
感冒 | gǎn mào | a cold
发烧 | fā shāo | to have a fever
疼 | téng | painful, to hurt
头疼 | tóu téng | headache
药 | yào | medicine
休息 | xiū xi | to rest
`,
  colours: `
颜色 | yán sè | colour
红色 | hóng sè | red
橙色 | chéng sè | orange
黄色 | huáng sè | yellow
绿色 | lǜ sè | green
蓝色 | lán sè | blue
紫色 | zǐ sè | purple
粉色 | fěn sè | pink
棕色 | zōng sè | brown
白色 | bái sè | white
灰色 | huī sè | grey
黑色 | hēi sè | black
金色 | jīn sè | gold
银色 | yín sè | silver
深 | shēn | dark (colour); deep
浅 | qiǎn | light (colour); shallow
`,
  transport: `
车 | chē | vehicle
汽车 | qì chē | car
出租车 | chū zū chē | taxi
公交车 | gōng jiāo chē | bus (everyday word)
公共汽车 | gōng gòng qì chē | bus
地铁 | dì tiě | metro
火车 | huǒ chē | train
高铁 | gāo tiě | high-speed train
飞机 | fēi jī | plane
船 | chuán | boat, ship
自行车 | zì xíng chē | bicycle
摩托车 | mó tuō chē | motorcycle
电动车 | diàn dòng chē | e-bike, electric scooter
开车 | kāi chē | to drive
坐 | zuò | to sit; to take (transport)
骑 | qí | to ride
走路 | zǒu lù | to walk
到 | dào | to arrive
车站 | chē zhàn | station, stop
地铁站 | dì tiě zhàn | metro station
火车站 | huǒ chē zhàn | train station
机场 | jī chǎng | airport
停车场 | tíng chē chǎng | car park
路 | lù | road
红绿灯 | hóng lǜ dēng | traffic light
票 | piào | ticket
护照 | hù zhào | passport
签证 | qiān zhèng | visa
行李 | xíng li | luggage
`,
  directions: `
左 | zuǒ | left
右 | yòu | right
左边 | zuǒ biān | left side
右边 | yòu biān | right side
前面 | qián miàn | in front
后面 | hòu miàn | behind
上面 | shàng miàn | on top, above
下面 | xià miàn | under, below
里面 | lǐ miàn | inside
外面 | wài miàn | outside
中间 | zhōng jiān | in the middle
旁边 | páng biān | next to
对面 | duì miàn | opposite
附近 | fù jìn | nearby
近 | jìn | near
远 | yuǎn | far
一直走 | yì zhí zǒu | go straight on
拐 | guǎi | to turn
东 | dōng | east
南 | nán | south
西 | xī | west
北 | běi | north
`,
  places: `
酒店 | jiǔ diàn | hotel
饭店 | fàn diàn | restaurant
咖啡馆 | kā fēi guǎn | café
商店 | shāng diàn | shop
超市 | chāo shì | supermarket
商场 | shāng chǎng | shopping mall
市场 | shì chǎng | market
银行 | yín háng | bank
医院 | yī yuàn | hospital
药店 | yào diàn | pharmacy
邮局 | yóu jú | post office
学校 | xué xiào | school
大学 | dà xué | university
图书馆 | tú shū guǎn | library
博物馆 | bó wù guǎn | museum
电影院 | diàn yǐng yuàn | cinema
健身房 | jiàn shēn fáng | gym
公园 | gōng yuán | park
洗手间 | xǐ shǒu jiān | restroom, toilet
城市 | chéng shì | city
农村 | nóng cūn | countryside
海边 | hǎi biān | seaside
国家 | guó jiā | country, nation
北京 | Běi jīng | Beijing
上海 | Shàng hǎi | Shanghai
塔什干 | Tǎ shí gān | Tashkent
`,
  countries: `
英国 | Yīng guó | United Kingdom
德国 | Dé guó | Germany
法国 | Fǎ guó | France
意大利 | Yì dà lì | Italy
西班牙 | Xī bān yá | Spain
土耳其 | Tǔ ěr qí | Turkey
日本 | Rì běn | Japan
韩国 | Hán guó | South Korea
印度 | Yìn dù | India
加拿大 | Jiā ná dà | Canada
澳大利亚 | Ào dà lì yà | Australia
阿联酋 | Ā lián qiú | United Arab Emirates
哈萨克斯坦 | Hā sà kè sī tǎn | Kazakhstan
吉尔吉斯斯坦 | Jí ěr jí sī sī tǎn | Kyrgyzstan
塔吉克斯坦 | Tǎ jí kè sī tǎn | Tajikistan
土库曼斯坦 | Tǔ kù màn sī tǎn | Turkmenistan
`,
  languages: `
语言 | yǔ yán | language
中文 | Zhōng wén | Chinese (language)
汉语 | Hàn yǔ | Chinese (Mandarin)
英语 | Yīng yǔ | English
俄语 | É yǔ | Russian
乌兹别克语 | Wū zī bié kè yǔ | Uzbek
日语 | Rì yǔ | Japanese
韩语 | Hán yǔ | Korean
汉字 | Hàn zì | Chinese character
拼音 | pīn yīn | pinyin
声调 | shēng diào | tone
词 | cí | word
句子 | jù zi | sentence
翻译 | fān yì | to translate
`,
  shopping: `
钱 | qián | money
元 | yuán | yuan
多少钱 | duō shao qián | how much is it?
价格 | jià gé | price
贵 | guì | expensive
便宜 | pián yi | cheap
打折 | dǎ zhé | discount
付钱 | fù qián | to pay
现金 | xiàn jīn | cash
信用卡 | xìn yòng kǎ | credit card
支付宝 | Zhī fù bǎo | Alipay
试 | shì | to try (on)
换 | huàn | to exchange
退 | tuì | to return (an item)
送 | sòng | to give; to deliver
大号 | dà hào | large size
小号 | xiǎo hào | small size
`,
  school: `
书 | shū | book
本子 | běn zi | notebook
笔 | bǐ | pen
铅笔 | qiān bǐ | pencil
纸 | zhǐ | paper
课 | kè | lesson, class
教室 | jiào shì | classroom
黑板 | hēi bǎn | blackboard
作业 | zuò yè | homework
考试 | kǎo shì | exam
问题 | wèn tí | question; problem
答案 | dá àn | answer
学 | xué | to learn
学习 | xué xí | to study
教 | jiāo | to teach
读 | dú | to read aloud
写 | xiě | to write
练习 | liàn xí | to practise
懂 | dǒng | to understand
记 | jì | to remember
忘 | wàng | to forget
`,
  technology: `
手机 | shǒu jī | mobile phone
电话 | diàn huà | telephone
打电话 | dǎ diàn huà | to make a phone call
短信 | duǎn xìn | text message
电脑 | diàn nǎo | computer
笔记本电脑 | bǐ jì běn diàn nǎo | laptop
平板电脑 | píng bǎn diàn nǎo | tablet
屏幕 | píng mù | screen
键盘 | jiàn pán | keyboard
鼠标 | shǔ biāo | computer mouse
打印机 | dǎ yìn jī | printer
耳机 | ěr jī | headphones
相机 | xiàng jī | camera
照片 | zhào piàn | photo
视频 | shì pín | video
电视 | diàn shì | television
电池 | diàn chí | battery
充电 | chōng diàn | to charge (a battery)
充电器 | chōng diàn qì | charger
网络 | wǎng luò | network, internet
上网 | shàng wǎng | to go online
无线网 | wú xiàn wǎng | Wi-Fi
网站 | wǎng zhàn | website
账号 | zhàng hào | account
密码 | mì mǎ | password
登录 | dēng lù | to log in
下载 | xià zài | to download
上传 | shàng chuán | to upload
软件 | ruǎn jiàn | software
应用 | yìng yòng | app
游戏 | yóu xì | game
数据 | shù jù | data
电子邮件 | diàn zǐ yóu jiàn | email
微信 | Wēi xìn | WeChat
二维码 | èr wéi mǎ | QR code
机器人 | jī qì rén | robot
人工智能 | rén gōng zhì néng | artificial intelligence
`,
  hobbies: `
爱好 | ài hào | hobby
运动 | yùn dòng | sport, exercise
足球 | zú qiú | football
篮球 | lán qiú | basketball
游泳 | yóu yǒng | to swim
跑步 | pǎo bù | to run, jog
跳舞 | tiào wǔ | to dance
唱歌 | chàng gē | to sing
音乐 | yīn yuè | music
画画 | huà huà | to draw, paint
看书 | kàn shū | to read
电影 | diàn yǐng | film
照相 | zhào xiàng | to take photos
旅游 | lǚ yóu | to travel
玩 | wán | to play, have fun
`,
  feelings: `
爱 | ài | to love
开心 | kāi xīn | happy
高兴 | gāo xìng | glad, pleased
难过 | nán guò | sad
生气 | shēng qì | angry
害怕 | hài pà | afraid
担心 | dān xīn | worried
紧张 | jǐn zhāng | nervous
无聊 | wú liáo | bored, boring
笑 | xiào | to laugh, smile
哭 | kū | to cry
希望 | xī wàng | to hope
感谢 | gǎn xiè | to thank
`,
  verbs: `
吃 | chī | to eat
喝 | hē | to drink
去 | qù | to go
来 | lái | to come
回 | huí | to return
进来 | jìn lái | to come in
出去 | chū qù | to go out
看 | kàn | to look, to watch
听 | tīng | to listen
说 | shuō | to speak, to say
问 | wèn | to ask
回答 | huí dá | to answer
告诉 | gào su | to tell
买 | mǎi | to buy
卖 | mài | to sell
给 | gěi | to give
用 | yòng | to use
找 | zhǎo | to look for
有 | yǒu | to have; there is
要 | yào | to want; will
想 | xiǎng | to want to; to think
需要 | xū yào | to need
喜欢 | xǐ huan | to like
知道 | zhī dào | to know (a fact)
认识 | rèn shi | to know (a person)
觉得 | jué de | to feel, to think
能 | néng | can, be able to
会 | huì | can (know how to); will
做 | zuò | to do, to make
帮 | bāng | to help
等 | děng | to wait
住 | zhù | to live (somewhere)
开 | kāi | to open; to turn on
关 | guān | to close; to turn off
打开 | dǎ kāi | to open
开始 | kāi shǐ | to start
结束 | jié shù | to end
准备 | zhǔn bèi | to prepare
起床 | qǐ chuáng | to get up
睡觉 | shuì jiào | to sleep
洗 | xǐ | to wash
做饭 | zuò fàn | to cook
让 | ràng | to let
`,
  adjectives: `
大 | dà | big
小 | xiǎo | small
多 | duō | many, much
少 | shǎo | few, little
长 | cháng | long
短 | duǎn | short (length)
高 | gāo | tall, high
矮 | ǎi | short (height)
胖 | pàng | fat
瘦 | shòu | thin
重 | zhòng | heavy
轻 | qīng | light (weight)
快 | kuài | fast
慢 | màn | slow
早 | zǎo | early
晚 | wǎn | late
新 | xīn | new
旧 | jiù | old (things)
年轻 | nián qīng | young
老 | lǎo | old (people)
错 | cuò | wrong
难 | nán | difficult
容易 | róng yì | easy
干净 | gān jìng | clean
脏 | zāng | dirty
安静 | ān jìng | quiet
热闹 | rè nao | lively, busy
漂亮 | piào liang | beautiful
可爱 | kě ài | cute
有意思 | yǒu yì si | interesting
一样 | yí yàng | the same
`,
  'question words': `
谁 | shéi | who
哪儿 | nǎr | where
哪里 | nǎ lǐ | where
几 | jǐ | how many (small numbers)
多少 | duō shao | how many, how much
怎么 | zěn me | how
为什么 | wèi shén me | why
什么时候 | shén me shí hou | when
`,
};

export function dictionaryRaw() {
  const out = [];
  for (const [topic, block] of Object.entries(RAW)) {
    for (const line of block.trim().split('\n')) {
      const [hz, py, en] = line.split('|').map(s => s.trim());
      if (hz) out.push({ id: 'd_' + hz + '_' + topic, hz, py, en, topic });
    }
  }
  return out;
}

// Each word gets `ord` for the logical order: topic order, then course words (in the order they
// are taught), then the topic's dictionary list in the order written above (e.g. numbers 0, 1, 2…).
export function buildDictionary(courseWords) {
  const topicIdx = Object.fromEntries(TOPICS.map(([id], i) => [id, i]));
  const map = new Map();
  courseWords.forEach((w, i) => map.set(w.hz + '|' + w.py, { ...w, ord: (topicIdx[w.topic] ?? 99) * 100000 + i }));
  dictionaryRaw().forEach((w, i) => {
    const key = w.hz + '|' + w.py;
    const prev = map.get(key);
    if (prev && prev.lessonId) {
      // word appears in the course too: keep course data, but use the dictionary's logical position
      map.set(key, { ...w, ...prev, topic: w.topic, ord: (topicIdx[w.topic] ?? 99) * 100000 + 50000 + i });
    } else if (!prev) {
      map.set(key, { ...w, ord: (topicIdx[w.topic] ?? 99) * 100000 + 50000 + i });
    }
  });
  return [...map.values()];
}

// Course content. Sentences use the "hanzi:pinyin/hanzi:pinyin/。" token format
// (one token per word; pinyin has one syllable per character, separated by spaces).
// Words: [id, hanzi, pinyin, english, topic]

// Pinyin for every character used as a sound sample in Module 0.
export const SOUND_PY = {
  妈: 'mā', 麻: 'má', 马: 'mǎ', 骂: 'mà', 吗: 'ma', 诗: 'shī', 十: 'shí', 使: 'shǐ', 是: 'shì',
  八: 'bā', 拔: 'bá', 把: 'bǎ', 爸: 'bà', 啊: 'ā', 哦: 'ò', 饿: 'è', 一: 'yī', 姨: 'yí', 椅: 'yǐ', 亿: 'yì',
  五: 'wǔ', 雨: 'yǔ', 女: 'nǚ', 绿: 'lǜ', 路: 'lù', 怕: 'pà', 趴: 'pā', 发: 'fā', 大: 'dà', 踏: 'tà', 他: 'tā',
  拿: 'ná', 拉: 'lā', 哥: 'gē', 科: 'kē', 渴: 'kě', 喝: 'hē', 鸡: 'jī', 七: 'qī', 西: 'xī', 知: 'zhī', 吃: 'chī',
  热: 'rè', 字: 'zì', 次: 'cì', 四: 'sì', 好: 'hǎo', 买: 'mǎi', 卖: 'mài', 累: 'lèi', 走: 'zǒu', 饭: 'fàn',
  放: 'fàng', 山: 'shān', 伤: 'shāng', 忙: 'máng', 冷: 'lěng', 中: 'zhōng',
};

export const MODULES = [
  {
    id: 'm0',
    title: 'Sounds: Pinyin & Tones',
    goal: 'Hear and say the four tones and the main sounds of Mandarin.',
    lessons: [
      {
        id: '0.1', kind: 'sounds', title: 'The four tones',
        intro: 'Mandarin has four tones plus a light "neutral" tone. The same syllable with a different tone is a different word.',
        tips: [
          ['1st tone  ˉ', 'High and flat, like singing a long note: mā'],
          ['2nd tone  ˊ', 'Rising, like asking "huh?": má'],
          ['3rd tone  ˇ', 'Low, dipping down: mǎ'],
          ['4th tone  ˋ', 'Falling sharply, like a command "No!": mà'],
          ['Neutral', 'Short and light, no tone mark: ma'],
        ],
        sounds: [
          ['mā', '妈', 'mum'], ['má', '麻', 'hemp'], ['mǎ', '马', 'horse'], ['mà', '骂', 'to scold'], ['ma', '吗', 'question word'],
          ['shī', '诗', 'poem'], ['shí', '十', 'ten'], ['shǐ', '使', 'to use'], ['shì', '是', 'to be'],
          ['bā', '八', 'eight'], ['bá', '拔', 'to pull'], ['bǎ', '把', 'to hold'], ['bà', '爸', 'dad'],
        ],
        toneSets: [['妈', '麻', '马', '骂'], ['诗', '十', '使', '是'], ['八', '拔', '把', '爸']],
      },
      {
        id: '0.2', kind: 'sounds', title: 'Simple vowels',
        intro: 'Six basic vowels: a o e i u ü. "ü" is said like "ee" with rounded lips (like German ü).',
        tips: [
          ['a', 'Open "ah", as in "father"'],
          ['o', '"aw" with rounded lips'],
          ['e', 'Like "uh" said from the back of the throat'],
          ['i', '"ee" as in "see" (written yi alone)'],
          ['u', '"oo" as in "food" (written wu alone)'],
          ['ü', '"ee" with rounded lips (written yu alone)'],
        ],
        sounds: [
          ['ā', '啊', 'ah!'], ['ò', '哦', 'oh!'], ['è', '饿', 'hungry'],
          ['yī', '一', 'one'], ['wǔ', '五', 'five'], ['yǔ', '雨', 'rain'],
          ['nǚ', '女', 'woman'], ['lǜ', '绿', 'green'], ['lù', '路', 'road'],
        ],
        pairs: [['五', '雨'], ['路', '绿'], ['一', '雨'], ['饿', '啊']],
        toneSets: [['一', '姨', '椅', '亿']],
      },
      {
        id: '0.3', kind: 'sounds', title: 'Consonants I',
        intro: 'b / p, d / t, g / k come in pairs: the second one has a strong puff of air. Hold a hand in front of your mouth to feel it.',
        tips: [
          ['b · p', 'b is soft; p has a puff of air'],
          ['d · t', 'd is soft; t has a puff of air'],
          ['g · k', 'g is soft; k has a puff of air'],
          ['m f n l h', 'Close to English; h is a little rougher, like Scottish "loch"'],
        ],
        sounds: [
          ['bā', '八', 'eight'], ['pà', '怕', 'to fear'], ['mǎ', '马', 'horse'], ['fā', '发', 'to send'],
          ['dà', '大', 'big'], ['tā', '他', 'he'], ['ná', '拿', 'to take'], ['lā', '拉', 'to pull'],
          ['gē', '哥', 'older brother'], ['kě', '渴', 'thirsty'], ['hē', '喝', 'to drink'],
        ],
        pairs: [['八', '趴'], ['大', '踏'], ['哥', '科'], ['拿', '拉']],
      },
      {
        id: '0.4', kind: 'sounds', title: 'Consonants II',
        intro: 'j q x are said with the tongue flat behind the lower teeth. zh ch sh r curl the tongue up. z c s are like "dz", "ts", "s".',
        tips: [
          ['j · q · x', 'Tongue flat, smile slightly: jī, qī, xī'],
          ['zh · ch · sh · r', 'Tongue tip curled back: zhī, chī, shí, rè'],
          ['z · c · s', 'Tongue behind upper teeth: "dz", "ts", "s"'],
        ],
        sounds: [
          ['jī', '鸡', 'chicken'], ['qī', '七', 'seven'], ['xī', '西', 'west'],
          ['zhī', '知', 'to know'], ['chī', '吃', 'to eat'], ['shí', '十', 'ten'], ['rè', '热', 'hot'],
          ['zì', '字', 'character'], ['cì', '次', 'time (occurrence)'], ['sì', '四', 'four'],
        ],
        pairs: [['十', '四'], ['吃', '次'], ['知', '字'], ['七', '鸡'], ['西', '七']],
      },
      {
        id: '0.5', kind: 'sounds', title: 'Vowel combinations',
        intro: 'Vowels combine: ai, ei, ao, ou… and -n / -ng endings. -n is said at the front of the mouth, -ng at the back (like "sing").',
        tips: [
          ['ai · ei', '"eye" · "ay"'],
          ['ao · ou', '"ow" (cow) · "oh"'],
          ['-an · -ang', 'fàn (front) · fàng (back, like "sing")'],
          ['-en · -eng', 'mén · lěng'],
        ],
        sounds: [
          ['hǎo', '好', 'good'], ['mǎi', '买', 'to buy'], ['mài', '卖', 'to sell'], ['lèi', '累', 'tired'],
          ['zǒu', '走', 'to walk'], ['fàn', '饭', 'meal'], ['fàng', '放', 'to put'],
          ['shān', '山', 'mountain'], ['shāng', '伤', 'wound'], ['máng', '忙', 'busy'], ['lěng', '冷', 'cold'], ['zhōng', '中', 'middle'],
        ],
        pairs: [['饭', '放'], ['山', '伤'], ['买', '卖'], ['走', '好']],
      },
      {
        id: '0.6', kind: 'sounds', title: 'Tone changes',
        intro: 'Some tones change in speech. Two 3rd tones in a row: the first becomes 2nd (nǐ hǎo sounds like ní hǎo). 不 bù becomes bú before a 4th tone. 一 yī changes too.',
        tips: [
          ['3 + 3 → 2 + 3', '你好 nǐ hǎo is said ní hǎo'],
          ['不 before 4th tone', '不是 bù shì → bú shì'],
          ['一 before 4th tone', '一个 yī gè → yí ge'],
          ['一 before 1st/2nd/3rd', '一天 yī tiān → yì tiān'],
        ],
        sounds: [
          ['ní hǎo', '你好', 'hello (said ní hǎo)'], ['hén hǎo', '很好', 'very good (said hén hǎo)'],
          ['bú shì', '不是', 'is not'], ['bú yào', '不要', "don't want"], ['bù hǎo', '不好', 'not good'],
          ['yí ge', '一个', 'one (of something)'], ['yì tiān', '一天', 'one day'],
        ],
        choices: [
          ['你好', 'ní hǎo', ['nǐ hǎo', 'nì hǎo', 'ní hào']],
          ['不是', 'bú shì', ['bù shì', 'bū shì', 'bǔ shì']],
          ['一个', 'yí ge', ['yī ge', 'yì ge', 'yǐ ge']],
          ['一天', 'yì tiān', ['yí tiān', 'yī tián', 'yǐ tiān']],
          ['很好', 'hén hǎo', ['hěn hǎo', 'hèn hǎo', 'hēn hǎo']],
          ['不好', 'bù hǎo', ['bú hǎo', 'bū hǎo', 'bǔ hǎo']],
        ],
      },
    ],
  },
  {
    id: 'm1',
    title: 'Hello & Me',
    goal: 'Greet people, introduce yourself and say where you are from.',
    lessons: [
      {
        id: '1.1', title: 'Greetings & polite words',
        words: [
          ['nihao', '你好', 'nǐ hǎo', 'hello', 'greetings'],
          ['ninhao', '您好', 'nín hǎo', 'hello (polite)', 'greetings'],
          ['zaijian', '再见', 'zài jiàn', 'goodbye', 'greetings'],
          ['xiexie', '谢谢', 'xiè xie', 'thank you', 'greetings'],
          ['bukeqi', '不客气', 'bú kè qi', "you're welcome", 'greetings'],
          ['duibuqi', '对不起', 'duì bu qǐ', 'sorry', 'greetings'],
          ['meiguanxi', '没关系', 'méi guān xi', "it's OK / never mind", 'greetings'],
        ],
        pattern: {
          title: 'Polite pairs',
          note: 'These are fixed phrases: learn them as whole chunks. 您 nín is the polite form of 你 nǐ, used with older people or strangers.',
          examples: [
            ['谢谢:xiè xie/！/不客气:bú kè qi/。', 'Thank you! — You\'re welcome.'],
            ['对不起:duì bu qǐ/！/没关系:méi guān xi/。', 'Sorry! — It\'s OK.'],
            ['您好:nín hǎo/！', 'Hello! (polite)'],
          ],
        },
        write: ['人', '好'],
        writeNote: '好 = 女 (woman) + 子 (child). Two simple parts make one character.',
        dialogue: [
          ['A', '你好:nǐ hǎo/！', 'Hello!'],
          ['B', '你好:nǐ hǎo/！', 'Hello!'],
          ['A', '对不起:duì bu qǐ/！', 'Sorry!'],
          ['B', '没关系:méi guān xi/。', "It's OK."],
          ['A', '谢谢:xiè xie/！/再见:zài jiàn/！', 'Thanks! Bye!'],
          ['B', '不客气:bú kè qi/。/再见:zài jiàn/！', "You're welcome. Bye!"],
        ],
      },
      {
        id: '1.2', title: 'Me, you, them + 是',
        words: [
          ['wo', '我', 'wǒ', 'I, me', 'pronouns'],
          ['ni', '你', 'nǐ', 'you', 'pronouns'],
          ['ta_he', '他', 'tā', 'he, him', 'pronouns'],
          ['ta_she', '她', 'tā', 'she, her', 'pronouns'],
          ['women', '我们', 'wǒ men', 'we, us', 'pronouns'],
          ['shi', '是', 'shì', 'to be (am, is, are)', 'verbs'],
          ['bu', '不', 'bù', 'not, no', 'grammar'],
        ],
        pattern: {
          title: 'A 是 B · A 不是 B',
          note: '是 shì links two nouns: "A is B". Put 不 in front to say "is not". 不 bù becomes bú before a 4th tone, so 不是 is said bú shì. 他 and 她 sound the same (tā): only the writing differs.',
          examples: [
            ['我:wǒ/是:shì/伊斯坎德尔:Yī sī kǎn dé ěr/。', 'I am Iskander.'],
            ['他:tā/是:shì/王明:Wáng Míng/。', 'He is Wang Ming.'],
            ['我:wǒ/不是:bú shì/王明:Wáng Míng/。', 'I am not Wang Ming.'],
          ],
        },
        write: ['我', '不'],
        writeNote: '我 has 7 strokes. Watch the order carefully: it is one of the most used characters.',
        dialogue: [
          ['A', '你好:nǐ hǎo/！/我:wǒ/是:shì/王明:Wáng Míng/。', "Hello! I'm Wang Ming."],
          ['B', '你好:nǐ hǎo/！/我:wǒ/是:shì/伊斯坎德尔:Yī sī kǎn dé ěr/。', "Hello! I'm Iskander."],
          ['A', '她:tā/是:shì/安娜:Ān nà/。', 'She is Anna.'],
          ['B', '安娜:Ān nà/，/你好:nǐ hǎo/！', 'Anna, hello!'],
        ],
      },
      {
        id: '1.3', title: 'Names',
        words: [
          ['jiao', '叫', 'jiào', 'to be called', 'verbs'],
          ['shenme', '什么', 'shén me', 'what', 'question words'],
          ['mingzi', '名字', 'míng zi', 'name', 'people'],
          ['xing', '姓', 'xìng', 'surname; to be surnamed', 'people'],
          ['ne', '呢', 'ne', '…and you? (follow-up question)', 'grammar'],
        ],
        pattern: {
          title: '你叫什么名字？ · …呢？',
          note: 'Question words stay in the same place as the answer: 你叫什么名字？ "You are called what name?" → 我叫… "I am called…". Add 呢 ne after a word to bounce the same question back: 你呢？ "And you?"',
          examples: [
            ['你:nǐ/叫:jiào/什么:shén me/名字:míng zi/？', "What's your name?"],
            ['我:wǒ/叫:jiào/伊斯坎德尔:Yī sī kǎn dé ěr/。/你:nǐ/呢:ne/？', "I'm called Iskander. And you?"],
            ['我:wǒ/姓:xìng/王:Wáng/。', 'My surname is Wang.'],
          ],
        },
        write: ['口', '叫'],
        writeNote: '口 means "mouth". It sits on the left of many "speaking" characters: 叫, 吗, 呢.',
        dialogue: [
          ['A', '你好:nǐ hǎo/！/你:nǐ/叫:jiào/什么:shén me/名字:míng zi/？', "Hello! What's your name?"],
          ['B', '我:wǒ/叫:jiào/伊斯坎德尔:Yī sī kǎn dé ěr/。/你:nǐ/呢:ne/？', "I'm Iskander. And you?"],
          ['A', '我:wǒ/姓:xìng/王:Wáng/，/叫:jiào/王明:Wáng Míng/。', "My surname is Wang. I'm Wang Ming."],
        ],
      },
      {
        id: '1.4', title: 'Where are you from?',
        words: [
          ['na', '哪', 'nǎ', 'which', 'question words'],
          ['guo', '国', 'guó', 'country', 'places'],
          ['ren', '人', 'rén', 'person, people', 'people'],
          ['zhongguo', '中国', 'Zhōng guó', 'China', 'countries'],
          ['wuzibiekesitan', '乌兹别克斯坦', 'Wū zī bié kè sī tǎn', 'Uzbekistan', 'countries'],
          ['eluosi', '俄罗斯', 'É luó sī', 'Russia', 'countries'],
          ['meiguo', '美国', 'Měi guó', 'USA', 'countries'],
        ],
        pattern: {
          title: 'Country + 人',
          note: 'Add 人 rén (person) after a country to make a nationality: 中国 China → 中国人 Chinese person. To ask: 你是哪国人？ "You are which-country person?"',
          examples: [
            ['你:nǐ/是:shì/哪:nǎ/国:guó/人:rén/？', 'Where are you from?'],
            ['我:wǒ/是:shì/乌兹别克斯坦:Wū zī bié kè sī tǎn/人:rén/。', "I'm Uzbek."],
            ['他:tā/是:shì/中国:Zhōng guó/人:rén/。', 'He is Chinese.'],
          ],
        },
        write: ['中', '国'],
        writeNote: '中国 literally means "Middle Kingdom". 中 is a box with a line through the middle.',
        dialogue: [
          ['A', '你:nǐ/是:shì/哪:nǎ/国:guó/人:rén/？', 'Where are you from?'],
          ['B', '我:wǒ/是:shì/乌兹别克斯坦:Wū zī bié kè sī tǎn/人:rén/。/你:nǐ/呢:ne/？', "I'm Uzbek. And you?"],
          ['A', '我:wǒ/是:shì/中国:Zhōng guó/人:rén/。', "I'm Chinese."],
        ],
      },
      {
        id: '1.5', title: 'Yes/no questions',
        words: [
          ['ma', '吗', 'ma', 'question particle (yes/no)', 'grammar'],
          ['hen', '很', 'hěn', 'very', 'grammar'],
          ['ye', '也', 'yě', 'also, too', 'grammar'],
          ['hao', '好', 'hǎo', 'good, well', 'adjectives'],
          ['mang', '忙', 'máng', 'busy', 'adjectives'],
          ['lei', '累', 'lèi', 'tired', 'adjectives'],
        ],
        pattern: {
          title: 'Statement + 吗？',
          note: 'Turn any statement into a yes/no question by adding 吗 ma at the end. With adjectives Chinese uses 很 hěn ("very") where English uses "am/is": 我很忙 = "I\'m busy". 也 yě ("also") goes before the verb or adjective.',
          examples: [
            ['你:nǐ/忙:máng/吗:ma/？', 'Are you busy?'],
            ['我:wǒ/很:hěn/忙:máng/。', "I'm busy."],
            ['我:wǒ/也:yě/很:hěn/忙:máng/。', "I'm busy too."],
          ],
        },
        write: ['吗'],
        writeNote: '吗 = 口 (mouth) + 马 (horse, sounds like mǎ). The mouth part says "this is a spoken word", the horse part gives the sound.',
        dialogue: [
          ['A', '你:nǐ/好:hǎo/吗:ma/？', 'How are you?'],
          ['B', '我:wǒ/很:hěn/好:hǎo/，/你:nǐ/呢:ne/？', "I'm fine, and you?"],
          ['A', '我:wǒ/也:yě/很:hěn/好:hǎo/。', "I'm fine too."],
          ['B', '你:nǐ/忙:máng/吗:ma/？', 'Are you busy?'],
          ['A', '我:wǒ/不:bù/忙:máng/。', "I'm not busy."],
        ],
      },
      {
        id: '1.6', kind: 'review', title: 'Review: at the airport',
        intro: 'No new words. Everything from Module 1 comes together in one conversation.',
        reviewOf: ['1.1', '1.2', '1.3', '1.4', '1.5'],
        write: ['人', '好', '我', '不', '叫', '中', '国', '吗'],
        dialogue: [
          ['A', '你好:nǐ hǎo/！/你:nǐ/是:shì/伊斯坎德尔:Yī sī kǎn dé ěr/吗:ma/？', 'Hello! Are you Iskander?'],
          ['B', '是:shì/，/我:wǒ/是:shì/伊斯坎德尔:Yī sī kǎn dé ěr/。/你:nǐ/叫:jiào/什么:shén me/名字:míng zi/？', "Yes, I'm Iskander. What's your name?"],
          ['A', '我:wǒ/叫:jiào/王明:Wáng Míng/。/你:nǐ/累:lèi/吗:ma/？', "I'm Wang Ming. Are you tired?"],
          ['B', '我:wǒ/不:bù/累:lèi/，/我:wǒ/很:hěn/好:hǎo/。/谢谢:xiè xie/！', "I'm not tired, I'm fine. Thanks!"],
          ['A', '不客气:bú kè qi/！', "You're welcome!"],
        ],
      },
    ],
  },
  // Upcoming modules (shown locked on the map until content is written)
  { id: 'm2', title: 'Numbers & Money', goal: 'Count, ask prices, bargain.', lessons: [], soon: true },
  { id: 'm3', title: 'Food & Ordering', goal: 'Order in a restaurant or café.', lessons: [], soon: true },
  { id: 'm4', title: 'Getting Around', goal: 'Ask the way, take a taxi or metro.', lessons: [], soon: true },
  { id: 'm5', title: 'Time & Dates', goal: 'Times, days, making plans.', lessons: [], soon: true },
  { id: 'm6', title: 'Hotel & Shopping', goal: 'Check in, ask for things, sizes and colours.', lessons: [], soon: true },
  { id: 'm7', title: 'People & Family', goal: 'Talk about family and work.', lessons: [], soon: true },
  { id: 'm8', title: 'Likes & Plans', goal: 'Small talk: likes, wants, experiences.', lessons: [], soon: true },
  { id: 'm9', title: 'Help & Problems', goal: 'Not understanding, asking for help, emergencies.', lessons: [], soon: true },
];

export function allLessons() {
  return MODULES.flatMap(m => m.lessons.map(l => ({ ...l, moduleId: m.id })));
}

export function lessonById(id) {
  return allLessons().find(l => l.id === id);
}

export function courseWords() {
  const out = [];
  for (const l of allLessons()) for (const w of l.words || []) out.push(toWord(w, l.id));
  return out;
}

export function toWord([id, hz, py, en, topic], lessonId) {
  return { id, hz, py, en, topic, lessonId };
}

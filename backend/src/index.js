import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Groq from 'groq-sdk';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

let dbAvailable = true;
let memConvId = 1;
const memConversations = new Map();
async function initDb() {
  try {
    await prisma.$connect();
  } catch (_) {
    dbAvailable = false;
  }
}
initDb();

const groqApiKey = process.env.GROQ_API_KEY || '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';
const groqModel = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

if (!groqApiKey) {
  console.warn(
    '⚠️ GROQ_API_KEY тогтоогдоогүй байна. Карьерын чатбот ажиллахын тулд .env файлд GROQ_API_KEY нэмээрэй.',
  );
}

const groq = new Groq({
  apiKey: groqApiKey,
});

const BASE_INSTRUCTION =
  'Та Монголын өв, уламжлал, ахуй соёлын талаар тайлбар өгдөг AI туслах юм. Монгол хэлээр хариулж, мэдээллээ бодитой, товч өг.';

function buildHeritagePrompt(userText) {
  return `Та Монголын уламжлал, соёл, ахуй, угсаа гарвал, эд өлгийн зүйл, зан үйлийн талаар тайлбарладаг AI туслах юм.

Хэрэглэгчийн асуултыг ойлгож, тухайн ойлголтын утга, түүхэн гарал, хэрэглээ, өнөө үеийн ач холбогдлыг товч, ойлгомжтой тайлбарла.

Хэрэглэгчийн текст:

"${userText}"

Хариулт нь:

- Товч бөгөөд ойлгомжтой
- Монгол уламжлал, соёлын талаарх гол санааг тодорхой гаргасан
- Хэрэв боломжтой бол жишээ, товч түүхэн тайлбар, орчин үеийн хэрэглээг дурдсан байна`;
}

app.use(cors());
app.use(express.json());

// Эрүүл эсэх шалгах
app.get('/health', (req, res) => {
  res.json({ ok: true });
});

// Монгол өв соёлын тайлбарлагч чат – Groq + Prisma (PostgreSQL)
app.post('/api/career-chat', async (req, res) => {
  try {
    const { message, conversationId } = req.body || {};

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'message талбар шаардлагатай' });
    }

    if (!groqApiKey) {
      return res
        .status(500)
        .json({ error: 'GROQ_API_KEY тохируулаагүй байна (backend).' });
    }

    let conversation;
    if (dbAvailable) {
      if (conversationId) {
        conversation = await prisma.careerConversation.findUnique({ where: { id: conversationId } });
      }
      if (!conversation) {
        conversation = await prisma.careerConversation.create({ data: {} });
      }
      await prisma.careerMessage.create({ data: { conversationId: conversation.id, role: 'user', text: message } });
    } else {
      const idNum = Number(conversationId);
      if (idNum && memConversations.has(idNum)) {
        conversation = memConversations.get(idNum);
      }
      if (!conversation) {
        conversation = { id: memConvId++, createdAt: new Date(), messages: [] };
        memConversations.set(conversation.id, conversation);
      }
      conversation.messages.push({ role: 'user', text: message, createdAt: new Date() });
    }

    const completion = await groq.chat.completions.create({
      model: groqModel,
      messages: [
        { role: 'system', content: BASE_INSTRUCTION },
        { role: 'user', content: buildHeritagePrompt(message) },
      ],
      max_tokens: 200,
      temperature: 0.7,
      top_p: 1.0,
    });

    const answer =
      completion?.choices?.[0]?.message?.content?.trim() ||
      'Одоогоор хариу гаргаж чадсангүй.';

    let replyText = answer;
    if (dbAvailable) {
      const botMsg = await prisma.careerMessage.create({ data: { conversationId: conversation.id, role: 'assistant', text: answer } });
      replyText = botMsg.text;
    } else {
      conversation.messages.push({ role: 'assistant', text: answer, createdAt: new Date() });
    }

    res.json({
      conversationId: conversation.id,
      answer: replyText,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Дотоод серверийн алдаа' });
  }
});

// Нэг ярианы түүх авах
app.get('/api/career-chat/:conversationId', async (req, res) => {
  try {
    const id = Number(req.params.conversationId);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'conversationId буруу' });
    }

    if (dbAvailable) {
      const conversation = await prisma.careerConversation.findUnique({ where: { id }, include: { messages: { orderBy: { createdAt: 'asc' } } } });
      if (!conversation) {
        return res.status(404).json({ error: 'Яриа олдсонгүй' });
      }
      res.json(conversation);
    } else {
      if (!memConversations.has(id)) {
        return res.status(404).json({ error: 'Яриа олдсонгүй' });
      }
      const conv = memConversations.get(id);
      res.json(conv);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Дотоод серверийн алдаа' });
  }
});

// Game-ийн асуултууд авах
app.get('/api/game-questions', async (req, res) => {
  try {
    if (!dbAvailable) {
      return res.json([]);
    }
    const questions = await prisma.gameQuestion.findMany({
      orderBy: { id: 'asc' },
    });
    res.json(
      questions.map((q) => ({
        id: q.id,
        word: q.prompt,
        options: q.options,
        correct: q.correct,
      })),
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Game асуулт уншихад алдаа гарлаа' });
  }
});

const wordCards = [
  {
    word: 'Эмээл',
    pronunciation: 'Emeel',
    date: 'NOVEMBER 30, 2025',
    image: '/emeel.png',
    meaning:
      'Морь унахад хүнийг тухтай, тогтвортой суулгах зориулалттай мод, арьсаар хийсэн суудал.',
    examples: [
      'Эмээл нь унах үед тэнцвэрийг хамгаалдаг.',
      'Зөв эмээл тавих нь морийг зовоохгүй, унахад илүү хялбар болгодог.',
      'Уламжлалт эмээл арьс, модоор хийгддэг.'
    ]
  },
  {
    word: 'Хазаар',
    pronunciation: 'Hazaar',
    date: 'NOVEMBER 30, 2025',
    image: '/hazaar.png',
    meaning:
      'Морьдын толгойд углаж, амьтныг барьж жолоодох зориулалттай тоног хэрэгсэл.',
    examples: [
      'Хазаарыг зөөлөн жолоодсоноор морь тайван явдаг.',
      'Хазаар сайн таарсан бол морь илүү захирагдмал болдог.',
      'Уралдаанчид хазаар барилтаараа морийг хурд, чиглэлд оруулдаг.'
    ]
  },
  {
    word: 'Унь',
    pronunciation: 'Uni',
    date: 'NOVEMBER 30, 2025',
    image: '/uni.png',
    meaning:
      'Монгол гэрийн дээврийг тогтоох нарийн урт мод, тооноос хананд хүрч тогтдог хэсэг.',
    examples: [
      'Унь нь тооно болон хананд холбогдож гэрийн дээврийг бүрдүүлдэг.',
      'Гэрийн бат бөх байдалд уньнуудын зөв байрлал чухал.',
      'Унь олон тоогоор нийлж гэрийн дээвэр бүтдэг.'
    ]
  },
  {
    word: 'Тооно',
    pronunciation: 'Toono',
    date: 'NOVEMBER 30, 2025',
    image: '/toono.png',
    meaning:
      'Гэрийн орой дээр байрлах дугуй цагираг бөгөөд уньнуудыг түгжин барьдаг хэсэг.',
    examples: [
      'Тооноор гэрт гэрэл, агаар ордог.',
      'Гэрийн дээврийг тогтвортой барихад тооно чухал үүрэгтэй.',
      'Өвөл тооноор утаа гардаг учир утааны зам болдог.'
    ]
  },
  {
    word: 'Багана',
    pronunciation: 'Bagana',
    date: 'NOVEMBER 30, 2025',
    image: '/bagana.png',
    meaning: 'Гэр болон барилгын гол ачааг даах босоо тулгуур мод.',
    examples: [
      'Гэрийн багана дээврийг дааж тогтоодог.',
      'Баганыг сайн модоор хийх нь гэрийн бат бөх байдлыг нэмэгдүүлдэг.',
      'Багана унах нь гэр бүхэлдээ тогтворгүй болох эрсдэлтэй.'
    ]
  },
  {
    word: 'Хана',
    pronunciation: 'Hana',
    date: 'NOVEMBER 30, 2025',
    image: '/hana.png',
    meaning: 'Гэрийн нударган тор маягийн эвхэгддэг хашлага хэсэг.',
    examples: [
      'Хананууд эвхэгддэг учир нүүхэд маш авсаархан.',
      'Гэрийн дулаан хадгалахад ханыг сайтар уядаг.',
      'Хана олон зангидаатай тул маш бат бөх байдаг.'
    ]
  },
  {
    word: 'Угалз',
    pronunciation: 'Ugalz',
    date: 'NOVEMBER 30, 2025',
    image: '/ugalz.png',
    meaning: 'Монгол урлагт хэрэглэгддэг уран нуман, мушгиа хээг хэлнэ.',
    examples: [
      'Угалз хээ нь эв нэгдэл, төгс өрнөлийн бэлгэдэлтэй.',
      'Тавилга, хувцас, барилгын чимэглэлд өргөн хэрэглэгддэг.',
      'Уламжлалт урчууд угалзыг нарийн гар ажиллагаагаар зурдаг.'
    ]
  },
  {
    word: 'Уурга',
    pronunciation: 'Urga',
    date: 'NOVEMBER 30, 2025',
    image: '/uurga.png',
    meaning:
      'Морь, мал барихад хэрэглэдэг урт модон саваа, үзүүрт нь уяа хийсэн хэрэгсэл.',
    examples: [
      'Уургаар адуу барих нь монголчуудын эртний арга.',
      'Уурга урт байх тусам мал барихад хялбар болдог.',
      'Адууны уяа уурганд сайн тохирдог.'
    ]
  },
  {
    word: 'Торго',
    pronunciation: 'Torgo',
    date: 'NOVEMBER 30, 2025',
    image: '/torgo.png',
    meaning:
      'Монголчуудын уламжлалт тансаг даавуу, ихэвчлэн торгон утсаар нэхэгдсэн.',
    examples: [
      'Торгоор дээл хийвэл маш гоёмсог болдог.',
      'Эрт цагт торгыг ховор тансаг эд гэж үздэг байсан.',
      'Торгоны өнгө нь баяр ёслолд онцгой хэрэглэгддэг.'
    ]
  },
  {
    word: 'Дээл',
    pronunciation: 'Deel',
    date: 'NOVEMBER 30, 2025',
    image: '/deel.png',
    meaning: 'Монголчуудын уламжлалт үндэсний хувцас.',
    examples: [
      'Дээл нь улирал бүрт өөр өөр материалаар хийгддэг.',
      'Наадмын үеэр хүмүүс гоёмсог дээл өмсдөг.',
      'Дээл нь монголчуудын соёлын бэлгэдэл.'
    ]
  },
  {
    word: 'Нэхий',
    pronunciation: 'Nekhii',
    date: 'NOVEMBER 30, 2025',
    image: '/nekhii.png',
    meaning:
      'Малын арьсыг боловсруулж, дулаан хадгалах зориулалттай эдлэл.',
    examples: [
      'Нэхий дээл өвөл дулаан байдаг.',
      'Нэхийгээр гутал, дээл хийдэг.',
      'Нэхий нь монголчуудын өвлийн гол хэрэглээ.'
    ]
  },
  {
    word: 'Тулга',
    pronunciation: 'Tulga',
    date: 'NOVEMBER 30, 2025',
    image: '/tulga.png',
    meaning: 'Гэрийн голд байрлах гурван чулуу, гал түлэх суурь.',
    examples: [
      'Тулганд гал асаах нь гэрийн амьдралын эхлэл.',
      'Тулга гурван чулуугаар тогтоно.',
      'Тулга нь монголчуудын ахуйд галын төвийг илэрхийлдэг.'
    ]
  },
];

let useInMemoryWords = false;
async function initWords() {
  try {
    const count = await prisma.wordCard.count();
    if (count === 0) {
      await prisma.wordCard.createMany({
        data: wordCards.map((w) => ({
          word: w.word,
          pronunciation: w.pronunciation,
          date: w.date,
          image: w.image,
          meaning: w.meaning,
          examples: w.examples,
        })),
      });
    }
  } catch (e) {
    useInMemoryWords = true;
  }
}
initWords();

app.get('/api/word-cards', async (req, res) => {
  try {
    if (useInMemoryWords) {
      return res.json(wordCards);
    }
    const items = await prisma.wordCard.findMany({ orderBy: { createdAt: 'asc' } });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Үгс татахад алдаа гарлаа' });
  }
});

app.get('/api/word-questions', (req, res) => {
  try {
    const shuffled = [...wordCards].sort(() => Math.random() - 0.5);
    
    const selectedWords = shuffled.slice(0, 6);
    
    const questions = selectedWords.map((card) => ({
      type: 'quiz',
      word: card.word,
      pronunciation: card.pronunciation,
      meaning: card.meaning,
      image: card.image,
    }));
    
    res.json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Асуултууд үүсгэж чадсангүй' });
  }
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`✅ Backend сервер ${PORT} порт дээр ажиллаж байна`);
});

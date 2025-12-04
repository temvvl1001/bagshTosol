import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Groq from 'groq-sdk';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

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

    // Хэрэв conversationId ирээгүй бол шинэ яриа эхлүүлнэ
    let conversation;
    if (conversationId) {
      conversation = await prisma.careerConversation.findUnique({
        where: { id: conversationId },
      });
    }

    if (!conversation) {
      conversation = await prisma.careerConversation.create({
        data: {},
      });
    }

    // Хэрэглэгчийн мессежийг хадгалах
    const userMsg = await prisma.careerMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'user',
        text: message,
      },
    });

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

    const botMsg = await prisma.careerMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'assistant',
        text: answer,
      },
    });

    res.json({
      conversationId: conversation.id,
      answer: botMsg.text,
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

    const conversation = await prisma.careerConversation.findUnique({
      where: { id },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Яриа олдсонгүй' });
    }

    res.json(conversation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Дотоод серверийн алдаа' });
  }
});

// Game-ийн асуултууд авах
app.get('/api/game-questions', async (req, res) => {
  try {
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

// Үгийн асуултууд (Home дээрх үгсээс)
const wordCards = [
  { word: 'Эмээл', pronunciation: 'Emeel', meaning: 'Морь унахад хүнийг тухтай, тогтвортой суулгах зориулалттай мод, арьсаар хийсэн суудал.', image: '/emeel.png' },
  { word: 'Хазаар', pronunciation: 'Hazaar', meaning: 'Морьдын толгойд углаж, амьтныг барьж жолоодох зориулалттай тоног хэрэгсэл.', image: '/hazaar.png' },
  { word: 'Унь', pronunciation: 'Uni', meaning: 'Монгол гэрийн дээврийг тогтоох нарийн урт мод, тооноос хананд хүрч тогтдог хэсэг.', image: '/uni.png' },
  { word: 'Тооно', pronunciation: 'Toono', meaning: 'Гэрийн орой дээр байрлах дугуй цагираг бөгөөд уньнуудыг түгжин барьдаг хэсэг.', image: '/toono.png' },
  { word: 'Багана', pronunciation: 'Bagana', meaning: 'Гэр болон барилгын гол ачааг даах босоо тулгуур мод.', image: '/bagana.png' },
  { word: 'Хана', pronunciation: 'Hana', meaning: 'Гэрийн нударган тор маягийн эвхэгддэг хашлага хэсэг.', image: '/hana.png' },
  { word: 'Угалз', pronunciation: 'Ugalz', meaning: 'Монгол урлагт хэрэглэгддэг уран нуман, мушгиа хээг хэлнэ.', image: '/ugalz.png' },
  { word: 'Уурга', pronunciation: 'Urga', meaning: 'Морь, мал барихад хэрэглэдэг урт модон саваа, үзүүрт нь уяа хийсэн хэрэгсэл.', image: '/uurga.png' },
  { word: 'Торго', pronunciation: 'Torgo', meaning: 'Монголчуудын уламжлалт тансаг даавуу, ихэвчлэн торгон утсаар нэхэгдсэн.', image: '/torgo.png' },
  { word: 'Дээл', pronunciation: 'Deel', meaning: 'Монголчуудын уламжлалт үндэсний хувцас.', image: '/deel.png' },
  { word: 'Нэхий', pronunciation: 'Nekhii', meaning: 'Малын арьсыг боловсруулж, дулаан хадгалах зориулалттай эдлэл.', image: '/nekhii.png' },
  { word: 'Тулга', pronunciation: 'Tulga', meaning: 'Гэрийн голд байрлах гурван чулуу, гал түлэх суурь.', image: '/tulga.png' },
];

app.get('/api/word-questions', (req, res) => {
  try {
    // Үгсийг санамсаргүй байдлаар холих
    const shuffled = [...wordCards].sort(() => Math.random() - 0.5);
    // 6 үг авах
    const selectedWords = shuffled.slice(0, 6);
    
    // Бүгдийг Quiz төрөл болгох - 4 сонголттой
    const questions = selectedWords.map((card) => {
      const correctAnswer = card.pronunciation;
      
      // 3 буруу хариулт авах
      const wrongOptions = wordCards
        .filter(w => w.pronunciation !== correctAnswer)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(w => w.pronunciation);
      
      // 4 сонголтыг холих
      const allOptions = [correctAnswer, ...wrongOptions]
        .sort(() => Math.random() - 0.5);
      
      return {
        type: 'quiz',
        word: card.word,
        pronunciation: card.pronunciation,
        meaning: card.meaning,
        image: card.image,
        options: allOptions,
        correctAnswer: correctAnswer
      };
    });
    
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



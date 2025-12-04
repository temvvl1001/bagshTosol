# Багшнарр - Setup Guide

Таны бүх файлуудыг сэргээж, backend-тэй холбосон болно. Одоо энэ заавраар ажиллуулаарай.

## Төслийн бүтэц

```
bagshnarr/
├── backend/              # Node.js + Express + Prisma + PostgreSQL
│   ├── prisma/
│   │   └── schema.prisma # Database schema
│   └── src/
│       └── index.js      # Backend API
├── src/                  # React Frontend
│   ├── App.jsx          # Main app
│   ├── Home.jsx         # Home page - үг тайлбарлагч + AI туслах
│   ├── game.jsx         # Game page - асуулт хариулт
│   └── Culture.jsx      # Culture page - соёлын мэдээлэл
└── public/              # Зургууд
```

## 1. Backend ажиллуулах

### PostgreSQL эхлүүлэх
```bash
# Mac дээр:
brew services start postgresql@14

# Эсвэл:
pg_ctl -D /usr/local/var/postgres start
```

### Backend тохируулах
```bash
cd /Users/butentemvvlentem/Desktop/bagshnarr/backend

# Dependencies суулгах (анх удаа)
npm install

# .env файл үүсгэх
cat > .env << EOF
DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/bagshnarr?schema=public"
GROQ_API_KEY=таны_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile
PORT=4000
EOF

# Prisma migration хийх
npx prisma generate
npx prisma migrate dev --name init

# Backend эхлүүлэх
npm run dev
```

Backend **4000** порт дээр ажиллана, терминал дээр:
```
✅ Backend сервер 4000 порт дээр ажиллаж байна
```

---

## 2. DB-д анхны өгөгдөл нэмэх

Backend ажиллаж байх үед **шинэ terminal** нээгээд:

### Game асуултууд нэмэх
```bash
cd /Users/butentemvvlentem/Desktop/bagshnarr/backend
npx prisma studio
```

Prisma Studio нээгдэнэ → **GameQuestion** хүснэгтэд дарж шинэ мөр нэм:

| prompt | options | correct |
|--------|---------|---------|
| Сайн байна уу? | ["Hello","Goodbye","Thank you","Welcome"] | 0 |
| Баярлалаа | ["Sorry","Please","Thank you","Yes"] | 2 |
| Тийм | ["No","Yes","Maybe","Never"] | 1 |

**Save** дарна.

---

## 3. Frontend ажиллуулах

**Шинэ terminal** нээгээд:

```bash
cd /Users/butentemvvlentem/Desktop/bagshnarr

# Dependencies суулгах (анх удаа)
npm install

# Frontend эхлүүлэх
npm start
```

Browser автоматаар нээгдэнэ: `http://localhost:3000`

---

## Ямар ажиллах вэ?

### ✅ Home хуудас
- Монгол үгсийн тайлбар харуулна (Эмээл, Хазаар, Тооно гэх мэт)
- Баруун талын **AI Туслах** дээр:
  - Монголын өв, уламжлал, соёлын талаар асуувал
  - Backend (`/api/career-chat`) → Groq AI → хариулна
  - PostgreSQL-д бүх мессежүүд хадгалагдана

### ✅ Game хуудас
- Backend (`/api/game-questions`) дээрээс асуулт татаж ирнэ
- Асуулт хариулт тоглодог
- Оноо тооцдог

### ✅ Culture хуудас
- Монголын соёлын талаар тайлбар

---

## Алдаа засах

### Backend холбогдохгүй байвал
1. Backend ажиллаж байгаа эсэхийг шалгаарай:
   ```bash
   curl http://localhost:4000/health
   ```
   Хэрэв `{"ok":true}` гарвал зөв.

2. `.env` файлын `GROQ_API_KEY`-г шалгаарай (жинхэнэ түлхүүр бичсэн эсэх).

3. PostgreSQL ажиллаж байгаа эсэхийг шалгаарай:
   ```bash
   psql -U USERNAME -d bagshnarr
   ```

### Game асуулт гарахгүй байвал
- Prisma Studio ашиглаад `GameQuestion` хүснэгтэд өгөгдөл оруулсан эсэхээ шалгаарай.

---

## Хөгжүүлэгчдэд зориулсан

### Backend API маршрутууд

- `GET /health` – Эрүүл эсэх шалгах
- `POST /api/career-chat` – AI чат (Groq + PostgreSQL)
  ```json
  { "message": "асуулт" }
  ```
- `GET /api/career-chat/:conversationId` – Ярианы түүх
- `GET /api/game-questions` – Game асуултууд

### Frontend компонентууд

- `App.jsx` – Үндсэн app, routing, state управление
- `Home.jsx` – Үг тайлбарлагч + AI туслах (backend-тэй холбогдсон)
- `game.jsx` – Тоглоом (backend-аас асуулт татдаг)
- `Culture.jsx` – Соёлын хуудас

---

## Commands товчлол

```bash
# Backend
cd backend && npm run dev

# Frontend
cd .. && npm start

# Prisma Studio
cd backend && npx prisma studio

# Migration
cd backend && npx prisma migrate dev
```

---

Бүх зүйл бэлэн боллоо! 🎉


# WhatsApp Microlearning Bot

A modern, multi-user WhatsApp microlearning platform that delivers daily 5-minute lessons on vocational, digital, and English skills. Built for hackathons, real-world impact, and scalable deployment.

---

## 🚀 Features

- **WhatsApp Bot**: Users register, select topics, and receive daily lessons via WhatsApp (Twilio integration).
- **Admin Dashboard**: Beautiful React dashboard for managing users, content, analytics, and settings.
- **Multi-User**: Supports unlimited users, each with their own progress, streaks, and topics.
- **Gamification**: Streaks, badges, and certificates for topic completion.
- **Monetization**: Free users get 3 lessons/day; subscription unlocks unlimited lessons and certificates.
- **Analytics**: Real-time stats, growth charts, top topics, and user engagement metrics.
- **Modern UI/UX**: WhatsApp-inspired color palette, emojis, mobile-friendly, and responsive.
- **Secure**: Secrets managed via environment variables; no secrets in repo.

---

## 🛠️ Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB (local or Atlas)
- **Messaging**: Twilio WhatsApp API
- **Deployment**: Netlify/Vercel (frontend), Render/Railway (backend)

---

## 📝 Setup Instructions

### 1. Clone the Repo
```sh
git clone https://github.com/Nebert11/whatsapp-micro-learning-bot.git
cd whatsapp-micro-learning-bot
```

### 2. Install Dependencies
```sh
pnpm install
# or
npm install
```

### 3. Environment Variables
Create a `.env` file in the `server/` directory with:
```
MONGO_URI=mongodb://localhost:27017/whatsapp-microlearning # or your Atlas URI
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+1234567890
JWT_SECRET=your_jwt_secret
```

### 4. Start the App
```sh
pnpm run dev
# or
npm run dev
```
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

### 5. Ngrok for Local WhatsApp Bot (if running locally)
```sh
ngrok http 5000
```
- Set your Twilio WhatsApp webhook to `https://<ngrok-url>/api/bot/webhook`

---

## 🌍 Deployment

- **Frontend**: Deploy to Netlify or Vercel (static build from `/dist`)
- **Backend**: Deploy to Render, Railway, or Heroku (Node.js web service)
- **Database**: Use MongoDB Atlas for cloud deployments
- **Update API URLs** in frontend to point to your deployed backend
- **Update Twilio webhook** to your deployed backend's `/api/bot/webhook`

---

## 📱 User Flow

1. User messages WhatsApp number
2. Bot registers user, asks for name and topic
3. User receives daily lessons (3/day free, unlimited with subscription)
4. Progress tracked, badges/certificates awarded for topic completion
5. Admin dashboard for content, users, analytics, and settings

---

## 💡 Hackathon/Monetization Highlights
- **Problem:** Busy learners want skills, but lack time for long courses
- **Solution:** 5-minute daily lessons via WhatsApp
- **Monetization:** Subscription unlocks unlimited lessons and certificates
- **Gamification:** Streaks, badges, certificates
- **Analytics:** Real-time dashboard for growth and engagement

---

## 🛡️ Security
- **No secrets in repo** (use `.env` and Render/Netlify environment variables)
- **.env.example** provided for reference (no real credentials)

---

## 🤝 Contributing
Pull requests welcome! For major changes, open an issue first to discuss what you'd like to change.

---

## 📄 License
MIT

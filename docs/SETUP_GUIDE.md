# Complete Setup Guide

This guide will walk you through setting up the WhatsApp Microlearning Bot from scratch.

## 📋 Prerequisites Checklist

Before starting, ensure you have:

- [ ] Node.js v16+ installed
- [ ] MongoDB installed (local) or MongoDB Cloud account
- [ ] Twilio account with WhatsApp Business API access
- [ ] Domain name or cloud hosting service
- [ ] Code editor (VS Code recommended)

## 🔧 Step-by-Step Setup

### Step 1: Environment Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd whatsapp-microlearning-bot
   npm install
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

3. **Configure basic settings:**
   ```env
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your_random_secret_key_here
   ```

### Step 2: Database Configuration

#### Option A: Local MongoDB

1. **Install MongoDB Community Edition:**
   - [Download MongoDB](https://www.mongodb.com/try/download/community)
   - Follow installation instructions for your OS

2. **Start MongoDB:**
   ```bash
   # macOS with Homebrew
   brew services start mongodb-community
   
   # Ubuntu/Debian
   sudo systemctl start mongod
   
   # Windows
   net start MongoDB
   ```

3. **Update .env:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/whatsapp-microlearning
   ```

#### Option B: MongoDB Atlas (Cloud)

1. **Create MongoDB Atlas account:**
   - Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster

2. **Get connection string:**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string

3. **Update .env:**
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/whatsapp-microlearning?retryWrites=true&w=majority
   ```

### Step 3: Twilio WhatsApp Setup

1. **Create Twilio Account:**
   - Sign up at [Twilio Console](https://console.twilio.com/)
   - Verify your phone number

2. **Enable WhatsApp:**
   - Navigate to Messaging > Try WhatsApp
   - Follow the WhatsApp Business API setup process
   - Complete business verification (may take 1-3 days)

3. **Get Credentials:**
   - Account SID: Found on your Console Dashboard
   - Auth Token: Click to reveal on Dashboard
   - WhatsApp Number: Assigned after approval

4. **Update .env:**
   ```env
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your_auth_token_here
   TWILIO_WHATSAPP_NUMBER=+14155238886
   WHATSAPP_VERIFY_TOKEN=my_verify_token_123
   ```

### Step 4: Test Local Setup

1. **Start the application:**
   ```bash
   npm run dev
   ```

2. **Verify services:**
   - Backend: http://localhost:5000/api/health
   - Frontend: http://localhost:5173
   - Dashboard login: admin/admin123

3. **Test database connection:**
   - Check console for "MongoDB Connected" message
   - No connection errors should appear

### Step 5: Webhook Configuration

#### Development (Using ngrok)

1. **Install ngrok:**
   ```bash
   npm install -g ngrok
   ```

2. **Expose local server:**
   ```bash
   ngrok http 5000
   ```

3. **Configure Twilio webhook:**
   - Copy the ngrok HTTPS URL (e.g., `https://abc123.ngrok.io`)
   - In Twilio Console: Messaging > Settings > WhatsApp sandbox settings
   - Set webhook URL: `https://abc123.ngrok.io/api/bot/webhook`
   - Set HTTP method: POST

#### Production Deployment

Choose one of these platforms:

##### Railway Deployment

1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   railway login
   ```

2. **Deploy:**
   ```bash
   railway init
   railway add
   railway up
   ```

3. **Set environment variables:**
   ```bash
   railway variables set MONGODB_URI=your_mongo_uri
   railway variables set TWILIO_ACCOUNT_SID=your_sid
   # ... add all env variables
   ```

##### Render Deployment

1. **Connect GitHub repository** to Render
2. **Configure build settings:**
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
3. **Add environment variables** in Render dashboard

##### Vercel + Separate Backend

For frontend-only on Vercel:
1. **Deploy frontend:**
   ```bash
   vercel --prod
   ```
2. **Deploy backend separately** (Railway/Render)
3. **Update API endpoints** in frontend code

### Step 6: Content Setup

1. **Access admin dashboard:**
   - Navigate to your deployed URL or localhost:5173
   - Login with admin/admin123

2. **Create topics:**
   - Go to Content > Topics
   - Add topics like "JavaScript Basics", "Health Tips", etc.

3. **Add lessons:**
   - Create lessons for each topic
   - Include varied content types (text, quiz, tips)

### Step 7: Testing WhatsApp Integration

1. **Test webhook:**
   ```bash
   curl -X POST https://your-domain.com/api/bot/webhook \
     -H "Content-Type: application/json" \
     -d '{"Body":"test","From":"whatsapp:+1234567890"}'
   ```

2. **Send test message:**
   - Use Twilio Console > Messaging > Try it out
   - Send message to your WhatsApp number
   - Check logs for incoming message handling

3. **Register test user:**
   - Send any message to your bot number
   - Follow registration flow
   - Verify user appears in dashboard

## 🔍 Verification Checklist

After setup, verify everything works:

- [ ] Application starts without errors
- [ ] Database connection successful
- [ ] Admin dashboard accessible
- [ ] WhatsApp webhook receiving messages
- [ ] User registration flow works
- [ ] Daily content delivery scheduled
- [ ] Analytics dashboard showing data

## 🚨 Common Issues & Solutions

### Database Connection Issues

**Problem:** `MongoNetworkError` or connection timeout

**Solutions:**
- Check MongoDB service is running
- Verify connection string format
- Ensure IP whitelist includes your server (Atlas)
- Check firewall settings

### WhatsApp Messages Not Sending

**Problem:** Messages not delivered or webhook errors

**Solutions:**
- Verify Twilio credentials are correct
- Check WhatsApp number approval status
- Ensure webhook URL is publicly accessible
- Verify webhook verify token matches

### Authentication Errors

**Problem:** Dashboard login fails or JWT errors

**Solutions:**
- Check JWT_SECRET in environment variables
- Verify admin credentials (admin/admin123)
- Clear browser cache and cookies
- Check token expiration settings

### Port Conflicts

**Problem:** `EADDRINUSE` error

**Solutions:**
- Change PORT in .env file
- Kill existing processes: `pkill -f node`
- Use different port: `PORT=3001 npm run dev`

## 📞 Getting Help

If you encounter issues:

1. **Check logs:** Look at console output for error messages
2. **Review documentation:** Check README.md for additional info
3. **Test components individually:** Database, API, frontend separately
4. **Use debug mode:** `DEBUG=* npm run server`

## 🎯 Next Steps

After successful setup:

1. **Customize content:** Add your own topics and lessons
2. **Configure scheduling:** Adjust delivery times and frequency
3. **Set up monitoring:** Add error tracking and health checks
4. **Scale infrastructure:** Consider Redis, load balancers for growth
5. **Add features:** Implement additional bot commands or integrations

## 📚 Additional Resources

- [Twilio WhatsApp API Documentation](https://www.twilio.com/docs/whatsapp)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Node.js Best Practices](https://nodejs.org/en/docs/guides/)
- [React Documentation](https://reactjs.org/docs/)

---

**Setup complete! Your WhatsApp Microlearning Bot is ready to educate users worldwide! 🚀**
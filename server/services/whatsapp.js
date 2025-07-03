import twilio from 'twilio';
import { handleIncomingMessage } from './messageHandler.js';

let twilioClient;

export const initializeWhatsAppService = () => {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    
    if (accountSid && authToken) {
      twilioClient = twilio(accountSid, authToken);
      console.log('📱 Twilio WhatsApp service initialized');
    } else {
      console.log('⚠️  Running in demo mode - Twilio credentials not provided');
    }
  } catch (error) {
    console.error('❌ Error initializing WhatsApp service:', error.message);
  }
};

export const sendWhatsAppMessage = async (to, message) => {
  try {
    if (!twilioClient) {
      // Demo mode - log message instead of sending
      console.log(`📱 [DEMO] Message to ${to}: ${message}`);
      return { success: true, demo: true };
    }

    const response = await twilioClient.messages.create({
      body: message,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${to}`
    });

    console.log(`✅ Message sent to ${to}: ${response.sid}`);
    return { success: true, messageId: response.sid };
  } catch (error) {
    console.error(`❌ Error sending message to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
};

export const handleWhatsAppWebhook = async (req, res) => {
  try {
    const { Body, From, To } = req.body;
    const phoneNumber = From.replace('whatsapp:', '');
    
    console.log(`📱 Received message from ${phoneNumber}: ${Body}`);
    
    // Process the incoming message
    await handleIncomingMessage(phoneNumber, Body);
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('❌ Error handling WhatsApp webhook:', error.message);
    res.status(500).send('Error processing message');
  }
};

export const broadcastMessage = async (phoneNumbers, message) => {
  const results = [];
  
  for (const phoneNumber of phoneNumbers) {
    const result = await sendWhatsAppMessage(phoneNumber, message);
    results.push({ phoneNumber, ...result });
    
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  return results;
};
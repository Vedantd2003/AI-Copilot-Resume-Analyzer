import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

const simpleTest = async () => {
  try {
    console.log('🔑 Testing Gemini API with new key...');
    
    if (!process.env.GEMINI_API_KEY) {
      console.log('❌ GEMINI_API_KEY missing');
      return;
    }
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const result = await model.generateContent('Respond with "API working"');
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Gemini API Response:', text);
    console.log('✅ API key is working!');
    
  } catch (error) {
    console.error('❌ Gemini API Error:', error.message);
    
    if (error.message.includes('API_KEY_INVALID')) {
      console.log('🔧 Fix: API key is invalid - get a new one');
    } else if (error.message.includes('QUOTA_EXCEEDED')) {
      console.log('🔧 Fix: Quota exceeded - check billing');
    } else if (error.message.includes('PERMISSION_DENIED')) {
      console.log('🔧 Fix: Permission denied - check API key permissions');
    }
  }
};

simpleTest();

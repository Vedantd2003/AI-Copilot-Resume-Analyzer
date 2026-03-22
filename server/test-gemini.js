import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

const testGemini = async () => {
  console.log('🔍 Testing Gemini API configuration...');
  
  // Check API key
  console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '✅ Set' : '❌ Missing');
  
  if (!process.env.GEMINI_API_KEY) {
    console.log('\n❌ GEMINI_API_KEY is missing from .env file');
    console.log('\n🔧 To fix:');
    console.log('1. Go to https://makersuite.google.com/app/apikey');
    console.log('2. Create a new API key');
    console.log('3. Add it to your .env file: GEMINI_API_KEY=your_actual_api_key');
    return;
  }

  try {
    console.log('\n🤖 Testing Gemini API connection...');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const result = await model.generateContent('Hello, can you respond with "API working"?');
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Gemini API working!');
    console.log('Response:', text);
    
  } catch (error) {
    console.error('❌ Gemini API test failed:', error.message);
    
    if (error.message.includes('API_KEY_INVALID') || error.message.includes('PERMISSION_DENIED')) {
      console.log('\n🔧 Fix: The API key is invalid');
      console.log('1. Go to https://makersuite.google.com/app/apikey');
      console.log('2. Create a new API key');
      console.log('3. Update your .env file with the new key');
    } else if (error.message.includes('QUOTA_EXCEEDED')) {
      console.log('\n🔧 Fix: API quota exceeded');
      console.log('1. Check your Google Cloud billing');
      console.log('2. Enable billing for the Gemini API');
    }
  }
};

testGemini();

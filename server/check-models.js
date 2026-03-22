import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

const checkModels = async () => {
  try {
    console.log('🔍 Checking available Gemini models...');
    
    if (!process.env.GEMINI_API_KEY) {
      console.log('❌ GEMINI_API_KEY missing');
      return;
    }
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Try different model names
    const modelsToTry = [
      'gemini-pro',
      'gemini-1.0-pro',
      'gemini-1.5-pro',
      'text-bison-001',
      'chat-bison-001'
    ];
    
    for (const modelName of modelsToTry) {
      try {
        console.log(`\n🧪 Testing model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Hello');
        const response = await result.response;
        console.log(`✅ ${modelName} works! Response: ${response.text().substring(0, 50)}...`);
        break; // Stop at first working model
      } catch (error) {
        console.log(`❌ ${modelName} failed: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Overall error:', error.message);
    
    if (error.message.includes('API_KEY_INVALID')) {
      console.log('\n🔧 Fix: API key is invalid');
      console.log('1. Go to https://makersuite.google.com/app/apikey');
      console.log('2. Create a new API key');
      console.log('3. Update your .env file');
    } else if (error.message.includes('QUOTA_EXCEEDED')) {
      console.log('\n🔧 Fix: Quota exceeded - check billing');
    } else if (error.message.includes('PERMISSION_DENIED')) {
      console.log('\n🔧 Fix: Permission denied - check API key permissions');
    }
  }
};

checkModels();

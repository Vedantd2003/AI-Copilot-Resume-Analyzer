import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

const freeTierSetup = async () => {
  console.log('🆓 Free Tier Gemini Setup Guide\n');
  
  // Check API key
  if (!process.env.GEMINI_API_KEY) {
    console.log('❌ GEMINI_API_KEY missing');
    console.log('\n🔧 Steps to get FREE API key:');
    console.log('1. Go to https://makersuite.google.com/app/apikey');
    console.log('2. Select your Google account');
    console.log('3. Click "Create API Key"');
    console.log('4. Copy the key (starts with AIzaSy...)');
    console.log('5. Add to .env: GEMINI_API_KEY=your_key_here');
    return;
  }
  
  console.log('✅ API Key found');
  console.log('🔑 Key length:', process.env.GEMINI_API_KEY.length);
  
  try {
    // Test free tier models
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    console.log('\n🧪 Testing FREE tier models...');
    
    // Test gemini-1.5-flash (newest free model)
    try {
      console.log('Testing gemini-1.5-flash...');
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent('Hello');
      const text = result.response.text();
      console.log('✅ gemini-1.5-flash WORKS! Response:', text);
      console.log('🎉 Your free tier setup is perfect!');
      return;
    } catch (e) {
      console.log('❌ gemini-1.5-flash failed:', e.message);
    }
    
    // Test gemini-pro (stable free model)
    try {
      console.log('Testing gemini-pro...');
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.generateContent('Hello');
      const text = result.response.text();
      console.log('✅ gemini-pro WORKS! Response:', text);
      console.log('🎉 Your free tier setup is working!');
      return;
    } catch (e) {
      console.log('❌ gemini-pro failed:', e.message);
    }
    
    console.log('\n❌ All free models failed');
    console.log('\n🔧 FREE TIER FIXES:');
    console.log('1. Enable Generative AI API (FREE):');
    console.log('   → https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com');
    console.log('2. Select your project and click "Enable" (FREE)');
    console.log('3. Create new API key (FREE):');
    console.log('   → https://makersuite.google.com/app/apikey');
    console.log('4. NO billing required for free tier!');
    
  } catch (error) {
    console.log('❌ Setup error:', error.message);
  }
};

freeTierSetup();

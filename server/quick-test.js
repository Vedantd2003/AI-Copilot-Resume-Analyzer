import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

const quickTest = async () => {
  console.log('🚀 Quick API Test...\n');
  
  // Check API key
  console.log('API Key:', process.env.GEMINI_API_KEY ? '✅ Present' : '❌ Missing');
  console.log('API Key Length:', process.env.GEMINI_API_KEY?.length || 0);
  
  if (!process.env.GEMINI_API_KEY) {
    console.log('❌ Add GEMINI_API_KEY to .env file');
    return;
  }
  
  try {
    // Test 1: Direct API call
    console.log('\n📡 Testing direct API call...');
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models', {
      headers: {
        'x-goog-api-key': process.env.GEMINI_API_KEY,
      },
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.log(`❌ Direct API failed: ${response.status}`);
      console.log('Error:', error);
      return;
    }
    
    const data = await response.json();
    console.log(`✅ Found ${data.models?.length || 0} models`);
    
    // Test 2: SDK call
    console.log('\n🤖 Testing SDK...');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Try gemini-pro first
    try {
      console.log('Testing gemini-pro...');
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.generateContent('Say "API working"');
      const text = result.response.text();
      console.log('✅ gemini-pro works:', text);
    } catch (e) {
      console.log('❌ gemini-pro failed:', e.message);
      
      // Try text-bison-001
      try {
        console.log('Testing text-bison-001...');
        const model = genAI.getGenerativeModel({ model: 'text-bison-001' });
        const result = await model.generateContent('Say "API working"');
        const text = result.response.text();
        console.log('✅ text-bison-001 works:', text);
      } catch (e2) {
        console.log('❌ text-bison-001 failed:', e2.message);
        console.log('\n🔧 All models failed - check API key permissions');
      }
    }
    
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
};

quickTest();

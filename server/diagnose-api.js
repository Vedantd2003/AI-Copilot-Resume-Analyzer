import 'dotenv/config';

const diagnoseAPI = async () => {
  console.log('🔍 Comprehensive Gemini API Diagnosis...\n');
  
  // Check environment
  console.log('📋 Environment Check:');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY);
  console.log('GEMINI_API_KEY length:', process.env.GEMINI_API_KEY?.length || 0);
  console.log('GEMINI_API_KEY starts with AIzaSy:', process.env.GEMINI_API_KEY?.startsWith('AIzaSy') || false);
  
  if (!process.env.GEMINI_API_KEY) {
    console.log('\n❌ ISSUE: GEMINI_API_KEY is missing');
    console.log('🔧 SOLUTION: Add GEMINI_API_KEY to your .env file');
    return;
  }
  
  if (!process.env.GEMINI_API_KEY.startsWith('AIzaSy')) {
    console.log('\n❌ ISSUE: GEMINI_API_KEY format is invalid');
    console.log('🔧 SOLUTION: Get a new API key from https://makersuite.google.com/app/apikey');
    return;
  }
  
  console.log('\n🧪 Testing API Connection...');
  
  try {
    // Test basic connection
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models', {
      headers: {
        'x-goog-api-key': process.env.GEMINI_API_KEY,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log(`❌ API Request Failed: ${response.status} ${response.statusText}`);
      console.log('Error Details:', errorData);
      
      if (response.status === 403) {
        console.log('\n🔧 LIKELY ISSUE: API key permissions or billing');
        console.log('SOLUTIONS:');
        console.log('1. Enable billing on your Google Cloud project');
        console.log('2. Enable Generative AI API in your project');
        console.log('3. Check if API key has correct permissions');
      } else if (response.status === 401) {
        console.log('\n🔧 LIKELY ISSUE: Invalid API key');
        console.log('SOLUTION: Generate a new API key from https://makersuite.google.com/app/apikey');
      }
      return;
    }
    
    const data = await response.json();
    console.log('✅ API Connection Successful!');
    console.log('Available Models:');
    
    if (data.models && data.models.length > 0) {
      data.models.forEach(model => {
        console.log(`  - ${model.name} (${model.displayName})`);
      });
      
      // Check for specific models we need
      const hasGeminiPro = data.models.some(m => m.name.includes('gemini-pro'));
      const hasTextBison = data.models.some(m => m.name.includes('text-bison'));
      
      console.log('\n📊 Model Availability:');
      console.log('Gemini Pro available:', hasGeminiPro ? '✅' : '❌');
      console.log('Text Bison available:', hasTextBison ? '✅' : '❌');
      
      if (!hasGeminiPro && !hasTextBison) {
        console.log('\n🔧 ISSUE: No suitable models found');
        console.log('SOLUTION: Enable Generative AI API in your Google Cloud project');
      }
    } else {
      console.log('❌ No models returned');
    }
    
  } catch (error) {
    console.log('❌ Network Error:', error.message);
    console.log('\n🔧 POSSIBLE ISSUES:');
    console.log('1. Network connectivity problems');
    console.log('2. Firewall blocking API requests');
    console.log('3. DNS resolution issues');
  }
};

diagnoseAPI();

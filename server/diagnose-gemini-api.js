import { GoogleGenerativeAI } from '@google/generative-ai';

const diagnoseGeminiAPI = async () => {
  console.log('🔍 Gemini API Diagnostic Tool\n');
  console.log('=====================================\n');
  
  // Check 1: Environment Variables
  console.log('📋 Step 1: Checking Environment Variables');
  console.log(`   GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? '✅ Set' : '❌ Not set'}`);
  console.log(`   API Key Length: ${process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.length : 'N/A'} characters\n`);
  
  if (!process.env.GEMINI_API_KEY) {
    console.log('❌ Please set GEMINI_API_KEY in your .env file');
    return;
  }
  
  // Check 2: Basic API Connection
  console.log('📋 Step 2: Testing Basic API Connection');
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log('   ✅ GoogleGenerativeAI client initialized');
    
    // List models to see what's available
    console.log('\n📋 Step 3: Listing Available Models');
    const models = await genAI.listModels();
    console.log('   Available models:');
    models.models.forEach(model => {
      console.log(`   - ${model.name} (supports generateContent: ${model.supportedGenerationMethods?.includes('generateContent') ? '✅' : '❌'})`);
    });
    
    // Check 4: Test specific models
    console.log('\n📋 Step 4: Testing Specific Models');
    const testModels = [
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'gemini-pro',
      'gemini-1.0-pro'
    ];
    
    for (const modelName of testModels) {
      try {
        console.log(`   Testing ${modelName}...`);
        const model = genAI.getGenerativeModel({ model: modelName });
        
        // Try a simple generation
        const result = await model.generateContent({
          contents: [{ parts: [{ text: "Hello, test" }] }]
        });
        
        console.log(`   ✅ ${modelName} - SUCCESS`);
        console.log(`      Response: "${result.response.text().substring(0, 50)}..."`);
        
        // If we get here, the API works!
        console.log('\n🎉 SUCCESS! Your Gemini API is working!');
        console.log(`🚀 You can use: ${modelName}`);
        console.log('\n💡 Update your gemini.service.js to use this model if needed.');
        return;
        
      } catch (error) {
        console.log(`   ❌ ${modelName} - FAILED`);
        console.log(`      Error: ${error.message}`);
      }
    }
    
    console.log('\n❌ All models failed. Possible issues:');
    console.log('   1. API key permissions - Check Google Cloud Console');
    console.log('   2. Billing not enabled - Enable billing in Google Cloud');
    console.log('   3. Region restrictions - Some regions have limited models');
    console.log('   4. Quota exceeded - Check API usage limits');
    console.log('   5. Account suspended - Check Google Cloud status');
    
  } catch (error) {
    console.log(`❌ API Connection Failed: ${error.message}`);
    console.log('\n🔧 Troubleshooting steps:');
    console.log('   1. Verify API key at https://makersuite.google.com/app/apikey');
    console.log('   2. Check Google Cloud Console billing');
    console.log('   3. Ensure "Generative Language API" is enabled');
    console.log('   4. Try creating a new API key');
    console.log('   5. Check if your account is in good standing');
  }
  
  console.log('\n=====================================');
  console.log('📚 For more help: https://cloud.google.com/docs/ai');
};

// Run diagnosis
diagnoseGeminiAPI().catch(console.error);

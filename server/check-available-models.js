import { GoogleGenerativeAI } from '@google/generative-ai';

const checkAvailableModels = async () => {
  console.log('🔍 Checking available Gemini models...\n');
  
  if (!process.env.GEMINI_API_KEY) {
    console.log('❌ GEMINI_API_KEY not found in environment variables');
    console.log('Please set GEMINI_API_KEY in your .env file');
    return;
  }
  
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  // Simplified list of standard Gemini models
  const modelsToCheck = [
    'gemini-1.5-flash',
    'gemini-1.5-pro', 
    'gemini-pro',
    'gemini-1.0-pro'
  ];
  
  console.log('📋 Testing models...\n');
  
  let workingModel = null;
  
  for (const modelName of modelsToCheck) {
    try {
      console.log(`🔍 Testing ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      
      // Try a simple generation
      const result = await model.generateContent('Hello');
      const response = result.response.text();
      
      console.log(`✅ ${modelName} - WORKING`);
      console.log(`   Response: ${response.substring(0, 50)}...\n`);
      
      if (!workingModel) {
        workingModel = modelName;
      }
      
    } catch (error) {
      console.log(`❌ ${modelName} - FAILED`);
      console.log(`   Error: ${error.message}\n`);
    }
  }
  
  if (workingModel) {
    console.log(`🎯 SUCCESS! Found working model: ${workingModel}`);
    console.log('\n💡 Your application should work with this model.');
    console.log('💡 If still failing, the issue might be:');
    console.log('   - API key permissions');
    console.log('   - Region restrictions');
    console.log('   - Billing requirements');
    console.log('   - API quota limits');
  } else {
    console.log('❌ No working models found.');
    console.log('💡 Your application will continue to work with the mock AI service.');
    console.log('\n🔧 To fix Gemini API:');
    console.log('   1. Check your API key at https://makersuite.google.com/app/apikey');
    console.log('   2. Ensure billing is enabled in Google Cloud Console');
    console.log('   3. Try creating a new API key');
    console.log('   4. Check if your account has proper API access');
  }
};

// Run the check
checkAvailableModels().catch(console.error);

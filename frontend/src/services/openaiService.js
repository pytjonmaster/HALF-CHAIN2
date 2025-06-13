// Initialize OpenAI with error handling
let openai = null;
let initError = null;

try {
  console.log('🔧 Initializing OpenAI...');
  
  // Check if we're in the right environment
  console.log('🌍 Environment check:');
  console.log('- import.meta.env exists:', !!import.meta.env);
  console.log('- All env vars:', import.meta.env);
  
  const OpenAI = (await import('openai/index.js')).OpenAI;
  
  // Try environment variable first, then fallback to hardcoded for testing
  let apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!apiKey) {
    console.log('📝 No env variable found, using hardcoded key for testing...');
    apiKey = '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';
  }
  
  console.log('📝 API Key check:');
  console.log('- API Key exists:', !!apiKey);
  console.log('- API Key length:', apiKey?.length || 0);
  console.log('- API Key starts with sk-:', apiKey?.startsWith('sk-') || false);
  console.log('- API Key preview:', apiKey ? `${apiKey.substring(0, 7)}...${apiKey.substring(apiKey.length - 4)}` : 'N/A');
  
  if (!apiKey) {
    throw new Error('OpenAI API key not found in environment variables. Make sure .env file exists in project root with VITE_OPENAI_API_KEY=your_key');
  }
  
  if (!apiKey.startsWith('sk-')) {
    throw new Error('Invalid API key format - should start with sk-');
  }
  
  openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true // Only for development, move to backend in production
  });
  
  console.log('✅ OpenAI initialized successfully');
} catch (error) {
  console.error('❌ OpenAI initialization failed:', error);
  initError = error;
}

export const generateSmartContract = async (formData) => {
  console.log('🚀 Starting contract generation...');
  console.log('📊 Form data:', formData);
  
  // Check if OpenAI was initialized
  if (!openai) {
    console.error('❌ OpenAI not initialized. Init error:', initError);
    throw new Error(`OpenAI service not available: ${initError?.message || 'Unknown error'}`);
  }

  if (!formData?.contractName || !formData?.contractType) {
    console.error('❌ Invalid form data');
    throw new Error('Invalid form data');
  }

  const prompt = `Generate a Solidity smart contract with the following specifications:
- Contract Name: ${formData.contractName}
- Contract Type: ${formData.contractType}
- Description: ${formData.description || 'No description provided'}
- Parties Involved: ${formData.parties || 'Not specified'}
- Key Terms: ${formData.terms || 'Not specified'}
- KYC Required: ${formData.enableKYC}

The contract should:
1. Follow Solidity best practices and security standards
2. Include proper events and modifiers
3. Implement the core functionality for a ${formData.contractType} contract
4. Use Solidity version 0.8.0 or higher
5. Include comprehensive error handling
6. Follow the standard structure with:
   - SPDX License
   - Contract state variables
   - Events
   - Modifiers
   - Constructor
   - Core functions
   - Utility functions
7. Include comments and documentation

Return only the Solidity code without any additional text or explanations.`;

  console.log('📤 Sending request to OpenAI...');
  console.log('📝 Prompt length:', prompt.length);

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a smart contract expert that generates secure, well-documented Solidity code. Always follow best practices and include comprehensive error handling."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2,
      max_tokens: 2500
    });

    console.log('📥 Received response from OpenAI');
    console.log('📊 Response:', completion);

    if (!completion?.choices?.[0]?.message?.content) {
      console.error('❌ Invalid response structure');
      throw new Error('Invalid response from AI service');
    }

    const generatedCode = completion.choices[0].message.content.trim();
    console.log('✅ Contract generated successfully');
    console.log('📝 Generated code length:', generatedCode.length);
    
    if (!generatedCode || typeof generatedCode !== 'string') {
      console.error('❌ Invalid generated code');
      throw new Error('Invalid contract generation response');
    }

    return generatedCode;
  } catch (error) {
    console.error('❌ OpenAI API Error:', error);
    console.error('❌ Error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    
    if (error.response?.status === 401) {
      throw new Error('Invalid API key or authentication failed');
    } else if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded or quota reached');
    } else if (error.response?.status === 400) {
      throw new Error('Bad request - check your input data');
    } else {
      throw new Error(`API request failed: ${error.message}`);
    }
  }
}; 
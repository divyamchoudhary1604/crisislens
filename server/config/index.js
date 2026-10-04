import dotenv from 'dotenv';
dotenv.config();

const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // MongoDB
  mongoUri: process.env.MONGODB_URI || '',
  
  // AI Provider
  aiProvider: process.env.AI_PROVIDER || 'demo',
  openrouter: {
    apiKey: process.env.OPENROUTER_API_KEY || '',
    model: process.env.OPENROUTER_MODEL || 'google/gemma-2-9b-it',
  },
  groq: {
    apiKey: process.env.GROQ_API_KEY || '',
    model: process.env.GROQ_MODEL || 'gemma2-9b-it',
  },
  ollama: {
    baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
    model: process.env.OLLAMA_MODEL || 'gemma2:9b',
  },
  
  // SerpApi
  serpApiKey: process.env.SERPAPI_KEY || '',
  
  // Client
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  
  // Demo Mode
  demoMode: process.env.DEMO_MODE === 'true',
  
  // Helpers
  isProduction: () => config.nodeEnv === 'production',
  hasMongoDb: () => !!config.mongoUri,
  hasAiProvider: () => config.aiProvider !== 'demo' && (
    !!config.openrouter.apiKey || 
    !!config.groq.apiKey || 
    config.aiProvider === 'ollama'
  ),
  hasSerpApi: () => !!config.serpApiKey,
};

export default config;

/**
 * AI Provider Factory
 * 
 * Creates the appropriate AI provider based on configuration.
 * Priority: configured provider > demo fallback
 */

import config from '../../config/index.js';
import { OpenSourceAIProvider } from './OpenSourceAIProvider.js';
import { DemoAIProvider } from './DemoAIProvider.js';
import { CrisisAnalyzer } from './CrisisAnalyzer.js';

let analyzerInstance = null;

export function createAIProvider() {
  if (config.demoMode || !config.hasAiProvider()) {
    console.log('🤖 AI Provider: Demo mode (pre-computed responses)');
    return new DemoAIProvider();
  }

  try {
    const provider = new OpenSourceAIProvider();
    console.log(`🤖 AI Provider: ${config.aiProvider} (model: ${
      config.aiProvider === 'openrouter' ? config.openrouter.model :
      config.aiProvider === 'groq' ? config.groq.model :
      config.ollama.model
    })`);
    return provider;
  } catch (error) {
    console.error(`⚠️ Failed to initialize ${config.aiProvider} provider:`, error.message);
    console.log('🤖 Falling back to Demo AI provider');
    return new DemoAIProvider();
  }
}

export function getAnalyzer() {
  if (!analyzerInstance) {
    const provider = createAIProvider();
    analyzerInstance = new CrisisAnalyzer(provider);
  }
  return analyzerInstance;
}

export function resetAnalyzer() {
  analyzerInstance = null;
}

export { CrisisAnalyzer, DemoAIProvider, OpenSourceAIProvider };

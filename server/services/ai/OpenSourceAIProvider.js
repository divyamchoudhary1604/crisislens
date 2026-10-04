/**
 * OpenSourceAIProvider — Connects to open-weight models via API.
 * 
 * Supports:
 * - OpenRouter (hosted Gemma, Mistral, Llama, etc.)
 * - Groq (hosted Gemma, Llama — fast inference)
 * - Ollama (local inference — full privacy)
 * 
 * The model is NOT a proprietary black box.
 * The weights are open, inspectable, replaceable, and can be self-hosted.
 */

import { AIProvider } from './AIProvider.js';
import config from '../../config/index.js';

export class OpenSourceAIProvider extends AIProvider {
  constructor() {
    const provider = config.aiProvider;
    super(`open-source-${provider}`);
    this.provider = provider;
    this.configureProvider();
  }

  configureProvider() {
    switch (this.provider) {
      case 'openrouter':
        this.baseUrl = 'https://openrouter.ai/api/v1/chat/completions';
        this.apiKey = config.openrouter.apiKey;
        this.model = config.openrouter.model;
        this.headers = {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://crisislens.app',
          'X-Title': 'CrisisLens',
        };
        break;

      case 'groq':
        this.baseUrl = 'https://api.groq.com/openai/v1/chat/completions';
        this.apiKey = config.groq.apiKey;
        this.model = config.groq.model;
        this.headers = {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        };
        break;

      case 'ollama':
        this.baseUrl = `${config.ollama.baseUrl}/api/chat`;
        this.model = config.ollama.model;
        this.apiKey = null;
        this.headers = { 'Content-Type': 'application/json' };
        break;

      default:
        throw new Error(`Unknown AI provider: ${this.provider}`);
    }
  }

  async complete(systemPrompt, userPrompt, options = {}) {
    const { temperature = 0.3, maxTokens = 2048 } = options;

    try {
      if (this.provider === 'ollama') {
        return await this.completeOllama(systemPrompt, userPrompt, temperature);
      }

      // OpenRouter and Groq use OpenAI-compatible API
      const body = {
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature,
        max_tokens: maxTokens,
      };

      // Add response_format for JSON mode if supported
      if (options.jsonMode) {
        body.response_format = { type: 'json_object' };
      }

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`AI API error (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error(`❌ AI completion error (${this.provider}):`, error.message);
      throw error;
    }
  }

  async completeOllama(systemPrompt, userPrompt, temperature) {
    const body = {
      model: this.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      stream: false,
      options: { temperature },
    };

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ollama error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    return data.message.content;
  }
}

export default OpenSourceAIProvider;

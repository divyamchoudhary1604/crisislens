/**
 * AIProvider — Abstract interface for AI model providers.
 * 
 * CrisisLens uses an open-weight model (like Gemma) as its primary AI engine.
 * This abstraction allows swapping providers without changing business logic.
 * 
 * Supported providers:
 * - OpenRouter (hosted Gemma, Mistral, etc.)
 * - Groq (hosted Gemma, Llama, etc.)
 * - Ollama (local inference)
 * - Demo (pre-computed responses for demo mode)
 */

export class AIProvider {
  constructor(name) {
    this.name = name;
  }

  async complete(systemPrompt, userPrompt, options = {}) {
    throw new Error('complete() must be implemented by subclass');
  }

  async extractJSON(systemPrompt, userPrompt, options = {}) {
    const response = await this.complete(systemPrompt, userPrompt, options);
    return this.parseJSON(response);
  }

  parseJSON(text) {
    // Try direct parse first
    try {
      return { success: true, data: JSON.parse(text) };
    } catch (e) {
      // Try to extract JSON from markdown code blocks
      const codeBlockMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
      if (codeBlockMatch) {
        try {
          return { success: true, data: JSON.parse(codeBlockMatch[1].trim()) };
        } catch (e2) {
          // Continue to repair
        }
      }

      // Try to find JSON object/array in text
      const jsonMatch = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
      if (jsonMatch) {
        try {
          return { success: true, data: JSON.parse(jsonMatch[1]) };
        } catch (e3) {
          // Try repair
          return this.repairJSON(jsonMatch[1]);
        }
      }

      return { success: false, data: null, error: 'No valid JSON found in response', raw: text };
    }
  }

  repairJSON(text) {
    try {
      // Common repairs
      let repaired = text
        // Remove trailing commas before closing brackets
        .replace(/,\s*([\]}])/g, '$1')
        // Add missing closing brackets
        .replace(/([^\\])"(\s*)$/g, '$1"$2}');
      
      // Count brackets and add missing ones
      const openBraces = (repaired.match(/\{/g) || []).length;
      const closeBraces = (repaired.match(/\}/g) || []).length;
      const openBrackets = (repaired.match(/\[/g) || []).length;
      const closeBrackets = (repaired.match(/\]/g) || []).length;

      for (let i = 0; i < openBrackets - closeBrackets; i++) repaired += ']';
      for (let i = 0; i < openBraces - closeBraces; i++) repaired += '}';

      const parsed = JSON.parse(repaired);
      return { success: true, data: parsed, repaired: true };
    } catch (e) {
      return { success: false, data: null, error: `JSON repair failed: ${e.message}`, raw: text };
    }
  }
}

export default AIProvider;

/**
 * aiService.js
 * 
 * Clean, lightweight interface for optional conversational guidance.
 * Connects to a local Ollama instance if available, or falls back honestly
 * to local contextual assistance. No fake claims or deceptive wrappers.
 */

export const AiService = {
  /**
   * Check if a local Ollama instance is reachable
   */
  async checkConnection(endpoint = 'http://localhost:11434') {
    try {
      const response = await fetch(`${endpoint}/api/tags`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(2000),
      });
      return response.ok;
    } catch {
      return false;
    }
  },

  /**
   * Send a query to Ollama or fall back to local rule-based assistance
   */
  async askCue(prompt, contextActivities = [], endpoint = 'http://localhost:11434', model = 'llama3') {
    const isConnected = await this.checkConnection(endpoint);

    if (isConnected) {
      try {
        const systemPrompt = `You are Cue, a life-direction companion for Sparks. Keep recommendations concise, warm, and grounded in her library.`;
        const response = await fetch(`${endpoint}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: model,
            prompt: `${systemPrompt}\n\nUser: ${prompt}`,
            stream: false,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          return {
            source: 'ollama',
            text: data.response,
          };
        }
      } catch (err) {
        console.warn('Ollama request failed, falling back:', err);
      }
    }

    // Honest fallback without deceptive AI claims
    return {
      source: 'local_engine',
      text: `Local Ollama is currently disconnected. Cue suggests using the "What Should I Do?" questionnaire to match your exact energy, location, and desired outcome.`,
    };
  },
};

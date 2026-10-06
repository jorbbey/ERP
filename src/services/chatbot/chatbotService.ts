import { ChatRequest, ChatResponse } from './types';
import { mockChatbotService } from './mockChatbotService';

/**
 * ChatbotService acts as the central interface for all AI Assistant interactions.
 * It currently dispatches to MockChatbotService using the rich in-memory ERPContext.
 * 
 * Future AI Integration:
 * When connecting to a real backend (e.g. Gemini API proxy / Express backend / Cloud Functions),
 * simply replace or augment the `sendMessage` implementation here.
 */
class ChatbotService {
  private useRealBackend: boolean = false;

  constructor() {
    // Check if backend API URL is configured in environment
    if (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_AI_BACKEND_URL) {
      this.useRealBackend = true;
    }
  }

  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      if (this.useRealBackend) {
        // Example integration point for real backend:
        // const res = await fetch('/api/chatbot', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(request)
        // });
        // return await res.json();
      }

      // Default production-ready mock domain engine
      return await mockChatbotService.processQuery(request);
    } catch (error) {
      console.error('Error processing chatbot query:', error);
      return {
        message: 'Sorry, I encountered an unexpected error processing your request. Please try asking again.',
        suggestedFollowUps: [
          'Show me active projects',
          'What items are low in stock?',
          'Show pending requisitions'
        ]
      };
    }
  }
}

export const chatbotService = new ChatbotService();

/**
 * AI Integration Layer - Entry Point
 * This module exports all components needed for AI integration with mental models
 */

// Export interfaces
export * from './interfaces';

// Export services
export { AIModelService } from './ai-model-service';

// Export server
export { AIModelServer } from './ai-model-server';

// Export a convenient factory function for easy instantiation
export function createAIModelServer() {
    return new AIModelServer();
} 
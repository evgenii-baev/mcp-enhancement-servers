/**
 * AI Model Server
 * Provides an API for AI assistants to interact with mental models
 */

import { AIModelService } from './ai-model-service';
import { AIModelRequest, AIModelResponse } from './interfaces';

/**
 * Server that exposes the AI model integration service to external clients
 */
export class AIModelServer {
    private modelService: AIModelService;

    constructor() {
        this.modelService = new AIModelService();
    }

    /**
     * Main API method for AI assistants to get recommended models
     * @param request The request from an AI assistant
     * @returns Response with recommended models and reasoning
     */
    public getModelRecommendations(request: AIModelRequest): AIModelResponse {
        try {
            // Validate the request
            if (!request.context || request.context.trim() === '') {
                return this.createErrorResponse('Context is required for model recommendations');
            }

            // Get model recommendations
            return this.modelService.findModels(request);
        } catch (error) {
            console.error('Error processing model recommendation request:', error);
            return this.createErrorResponse('Failed to process recommendation request');
        }
    }

    /**
     * Generate a response for error cases
     */
    private createErrorResponse(message: string): AIModelResponse {
        return {
            recommendedModels: [],
            reasoning: `Error: ${message}`
        };
    }

    /**
     * Tool description for AI assistants
     * This provides metadata about how this tool should be used by AI
     */
    public static getToolDescription(): any {
        return {
            name: "ai_model_recommender",
            description: "Recommends optimal mental models or algorithms for programming tasks based on context and requirements",
            parameters: {
                type: "object",
                properties: {
                    context: {
                        type: "string",
                        description: "Description of the programming task or problem"
                    },
                    constraints: {
                        type: "array",
                        items: {
                            type: "string"
                        },
                        description: "Any limitations or requirements that might affect the choice of model"
                    },
                    languages: {
                        type: "array",
                        items: {
                            type: "string"
                        },
                        description: "Programming languages being used"
                    },
                    projectScale: {
                        type: "string",
                        enum: ["small", "medium", "large", "enterprise"],
                        description: "Size of the project"
                    },
                    returnAllMatches: {
                        type: "boolean",
                        description: "Whether to return all applicable models or just the best matches"
                    }
                },
                required: ["context"]
            }
        };
    }

    /**
     * Example usage for AI assistants
     */
    public static getExampleUsage(): string {
        return `
Example 1: Request for a specific programming problem
{
  "context": "I need to design a class hierarchy for a vehicle system, but I'm concerned about flexibility",
  "languages": ["java"],
  "projectScale": "medium",
  "returnAllMatches": false
}

Example 2: Request with constraints
{
  "context": "I'm implementing a search algorithm and need to optimize performance",
  "constraints": ["memory usage is limited", "must handle large datasets"],
  "languages": ["python"],
  "projectScale": "large"
}

Example 3: Simple request
{
  "context": "How should I structure my React components to avoid prop drilling?"
}
`;
    }
} 
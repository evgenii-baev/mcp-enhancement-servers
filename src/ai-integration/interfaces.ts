/**
 * Interfaces for AI Integration Layer
 * This module defines the core interfaces for AI assistants to interact with mental models
 */

/**
 * Metadata specifically designed to help AI assistants understand when to apply a mental model
 */
export interface AIModelMetadata {
    /**
     * Short description of what this model helps with (for AI context)
     */
    aiDescription: string;

    /**
     * Keywords that trigger consideration of this model (for semantic matching)
     */
    keywords: string[];

    /**
     * Problem domains where this model is particularly effective
     */
    domains: string[];

    /**
     * Examples of code patterns or situations where this model applies
     */
    codePatterns?: string[];

    /**
     * Relative priority for the AI to consider this model (1-10, 10 being highest)
     */
    aiPriority: number;
}

/**
 * Extended model interface with AI-specific metadata
 */
export interface AIEnhancedModel {
    /**
     * Original model ID
     */
    id: string;

    /**
     * Display name of the mental model
     */
    name: string;

    /**
     * Whether AI should always consider this model for programming tasks
     */
    always_consider: boolean;

    /**
     * Core definition of the model
     */
    definition: string;

    /**
     * Specific scenarios where the model is applicable
     */
    when_to_use: string[];

    /**
     * Systematic steps to apply the model
     */
    steps: string[];

    /**
     * Practical example of the model's application
     */
    example: string;

    /**
     * Common mistakes or issues when using this model
     */
    pitfalls: string[];

    /**
     * AI-specific metadata to help assistants understand and apply the model
     */
    aiMetadata?: AIModelMetadata;
}

/**
 * Request from an AI assistant to the integration layer
 */
export interface AIModelRequest {
    /**
     * The programming task or problem description
     */
    context: string;

    /**
     * Specific constraints or requirements
     */
    constraints?: string[];

    /**
     * Programming language(s) being used
     */
    languages?: string[];

    /**
     * Project scale (small, medium, large, enterprise)
     */
    projectScale?: string;

    /**
     * Whether to return all applicable models or just the best match
     */
    returnAllMatches?: boolean;
}

/**
 * Response to an AI assistant with recommended model(s)
 */
export interface AIModelResponse {
    /**
     * Array of recommended models, sorted by relevance
     */
    recommendedModels: AIEnhancedModel[];

    /**
     * Explanation of why these models were selected
     */
    reasoning: string;

    /**
     * Suggested approach combining multiple models if applicable
     */
    suggestedApproach?: string;
} 
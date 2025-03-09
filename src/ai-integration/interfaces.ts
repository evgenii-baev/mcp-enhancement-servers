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

/**
 * Interface definitions for the AI Integration Layer
 */

/**
 * Enhanced tool description for AI assistants
 * Contains additional metadata and guidance to help AI assistants effectively utilize MCP tools
 */
export interface AIToolDescription {
    /** Internal name of the tool, used for API calls */
    name: string;

    /** User-friendly display name */
    displayName: string;

    /** Detailed description of the tool with usage guidelines */
    description: string;

    /** Category for grouping related tools */
    category: string;

    /** Priority level (lower number = higher priority) */
    priority: number;

    /** Hints specifically for AI assistants on when and how to use this tool */
    aiUsageHints: string[];
}

/**
 * Tool recommendation for a specific context
 * Used to suggest appropriate tools based on user intent or problem type
 */
export interface ToolRecommendation {
    /** The tool being recommended */
    tool: AIToolDescription;

    /** Confidence score for this recommendation (0-1) */
    confidence: number;

    /** Explanation of why this tool is recommended for the current context */
    rationale: string;

    /** Optional suggested parameters for the tool in the current context */
    suggestedParameters?: Record<string, any>;
}

/**
 * Context information for tool recommendations
 * Information about the user's current task or problem to help recommend appropriate tools
 */
export interface RecommendationContext {
    /** Description of the user's problem or task */
    problemStatement: string;

    /** Optional domain or category of the problem */
    domain?: string;

    /** Optional complexity level of the problem */
    complexity?: 'simple' | 'moderate' | 'complex';

    /** Optional constraints that might affect tool selection */
    constraints?: string[];

    /** Optional previously used tools that didn't fully solve the problem */
    previouslyUsedTools?: string[];
}

/**
 * Options for tool recommendation
 */
export interface RecommendationOptions {
    /** Maximum number of tools to recommend */
    maxRecommendations?: number;

    /** Minimum confidence threshold for recommendations */
    confidenceThreshold?: number;

    /** Whether to include parameter suggestions */
    includeSuggestedParameters?: boolean;

    /** Categories to filter recommendations by */
    categoryFilter?: string[];
}

/**
 * Service interface for the AI tool recommendation system
 */
export interface AIToolRecommendationService {
    /**
     * Get recommended tools based on the given context
     * @param context Information about the user's current task or problem
     * @param options Options for customizing recommendations
     * @returns Array of tool recommendations sorted by confidence
     */
    getRecommendedTools(
        context: RecommendationContext,
        options?: RecommendationOptions
    ): ToolRecommendation[];

    /**
     * Get all available tool descriptions
     * @returns Array of all tool descriptions
     */
    getAllToolDescriptions(): AIToolDescription[];

    /**
     * Get tool descriptions by category
     * @param category The category to filter by
     * @returns Array of tool descriptions in the specified category
     */
    getToolDescriptionsByCategory(category: string): AIToolDescription[];

    /**
     * Get detailed information about a specific tool
     * @param toolName The name of the tool to get information for
     * @returns The tool description or undefined if not found
     */
    getToolDescription(toolName: string): AIToolDescription | undefined;
} 
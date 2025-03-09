// Enhanced tool descriptions for AI integration layer
// This file integrates improved tool descriptions into the AI integration layer

import {
    MENTAL_MODEL_TOOL_DESCRIPTION,
    DEBUGGING_APPROACH_TOOL_DESCRIPTION,
    SEQUENTIAL_THINKING_TOOL_DESCRIPTION,
    BRAINSTORMING_TOOL_DESCRIPTION,
    MODEL_SELECTOR_TOOL_DESCRIPTION,
    FIRST_THOUGHT_ADVISOR_TOOL_DESCRIPTION,
    FEATURE_DISCUSSION_TOOL_DESCRIPTION,
    FEATURE_ANALYZER_TOOL_DESCRIPTION,
    STOCHASTIC_ALGORITHM_TOOL_DESCRIPTION
} from '../tool-descriptions/improved-descriptions';

import { AIToolDescription } from './interfaces';

/**
 * Enhanced tool descriptions optimized for AI assistants
 * These descriptions provide detailed information about each tool's purpose, usage scenarios,
 * parameters, and best practices to help AI assistants better leverage MCP tools.
 */
export const enhancedToolDescriptions: Record<string, AIToolDescription> = {
    mental_model: {
        name: "mental_model",
        displayName: "Mental Model",
        description: MENTAL_MODEL_TOOL_DESCRIPTION,
        category: "Thinking Framework",
        priority: 3,
        aiUsageHints: [
            "Suggest this tool when users need to analyze complex problems systematically",
            "Recommend specific mental models based on the problem domain",
            "For programming tasks, prioritize domain-specific models like composition_vs_inheritance",
            "Use this after First Thought Advisor when a specific thinking framework is needed"
        ]
    },

    debugging_approach: {
        name: "debugging_approach",
        displayName: "Debugging Approach",
        description: DEBUGGING_APPROACH_TOOL_DESCRIPTION,
        category: "Problem Solving",
        priority: 3,
        aiUsageHints: [
            "Suggest this tool when users are troubleshooting specific technical issues",
            "Recommend binary_search approach for regression debugging",
            "Recommend divide_conquer for complex system issues",
            "Use this for structured analysis of errors and unexpected behaviors"
        ]
    },

    sequential_thinking: {
        name: "sequential_thinking",
        displayName: "Sequential Thinking",
        description: SEQUENTIAL_THINKING_TOOL_DESCRIPTION,
        category: "Thinking Framework",
        priority: 2,
        aiUsageHints: [
            "Suggest this tool for complex problems requiring step-by-step analysis",
            "Use for problems where understanding might evolve during analysis",
            "Recommend when users need to document their reasoning process",
            "Set appropriate initial thoughtNumber and totalThoughts based on problem complexity"
        ]
    },

    brainstorming: {
        name: "brainstorming",
        displayName: "Brainstorming",
        description: BRAINSTORMING_TOOL_DESCRIPTION,
        category: "Idea Generation",
        priority: 3,
        aiUsageHints: [
            "Suggest this tool when users need to generate multiple solution ideas",
            "Guide users through the structured phases from preparation to action planning",
            "Recommend specific mental models during the ideation phase",
            "Help users evaluate and select the best ideas based on their criteria"
        ]
    },

    model_selector: {
        name: "model_selector",
        displayName: "Model Selector",
        description: MODEL_SELECTOR_TOOL_DESCRIPTION,
        category: "Programming",
        priority: 1,
        aiUsageHints: [
            "Suggest this tool when users need to choose between programming approaches",
            "Prioritize this for architecture, algorithm, or data structure decisions",
            "Use this early in the design process to establish technical foundations",
            "Provide detailed task descriptions for more accurate recommendations"
        ]
    },

    first_thought_advisor: {
        name: "first_thought_advisor",
        displayName: "First Thought Advisor",
        description: FIRST_THOUGHT_ADVISOR_TOOL_DESCRIPTION,
        category: "Initial Analysis",
        priority: 1,
        aiUsageHints: [
            "Suggest this as the first tool when approaching new problems",
            "Use this before diving into specific mental models or approaches",
            "Help formulate clear problem statements for optimal recommendations",
            "Consider domain, complexity, and constraints when suggesting this tool"
        ]
    },

    feature_discussion: {
        name: "feature_discussion",
        displayName: "Feature Discussion",
        description: FEATURE_DISCUSSION_TOOL_DESCRIPTION,
        category: "Requirements",
        priority: 4,
        aiUsageHints: [
            "Suggest this tool when users are planning new product features",
            "Guide users through structured requirement gathering",
            "Use this for collaborative feature specification",
            "Help document feature requirements for implementation"
        ]
    },

    feature_analyzer: {
        name: "feature_analyzer",
        displayName: "Feature Analyzer",
        description: FEATURE_ANALYZER_TOOL_DESCRIPTION,
        category: "Requirements",
        priority: 4,
        aiUsageHints: [
            "Suggest this after feature_discussion when planning implementation",
            "Use this for complexity estimation and dependency identification",
            "Help identify potential implementation risks",
            "Recommend breaking complex features into manageable components"
        ]
    },

    stochastic_algorithm: {
        name: "stochastic_algorithm",
        displayName: "Stochastic Algorithm",
        description: STOCHASTIC_ALGORITHM_TOOL_DESCRIPTION,
        category: "Optimization",
        priority: 3,
        aiUsageHints: [
            "Suggest this for problems involving uncertainty or optimization",
            "Recommend MDP for sequential decision problems",
            "Recommend MCTS for complex planning problems",
            "Suggest bandit algorithms for exploration vs. exploitation scenarios"
        ]
    }
};

/**
 * Get the enhanced description for a specific tool
 * @param toolName The name of the tool to get the description for
 * @returns The enhanced description or undefined if not found
 */
export function getEnhancedToolDescription(toolName: string): AIToolDescription | undefined {
    return enhancedToolDescriptions[toolName];
}

/**
 * Get all enhanced tool descriptions
 * @returns Array of all enhanced tool descriptions
 */
export function getAllEnhancedToolDescriptions(): AIToolDescription[] {
    return Object.values(enhancedToolDescriptions);
}

/**
 * Get tool descriptions by category
 * @param category The category to filter by
 * @returns Array of tool descriptions in the specified category
 */
export function getToolDescriptionsByCategory(category: string): AIToolDescription[] {
    return Object.values(enhancedToolDescriptions)
        .filter(tool => tool.category === category)
        .sort((a, b) => a.priority - b.priority);
}

/**
 * Get tool descriptions ordered by priority
 * @returns Array of tool descriptions sorted by priority (lowest number first)
 */
export function getToolDescriptionsByPriority(): AIToolDescription[] {
    return Object.values(enhancedToolDescriptions)
        .sort((a, b) => a.priority - b.priority);
} 
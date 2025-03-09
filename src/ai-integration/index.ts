/**
 * AI Integration Layer for MCP Clear Thought Server
 * 
 * This module provides enhanced tool descriptions, recommendations, and guidance 
 * for AI assistants to better utilize the MCP tools.
 */

import {
    AIToolDescription,
    AIToolRecommendationService,
    RecommendationContext,
    RecommendationOptions,
    ToolRecommendation
} from './interfaces';

import { ToolRecommendationService } from './tool-recommendation-service';
import {
    getAllEnhancedToolDescriptions,
    getEnhancedToolDescription,
    getToolDescriptionsByCategory,
    getToolDescriptionsByPriority
} from './enhanced-tool-descriptions';

// Create singleton instance of the recommendation service
const recommendationService = new ToolRecommendationService();

/**
 * AI Integration Layer API
 * Provides methods for AI assistants to better understand and utilize MCP tools
 */
export const AiIntegrationLayer = {
    /**
     * Get recommended tools for a given context
     * @param context The user's current context
     * @param options Options for recommendation
     * @returns Array of tool recommendations
     */
    recommendTools(context: RecommendationContext, options?: RecommendationOptions): ToolRecommendation[] {
        return recommendationService.getRecommendedTools(context, options);
    },

    /**
     * Get detailed information about a specific tool
     * @param toolName The name of the tool
     * @returns Enhanced tool description or undefined if not found
     */
    getToolDescription(toolName: string): AIToolDescription | undefined {
        return getEnhancedToolDescription(toolName);
    },

    /**
     * Get all available tool descriptions
     * @returns Array of all tool descriptions
     */
    getAllToolDescriptions(): AIToolDescription[] {
        return getAllEnhancedToolDescriptions();
    },

    /**
     * Get tool descriptions organized by category
     * @returns Record of tool descriptions grouped by category
     */
    getToolsByCategory(): Record<string, AIToolDescription[]> {
        const tools = getAllEnhancedToolDescriptions();
        const categories = Array.from(new Set(tools.map(tool => tool.category)));

        const result: Record<string, AIToolDescription[]> = {};
        categories.forEach(category => {
            result[category] = getToolDescriptionsByCategory(category);
        });

        return result;
    },

    /**
     * Get tool descriptions ordered by priority
     * @returns Array of tool descriptions sorted by priority
     */
    getToolsByPriority(): AIToolDescription[] {
        return getToolDescriptionsByPriority();
    },

    /**
     * Generate a summary of all available tools in a format suitable for AI assistants
     * @returns A string containing a summarized overview of all tools
     */
    getToolsSummary(): string {
        const tools = getToolDescriptionsByPriority();
        const categories = Array.from(new Set(tools.map(tool => tool.category)));

        let summary = "# Available MCP Mental Models Tool Summary\n\n";
        summary += "The following tools are available to help with problem-solving, analysis, and decision-making:\n\n";

        // Add category-based summaries
        categories.forEach(category => {
            const categoryTools = tools.filter(tool => tool.category === category);
            summary += `## ${category} Tools\n\n`;

            categoryTools.forEach(tool => {
                summary += `### ${tool.displayName} (${tool.name})\n`;

                // Add a brief description (first paragraph only)
                const briefDescription = tool.description.split('\n\n')[0];
                summary += `${briefDescription}\n\n`;

                // Add when to use (extract from description)
                const whenToUseMatch = tool.description.match(/WHEN TO USE:([\s\S]*?)(?=\n\n[A-Z]|$)/);
                if (whenToUseMatch && whenToUseMatch[1]) {
                    summary += "**When to use:**\n";
                    summary += `${whenToUseMatch[1].trim()}\n\n`;
                }

                // Add hints for AI
                summary += "**AI Usage Hints:**\n";
                tool.aiUsageHints.forEach(hint => {
                    summary += `- ${hint}\n`;
                });

                summary += "\n";
            });
        });

        // Add usage guidelines
        summary += "## Usage Guidelines\n\n";
        summary += "1. Start with First Thought Advisor or Model Selector for initial approach selection\n";
        summary += "2. Use Sequential Thinking, Mental Model, or Debugging Approach for structured analysis\n";
        summary += "3. Consider Brainstorming or Stochastic Algorithm for solution generation and optimization\n";
        summary += "4. Use Feature Discussion and Feature Analyzer for requirements gathering and planning\n\n";

        summary += "For detailed information about any specific tool, use the `getToolDescription(toolName)` method.\n";

        return summary;
    }
};

// Export interface types for external use
export {
    AIToolDescription,
    AIToolRecommendationService,
    RecommendationContext,
    RecommendationOptions,
    ToolRecommendation
}; 
/**
 * Improved tool definitions for the MCP servers
 * Uses enhanced descriptions from tool-descriptions module
 */

import { Tool } from "@modelcontextprotocol/sdk/types.js";

// Import improved descriptions
import {
    MENTAL_MODEL_TOOL_DESCRIPTION,
    SEQUENTIAL_THINKING_TOOL_DESCRIPTION,
    DEBUGGING_APPROACH_TOOL_DESCRIPTION,
    BRAINSTORMING_TOOL_DESCRIPTION,
    STOCHASTIC_ALGORITHM_TOOL_DESCRIPTION,
    FEATURE_DISCUSSION_TOOL_DESCRIPTION,
    FEATURE_ANALYZER_TOOL_DESCRIPTION,
    MODEL_SELECTOR_TOOL_DESCRIPTION,
    FIRST_THOUGHT_ADVISOR_TOOL_DESCRIPTION
} from './tool-descriptions/improved-descriptions.js';

/**
 * Creates a Tool definition for the MCP SDK from a tool description
 */
function createToolFromDescription(description: any): Tool {
    // Extract parameter descriptions to create inputSchema
    const properties: any = {};
    for (const [paramName, paramDesc] of Object.entries(description.parameterDescriptions || {})) {
        properties[paramName] = {
            description: paramDesc
        };

        // Add additional schema information if available
        if (description.parameterTypes && description.parameterTypes[paramName]) {
            const paramType = description.parameterTypes[paramName];
            if (paramType === 'string') {
                properties[paramName].type = 'string';
            } else if (paramType === 'number' || paramType === 'integer') {
                properties[paramName].type = paramType;
            } else if (paramType === 'boolean') {
                properties[paramName].type = 'boolean';
            } else if (paramType === 'array') {
                properties[paramName].type = 'array';
                if (description.parameterItemTypes && description.parameterItemTypes[paramName]) {
                    properties[paramName].items = { type: description.parameterItemTypes[paramName] };
                }
            }
        }
    }

    // Create required array from requiredParameters
    const required = description.requiredParameters || [];

    // Create the tool with appropriate schema
    return {
        name: description.toolName || description.name.toLowerCase().replace(/\s+/g, '_'),
        description: description.purpose,
        details: description.whenToUse.join('\n\n') + '\n\n' + description.bestPractices.join('\n\n'),
        inputSchema: {
            type: 'object',
            properties,
            required
        }
    };
}

// Create tools from descriptions
export const MENTAL_MODEL_TOOL: Tool = createToolFromDescription(MENTAL_MODEL_TOOL_DESCRIPTION);
export const SEQUENTIAL_THINKING_TOOL: Tool = createToolFromDescription(SEQUENTIAL_THINKING_TOOL_DESCRIPTION);
export const DEBUGGING_APPROACH_TOOL: Tool = createToolFromDescription(DEBUGGING_APPROACH_TOOL_DESCRIPTION);
export const BRAINSTORMING_TOOL: Tool = createToolFromDescription(BRAINSTORMING_TOOL_DESCRIPTION);
export const STOCHASTIC_ALGORITHM_TOOL: Tool = createToolFromDescription(STOCHASTIC_ALGORITHM_TOOL_DESCRIPTION);
export const FEATURE_DISCUSSION_TOOL: Tool = createToolFromDescription(FEATURE_DISCUSSION_TOOL_DESCRIPTION);
export const FEATURE_ANALYZER_TOOL: Tool = createToolFromDescription(FEATURE_ANALYZER_TOOL_DESCRIPTION);
export const MODEL_SELECTOR_TOOL: Tool = createToolFromDescription(MODEL_SELECTOR_TOOL_DESCRIPTION);
export const FIRST_THOUGHT_ADVISOR_TOOL: Tool = createToolFromDescription(FIRST_THOUGHT_ADVISOR_TOOL_DESCRIPTION); 
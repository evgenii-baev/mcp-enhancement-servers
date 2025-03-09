import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
    Tool,
    McpError,
    ErrorCode,
} from "@modelcontextprotocol/sdk/types.js";

import { AiIntegrationLayer } from './index';
import {
    RecommendationContext,
    RecommendationOptions
} from './interfaces';

/**
 * Tool definition for AI Tool Recommendation
 */
const AI_TOOL_RECOMMENDATION_TOOL: Tool = {
    name: "ai_tool_recommendation",
    description: "Recommends appropriate MCP tools based on the user's context and problem statement",
    inputSchema: {
        type: "object",
        properties: {
            problemStatement: {
                type: "string",
                description: "Description of the user's problem or task"
            },
            domain: {
                type: "string",
                description: "Optional domain or category of the problem"
            },
            complexity: {
                type: "string",
                enum: ["simple", "moderate", "complex"],
                description: "Optional complexity level of the problem"
            },
            constraints: {
                type: "array",
                items: { type: "string" },
                description: "Optional constraints that might affect tool selection"
            },
            previouslyUsedTools: {
                type: "array",
                items: { type: "string" },
                description: "Optional previously used tools that didn't fully solve the problem"
            },
            maxRecommendations: {
                type: "integer",
                description: "Maximum number of tools to recommend"
            },
            confidenceThreshold: {
                type: "number",
                description: "Minimum confidence threshold for recommendations"
            },
            includeSuggestedParameters: {
                type: "boolean",
                description: "Whether to include parameter suggestions"
            },
            categoryFilter: {
                type: "array",
                items: { type: "string" },
                description: "Categories to filter recommendations by"
            }
        },
        required: ["problemStatement"]
    }
};

/**
 * Tool definition for Getting Tool Description
 */
const GET_TOOL_DESCRIPTION_TOOL: Tool = {
    name: "get_tool_description",
    description: "Get detailed information about a specific MCP tool",
    inputSchema: {
        type: "object",
        properties: {
            toolName: {
                type: "string",
                description: "The name of the tool to get information for"
            }
        },
        required: ["toolName"]
    }
};

/**
 * Tool definition for Getting All Tool Descriptions
 */
const GET_ALL_TOOL_DESCRIPTIONS_TOOL: Tool = {
    name: "get_all_tool_descriptions",
    description: "Get descriptions for all available MCP tools",
    inputSchema: {
        type: "object",
        properties: {
            categoryFilter: {
                type: "string",
                description: "Optional category to filter by"
            },
            format: {
                type: "string",
                enum: ["detailed", "summary"],
                description: "Format of the response"
            }
        },
        required: []
    }
};

/**
 * MCP Server for AI Integration Layer
 * Exposes AI tool recommendation and enhanced descriptions through MCP
 */
export class AiIntegrationServer {
    private server: Server;

    constructor() {
        this.server = new Server(
            {
                name: "ai-integration-server",
                version: "1.0.0",
            },
            {
                capabilities: {
                    tools: {
                        ai_tool_recommendation: AI_TOOL_RECOMMENDATION_TOOL,
                        get_tool_description: GET_TOOL_DESCRIPTION_TOOL,
                        get_all_tool_descriptions: GET_ALL_TOOL_DESCRIPTIONS_TOOL,
                    },
                },
            }
        );

        // Register request handlers
        this.registerHandlers();
    }

    /**
     * Register handlers for server requests
     * @private
     */
    private registerHandlers(): void {
        // List tools handler
        this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
            tools: [
                AI_TOOL_RECOMMENDATION_TOOL,
                GET_TOOL_DESCRIPTION_TOOL,
                GET_ALL_TOOL_DESCRIPTIONS_TOOL,
            ],
        }));

        // Call tool handler
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            switch (request.params.name) {
                case "ai_tool_recommendation":
                    return this.handleAiToolRecommendation(request.params.arguments);
                case "get_tool_description":
                    return this.handleGetToolDescription(request.params.arguments);
                case "get_all_tool_descriptions":
                    return this.handleGetAllToolDescriptions(request.params.arguments);
                default:
                    throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${request.params.name}`);
            }
        });
    }

    /**
     * Handle AI tool recommendation requests
     * @param args Request arguments
     * @returns Tool response
     * @private
     */
    private handleAiToolRecommendation(args: unknown): {
        content: Array<{ type: string; text: string }>;
        isError?: boolean;
    } {
        try {
            const params = args as Record<string, any>;

            // Extract context parameters
            const context: RecommendationContext = {
                problemStatement: params.problemStatement,
                domain: params.domain,
                complexity: params.complexity as any,
                constraints: params.constraints,
                previouslyUsedTools: params.previouslyUsedTools
            };

            // Extract options parameters
            const options: RecommendationOptions = {
                maxRecommendations: params.maxRecommendations,
                confidenceThreshold: params.confidenceThreshold,
                includeSuggestedParameters: params.includeSuggestedParameters,
                categoryFilter: params.categoryFilter
            };

            // Get recommendations
            const recommendations = AiIntegrationLayer.recommendTools(context, options);

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(recommendations, null, 2)
                    }
                ]
            };
        } catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Error processing tool recommendation: ${error instanceof Error ? error.message : String(error)}`
                    }
                ],
                isError: true
            };
        }
    }

    /**
     * Handle requests for specific tool descriptions
     * @param args Request arguments
     * @returns Tool response
     * @private
     */
    private handleGetToolDescription(args: unknown): {
        content: Array<{ type: string; text: string }>;
        isError?: boolean;
    } {
        try {
            const params = args as Record<string, any>;
            const toolName = params.toolName;

            if (!toolName) {
                throw new Error("toolName is required");
            }

            const toolDescription = AiIntegrationLayer.getToolDescription(toolName);

            if (!toolDescription) {
                throw new Error(`Tool '${toolName}' not found`);
            }

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(toolDescription, null, 2)
                    }
                ]
            };
        } catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Error getting tool description: ${error instanceof Error ? error.message : String(error)}`
                    }
                ],
                isError: true
            };
        }
    }

    /**
     * Handle requests for all tool descriptions
     * @param args Request arguments
     * @returns Tool response
     * @private
     */
    private handleGetAllToolDescriptions(args: unknown): {
        content: Array<{ type: string; text: string }>;
        isError?: boolean;
    } {
        try {
            const params = args as Record<string, any>;
            const categoryFilter = params.categoryFilter;
            const format = params.format || "detailed";

            let result;

            if (format === "summary") {
                // Get summarized version
                result = AiIntegrationLayer.getToolsSummary();

                return {
                    content: [
                        {
                            type: "text",
                            text: result
                        }
                    ]
                };
            } else {
                // Get detailed version
                if (categoryFilter) {
                    result = AiIntegrationLayer.getToolDescriptionsByCategory(categoryFilter);
                } else {
                    result = AiIntegrationLayer.getAllToolDescriptions();
                }

                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify(result, null, 2)
                        }
                    ]
                };
            }
        } catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Error getting tool descriptions: ${error instanceof Error ? error.message : String(error)}`
                    }
                ],
                isError: true
            };
        }
    }

    /**
     * Start the server
     */
    public start(): void {
        console.log("Starting AI Integration Server...");
        this.server.listen(new StdioServerTransport());
        console.log("AI Integration Server started");
    }
}

// Add StdioServerTransport import at the top if not already there
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

/**
 * Create and start the AI Integration Server
 */
export function startAiIntegrationServer(): void {
    const server = new AiIntegrationServer();
    server.start();
}

// If this file is run directly, start the server
if (require.main === module) {
    startAiIntegrationServer();
} 
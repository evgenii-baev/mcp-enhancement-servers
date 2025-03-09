#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
    Tool,
    McpError,
    ErrorCode,
} from "@modelcontextprotocol/sdk/types.js"
// Fixed chalk import for ESM
import chalk from "chalk"
import {
    MentalModel,
    getMentalModelById,
    getAllMentalModelIds,
    formatMentalModelOutput,
} from "./src/models/mental-models.js"
import { ServerBridge } from "./src/bridge/server-bridge.js"
import { ThoughtOrchestrator } from "./src/core/thought-orchestrator.js"
import {
    ThoughtData,
    MentalModelData,
    DebuggingApproachData,
    FormattedOutput
} from './src/interfaces/server-interfaces.js'

// Импорт определений инструментов
import {
    MENTAL_MODEL_TOOL,
    DEBUGGING_APPROACH_TOOL,
    SEQUENTIAL_THINKING_TOOL,
    BRAINSTORMING_TOOL,
    FIRST_THOUGHT_ADVISOR_TOOL,
    STOCHASTIC_ALGORITHM_TOOL
} from "./src/tools/index.js"

// Импорт классов серверов
import {
    BrainstormingServer,
    MentalModelServer,
    DebuggingApproachServer,
    SequentialThinkingServer,
    FirstThoughtAdvisorServer,
    StochasticAlgorithmServer
} from './src/servers/index.js'

// Create server instances
const mentalModelServer = new MentalModelServer()
const debuggingApproachServer = new DebuggingApproachServer()
const sequentialThinkingServer = new SequentialThinkingServer()
const brainstormingServer = new BrainstormingServer()
const firstThoughtAdvisorServer = new FirstThoughtAdvisorServer()
const stochasticAlgorithmServer = new StochasticAlgorithmServer()

// Create MCP server
const server = new Server(
    {
        name: "mcp-server-clear-thought",
        version: "0.0.2",
    },
    {
        capabilities: {
            tools: {
                "mental_model": MENTAL_MODEL_TOOL,
                "sequential_thinking": SEQUENTIAL_THINKING_TOOL,
                "debugging_approach": DEBUGGING_APPROACH_TOOL,
                "brainstorming": BRAINSTORMING_TOOL,
                "first_thought_advisor": FIRST_THOUGHT_ADVISOR_TOOL,
                "stochastic_algorithm": STOCHASTIC_ALGORITHM_TOOL,
            },
        },
    }
)

// Register tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
        MENTAL_MODEL_TOOL,
        DEBUGGING_APPROACH_TOOL,
        SEQUENTIAL_THINKING_TOOL,
        BRAINSTORMING_TOOL,
        FIRST_THOUGHT_ADVISOR_TOOL,
        STOCHASTIC_ALGORITHM_TOOL
    ],
}))

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const name = request.params.name
    const params = request.params.arguments

    try {
        switch (name) {
            case "mental_model":
                return mentalModelServer.processModel(params)
            case "debugging_approach":
                return debuggingApproachServer.processApproach(params)
            case "sequential_thinking":
                return sequentialThinkingServer.processThought(params)
            case "brainstorming":
                return brainstormingServer.processBrainstorming(params)
            case "first_thought_advisor":
                return firstThoughtAdvisorServer.processFirstThoughtAdvice(params)
            case "stochastic_algorithm":
                return stochasticAlgorithmServer.processAlgorithm(params)
            default:
                throw new McpError(
                    ErrorCode.MethodNotFound,
                    `Unknown tool: ${name}`
                )
        }
    } catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        error: error instanceof Error ? error.message : String(error),
                        status: "failed",
                    })
                }
            ],
            isError: true
        }
    }
})

// Start server
async function runServer() {
    const transport = new StdioServerTransport()
    await server.connect(transport)
    console.error("MCP Clear Thought Server running on stdio")
}

runServer().catch(console.error)

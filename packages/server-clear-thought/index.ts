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

// Import tools and servers from their respective modules
import {
    MENTAL_MODEL_TOOL,
    DEBUGGING_APPROACH_TOOL,
    SEQUENTIAL_THINKING_TOOL,
    BRAINSTORMING_TOOL,
    MODEL_SELECTOR_TOOL
} from "./src/tools/index.js"

import {
    MentalModelServer,
    DebuggingApproachServer,
    SequentialThinkingServer,
    BrainstormingServer,
    ModelSelectorServer
} from "./src/servers/index.js"

// Create server instances
const mentalModelServer = new MentalModelServer()
const debuggingApproachServer = new DebuggingApproachServer()
const sequentialThinkingServer = new SequentialThinkingServer()
const brainstormingServer = new BrainstormingServer()
const modelSelectorServer = new ModelSelectorServer()

// Create MCP server
const server = new Server(
    {
        name: "sequential-thinking-server",
        version: "0.2.0",
    },
    {
        capabilities: {
            tools: {
                "sequential_thinking": SEQUENTIAL_THINKING_TOOL,
                "mental_model": MENTAL_MODEL_TOOL,
                "debugging_approach": DEBUGGING_APPROACH_TOOL,
                "brainstorming": BRAINSTORMING_TOOL,
                "model_selector": MODEL_SELECTOR_TOOL,
            },
        },
    }
)

// Request Handlers
server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
        MENTAL_MODEL_TOOL,
        DEBUGGING_APPROACH_TOOL,
        SEQUENTIAL_THINKING_TOOL,
        BRAINSTORMING_TOOL,
        MODEL_SELECTOR_TOOL
    ],
}))

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: params } = request.params

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
            case "model_selector":
                return modelSelectorServer.processModelSelection(params)
            default:
                throw new McpError(
                    ErrorCode.MethodNotFound,
                    `Unknown tool: ${name}`
                )
        }
    } catch (error) {
        console.error(chalk.red(`Error processing ${name}:`), error)
        throw new McpError(
            ErrorCode.InternalError,
            error instanceof Error ? error.message : String(error)
        )
    }
})

// Start the server
async function runServer() {
    const transport = new StdioServerTransport()
    await server.connect(transport)
    console.error("Sequential Thinking MCP Server running on stdio")
}

runServer().catch((error) => {
    console.error("Fatal error running server:", error)
    process.exit(1)
})

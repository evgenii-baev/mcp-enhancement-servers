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

    console.error(`Handling request for tool: ${name}`)
    console.error(`Request parameters: ${JSON.stringify(params, null, 2)}`)

    try {
        let response

        switch (name) {
            case "mental_model":
                response = mentalModelServer.processModel(params)
                break
            case "debugging_approach":
                response = debuggingApproachServer.processApproach(params)
                break
            case "sequential_thinking":
                response = sequentialThinkingServer.processThought(params)
                break
            case "brainstorming":
                response = brainstormingServer.processBrainstorming(params)
                break
            case "first_thought_advisor":
                response = firstThoughtAdvisorServer.processFirstThoughtAdvice(params)
                break
            case "stochastic_algorithm":
                response = stochasticAlgorithmServer.processAlgorithm(params)
                break
            default:
                throw new McpError(
                    ErrorCode.MethodNotFound,
                    `Unknown tool: ${name}`
                )
        }

        // Проверка ответа на корректность
        if (!response || !response.content || !Array.isArray(response.content)) {
            console.error(`Invalid response format for tool ${name}: ${JSON.stringify(response)}`)
            throw new Error(`Invalid response format returned from ${name} server`)
        }

        return response
    } catch (error) {
        console.error(`Error handling request for tool ${name}:`, error)

        // Проверяем, есть ли stack trace
        if (error instanceof Error && error.stack) {
            console.error(`Stack trace: ${error.stack}`)
        }

        // Убедимся, что объект ошибки преобразуется в строку корректно
        let errorMessage = "Unknown error"

        try {
            if (error instanceof Error) {
                errorMessage = error.message
            } else if (typeof error === 'string') {
                errorMessage = error
            } else {
                errorMessage = JSON.stringify(error)
            }
        } catch (jsonError) {
            errorMessage = "Error cannot be converted to string"
        }

        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        error: errorMessage,
                        status: "failed",
                        tool: name
                    }, null, 2)
                }
            ],
            isError: true
        }
    }
})

// Error handler for uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught exception:', error)

    // Не завершаем процесс, чтобы сервер продолжил работу
    // Но записываем ошибку в лог
})

// Start server
async function runServer() {
    try {
        const transport = new StdioServerTransport()
        await server.connect(transport)
        console.error("MCP Clear Thought Server running on stdio")
    } catch (error) {
        console.error("Failed to start server:", error)
        process.exit(1)
    }
}

runServer().catch((error) => {
    console.error("Server startup error:", error)
    process.exit(1)
})

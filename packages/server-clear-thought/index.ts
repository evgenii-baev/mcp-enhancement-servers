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

// Импорт классов серверов
import {
    BrainstormingServer,
    FirstThoughtAdvisorServer,
    FeatureDiscussionServer,
    FeatureAnalyzerServer,
    StochasticAlgorithmServer
} from './src/servers/index.js'

// Tool Definitions
const MENTAL_MODEL_TOOL: Tool = {
    name: "mental_model",
    description: "A tool for applying structured mental models to problem-solving.",
    inputSchema: {
        type: "object",
        properties: {
            modelName: {
                type: "string",
                enum: [
                    "first_principles",
                    "opportunity_cost",
                    "error_propagation",
                    "rubber_duck",
                    "pareto_principle",
                    "occams_razor",
                    "regression_to_mean",
                    "confirmation_bias",
                    "normal_distribution",
                    "sensitivity_analysis",
                    "bayes_theorem",
                    "survivorship_bias",
                    "systems_thinking",
                    "thought_experiment",
                    "hanlons_razor",
                    "proximate_ultimate_causation",
                    "zero_sum_game",
                    "loss_aversion",
                    "sunk_cost",
                    "lateral_thinking",
                    "divergent_thinking",
                    "scientific_method",
                    "decision_tree",
                    "scenario_planning",
                    "simulation",
                    "catalysis",
                    "ecosystem"
                ]
            },
            problem: { type: "string" }
        },
        required: ["modelName", "problem"]
    }
};

const DEBUGGING_APPROACH_TOOL: Tool = {
    name: "debugging_approach",
    description: "A tool for applying systematic debugging approaches to technical issues.",
    inputSchema: {
        type: "object",
        properties: {
            approachName: {
                type: "string",
                enum: [
                    "binary_search",
                    "reverse_engineering",
                    "divide_conquer",
                    "backtracking",
                    "cause_elimination",
                    "program_slicing"
                ]
            },
            issue: { type: "string" },
            steps: {
                type: "array",
                items: { type: "string" }
            },
            findings: { type: "string" },
            resolution: { type: "string" }
        },
        required: ["approachName", "issue"]
    }
};

const SEQUENTIAL_THINKING_TOOL: Tool = {
    name: "sequential_thinking",
    description: "A tool for dynamic and reflective problem-solving through sequential thoughts.",
    inputSchema: {
        type: "object",
        properties: {
            thought: { type: "string" },
            thoughtNumber: {
                type: "integer",
                minimum: 1
            },
            totalThoughts: {
                type: "integer",
                minimum: 1
            },
            nextThoughtNeeded: { type: "boolean" },
            isRevision: { type: "boolean" },
            revisesThought: {
                type: "integer",
                minimum: 1
            },
            branchFromThought: {
                type: "integer",
                minimum: 1
            },
            branchId: { type: "string" },
            needsMoreThoughts: { type: "boolean" }
        },
        required: ["thought", "nextThoughtNeeded", "thoughtNumber", "totalThoughts"]
    }
};

const BRAINSTORMING_TOOL: Tool = {
    name: "brainstorming",
    description: "A tool for facilitating structured brainstorming sessions.",
    inputSchema: {
        type: "object",
        properties: {
            phase: {
                type: "string",
                enum: [
                    "preparation",
                    "ideation",
                    "clarification",
                    "evaluation",
                    "selection",
                    "action_planning"
                ]
            },
            topic: { type: "string" },
            sessionId: { type: "string" }
        },
        required: []
    }
};

const STOCHASTIC_ALGORITHM_TOOL: Tool = {
    name: "stochastic_algorithm",
    description: "A tool for applying stochastic algorithms to decision-making problems.",
    inputSchema: {
        type: "object",
        properties: {
            algorithm: {
                type: "string",
                enum: ["mdp", "mcts", "bandit", "bayesian", "hmm"]
            },
            problem: { type: "string" },
            parameters: {
                type: "object",
                additionalProperties: true
            },
            result: { type: "string" }
        },
        required: ["algorithm", "problem", "parameters"]
    }
};

const FIRST_THOUGHT_ADVISOR_TOOL: Tool = {
    name: "first_thought_advisor",
    description: "A tool that intelligently recommends the optimal mental model or algorithm for any problem.",
    inputSchema: {
        type: "object",
        properties: {
            problem: { type: "string" },
            goal: { type: "string" },
            domain: { type: "string" },
            complexity: { type: "string" },
            constraints: {
                type: "array",
                items: { type: "string" }
            },
            previousApproaches: {
                type: "array",
                items: { type: "string" }
            }
        },
        required: ["problem"]
    }
};

const FEATURE_DISCUSSION_TOOL: Tool = {
    name: "feature_discussion",
    description: "Start a new feature discussion",
    inputSchema: {
        type: "object",
        properties: {
            featureId: { type: "string" },
            response: { type: "string" }
        },
        required: ["featureId", "response"]
    }
};

const FEATURE_ANALYZER_TOOL: Tool = {
    name: "feature_analyzer",
    description: "Analyze a feature",
    inputSchema: {
        type: "object",
        properties: {
            featureName: { type: "string" },
            featureDescription: { type: "string" }
        },
        required: ["featureName"]
    }
};

const MODEL_SELECTOR_TOOL: Tool = {
    name: "model_selector",
    description: "A tool for selecting the optimal model for a given task.",
    inputSchema: {
        type: "object",
        properties: {
            task: { type: "string" },
            context: { type: "string" },
            constraints: {
                type: "array",
                items: { type: "string" }
            },
            preferences: {
                type: "array",
                items: { type: "string" }
            }
        },
        required: ["task"]
    }
};

// Server Classes
class MentalModelServer {
    private validateModelData(input: unknown): { modelName: string; problem: string } {
        const data = input as Record<string, unknown>

        if (!data.modelName || typeof data.modelName !== "string") {
            throw new Error("Invalid modelName: must be a string")
        }
        if (!data.problem || typeof data.problem !== "string") {
            throw new Error("Invalid problem: must be a string")
        }

        return {
            modelName: data.modelName,
            problem: data.problem,
        }
    }

    public processModel(input: unknown): FormattedOutput {
        try {
            const { modelName, problem } = this.validateModelData(input)
            const model = getMentalModelById(modelName)

            if (!model) {
                throw new Error(`Mental model '${modelName}' not found`)
            }

            // Create a copy of the model with the current problem
            const modelWithProblem: MentalModel = {
                ...model,
                definition: `Problem: ${problem}\n${model.definition}`,
            }

            const formattedOutput = formatMentalModelOutput(modelWithProblem)
            console.error(formattedOutput)

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(
                            {
                                modelName: model.name,
                                status: "success",
                                hasSteps: model.steps.length > 0,
                                problem,
                            },
                            null,
                            2
                        ),
                    },
                ],
            }
        } catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(
                            {
                                error: error instanceof Error ? error.message : String(error),
                                status: "failed",
                            },
                            null,
                            2
                        ),
                    },
                ],
                isError: true,
            }
        }
    }
}

class DebuggingApproachServer {
    private validateApproachData(input: unknown): DebuggingApproachData {
        const data = input as Record<string, unknown>

        if (!data.approachName || typeof data.approachName !== "string") {
            throw new Error("Invalid approachName: must be a string")
        }
        if (!data.issue || typeof data.issue !== "string") {
            throw new Error("Invalid issue: must be a string")
        }

        return {
            approachName: data.approachName,
            issue: data.issue,
            steps: Array.isArray(data.steps) ? data.steps.map(String) : [],
            findings: typeof data.findings === "string" ? data.findings : "",
            resolution: typeof data.resolution === "string" ? data.resolution : "",
        }
    }

    private formatApproachOutput(approachData: DebuggingApproachData): string {
        const { approachName, issue, steps, findings, resolution } = approachData
        const border = "─".repeat(Math.max(approachName.length + 25, issue.length + 4))

        return `
┌${border}┐
│ 🔍 Debugging Approach: ${approachName.padEnd(border.length - 21)} │
├${border}┤
│ Issue: ${issue.padEnd(border.length - 8)} │
├${border}┤
│ Steps:${" ".repeat(border.length - 7)} │
${steps.map((step) => `│ • ${step.padEnd(border.length - 4)} │`).join("\n")}
├${border}┤
│ Findings: ${findings.padEnd(border.length - 11)} │
├${border}┤
│ Resolution: ${resolution.padEnd(border.length - 12)} │
└${border}┘`
    }

    public processApproach(input: unknown): FormattedOutput {
        try {
            const validatedInput = this.validateApproachData(input)
            const formattedOutput = this.formatApproachOutput(validatedInput)
            console.error(formattedOutput)

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(
                            {
                                approachName: validatedInput.approachName,
                                status: "success",
                                hasSteps: validatedInput.steps.length > 0,
                                hasResolution: !!validatedInput.resolution,
                            },
                            null,
                            2
                        ),
                    },
                ],
            }
        } catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(
                            {
                                error: error instanceof Error ? error.message : String(error),
                                status: "failed",
                            },
                            null,
                            2
                        ),
                    },
                ],
                isError: true,
            }
        }
    }
}

class SequentialThinkingServer {
    private thoughtHistory: ThoughtData[] = []
    private branches: Record<string, ThoughtData[]> = {}

    private validateThoughtData(input: unknown): ThoughtData {
        const data = input as Record<string, unknown>

        if (!data.thought || typeof data.thought !== "string") {
            throw new Error("Invalid thought: must be a string")
        }
        if (!data.thoughtNumber || typeof data.thoughtNumber !== "number") {
            throw new Error("Invalid thoughtNumber: must be a number")
        }
        if (!data.totalThoughts || typeof data.totalThoughts !== "number") {
            throw new Error("Invalid totalThoughts: must be a number")
        }
        if (typeof data.nextThoughtNeeded !== "boolean") {
            throw new Error("Invalid nextThoughtNeeded: must be a boolean")
        }

        return {
            thought: data.thought,
            thoughtNumber: data.thoughtNumber,
            totalThoughts: data.totalThoughts,
            nextThoughtNeeded: data.nextThoughtNeeded,
            isRevision: data.isRevision as boolean | undefined,
            revisesThought: data.revisesThought as number | undefined,
            branchFromThought: data.branchFromThought as number | undefined,
            branchId: data.branchId as string | undefined,
            needsMoreThoughts: data.needsMoreThoughts as boolean | undefined,
        }
    }

    private formatThought(thoughtData: ThoughtData): string {
        const { thought, thoughtNumber, totalThoughts, nextThoughtNeeded } = thoughtData
        const border = "─".repeat(Math.max(50, Math.min(80, thought.length)))

        let header = `Thought ${thoughtNumber}/${totalThoughts}`
        if (thoughtData.isRevision) {
            header += ` (Revision of Thought ${thoughtData.revisesThought})`
        } else if (thoughtData.branchId) {
            header += ` (Branch: ${thoughtData.branchId}, from Thought ${thoughtData.branchFromThought})`
        }

        return `
┌${border}┐
│ ${header.padEnd(border.length - 2)} │
├${border}┤
${this.wrapText(thought, border.length - 4).map((line) => `│ ${line.padEnd(border.length - 2)} │`).join("\n")}
├${border}┤
│ ${nextThoughtNeeded ? "✓ Needs next thought" : "✗ Complete"} ${" ".repeat(border.length - 23)} │
└${border}┘`
    }

    private wrapText(text: string, maxLength: number): string[] {
        const words = text.split(" ")
        const lines: string[] = []
        let currentLine = ""

        for (const word of words) {
            if (currentLine.length + word.length + 1 <= maxLength) {
                currentLine += (currentLine ? " " : "") + word
            } else {
                lines.push(currentLine)
                currentLine = word
            }
        }

        if (currentLine) {
            lines.push(currentLine)
        }

        return lines
    }

    public processThought(input: unknown): FormattedOutput {
        try {
            const thoughtData = this.validateThoughtData(input)
            const { thoughtNumber, branchId, isRevision, revisesThought } = thoughtData

            // Handle branches
            if (branchId) {
                if (!this.branches[branchId]) {
                    this.branches[branchId] = []
                }

                // If this is a revision, update the existing thought in the branch
                if (isRevision && revisesThought) {
                    const thoughtIndex = this.branches[branchId].findIndex(
                        (t) => t.thoughtNumber === revisesThought
                    )
                    if (thoughtIndex >= 0) {
                        this.branches[branchId][thoughtIndex] = thoughtData
                    } else {
                        this.branches[branchId].push(thoughtData)
                    }
                } else {
                    this.branches[branchId].push(thoughtData)
                }
            } else {
                // Handle main thought history
                // If this is a revision, update the existing thought
                if (isRevision && revisesThought) {
                    const thoughtIndex = this.thoughtHistory.findIndex(
                        (t) => t.thoughtNumber === revisesThought
                    )
                    if (thoughtIndex >= 0) {
                        this.thoughtHistory[thoughtIndex] = thoughtData
                    } else {
                        this.thoughtHistory.push(thoughtData)
                    }
                } else {
                    this.thoughtHistory.push(thoughtData)
                }
            }

            const formattedOutput = this.formatThought(thoughtData)
            console.error(formattedOutput)

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(
                            {
                                thoughtNumber,
                                totalThoughts: thoughtData.totalThoughts,
                                nextThoughtNeeded: thoughtData.nextThoughtNeeded,
                                branches: Object.keys(this.branches),
                                thoughtHistoryLength: this.thoughtHistory.length,
                            },
                            null,
                            2
                        ),
                    },
                ],
            }
        } catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(
                            {
                                error: error instanceof Error ? error.message : String(error),
                                status: "failed",
                            },
                            null,
                            2
                        ),
                    },
                ],
                isError: true,
            }
        }
    }
}

// Класс для выбора модели
class ModelSelectorServer {
    public processModelSelection(input: unknown): FormattedOutput {
        try {
            // Обработка запроса на выбор модели
            return {
                content: [
                    {
                        type: 'text',
                        text: `Processed model selection: ${JSON.stringify(input)}`
                    }
                ]
            };
        } catch (error) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `Error processing model selection: ${error instanceof Error ? error.message : String(error)}`
                    }
                ],
                isError: true
            };
        }
    }
}

// Server Instances
const modelServer = new MentalModelServer()
const debuggingServer = new DebuggingApproachServer()
const thinkingServer = new SequentialThinkingServer()
const brainstormingServer = new BrainstormingServer()
const stochasticAlgorithmServer = new StochasticAlgorithmServer()
const firstThoughtAdvisorServer = new FirstThoughtAdvisorServer()
const featureDiscussionServer = new FeatureDiscussionServer()
const featureAnalyzerServer = new FeatureAnalyzerServer()
const modelSelectorServer = new ModelSelectorServer()

const server = new Server(
    {
        name: "clear-thought-server",
        version: "0.3.0",
    },
    {
        capabilities: {
            tools: {
                // 1. Базовые мыслительные инструменты (для основных задач мышления)
                "sequential_thinking": SEQUENTIAL_THINKING_TOOL,  // Основа последовательного мышления
                "mental_model": MENTAL_MODEL_TOOL,  // Применение ментальных моделей
                "debugging_approach": DEBUGGING_APPROACH_TOOL,  // Подходы к отладке

                // 2. Инструменты для генерации идей и анализа
                "first_thought_advisor": FIRST_THOUGHT_ADVISOR_TOOL,  // Помощь в выборе начального подхода
                "brainstorming": BRAINSTORMING_TOOL,  // Структурированный мозговой штурм

                // 3. Специализированные инструменты для сложных задач
                "stochastic_algorithm": STOCHASTIC_ALGORITHM_TOOL,  // Стохастические алгоритмы
                "model_selector": MODEL_SELECTOR_TOOL,  // Выбор оптимальной модели

                // 4. Инструменты для работы с функциями и требованиями
                "feature_discussion": FEATURE_DISCUSSION_TOOL,  // Обсуждение функций
                "feature_analyzer": FEATURE_ANALYZER_TOOL  // Анализ функций
            },
        },
    }
)

// Request Handlers
server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
        // 1. Базовые мыслительные инструменты (для основных задач мышления)
        SEQUENTIAL_THINKING_TOOL,  // Основа последовательного мышления
        MENTAL_MODEL_TOOL,  // Применение ментальных моделей
        DEBUGGING_APPROACH_TOOL,  // Подходы к отладке

        // 2. Инструменты для генерации идей и анализа
        FIRST_THOUGHT_ADVISOR_TOOL,  // Помощь в выборе начального подхода
        BRAINSTORMING_TOOL,  // Структурированный мозговой штурм

        // 3. Специализированные инструменты для сложных задач
        STOCHASTIC_ALGORITHM_TOOL,  // Стохастические алгоритмы
        MODEL_SELECTOR_TOOL,  // Выбор оптимальной модели

        // 4. Инструменты для работы с функциями и требованиями
        FEATURE_DISCUSSION_TOOL,  // Обсуждение функций
        FEATURE_ANALYZER_TOOL  // Анализ функций
    ],
}))

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: params } = request.params

    try {
        switch (name) {
            case "mental_model":
                return modelServer.processModel(params)
            case "debugging_approach":
                return debuggingServer.processApproach(params)
            case "sequential_thinking":
                return thinkingServer.processThought(params)
            case "brainstorming":
                return brainstormingServer.processBrainstorming(params)
            case "stochastic_algorithm":
                return stochasticAlgorithmServer.processAlgorithm(params)
            case "first_thought_advisor":
                return firstThoughtAdvisorServer.processAdvice(params)
            case "feature_discussion":
                return featureDiscussionServer.processDiscussion(params)
            case "feature_analyzer":
                return featureAnalyzerServer.processAnalysis(params)
            case "model_selector":
                return modelSelectorServer.processModelSelection(params)
            default:
                throw new McpError(
                    ErrorCode.MethodNotFound,
                    `Unknown tool: ${name}`
                )
        }
    } catch (error) {
        console.error(`Error processing ${name} request:`, error)
        throw error
    }
})

async function runServer() {
    const transport = new StdioServerTransport()
    await server.connect(transport)
    console.error("Sequential Thinking MCP Server running on stdio")
}

runServer().catch((error) => {
    console.error("Fatal error running server:", error)
    process.exit(1)
})

/**
 * Список доступных API
 */
export {
    // Расширенные серверы
    FirstThoughtAdvisorServer,
    FeatureDiscussionServer,
    FeatureAnalyzerServer,

    // Базовые серверы
    MentalModelServer,
    SequentialThinkingServer,
    BrainstormingServer,
    DebuggingApproachServer,
    StochasticAlgorithmServer,

    // Вспомогательные данные
    ThoughtData,
    MentalModelData,
    DebuggingApproachData,
}

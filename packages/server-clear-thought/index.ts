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
    details: `
        This tool helps apply mental models to analyze problems systematically.
        
        ## Programming-Oriented Mental Models
        The following new mental models are available specifically for programming tasks:
        
        - **composition_vs_inheritance**: Analyze when to use object composition vs inheritance for code reuse and flexibility
        - **single_responsibility**: Apply the Single Responsibility Principle to improve code modularity and maintainability
        - **interface_segregation**: Evaluate separation of interfaces from implementations for better abstraction and testing
        - **actor_model**: Design concurrent systems using the actor model to eliminate shared state problems
        - **time_space_complexity**: Analyze algorithm efficiency in terms of time and space requirements
        
        ## How to use programming models
        When faced with programming design decisions or optimization challenges, select the appropriate model based on your specific problem:
        
        - For class/object design questions → use composition_vs_inheritance or single_responsibility
        - For API/abstraction design → use interface_segregation
        - For concurrency/parallelism issues → use actor_model
        - For algorithm performance analysis → use time_space_complexity
        
        ## Example prompt
        "Apply the single_responsibility mental model to analyze our current UserManager class that handles authentication, database access, and email notifications."
    `,
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
                    "ecosystem",
                    // New programming-oriented mental models
                    "composition_vs_inheritance",
                    "single_responsibility",
                    "interface_segregation",
                    "actor_model",
                    "time_space_complexity"
                ],
                description: "The mental model to apply. For programming problems, consider using the specialized programming models: composition_vs_inheritance, single_responsibility, interface_segregation, actor_model, or time_space_complexity."
            },
            problem: {
                type: "string",
                description: "The problem to analyze using the selected mental model. For programming models, provide specific code design or architectural challenges."
            }
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
    details: `
    This tool guides you through a systematic brainstorming process, from preparation to action planning,
    helping generate, refine, evaluate, and implement ideas effectively. 
    
    Features:
    - Structured phase-based approach to brainstorming
    - Persistent sessions for ongoing brainstorming
    - Idea management with categories, voting, and action planning
    - Guidance specific to each phase of the process
    
    Use for: Brainstorming, exploring possibilities, creative problem-solving.
    `,
    inputSchema: {
        type: "object",
        properties: {
            sessionId: {
                type: "string",
                description: "Identifier for an existing brainstorming session. Use this to continue a previously started session, allowing for persistent brainstorming across multiple interactions."
            },
            topic: {
                type: "string",
                description: "The main subject or problem for brainstorming. Be specific enough to focus ideation but broad enough to allow creative solutions. Required when creating a new session."
            },
            phase: {
                type: "string",
                enum: ["preparation", "ideation", "clarification", "evaluation", "selection", "action_planning"],
                description: "Current phase of the brainstorming process. Progress through phases in sequence: preparation → ideation → clarification → evaluation → selection → action_planning."
            },
            newIdea: {
                type: "string",
                description: "A new idea to add to the session during the ideation phase. Should be clear, concise, and relevant to the brainstorming topic."
            },
            ideas: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        text: { type: "string" },
                        category: { type: "string" },
                        votes: { type: "number" },
                        selected: { type: "boolean" },
                        actions: {
                            type: "array",
                            items: { type: "string" }
                        }
                    },
                    required: ["text"]
                },
                description: "Collection of generated ideas for the brainstorming session. Grows during the ideation phase and gets refined in later phases."
            },
            ideaId: {
                type: "string",
                description: "Identifier for a specific idea, used when categorizing, voting for, selecting, or adding actions to an idea."
            },
            category: {
                type: "string",
                description: "Category name for grouping related ideas during the clarification phase. Helps organize ideas by theme or type."
            },
            voteForIdea: {
                type: "string",
                description: "ID of an idea to vote for during the evaluation phase. More votes indicate higher group preference."
            },
            selectIdea: {
                type: "string",
                description: "ID of an idea to mark as selected during the selection phase. Selected ideas move forward to action planning."
            },
            action: {
                type: "string",
                description: "Action step to add to a selected idea during the action planning phase. Should be specific and actionable."
            },
            constraints: {
                type: "array",
                items: { type: "string" },
                description: "Limitations or requirements to consider during brainstorming. Helps focus ideation on practical solutions that meet specific criteria."
            },
            participants: {
                type: "array",
                items: { type: "string" },
                description: "People involved in the brainstorming session. Tracking participants helps ensure diverse perspectives and assign responsibilities."
            },
            currentStep: {
                type: "number",
                description: "Current step in the brainstorming process. Helps track progress within each phase of the session."
            },
            totalSteps: {
                type: "number",
                description: "Total number of steps in the brainstorming process. Provides context for how far along the session has progressed."
            }
        }
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
    description: "Helps select the optimal architecture, design pattern, algorithm, or data structure for programming tasks.",
    details: `
        ## When to use
        - At the beginning of project design, when choosing an application architecture
        - When solving a specific problem that requires an appropriate design pattern
        - When selecting the most efficient algorithm for data processing
        - When choosing the optimal data structure for storing and accessing information
        - For comparing different approaches to solving the same task
        - When refactoring existing code and need guidance on better structures

        ## Categories of models
        This tool can recommend models from different categories:
        - **Architecture Models**: Microservices, Monolithic, Serverless, MVC, MVVM, Clean Architecture
        - **Design Patterns**: Factory, Singleton, Observer, Strategy, Decorator, etc.
        - **Algorithms**: Sorting (QuickSort, MergeSort), Searching (Binary Search, DFS/BFS), Graph algorithms
        - **Data Structures**: Arrays, LinkedLists, Trees, Graphs, HashMaps, Queues, Stacks
        - **Programming Paradigms**: OOP, Functional, Reactive, Event-driven
        - **Concurrency Models**: Threads, Actors, CSP, STM

        ## Example scenarios
        - Developing a scalable web application with high traffic
        - Implementing dynamic object creation based on configuration
        - Efficient sorting and searching in large datasets
        - Designing a cache with fast lookups and automatic expiration
        - Creating a system that needs to handle multiple types of notifications
        - Implementing a plugin architecture for extensibility

        ## Best practices
        - Provide detailed task descriptions for more accurate recommendations
        - Specify context, constraints, and preferences for more relevant results
        - Use this tool in early design phases to choose the optimal approach
        - Consider the trade-offs highlighted in the recommendations
        - For algorithms, describe the size and characteristics of your data
        - For architectures, mention scale, team size, and deployment considerations
        - Try comparing multiple models to understand trade-offs better

        ## Interpreting results
        The tool provides:
        - Top recommendations with explanations of why they match your needs
        - Pros and cons of each recommended approach
        - Complexity assessment (time/space for algorithms)
        - Common use cases where the model excels
        - Implementation considerations 
        - Alternatives to consider

        ## Integration
        Use this tool when users need help with software architecture, algorithm selection, or design patterns.
        For example:
        - When a user asks "What's the best way to structure my e-commerce app?"
        - When a user needs to choose between different sorting algorithms
        - When deciding on a pattern for implementing a feature with multiple variations
        - When a user mentions "I need to improve my application's performance" (suggest appropriate patterns)
        - When a user is deciding between different architectural approaches
    `,
    inputSchema: {
        type: "object",
        properties: {
            task: {
                type: "string",
                description: "The specific programming task or problem that requires a model/approach recommendation"
            },
            context: {
                type: "string",
                description: "Additional context about the project, environment, or requirements"
            },
            constraints: {
                type: "array",
                items: { type: "string" },
                description: "Any limitations or requirements that might affect the choice of model/approach"
            },
            preferences: {
                type: "array",
                items: { type: "string" },
                description: "Desired qualities or characteristics that the selected model/approach should have"
            },
            language: {
                type: "string",
                description: "Programming language being used (to provide language-specific recommendations)"
            },
            projectScale: {
                type: "string",
                description: "Size of the project (Small, Medium, Large, Enterprise) to influence architectural recommendations"
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
                // 1. Инструменты для начального анализа и выбора подхода
                "first_thought_advisor": FIRST_THOUGHT_ADVISOR_TOOL,  // Помощь в выборе начального подхода
                "model_selector": MODEL_SELECTOR_TOOL,  // Выбор оптимальной модели для задачи

                // 2. Базовые инструменты структурированного мышления
                "sequential_thinking": SEQUENTIAL_THINKING_TOOL,  // Основа последовательного мышления
                "mental_model": MENTAL_MODEL_TOOL,  // Применение ментальных моделей
                "debugging_approach": DEBUGGING_APPROACH_TOOL,  // Подходы к отладке

                // 3. Инструменты для генерации и оптимизации решений
                "brainstorming": BRAINSTORMING_TOOL,  // Структурированный мозговой штурм
                "stochastic_algorithm": STOCHASTIC_ALGORITHM_TOOL,  // Стохастические алгоритмы

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
        // 1. Инструменты для начального анализа и выбора подхода
        FIRST_THOUGHT_ADVISOR_TOOL,  // Помощь в выборе начального подхода
        MODEL_SELECTOR_TOOL,  // Выбор оптимальной модели для задачи

        // 2. Базовые инструменты структурированного мышления
        SEQUENTIAL_THINKING_TOOL,  // Основа последовательного мышления
        MENTAL_MODEL_TOOL,  // Применение ментальных моделей
        DEBUGGING_APPROACH_TOOL,  // Подходы к отладке

        // 3. Инструменты для генерации и оптимизации решений
        BRAINSTORMING_TOOL,  // Структурированный мозговой штурм
        STOCHASTIC_ALGORITHM_TOOL,  // Стохастические алгоритмы

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

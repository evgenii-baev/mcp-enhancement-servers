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

// Data Interfaces
interface ThoughtData {
    thought: string
    thoughtNumber: number
    totalThoughts: number
    isRevision?: boolean
    revisesThought?: number
    branchFromThought?: number
    branchId?: string
    needsMoreThoughts?: boolean
    nextThoughtNeeded: boolean
}

interface MentalModelData {
    modelName: string
    problem: string
    steps: string[]
    reasoning: string
    conclusion: string
}

interface DebuggingApproachData {
    approachName: string
    issue: string
    steps: string[]
    findings: string
    resolution: string
}

interface BrainstormingData {
    topic: string // Тема для брейнсторминга
    phase: BrainstormingPhase // Текущая фаза брейнсторминга
    ideas: BrainstormingIdea[] // Список идей
    constraints?: string[] // Ограничения (опционально)
    participants?: string[] // Участники (опционально)
    timeLimit?: number // Ограничение по времени в минутах (опционально)
    recommendedModels?: string[] // Рекомендуемые ментальные модели (опционально)
    currentStep?: number // Текущий шаг в процессе (опционально)
    totalSteps?: number // Общее количество шагов (опционально)
}

interface BrainstormingIdea {
    id: string // Уникальный идентификатор идеи
    content: string // Содержание идеи
    category?: string // Категория идеи (опционально)
    votes?: number // Количество голосов (опционально)
    buildUpon?: string[] // Идеи, на которых основана эта идея (опционально)
    createdAt: number // Время создания (timestamp)
}

enum BrainstormingPhase {
    PREPARATION = "preparation", // Подготовка (определение темы, участников, ограничений)
    IDEATION = "ideation", // Генерация идей
    CLARIFICATION = "clarification", // Уточнение и объяснение идей
    EVALUATION = "evaluation", // Оценка идей
    SELECTION = "selection", // Выбор лучших идей
    ACTION_PLANNING = "action_planning", // Планирование действий
}

// Model Selector interfaces
interface ModelCategory {
    id: string;
    name: string;
    description: string;
    applicableGoals: string[];
    models: string[];
}

interface ModelSelectorData {
    problem: string;
    domain?: string;
    goal?: string;
    constraints?: string[];
    complexity?: 'low' | 'medium' | 'high';
    previousApproaches?: string[];
}

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

    public processModel(input: unknown): {
        content: Array<{ type: string; text: string }>
        isError?: boolean
    } {
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

    public processApproach(input: unknown): {
        content: Array<{ type: string; text: string }>
        isError?: boolean
    } {
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
        const {
            thoughtNumber,
            totalThoughts,
            thought,
            isRevision,
            revisesThought,
            branchFromThought,
            branchId,
        } = thoughtData

        let prefix = ""
        let context = ""

        if (isRevision) {
            prefix = chalk.yellow("🔄 Revision")
            context = ` (revising thought ${revisesThought})`
        } else if (branchFromThought) {
            prefix = chalk.green("🌿 Branch")
            context = ` (from thought ${branchFromThought}, ID: ${branchId})`
        } else {
            prefix = chalk.blue("💭 Thought")
            context = ""
        }

        const header = `${prefix} ${thoughtNumber}/${totalThoughts}${context}`
        const border = "─".repeat(Math.max(header.length, thought.length) + 4)

        return `
┌${border}┐
│ ${header} │
├${border}┤
│ ${thought.padEnd(border.length - 2)} │
└${border}┘`
    }

    public processThought(input: unknown): {
        content: Array<{ type: string; text: string }>
        isError?: boolean
    } {
        try {
            const validatedInput = this.validateThoughtData(input)

            if (validatedInput.thoughtNumber > validatedInput.totalThoughts) {
                validatedInput.totalThoughts = validatedInput.thoughtNumber
            }

            this.thoughtHistory.push(validatedInput)

            if (validatedInput.branchFromThought && validatedInput.branchId) {
                if (!this.branches[validatedInput.branchId]) {
                    this.branches[validatedInput.branchId] = []
                }
                this.branches[validatedInput.branchId].push(validatedInput)
            }

            const formattedThought = this.formatThought(validatedInput)
            console.error(formattedThought)

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(
                            {
                                thoughtNumber: validatedInput.thoughtNumber,
                                totalThoughts: validatedInput.totalThoughts,
                                nextThoughtNeeded: validatedInput.nextThoughtNeeded,
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

class BrainstormingServer {
    private sessions: Map<string, BrainstormingData> = new Map()

    private validateBrainstormingData(input: unknown): Partial<BrainstormingData> {
        const data = input as Record<string, unknown>

        // Проверка обязательных полей при создании новой сессии
        if (data.topic !== undefined && typeof data.topic !== "string") {
            throw new Error("Invalid topic: must be a string")
        }

        if (data.phase !== undefined) {
            const phase = data.phase as string
            if (!Object.values(BrainstormingPhase).includes(phase as BrainstormingPhase)) {
                throw new Error(
                    `Invalid phase: must be one of ${Object.values(BrainstormingPhase).join(", ")}`
                )
            }
        }

        if (data.ideas !== undefined && !Array.isArray(data.ideas)) {
            throw new Error("Invalid ideas: must be an array")
        }

        if (
            data.constraints !== undefined &&
            (!Array.isArray(data.constraints) ||
                !data.constraints.every((c) => typeof c === "string"))
        ) {
            throw new Error("Invalid constraints: must be an array of strings")
        }

        if (
            data.participants !== undefined &&
            (!Array.isArray(data.participants) ||
                !data.participants.every((p) => typeof p === "string"))
        ) {
            throw new Error("Invalid participants: must be an array of strings")
        }

        if (
            data.timeLimit !== undefined &&
            (typeof data.timeLimit !== "number" || data.timeLimit <= 0)
        ) {
            throw new Error("Invalid timeLimit: must be a positive number")
        }

        if (
            data.recommendedModels !== undefined &&
            (!Array.isArray(data.recommendedModels) ||
                !data.recommendedModels.every((m) => typeof m === "string"))
        ) {
            throw new Error("Invalid recommendedModels: must be an array of strings")
        }

        if (
            data.currentStep !== undefined &&
            (typeof data.currentStep !== "number" || data.currentStep < 0)
        ) {
            throw new Error("Invalid currentStep: must be a non-negative number")
        }

        if (
            data.totalSteps !== undefined &&
            (typeof data.totalSteps !== "number" || data.totalSteps <= 0)
        ) {
            throw new Error("Invalid totalSteps: must be a positive number")
        }

        // Проверка идей, если они предоставлены
        if (Array.isArray(data.ideas)) {
            data.ideas.forEach((idea, index) => {
                if (typeof idea !== "object" || idea === null) {
                    throw new Error(`Invalid idea at index ${index}: must be an object`)
                }

                const ideaObj = idea as Record<string, unknown>

                if (!ideaObj.id || typeof ideaObj.id !== "string") {
                    throw new Error(`Invalid idea.id at index ${index}: must be a string`)
                }

                if (!ideaObj.content || typeof ideaObj.content !== "string") {
                    throw new Error(`Invalid idea.content at index ${index}: must be a string`)
                }

                if (ideaObj.category !== undefined && typeof ideaObj.category !== "string") {
                    throw new Error(`Invalid idea.category at index ${index}: must be a string`)
                }

                if (
                    ideaObj.votes !== undefined &&
                    (typeof ideaObj.votes !== "number" || ideaObj.votes < 0)
                ) {
                    throw new Error(
                        `Invalid idea.votes at index ${index}: must be a non-negative number`
                    )
                }

                if (
                    ideaObj.buildUpon !== undefined &&
                    (!Array.isArray(ideaObj.buildUpon) ||
                        !ideaObj.buildUpon.every((b) => typeof b === "string"))
                ) {
                    throw new Error(
                        `Invalid idea.buildUpon at index ${index}: must be an array of strings`
                    )
                }

                if (
                    ideaObj.createdAt !== undefined &&
                    (typeof ideaObj.createdAt !== "number" || ideaObj.createdAt <= 0)
                ) {
                    throw new Error(
                        `Invalid idea.createdAt at index ${index}: must be a positive number`
                    )
                }
            })
        }

        return data as Partial<BrainstormingData>
    }

    private generateSessionId(): string {
        return (
            Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15)
        )
    }

    private getRecommendedModels(topic: string): string[] {
        // Рекомендуем модели, которые хорошо подходят для брейнсторминга
        const defaultModels = [
            "divergent_thinking",
            "lateral_thinking",
            "scenario_planning",
            "simulation",
            "catalysis",
        ]

        // В будущем можно добавить более умную логику выбора моделей на основе темы
        return defaultModels
    }

    private formatBrainstormingOutput(data: BrainstormingData): string {
        const border = "─".repeat(Math.max(data.topic.length + 20, 60))
        const phaseDisplay =
            data.phase.charAt(0).toUpperCase() + data.phase.slice(1).replace("_", " ")

        let output = `
┌${border}┐
│ 🧠 Brainstorming Session: ${data.topic.padEnd(border.length - 26)} │
├${border}┤
│ Phase: ${phaseDisplay.padEnd(border.length - 8)} │
├${border}┤
`

        if (data.constraints && data.constraints.length > 0) {
            output += `│ Constraints:${" ".repeat(border.length - 13)} │\n`
            data.constraints.forEach((constraint) => {
                output += `│ • ${constraint.padEnd(border.length - 4)} │\n`
            })
            output += `├${border}┤\n`
        }

        if (data.participants && data.participants.length > 0) {
            output += `│ Participants:${" ".repeat(border.length - 14)} │\n`
            data.participants.forEach((participant) => {
                output += `│ • ${participant.padEnd(border.length - 4)} │\n`
            })
            output += `├${border}┤\n`
        }

        if (data.recommendedModels && data.recommendedModels.length > 0) {
            output += `│ Recommended Models:${" ".repeat(border.length - 20)} │\n`
            data.recommendedModels.forEach((model) => {
                const modelObj = getMentalModelById(model)
                if (modelObj) {
                    output += `│ • ${modelObj.name}: ${modelObj.definition
                        .substring(0, border.length - modelObj.name.length - 6)
                        .padEnd(border.length - modelObj.name.length - 6)} │\n`
                } else {
                    output += `│ • ${model.padEnd(border.length - 4)} │\n`
                }
            })
            output += `├${border}┤\n`
        }

        if (data.ideas && data.ideas.length > 0) {
            output += `│ Ideas (${data.ideas.length}):${" ".repeat(
                border.length - 11 - String(data.ideas.length).length
            )} │\n`

            // Группируем идеи по категориям, если они есть
            const categorizedIdeas: Record<string, BrainstormingIdea[]> = {}
            data.ideas.forEach((idea) => {
                const category = idea.category || "Uncategorized"
                if (!categorizedIdeas[category]) {
                    categorizedIdeas[category] = []
                }
                categorizedIdeas[category].push(idea)
            })

            // Выводим идеи по категориям
            Object.entries(categorizedIdeas).forEach(([category, ideas]) => {
                output += `│ ${category}:${" ".repeat(border.length - category.length - 3)} │\n`
                ideas.forEach((idea) => {
                    const voteDisplay = idea.votes !== undefined ? ` [${idea.votes} votes]` : ""
                    output += `│   - ${idea.content}${voteDisplay}${" ".repeat(
                        Math.max(0, border.length - idea.content.length - voteDisplay.length - 5)
                    )} │\n`
                })
            })

            output += `├${border}┤\n`
        }

        // Добавляем подсказки в зависимости от текущей фазы
        output += `│ Next Steps:${" ".repeat(border.length - 12)} │\n`
        switch (data.phase) {
            case BrainstormingPhase.PREPARATION:
                output += `│ • Define constraints and participants${" ".repeat(
                    border.length - 36
                )} │\n`
                output += `│ • Move to ideation phase when ready${" ".repeat(
                    border.length - 35
                )} │\n`
                break
            case BrainstormingPhase.IDEATION:
                output += `│ • Generate as many ideas as possible${" ".repeat(
                    border.length - 37
                )} │\n`
                output += `│ • Don't evaluate ideas yet${" ".repeat(border.length - 27)} │\n`
                output += `│ • Build upon others' ideas${" ".repeat(border.length - 28)} │\n`
                break
            case BrainstormingPhase.CLARIFICATION:
                output += `│ • Clarify and refine ideas${" ".repeat(border.length - 29)} │\n`
                output += `│ • Combine similar ideas${" ".repeat(border.length - 25)} │\n`
                output += `│ • Categorize ideas${" ".repeat(border.length - 21)} │\n`
                break
            case BrainstormingPhase.EVALUATION:
                output += `│ • Evaluate each idea objectively${" ".repeat(border.length - 34)} │\n`
                output += `│ • Consider feasibility and impact${" ".repeat(border.length - 34)} │\n`
                output += `│ • Vote on promising ideas${" ".repeat(border.length - 28)} │\n`
                break
            case BrainstormingPhase.SELECTION:
                output += `│ • Select the best ideas to pursue${" ".repeat(border.length - 35)} │\n`
                output += `│ • Consider combining complementary ideas${" ".repeat(
                    border.length - 40
                )} │\n`
                break
            case BrainstormingPhase.ACTION_PLANNING:
                output += `│ • Define next steps for selected ideas${" ".repeat(
                    border.length - 39
                )} │\n`
                output += `│ • Assign responsibilities${" ".repeat(border.length - 27)} │\n`
                output += `│ • Set timelines${" ".repeat(border.length - 17)} │\n`
                break
        }

        output += `└${border}┘`

        return output
    }

    public processBrainstorming(input: unknown): {
        content: Array<{ type: string; text: string }>
        isError?: boolean
    } {
        try {
            const data = this.validateBrainstormingData(input)

            // Получаем или создаем сессию
            let sessionId = (data as any).sessionId
            let session: BrainstormingData

            if (sessionId && this.sessions.has(sessionId)) {
                // Обновляем существующую сессию
                session = this.sessions.get(sessionId)!

                // Обновляем поля, если они предоставлены
                if (data.phase !== undefined) {
                    session.phase = data.phase as BrainstormingPhase
                }

                if (data.ideas !== undefined) {
                    session.ideas = data.ideas as BrainstormingIdea[]
                } else if (data.phase === BrainstormingPhase.IDEATION && (data as any).newIdea) {
                    // Добавляем новую идею, если она предоставлена
                    const newIdea: BrainstormingIdea = {
                        id: Math.random().toString(36).substring(2, 15),
                        content: (data as any).newIdea,
                        createdAt: Date.now(),
                    }

                    if ((data as any).category) {
                        newIdea.category = (data as any).category
                    }

                    if ((data as any).buildUpon) {
                        newIdea.buildUpon = [(data as any).buildUpon]
                    }

                    session.ideas.push(newIdea)
                }

                if (data.constraints !== undefined) {
                    session.constraints = data.constraints as string[]
                }

                if (data.participants !== undefined) {
                    session.participants = data.participants as string[]
                }

                if (data.timeLimit !== undefined) {
                    session.timeLimit = data.timeLimit as number
                }

                if (data.recommendedModels !== undefined) {
                    session.recommendedModels = data.recommendedModels as string[]
                }

                if (data.currentStep !== undefined) {
                    session.currentStep = data.currentStep as number
                }

                if (data.totalSteps !== undefined) {
                    session.totalSteps = data.totalSteps as number
                }

                // Обработка голосования, если это фаза оценки
                if (data.phase === BrainstormingPhase.EVALUATION && (data as any).voteForIdea) {
                    const ideaId = (data as any).voteForIdea
                    const idea = session.ideas.find((i) => i.id === ideaId)
                    if (idea) {
                        idea.votes = (idea.votes || 0) + 1
                    }
                }

                // Обработка категоризации идей
                if (
                    data.phase === BrainstormingPhase.CLARIFICATION &&
                    (data as any).categorizeIdea
                ) {
                    const { ideaId, category } = (data as any).categorizeIdea
                    const idea = session.ideas.find((i) => i.id === ideaId)
                    if (idea) {
                        idea.category = category
                    }
                }
            } else {
                // Создаем новую сессию
                if (!data.topic) {
                    throw new Error("Topic is required to create a new brainstorming session")
                }

                sessionId = this.generateSessionId()
                session = {
                    topic: data.topic as string,
                    phase: (data.phase as BrainstormingPhase) || BrainstormingPhase.PREPARATION,
                    ideas: (data.ideas as BrainstormingIdea[]) || [],
                    constraints: (data.constraints as string[]) || [],
                    participants: (data.participants as string[]) || [],
                    recommendedModels:
                        (data.recommendedModels as string[]) ||
                        this.getRecommendedModels(data.topic as string),
                    currentStep: (data.currentStep as number) || 1,
                    totalSteps: (data.totalSteps as number) || 6, // По умолчанию 6 шагов (по числу фаз)
                }

                this.sessions.set(sessionId, session)
            }

            const formattedOutput = this.formatBrainstormingOutput(session)
            console.error(formattedOutput)

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(
                            {
                                sessionId,
                                topic: session.topic,
                                phase: session.phase,
                                ideasCount: session.ideas.length,
                                status: "success",
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

// Model Selector Server for recommending appropriate mental models
class ModelSelectorServer {
    private modelDatabase: Map<string, MentalModel> = new Map();
    private categories: ModelCategory[] = [];

    constructor() {
        // Initialize model database
        const allModels = loadMentalModels().mental_models;
        allModels.forEach((model: MentalModel) => this.modelDatabase.set(model.id, model));

        // Initialize categories
        this.categories = modelCategories;
    }

    private validateInput(input: unknown): ModelSelectorData {
        const data = input as Record<string, unknown>;

        if (!data.problem || typeof data.problem !== "string") {
            throw new Error("Invalid problem: must be a string describing your problem");
        }

        const result: ModelSelectorData = {
            problem: data.problem
        };

        // Validate optional fields
        if (data.domain !== undefined) {
            if (typeof data.domain !== "string") {
                throw new Error("Invalid domain: must be a string");
            }
            result.domain = data.domain;
        }

        if (data.goal !== undefined) {
            if (typeof data.goal !== "string") {
                throw new Error("Invalid goal: must be a string");
            }
            result.goal = data.goal;
        }

        if (data.complexity !== undefined) {
            if (typeof data.complexity !== "string" ||
                !["low", "medium", "high"].includes(data.complexity as string)) {
                throw new Error("Invalid complexity: must be 'low', 'medium', or 'high'");
            }
            result.complexity = data.complexity as "low" | "medium" | "high";
        }

        if (data.constraints !== undefined) {
            if (!Array.isArray(data.constraints) ||
                !data.constraints.every(c => typeof c === "string")) {
                throw new Error("Invalid constraints: must be an array of strings");
            }
            result.constraints = data.constraints as string[];
        }

        if (data.previousApproaches !== undefined) {
            if (!Array.isArray(data.previousApproaches) ||
                !data.previousApproaches.every(a => typeof a === "string")) {
                throw new Error("Invalid previousApproaches: must be an array of strings");
            }
            result.previousApproaches = data.previousApproaches as string[];
        }

        return result;
    }

    private recommendModels(data: ModelSelectorData): Array<{
        modelId: string;
        name: string;
        score: number;
        reason: string;
        howToApply: string;
    }> {
        const recommendations: Array<{
            modelId: string;
            name: string;
            score: number;
            reason: string;
            howToApply: string;
        }> = [];

        // Get all models
        const allModels = Array.from(this.modelDatabase.values());

        // Score each model based on problem description and other factors
        for (const model of allModels) {
            let score = this.calculateModelScore(model, data);

            // Skip models with very low scores
            if (score < 0.5) continue;

            // Generate reason and application advice
            const reason = this.generateReason(model, data);
            const howToApply = this.generateHowToApply(model, data);

            recommendations.push({
                modelId: model.id,
                name: model.name,
                score,
                reason,
                howToApply
            });
        }

        // Sort by score (descending)
        recommendations.sort((a, b) => b.score - a.score);

        // Return top 3 recommendations
        return recommendations.slice(0, 3);
    }

    private calculateModelScore(model: MentalModel, data: ModelSelectorData): number {
        let score = 0;

        // Base score from keyword matching in problem description
        score += this.calculateKeywordMatchScore(model, data.problem);

        // Adjust score based on when_to_use matches
        score += this.calculateWhenToUseScore(model, data);

        // Adjust score based on domain if specified
        if (data.domain) {
            score += this.calculateDomainScore(model, data.domain);
        }

        // Adjust score based on goal if specified
        if (data.goal) {
            score += this.calculateGoalScore(model, data.goal);
        }

        // Normalize score to 0-1 range
        return Math.min(Math.max(score, 0), 1);
    }

    private calculateKeywordMatchScore(model: MentalModel, problem: string): number {
        let score = 0;
        const problemLower = problem.toLowerCase();

        // Check for model name in problem
        if (problemLower.includes(model.name.toLowerCase())) {
            score += 0.2;
        }

        // Check for model keywords in problem
        const keywords = this.getModelKeywords(model);
        for (const keyword of keywords) {
            if (problemLower.includes(keyword.toLowerCase())) {
                score += 0.1;
            }
        }

        return score;
    }

    private getModelKeywords(model: MentalModel): string[] {
        // Extract keywords from model definition and when_to_use
        const keywords: string[] = [];

        // Add words from definition
        keywords.push(...model.definition.split(/\s+/).filter(w => w.length > 5));

        // Add phrases from when_to_use
        keywords.push(...model.when_to_use);

        return keywords;
    }

    private calculateWhenToUseScore(model: MentalModel, data: ModelSelectorData): number {
        let score = 0;
        const problemLower = data.problem.toLowerCase();

        // Check each when_to_use scenario
        for (const scenario of model.when_to_use) {
            const scenarioLower = scenario.toLowerCase();

            // Check for semantic similarity between problem and scenario
            // This is a simplified approach - in a real implementation, 
            // you might use more sophisticated NLP techniques
            const words = scenarioLower.split(/\s+/).filter(w => w.length > 4);
            for (const word of words) {
                if (problemLower.includes(word)) {
                    score += 0.05;
                }
            }
        }

        return Math.min(score, 0.5); // Cap at 0.5
    }

    private calculateDomainScore(model: MentalModel, domain: string): number {
        // Domain-specific scoring logic
        // This is a placeholder - in a real implementation, 
        // you would have a more sophisticated mapping of models to domains
        const domainModelMap: Record<string, string[]> = {
            "tech": ["first_principles", "systems_thinking", "rubber_duck", "error_propagation"],
            "business": ["pareto_principle", "opportunity_cost", "systems_thinking", "scenario_planning"],
            "science": ["scientific_method", "bayes_theorem", "first_principles", "thought_experiment"],
            "personal": ["sunk_cost", "loss_aversion", "confirmation_bias", "hanlons_razor"],
            "education": ["divergent_thinking", "lateral_thinking", "thought_experiment", "rubber_duck"]
        };

        if (domainModelMap[domain]?.includes(model.id)) {
            return 0.2;
        }

        return 0;
    }

    private calculateGoalScore(model: MentalModel, goal: string): number {
        // Goal-specific scoring logic
        const goalModelMap: Record<string, string[]> = {
            "analyze": ["systems_thinking", "first_principles", "scientific_method", "sensitivity_analysis"],
            "innovate": ["lateral_thinking", "divergent_thinking", "first_principles", "thought_experiment"],
            "optimize": ["pareto_principle", "opportunity_cost", "systems_thinking", "sensitivity_analysis"],
            "debug": ["rubber_duck", "error_propagation", "occams_razor", "scientific_method"],
            "decide": ["decision_tree", "bayes_theorem", "opportunity_cost", "scenario_planning"],
            "understand": ["systems_thinking", "proximate_ultimate_causation", "thought_experiment", "scientific_method"]
        };

        if (goalModelMap[goal]?.includes(model.id)) {
            return 0.3;
        }

        return 0;
    }

    private generateReason(model: MentalModel, data: ModelSelectorData): string {
        // Generate a personalized reason why this model is recommended
        let reason = "";

        // Base reason on model definition
        reason = `${model.definition} `;

        // Add context based on problem
        if (data.goal) {
            switch (data.goal) {
                case "analyze":
                    reason += `This model is particularly effective for analyzing problems like yours because it helps break down complexity into manageable components.`;
                    break;
                case "innovate":
                    reason += `This model can help you generate innovative solutions by providing a framework to think outside conventional boundaries.`;
                    break;
                case "optimize":
                    reason += `This model is well-suited for optimization challenges, helping you identify inefficiencies and improvement opportunities.`;
                    break;
                case "debug":
                    reason += `This model excels at debugging scenarios by providing a structured approach to identify root causes.`;
                    break;
                case "decide":
                    reason += `This model provides a framework for making better decisions by considering key factors systematically.`;
                    break;
                case "understand":
                    reason += `This model helps build deeper understanding by revealing underlying patterns and relationships.`;
                    break;
                default:
                    reason += `This model provides a structured approach that can help address your specific problem.`;
            }
        } else {
            reason += `This model provides a structured approach that can help address your specific problem.`;
        }

        return reason;
    }

    private generateHowToApply(model: MentalModel, data: ModelSelectorData): string {
        // Generate advice on how to apply this model to the specific problem
        let advice = "To apply this model to your problem:\n";

        // Add steps from the model
        for (let i = 0; i < model.steps.length; i++) {
            advice += `${i + 1}. ${model.steps[i]}\n`;
        }

        // Add problem-specific advice
        advice += `\nFor your specific problem about "${data.problem.substring(0, 50)}${data.problem.length > 50 ? '...' : ''}", `;
        advice += `focus on identifying the key elements and applying the model systematically.`;

        return advice;
    }

    private formatRecommendations(recommendations: Array<{
        modelId: string;
        name: string;
        score: number;
        reason: string;
        howToApply: string;
    }>, data: ModelSelectorData): string {
        const border = '─'.repeat(60);

        let output = `
┌${border}┐
│ 🧠 Model Recommendations for Your Problem ${' '.repeat(border.length - 40)} │
├${border}┤
│ Problem: ${data.problem.substring(0, border.length - 11)}${data.problem.length > border.length - 11 ? '...' : ' '.repeat(border.length - 11 - data.problem.length)} │`;

        if (data.goal) {
            output += `\n│ Goal: ${data.goal.padEnd(border.length - 8)} │`;
        }

        if (data.domain) {
            output += `\n│ Domain: ${data.domain.padEnd(border.length - 10)} │`;
        }

        output += `\n├${border}┤`;

        // Add recommendations
        for (let i = 0; i < recommendations.length; i++) {
            const rec = recommendations[i];
            output += `\n│ ${i + 1}. ${rec.name} (${Math.round(rec.score * 100)}% match)${' '.repeat(border.length - rec.name.length - 15)} │`;
            output += `\n│${' '.repeat(border.length)} │`;

            // Add reason with word wrapping
            const reasonWords = rec.reason.split(' ');
            let line = '│    Why: ';
            for (const word of reasonWords) {
                if (line.length + word.length + 1 > border.length - 1) {
                    output += `\n${line.padEnd(border.length)} │`;
                    line = '│         ';
                }
                line += word + ' ';
            }
            output += `\n${line.padEnd(border.length)} │`;

            output += `\n│${' '.repeat(border.length)} │`;

            // Add how to apply with word wrapping
            const howToApplyLines = rec.howToApply.split('\n');
            output += `\n│    How to apply:${' '.repeat(border.length - 17)} │`;
            for (const howToApplyLine of howToApplyLines) {
                const words = howToApplyLine.split(' ');
                line = '│      ';
                for (const word of words) {
                    if (line.length + word.length + 1 > border.length - 1) {
                        output += `\n${line.padEnd(border.length)} │`;
                        line = '│      ';
                    }
                    line += word + ' ';
                }
                output += `\n${line.padEnd(border.length)} │`;
            }

            if (i < recommendations.length - 1) {
                output += `\n├${border}┤`;
            }
        }

        output += `\n├${border}┤`;
        output += `\n│ Next Steps: Use the mentalmodel tool with your chosen model ${' '.repeat(border.length - 54)} │`;
        output += `\n│ Example: { "modelName": "${recommendations[0].modelId}", "problem": "..." } ${' '.repeat(border.length - recommendations[0].modelId.length - 36)} │`;
        output += `\n└${border}┘`;

        return output;
    }

    public processModelSelection(input: unknown): {
        content: Array<{ type: string; text: string }>;
        isError?: boolean;
    } {
        try {
            const data = this.validateInput(input);
            const recommendations = this.recommendModels(data);
            const formattedOutput = this.formatRecommendations(recommendations, data);

            console.error(formattedOutput);

            return {
                content: [{
                    type: "text",
                    text: JSON.stringify({
                        recommendations: recommendations.map(r => ({
                            modelId: r.modelId,
                            name: r.name,
                            score: r.score,
                            reason: r.reason,
                            howToApply: r.howToApply
                        })),
                        problem: data.problem,
                        goal: data.goal,
                        domain: data.domain,
                        status: "success"
                    }, null, 2)
                }]
            };
        } catch (error) {
            return {
                content: [{
                    type: "text",
                    text: JSON.stringify({
                        error: error instanceof Error ? error.message : String(error),
                        status: "failed"
                    }, null, 2)
                }],
                isError: true
            };
        }
    }
}

// Model categories definition
const modelCategories: ModelCategory[] = [
    {
        id: "analytical",
        name: "Analytical Models",
        description: "For breaking down complex problems into components",
        applicableGoals: ["analyze", "understand"],
        models: ["first_principles", "systems_thinking", "scientific_method"]
    },
    {
        id: "decision",
        name: "Decision-Making Models",
        description: "For choosing between alternatives",
        applicableGoals: ["decide", "evaluate", "prioritize"],
        models: ["decision_tree", "bayes_theorem", "opportunity_cost"]
    },
    {
        id: "creative",
        name: "Creative Thinking Models",
        description: "For generating innovative solutions",
        applicableGoals: ["innovate", "create"],
        models: ["lateral_thinking", "divergent_thinking", "thought_experiment"]
    },
    {
        id: "optimization",
        name: "Optimization Models",
        description: "For improving efficiency and effectiveness",
        applicableGoals: ["optimize", "improve"],
        models: ["pareto_principle", "sensitivity_analysis", "systems_thinking"]
    },
    {
        id: "debugging",
        name: "Debugging Models",
        description: "For finding and fixing problems",
        applicableGoals: ["debug", "fix", "troubleshoot"],
        models: ["rubber_duck", "error_propagation", "occams_razor"]
    },
    {
        id: "cognitive",
        name: "Cognitive Bias Models",
        description: "For overcoming mental pitfalls",
        applicableGoals: ["understand", "decide"],
        models: ["confirmation_bias", "sunk_cost", "loss_aversion", "survivorship_bias"]
    }
];

// Model Selector Tool - helps AI agents choose the right mental model
const MODEL_SELECTOR_TOOL: Tool = {
    name: "modelSelector",
    description: `A tool that intelligently recommends the optimal mental model for any problem.

🧠 WHAT IT DOES:
This AI-powered tool analyzes your problem and recommends the perfect mental models to solve it.
It matches problem characteristics with model strengths to find the ideal cognitive framework.

⚡️ WHY AI AGENTS LOVE IT:
- Eliminates guesswork in model selection
- Provides instant access to optimal problem-solving frameworks
- Delivers personalized recommendations with confidence scores
- Includes ready-to-use application instructions for each model
- Seamlessly integrates with the mentalmodel tool

🔍 HOW TO USE:
Simply describe your problem and optionally specify your goal and domain.
The tool will analyze your input and recommend the most effective mental models.

Example: { "problem": "Our codebase has become difficult to maintain", "goal": "optimize" }

🚀 PARAMETERS:
- problem: A description of the challenge you're facing (required)
- goal: Your objective (analyze, innovate, optimize, debug, decide, understand)
- domain: The field of application (tech, business, science, personal, education)
- complexity: Problem complexity level (low, medium, high)
- constraints: Any limitations to consider
- previousApproaches: Approaches already tried

After receiving recommendations, use the mentalmodel tool with your chosen model.`,
    inputSchema: {
        type: "object",
        properties: {
            problem: {
                type: "string",
                description: "A clear description of the problem you're trying to solve. Be specific about the challenge and context."
            },
            domain: {
                type: "string",
                enum: ["tech", "business", "science", "personal", "education", "other"],
                description: "The domain or field of your problem. Helps tailor recommendations to your specific context."
            },
            goal: {
                type: "string",
                enum: ["analyze", "innovate", "optimize", "debug", "decide", "understand"],
                description: "What you're trying to achieve. Different goals benefit from different mental models."
            },
            complexity: {
                type: "string",
                enum: ["low", "medium", "high"],
                description: "The complexity level of your problem. More complex problems may require more sophisticated models."
            },
            constraints: {
                type: "array",
                items: { type: "string" },
                description: "Any constraints or limitations you're working with. Helps filter out impractical approaches."
            },
            previousApproaches: {
                type: "array",
                items: { type: "string" },
                description: "Approaches you've already tried. Ensures fresh recommendations."
            }
        },
        required: ["problem"]
    }
};

// Server Instances
const modelServer = new MentalModelServer()
const debuggingServer = new DebuggingApproachServer()
const thinkingServer = new SequentialThinkingServer()
const brainstormingServer = new BrainstormingServer()
const modelSelectorServer = new ModelSelectorServer()

const server = new Server(
    {
        name: "sequential-thinking-server",
        version: "0.2.0",
    },
    {
        capabilities: {
            tools: {
                sequentialthinking: SEQUENTIAL_THINKING_TOOL,
                mentalmodel: MENTAL_MODEL_TOOL,
                debuggingapproach: DEBUGGING_APPROACH_TOOL,
                brainstorming: BRAINSTORMING_TOOL,
                modelSelector: MODEL_SELECTOR_TOOL,
            },
        },
    }
)

// Request Handlers
server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
        SEQUENTIAL_THINKING_TOOL,
        MENTAL_MODEL_TOOL,
        DEBUGGING_APPROACH_TOOL,
        BRAINSTORMING_TOOL,
        MODEL_SELECTOR_TOOL,
    ],
}))

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    switch (request.params.name) {
        case "sequentialthinking":
            return thinkingServer.processThought(request.params.arguments)
        case "mentalmodel":
            return modelServer.processModel(request.params.arguments)
        case "debuggingapproach":
            return debuggingServer.processApproach(request.params.arguments)
        case "brainstorming":
            return brainstormingServer.processBrainstorming(request.params.arguments)
        case "modelSelector":
            return modelSelectorServer.processModelSelection(request.params.arguments)
        default:
            throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${request.params.name}`)
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

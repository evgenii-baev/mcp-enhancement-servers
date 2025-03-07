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

// Tool Definitions
const MENTAL_MODEL_TOOL: Tool = {
    name: "mentalmodel",
    description: `A comprehensive tool for applying structured mental models to problem-solving.

WHAT IT DOES:
This tool applies systematic mental models to analyze problems from different perspectives,
helping to break down complex issues into manageable components and revealing insights
that might otherwise be missed.

WHEN TO USE:
- When facing complex or ambiguous problems
- When standard approaches aren't yielding results
- When you need a fresh perspective on a problem
- When you want to ensure thorough analysis of all aspects
- When you need to overcome cognitive biases
- When communicating complex reasoning to others

AVAILABLE MODELS:
${getAllMentalModelIds()
    .map((id) => {
        const model = getMentalModelById(id)
        return `- ${model?.name}: ${model?.definition}`
    })
    .join("\n")}

HOW TO USE:
1. Select the most appropriate mental model for your problem
2. Clearly define your problem statement
3. The tool will apply the model's framework to your problem
4. Review the structured analysis and insights
5. Apply the conclusions to your original problem

EXAMPLES:
• Input: { "modelName": "first_principles", "problem": "Our application is too slow" }
  Output: A breakdown of the performance issue into fundamental components, questioning
  assumptions about what causes slowness, and building a solution from basic truths.

• Input: { "modelName": "systems_thinking", "problem": "Users are abandoning our platform" }
  Output: Analysis of the platform as an interconnected system, identifying feedback loops,
  dependencies, and emergent behaviors that might be causing user attrition.

• Input: { "modelName": "occams_razor", "problem": "Our CI pipeline fails intermittently" }
  Output: Evaluation of possible explanations, prioritizing the simplest ones that adequately
  explain the observed behavior before considering more complex theories.

INTERPRETING RESULTS:
The response includes the model name, problem statement, structured analysis steps,
and conclusions. Use these insights to guide your approach to the original problem.

COMMON ERRORS:
- Selecting an inappropriate model for your problem type
- Providing a vague or overly broad problem statement
- Not following through with the model's recommended steps

RELATED TOOLS:
- Use sequentialthinking after applying a mental model to work through the solution step by step
- Use debuggingapproach for specific technical issues once you've identified the general approach
- Use brainstorming when you need to generate multiple creative solutions based on a mental model

Each model provides a systematic approach to breaking down and solving problems.`,
    inputSchema: {
        type: "object",
        properties: {
            modelName: {
                type: "string",
                enum: getAllMentalModelIds(),
            },
            problem: { type: "string" },
        },
        required: ["modelName", "problem"],
    },
}

const DEBUGGING_APPROACH_TOOL: Tool = {
    name: "debuggingapproach",
    description: `A powerful tool for applying systematic debugging approaches to solve technical issues.

WHAT IT DOES:
This tool provides structured methodologies for identifying, isolating, and resolving
technical problems by applying proven debugging strategies tailored to different types of issues.

WHEN TO USE:
- When facing complex technical problems
- When standard debugging isn't yielding results
- When you need a systematic approach to troubleshooting
- When you want to document your debugging process
- When teaching others about structured problem-solving

AVAILABLE APPROACHES:

1. Binary Search:
   A divide-and-conquer approach that systematically narrows down the problem space
   by testing the midpoint and eliminating half the remaining possibilities each time.
   Best for: Linear problems with clear test criteria (e.g., finding which commit introduced a bug).

2. Reverse Engineering:
   Working backward from observed behavior to understand underlying mechanisms.
   Best for: Understanding undocumented systems or unexpected behaviors.

3. Divide and Conquer:
   Breaking a complex problem into smaller, more manageable sub-problems.
   Best for: Large, complex systems with multiple potential failure points.

4. Backtracking:
   Exploring multiple solution paths and backing out when a path proves unsuccessful.
   Best for: Problems with multiple possible solutions where some paths may be dead ends.

5. Cause Elimination:
   Systematically identifying and ruling out potential causes until the actual cause is found.
   Best for: Issues with multiple potential causes that can be individually tested.

6. Program Slicing:
   Isolating the specific parts of code that could affect a particular variable or behavior.
   Best for: Understanding data flow and dependencies in complex codebases.

HOW TO USE:
1. Select the most appropriate debugging approach for your issue
2. Clearly define the problem you're experiencing
3. Follow the structured steps provided by the approach
4. Document your findings at each step
5. Apply the resolution based on your analysis

EXAMPLES:
• Input: { "approachName": "binary_search", "issue": "Performance regression in recent release" }
  Output: A structured approach to identify which change caused the regression by testing
  midpoints in your commit history until the problematic change is isolated.

• Input: { "approachName": "cause_elimination", "issue": "API requests fail intermittently" }
  Output: A systematic process to identify potential causes (network, server load, authentication,
  rate limiting) and methodically rule them out until the actual cause is found.

• Input: { "approachName": "program_slicing", "issue": "Unexpected value in user profile" }
  Output: Analysis focusing only on code paths that could affect the specific profile field,
  ignoring unrelated parts of the codebase to efficiently isolate the issue.

INTERPRETING RESULTS:
The response includes the approach name, issue description, structured steps to follow,
key findings from the process, and recommended resolution.

COMMON ERRORS:
- Selecting an inappropriate approach for your issue type
- Providing insufficient detail about the issue
- Not following through with all recommended steps
- Jumping to conclusions before completing the process

RELATED TOOLS:
- Use mentalmodel first to understand the general problem space before selecting a debugging approach
- Use sequentialthinking to document your debugging process step by step
- Use brainstorming to generate multiple potential solutions after identifying the root cause

Each approach provides a structured method for identifying and resolving issues.`,
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
                    "program_slicing",
                ],
            },
            issue: { type: "string" },
            steps: {
                type: "array",
                items: { type: "string" },
            },
            findings: { type: "string" },
            resolution: { type: "string" },
        },
        required: ["approachName", "issue"],
    },
}

const SEQUENTIAL_THINKING_TOOL: Tool = {
    name: "sequentialthinking",
    description: `A sophisticated tool for dynamic and reflective problem-solving through sequential thoughts.

WHAT IT DOES:
This tool facilitates a flexible thinking process that mimics human cognition by allowing
thoughts to build upon, question, or revise previous insights as understanding deepens.
It enables non-linear exploration of problem spaces with the ability to branch, revise,
and extend thinking paths as needed.

WHEN TO USE:
- Breaking down complex problems into manageable steps
- Planning and design processes that require flexibility for revision
- Analysis that might need course correction as new information emerges
- Problems where the full scope might not be clear initially
- Problems that require a multi-step solution with dependencies between steps
- Tasks that need to maintain context over multiple reasoning steps
- Situations where irrelevant information needs to be filtered out
- When you need to document your reasoning process for others

KEY FEATURES:
- Dynamic adjustment of thought quantity as understanding evolves
- Ability to question or revise previous thoughts when new insights emerge
- Flexible extension of thinking even after reaching what seemed like the end
- Expression of uncertainty and exploration of alternative approaches
- Non-linear thinking with branching and backtracking capabilities
- Hypothesis generation and verification through structured reasoning
- Progressive refinement of solutions through iterative thinking

HOW TO USE:
1. Start with an initial problem statement and estimate of needed thoughts
2. Develop each thought sequentially, building on previous insights
3. When appropriate, revise previous thoughts or branch into new directions
4. Continue until you reach a satisfactory conclusion
5. Provide a final thought that synthesizes your reasoning and solution

PARAMETERS EXPLAINED:
- thought: Your current thinking step, which can include:
  * Regular analytical steps
  * Revisions of previous thoughts
  * Questions about previous decisions
  * Realizations about needing more analysis
  * Changes in approach
  * Hypothesis generation
  * Hypothesis verification
- nextThoughtNeeded: True if you need more thinking, even if at what seemed like the end
- thoughtNumber: Current number in sequence (can go beyond initial total if needed)
- totalThoughts: Current estimate of thoughts needed (can be adjusted up/down)
- isRevision: A boolean indicating if this thought revises previous thinking
- revisesThought: If isRevision is true, which thought number is being reconsidered
- branchFromThought: If branching, which thought number is the branching point
- branchId: Identifier for the current branch (if any)
- needsMoreThoughts: If reaching end but realizing more thoughts needed

EXAMPLES:
• Input: { 
  "thought": "The application seems slow because of database queries", 
  "thoughtNumber": 1, 
  "totalThoughts": 5, 
  "nextThoughtNeeded": true 
}
  Output: A structured response acknowledging the thought and providing guidance for the next step.

• Input: { 
  "thought": "After profiling, I see that the slowdown is actually in the image processing", 
  "thoughtNumber": 2, 
  "totalThoughts": 5, 
  "isRevision": true, 
  "revisesThought": 1,
  "nextThoughtNeeded": true 
}
  Output: A response that acknowledges the revision of the previous thought and maintains the context.

• Input: { 
  "thought": "Let's explore an alternative approach using caching", 
  "thoughtNumber": 3, 
  "totalThoughts": 5, 
  "branchFromThought": 2,
  "branchId": "caching-solution",
  "nextThoughtNeeded": true 
}
  Output: A response that acknowledges the new branch of thinking and helps explore this direction.

INTERPRETING RESULTS:
The response will indicate whether another thought is needed and may suggest directions
for subsequent thinking steps. It maintains the context of your thought process.

COMMON ERRORS:
- Not providing sufficient detail in each thought
- Setting nextThoughtNeeded=false prematurely
- Not revising thoughts when new information contradicts earlier assumptions
- Failing to adjust totalThoughts when more steps are clearly needed
- Not properly marking revisions or branches when changing direction

RELATED TOOLS:
- Use mentalmodel first to select an appropriate mental framework for your problem
- Use debuggingapproach for specific technical issues that need structured troubleshooting
- Use brainstorming when you need to generate and evaluate multiple solution paths

BEST PRACTICES:
1. Start with an initial estimate of needed thoughts, but be ready to adjust
2. Feel free to question or revise previous thoughts when appropriate
3. Don't hesitate to add more thoughts if needed, even at the "end"
4. Express uncertainty when present rather than making unfounded assertions
5. Mark thoughts that revise previous thinking or branch into new paths
6. Ignore information that is irrelevant to the current step
7. Generate a solution hypothesis when appropriate
8. Verify the hypothesis based on the Chain of Thought steps
9. Repeat the process until satisfied with the solution
10. Provide a single, ideally correct answer as the final output
11. Only set nextThoughtNeeded to false when truly done and a satisfactory answer is reached`,
    inputSchema: {
        type: "object",
        properties: {
            thought: {
                type: "string",
                description: "Your current thinking step",
            },
            nextThoughtNeeded: {
                type: "boolean",
                description: "Whether another thought step is needed",
            },
            thoughtNumber: {
                type: "integer",
                description: "Current thought number",
                minimum: 1,
            },
            totalThoughts: {
                type: "integer",
                description: "Estimated total thoughts needed",
                minimum: 1,
            },
            isRevision: {
                type: "boolean",
                description: "Whether this revises previous thinking",
            },
            revisesThought: {
                type: "integer",
                description: "Which thought is being reconsidered",
                minimum: 1,
            },
            branchFromThought: {
                type: "integer",
                description: "Branching point thought number",
                minimum: 1,
            },
            branchId: {
                type: "string",
                description: "Branch identifier",
            },
            needsMoreThoughts: {
                type: "boolean",
                description: "If more thoughts are needed",
            },
        },
        required: ["thought", "nextThoughtNeeded", "thoughtNumber", "totalThoughts"],
    },
}

const BRAINSTORMING_TOOL: Tool = {
    name: "brainstorming",
    description: `A comprehensive tool for facilitating structured brainstorming sessions.

WHAT IT DOES:
This tool guides you through a systematic brainstorming process, from preparation to action planning.
It helps generate, refine, evaluate, and select ideas in a structured way, while leveraging
appropriate mental models to enhance creativity and effectiveness.

WHEN TO USE:
- When you need to generate creative solutions to complex problems
- When you want to explore multiple approaches to a challenge
- When you need to involve multiple perspectives in idea generation
- When you want to systematically evaluate and select the best ideas
- When you need to break out of conventional thinking patterns
- When planning new features, products, or strategies
- When trying to overcome obstacles or bottlenecks

KEY FEATURES:
- Structured six-phase brainstorming process
- Integration with mental models to enhance creativity
- Support for collaborative ideation
- Idea categorization and evaluation
- Persistent sessions for ongoing brainstorming
- Guidance tailored to each phase of the process

HOW TO USE:
1. Start by creating a new session with a clear topic
2. Follow the guided process through each phase:
   - Preparation: Define constraints and participants
   - Ideation: Generate as many ideas as possible
   - Clarification: Refine and categorize ideas
   - Evaluation: Assess ideas objectively
   - Selection: Choose the best ideas to pursue
   - Action Planning: Define next steps for implementation
3. Use recommended mental models to enhance your thinking
4. Add, categorize, and vote on ideas as you progress

PARAMETERS EXPLAINED:
- topic: The main subject or problem for brainstorming
- phase: Current phase of the brainstorming process
- ideas: Collection of generated ideas
- constraints: Limitations or requirements to consider
- participants: People involved in the brainstorming
- timeLimit: Optional time constraint for the session
- recommendedModels: Mental models that can help with this topic
- sessionId: Identifier for ongoing sessions

EXAMPLES:
• Input: { "topic": "Improving user onboarding experience" }
  Output: A structured brainstorming session with recommended mental models and guidance for the preparation phase.

• Input: { 
  "sessionId": "abc123", 
  "phase": "ideation", 
  "newIdea": "Interactive tutorial with gamification elements" 
}
  Output: The idea is added to the session and guidance for continuing ideation is provided.

• Input: { 
  "sessionId": "abc123", 
  "phase": "clarification", 
  "categorizeIdea": {
    "ideaId": "idea456", 
    "category": "Gamification"
  }
}
  Output: The idea is categorized and guidance for the clarification phase is updated.

• Input: { 
  "sessionId": "abc123", 
  "phase": "evaluation", 
  "voteForIdea": "idea456"
}
  Output: A vote is recorded for the idea and guidance for evaluation is provided.

INTERPRETING RESULTS:
The response includes the session ID, current phase, and number of ideas.
The console output provides a detailed view of the session, including all ideas,
recommended models, and guidance for the current phase.

COMMON ERRORS:
- Not providing a topic when creating a new session
- Submitting ideas during phases other than ideation
- Voting on ideas before reaching the evaluation phase
- Skipping phases in the brainstorming process
- Not following the recommended mental models

RELATED TOOLS:
- Use mentalmodel before brainstorming to select appropriate mental frameworks for your topic
- Use sequentialthinking after brainstorming to develop selected ideas in detail
- Use debuggingapproach to systematically address challenges identified during brainstorming

BEST PRACTICES:
1. Define a clear, focused topic for your brainstorming session
2. Follow the structured process through all phases
3. Defer judgment during the ideation phase
4. Use the recommended mental models to stimulate creative thinking
5. Categorize similar ideas during the clarification phase
6. Evaluate ideas objectively based on feasibility and impact
7. Create concrete action plans for selected ideas`,
    inputSchema: {
        type: "object",
        properties: {
            sessionId: {
                type: "string",
                description: "Identifier for an existing brainstorming session",
            },
            topic: {
                type: "string",
                description: "The main subject or problem for brainstorming",
            },
            phase: {
                type: "string",
                enum: Object.values(BrainstormingPhase),
                description: "Current phase of the brainstorming process",
            },
            ideas: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        content: { type: "string" },
                        category: { type: "string" },
                        votes: { type: "number" },
                        buildUpon: {
                            type: "array",
                            items: { type: "string" },
                        },
                        createdAt: { type: "number" },
                    },
                    required: ["id", "content", "createdAt"],
                },
                description: "Collection of generated ideas",
            },
            newIdea: {
                type: "string",
                description: "A new idea to add to the session (only in ideation phase)",
            },
            category: {
                type: "string",
                description: "Category for a new idea",
            },
            buildUpon: {
                type: "string",
                description: "ID of an idea this new idea builds upon",
            },
            voteForIdea: {
                type: "string",
                description: "ID of an idea to vote for (only in evaluation phase)",
            },
            categorizeIdea: {
                type: "object",
                properties: {
                    ideaId: { type: "string" },
                    category: { type: "string" },
                },
                required: ["ideaId", "category"],
                description: "Categorize an existing idea (only in clarification phase)",
            },
            constraints: {
                type: "array",
                items: { type: "string" },
                description: "Limitations or requirements to consider",
            },
            participants: {
                type: "array",
                items: { type: "string" },
                description: "People involved in the brainstorming",
            },
            timeLimit: {
                type: "number",
                description: "Time constraint for the session in minutes",
            },
            recommendedModels: {
                type: "array",
                items: { type: "string" },
                description: "Mental models that can help with this topic",
            },
            currentStep: {
                type: "number",
                description: "Current step in the process",
            },
            totalSteps: {
                type: "number",
                description: "Total number of steps in the process",
            },
        },
    },
}

// Server Instances
const modelServer = new MentalModelServer()
const debuggingServer = new DebuggingApproachServer()
const thinkingServer = new SequentialThinkingServer()
const brainstormingServer = new BrainstormingServer()

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

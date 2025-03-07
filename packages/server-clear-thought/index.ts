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
    description: `A tool for applying structured mental models to problem-solving.

This tool helps analyze problems from different perspectives using systematic mental models.
Use it for complex problems, when standard approaches fail, or when you need a fresh perspective.

AVAILABLE MODELS:

• first_principles: Breaking down problems to fundamental truths and reasoning up from there.
  Use for: Innovation, challenging assumptions, rethinking complex systems.

• systems_thinking: Analyzing how parts of a system interrelate and affect each other.
  Use for: Complex systems, understanding feedback loops, organizational problems.

• occams_razor: The simplest explanation is usually the correct one, all else being equal.
  Use for: Troubleshooting, hypothesis evaluation, debugging complex issues.

• pareto_principle: The 80/20 rule - 80% of effects come from 20% of causes.
  Use for: Prioritization, resource allocation, optimization efforts.

• lateral_thinking: Solving problems using indirect, creative approaches.
  Use for: Breaking out of conventional thinking, innovation, creative solutions.

• divergent_thinking: Generating multiple creative ideas in a free-flowing manner.
  Use for: Brainstorming, exploring possibilities, creative problem-solving.

• decision_tree: Mapping out possible decisions and their consequences.
  Use for: Complex decisions with multiple variables, risk assessment.

• scientific_method: Systematic observation, measurement, experimentation, and hypothesis testing.
  Use for: Empirical problem-solving, testing assumptions, validation.

• scenario_planning: Developing plausible views of different possible futures.
  Use for: Strategic planning, risk management, preparing for uncertainty.

• rubber_duck: Explaining a problem step by step to gain clarity.
  Use for: Debugging, clarifying thinking, finding overlooked solutions.

• bayes_theorem: Updating probability estimates as new evidence emerges.
  Use for: Decision-making under uncertainty, risk assessment, predictive analysis.

• opportunity_cost: Evaluating what must be given up to pursue a particular action.
  Use for: Resource allocation, prioritization, strategic planning.

• error_propagation: Analyzing how errors cascade through a system.
  Use for: Quality control, system reliability, fault tolerance design.

• sensitivity_analysis: Determining how different variables affect outcomes.
  Use for: Model validation, risk assessment, identifying critical factors.

• sunk_cost: Avoiding decisions based on costs that cannot be recovered.
  Use for: Project evaluation, resource reallocation, avoiding escalation of commitment.

• thought_experiment: Exploring hypothetical scenarios through reasoning.
  Use for: Ethical dilemmas, exploring edge cases, conceptual innovation.

Usage: Select a model, define your problem, and the tool will apply the model's framework.
Example: { "modelName": "first_principles", "problem": "Our app is slow" }`,
    inputSchema: {
        type: "object",
        properties: {
            modelName: {
                type: "string",
                enum: getAllMentalModelIds(),
                description: "The specific mental model to apply. Choose the model that best fits your problem type and thinking approach. Each model provides a different analytical framework."
            },
            problem: {
                type: "string",
                description: "A clear, concise statement of the problem you want to analyze. Be specific enough to allow meaningful analysis but broad enough to capture the core issue."
            },
        },
        required: ["modelName", "problem"],
    },
}

const DEBUGGING_APPROACH_TOOL: Tool = {
    name: "debuggingapproach",
    description: `A tool for applying systematic debugging approaches to technical issues.

This tool provides structured methodologies for identifying and resolving technical problems.
Use it for complex issues, when standard debugging fails, or when you need a systematic approach.

Available approaches:
- Binary Search: Narrow down problems by testing midpoints (e.g., find which commit broke the build)
- Reverse Engineering: Work backward from observed behavior
- Divide and Conquer: Break complex problems into manageable sub-problems
- Backtracking: Explore multiple solution paths
- Cause Elimination: Rule out potential causes systematically
- Program Slicing: Focus on code affecting specific variables

Usage: Select an approach, define your issue, and follow the structured steps.
Example: { "approachName": "binary_search", "issue": "Performance regression" }

See documentation for detailed usage instructions.`,
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
                description: "The debugging approach to apply. Select based on your problem type: binary_search for finding a specific change, reverse_engineering for understanding unknown systems, divide_conquer for complex problems, backtracking for exploring multiple solutions, cause_elimination for multiple potential causes, program_slicing for data flow issues."
            },
            issue: {
                type: "string",
                description: "A detailed description of the technical issue you're facing. Include relevant context, error messages, and observed behavior to enable effective debugging."
            },
            steps: {
                type: "array",
                items: { type: "string" },
                description: "Optional list of steps you've already taken or plan to take in your debugging process. Each step should be a clear, actionable item."
            },
            findings: {
                type: "string",
                description: "Optional information discovered during your debugging process. Include any patterns, anomalies, or insights that might help identify the root cause."
            },
            resolution: {
                type: "string",
                description: "Optional solution or fix for the issue. Describe how you resolved or plan to resolve the problem based on your debugging findings."
            },
        },
        required: ["approachName", "issue"],
    },
}

const SEQUENTIAL_THINKING_TOOL: Tool = {
    name: "sequentialthinking",
    description: `A tool for dynamic and reflective problem-solving through sequential thoughts.

This tool facilitates a flexible thinking process that mimics human cognition, allowing thoughts
to build upon, question, or revise previous insights as understanding deepens.

Key features:
- Dynamic adjustment of thought quantity as understanding evolves
- Ability to revise previous thoughts when new insights emerge
- Non-linear thinking with branching capabilities
- Progressive refinement of solutions through iterative thinking

Usage: Start with a problem statement, develop thoughts sequentially, revise when needed.
Example: { "thought": "App is slow due to database queries", "thoughtNumber": 1, "totalThoughts": 5, "nextThoughtNeeded": true }

Parameters include thought content, thought number, total thoughts estimate, revision flags, and branching options.
Set nextThoughtNeeded=false only when you've reached a satisfactory conclusion.`,
    inputSchema: {
        type: "object",
        properties: {
            thought: {
                type: "string",
                description: "Your current thinking step in detail. This can be an analysis, observation, hypothesis, revision of previous thinking, or a conclusion. Be specific and thorough to enable meaningful progression."
            },
            nextThoughtNeeded: {
                type: "boolean",
                description: "Whether another thought step is needed after this one. Set to false only when you've reached a satisfactory conclusion that fully addresses the original problem."
            },
            thoughtNumber: {
                type: "integer",
                description: "The sequential number of this thought in your thinking process. Starts at 1 and increments with each new thought, including revisions and branches.",
                minimum: 1,
            },
            totalThoughts: {
                type: "integer",
                description: "Your current estimate of how many thoughts will be needed to solve the problem. This can be adjusted up or down as your understanding evolves.",
                minimum: 1,
            },
            isRevision: {
                type: "boolean",
                description: "Whether this thought revises or corrects a previous thought. Set to true when you need to update earlier thinking based on new insights or information."
            },
            revisesThought: {
                type: "integer",
                description: "If this is a revision (isRevision=true), specify which thought number is being revised or corrected. This creates a clear link between the original thought and its revision.",
                minimum: 1,
            },
            branchFromThought: {
                type: "integer",
                description: "If this thought starts a new branch of thinking, specify which thought number it branches from. Use when exploring alternative approaches or perspectives.",
                minimum: 1,
            },
            branchId: {
                type: "string",
                description: "A unique identifier for this branch of thinking. Use a descriptive name that indicates the nature or purpose of this thinking branch."
            },
            needsMoreThoughts: {
                type: "boolean",
                description: "Indicates that more thoughts are needed even if you initially thought you were done. Set to true when you realize additional analysis is required."
            },
        },
        required: ["thought", "nextThoughtNeeded", "thoughtNumber", "totalThoughts"],
    },
}

const BRAINSTORMING_TOOL: Tool = {
    name: "brainstorming",
    description: `A tool for facilitating structured brainstorming sessions.

This tool guides you through a systematic brainstorming process, from preparation to action planning,
helping generate, refine, evaluate, and select ideas in a structured way.

Key features:
- Six-phase process: preparation, ideation, clarification, evaluation, selection, action planning
- Support for collaborative ideation with multiple participants
- Idea categorization and voting mechanisms
- Persistent sessions for ongoing brainstorming

Usage: Start by creating a session with a topic, then progress through phases.
Example: { "topic": "Improving user onboarding experience" }

Parameters include session ID, topic, phase, ideas collection, constraints, participants, and more.
Sessions persist across interactions using the sessionId parameter.`,
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
                enum: Object.values(BrainstormingPhase),
                description: "Current phase of the brainstorming process. Progress through phases in sequence: preparation → ideation → clarification → evaluation → selection → action_planning."
            },
            ideas: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            description: "Unique identifier for the idea. Used for referencing in voting, categorization, and building upon ideas."
                        },
                        content: {
                            type: "string",
                            description: "The actual content of the idea. Be clear and specific, focusing on one concept per idea."
                        },
                        category: {
                            type: "string",
                            description: "Optional grouping or theme for the idea. Used during clarification phase to organize related ideas."
                        },
                        votes: {
                            type: "number",
                            description: "Number of votes this idea has received during the evaluation phase. Higher votes indicate greater team interest."
                        },
                        buildUpon: {
                            type: "array",
                            items: { type: "string" },
                            description: "IDs of ideas that this idea builds upon or extends. Creates connections between related concepts."
                        },
                        createdAt: {
                            type: "number",
                            description: "Timestamp when the idea was created. Used for chronological ordering of ideas."
                        },
                    },
                    required: ["id", "content", "createdAt"],
                },
                description: "Collection of generated ideas for the brainstorming session. Grows during the ideation phase and gets refined in later phases."
            },
            newIdea: {
                type: "string",
                description: "A new idea to add to the session (only used in ideation phase). Focus on one clear concept per idea for better organization later."
            },
            category: {
                type: "string",
                description: "Category for a new idea being added. Helps with organizing ideas into themes or groups during clarification."
            },
            buildUpon: {
                type: "string",
                description: "ID of an existing idea that this new idea builds upon. Creates connections between related ideas and shows evolution of thinking."
            },
            voteForIdea: {
                type: "string",
                description: "ID of an idea to vote for (only used in evaluation phase). Voting helps identify the most promising ideas for further development."
            },
            categorizeIdea: {
                type: "object",
                properties: {
                    ideaId: {
                        type: "string",
                        description: "ID of the idea to categorize. Must reference an existing idea in the session."
                    },
                    category: {
                        type: "string",
                        description: "Category name to assign to the idea. Use consistent naming for better organization."
                    },
                },
                required: ["ideaId", "category"],
                description: "Categorize an existing idea (only used in clarification phase). Helps organize ideas into logical groups for evaluation."
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
            timeLimit: {
                type: "number",
                description: "Time constraint for the session in minutes. Setting a time limit helps maintain focus and creates productive pressure."
            },
            recommendedModels: {
                type: "array",
                items: { type: "string" },
                description: "Mental models that can help with this topic. These models provide frameworks for thinking about the problem in different ways."
            },
            currentStep: {
                type: "number",
                description: "Current step in the brainstorming process. Helps track progress within each phase of the session."
            },
            totalSteps: {
                type: "number",
                description: "Total number of steps in the brainstorming process. Provides context for how far along the session has progressed."
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

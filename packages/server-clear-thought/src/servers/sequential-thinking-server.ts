import chalk from "chalk";
import { ThoughtData } from "../interfaces/thought-data.js";

/**
 * Server for processing sequential thinking requests
 */
export class SequentialThinkingServer {
    private thoughtHistory: ThoughtData[] = []
    private branches: Record<string, ThoughtData[]> = {}

    /**
     * Validates the input data for a sequential thinking request
     * @param input The input data to validate
     * @returns The validated thought data
     * @throws Error if the input is invalid
     */
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

        // Дополнительная валидация для опциональных параметров
        if (data.isRevision !== undefined && typeof data.isRevision !== "boolean") {
            throw new Error("Invalid isRevision: must be a boolean if provided")
        }
        if (data.revisesThought !== undefined && typeof data.revisesThought !== "number") {
            throw new Error("Invalid revisesThought: must be a number if provided")
        }
        if (data.branchFromThought !== undefined && typeof data.branchFromThought !== "number") {
            throw new Error("Invalid branchFromThought: must be a number if provided")
        }
        if (data.branchId !== undefined && typeof data.branchId !== "string") {
            throw new Error("Invalid branchId: must be a string if provided")
        }
        if (data.needsMoreThoughts !== undefined && typeof data.needsMoreThoughts !== "boolean") {
            throw new Error("Invalid needsMoreThoughts: must be a boolean if provided")
        }

        // Логическая валидация
        if (data.isRevision && !data.revisesThought) {
            throw new Error("revisesThought is required when isRevision is true")
        }
        if (data.branchFromThought && !data.branchId) {
            throw new Error("branchId is required when branchFromThought is provided")
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

    /**
     * Форматирует мысль для вывода в консоль
     * @param thoughtData Данные мысли для форматирования
     * @returns Отформатированный текст мысли
     */
    private formatThought(thoughtData: ThoughtData): string {
        try {
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
        } catch (error) {
            console.error("Error formatting thought:", error)
            return `[Error formatting thought: ${thoughtData.thoughtNumber}]`
        }
    }

    /**
     * Обрабатывает запрос последовательного мышления
     * @param input Входные данные запроса
     * @returns Содержимое ответа
     */
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

            try {
                const formattedThought = this.formatThought(validatedInput)
                console.error(formattedThought)
            } catch (formatError) {
                console.error("Failed to format thought for console output:", formatError)
            }

            // Создаем структурированный и упрощенный ответ
            const responseObj = {
                thoughtNumber: validatedInput.thoughtNumber,
                totalThoughts: validatedInput.totalThoughts,
                nextThoughtNeeded: validatedInput.nextThoughtNeeded,
                branches: Object.keys(this.branches),
                thoughtHistoryLength: this.thoughtHistory.length,
                isRevision: validatedInput.isRevision || false,
                isBranch: !!validatedInput.branchFromThought,
                status: "success"
            }

            // Преобразуем в JSON с обработкой ошибок
            let responseText = ""
            try {
                responseText = JSON.stringify(responseObj, null, 2)
            } catch (jsonError) {
                console.error("Error stringifying response:", jsonError)
                // Запасной вариант, если произошла ошибка при JSON.stringify
                responseText = JSON.stringify({
                    thoughtNumber: validatedInput.thoughtNumber,
                    totalThoughts: validatedInput.totalThoughts,
                    nextThoughtNeeded: validatedInput.nextThoughtNeeded,
                    status: "success",
                    note: "Response simplified due to JSON serialization error"
                }, null, 2)
            }

            return {
                content: [
                    {
                        type: "text",
                        text: responseText
                    },
                ],
            }
        } catch (error) {
            console.error("Sequential thinking server error:", error)

            // Обработка ошибок с надежным созданием JSON
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
                        text: JSON.stringify(
                            {
                                error: errorMessage,
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
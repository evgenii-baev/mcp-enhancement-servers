import { DebuggingApproachData } from "../interfaces/debugging-approach-data.js";

/**
 * Server for processing debugging approach requests
 */
export class DebuggingApproachServer {
    /**
     * Validates the input data for a debugging approach request
     * @param input The input data to validate
     * @returns The validated debugging approach data
     * @throws Error if the input is invalid
     */
    private validateApproachData(input: unknown): DebuggingApproachData {
        const data = input as Record<string, unknown>

        if (!data.approachName || typeof data.approachName !== "string") {
            throw new Error("Invalid approachName: must be a string")
        }
        if (!data.issue || typeof data.issue !== "string") {
            throw new Error("Invalid issue: must be a string")
        }

        // Проверка валидности approachName
        const validApproaches = [
            "binary_search",
            "reverse_engineering",
            "divide_conquer",
            "backtracking",
            "cause_elimination",
            "program_slicing"
        ];

        if (!validApproaches.includes(data.approachName)) {
            throw new Error(`Invalid approachName: must be one of ${validApproaches.join(", ")}`)
        }

        // Проверка опциональных параметров
        if (data.steps !== undefined && !Array.isArray(data.steps)) {
            throw new Error("Invalid steps: must be an array of strings")
        }

        if (data.findings !== undefined && typeof data.findings !== "string") {
            throw new Error("Invalid findings: must be a string")
        }

        if (data.resolution !== undefined && typeof data.resolution !== "string") {
            throw new Error("Invalid resolution: must be a string")
        }

        return {
            approachName: data.approachName,
            issue: data.issue,
            steps: Array.isArray(data.steps) ? data.steps.map(String) : [],
            findings: typeof data.findings === "string" ? data.findings : "",
            resolution: typeof data.resolution === "string" ? data.resolution : "",
        }
    }

    /**
     * Форматирует вывод подхода к отладке
     * @param approachData Данные подхода к отладке для форматирования
     * @returns Отформатированный вывод
     */
    private formatApproachOutput(approachData: DebuggingApproachData): string {
        try {
            const { approachName, issue, steps, findings, resolution } = approachData

            // Ограничиваем длину строк для предотвращения проблем с форматированием
            const maxLineLength = 100;
            const truncateString = (str: string, maxLength: number): string => {
                if (str.length <= maxLength) return str;
                return str.substring(0, maxLength - 3) + "...";
            };

            const truncatedIssue = truncateString(issue, maxLineLength);
            const truncatedFindings = truncateString(findings, maxLineLength);
            const truncatedResolution = truncateString(resolution, maxLineLength);

            const border = "─".repeat(Math.max(approachName.length + 25, truncatedIssue.length + 4, 60));

            let output = `
┌${border}┐
│ 🔍 Debugging Approach: ${approachName.padEnd(border.length - 21)} │
├${border}┤
│ Issue: ${truncatedIssue.padEnd(border.length - 8)} │
├${border}┤
│ Steps:${" ".repeat(border.length - 7)} │
`;

            // Форматируем шаги с обработкой ошибок
            if (steps.length === 0) {
                output += `│ No steps provided yet.${" ".repeat(border.length - 22)} │\n`;
            } else {
                for (const step of steps) {
                    try {
                        const truncatedStep = truncateString(step, maxLineLength);
                        output += `│ • ${truncatedStep.padEnd(border.length - 4)} │\n`;
                    } catch (stepError) {
                        console.error("Error formatting step:", stepError);
                        output += `│ • [Error formatting step]${" ".repeat(border.length - 26)} │\n`;
                    }
                }
            }

            output += `├${border}┤\n`;
            output += `│ Findings: ${truncatedFindings.padEnd(border.length - 11)} │\n`;
            output += `├${border}┤\n`;
            output += `│ Resolution: ${truncatedResolution.padEnd(border.length - 12)} │\n`;
            output += `└${border}┘`;

            return output;
        } catch (error) {
            console.error("Error formatting debugging approach output:", error);
            return `[Error formatting debugging approach]`;
        }
    }

    /**
     * Обрабатывает запрос подхода к отладке
     * @param input Входные данные для запроса
     * @returns Содержимое ответа
     */
    public processApproach(input: unknown): {
        content: Array<{ type: string; text: string }>
        isError?: boolean
    } {
        try {
            console.error(`Processing debugging approach request:`, JSON.stringify(input, null, 2));
            const validatedInput = this.validateApproachData(input);

            try {
                const formattedOutput = this.formatApproachOutput(validatedInput);
                console.error(formattedOutput);
            } catch (formatError) {
                console.error("Failed to format debugging approach output:", formatError);
            }

            // Создаем структурированный и упрощенный ответ
            const responseObj = {
                approachName: validatedInput.approachName,
                issue: validatedInput.issue.substring(0, 100), // Ограничиваем длину для безопасности
                status: "success",
                hasSteps: validatedInput.steps.length > 0,
                stepsCount: validatedInput.steps.length,
                hasFindings: !!validatedInput.findings,
                hasResolution: !!validatedInput.resolution,
            };

            // Преобразуем в JSON с обработкой ошибок
            let responseText = "";
            try {
                responseText = JSON.stringify(responseObj, null, 2);
            } catch (jsonError) {
                console.error("Error stringifying response:", jsonError);
                // Запасной вариант, если произошла ошибка при JSON.stringify
                responseText = JSON.stringify({
                    approachName: validatedInput.approachName,
                    status: "success",
                    note: "Response simplified due to JSON serialization error"
                }, null, 2);
            }

            return {
                content: [
                    {
                        type: "text",
                        text: responseText
                    },
                ],
            };
        } catch (error) {
            console.error("Debugging approach server error:", error);

            // Обработка ошибок с надежным созданием JSON
            let errorMessage = "Unknown error";

            try {
                if (error instanceof Error) {
                    errorMessage = error.message;
                } else if (typeof error === 'string') {
                    errorMessage = error;
                } else {
                    errorMessage = JSON.stringify(error);
                }
            } catch (jsonError) {
                errorMessage = "Error cannot be converted to string";
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
            };
        }
    }
} 
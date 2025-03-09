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

        return {
            approachName: data.approachName,
            issue: data.issue,
            steps: Array.isArray(data.steps) ? data.steps.map(String) : [],
            findings: typeof data.findings === "string" ? data.findings : "",
            resolution: typeof data.resolution === "string" ? data.resolution : "",
        }
    }

    /**
     * Formats the debugging approach output
     * @param approachData The debugging approach data to format
     * @returns The formatted output
     */
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

    /**
     * Processes a debugging approach request
     * @param input The input data for the request
     * @returns The response content
     */
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
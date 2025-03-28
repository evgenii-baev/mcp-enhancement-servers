import {
    MentalModel,
    getMentalModelById,
    formatMentalModelOutput
} from "../models/mental-models.js";

/**
 * Server for processing mental model requests
 */
export class MentalModelServer {
    /**
     * Validates the input data for a mental model request
     * @param input The input data to validate
     * @returns The validated model name and problem
     * @throws Error if the input is invalid
     */
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

    /**
     * Processes a mental model request
     * @param input The input data for the request
     * @returns The response content
     */
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

            // Generate formatted output for console debugging
            const formattedOutput = formatMentalModelOutput(modelWithProblem)
            console.error(formattedOutput)

            // Create a more structured and simplified response
            // This should avoid issues with special characters in the JSON
            const responseObj = {
                modelName: model.name,
                modelId: model.id,
                status: "success",
                steps: model.steps,
                when_to_use: model.when_to_use,
                example: model.example,
                pitfalls: model.pitfalls,
                problem: problem,
                analysis: `Using the ${model.name} mental model to analyze: "${problem}"\n\n${model.definition}`
            }

            // Stringify with proper error handling
            let responseText = ""
            try {
                responseText = JSON.stringify(responseObj, null, 2)
            } catch (jsonError) {
                console.error("Error stringifying response:", jsonError)
                // Fallback to a simplified response if JSON stringify fails
                responseText = JSON.stringify({
                    modelName: model.name,
                    status: "success",
                    hasSteps: model.steps.length > 0,
                    problem: problem
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
            console.error("Mental model server error:", error)

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
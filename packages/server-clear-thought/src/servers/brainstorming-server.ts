import { getMentalModelById } from '../models/mental-models.js';
import { BrainstormingData, BrainstormingIdea, BrainstormingPhase } from '../interfaces/brainstorming-data.js';

/**
 * Server for facilitating structured brainstorming sessions
 */
export class BrainstormingServer {
    /** Map of active brainstorming sessions */
    private sessions: Map<string, BrainstormingData> = new Map();

    /**
     * Validate input data for brainstorming
     * @param input - Raw input data
     * @returns Validated brainstorming data
     */
    private validateBrainstormingData(input: unknown): Partial<BrainstormingData> {
        const data = input as Record<string, unknown>;

        // Validate topic if provided
        if (data.topic !== undefined && typeof data.topic !== "string") {
            throw new Error("Invalid topic: must be a string");
        }

        // Validate phase if provided
        if (data.phase !== undefined) {
            if (
                typeof data.phase !== "string" ||
                !Object.values(BrainstormingPhase).includes(data.phase as BrainstormingPhase)
            ) {
                throw new Error(
                    `Invalid phase: must be one of ${Object.values(BrainstormingPhase).join(", ")}`
                );
            }
        }

        // Validate ideas if provided
        if (data.ideas !== undefined) {
            if (!Array.isArray(data.ideas)) {
                throw new Error("Invalid ideas: must be an array");
            }

            data.ideas.forEach((ideaObj, index) => {
                if (!ideaObj || typeof ideaObj !== "object") {
                    throw new Error(`Invalid idea at index ${index}: must be an object`);
                }

                if (!ideaObj.id || typeof ideaObj.id !== "string") {
                    throw new Error(`Invalid idea.id at index ${index}: must be a string`);
                }

                if (!ideaObj.content || typeof ideaObj.content !== "string") {
                    throw new Error(`Invalid idea.content at index ${index}: must be a string`);
                }

                if (ideaObj.category !== undefined && typeof ideaObj.category !== "string") {
                    throw new Error(`Invalid idea.category at index ${index}: must be a string`);
                }

                if (
                    ideaObj.votes !== undefined &&
                    (typeof ideaObj.votes !== "number" || ideaObj.votes < 0)
                ) {
                    throw new Error(
                        `Invalid idea.votes at index ${index}: must be a non-negative number`
                    );
                }

                if (
                    ideaObj.buildUpon !== undefined &&
                    (!Array.isArray(ideaObj.buildUpon) ||
                        !ideaObj.buildUpon.every((b: unknown) => typeof b === "string"))
                ) {
                    throw new Error(
                        `Invalid idea.buildUpon at index ${index}: must be an array of strings`
                    );
                }

                if (
                    ideaObj.createdAt !== undefined &&
                    (typeof ideaObj.createdAt !== "number" || ideaObj.createdAt <= 0)
                ) {
                    throw new Error(
                        `Invalid idea.createdAt at index ${index}: must be a positive number`
                    );
                }
            });
        }

        // Validate constraints if provided
        if (data.constraints !== undefined) {
            if (
                !Array.isArray(data.constraints) ||
                !data.constraints.every((c) => typeof c === "string")
            ) {
                throw new Error("Invalid constraints: must be an array of strings");
            }
        }

        // Validate participants if provided
        if (data.participants !== undefined) {
            if (
                !Array.isArray(data.participants) ||
                !data.participants.every((p) => typeof p === "string")
            ) {
                throw new Error("Invalid participants: must be an array of strings");
            }
        }

        // Validate timeLimit if provided
        if (data.timeLimit !== undefined) {
            if (typeof data.timeLimit !== "number" || data.timeLimit <= 0) {
                throw new Error("Invalid timeLimit: must be a positive number");
            }
        }

        // Validate recommendedModels if provided
        if (data.recommendedModels !== undefined) {
            if (
                !Array.isArray(data.recommendedModels) ||
                !data.recommendedModels.every((m) => typeof m === "string")
            ) {
                throw new Error("Invalid recommendedModels: must be an array of strings");
            }
        }

        // Validate currentStep if provided
        if (data.currentStep !== undefined) {
            if (
                typeof data.currentStep !== "number" ||
                data.currentStep < 1 ||
                (data.totalSteps !== undefined &&
                    typeof data.totalSteps === "number" &&
                    data.currentStep > data.totalSteps)
            ) {
                throw new Error("Invalid currentStep: must be a positive number not exceeding totalSteps");
            }
        }

        // Validate totalSteps if provided
        if (data.totalSteps !== undefined) {
            if (typeof data.totalSteps !== "number" || data.totalSteps < 1) {
                throw new Error("Invalid totalSteps: must be a positive number");
            }
        }

        return data as Partial<BrainstormingData>;
    }

    /**
     * Generate a unique session ID
     * @returns Random session ID
     */
    private generateSessionId(): string {
        return (
            Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15)
        );
    }

    /**
     * Get recommended mental models for a topic
     * @param topic - Brainstorming topic
     * @returns Array of model IDs
     */
    private getRecommendedModels(topic: string): string[] {
        // Default models that work well for brainstorming
        const defaultModels = [
            "divergent_thinking",
            "lateral_thinking",
            "scenario_planning",
            "simulation",
            "catalysis",
        ];

        // In the future, could add smarter logic to select models based on topic
        return defaultModels;
    }

    /**
     * Format brainstorming data for display
     * @param data - Brainstorming data
     * @returns Formatted string output
     */
    private formatBrainstormingOutput(data: BrainstormingData): string {
        try {
            const border = "─".repeat(Math.max(data.topic.length + 20, 60));
            const phaseDisplay =
                data.phase.charAt(0).toUpperCase() + data.phase.slice(1).replace("_", " ");

            let output = `
┌${border}┐
│ 🧠 Brainstorming Session: ${data.topic.padEnd(border.length - 26)} │
├${border}┤
│ Phase: ${phaseDisplay.padEnd(border.length - 8)} │
├${border}┤
`;

            if (data.constraints && data.constraints.length > 0) {
                output += `│ Constraints:${" ".repeat(border.length - 13)} │\n`;
                data.constraints.forEach((constraint) => {
                    output += `│ • ${constraint.padEnd(border.length - 4)} │\n`;
                });
                output += `├${border}┤\n`;
            }

            if (data.participants && data.participants.length > 0) {
                output += `│ Participants:${" ".repeat(border.length - 14)} │\n`;
                data.participants.forEach((participant) => {
                    output += `│ • ${participant.padEnd(border.length - 4)} │\n`;
                });
                output += `├${border}┤\n`;
            }

            if (data.recommendedModels && data.recommendedModels.length > 0) {
                output += `│ Recommended Models:${" ".repeat(border.length - 20)} │\n`;
                data.recommendedModels.forEach((model) => {
                    try {
                        const modelObj = getMentalModelById(model);
                        if (modelObj) {
                            output += `│ • ${modelObj.name}: ${modelObj.definition
                                .substring(0, border.length - modelObj.name.length - 6)
                                .padEnd(border.length - modelObj.name.length - 6)} │\n`;
                        } else {
                            output += `│ • ${model.padEnd(border.length - 4)} │\n`;
                        }
                    } catch (modelError) {
                        console.error(`Error getting mental model ${model}:`, modelError);
                        output += `│ • ${model.padEnd(border.length - 4)} │\n`;
                    }
                });
                output += `├${border}┤\n`;
            }

            if (data.ideas && data.ideas.length > 0) {
                output += `│ Ideas (${data.ideas.length}):${" ".repeat(
                    border.length - 11 - String(data.ideas.length).length
                )} │\n`;

                // Group ideas by category if available
                const categorizedIdeas: Record<string, BrainstormingIdea[]> = {};
                data.ideas.forEach((idea) => {
                    const category = idea.category || "Uncategorized";
                    if (!categorizedIdeas[category]) {
                        categorizedIdeas[category] = [];
                    }
                    categorizedIdeas[category].push(idea);
                });

                // Display ideas by category
                Object.entries(categorizedIdeas).forEach(([category, ideas]) => {
                    output += `│ ${category}:${" ".repeat(border.length - category.length - 3)} │\n`;
                    ideas.forEach((idea) => {
                        try {
                            const voteDisplay = idea.votes !== undefined ? ` [${idea.votes} votes]` : "";
                            const contentLength = Math.min(idea.content.length, border.length - voteDisplay.length - 5);
                            output += `│   - ${idea.content.substring(0, contentLength)}${voteDisplay}${" ".repeat(
                                Math.max(0, border.length - contentLength - voteDisplay.length - 5)
                            )} │\n`;
                        } catch (ideaError) {
                            console.error(`Error formatting idea:`, ideaError);
                            output += `│   - [Error formatting idea] │\n`;
                        }
                    });
                });
            }

            output += `└${border}┘`;

            return output;
        } catch (error) {
            console.error("Error formatting brainstorming output:", error);
            return `[Error formatting brainstorming session]`;
        }
    }

    /**
     * Process brainstorming request
     * @param input - Raw input data
     * @returns Response object
     */
    public processBrainstorming(input: unknown): {
        content: Array<{ type: string; text: string }>;
        isError?: boolean;
    } {
        try {
            console.error(`Processing brainstorming request:`, JSON.stringify(input, null, 2));
            const data = this.validateBrainstormingData(input);

            // Get or create session
            let sessionId = (data as any).sessionId;
            let session: BrainstormingData;

            if (sessionId && this.sessions.has(sessionId)) {
                // Update existing session
                session = this.sessions.get(sessionId)!;
                console.error(`Found existing session: ${sessionId}`);

                // Update fields if provided
                if (data.phase !== undefined) {
                    console.error(`Updating phase to: ${data.phase}`);
                    session.phase = data.phase as BrainstormingPhase;
                }

                if (data.ideas !== undefined) {
                    console.error(`Updating ideas: ${data.ideas.length} ideas provided`);
                    session.ideas = data.ideas as BrainstormingIdea[];
                } else if ((data as any).newIdea) {
                    // Add new idea if provided, regardless of phase
                    const ideaContent = (data as any).newIdea;
                    console.error(`Adding new idea: ${ideaContent}`);

                    const newIdea: BrainstormingIdea = {
                        id: Math.random().toString(36).substring(2, 15),
                        content: ideaContent,
                        createdAt: Date.now(),
                    };

                    if ((data as any).category) {
                        newIdea.category = (data as any).category;
                    }

                    if ((data as any).buildUpon) {
                        newIdea.buildUpon = [(data as any).buildUpon];
                    }

                    session.ideas.push(newIdea);
                    console.error(`Added idea with ID: ${newIdea.id}`);
                }

                if (data.constraints !== undefined) {
                    console.error(`Updating constraints: ${data.constraints.length} constraints`);
                    session.constraints = data.constraints as string[];
                }

                if (data.participants !== undefined) {
                    console.error(`Updating participants: ${data.participants.length} participants`);
                    session.participants = data.participants as string[];
                }

                if (data.timeLimit !== undefined) {
                    console.error(`Updating time limit to: ${data.timeLimit} minutes`);
                    session.timeLimit = data.timeLimit as number;
                }

                if (data.recommendedModels !== undefined) {
                    console.error(`Updating recommended models: ${data.recommendedModels.length} models`);
                    session.recommendedModels = data.recommendedModels as string[];
                }

                if (data.currentStep !== undefined) {
                    console.error(`Updating current step to: ${data.currentStep}`);
                    session.currentStep = data.currentStep as number;
                }

                if (data.totalSteps !== undefined) {
                    console.error(`Updating total steps to: ${data.totalSteps}`);
                    session.totalSteps = data.totalSteps as number;
                }

                // Handle voting in evaluation phase
                if (session.phase === BrainstormingPhase.EVALUATION && (data as any).voteForIdea) {
                    const ideaId = (data as any).voteForIdea;
                    console.error(`Voting for idea: ${ideaId}`);
                    const idea = session.ideas.find((i) => i.id === ideaId);
                    if (idea) {
                        idea.votes = (idea.votes || 0) + 1;
                        console.error(`Updated votes for idea ${ideaId} to ${idea.votes}`);
                    } else {
                        console.error(`Idea ${ideaId} not found for voting`);
                    }
                }

                // Handle idea categorization
                if (
                    session.phase === BrainstormingPhase.CLARIFICATION &&
                    (data as any).categorizeIdea
                ) {
                    const { ideaId, category } = (data as any).categorizeIdea;
                    console.error(`Categorizing idea ${ideaId} as ${category}`);
                    const idea = session.ideas.find((i) => i.id === ideaId);
                    if (idea) {
                        idea.category = category;
                        console.error(`Updated category for idea ${ideaId} to ${category}`);
                    } else {
                        console.error(`Idea ${ideaId} not found for categorization`);
                    }
                }
            } else {
                // Create new session
                if (!data.topic) {
                    throw new Error("Topic is required to create a new brainstorming session");
                }

                sessionId = this.generateSessionId();
                console.error(`Creating new session with ID: ${sessionId}`);

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
                    totalSteps: (data.totalSteps as number) || 6, // Default 6 steps (one per phase)
                };

                this.sessions.set(sessionId, session);
                console.error(`New session created with topic: ${session.topic}`);
            }

            try {
                const formattedOutput = this.formatBrainstormingOutput(session);
                console.error(formattedOutput);
            } catch (formatError) {
                console.error("Failed to format brainstorming output:", formatError);
            }

            // Создаем структурированный и упрощенный ответ
            const responseObj = {
                sessionId,
                topic: session.topic,
                phase: session.phase,
                ideasCount: session.ideas.length,
                currentStep: session.currentStep,
                totalSteps: session.totalSteps,
                status: "success"
            };

            // Добавляем информацию о последней добавленной идее, если она есть
            if ((data as any).newIdea && session.ideas.length > 0) {
                const lastIdea = session.ideas[session.ideas.length - 1];
                responseObj['lastIdeaId'] = lastIdea.id;
            }

            // Преобразуем в JSON с обработкой ошибок
            let responseText = "";
            try {
                responseText = JSON.stringify(responseObj, null, 2);
            } catch (jsonError) {
                console.error("Error stringifying response:", jsonError);
                // Запасной вариант, если произошла ошибка при JSON.stringify
                responseText = JSON.stringify({
                    sessionId,
                    topic: session.topic,
                    phase: session.phase,
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
            console.error("Brainstorming server error:", error);

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
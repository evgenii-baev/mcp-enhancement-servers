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
                const modelObj = getMentalModelById(model);
                if (modelObj) {
                    output += `│ • ${modelObj.name}: ${modelObj.definition
                        .substring(0, border.length - modelObj.name.length - 6)
                        .padEnd(border.length - modelObj.name.length - 6)} │\n`;
                } else {
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
                    const voteDisplay = idea.votes !== undefined ? ` [${idea.votes} votes]` : "";
                    output += `│   - ${idea.content}${voteDisplay}${" ".repeat(
                        Math.max(0, border.length - idea.content.length - voteDisplay.length - 5)
                    )} │\n`;
                });
            });

            output += `├${border}┤\n`;
        }

        // Add hints based on current phase
        output += `│ Next Steps:${" ".repeat(border.length - 12)} │\n`;
        switch (data.phase) {
            case BrainstormingPhase.PREPARATION:
                output += `│ • Define constraints and participants${" ".repeat(
                    border.length - 36
                )} │\n`;
                output += `│ • Move to ideation phase when ready${" ".repeat(
                    border.length - 35
                )} │\n`;
                break;
            case BrainstormingPhase.IDEATION:
                output += `│ • Generate as many ideas as possible${" ".repeat(
                    border.length - 37
                )} │\n`;
                output += `│ • Don't evaluate ideas yet${" ".repeat(border.length - 27)} │\n`;
                output += `│ • Build upon others' ideas${" ".repeat(border.length - 28)} │\n`;
                break;
            case BrainstormingPhase.CLARIFICATION:
                output += `│ • Clarify and refine ideas${" ".repeat(border.length - 29)} │\n`;
                output += `│ • Combine similar ideas${" ".repeat(border.length - 25)} │\n`;
                output += `│ • Categorize ideas${" ".repeat(border.length - 21)} │\n`;
                break;
            case BrainstormingPhase.EVALUATION:
                output += `│ • Evaluate each idea objectively${" ".repeat(border.length - 34)} │\n`;
                output += `│ • Consider feasibility and impact${" ".repeat(border.length - 34)} │\n`;
                output += `│ • Vote on promising ideas${" ".repeat(border.length - 28)} │\n`;
                break;
            case BrainstormingPhase.SELECTION:
                output += `│ • Select the best ideas to pursue${" ".repeat(border.length - 35)} │\n`;
                output += `│ • Consider combining complementary ideas${" ".repeat(
                    border.length - 40
                )} │\n`;
                break;
            case BrainstormingPhase.ACTION_PLANNING:
                output += `│ • Define next steps for selected ideas${" ".repeat(
                    border.length - 39
                )} │\n`;
                output += `│ • Assign responsibilities${" ".repeat(border.length - 27)} │\n`;
                output += `│ • Set timelines${" ".repeat(border.length - 17)} │\n`;
                break;
        }

        output += `└${border}┘`;

        return output;
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
            const data = this.validateBrainstormingData(input);

            // Get or create session
            let sessionId = (data as any).sessionId;
            let session: BrainstormingData;

            if (sessionId && this.sessions.has(sessionId)) {
                // Update existing session
                session = this.sessions.get(sessionId)!;

                // Update fields if provided
                if (data.phase !== undefined) {
                    session.phase = data.phase as BrainstormingPhase;
                }

                if (data.ideas !== undefined) {
                    session.ideas = data.ideas as BrainstormingIdea[];
                } else if ((data as any).newIdea) {
                    // Add new idea if provided, regardless of phase
                    const newIdea: BrainstormingIdea = {
                        id: Math.random().toString(36).substring(2, 15),
                        content: (data as any).newIdea,
                        createdAt: Date.now(),
                    };

                    if ((data as any).category) {
                        newIdea.category = (data as any).category;
                    }

                    if ((data as any).buildUpon) {
                        newIdea.buildUpon = [(data as any).buildUpon];
                    }

                    session.ideas.push(newIdea);
                }

                if (data.constraints !== undefined) {
                    session.constraints = data.constraints as string[];
                }

                if (data.participants !== undefined) {
                    session.participants = data.participants as string[];
                }

                if (data.timeLimit !== undefined) {
                    session.timeLimit = data.timeLimit as number;
                }

                if (data.recommendedModels !== undefined) {
                    session.recommendedModels = data.recommendedModels as string[];
                }

                if (data.currentStep !== undefined) {
                    session.currentStep = data.currentStep as number;
                }

                if (data.totalSteps !== undefined) {
                    session.totalSteps = data.totalSteps as number;
                }

                // Handle voting in evaluation phase
                if (data.phase === BrainstormingPhase.EVALUATION && (data as any).voteForIdea) {
                    const ideaId = (data as any).voteForIdea;
                    const idea = session.ideas.find((i) => i.id === ideaId);
                    if (idea) {
                        idea.votes = (idea.votes || 0) + 1;
                    }
                }

                // Handle idea categorization
                if (
                    data.phase === BrainstormingPhase.CLARIFICATION &&
                    (data as any).categorizeIdea
                ) {
                    const { ideaId, category } = (data as any).categorizeIdea;
                    const idea = session.ideas.find((i) => i.id === ideaId);
                    if (idea) {
                        idea.category = category;
                    }
                }
            } else {
                // Create new session
                if (!data.topic) {
                    throw new Error("Topic is required to create a new brainstorming session");
                }

                sessionId = this.generateSessionId();
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
            }

            const formattedOutput = this.formatBrainstormingOutput(session);
            console.error(formattedOutput);

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
            };
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
            };
        }
    }
} 
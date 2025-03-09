import { BrainstormingPhase } from '../interfaces/server-interfaces.js';

/**
 * Server implementation for the brainstorming tool
 */
export class BrainstormingServer {
    constructor() {
        this.sessions = new Map();
    }

    /**
     * Validates brainstorming data from input
     */
    validateBrainstormingData(input) {
        const data = input || {};

        // Validate phase if provided
        if (data.phase) {
            const phase = data.phase;
            if (!Object.values(BrainstormingPhase).includes(phase)) {
                throw new Error(
                    `Invalid phase: must be one of ${Object.values(BrainstormingPhase).join(", ")}`
                );
            }
        }

        // Validate ideas if provided
        if (data.ideas && !Array.isArray(data.ideas)) {
            throw new Error("Ideas must be an array");
        }

        return data;
    }

    /**
     * Format brainstorming output for display
     */
    formatBrainstormingOutput(data) {
        const { topic, phase, ideas, constraints, participants } = data;
        const border = "─".repeat(Math.max(topic.length + 26, 50));

        let output = `
┌${border}┐
│ 🧠 Brainstorming Session: ${topic.padEnd(border.length - 26)} │
├${border}┤
│ Current Phase: ${phase.padEnd(border.length - 16)} │
`;

        // Add constraints if available
        if (constraints && constraints.length > 0) {
            output += `├${border}┤\n│ Constraints:${" ".repeat(border.length - 13)} │\n`;
            constraints.forEach(constraint => {
                output += `│ • ${constraint.padEnd(border.length - 4)} │\n`;
            });
        }

        // Add participants if available
        if (participants && participants.length > 0) {
            output += `├${border}┤\n│ Participants:${" ".repeat(border.length - 14)} │\n`;
            participants.forEach(participant => {
                output += `│ • ${participant.padEnd(border.length - 4)} │\n`;
            });
        }

        // Add ideas based on phase
        if (ideas && ideas.length > 0) {
            // Different idea display based on phase
            if (phase === BrainstormingPhase.IDEATION || phase === BrainstormingPhase.PREPARATION) {
                // Simple list of ideas
                output += `├${border}┤\n│ Ideas:${" ".repeat(border.length - 8)} │\n`;
                ideas.forEach(idea => {
                    output += `│ • ${idea.text.padEnd(border.length - 4)} │\n`;
                });
            } else if (phase === BrainstormingPhase.CLARIFICATION) {
                // Ideas with categories
                output += `├${border}┤\n│ Ideas with Categories:${" ".repeat(border.length - 21)} │\n`;

                // Group ideas by category
                const categorizedIdeas = {};
                ideas.forEach(idea => {
                    const category = idea.category || "Uncategorized";
                    if (!categorizedIdeas[category]) {
                        categorizedIdeas[category] = [];
                    }
                    categorizedIdeas[category].push(idea);
                });

                // Display by category
                Object.keys(categorizedIdeas).forEach(category => {
                    output += `│ ${category}:${" ".repeat(border.length - category.length - 3)} │\n`;
                    categorizedIdeas[category].forEach(idea => {
                        output += `│   • ${idea.text.padEnd(border.length - 6)} │\n`;
                    });
                });
            } else if (phase === BrainstormingPhase.EVALUATION ||
                phase === BrainstormingPhase.SELECTION ||
                phase === BrainstormingPhase.ACTION_PLANNING) {
                // Ideas with votes or actions
                output += `├${border}┤\n│ Ideas with Evaluation:${" ".repeat(border.length - 22)} │\n`;
                ideas.forEach(idea => {
                    const votes = idea.votes || 0;
                    const selected = idea.selected ? "✓" : " ";
                    const actions = idea.actions || [];

                    output += `│ ${selected} [${votes}] ${idea.text.padEnd(border.length - 8 - selected.length)} │\n`;

                    if (actions.length > 0 && phase === BrainstormingPhase.ACTION_PLANNING) {
                        actions.forEach(action => {
                            output += `│     → ${action.padEnd(border.length - 8)} │\n`;
                        });
                    }
                });
            }
        }

        // Add phase guidance
        output += `├${border}┤\n│ Phase Guidance:${" ".repeat(border.length - 16)} │\n`;

        switch (phase) {
            case BrainstormingPhase.PREPARATION:
                output += `│ • Define the problem clearly${" ".repeat(border.length - 28)} │\n`;
                output += `│ • Establish constraints and criteria${" ".repeat(border.length - 37)} │\n`;
                output += `│ • Identify participants and their roles${" ".repeat(border.length - 40)} │\n`;
                break;
            case BrainstormingPhase.IDEATION:
                output += `│ • Generate as many ideas as possible${" ".repeat(border.length - 39)} │\n`;
                output += `│ • Defer judgment - no criticism${" ".repeat(border.length - 34)} │\n`;
                output += `│ • Build on others' ideas${" ".repeat(border.length - 29)} │\n`;
                output += `│ • Welcome unusual and creative concepts${" ".repeat(border.length - 43)} │\n`;
                break;
            case BrainstormingPhase.CLARIFICATION:
                output += `│ • Group similar ideas together${" ".repeat(border.length - 35)} │\n`;
                output += `│ • Clarify ambiguous suggestions${" ".repeat(border.length - 36)} │\n`;
                output += `│ • Combine complementary concepts${" ".repeat(border.length - 36)} │\n`;
                output += `│ • Categorize ideas by theme${" ".repeat(border.length - 32)} │\n`;
                break;
            case BrainstormingPhase.EVALUATION:
                output += `│ • Rate ideas against your criteria${" ".repeat(border.length - 38)} │\n`;
                output += `│ • Consider feasibility and impact${" ".repeat(border.length - 37)} │\n`;
                output += `│ • Identify strengths and weaknesses${" ".repeat(border.length - 39)} │\n`;
                output += `│ • Vote on the most promising options${" ".repeat(border.length - 41)} │\n`;
                break;
            case BrainstormingPhase.SELECTION:
                output += `│ • Select the top ideas to pursue${" ".repeat(border.length - 37)} │\n`;
                output += `│ • Combine elements if beneficial${" ".repeat(border.length - 36)} │\n`;
                output += `│ • Verify alignment with initial goals${" ".repeat(border.length - 40)} │\n`;
                break;
            case BrainstormingPhase.ACTION_PLANNING:
                output += `│ • Define specific next steps${" ".repeat(border.length - 32)} │\n`;
                output += `│ • Assign responsibilities${" ".repeat(border.length - 29)} │\n`;
                output += `│ • Set timelines and milestones${" ".repeat(border.length - 34)} │\n`;
                output += `│ • Identify potential obstacles${" ".repeat(border.length - 34)} │\n`;
                break;
        }

        output += `└${border}┘`;
        return output;
    }

    /**
     * Process brainstorming input and manage sessions
     */
    processBrainstorming(input) {
        try {
            // Validate input data
            const data = this.validateBrainstormingData(input);

            // Get or create session
            let session;

            if (data.sessionId && this.sessions.has(data.sessionId)) {
                // Update existing session
                session = this.sessions.get(data.sessionId);

                // Update phase if provided
                if (data.phase) {
                    session.phase = data.phase;
                }

                // Update ideas if provided
                if (data.ideas) {
                    session.ideas = data.ideas;
                } else if (data.phase === BrainstormingPhase.IDEATION && data.newIdea) {
                    // Add new idea in ideation phase
                    const newIdea = {
                        text: data.newIdea,
                        id: Date.now().toString(),
                        votes: 0
                    };
                    session.ideas.push(newIdea);
                }

                // Update constraints if provided
                if (data.constraints) {
                    session.constraints = data.constraints;
                }

                // Update participants if provided
                if (data.participants) {
                    session.participants = data.participants;
                }

                // Handle idea categorization in clarification phase
                if (
                    data.phase === BrainstormingPhase.CLARIFICATION &&
                    data.ideaId &&
                    data.category
                ) {
                    const idea = session.ideas.find(i => i.id === data.ideaId);
                    if (idea) {
                        idea.category = data.category;
                    }
                }

                // Handle voting in evaluation phase
                if (data.phase === BrainstormingPhase.EVALUATION && data.voteForIdea) {
                    const idea = session.ideas.find(i => i.id === data.voteForIdea);
                    if (idea) {
                        idea.votes = (idea.votes || 0) + 1;
                    }
                }

                // Handle selection in selection phase
                if (data.phase === BrainstormingPhase.SELECTION && data.selectIdea) {
                    const idea = session.ideas.find(i => i.id === data.selectIdea);
                    if (idea) {
                        idea.selected = true;
                    }
                }

                // Handle actions in action planning phase
                if (
                    data.phase === BrainstormingPhase.ACTION_PLANNING &&
                    data.ideaId &&
                    data.action
                ) {
                    const idea = session.ideas.find(i => i.id === data.ideaId);
                    if (idea) {
                        if (!idea.actions) {
                            idea.actions = [];
                        }
                        idea.actions.push(data.action);
                    }
                }
            } else {
                // Create new session
                if (!data.topic) {
                    throw new Error("Topic is required to create a new brainstorming session");
                }

                const sessionId = data.sessionId || Date.now().toString();
                session = {
                    sessionId,
                    topic: data.topic,
                    phase: data.phase || BrainstormingPhase.PREPARATION,
                    ideas: data.ideas || [],
                    constraints: data.constraints || [],
                    participants: data.participants || [],
                    created: new Date().toISOString()
                };

                this.sessions.set(sessionId, session);
            }

            // Format output for display
            const formattedOutput = this.formatBrainstormingOutput(session);
            console.error(formattedOutput);

            // Return structured response
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            sessionId: session.sessionId,
                            phase: session.phase,
                            topic: session.topic,
                            ideaCount: session.ideas.length,
                            nextPhase: this.getNextPhase(session.phase),
                            status: "success"
                        })
                    }
                ]
            };
        } catch (error) {
            console.error(`Error processing brainstorming: ${error.message}`);
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            error: error.message,
                            status: "error"
                        })
                    }
                ],
                isError: true
            };
        }
    }

    /**
     * Get the next phase in the brainstorming process
     */
    getNextPhase(currentPhase) {
        const phases = Object.values(BrainstormingPhase);
        const currentIndex = phases.indexOf(currentPhase);

        if (currentIndex === -1 || currentIndex === phases.length - 1) {
            return null;
        }

        return phases[currentIndex + 1];
    }
} 
/**
 * Feature Discussion Server
 * Facilitates structured feature discussions with persistent context
 */

/**
 * Interface for feature discussion data
 * @typedef {Object} FeatureDiscussionData
 * @property {string} featureId - Unique identifier for the feature being discussed
 * @property {string} response - The response for the current discussion prompt
 */

/**
 * Enum for discussion stages
 * @enum {string}
 */
export const DiscussionStage = {
    PROBLEM_DEFINITION: 'problem_definition',
    USER_NEEDS: 'user_needs',
    REQUIREMENTS: 'requirements',
    CONSTRAINTS: 'constraints',
    SOLUTION_IDEAS: 'solution_ideas',
    EVALUATION: 'evaluation',
    DECISION: 'decision',
    IMPLEMENTATION_PLAN: 'implementation_plan'
};

/**
 * Server for facilitating structured feature discussions
 */
export class FeatureDiscussionServer {
    constructor() {
        this.discussionState = new Map();

        // Define discussion flow with prompts for each stage
        this.discussionFlow = {
            [DiscussionStage.PROBLEM_DEFINITION]: {
                prompt: "What problem does this feature aim to solve? Describe the current pain points or limitations.",
                nextStage: DiscussionStage.USER_NEEDS
            },
            [DiscussionStage.USER_NEEDS]: {
                prompt: "Who are the target users, and what specific needs will this feature address for them?",
                nextStage: DiscussionStage.REQUIREMENTS
            },
            [DiscussionStage.REQUIREMENTS]: {
                prompt: "What are the specific functional requirements for this feature?",
                nextStage: DiscussionStage.CONSTRAINTS
            },
            [DiscussionStage.CONSTRAINTS]: {
                prompt: "What technical, resource, or business constraints need to be considered?",
                nextStage: DiscussionStage.SOLUTION_IDEAS
            },
            [DiscussionStage.SOLUTION_IDEAS]: {
                prompt: "What possible implementation approaches or solutions could address the requirements?",
                nextStage: DiscussionStage.EVALUATION
            },
            [DiscussionStage.EVALUATION]: {
                prompt: "How do the proposed solutions compare in terms of feasibility, scalability, and alignment with requirements?",
                nextStage: DiscussionStage.DECISION
            },
            [DiscussionStage.DECISION]: {
                prompt: "Based on the evaluation, which solution approach should be selected and why?",
                nextStage: DiscussionStage.IMPLEMENTATION_PLAN
            },
            [DiscussionStage.IMPLEMENTATION_PLAN]: {
                prompt: "What are the key steps, milestones, and considerations for implementing this feature?",
                nextStage: null // End of discussion
            }
        };
    }

    /**
     * Validate input data for feature discussion
     * @param {unknown} input - Raw input data
     * @returns {FeatureDiscussionData} Validated feature discussion data
     */
    validateDiscussionData(input) {
        const data = input || {};

        if (!data.featureId || typeof data.featureId !== 'string') {
            throw new Error('Invalid featureId: must be a non-empty string');
        }

        if (!data.response || typeof data.response !== 'string') {
            throw new Error('Invalid response: must be a non-empty string');
        }

        return {
            featureId: data.featureId,
            response: data.response
        };
    }

    /**
     * Get discussion state for a feature
     * @param {string} featureId - Feature identifier
     * @returns {Object} Current discussion state
     */
    getDiscussionState(featureId) {
        if (!this.discussionState.has(featureId)) {
            // Initialize new discussion
            this.discussionState.set(featureId, {
                stage: DiscussionStage.PROBLEM_DEFINITION,
                responses: {},
                startTime: new Date().toISOString()
            });
        }

        return this.discussionState.get(featureId);
    }

    /**
     * Update discussion state with new response
     * @param {string} featureId - Feature identifier
     * @param {string} response - User response for current stage
     * @returns {Object} Updated discussion state
     */
    updateDiscussionState(featureId, response) {
        const state = this.getDiscussionState(featureId);
        const currentStage = state.stage;

        // Store response for current stage
        state.responses[currentStage] = response;

        // Move to next stage if available
        const nextStage = this.discussionFlow[currentStage].nextStage;
        if (nextStage) {
            state.stage = nextStage;
        } else {
            // Mark discussion as complete
            state.isComplete = true;
            state.completionTime = new Date().toISOString();
        }

        return state;
    }

    /**
     * Format next discussion prompt
     * @param {string} featureId - Feature identifier
     * @returns {string} Formatted output for next prompt
     */
    formatNextPrompt(featureId) {
        const state = this.getDiscussionState(featureId);
        const currentStage = state.stage;
        const stageInfo = this.discussionFlow[currentStage];

        // Determine discussion progress
        const stages = Object.keys(this.discussionFlow);
        const currentIndex = stages.indexOf(currentStage);
        const totalStages = stages.length;
        const progressPercentage = Math.round(currentIndex / totalStages * 100);

        // Calculate border width based on prompt length
        const prompt = stageInfo.prompt;
        const border = '─'.repeat(Math.max(prompt.length + 4, 40));

        let output = `
┌${border}┐
│ 🔍 Feature Discussion: ${state.isComplete ? 'COMPLETE' : `Stage ${currentIndex + 1}/${totalStages}`}${' '.repeat(Math.max(0, prompt.length + 4 - 26 - String(currentIndex + 1).length - String(totalStages).length))} │
├${border}┤
│ Feature ID: ${featureId}${' '.repeat(Math.max(0, prompt.length + 4 - featureId.length - 13))} │
│ Progress: ${progressPercentage}%${' '.repeat(Math.max(0, prompt.length + 4 - String(progressPercentage).length - 12))} │
├${border}┤
│ ${prompt}${' '.repeat(Math.max(0, border - prompt.length - 2))} │
`;

        if (state.isComplete) {
            output += `├${border}┤
│ Discussion complete! All stages have been addressed.${' '.repeat(Math.max(0, border - 51))} │
│ Use the feature analyzer to generate technical specifications.${' '.repeat(Math.max(0, border - 56))} │
`;
        }

        output += `└${border}┘`;

        return output;
    }

    /**
     * Format discussion summary
     * @param {string} featureId - Feature identifier
     * @returns {string} Formatted summary of the discussion
     */
    formatDiscussionSummary(featureId) {
        const state = this.getDiscussionState(featureId);
        const responses = state.responses;

        // Calculate border width based on the longest content
        const titles = {
            [DiscussionStage.PROBLEM_DEFINITION]: 'Problem Definition',
            [DiscussionStage.USER_NEEDS]: 'User Needs',
            [DiscussionStage.REQUIREMENTS]: 'Requirements',
            [DiscussionStage.CONSTRAINTS]: 'Constraints',
            [DiscussionStage.SOLUTION_IDEAS]: 'Solution Ideas',
            [DiscussionStage.EVALUATION]: 'Evaluation',
            [DiscussionStage.DECISION]: 'Decision',
            [DiscussionStage.IMPLEMENTATION_PLAN]: 'Implementation Plan'
        };

        // Find longest line for border calculation
        let maxLength = 0;
        Object.entries(responses).forEach(([stage, response]) => {
            const title = titles[stage];
            maxLength = Math.max(maxLength, title.length,
                ...response.split('\n').map(line => line.length));
        });

        const border = '─'.repeat(Math.max(maxLength + 4, 40));

        let output = `
┌${border}┐
│ 📝 Feature Discussion Summary${' '.repeat(Math.max(0, border - 29))} │
├${border}┤
│ Feature ID: ${featureId}${' '.repeat(Math.max(0, border - featureId.length - 13))} │
`;

        // Add each response section
        Object.entries(responses).forEach(([stage, response]) => {
            const title = titles[stage];
            output += `├${border}┤
│ ${title}:${' '.repeat(Math.max(0, border - title.length - 3))} │
`;

            // Split response into lines and format each line
            const lines = response.split('\n');
            lines.forEach(line => {
                output += `│ ${line}${' '.repeat(Math.max(0, border - line.length - 2))} │\n`;
            });
        });

        if (state.isComplete) {
            output += `├${border}┤
│ Status: COMPLETE${' '.repeat(Math.max(0, border - 16))} │
`;
        } else {
            const currentStage = state.stage;
            const currentTitle = titles[currentStage];
            output += `├${border}┤
│ Status: IN PROGRESS${' '.repeat(Math.max(0, border - 20))} │
│ Next Stage: ${currentTitle}${' '.repeat(Math.max(0, border - currentTitle.length - 13))} │
`;
        }

        output += `└${border}┘`;

        return output;
    }

    /**
     * Process feature discussion
     * @param {unknown} input - Input data
     * @returns {Object} Formatted output with content and error status
     */
    processDiscussion(input) {
        try {
            const data = this.validateDiscussionData(input);
            const { featureId, response } = data;

            // Update discussion state with new response
            this.updateDiscussionState(featureId, response);

            // Determine output based on discussion state
            const state = this.getDiscussionState(featureId);
            let formattedOutput;

            if (state.isComplete) {
                // If discussion is complete, provide summary
                formattedOutput = this.formatDiscussionSummary(featureId);
            } else {
                // Otherwise, provide next prompt
                formattedOutput = this.formatNextPrompt(featureId);
            }

            return {
                content: [{ type: 'text', text: formattedOutput }],
                isError: false
            };
        } catch (error) {
            return {
                content: [{ type: 'text', text: `Error processing feature discussion: ${error.message}` }],
                isError: true
            };
        }
    }
}
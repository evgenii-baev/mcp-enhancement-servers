import {
    ThoughtData,
    MentalModelData,
    DebuggingApproachData
} from '../interfaces/server-interfaces.js';

// Server Classes
export class MentalModelServer {
    private validateModelData(input: unknown): MentalModelData {
        const data = input as Record<string, unknown>;

        if (!data.modelName || typeof data.modelName !== 'string') {
            throw new Error('Invalid modelName: must be a string');
        }
        if (!data.problem || typeof data.problem !== 'string') {
            throw new Error('Invalid problem: must be a string');
        }

        return data as MentalModelData;
    }

    public processModel(input: unknown): { content: Array<{ type: string; text: string }>; isError?: boolean } {
        try {
            const data = this.validateModelData(input);

            // Process the mental model data
            console.log(`Processing mental model: ${data.modelName} for problem: ${data.problem}`);

            return {
                content: [
                    { type: "text", text: `Applied ${data.modelName} to problem: ${data.problem}` }
                ]
            };
        } catch (error) {
            return {
                content: [{ type: "text", text: `Error processing mental model: ${error}` }],
                isError: true
            };
        }
    }
}

export class DebuggingApproachServer {
    private validateApproachData(input: unknown): DebuggingApproachData {
        const data = input as Record<string, unknown>;

        if (!data.approachName || typeof data.approachName !== 'string') {
            throw new Error('Invalid approachName: must be a string');
        }
        if (!data.issue || typeof data.issue !== 'string') {
            throw new Error('Invalid issue: must be a string');
        }

        return data as DebuggingApproachData;
    }

    public processApproach(input: unknown): { content: Array<{ type: string; text: string }>; isError?: boolean } {
        try {
            const data = this.validateApproachData(input);

            // Process the debugging approach data
            console.log(`Processing debugging approach: ${data.approachName} for issue: ${data.issue}`);

            return {
                content: [
                    { type: "text", text: `Applied ${data.approachName} to issue: ${data.issue}` }
                ]
            };
        } catch (error) {
            return {
                content: [{ type: "text", text: `Error processing debugging approach: ${error}` }],
                isError: true
            };
        }
    }
}

export class SequentialThinkingServer {
    private validateThoughtData(input: unknown): ThoughtData {
        const data = input as Record<string, unknown>;

        if (!data.thought || typeof data.thought !== 'string') {
            throw new Error('Invalid thought: must be a string');
        }
        if (typeof data.thoughtNumber !== 'number') {
            throw new Error('Invalid thoughtNumber: must be a number');
        }
        if (typeof data.totalThoughts !== 'number') {
            throw new Error('Invalid totalThoughts: must be a number');
        }
        if (typeof data.nextThoughtNeeded !== 'boolean') {
            throw new Error('Invalid nextThoughtNeeded: must be a boolean');
        }

        return data as ThoughtData;
    }

    public processThought(input: unknown): { content: Array<{ type: string; text: string }>; isError?: boolean } {
        try {
            const data = this.validateThoughtData(input);

            // Process the sequential thinking data
            console.log(`Processing thought ${data.thoughtNumber}/${data.totalThoughts}: ${data.thought.substring(0, 50)}...`);

            return {
                content: [
                    { type: "text", text: `Processed thought ${data.thoughtNumber}/${data.totalThoughts}` }
                ]
            };
        } catch (error) {
            return {
                content: [{ type: "text", text: `Error processing sequential thinking: ${error}` }],
                isError: true
            };
        }
    }
} 
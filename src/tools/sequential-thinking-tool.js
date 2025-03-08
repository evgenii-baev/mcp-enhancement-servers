export const SEQUENTIAL_THINKING_TOOL = {
    name: "sequential_thinking",
    description: "A tool for dynamic and reflective problem-solving through sequential thoughts.",
    parameters: {
        type: "object",
        properties: {
            thought: {
                type: "string",
                description: "Your current thinking step in detail."
            },
            thoughtNumber: {
                type: "integer",
                minimum: 1,
                description: "The sequential number of this thought in your thinking process."
            },
            totalThoughts: {
                type: "integer",
                minimum: 1,
                description: "Your current estimate of how many thoughts will be needed to solve the problem."
            },
            nextThoughtNeeded: {
                type: "boolean",
                description: "Whether another thought step is needed after this one."
            },
            isRevision: {
                type: "boolean",
                description: "Whether this thought revises or corrects a previous thought."
            },
            revisesThought: {
                type: "integer",
                minimum: 1,
                description: "If this is a revision, specify which thought number is being revised or corrected."
            },
            branchFromThought: {
                type: "integer",
                minimum: 1,
                description: "If this thought starts a new branch of thinking, specify which thought number it branches from."
            },
            branchId: {
                type: "string",
                description: "A unique identifier for this branch of thinking."
            },
            needsMoreThoughts: {
                type: "boolean",
                description: "Indicates that more thoughts are needed even if you initially thought you were done."
            }
        },
        required: ["thought", "nextThoughtNeeded", "thoughtNumber", "totalThoughts"]
    }
}; 
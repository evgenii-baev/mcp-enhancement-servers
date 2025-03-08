export const BRAINSTORMING_TOOL = {
    name: "brainstorming",
    description: "A tool for facilitating structured brainstorming sessions.",
    parameters: {
        type: "object",
        properties: {
            phase: {
                type: "string",
                enum: [
                    "preparation",
                    "ideation",
                    "clarification",
                    "evaluation",
                    "selection",
                    "action_planning"
                ],
                description: "Current phase of the brainstorming process."
            },
            topic: {
                type: "string",
                description: "The main subject or problem for brainstorming."
            },
            sessionId: {
                type: "string",
                description: "Identifier for an existing brainstorming session."
            }
        },
        required: []
    }
}; 
export const MODEL_SELECTOR_TOOL = {
    name: "model_selector",
    description: "A tool for selecting the optimal model for a given task.",
    parameters: {
        type: "object",
        properties: {
            task: {
                type: "string",
                description: "The task for which a model needs to be selected."
            },
            context: {
                type: "string",
                description: "Additional context about the task."
            },
            constraints: {
                type: "array",
                items: {
                    type: "string"
                },
                description: "Any constraints that might affect model selection."
            },
            preferences: {
                type: "array",
                items: {
                    type: "string"
                },
                description: "User preferences for model selection."
            }
        },
        required: ["task"]
    }
}; 
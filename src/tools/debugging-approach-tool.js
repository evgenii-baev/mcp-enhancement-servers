export const DEBUGGING_APPROACH_TOOL = {
    name: "debugging_approach",
    description: "A tool for applying systematic debugging approaches to technical issues.",
    parameters: {
        type: "object",
        properties: {
            approachName: {
                type: "string",
                enum: [
                    "binary_search",
                    "reverse_engineering",
                    "divide_conquer",
                    "backtracking",
                    "cause_elimination",
                    "program_slicing"
                ],
                description: "The debugging approach to apply."
            },
            issue: {
                type: "string",
                description: "A detailed description of the technical issue you're facing."
            },
            steps: {
                type: "array",
                items: {
                    type: "string"
                },
                description: "Optional list of steps you've already taken or plan to take in your debugging process."
            },
            findings: {
                type: "string",
                description: "Optional information discovered during your debugging process."
            },
            resolution: {
                type: "string",
                description: "Optional solution or fix for the issue."
            }
        },
        required: ["approachName", "issue"]
    }
}; 
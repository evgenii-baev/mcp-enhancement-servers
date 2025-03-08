export const MODEL_SELECTOR_TOOL = {
    name: "model_selector",
    description: "Helps select the optimal architecture, design pattern, algorithm, or data structure for programming tasks.",
    details: `
        ## When to use
        - At the beginning of project design, when choosing an application architecture
        - When solving a specific problem that requires an appropriate design pattern
        - When selecting the most efficient algorithm for data processing
        - When choosing the optimal data structure for storing and accessing information
        - For comparing different approaches to solving the same task

        ## Example scenarios
        - Developing a scalable web application with high traffic
        - Implementing dynamic object creation based on configuration
        - Efficient sorting and searching in large datasets
        - Designing a cache with fast lookups and automatic expiration

        ## Best practices
        - Provide detailed task descriptions for more accurate recommendations
        - Specify context, constraints, and preferences for more relevant results
        - Use this tool in early design phases to choose the optimal approach
        - Consider the trade-offs highlighted in the recommendations

        ## Integration
        Use this tool when users need help with software architecture, algorithm selection, or design patterns.
        For example:
        - When a user asks "What's the best way to structure my e-commerce app?"
        - When a user needs to choose between different sorting algorithms
        - When deciding on a pattern for implementing a feature with multiple variations
    `,
    parameters: {
        type: "object",
        properties: {
            task: {
                type: "string",
                description: "The specific programming task or problem that requires a model/approach recommendation"
            },
            context: {
                type: "string",
                description: "Additional context about the project, environment, or requirements"
            },
            constraints: {
                type: "array",
                items: {
                    type: "string"
                },
                description: "Any limitations or requirements that might affect the choice of model/approach"
            },
            preferences: {
                type: "array",
                items: {
                    type: "string"
                },
                description: "Desired qualities or characteristics that the selected model/approach should have"
            }
        },
        required: ["task"]
    }
}; 
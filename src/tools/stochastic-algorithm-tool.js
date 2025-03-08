export const STOCHASTIC_ALGORITHM_TOOL = {
    name: "stochastic_algorithm",
    description: "A tool for applying stochastic algorithms to decision-making problems.",
    parameters: {
        type: "object",
        properties: {
            algorithm: {
                type: "string",
                enum: ["mdp", "mcts", "bandit", "bayesian", "hmm"],
                description: "The stochastic algorithm to apply."
            },
            problem: {
                type: "string",
                description: "The problem to solve using the stochastic algorithm."
            },
            parameters: {
                type: "object",
                additionalProperties: true,
                description: "Parameters specific to the chosen algorithm."
            },
            result: {
                type: "string",
                description: "Optional result of the algorithm application."
            }
        },
        required: ["algorithm", "problem", "parameters"]
    }
}; 
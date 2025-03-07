import { Tool } from "@modelcontextprotocol/sdk/types.js";

/**
 * Tool for applying stochastic algorithms to decision-making problems
 */
export const STOCHASTIC_ALGORITHM_TOOL: Tool = {
    name: "stochastic_algorithm",
    description: `A tool for applying stochastic algorithms to decision-making problems.
Supports various algorithms including:
- Markov Decision Processes (MDPs): Optimize policies over long sequences of decisions
- Monte Carlo Tree Search (MCTS): Simulate future action sequences for large decision spaces
- Multi-Armed Bandit: Balance exploration vs exploitation in action selection
- Bayesian Optimization: Optimize decisions with probabilistic inference
- Hidden Markov Models (HMMs): Infer latent states affecting decision outcomes

Each algorithm provides a systematic approach to handling uncertainty in decision-making.`,
    inputSchema: {
        type: "object",
        properties: {
            algorithm: {
                type: "string",
                enum: [
                    "mdp",
                    "mcts",
                    "bandit",
                    "bayesian",
                    "hmm"
                ]
            },
            problem: { type: "string" },
            parameters: {
                type: "object",
                additionalProperties: true
            },
            result: { type: "string" }
        },
        required: ["algorithm", "problem", "parameters"]
    }
}; 
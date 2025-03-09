import { ModelCategory } from '../interfaces/first-thought-advisor-data.js';

/**
 * Predefined categories of mental models
 */
export const modelCategories: ModelCategory[] = [
    {
        id: "analytical",
        name: "Analytical Models",
        description: "For breaking down complex problems into components",
        applicableGoals: ["analyze", "understand"],
        models: ["first_principles", "systems_thinking", "scientific_method"]
    },
    {
        id: "decision",
        name: "Decision-Making Models",
        description: "For choosing between alternatives",
        applicableGoals: ["decide", "evaluate", "prioritize"],
        models: ["decision_tree", "bayes_theorem", "opportunity_cost"]
    },
    {
        id: "creative",
        name: "Creative Thinking Models",
        description: "For generating innovative solutions",
        applicableGoals: ["innovate", "create"],
        models: ["lateral_thinking", "divergent_thinking", "thought_experiment"]
    },
    {
        id: "optimization",
        name: "Optimization Models",
        description: "For improving efficiency and effectiveness",
        applicableGoals: ["optimize", "improve"],
        models: ["pareto_principle", "sensitivity_analysis", "systems_thinking"]
    },
    {
        id: "debugging",
        name: "Debugging Models",
        description: "For finding and fixing problems",
        applicableGoals: ["debug", "fix", "troubleshoot"],
        models: ["rubber_duck", "error_propagation", "occams_razor"]
    },
    {
        id: "cognitive_bias",
        name: "Cognitive Bias Models",
        description: "For understanding and overcoming mental biases",
        applicableGoals: ["understand", "decide"],
        models: ["confirmation_bias", "sunk_cost", "loss_aversion"]
    },
    {
        id: "systems",
        name: "Systems Models",
        description: "For understanding complex interactions",
        applicableGoals: ["analyze", "understand", "optimize"],
        models: ["systems_thinking", "ecosystem", "catalysis"]
    },
    {
        id: "probabilistic",
        name: "Probabilistic Models",
        description: "For reasoning under uncertainty",
        applicableGoals: ["decide", "predict"],
        models: ["bayes_theorem", "normal_distribution", "regression_to_mean"]
    },
    {
        id: "stochastic",
        name: "Stochastic Algorithm Models",
        description: "For decision-making under uncertainty with randomness",
        applicableGoals: ["decide", "optimize", "predict"],
        models: ["mdp", "mcts", "bandit", "bayesian", "hmm"]
    }
];

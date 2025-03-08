export const MENTAL_MODEL_TOOL = {
    name: "mental_model",
    description: "A tool for applying structured mental models to problem-solving.",
    parameters: {
        type: "object",
        properties: {
            modelName: {
                type: "string",
                enum: [
                    "first_principles",
                    "opportunity_cost",
                    "error_propagation",
                    "rubber_duck",
                    "pareto_principle",
                    "occams_razor",
                    "regression_to_mean",
                    "confirmation_bias",
                    "normal_distribution",
                    "sensitivity_analysis",
                    "bayes_theorem",
                    "survivorship_bias",
                    "systems_thinking",
                    "thought_experiment",
                    "hanlons_razor",
                    "proximate_ultimate_causation",
                    "zero_sum_game",
                    "loss_aversion",
                    "sunk_cost",
                    "lateral_thinking",
                    "divergent_thinking",
                    "scientific_method",
                    "decision_tree",
                    "scenario_planning",
                    "simulation",
                    "catalysis",
                    "ecosystem"
                ],
                description: "The specific mental model to apply."
            },
            problem: {
                type: "string",
                description: "A clear, concise statement of the problem you want to analyze."
            }
        },
        required: ["modelName", "problem"]
    }
}; 
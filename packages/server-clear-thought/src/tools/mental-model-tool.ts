import { Tool } from "@modelcontextprotocol/sdk/types.js";

/**
 * Tool for applying structured mental models to problem-solving
 */
export const MENTAL_MODEL_TOOL: Tool = {
    name: "mentalmodel",
    description: `A tool for applying structured mental models to problem-solving.

This tool helps analyze problems from different perspectives using systematic mental models.
Use it for complex problems, when standard approaches fail, or when you need a fresh perspective.

Available models include first principles, systems thinking, Occam's razor, and more.

Usage: Select a model, define your problem, and the tool will apply the model's framework.
Example: { "modelName": "first_principles", "problem": "Our app is slow" }

See documentation for full list of models and detailed usage instructions.`,
    inputSchema: {
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
                description: "The specific mental model to apply. Choose the model that best fits your problem type and thinking approach. Each model provides a different analytical framework."
            },
            problem: {
                type: "string",
                description: "A clear, concise statement of the problem you want to analyze. Be specific enough to allow meaningful analysis but broad enough to capture the core issue."
            }
        },
        required: ["modelName", "problem"]
    }
}; 
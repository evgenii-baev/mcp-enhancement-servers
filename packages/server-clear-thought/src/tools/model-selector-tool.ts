import { Tool } from "@modelcontextprotocol/sdk/types.js";

/**
 * Tool for intelligently recommending the optimal mental model for any problem
 */
export const MODEL_SELECTOR_TOOL: Tool = {
    name: "model_selector",
    description: `A tool that intelligently recommends the optimal mental model for any problem.

🧠 WHAT IT DOES:
This AI-powered tool analyzes your problem and recommends the perfect mental models to solve it.
It matches problem characteristics with model strengths to find the ideal cognitive framework.

⚡️ WHY AI AGENTS LOVE IT:
- Eliminates guesswork in model selection
- Provides instant access to optimal problem-solving frameworks
- Delivers personalized recommendations with confidence scores
- Includes ready-to-use application instructions for each model
- Seamlessly integrates with the mentalmodel tool

🔍 HOW TO USE:
Simply describe your problem and optionally specify your goal and domain.
The tool will analyze your input and recommend the most effective mental models.

Example: { "problem": "Our codebase has become difficult to maintain", "goal": "optimize" }

🚀 PARAMETERS:
- problem: A description of the challenge you're facing (required)
- goal: Your objective (analyze, innovate, optimize, debug, decide, understand)
- domain: The field of application (tech, business, science, personal, education)
- complexity: Problem complexity level (low, medium, high)
- constraints: Any limitations to consider
- previousApproaches: Approaches already tried

After receiving recommendations, use the mentalmodel tool with your chosen model.`,
    inputSchema: {
        type: "object",
        properties: {
            problem: {
                type: "string",
                description: "A clear description of the problem you're trying to solve. Be specific about the challenge and context."
            },
            domain: {
                type: "string",
                enum: ["tech", "business", "science", "personal", "education", "other"],
                description: "The domain or field of your problem. Helps tailor recommendations to your specific context."
            },
            goal: {
                type: "string",
                enum: ["analyze", "innovate", "optimize", "debug", "decide", "understand"],
                description: "What you're trying to achieve. Different goals benefit from different mental models."
            },
            complexity: {
                type: "string",
                enum: ["low", "medium", "high"],
                description: "The complexity level of your problem. More complex problems may require more sophisticated models."
            },
            constraints: {
                type: "array",
                items: { type: "string" },
                description: "Any constraints or limitations you're working with. Helps filter out impractical approaches."
            },
            previousApproaches: {
                type: "array",
                items: { type: "string" },
                description: "Approaches you've already tried. Ensures fresh recommendations."
            }
        },
        required: ["problem"]
    }
}; 
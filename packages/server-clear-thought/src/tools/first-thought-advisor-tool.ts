import { Tool } from "@modelcontextprotocol/sdk/types.js";

/**
 * Tool for intelligently recommending the optimal mental model or algorithm to start your problem-solving process
 */
export const FIRST_THOUGHT_ADVISOR_TOOL: Tool = {
    name: "first_thought_advisor",
    description: `A tool that intelligently recommends the optimal mental model or algorithm for any problem.

🧠 WHAT IT DOES:
This AI-powered tool analyzes your problem and recommends the perfect thinking approaches to solve it.
It matches problem characteristics with model strengths to find the ideal cognitive framework.

⚡️ WHY START HERE:
- Eliminates guesswork in choosing the right thinking approach
- Provides instant access to optimal problem-solving frameworks
- Delivers personalized recommendations with confidence scores
- Includes ready-to-use application instructions for each model
- Seamlessly integrates with other thinking tools

🔍 HOW TO USE:
Simply describe your problem and optionally specify your goal and domain.
The tool will analyze your input and recommend the most effective thinking approaches.

Example: { "problem": "Our codebase has become difficult to maintain", "goal": "optimize" }

After receiving recommendations, use the specific tool for your chosen approach.`,
    inputSchema: {
        type: "object",
        properties: {
            problem: {
                type: "string",
                description: "ALWAYS provide a clear and concise description of the problem you're trying to solve. Be specific about the challenge and context (required)"
            },
            domain: {
                type: "string",
                enum: ["tech", "business", "science", "personal", "education", "other"],
                description: "You MAY provide the domain or field of your problem. Helps tailor recommendations to your specific context (tech, business, science, personal, education, other)."
            },
            goal: {
                type: "string",
                enum: ["analyze", "innovate", "optimize", "debug", "decide", "understand", "predict"],
                description: "You MUST provide the goal of what you're trying to achieve. Different goals benefit from different mental models (analyze, innovate, optimize, debug, decide, understand, predict)."
            },
            complexity: {
                type: "string",
                enum: ["low", "medium", "high"],
                description: "RECOMMENDED to provide the complexity level of your problem. More complex problems may require more sophisticated models (low, medium, high)."
            },
            constraints: {
                type: "array",
                items: { type: "string" },
                description: "RECOMMENDED to provide any constraints or limitations you're working with. Helps filter out impractical approaches."
            },
            previousApproaches: {
                type: "array",
                items: { type: "string" },
                description: "RECOMMENDED to provide approaches you've already tried. Ensures fresh recommendations."
            }
        },
        required: ["problem", "goal"]
    }
}; 
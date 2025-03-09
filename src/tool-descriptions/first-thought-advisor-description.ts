/**
 * Описание инструмента First Thought Advisor для IDE
 */

import { ToolDescription } from '../interfaces/tool-description.js';
import { createToolDescription } from '../utils/tool-description-utils.js';

/**
 * Описание инструмента First Thought Advisor
 */
export const FIRST_THOUGHT_ADVISOR_DESCRIPTION: ToolDescription = createToolDescription({
    name: "First Thought Advisor",
    purpose: "A tool that intelligently recommends the optimal mental model or algorithm for any problem.",
    whenToUse: [
        "When beginning to approach a complex problem",
        "When unsure which mental model or algorithm would be most effective",
        "When wanting to explore different problem-solving perspectives",
        "When teaching problem-solving approaches to others"
    ],
    capabilities: [
        {
            name: "get_thinking_approach",
            description: "Recommends a thinking approach, algorithm, or mental model suited for a specific problem",
            keyParameters: ["problem", "goal", "domain", "complexity", "constraints", "previousApproaches"]
        }
    ],
    exampleScenarios: [
        "Finding the right approach to optimize a slow-performing algorithm",
        "Determining how to break down a complex system architecture problem",
        "Selecting an appropriate mental model for a decision under uncertainty",
        "Recommending a search strategy for an NP-hard computational problem"
    ],
    bestPractices: [
        "Consider the problem's domain when recommending approaches",
        "Account for complexity and constraints in recommendations",
        "Suggest multiple approaches when appropriate, with reasoning",
        "Build upon previous approaches that partially worked"
    ],
    integration: {
        withAI: "AI assistants can use this tool as a meta-level advisor for their own reasoning process",
        examples: [
            "For a complex system design: 'I'll analyze this problem to determine the best mental model for designing this distributed system.'",
            "For an optimization problem: 'Let me find the most appropriate way to think about optimizing your database queries.'"
        ]
    },
    parameterDescriptions: {
        "problem": "The problem to analyze. Provide a clear, concise description of the challenge or task that needs a solution.",
        "goal": "The desired outcome or objective. What would a successful solution achieve?",
        "domain": "The field or context of the problem (e.g., software development, data analysis, etc.)",
        "complexity": "The estimated complexity level of the problem (e.g., simple, moderate, complex, very complex)",
        "constraints": "Any limitations or requirements that restrict possible solutions",
        "previousApproaches": "Methods that have already been tried, whether successful or not"
    },
    exampleUsage: {
        "problem": "Need to find the shortest path between nodes in a sparse graph with millions of nodes",
        "domain": "Algorithm design",
        "complexity": "High",
        "constraints": ["Memory limitations", "Must complete in near real-time"]
    }
}); 
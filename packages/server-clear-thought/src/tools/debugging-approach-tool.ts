import { Tool } from "@modelcontextprotocol/sdk/types.js";

/**
 * Tool for applying systematic debugging approaches to technical issues
 */
export const DEBUGGING_APPROACH_TOOL: Tool = {
    name: "debugging_approach",
    description: `A tool for applying systematic debugging approaches to technical issues.

This tool provides structured methodologies for identifying and resolving technical problems.
Use it for complex issues, when standard debugging fails, or when you need a systematic approach.

Available approaches:
- Binary Search: Narrow down problems by testing midpoints (e.g., find which commit broke the build)
- Reverse Engineering: Work backward from observed behavior
- Divide and Conquer: Break complex problems into manageable sub-problems
- Backtracking: Explore multiple solution paths
- Cause Elimination: Rule out potential causes systematically
- Program Slicing: Focus on code affecting specific variables

Usage: Select an approach, define your issue, and follow the structured steps.
Example: { "approachName": "binary_search", "issue": "Performance regression" }

See documentation for detailed usage instructions.`,
    inputSchema: {
        type: "object",
        properties: {
            approachName: {
                type: "string",
                enum: ["binary_search", "reverse_engineering", "divide_conquer", "backtracking", "cause_elimination", "program_slicing"],
                description: "The debugging approach to apply. Select based on your problem type: binary_search for finding a specific change, reverse_engineering for understanding unknown systems, divide_conquer for complex problems, backtracking for exploring multiple solutions, cause_elimination for multiple potential causes, program_slicing for data flow issues."
            },
            issue: {
                type: "string",
                description: "A detailed description of the technical issue you're facing. Include relevant context, error messages, and observed behavior to enable effective debugging."
            },
            findings: {
                type: "string",
                description: "Optional information discovered during your debugging process. Include any patterns, anomalies, or insights that might help identify the root cause."
            },
            steps: {
                type: "array",
                items: { type: "string" },
                description: "Optional list of steps you've already taken or plan to take in your debugging process. Each step should be a clear, actionable item."
            },
            resolution: {
                type: "string",
                description: "Optional solution or fix for the issue. Describe how you resolved or plan to resolve the problem based on your debugging findings."
            }
        },
        required: ["approachName", "issue"]
    }
}; 
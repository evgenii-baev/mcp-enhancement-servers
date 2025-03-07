import { Tool } from "@modelcontextprotocol/sdk/types.js";

/**
 * Tool for dynamic and reflective problem-solving through sequential thoughts
 */
export const SEQUENTIAL_THINKING_TOOL: Tool = {
    name: "sequentialthinking",
    description: `A tool for dynamic and reflective problem-solving through sequential thoughts.

This tool facilitates a flexible thinking process that mimics human cognition, allowing thoughts
to build upon, question, or revise previous insights as understanding deepens.

Key features:
- Dynamic adjustment of thought quantity as understanding evolves
- Ability to revise previous thoughts when new insights emerge
- Non-linear thinking with branching capabilities
- Progressive refinement of solutions through iterative thinking

Usage: Start with a problem statement, develop thoughts sequentially, revise when needed.
Example: { "thought": "App is slow due to database queries", "thoughtNumber": 1, "totalThoughts": 5, "nextThoughtNeeded": true }

Parameters include thought content, thought number, total thoughts estimate, revision flags, and branching options.
Set nextThoughtNeeded=false only when you've reached a satisfactory conclusion.`,
    inputSchema: {
        type: "object",
        properties: {
            thought: {
                type: "string",
                description: "Your current thinking step in detail. This can be an analysis, observation, hypothesis, revision of previous thinking, or a conclusion. Be specific and thorough to enable meaningful progression."
            },
            thoughtNumber: {
                type: "integer",
                minimum: 1,
                description: "The sequential number of this thought in your thinking process. Starts at 1 and increments with each new thought, including revisions and branches."
            },
            totalThoughts: {
                type: "integer",
                minimum: 1,
                description: "Your current estimate of how many thoughts will be needed to solve the problem. This can be adjusted up or down as your understanding evolves."
            },
            nextThoughtNeeded: {
                type: "boolean",
                description: "Whether another thought step is needed after this one. Set to false only when you've reached a satisfactory conclusion that fully addresses the original problem."
            },
            isRevision: {
                type: "boolean",
                description: "Whether this thought revises or corrects a previous thought. Set to true when you need to update earlier thinking based on new insights or information."
            },
            revisesThought: {
                type: "integer",
                minimum: 1,
                description: "If this is a revision (isRevision=true), specify which thought number is being revised or corrected. This creates a clear link between the original thought and its revision."
            },
            branchFromThought: {
                type: "integer",
                minimum: 1,
                description: "If this thought starts a new branch of thinking, specify which thought number it branches from. Use when exploring alternative approaches or perspectives."
            },
            branchId: {
                type: "string",
                description: "A unique identifier for this branch of thinking. Use a descriptive name that indicates the nature or purpose of this thinking branch."
            },
            needsMoreThoughts: {
                type: "boolean",
                description: "Indicates that more thoughts are needed even if you initially thought you were done. Set to true when you realize additional analysis is required."
            }
        },
        required: ["thought", "nextThoughtNeeded", "thoughtNumber", "totalThoughts"]
    }
}; 
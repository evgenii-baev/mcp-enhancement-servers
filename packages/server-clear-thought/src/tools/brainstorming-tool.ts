import { Tool } from "@modelcontextprotocol/sdk/types.js";

/**
 * Tool for facilitating structured brainstorming sessions
 */
export const BRAINSTORMING_TOOL: Tool = {
    name: "brainstorming",
    description: `A tool for facilitating structured brainstorming sessions.

This tool guides you through a systematic brainstorming process, from preparation to action planning,
helping generate, refine, evaluate, and select ideas in a structured way.

Key features:
- Six-phase process: preparation, ideation, clarification, evaluation, selection, action planning
- Support for collaborative ideation with multiple participants
- Idea categorization and voting mechanisms
- Persistent sessions for ongoing brainstorming`,
    inputSchema: {
        type: "object",
        properties: {
            sessionId: {
                type: "string",
                description: "Identifier for an existing brainstorming session. Use this to continue a previously started session, allowing for persistent brainstorming across multiple interactions."
            },
            topic: {
                type: "string",
                description: "The main subject or problem for brainstorming. Be specific enough to focus ideation but broad enough to allow creative solutions. Required when creating a new session."
            },
            phase: {
                type: "string",
                enum: ["preparation", "ideation", "clarification", "evaluation", "selection", "action_planning"],
                description: "Current phase of the brainstorming process. Progress through phases in sequence: preparation → ideation → clarification → evaluation → selection → action_planning."
            }
        }
    }
}; 
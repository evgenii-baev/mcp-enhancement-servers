#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
    Tool,
    McpError,
    ErrorCode,
} from "@modelcontextprotocol/sdk/types.js"
// Fixed chalk import for ESM
import chalk from "chalk"
import {
    MentalModel,
    getMentalModelById,
    getAllMentalModelIds,
    formatMentalModelOutput,
} from "./src/models/mental-models.js"
import { ServerBridge } from "./src/bridge/server-bridge"
import { ThoughtOrchestrator } from "./src/core/thought-orchestrator"
import { SequentialThinkingServer } from "./src/servers/sequential-thinking.js"
import { MentalModelOutput, modelItems } from "./src/models/mental-models.js"

// Data Interfaces
interface ThoughtData {
    thought: string
    thoughtNumber: number
    totalThoughts: number
    isRevision?: boolean
    revisesThought?: number
    branchFromThought?: number
    branchId?: string
    needsMoreThoughts?: boolean
    nextThoughtNeeded: boolean
}

interface MentalModelData {
    modelName: string
    problem: string
    steps: string[]
    reasoning: string
    conclusion: string
}

interface DebuggingApproachData {
    approachName: string
    issue: string
    steps: string[]
    findings: string
    resolution: string
}

// Server Classes
class MentalModelServer {
    private validateModelData(input: unknown): { modelName: string; problem: string } {
        const data = input as Record<string, unknown>

        if (!data.modelName || typeof data.modelName !== "string") {
            throw new Error("Invalid modelName: must be a string")
        }
        if (!data.problem || typeof data.problem !== "string") {
            throw new Error("Invalid problem: must be a string")
        }

        return {
            modelName: data.modelName,
            problem: data.problem,
        }
    }

    public processModel(input: unknown): {
        content: Array<{ type: string; text: string }>
        isError?: boolean
    } {
        try {
            const { modelName, problem } = this.validateModelData(input)
            const model = getMentalModelById(modelName)

            if (!model) {
                throw new Error(`Mental model '${modelName}' not found`)
            }

            // Create a copy of the model with the current problem
            const modelWithProblem: MentalModel = {
                ...model,
                definition: `Problem: ${problem}\n${model.definition}`,
            }

            const formattedOutput = formatMentalModelOutput(modelWithProblem)
            console.error(formattedOutput)

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(
                            {
                                modelName: model.name,
                                status: "success",
                                hasSteps: model.steps.length > 0,
                                problem,
                            },
                            null,
                            2
                        ),
                    },
                ],
            }
        } catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(
                            {
                                error: error instanceof Error ? error.message : String(error),
                                status: "failed",
                            },
                            null,
                            2
                        ),
                    },
                ],
                isError: true,
            }
        }
    }
}

class DebuggingApproachServer {
    private validateApproachData(input: unknown): DebuggingApproachData {
        const data = input as Record<string, unknown>

        if (!data.approachName || typeof data.approachName !== "string") {
            throw new Error("Invalid approachName: must be a string")
        }
        if (!data.issue || typeof data.issue !== "string") {
            throw new Error("Invalid issue: must be a string")
        }

        return {
            approachName: data.approachName,
            issue: data.issue,
            steps: Array.isArray(data.steps) ? data.steps.map(String) : [],
            findings: typeof data.findings === "string" ? data.findings : "",
            resolution: typeof data.resolution === "string" ? data.resolution : "",
        }
    }

    private formatApproachOutput(approachData: DebuggingApproachData): string {
        const { approachName, issue, steps, findings, resolution } = approachData
        const border = "─".repeat(Math.max(approachName.length + 25, issue.length + 4))

        return `
┌${border}┐
│ 🔍 Debugging Approach: ${approachName.padEnd(border.length - 21)} │
├${border}┤
│ Issue: ${issue.padEnd(border.length - 8)} │
├${border}┤
│ Steps:${" ".repeat(border.length - 7)} │
${steps.map((step) => `│ • ${step.padEnd(border.length - 4)} │`).join("\n")}
├${border}┤
│ Findings: ${findings.padEnd(border.length - 11)} │
├${border}┤
│ Resolution: ${resolution.padEnd(border.length - 12)} │
└${border}┘`
    }

    public processApproach(input: unknown): {
        content: Array<{ type: string; text: string }>
        isError?: boolean
    } {
        try {
            const validatedInput = this.validateApproachData(input)
            const formattedOutput = this.formatApproachOutput(validatedInput)
            console.error(formattedOutput)

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(
                            {
                                approachName: validatedInput.approachName,
                                status: "success",
                                hasSteps: validatedInput.steps.length > 0,
                                hasResolution: !!validatedInput.resolution,
                            },
                            null,
                            2
                        ),
                    },
                ],
            }
        } catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(
                            {
                                error: error instanceof Error ? error.message : String(error),
                                status: "failed",
                            },
                            null,
                            2
                        ),
                    },
                ],
                isError: true,
            }
        }
    }
}

class SequentialThinkingServer {
    private thoughtHistory: ThoughtData[] = []
    private branches: Record<string, ThoughtData[]> = {}

    private validateThoughtData(input: unknown): ThoughtData {
        const data = input as Record<string, unknown>

        if (!data.thought || typeof data.thought !== "string") {
            throw new Error("Invalid thought: must be a string")
        }
        if (!data.thoughtNumber || typeof data.thoughtNumber !== "number") {
            throw new Error("Invalid thoughtNumber: must be a number")
        }
        if (!data.totalThoughts || typeof data.totalThoughts !== "number") {
            throw new Error("Invalid totalThoughts: must be a number")
        }
        if (typeof data.nextThoughtNeeded !== "boolean") {
            throw new Error("Invalid nextThoughtNeeded: must be a boolean")
        }

        return {
            thought: data.thought,
            thoughtNumber: data.thoughtNumber,
            totalThoughts: data.totalThoughts,
            nextThoughtNeeded: data.nextThoughtNeeded,
            isRevision: data.isRevision as boolean | undefined,
            revisesThought: data.revisesThought as number | undefined,
            branchFromThought: data.branchFromThought as number | undefined,
            branchId: data.branchId as string | undefined,
            needsMoreThoughts: data.needsMoreThoughts as boolean | undefined,
        }
    }

    private formatThought(thoughtData: ThoughtData): string {
        const {
            thoughtNumber,
            totalThoughts,
            thought,
            isRevision,
            revisesThought,
            branchFromThought,
            branchId,
        } = thoughtData

        let prefix = ""
        let context = ""

        if (isRevision) {
            prefix = chalk.yellow("🔄 Revision")
            context = ` (revising thought ${revisesThought})`
        } else if (branchFromThought) {
            prefix = chalk.green("🌿 Branch")
            context = ` (from thought ${branchFromThought}, ID: ${branchId})`
        } else {
            prefix = chalk.blue("💭 Thought")
            context = ""
        }

        const header = `${prefix} ${thoughtNumber}/${totalThoughts}${context}`
        const border = "─".repeat(Math.max(header.length, thought.length) + 4)

        return `
┌${border}┐
│ ${header} │
├${border}┤
│ ${thought.padEnd(border.length - 2)} │
└${border}┘`
    }

    public processThought(input: unknown): {
        content: Array<{ type: string; text: string }>
        isError?: boolean
    } {
        try {
            const validatedInput = this.validateThoughtData(input)

            if (validatedInput.thoughtNumber > validatedInput.totalThoughts) {
                validatedInput.totalThoughts = validatedInput.thoughtNumber
            }

            this.thoughtHistory.push(validatedInput)

            if (validatedInput.branchFromThought && validatedInput.branchId) {
                if (!this.branches[validatedInput.branchId]) {
                    this.branches[validatedInput.branchId] = []
                }
                this.branches[validatedInput.branchId].push(validatedInput)
            }

            const formattedThought = this.formatThought(validatedInput)
            console.error(formattedThought)

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(
                            {
                                thoughtNumber: validatedInput.thoughtNumber,
                                totalThoughts: validatedInput.totalThoughts,
                                nextThoughtNeeded: validatedInput.nextThoughtNeeded,
                                branches: Object.keys(this.branches),
                                thoughtHistoryLength: this.thoughtHistory.length,
                            },
                            null,
                            2
                        ),
                    },
                ],
            }
        } catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(
                            {
                                error: error instanceof Error ? error.message : String(error),
                                status: "failed",
                            },
                            null,
                            2
                        ),
                    },
                ],
                isError: true,
            }
        }
    }
}

// Tool Definitions
const MENTAL_MODEL_TOOL: Tool = {
    name: "mentalmodel",
    description: `A comprehensive tool for applying structured mental models to problem-solving.

WHAT IT DOES:
This tool applies systematic mental models to analyze problems from different perspectives,
helping to break down complex issues into manageable components and revealing insights
that might otherwise be missed.

WHEN TO USE:
- When facing complex or ambiguous problems
- When standard approaches aren't yielding results
- When you need a fresh perspective on a problem
- When you want to ensure thorough analysis of all aspects
- When you need to overcome cognitive biases
- When communicating complex reasoning to others

AVAILABLE MODELS:
${getAllMentalModelIds()
            .map((id) => {
                const model = getMentalModelById(id)
                return `- ${model?.name}: ${model?.definition}`
            })
            .join("\n")}

HOW TO USE:
1. Select the most appropriate mental model for your problem
2. Clearly define your problem statement
3. The tool will apply the model's framework to your problem
4. Review the structured analysis and insights
5. Apply the conclusions to your original problem

EXAMPLES:
• Input: { "modelName": "first_principles", "problem": "Our application is too slow" }
  Output: A breakdown of the performance issue into fundamental components, questioning
  assumptions about what causes slowness, and building a solution from basic truths.

• Input: { "modelName": "systems_thinking", "problem": "Users are abandoning our platform" }
  Output: Analysis of the platform as an interconnected system, identifying feedback loops,
  dependencies, and emergent behaviors that might be causing user attrition.

• Input: { "modelName": "occams_razor", "problem": "Our CI pipeline fails intermittently" }
  Output: Evaluation of possible explanations, prioritizing the simplest ones that adequately
  explain the observed behavior before considering more complex theories.

INTERPRETING RESULTS:
The response includes the model name, problem statement, structured analysis steps,
and conclusions. Use these insights to guide your approach to the original problem.

COMMON ERRORS:
- Selecting an inappropriate model for your problem type
- Providing a vague or overly broad problem statement
- Not following through with the model's recommended steps

RELATED TOOLS:
- Use sequentialthinking after applying a mental model to work through the solution step by step
- Use debuggingapproach for specific technical issues once you've identified the general approach

Each model provides a systematic approach to breaking down and solving problems.`,
    inputSchema: {
        type: "object",
        properties: {
            modelName: {
                type: "string",
                enum: getAllMentalModelIds(),
            },
            problem: { type: "string" },
        },
        required: ["modelName", "problem"],
    },
}

const DEBUGGING_APPROACH_TOOL: Tool = {
    name: "debuggingapproach",
    description: `A powerful tool for applying systematic debugging approaches to solve technical issues.

WHAT IT DOES:
This tool provides structured methodologies for identifying, isolating, and resolving
technical problems by applying proven debugging strategies tailored to different types of issues.

WHEN TO USE:
- When facing complex technical problems
- When standard debugging isn't yielding results
- When you need a systematic approach to troubleshooting
- When you want to document your debugging process
- When teaching others about structured problem-solving

AVAILABLE APPROACHES:

1. Binary Search:
   A divide-and-conquer approach that systematically narrows down the problem space
   by testing the midpoint and eliminating half the remaining possibilities each time.
   Best for: Linear problems with clear test criteria (e.g., finding which commit introduced a bug).

2. Reverse Engineering:
   Working backward from observed behavior to understand underlying mechanisms.
   Best for: Understanding undocumented systems or unexpected behaviors.

3. Divide and Conquer:
   Breaking a complex problem into smaller, more manageable sub-problems.
   Best for: Large, complex systems with multiple potential failure points.

4. Backtracking:
   Exploring multiple solution paths and backing out when a path proves unsuccessful.
   Best for: Problems with multiple possible solutions where some paths may be dead ends.

5. Cause Elimination:
   Systematically identifying and ruling out potential causes until the actual cause is found.
   Best for: Issues with multiple potential causes that can be individually tested.

6. Program Slicing:
   Isolating the specific parts of code that could affect a particular variable or behavior.
   Best for: Understanding data flow and dependencies in complex codebases.

HOW TO USE:
1. Select the most appropriate debugging approach for your issue
2. Clearly define the problem you're experiencing
3. Follow the structured steps provided by the approach
4. Document your findings at each step
5. Apply the resolution based on your analysis

EXAMPLES:
• Input: { "approachName": "binary_search", "issue": "Performance regression in recent release" }
  Output: A structured approach to identify which change caused the regression by testing
  midpoints in your commit history until the problematic change is isolated.

• Input: { "approachName": "cause_elimination", "issue": "API requests fail intermittently" }
  Output: A systematic process to identify potential causes (network, server load, authentication,
  rate limiting) and methodically rule them out until the actual cause is found.

• Input: { "approachName": "program_slicing", "issue": "Unexpected value in user profile" }
  Output: Analysis focusing only on code paths that could affect the specific profile field,
  ignoring unrelated parts of the codebase to efficiently isolate the issue.

INTERPRETING RESULTS:
The response includes the approach name, issue description, structured steps to follow,
key findings from the process, and recommended resolution.

COMMON ERRORS:
- Selecting an inappropriate approach for your issue type
- Providing insufficient detail about the issue
- Not following through with all recommended steps
- Jumping to conclusions before completing the process

RELATED TOOLS:
- Use mentalmodel first to understand the general problem space before selecting a debugging approach
- Use sequentialthinking to document your debugging process step by step

Each approach provides a structured method for identifying and resolving issues.`,
    inputSchema: {
        type: "object",
        properties: {
            approachName: {
                type: "string",
                enum: [
                    "binary_search",
                    "reverse_engineering",
                    "divide_conquer",
                    "backtracking",
                    "cause_elimination",
                    "program_slicing",
                ],
            },
            issue: { type: "string" },
            steps: {
                type: "array",
                items: { type: "string" },
            },
            findings: { type: "string" },
            resolution: { type: "string" },
        },
        required: ["approachName", "issue"],
    },
}

const SEQUENTIAL_THINKING_TOOL: Tool = {
    name: "sequentialthinking",
    description: `A sophisticated tool for dynamic and reflective problem-solving through sequential thoughts.

WHAT IT DOES:
This tool facilitates a flexible thinking process that mimics human cognition by allowing
thoughts to build upon, question, or revise previous insights as understanding deepens.
It enables non-linear exploration of problem spaces with the ability to branch, revise,
and extend thinking paths as needed.

WHEN TO USE:
- Breaking down complex problems into manageable steps
- Planning and design processes that require flexibility for revision
- Analysis that might need course correction as new information emerges
- Problems where the full scope might not be clear initially
- Problems that require a multi-step solution with dependencies between steps
- Tasks that need to maintain context over multiple reasoning steps
- Situations where irrelevant information needs to be filtered out
- When you need to document your reasoning process for others

KEY FEATURES:
- Dynamic adjustment of thought quantity as understanding evolves
- Ability to question or revise previous thoughts when new insights emerge
- Flexible extension of thinking even after reaching what seemed like the end
- Expression of uncertainty and exploration of alternative approaches
- Non-linear thinking with branching and backtracking capabilities
- Hypothesis generation and verification through structured reasoning
- Progressive refinement of solutions through iterative thinking

HOW TO USE:
1. Start with an initial problem statement and estimate of needed thoughts
2. Develop each thought sequentially, building on previous insights
3. When appropriate, revise previous thoughts or branch into new directions
4. Continue until you reach a satisfactory conclusion
5. Provide a final thought that synthesizes your reasoning and solution

PARAMETERS EXPLAINED:
- thought: Your current thinking step, which can include:
  * Regular analytical steps
  * Revisions of previous thoughts
  * Questions about previous decisions
  * Realizations about needing more analysis
  * Changes in approach
  * Hypothesis generation
  * Hypothesis verification
- nextThoughtNeeded: True if you need more thinking, even if at what seemed like the end
- thoughtNumber: Current number in sequence (can go beyond initial total if needed)
- totalThoughts: Current estimate of thoughts needed (can be adjusted up/down)
- isRevision: A boolean indicating if this thought revises previous thinking
- revisesThought: If isRevision is true, which thought number is being reconsidered
- branchFromThought: If branching, which thought number is the branching point
- branchId: Identifier for the current branch (if any)
- needsMoreThoughts: If reaching end but realizing more thoughts needed

EXAMPLES:
• Input: { 
  "thought": "The application seems slow because of database queries", 
  "thoughtNumber": 1, 
  "totalThoughts": 5, 
  "nextThoughtNeeded": true 
}
  Output: A structured response acknowledging the thought and providing guidance for the next step.

• Input: { 
  "thought": "After profiling, I see that the slowdown is actually in the image processing", 
  "thoughtNumber": 2, 
  "totalThoughts": 5, 
  "isRevision": true, 
  "revisesThought": 1,
  "nextThoughtNeeded": true 
}
  Output: A response that acknowledges the revision of the previous thought and maintains the context.

• Input: { 
  "thought": "Let's explore an alternative approach using caching", 
  "thoughtNumber": 3, 
  "totalThoughts": 5, 
  "branchFromThought": 2,
  "branchId": "caching-solution",
  "nextThoughtNeeded": true 
}
  Output: A response that acknowledges the new branch of thinking and helps explore this direction.

INTERPRETING RESULTS:
The response will indicate whether another thought is needed and may suggest directions
for subsequent thinking steps. It maintains the context of your thought process.

COMMON ERRORS:
- Not providing sufficient detail in each thought
- Setting nextThoughtNeeded=false prematurely
- Not revising thoughts when new information contradicts earlier assumptions
- Failing to adjust totalThoughts when more steps are clearly needed
- Not properly marking revisions or branches when changing direction

RELATED TOOLS:
- Use mentalmodel first to select an appropriate mental framework for your problem
- Use debuggingapproach for specific technical issues that need structured troubleshooting

BEST PRACTICES:
1. Start with an initial estimate of needed thoughts, but be ready to adjust
2. Feel free to question or revise previous thoughts when appropriate
3. Don't hesitate to add more thoughts if needed, even at the "end"
4. Express uncertainty when present rather than making unfounded assertions
5. Mark thoughts that revise previous thinking or branch into new paths
6. Ignore information that is irrelevant to the current step
7. Generate a solution hypothesis when appropriate
8. Verify the hypothesis based on the Chain of Thought steps
9. Repeat the process until satisfied with the solution
10. Provide a single, ideally correct answer as the final output
11. Only set nextThoughtNeeded to false when truly done and a satisfactory answer is reached`,
    inputSchema: {
        type: "object",
        properties: {
            thought: {
                type: "string",
                description: "Your current thinking step",
            },
            nextThoughtNeeded: {
                type: "boolean",
                description: "Whether another thought step is needed",
            },
            thoughtNumber: {
                type: "integer",
                description: "Current thought number",
                minimum: 1,
            },
            totalThoughts: {
                type: "integer",
                description: "Estimated total thoughts needed",
                minimum: 1,
            },
            isRevision: {
                type: "boolean",
                description: "Whether this revises previous thinking",
            },
            revisesThought: {
                type: "integer",
                description: "Which thought is being reconsidered",
                minimum: 1,
            },
            branchFromThought: {
                type: "integer",
                description: "Branching point thought number",
                minimum: 1,
            },
            branchId: {
                type: "string",
                description: "Branch identifier",
            },
            needsMoreThoughts: {
                type: "boolean",
                description: "If more thoughts are needed",
            },
        },
        required: ["thought", "nextThoughtNeeded", "thoughtNumber", "totalThoughts"],
    },
}

// Server Instances
const modelServer = new MentalModelServer()
const debuggingServer = new DebuggingApproachServer()
const thinkingServer = new SequentialThinkingServer()

const server = new Server(
    {
        name: "sequential-thinking-server",
        version: "0.2.0",
    },
    {
        capabilities: {
            tools: {
                sequentialthinking: SEQUENTIAL_THINKING_TOOL,
                mentalmodel: MENTAL_MODEL_TOOL,
                debuggingapproach: DEBUGGING_APPROACH_TOOL,
            },
        },
    }
)

// Request Handlers
server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [SEQUENTIAL_THINKING_TOOL, MENTAL_MODEL_TOOL, DEBUGGING_APPROACH_TOOL],
}))

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, params } = request
    try {
        switch (name) {
            case "mental_model":
                return modelServer.processModel(params)
            case "debugging_approach":
                return debuggingServer.processApproach(params)
            case "sequential_thinking":
                return thinkingServer.processThought(params)
            case "brainstorming":
                return brainstormingServer.processBrainstorming(params)
            case "first_thought_advisor":
                return firstThoughtAdvisorServer.processFirstThoughtAdvice(params)
            case "stochastic_algorithm":
                return stochasticAlgorithmServer.processAlgorithm(params)
            case "feature_analyzer":
                const bridge = new ServerBridge(new ThoughtOrchestrator());
                return bridge.handleFeatureAnalyzerRequest(params);
            default:
                throw new McpError(
                    ErrorCode.MethodNotFound,
                    `Unknown tool: ${name}`
                )
        }
    } catch (e) {
        throw e
    }
})

async function runServer() {
    const transport = new StdioServerTransport()
    await server.connect(transport)
    console.error("Sequential Thinking MCP Server running on stdio")
}

runServer().catch((error) => {
    console.error("Fatal error running server:", error)
    process.exit(1)
})

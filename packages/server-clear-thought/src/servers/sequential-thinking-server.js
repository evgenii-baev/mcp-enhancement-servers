import chalk from "chalk";
/**
 * Server for processing sequential thinking requests
 */
export class SequentialThinkingServer {
    constructor() {
        this.thoughtHistory = [];
        this.branches = {};
    }
    /**
     * Validates the input data for a sequential thinking request
     * @param input The input data to validate
     * @returns The validated thought data
     * @throws Error if the input is invalid
     */
    validateThoughtData(input) {
        const data = input;
        if (!data.thought || typeof data.thought !== "string") {
            throw new Error("Invalid thought: must be a string");
        }
        if (!data.thoughtNumber || typeof data.thoughtNumber !== "number") {
            throw new Error("Invalid thoughtNumber: must be a number");
        }
        if (!data.totalThoughts || typeof data.totalThoughts !== "number") {
            throw new Error("Invalid totalThoughts: must be a number");
        }
        if (typeof data.nextThoughtNeeded !== "boolean") {
            throw new Error("Invalid nextThoughtNeeded: must be a boolean");
        }
        return {
            thought: data.thought,
            thoughtNumber: data.thoughtNumber,
            totalThoughts: data.totalThoughts,
            nextThoughtNeeded: data.nextThoughtNeeded,
            isRevision: data.isRevision,
            revisesThought: data.revisesThought,
            branchFromThought: data.branchFromThought,
            branchId: data.branchId,
            needsMoreThoughts: data.needsMoreThoughts,
        };
    }
    /**
     * Formats the thought output
     * @param thoughtData The thought data to format
     * @returns The formatted output
     */
    formatThought(thoughtData) {
        const { thoughtNumber, totalThoughts, thought, isRevision, revisesThought, branchFromThought, branchId, } = thoughtData;
        let prefix = "";
        let context = "";
        if (isRevision) {
            prefix = chalk.yellow("🔄 Revision");
            context = ` (revising thought ${revisesThought})`;
        }
        else if (branchFromThought) {
            prefix = chalk.green("🌿 Branch");
            context = ` (from thought ${branchFromThought}, ID: ${branchId})`;
        }
        else {
            prefix = chalk.blue("💭 Thought");
            context = "";
        }
        const header = `${prefix} ${thoughtNumber}/${totalThoughts}${context}`;
        const border = "─".repeat(Math.max(header.length, thought.length) + 4);
        return `
┌${border}┐
│ ${header} │
├${border}┤
│ ${thought.padEnd(border.length - 2)} │
└${border}┘`;
    }
    /**
     * Processes a sequential thinking request
     * @param input The input data for the request
     * @returns The response content
     */
    processThought(input) {
        try {
            const validatedInput = this.validateThoughtData(input);
            if (validatedInput.thoughtNumber > validatedInput.totalThoughts) {
                validatedInput.totalThoughts = validatedInput.thoughtNumber;
            }
            this.thoughtHistory.push(validatedInput);
            if (validatedInput.branchFromThought && validatedInput.branchId) {
                if (!this.branches[validatedInput.branchId]) {
                    this.branches[validatedInput.branchId] = [];
                }
                this.branches[validatedInput.branchId].push(validatedInput);
            }
            const formattedThought = this.formatThought(validatedInput);
            console.error(formattedThought);
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            thoughtNumber: validatedInput.thoughtNumber,
                            totalThoughts: validatedInput.totalThoughts,
                            nextThoughtNeeded: validatedInput.nextThoughtNeeded,
                            branches: Object.keys(this.branches),
                            thoughtHistoryLength: this.thoughtHistory.length,
                        }, null, 2),
                    },
                ],
            };
        }
        catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            error: error instanceof Error ? error.message : String(error),
                            status: "failed",
                        }, null, 2),
                    },
                ],
                isError: true,
            };
        }
    }
}

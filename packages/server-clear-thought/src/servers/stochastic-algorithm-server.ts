import { StochasticData, AlgorithmParameters } from '../interfaces/stochastic-algorithm-data.js';

/**
 * Server for applying stochastic algorithms to decision-making problems
 */
export class StochasticAlgorithmServer {
    /**
     * Validate input data for stochastic algorithm
     * @param input - Raw input data
     * @returns Validated stochastic data
     */
    private validateStochasticData(input: unknown): StochasticData {
        const data = input as Record<string, unknown>;

        if (!data.algorithm || typeof data.algorithm !== 'string') {
            throw new Error('Invalid algorithm: must be a string');
        }
        if (!data.problem || typeof data.problem !== 'string') {
            throw new Error('Invalid problem: must be a string');
        }
        if (!data.parameters || typeof data.parameters !== 'object') {
            throw new Error('Invalid parameters: must be an object');
        }

        return {
            algorithm: data.algorithm,
            problem: data.problem,
            parameters: data.parameters as Record<string, unknown>,
            result: typeof data.result === 'string' ? data.result : undefined
        };
    }

    /**
     * Format output for display
     * @param data - Stochastic data
     * @returns Formatted string output
     */
    private formatOutput(data: StochasticData): string {
        const { algorithm, problem, parameters, result } = data;
        const border = '─'.repeat(Math.max(algorithm.length + 20, problem.length + 4));

        let output = `
┌${border}┐
│ 🎲 Algorithm: ${algorithm.padEnd(border.length - 13)} │
├${border}┤
│ Problem: ${problem.padEnd(border.length - 10)} │
├${border}┤
│ Parameters:${' '.repeat(border.length - 12)} │`;

        // Format parameters
        for (const [key, value] of Object.entries(parameters)) {
            output += `\n│ • ${key}: ${String(value).padEnd(border.length - key.length - 4)} │`;
        }

        if (result) {
            output += `\n├${border}┤
│ Result: ${result.padEnd(border.length - 9)} │`;
        }

        output += `\n└${border}┘`;
        return output;
    }

    /**
     * Generate one-line summary for MDP algorithm
     * @param params - Algorithm parameters
     * @returns Summary string
     */
    private mdpOneLineSummary(params: AlgorithmParameters): string {
        return `Optimized policy over ${params.states || 'N'} states with discount factor ${params.gamma || 0.9}`;
    }

    /**
     * Generate one-line summary for MCTS algorithm
     * @param params - Algorithm parameters
     * @returns Summary string
     */
    private mctsOneLineSummary(params: AlgorithmParameters): string {
        return `Explored ${params.simulations || 1000} paths with exploration constant ${params.explorationConstant || 1.4}`;
    }

    /**
     * Generate one-line summary for Bandit algorithm
     * @param params - Algorithm parameters
     * @returns Summary string
     */
    private banditOneLineSummary(params: AlgorithmParameters): string {
        return `Selected optimal arm with ${params.strategy || 'epsilon-greedy'} strategy (ε=${params.epsilon || 0.1})`;
    }

    /**
     * Generate one-line summary for Bayesian Optimization algorithm
     * @param params - Algorithm parameters
     * @returns Summary string
     */
    private bayesianOneLineSummary(params: AlgorithmParameters): string {
        return `Optimized objective with ${params.acquisitionFunction || 'expected improvement'} acquisition`;
    }

    /**
     * Generate one-line summary for HMM algorithm
     * @param params - Algorithm parameters
     * @returns Summary string
     */
    private hmmOneLineSummary(params: AlgorithmParameters): string {
        return `Inferred hidden states using ${params.algorithm || 'forward-backward'} algorithm`;
    }

    /**
     * Process stochastic algorithm request
     * @param input - Raw input data
     * @returns Response object
     */
    public processAlgorithm(input: unknown): {
        content: Array<{ type: string; text: string }>;
        isError?: boolean;
    } {
        try {
            const validatedInput = this.validateStochasticData(input);
            const formattedOutput = this.formatOutput(validatedInput);
            console.error(formattedOutput);

            let summary = '';
            switch (validatedInput.algorithm) {
                case 'mdp':
                    summary = this.mdpOneLineSummary(validatedInput.parameters);
                    break;
                case 'mcts':
                    summary = this.mctsOneLineSummary(validatedInput.parameters);
                    break;
                case 'bandit':
                    summary = this.banditOneLineSummary(validatedInput.parameters);
                    break;
                case 'bayesian':
                    summary = this.bayesianOneLineSummary(validatedInput.parameters);
                    break;
                case 'hmm':
                    summary = this.hmmOneLineSummary(validatedInput.parameters);
                    break;
            }

            return {
                content: [{
                    type: "text",
                    text: JSON.stringify({
                        algorithm: validatedInput.algorithm,
                        status: 'success',
                        summary,
                        hasResult: !!validatedInput.result
                    }, null, 2)
                }]
            };
        } catch (error) {
            return {
                content: [{
                    type: "text",
                    text: JSON.stringify({
                        error: error instanceof Error ? error.message : String(error),
                        status: 'failed'
                    }, null, 2)
                }],
                isError: true
            };
        }
    }
} 
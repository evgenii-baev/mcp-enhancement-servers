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
│ 🎲 Stochastic Algorithm: ${algorithm.padEnd(border.length - 25)} │
├${border}┤
│ Problem: ${problem.padEnd(border.length - 10)} │
├${border}┤
│ Parameters:${' '.repeat(border.length - 13)} │
`;

        // Format parameters
        Object.entries(parameters).forEach(([key, value]) => {
            const valueStr = JSON.stringify(value);
            output += `│ • ${key}: ${valueStr.padEnd(border.length - key.length - 5)} │\n`;
        });

        if (result) {
            output += `├${border}┤\n`;
            output += `│ Result: ${result.padEnd(border.length - 9)} │\n`;
        }

        output += `└${border}┘`;
        return output;
    }

    /**
     * Generate one-line summary for MDP algorithm
     * @param params - Algorithm parameters
     * @returns Summary string
     */
    private mdpOneLineSummary(params: AlgorithmParameters): string {
        return `Markov Decision Process with ${params.states || 'unknown'} states and ${params.actions || 'unknown'} actions`;
    }

    /**
     * Generate one-line summary for MCTS algorithm
     * @param params - Algorithm parameters
     * @returns Summary string
     */
    private mctsOneLineSummary(params: AlgorithmParameters): string {
        return `Monte Carlo Tree Search with ${params.iterations || 'default'} iterations and ${params.exploration || 'default'} exploration factor`;
    }

    /**
     * Generate one-line summary for Bandit algorithm
     * @param params - Algorithm parameters
     * @returns Summary string
     */
    private banditOneLineSummary(params: AlgorithmParameters): string {
        return `Multi-Armed Bandit with ${params.arms || 'unknown'} arms and ${params.strategy || 'default'} strategy`;
    }

    /**
     * Generate one-line summary for Bayesian Optimization algorithm
     * @param params - Algorithm parameters
     * @returns Summary string
     */
    private bayesianOneLineSummary(params: AlgorithmParameters): string {
        return `Bayesian Optimization with ${params.iterations || 'default'} iterations and ${params.kernel || 'default'} kernel`;
    }

    /**
     * Generate one-line summary for HMM algorithm
     * @param params - Algorithm parameters
     * @returns Summary string
     */
    private hmmOneLineSummary(params: AlgorithmParameters): string {
        return `Hidden Markov Model with ${params.states || 'unknown'} hidden states and ${params.observations || 'unknown'} observations`;
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
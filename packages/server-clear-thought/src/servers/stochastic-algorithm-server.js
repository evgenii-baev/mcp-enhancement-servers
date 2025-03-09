import { StochasticAlgorithms } from '../interfaces/stochastic-algorithm-data.js';

/**
 * Server for applying stochastic algorithms to decision-making problems
 */
export class StochasticAlgorithmServer {
    /**
     * Validate input data for stochastic algorithm
     * @param {unknown} input - Raw input data
     * @returns {Object} Validated stochastic data
     */
    validateStochasticData(input) {
        const data = input || {};

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
            parameters: data.parameters,
            result: typeof data.result === 'string' ? data.result : undefined
        };
    }

    /**
     * Format output for display
     * @param {Object} data - Stochastic data
     * @returns {string} Formatted string output
     */
    formatOutput(data) {
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
     * @param {Object} params - Algorithm parameters
     * @returns {string} Summary string
     */
    mdpOneLineSummary(params) {
        return `Markov Decision Process with ${params.states || 'unknown'} states and ${params.actions || 'unknown'} actions`;
    }

    /**
     * Generate one-line summary for MCTS algorithm
     * @param {Object} params - Algorithm parameters
     * @returns {string} Summary string
     */
    mctsOneLineSummary(params) {
        return `Monte Carlo Tree Search with ${params.iterations || 'default'} iterations and ${params.explorationFactor || 'default'} exploration factor`;
    }

    /**
     * Generate one-line summary for Bandit algorithm
     * @param {Object} params - Algorithm parameters
     * @returns {string} Summary string
     */
    banditOneLineSummary(params) {
        return `Multi-Armed Bandit with ${params.arms || 'unknown'} arms and ${params.strategy || 'default'} strategy`;
    }

    /**
     * Generate one-line summary for Bayesian Optimization algorithm
     * @param {Object} params - Algorithm parameters
     * @returns {string} Summary string
     */
    bayesianOneLineSummary(params) {
        return `Bayesian Optimization with ${params.iterations || 'default'} iterations and ${params.kernel || 'default'} kernel`;
    }

    /**
     * Generate one-line summary for HMM algorithm
     * @param {Object} params - Algorithm parameters
     * @returns {string} Summary string
     */
    hmmOneLineSummary(params) {
        return `Hidden Markov Model with ${params.states || 'unknown'} hidden states and ${params.observations || 'unknown'} observations`;
    }

    /**
     * Process stochastic algorithm request
     * @param {unknown} input - Raw input data
     * @returns {Object} Response object
     */
    processAlgorithm(input) {
        try {
            const validatedInput = this.validateStochasticData(input);
            const formattedOutput = this.formatOutput(validatedInput);
            console.error(formattedOutput);

            let summary = '';
            switch (validatedInput.algorithm) {
                case StochasticAlgorithms.MDP:
                    summary = this.mdpOneLineSummary(validatedInput.parameters);
                    break;
                case StochasticAlgorithms.MCTS:
                    summary = this.mctsOneLineSummary(validatedInput.parameters);
                    break;
                case StochasticAlgorithms.BANDIT:
                    summary = this.banditOneLineSummary(validatedInput.parameters);
                    break;
                case StochasticAlgorithms.BAYESIAN:
                    summary = this.bayesianOneLineSummary(validatedInput.parameters);
                    break;
                case StochasticAlgorithms.HMM:
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
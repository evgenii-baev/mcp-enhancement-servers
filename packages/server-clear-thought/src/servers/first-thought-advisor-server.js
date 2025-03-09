/**
 * First Thought Advisor Server
 * Provides intelligent recommendations for optimal mental models or algorithms 
 * for any problem based on the initial understanding
 */

/**
 * Interface for first thought advisor data
 * @typedef {Object} FirstThoughtData
 * @property {string} problem - The problem statement
 * @property {string} [domain] - Optional domain of the problem
 * @property {string} [complexity] - Optional complexity assessment
 * @property {string[]} [constraints] - Optional array of constraints
 * @property {string[]} [previousApproaches] - Optional array of previously tried approaches
 * @property {string} [goal] - Optional explicit goal statement
 */

/**
 * Server for providing intelligent first thought recommendations
 */
export class FirstThoughtAdvisorServer {
    /**
     * Validate input data for first thought advisor
     * @param {unknown} input - Raw input data
     * @returns {FirstThoughtData} Validated first thought data
     */
    validateFirstThoughtData(input) {
        const data = input || {};

        if (!data.problem || typeof data.problem !== 'string') {
            throw new Error('Invalid problem: must be a non-empty string');
        }

        return {
            problem: data.problem,
            domain: typeof data.domain === 'string' ? data.domain : undefined,
            complexity: typeof data.complexity === 'string' ? data.complexity : undefined,
            constraints: Array.isArray(data.constraints) ? data.constraints : undefined,
            previousApproaches: Array.isArray(data.previousApproaches) ? data.previousApproaches : undefined,
            goal: typeof data.goal === 'string' ? data.goal : undefined
        };
    }

    /**
     * Format output for display
     * @param {FirstThoughtData} data - First thought data
     * @returns {string} Formatted string output
     */
    formatOutput(data) {
        const { problem, domain, complexity, constraints, previousApproaches, goal } = data;

        // Calculate border width based on the longest content
        const longestLine = Math.max(
            problem.length,
            domain ? domain.length : 0,
            complexity ? complexity.length : 0,
            goal ? goal.length : 0,
            constraints && constraints.length > 0 ? Math.max(...constraints.map(c => c.length)) : 0,
            previousApproaches && previousApproaches.length > 0 ? Math.max(...previousApproaches.map(a => a.length)) : 0,
            30 // Minimum width
        );

        const border = '─'.repeat(longestLine + 4);

        let output = `
┌${border}┐
│ 💡 First Thought Advisor${' '.repeat(Math.max(0, longestLine - 22))} │
├${border}┤
│ Problem: ${problem}${' '.repeat(Math.max(0, longestLine - problem.length - 10))} │
`;

        if (domain) {
            output += `│ Domain: ${domain}${' '.repeat(Math.max(0, longestLine - domain.length - 9))} │\n`;
        }

        if (complexity) {
            output += `│ Complexity: ${complexity}${' '.repeat(Math.max(0, longestLine - complexity.length - 13))} │\n`;
        }

        if (goal) {
            output += `│ Goal: ${goal}${' '.repeat(Math.max(0, longestLine - goal.length - 7))} │\n`;
        }

        if (constraints && constraints.length > 0) {
            output += `├${border}┤\n│ Constraints:${' '.repeat(Math.max(0, longestLine - 13))} │\n`;
            for (const constraint of constraints) {
                output += `│ - ${constraint}${' '.repeat(Math.max(0, longestLine - constraint.length - 4))} │\n`;
            }
        }

        if (previousApproaches && previousApproaches.length > 0) {
            output += `├${border}┤\n│ Previous Approaches:${' '.repeat(Math.max(0, longestLine - 22))} │\n`;
            for (const approach of previousApproaches) {
                output += `│ - ${approach}${' '.repeat(Math.max(0, longestLine - approach.length - 4))} │\n`;
            }
        }

        // Generate recommendations based on problem domain and complexity
        const recommendations = this.generateRecommendations(data);

        output += `├${border}┤\n│ Recommended Approach:${' '.repeat(Math.max(0, longestLine - 22))} │\n`;
        output += `│ ${recommendations.primary}${' '.repeat(Math.max(0, longestLine - recommendations.primary.length - 2))} │\n`;

        if (recommendations.alternatives && recommendations.alternatives.length > 0) {
            output += `├${border}┤\n│ Alternative Approaches:${' '.repeat(Math.max(0, longestLine - 23))} │\n`;
            for (const alt of recommendations.alternatives) {
                output += `│ - ${alt}${' '.repeat(Math.max(0, longestLine - alt.length - 4))} │\n`;
            }
        }

        output += `└${border}┘`;

        return output;
    }

    /**
     * Generate recommendations based on problem characteristics
     * @param {FirstThoughtData} data - First thought data
     * @returns {Object} Object containing primary and alternative recommendations
     */
    generateRecommendations(data) {
        const { problem, domain, complexity, constraints } = data;
        let primaryRecommendation = '';
        const alternativeRecommendations = [];

        // Detect problem domain
        const problemLower = problem.toLowerCase();
        const isDesignProblem = problemLower.includes('design') || problemLower.includes('architect');
        const isOptimizationProblem = problemLower.includes('optimiz') || problemLower.includes('improve') || problemLower.includes('efficient');
        const isDecisionProblem = problemLower.includes('decide') || problemLower.includes('choice') || problemLower.includes('select');
        const isAnalysisProblem = problemLower.includes('analyz') || problemLower.includes('understand') || problemLower.includes('evaluate');
        const isCreativeProblem = problemLower.includes('creat') || problemLower.includes('innovat') || problemLower.includes('new');
        const isComplexProblem = complexity === 'high' || problemLower.includes('complex') || problemLower.includes('difficult');

        // Check for programming-specific problems
        const isProgrammingProblem = (domain && domain.toLowerCase().includes('programming')) ||
            problemLower.includes('code') || problemLower.includes('software') ||
            problemLower.includes('programming') || problemLower.includes('algorithm');

        // Generate primary recommendation
        if (isProgrammingProblem) {
            if (isDesignProblem) {
                primaryRecommendation = "Use mental_model with composition_vs_inheritance to evaluate appropriate code organization patterns";
                alternativeRecommendations.push("Apply single_responsibility principle to analyze modularity requirements");
                alternativeRecommendations.push("Use sequential_thinking to break down design challenges methodically");
            } else if (isOptimizationProblem) {
                primaryRecommendation = "Use mental_model with time_space_complexity to analyze algorithmic efficiency";
                alternativeRecommendations.push("Apply binary_search debugging approach to identify performance bottlenecks");
                alternativeRecommendations.push("Consider stochastic_algorithm with MCTS for optimizing complex operations");
            } else if (isDecisionProblem) {
                primaryRecommendation = "Use model_selector to evaluate appropriate architecture or algorithm choices";
                alternativeRecommendations.push("Apply mental_model with interface_segregation to evaluate component boundaries");
                alternativeRecommendations.push("Consider sequential_thinking to break down the decision into smaller evaluations");
            } else {
                primaryRecommendation = "Use sequential_thinking to approach the programming problem methodically";
                alternativeRecommendations.push("Apply first_principles mental model to understand core requirements");
                alternativeRecommendations.push("Consider brainstorming with preparation phase to explore problem space");
            }
        } else if (isDesignProblem) {
            primaryRecommendation = "Use first_principles mental model to decompose the design problem";
            alternativeRecommendations.push("Apply brainstorming with ideation phase to generate design alternatives");
            alternativeRecommendations.push("Consider sequential_thinking to approach design methodically");
        } else if (isOptimizationProblem) {
            primaryRecommendation = "Use stochastic_algorithm with Bayesian approach for optimization under uncertainty";
            alternativeRecommendations.push("Apply pareto_principle mental model to identify highest-impact improvements");
            alternativeRecommendations.push("Consider sequential_thinking to decompose optimization into manageable steps");
        } else if (isDecisionProblem) {
            primaryRecommendation = "Use expected_value mental model for quantifying decision outcomes";
            alternativeRecommendations.push("Apply stochastic_algorithm with MDP for sequential decision-making");
            alternativeRecommendations.push("Consider bayesian mental model to update beliefs with new information");
        } else if (isAnalysisProblem) {
            primaryRecommendation = "Use systems_thinking mental model to understand relationships and feedback loops";
            alternativeRecommendations.push("Apply first_principles to break down the system into core components");
            alternativeRecommendations.push("Consider sequential_thinking for methodical analysis of complex systems");
        } else if (isCreativeProblem) {
            primaryRecommendation = "Use brainstorming with ideation phase to generate novel solutions";
            alternativeRecommendations.push("Apply lateral_thinking mental model to approach problem from unexpected angles");
            alternativeRecommendations.push("Consider divergent_thinking mental model to expand solution space");
        } else if (isComplexProblem) {
            primaryRecommendation = "Use sequential_thinking to break down complex problem into manageable steps";
            alternativeRecommendations.push("Apply systems_thinking mental model to understand interconnections");
            alternativeRecommendations.push("Consider first_principles to identify fundamental truths and build up from there");
        } else {
            primaryRecommendation = "Use first_principles mental model to understand core elements of the problem";
            alternativeRecommendations.push("Apply sequential_thinking to approach systematically");
            alternativeRecommendations.push("Consider brainstorming to explore the problem space and generate solutions");
        }

        // Adjust recommendations based on constraints
        if (constraints && constraints.length > 0) {
            // If time constraint exists, suggest rapid approaches
            if (constraints.some(c => c.toLowerCase().includes('time') || c.toLowerCase().includes('urgent'))) {
                alternativeRecommendations.unshift("Given time constraints, consider 80/20 rule to focus on critical aspects");
            }

            // If resource constraint exists, suggest efficient approaches
            if (constraints.some(c => c.toLowerCase().includes('resource') || c.toLowerCase().includes('limited'))) {
                alternativeRecommendations.unshift("With resource constraints, apply opportunity_cost to prioritize effectively");
            }
        }

        return {
            primary: primaryRecommendation,
            alternatives: alternativeRecommendations
        };
    }

    /**
     * Process first thought advice request
     * @param {unknown} input - Input data
     * @returns {Object} Formatted output with content and error status
     */
    processAdvice(input) {
        try {
            const data = this.validateFirstThoughtData(input);
            const formattedOutput = this.formatOutput(data);

            return {
                content: [{ type: 'text', text: formattedOutput }],
                isError: false
            };
        } catch (error) {
            return {
                content: [{ type: 'text', text: `Error processing first thought advice: ${error.message}` }],
                isError: true
            };
        }
    }
}
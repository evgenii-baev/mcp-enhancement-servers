import { MentalModel, getMentalModelById, loadMentalModels } from '../models/mental-models.js';
import { ModelCategory, ModelRecommendation, ModelSelectorData } from '../interfaces/model-selector-data.js';
import { modelCategories } from '../data/model-categories.js';

/**
 * Server for recommending appropriate mental models based on problem description
 */
export class ModelSelectorServer {
    /** Database of mental models */
    private modelDatabase: Map<string, MentalModel> = new Map();
    /** Categories of mental models */
    private categories: ModelCategory[] = [];

    /**
     * Initialize the model selector server
     */
    constructor() {
        // Initialize model database
        const allModels = loadMentalModels().mental_models;
        allModels.forEach((model: MentalModel) => this.modelDatabase.set(model.id, model));

        // Initialize categories
        this.categories = modelCategories;
    }

    /**
     * Validate input data for model selection
     * @param input - Raw input data
     * @returns Validated ModelSelectorData
     */
    private validateInput(input: unknown): ModelSelectorData {
        const data = input as Record<string, unknown>;

        if (!data.problem || typeof data.problem !== "string") {
            throw new Error("Invalid problem: must be a string describing your problem");
        }

        const result: ModelSelectorData = {
            problem: data.problem
        };

        // Validate optional fields
        if (data.domain !== undefined) {
            if (typeof data.domain !== "string") {
                throw new Error("Invalid domain: must be a string");
            }
            result.domain = data.domain;
        }

        if (data.goal !== undefined) {
            if (typeof data.goal !== "string") {
                throw new Error("Invalid goal: must be a string");
            }
            result.goal = data.goal;
        }

        if (data.complexity !== undefined) {
            if (typeof data.complexity !== "string" ||
                !["low", "medium", "high"].includes(data.complexity as string)) {
                throw new Error("Invalid complexity: must be 'low', 'medium', or 'high'");
            }
            result.complexity = data.complexity as "low" | "medium" | "high";
        }

        if (data.constraints !== undefined) {
            if (!Array.isArray(data.constraints) ||
                !data.constraints.every(c => typeof c === "string")) {
                throw new Error("Invalid constraints: must be an array of strings");
            }
            result.constraints = data.constraints as string[];
        }

        if (data.previousApproaches !== undefined) {
            if (!Array.isArray(data.previousApproaches) ||
                !data.previousApproaches.every(a => typeof a === "string")) {
                throw new Error("Invalid previousApproaches: must be an array of strings");
            }
            result.previousApproaches = data.previousApproaches as string[];
        }

        return result;
    }

    /**
     * Recommend mental models based on problem description
     * @param data - Validated input data
     * @returns Array of model recommendations
     */
    private recommendModels(data: ModelSelectorData): ModelRecommendation[] {
        const recommendations: ModelRecommendation[] = [];

        // Get all models
        const allModels = Array.from(this.modelDatabase.values());

        // Score each model based on problem description and other factors
        for (const model of allModels) {
            let score = this.calculateModelScore(model, data);

            // Skip models with very low scores
            if (score < 0.5) continue;

            // Generate reason and application advice
            const reason = this.generateReason(model, data);
            const howToApply = this.generateHowToApply(model, data);

            recommendations.push({
                modelId: model.id,
                name: model.name,
                score,
                reason,
                howToApply
            });
        }

        // Sort by score (descending)
        recommendations.sort((a, b) => b.score - a.score);

        // Return top 3 recommendations
        return recommendations.slice(0, 3);
    }

    /**
     * Calculate score for a model based on problem description
     * @param model - Mental model to score
     * @param data - Input data
     * @returns Score between 0 and 1
     */
    private calculateModelScore(model: MentalModel, data: ModelSelectorData): number {
        let score = 0;

        // Base score from keyword matching in problem description
        score += this.calculateKeywordMatchScore(model, data.problem);

        // Adjust score based on when_to_use matches
        score += this.calculateWhenToUseScore(model, data);

        // Adjust score based on domain if specified
        if (data.domain) {
            score += this.calculateDomainScore(model, data.domain);
        }

        // Adjust score based on goal if specified
        if (data.goal) {
            score += this.calculateGoalScore(model, data.goal);
        }

        // Normalize score to 0-1 range
        return Math.min(Math.max(score, 0), 1);
    }

    /**
     * Calculate score based on keyword matches
     * @param model - Mental model
     * @param problem - Problem description
     * @returns Score contribution
     */
    private calculateKeywordMatchScore(model: MentalModel, problem: string): number {
        let score = 0;
        const problemLower = problem.toLowerCase();

        // Check for model name in problem
        if (problemLower.includes(model.name.toLowerCase())) {
            score += 0.2;
        }

        // Check for model keywords in problem
        const keywords = this.getModelKeywords(model);
        for (const keyword of keywords) {
            if (problemLower.includes(keyword.toLowerCase())) {
                score += 0.1;
            }
        }

        return score;
    }

    /**
     * Extract keywords from model definition
     * @param model - Mental model
     * @returns Array of keywords
     */
    private getModelKeywords(model: MentalModel): string[] {
        // Extract keywords from model definition and when_to_use
        const keywords: string[] = [];

        // Add words from definition
        keywords.push(...model.definition.split(/\s+/).filter(w => w.length > 5));

        // Add phrases from when_to_use
        keywords.push(...model.when_to_use);

        return keywords;
    }

    /**
     * Calculate score based on when_to_use scenarios
     * @param model - Mental model
     * @param data - Input data
     * @returns Score contribution
     */
    private calculateWhenToUseScore(model: MentalModel, data: ModelSelectorData): number {
        let score = 0;
        const problemLower = data.problem.toLowerCase();

        // Check each when_to_use scenario
        for (const scenario of model.when_to_use) {
            const scenarioLower = scenario.toLowerCase();

            // Check for semantic similarity between problem and scenario
            const words = scenarioLower.split(/\s+/).filter(w => w.length > 4);
            for (const word of words) {
                if (problemLower.includes(word)) {
                    score += 0.05;
                }
            }
        }

        return Math.min(score, 0.5); // Cap at 0.5
    }

    /**
     * Calculate score based on domain
     * @param model - Mental model
     * @param domain - Problem domain
     * @returns Score contribution
     */
    private calculateDomainScore(model: MentalModel, domain: string): number {
        // Domain-specific scoring logic
        const domainModelMap: Record<string, string[]> = {
            "tech": ["first_principles", "systems_thinking", "rubber_duck", "error_propagation"],
            "business": ["pareto_principle", "opportunity_cost", "systems_thinking", "scenario_planning"],
            "science": ["scientific_method", "bayes_theorem", "first_principles", "thought_experiment"],
            "personal": ["sunk_cost", "loss_aversion", "confirmation_bias", "hanlons_razor"],
            "education": ["divergent_thinking", "lateral_thinking", "thought_experiment", "rubber_duck"]
        };

        if (domainModelMap[domain]?.includes(model.id)) {
            return 0.2;
        }

        return 0;
    }

    /**
     * Calculate score based on goal
     * @param model - Mental model
     * @param goal - Problem-solving goal
     * @returns Score contribution
     */
    private calculateGoalScore(model: MentalModel, goal: string): number {
        // Goal-specific scoring logic
        const goalModelMap: Record<string, string[]> = {
            "analyze": ["systems_thinking", "first_principles", "scientific_method", "sensitivity_analysis"],
            "innovate": ["lateral_thinking", "divergent_thinking", "first_principles", "thought_experiment"],
            "optimize": ["pareto_principle", "opportunity_cost", "systems_thinking", "sensitivity_analysis", "mdp", "bayesian"],
            "debug": ["rubber_duck", "error_propagation", "occams_razor", "scientific_method"],
            "decide": ["decision_tree", "bayes_theorem", "opportunity_cost", "scenario_planning", "mdp", "mcts", "bandit"],
            "understand": ["systems_thinking", "proximate_ultimate_causation", "thought_experiment", "scientific_method"],
            "predict": ["bayes_theorem", "hmm", "bayesian", "mcts"]
        };

        if (goalModelMap[goal]?.includes(model.id)) {
            return 0.3;
        }

        return 0;
    }

    /**
     * Generate reason for model recommendation
     * @param model - Mental model
     * @param data - Input data
     * @returns Reason string
     */
    private generateReason(model: MentalModel, data: ModelSelectorData): string {
        // Generate a personalized reason why this model is recommended
        let reason = "";

        // Base reason on model definition
        reason = `${model.definition} `;

        // Add context based on problem
        if (data.goal) {
            switch (data.goal) {
                case "analyze":
                    reason += `This model is particularly effective for analyzing problems like yours because it helps break down complexity into manageable components.`;
                    break;
                case "innovate":
                    reason += `This model can help you generate innovative solutions by providing a framework to think outside conventional boundaries.`;
                    break;
                case "optimize":
                    reason += `This model is well-suited for optimization challenges, helping you identify inefficiencies and improvement opportunities.`;
                    break;
                case "debug":
                    reason += `This model excels at debugging scenarios by providing a structured approach to identify root causes.`;
                    break;
                case "decide":
                    reason += `This model provides a framework for making better decisions by considering key factors systematically.`;
                    break;
                case "understand":
                    reason += `This model helps build deeper understanding by revealing underlying patterns and relationships.`;
                    break;
                case "predict":
                    reason += `This model is excellent for prediction tasks, using probabilistic reasoning to forecast outcomes under uncertainty.`;
                    break;
                default:
                    reason += `This model provides a structured approach that can help address your specific problem.`;
            }
        } else {
            reason += `This model provides a structured approach that can help address your specific problem.`;
        }

        return reason;
    }

    /**
     * Generate advice on how to apply the model
     * @param model - Mental model
     * @param data - Input data
     * @returns How-to-apply string
     */
    private generateHowToApply(model: MentalModel, data: ModelSelectorData): string {
        // Generate advice on how to apply this model to the specific problem
        let advice = "To apply this model to your problem:\n";

        // For stochastic algorithms, provide special instructions
        if (["mdp", "mcts", "bandit", "bayesian", "hmm"].includes(model.id)) {
            advice += `Use the stochastic_algorithm tool with the following parameters:\n`;
            advice += `{\n`;
            advice += `  "algorithm": "${model.id}",\n`;
            advice += `  "problem": "${data.problem}",\n`;
            advice += `  "parameters": {\n`;

            // Add algorithm-specific parameters
            switch (model.id) {
                case "mdp":
                    advice += `    "states": [number of states],\n`;
                    advice += `    "actions": [number of actions],\n`;
                    advice += `    "discount": 0.9\n`;
                    break;
                case "mcts":
                    advice += `    "iterations": 1000,\n`;
                    advice += `    "exploration": 1.41\n`;
                    break;
                case "bandit":
                    advice += `    "arms": [number of options],\n`;
                    advice += `    "strategy": "ucb1"\n`;
                    break;
                case "bayesian":
                    advice += `    "iterations": 100,\n`;
                    advice += `    "kernel": "rbf"\n`;
                    break;
                case "hmm":
                    advice += `    "states": [number of hidden states],\n`;
                    advice += `    "observations": [number of possible observations]\n`;
                    break;
            }

            advice += `  }\n`;
            advice += `}\n`;
        } else {
            // Add steps from the model
            for (let i = 0; i < model.steps.length; i++) {
                advice += `${i + 1}. ${model.steps[i]}\n`;
            }
        }

        // Add problem-specific advice
        advice += `\nFor your specific problem about "${data.problem.substring(0, 50)}${data.problem.length > 50 ? '...' : ''}", `;
        advice += `focus on identifying the key elements and applying the model systematically.`;

        return advice;
    }

    /**
     * Format recommendations for display
     * @param recommendations - Model recommendations
     * @param data - Input data
     * @returns Formatted output string
     */
    private formatRecommendations(recommendations: ModelRecommendation[], data: ModelSelectorData): string {
        // Check if there are any recommendations
        if (recommendations.length === 0) {
            return "No suitable mental models found for your problem. Try rephrasing or providing more details.";
        }

        const title = `🧠 Model Recommendations for: ${data.problem.substring(0, 50)}${data.problem.length > 50 ? '...' : ''}`;
        const border = '─'.repeat(Math.max(title.length - 4, 80));

        let output = `
┌${border}┐
│ ${title} │
├${border}┤
│ Problem: ${data.problem.substring(0, border.length - 11)}${data.problem.length > border.length - 11 ? '...' : ' '.repeat(border.length - 11 - data.problem.length)} │`;

        if (data.goal) {
            output += `\n│ Goal: ${data.goal.padEnd(border.length - 8)} │`;
        }

        if (data.domain) {
            output += `\n│ Domain: ${data.domain.padEnd(border.length - 10)} │`;
        }

        output += `\n├${border}┤`;

        // Add recommendations
        for (let i = 0; i < recommendations.length; i++) {
            const rec = recommendations[i];
            output += `\n│ ${i + 1}. ${rec.name} (${Math.round(rec.score * 100)}% match)${' '.repeat(border.length - rec.name.length - 15)} │`;
            output += `\n│${' '.repeat(border.length)} │`;

            // Add reason with word wrapping
            const reasonWords = rec.reason.split(' ');
            let line = '│    Why: ';
            for (const word of reasonWords) {
                if (line.length + word.length + 1 > border.length - 1) {
                    output += `\n${line.padEnd(border.length)} │`;
                    line = '│         ';
                }
                line += word + ' ';
            }
            output += `\n${line.padEnd(border.length)} │`;

            output += `\n│${' '.repeat(border.length)} │`;

            // Add how to apply with word wrapping
            const howToApplyLines = rec.howToApply.split('\n');
            output += `\n│    How to apply:${' '.repeat(border.length - 17)} │`;
            for (const howToApplyLine of howToApplyLines) {
                const words = howToApplyLine.split(' ');
                line = '│      ';
                for (const word of words) {
                    if (line.length + word.length + 1 > border.length - 1) {
                        output += `\n${line.padEnd(border.length)} │`;
                        line = '│      ';
                    }
                    line += word + ' ';
                }
                output += `\n${line.padEnd(border.length)} │`;
            }

            if (i < recommendations.length - 1) {
                output += `\n├${border}┤`;
            }
        }

        output += `\n├${border}┤`;
        output += `\n│ Next Steps: Use the mentalmodel tool with your chosen model ${' '.repeat(border.length - 54)} │`;
        output += `\n│ Example: { "modelName": "${recommendations[0].modelId}", "problem": "..." } ${' '.repeat(border.length - recommendations[0].modelId.length - 36)} │`;
        output += `\n└${border}┘`;

        return output;
    }

    /**
     * Process model selection request
     * @param input - Raw input data
     * @returns Response object
     */
    public processModelSelection(input: unknown): {
        content: Array<{ type: string; text: string }>;
        isError?: boolean;
    } {
        try {
            const data = this.validateInput(input);
            const recommendations = this.recommendModels(data);

            // Check if there are any recommendations
            if (recommendations.length === 0) {
                return {
                    content: [{
                        type: "text",
                        text: JSON.stringify({
                            error: "No suitable mental models found for your problem. Try rephrasing or providing more details.",
                            status: "no_recommendations"
                        }, null, 2)
                    }],
                    isError: true
                };
            }

            const formattedOutput = this.formatRecommendations(recommendations, data);

            console.error(formattedOutput);

            // Process recommendations for JSON output
            const processedRecommendations = recommendations.map(r => {
                // Replace \n with actual newlines
                const reason = r.reason.split('\\n').join('\n');
                const howToApply = r.howToApply.split('\\n').join('\n');

                return {
                    modelId: r.modelId,
                    name: r.name,
                    score: r.score,
                    reason,
                    howToApply
                };
            });

            return {
                content: [{
                    type: "text",
                    text: JSON.stringify({
                        recommendations: processedRecommendations,
                        problem: data.problem,
                        goal: data.goal,
                        domain: data.domain,
                        status: "success"
                    }, null, 2)
                }]
            };
        } catch (error) {
            console.error("Error in modelSelector:", error);
            return {
                content: [{
                    type: "text",
                    text: JSON.stringify({
                        error: error instanceof Error ? error.message : String(error),
                        status: "failed"
                    }, null, 2)
                }],
                isError: true
            };
        }
    }
} 
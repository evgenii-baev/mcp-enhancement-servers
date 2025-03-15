import { MentalModel, getMentalModelById, loadMentalModels } from '../models/mental-models.js';
import { ModelCategory, ModelRecommendation, FirstThoughtAdvisorData } from '../interfaces/first-thought-advisor-data.js';
import { modelCategories } from '../data/model-categories.js';

/**
 * Server for recommending appropriate mental models and algorithms based on problem description
 */
export class FirstThoughtAdvisorServer {
    /** Database of mental models */
    private modelDatabase: Map<string, MentalModel> = new Map();
    /** Categories of mental models */
    private categories: ModelCategory[] = [];

    /**
     * Initialize the first thought advisor server
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
     * @returns Validated FirstThoughtAdvisorData
     */
    private validateInput(input: unknown): FirstThoughtAdvisorData {
        const data = input as Record<string, unknown>;

        if (!data.problem || typeof data.problem !== "string") {
            throw new Error("Invalid problem: must be a string describing your problem");
        }

        if (!data.goal || typeof data.goal !== "string") {
            throw new Error("Invalid goal: must be a string describing your goal");
        }

        const result: FirstThoughtAdvisorData = {
            problem: data.problem,
            goal: data.goal
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
     * Process first thought advice request
     * @param params - Input parameters
     * @returns Recommendations and categories
     */
    public processFirstThoughtAdvice(params: unknown) {
        // Validate input
        const data = this.validateInput(params);

        // Get recommendations
        const recommendations = this.recommendModels(data);

        // Get categories
        const categories = this.categories;

        return {
            recommendations,
            categories
        };
    }

    /**
     * Recommend mental models based on problem description
     * @param data - Validated input data
     * @returns Array of model recommendations
     */
    private recommendModels(data: FirstThoughtAdvisorData): ModelRecommendation[] {
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
    private calculateModelScore(model: MentalModel, data: FirstThoughtAdvisorData): number {
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
    private calculateWhenToUseScore(model: MentalModel, data: FirstThoughtAdvisorData): number {
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
            "tech": ["first_principles", "systems_thinking", "rubber_duck", "error_propagation", "mdp", "mcts"],
            "business": ["pareto_principle", "opportunity_cost", "systems_thinking", "scenario_planning", "bandit", "bayesian"],
            "science": ["scientific_method", "bayes_theorem", "first_principles", "thought_experiment", "hmm", "bayesian"],
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
            "analyze": ["systems_thinking", "proximate_ultimate_causation", "scientific_method", "hmm"],
            "innovate": ["first_principles", "lateral_thinking", "divergent_thinking", "thought_experiment"],
            "optimize": ["pareto_principle", "opportunity_cost", "sensitivity_analysis", "mdp", "bayesian"],
            "debug": ["rubber_duck", "error_propagation", "occams_razor", "scientific_method"],
            "decide": ["decision_tree", "bayes_theorem", "opportunity_cost", "mcts", "bandit"],
            "understand": ["systems_thinking", "proximate_ultimate_causation", "thought_experiment", "hmm"],
            "predict": ["bayes_theorem", "scenario_planning", "simulation", "hmm", "mdp"]
        };

        if (goalModelMap[goal]?.includes(model.id)) {
            return 0.3;
        }

        return 0;
    }

    /**
     * Generate reason for recommending a model
     * @param model - Mental model
     * @param data - Input data
     * @returns Reason string
     */
    private generateReason(model: MentalModel, data: FirstThoughtAdvisorData): string {
        // Generate a reason based on model and problem
        const reasons = [
            `${model.name} is well-suited for problems like "${data.problem}" because it ${model.definition.toLowerCase()}`,
            `Your problem involves ${this.extractKeyThemes(data.problem)}, which aligns with ${model.name}'s strengths.`,
            `${model.name} provides a structured approach to address challenges like yours.`
        ];

        // Add domain-specific reason if applicable
        if (data.domain) {
            reasons.push(`This model is particularly effective in the ${data.domain} domain.`);
        }

        // Add goal-specific reason if applicable
        if (data.goal) {
            reasons.push(`${model.name} is excellent for ${data.goal} goals.`);
        }

        // Return a random reason
        return reasons[Math.floor(Math.random() * reasons.length)];
    }

    /**
     * Extract key themes from problem description
     * @param problem - Problem description
     * @returns Key themes string
     */
    private extractKeyThemes(problem: string): string {
        // Simple extraction of key themes
        const keywords = ["complexity", "uncertainty", "decision-making", "optimization",
            "analysis", "understanding", "innovation", "problem-solving",
            "planning", "debugging", "system", "process", "strategy"];

        const foundKeywords = keywords.filter(k => problem.toLowerCase().includes(k));

        if (foundKeywords.length > 0) {
            return foundKeywords.join(" and ");
        }

        return "complex problem-solving";
    }

    /**
     * Generate advice on how to apply a model
     * @param model - Mental model
     * @param data - Input data
     * @returns Application advice string
     */
    private generateHowToApply(model: MentalModel, data: FirstThoughtAdvisorData): string {
        // Generate application advice based on model steps
        let advice = `To apply ${model.name} to your problem:\n\n`;

        // Add steps
        model.steps.forEach((step, index) => {
            advice += `${index + 1}. ${step}\n`;
        });

        // Add example if available
        if (model.example) {
            advice += `\nExample: ${model.example}`;
        }

        // Add pitfalls to avoid
        if (model.pitfalls && model.pitfalls.length > 0) {
            advice += `\n\nPitfalls to avoid:\n`;
            model.pitfalls.slice(0, 3).forEach((pitfall, index) => {
                advice += `- ${pitfall}\n`;
            });
        }

        return advice;
    }
} 
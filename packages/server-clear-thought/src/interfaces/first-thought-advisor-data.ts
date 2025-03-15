/**
 * Interface for model category
 */
export interface ModelCategory {
    /** Unique identifier for the category */
    id: string;
    /** Display name for the category */
    name: string;
    /** Description of the category */
    description: string;
    /** Goals this category is applicable for */
    applicableGoals: string[];
    /** Models in this category */
    models: string[];
}

/**
 * Interface for first thought advisor input data
 */
export interface FirstThoughtAdvisorData {
    /** The problem to solve */
    problem: string;
    /** Optional domain of the problem */
    domain?: string;
    /** The goal of the problem-solving */
    goal: string;
    /** Optional constraints */
    constraints?: string[];
    /** Optional complexity level */
    complexity?: 'low' | 'medium' | 'high';
    /** Optional previously tried approaches */
    previousApproaches?: string[];
}

/**
 * Interface for model recommendation
 */
export interface ModelRecommendation {
    /** ID of the recommended model */
    modelId: string;
    /** Display name of the model */
    name: string;
    /** Match score (0-1) */
    score: number;
    /** Reason for recommendation */
    reason: string;
    /** Instructions on how to apply the model */
    howToApply: string;
} 
/**
 * AI Model Integration Service
 * This service provides intelligent model recommendations for AI assistants
 */

import { AIEnhancedModel, AIModelRequest, AIModelResponse, AIModelMetadata } from './interfaces';
import fs from 'fs';
import path from 'path';

/**
 * Service for AI integration with mental models
 */
export class AIModelService {
    private models: AIEnhancedModel[] = [];
    private readonly MODELS_PATH = path.join(__dirname, '..', 'models');

    /**
     * Initialize the service by loading all available models
     */
    constructor() {
        this.loadModels();
    }

    /**
     * Load models from JSON files and enhance them with AI metadata
     */
    private loadModels(): void {
        try {
            // Load programming mental models
            const programmingModelsPath = path.join(this.MODELS_PATH, '..', '..', 'programming-mental-models.json');
            if (fs.existsSync(programmingModelsPath)) {
                const programmingModels = JSON.parse(fs.readFileSync(programmingModelsPath, 'utf8'));
                this.enhanceModelsWithAIMetadata(programmingModels, 'programming');
                this.models.push(...programmingModels);
            }

            // Load general mental models
            const mentalModelsPath = path.join(this.MODELS_PATH, 'mental-models.json');
            if (fs.existsSync(mentalModelsPath)) {
                const mentalModels = JSON.parse(fs.readFileSync(mentalModelsPath, 'utf8'));
                this.enhanceModelsWithAIMetadata(mentalModels, 'general');
                this.models.push(...mentalModels);
            }

            // Load debugging approaches
            const debuggingApproachesPath = path.join(this.MODELS_PATH, 'debugging-approaches.json');
            if (fs.existsSync(debuggingApproachesPath)) {
                const debuggingApproaches = JSON.parse(fs.readFileSync(debuggingApproachesPath, 'utf8'));
                this.enhanceModelsWithAIMetadata(debuggingApproaches, 'debugging');
                this.models.push(...debuggingApproaches);
            }

            // Load stochastic algorithms
            const stochasticAlgorithmsPath = path.join(this.MODELS_PATH, 'stochastic-algorithms.json');
            if (fs.existsSync(stochasticAlgorithmsPath)) {
                const stochasticAlgorithms = JSON.parse(fs.readFileSync(stochasticAlgorithmsPath, 'utf8'));
                this.enhanceModelsWithAIMetadata(stochasticAlgorithms, 'stochastic');
                this.models.push(...stochasticAlgorithms);
            }

            console.log(`Loaded ${this.models.length} models with AI metadata`);
        } catch (error) {
            console.error('Failed to load models:', error);
        }
    }

    /**
     * Enhance models with AI-specific metadata
     */
    private enhanceModelsWithAIMetadata(models: AIEnhancedModel[], category: string): void {
        models.forEach(model => {
            if (!model.aiMetadata) {
                // Generate AI metadata based on model properties
                const keywords = this.extractKeywords(model);
                const domains = this.inferDomains(model, category);
                const priority = this.calculateAIPriority(model, category);

                model.aiMetadata = {
                    aiDescription: this.generateAIDescription(model),
                    keywords,
                    domains,
                    aiPriority: priority
                };

                // Add code patterns for programming models
                if (category === 'programming') {
                    model.aiMetadata.codePatterns = this.inferCodePatterns(model);
                }
            }
        });
    }

    /**
     * Generate a concise description for AI assistants
     */
    private generateAIDescription(model: AIEnhancedModel): string {
        return `Helps with ${model.definition.toLowerCase()}. Best used when ${model.when_to_use[0].toLowerCase()}.`;
    }

    /**
     * Extract keywords from model properties
     */
    private extractKeywords(model: AIEnhancedModel): string[] {
        const keywords = new Set<string>();

        // Add name words as keywords
        model.name.split(/\s+/).forEach(word => {
            if (word.length > 3) keywords.add(word.toLowerCase());
        });

        // Add key phrases from definition
        const definitionWords = model.definition
            .split(/\s+/)
            .filter(word => word.length > 4)
            .map(word => word.toLowerCase())
            .slice(0, 5);

        definitionWords.forEach(word => keywords.add(word));

        // Add when_to_use first points
        if (model.when_to_use.length > 0) {
            const firstUseCase = model.when_to_use[0];
            firstUseCase.split(/\s+/)
                .filter(word => word.length > 4)
                .forEach(word => keywords.add(word.toLowerCase()));
        }

        return Array.from(keywords);
    }

    /**
     * Infer domains where this model is applicable
     */
    private inferDomains(model: AIEnhancedModel, category: string): string[] {
        const domains = new Set<string>();

        // Add category as domain
        domains.add(category);

        // Add specific domains based on keywords and model properties
        if (model.name.toLowerCase().includes('design')) domains.add('design');
        if (model.name.toLowerCase().includes('architect')) domains.add('architecture');
        if (model.definition.toLowerCase().includes('problem')) domains.add('problem-solving');
        if (model.definition.toLowerCase().includes('data')) domains.add('data-structures');
        if (model.definition.toLowerCase().includes('algorithm')) domains.add('algorithms');
        if (model.when_to_use.some(use => use.toLowerCase().includes('test'))) domains.add('testing');
        if (model.when_to_use.some(use => use.toLowerCase().includes('refactor'))) domains.add('refactoring');

        // Add programming language domains if applicable
        const languageKeywords = [
            'javascript', 'typescript', 'python', 'java', 'c#', 'ruby', 'go', 'rust'
        ];

        for (const lang of languageKeywords) {
            if (model.example.toLowerCase().includes(lang)) {
                domains.add(lang);
            }
        }

        return Array.from(domains);
    }

    /**
     * Infer code patterns where this model is applicable (for programming models)
     */
    private inferCodePatterns(model: AIEnhancedModel): string[] {
        const patterns: string[] = [];

        // Add patterns based on model properties
        switch (model.id) {
            case 'composition_vs_inheritance':
                patterns.push('class hierarchy with multiple inheritance needs');
                patterns.push('code reuse across unrelated classes');
                patterns.push('dynamic behavior composition at runtime');
                break;
            case 'single_responsibility':
                patterns.push('class with methods that serve different purposes');
                patterns.push('large classes with many fields and methods');
                patterns.push('methods that require many parameters');
                break;
            case 'interface_segregation':
                patterns.push('large interfaces with many unrelated methods');
                patterns.push('clients only using small portions of interfaces');
                patterns.push('need for multiple implementations of same behavior');
                break;
            case 'actor_model':
                patterns.push('concurrent systems with shared state issues');
                patterns.push('distributed computing requirements');
                patterns.push('systems with many independent entities');
                break;
            case 'time_space_complexity':
                patterns.push('algorithms with performance concerns');
                patterns.push('operations on large data structures');
                patterns.push('choosing between alternative implementations');
                break;
            default:
                // Generic patterns
                patterns.push('code organization problems');
                patterns.push('maintenance challenges in large codebases');
                patterns.push('recurring design decisions');
        }

        return patterns;
    }

    /**
     * Calculate AI priority for model recommendation
     */
    private calculateAIPriority(model: AIEnhancedModel, category: string): number {
        let priority = 5; // Default middle priority

        // Increase priority for always_consider models
        if (model.always_consider) priority += 2;

        // Adjust based on category
        if (category === 'programming') priority += 1;
        if (category === 'debugging') priority += 1;

        // Adjust based on complexity
        const complexityIndicators = ['complex', 'difficult', 'advanced', 'sophisticated'];
        if (complexityIndicators.some(indicator => model.definition.toLowerCase().includes(indicator))) {
            priority -= 1; // Lower priority for more complex models
        }

        // Ensure priority is in range 1-10
        return Math.max(1, Math.min(10, priority));
    }

    /**
     * Find models that match the AI assistant's request
     */
    public findModels(request: AIModelRequest): AIModelResponse {
        // Calculate relevance scores for all models
        const scoredModels = this.models.map(model => {
            const score = this.calculateRelevanceScore(model, request);
            return { model, score };
        });

        // Sort by score in descending order
        scoredModels.sort((a, b) => b.score - a.score);

        // Take top results or all if returnAllMatches is true
        const recommendedModels = request.returnAllMatches
            ? scoredModels.map(sm => sm.model)
            : scoredModels.slice(0, 3).map(sm => sm.model);

        // Generate reasoning
        const reasoning = this.generateReasoning(recommendedModels, request);

        // Generate approach if multiple models recommended
        const suggestedApproach = recommendedModels.length > 1
            ? this.generateCombinedApproach(recommendedModels, request)
            : undefined;

        return {
            recommendedModels,
            reasoning,
            suggestedApproach
        };
    }

    /**
     * Calculate relevance score for a model based on the request
     */
    private calculateRelevanceScore(model: AIEnhancedModel, request: AIModelRequest): number {
        if (!model.aiMetadata) return 0;

        let score = 0;

        // Base score from AI priority
        score += model.aiMetadata.aiPriority;

        // Context matching
        const contextLower = request.context.toLowerCase();

        // Check for keyword matches
        model.aiMetadata.keywords.forEach(keyword => {
            if (contextLower.includes(keyword.toLowerCase())) {
                score += 2;
            }
        });

        // Domain matching
        if (request.languages) {
            request.languages.forEach(lang => {
                if (model.aiMetadata.domains.includes(lang.toLowerCase())) {
                    score += 3;
                }
            });
        }

        // Code pattern matching for programming models
        if (model.aiMetadata.codePatterns) {
            model.aiMetadata.codePatterns.forEach(pattern => {
                if (contextLower.includes(pattern.toLowerCase())) {
                    score += 4;
                }
            });
        }

        // Project scale consideration
        if (request.projectScale && model.when_to_use.some(use =>
            use.toLowerCase().includes(request.projectScale!.toLowerCase()))) {
            score += 2;
        }

        // Constraints consideration
        if (request.constraints) {
            request.constraints.forEach(constraint => {
                const constraintLower = constraint.toLowerCase();

                // Check if model addresses any constraints
                if (model.pitfalls.some(pitfall =>
                    constraintLower.includes(pitfall.toLowerCase()))) {
                    score += 3;
                }
            });
        }

        return score;
    }

    /**
     * Generate reasoning for recommended models
     */
    private generateReasoning(models: AIEnhancedModel[], request: AIModelRequest): string {
        if (models.length === 0) {
            return "No models found that match your specific requirements.";
        }

        const topModel = models[0];
        let reasoning = `I primarily recommend ${topModel.name} because it addresses ${topModel.aiMetadata?.aiDescription}. `;

        // Add context-specific reasoning
        reasoning += `This is particularly relevant for your context: "${request.context.substring(0, 50)}...". `;

        if (models.length > 1) {
            reasoning += `I've also included ${models.length - 1} additional models that complement the primary recommendation.`;
        }

        return reasoning;
    }

    /**
     * Generate a suggested approach combining multiple models
     */
    private generateCombinedApproach(models: AIEnhancedModel[], request: AIModelRequest): string {
        if (models.length <= 1) return "";

        let approach = "Combined approach: ";

        // Add steps from each model in sequence
        models.forEach((model, index) => {
            const stepNumber = index + 1;
            approach += `\n${stepNumber}. Apply ${model.name}: ${model.steps[0]}`;

            // Add one more step from each model if available
            if (model.steps.length > 1) {
                approach += ` Then ${model.steps[1].charAt(0).toLowerCase() + model.steps[1].slice(1)}`;
            }
        });

        return approach;
    }
} 
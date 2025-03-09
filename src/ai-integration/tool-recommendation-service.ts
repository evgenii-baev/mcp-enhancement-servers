import {
    AIToolDescription,
    AIToolRecommendationService,
    RecommendationContext,
    RecommendationOptions,
    ToolRecommendation
} from './interfaces';

import {
    getEnhancedToolDescription,
    getAllEnhancedToolDescriptions,
    getToolDescriptionsByCategory,
    getToolDescriptionsByPriority
} from './enhanced-tool-descriptions';

/**
 * Service for recommending appropriate MCP tools to AI assistants based on context
 */
export class ToolRecommendationService implements AIToolRecommendationService {
    /**
     * Get recommended tools based on the given context
     * @param context Information about the user's current task or problem
     * @param options Options for customizing recommendations
     * @returns Array of tool recommendations sorted by confidence
     */
    public getRecommendedTools(
        context: RecommendationContext,
        options?: RecommendationOptions
    ): ToolRecommendation[] {
        // Default options
        const maxRecommendations = options?.maxRecommendations || 3;
        const confidenceThreshold = options?.confidenceThreshold || 0.5;
        const includeSuggestedParameters = options?.includeSuggestedParameters || false;
        const categoryFilter = options?.categoryFilter || [];

        // Get all tools to consider
        let tools = getAllEnhancedToolDescriptions();

        // Apply category filter if provided
        if (categoryFilter.length > 0) {
            tools = tools.filter(tool => categoryFilter.includes(tool.category));
        }

        // Calculate confidence scores for each tool
        const recommendations: ToolRecommendation[] = tools.map(tool => {
            const { confidence, rationale, suggestedParameters } = this.calculateConfidence(tool, context);

            return {
                tool,
                confidence,
                rationale,
                suggestedParameters: includeSuggestedParameters ? suggestedParameters : undefined
            };
        });

        // Filter by confidence threshold and sort by confidence (descending)
        return recommendations
            .filter(rec => rec.confidence >= confidenceThreshold)
            .sort((a, b) => b.confidence - a.confidence)
            .slice(0, maxRecommendations);
    }

    /**
     * Get all available tool descriptions
     * @returns Array of all tool descriptions
     */
    public getAllToolDescriptions(): AIToolDescription[] {
        return getAllEnhancedToolDescriptions();
    }

    /**
     * Get tool descriptions by category
     * @param category The category to filter by
     * @returns Array of tool descriptions in the specified category
     */
    public getToolDescriptionsByCategory(category: string): AIToolDescription[] {
        return getToolDescriptionsByCategory(category);
    }

    /**
     * Get detailed information about a specific tool
     * @param toolName The name of the tool to get information for
     * @returns The tool description or undefined if not found
     */
    public getToolDescription(toolName: string): AIToolDescription | undefined {
        return getEnhancedToolDescription(toolName);
    }

    /**
     * Calculate confidence score for a tool in the given context
     * @param tool The tool to calculate confidence for
     * @param context The user's current context
     * @returns Object containing confidence score, rationale, and suggested parameters
     * @private
     */
    private calculateConfidence(
        tool: AIToolDescription,
        context: RecommendationContext
    ): {
        confidence: number;
        rationale: string;
        suggestedParameters: Record<string, any>
    } {
        // Initialize variables
        let confidence = 0;
        let factors: string[] = [];
        const suggestedParameters: Record<string, any> = {};

        // Base confidence from tool priority (higher priority = higher base confidence)
        // Priority 1 tools start at 0.5, Priority 5 tools start at 0.1
        const basePriorityConfidence = Math.max(0.6 - (tool.priority * 0.1), 0.1);
        confidence = basePriorityConfidence;
        factors.push(`Base confidence from priority: +${basePriorityConfidence.toFixed(2)}`);

        // Keyword matching for problem statement
        const keywordMatches = this.getKeywordMatches(tool, context.problemStatement);
        const keywordConfidence = keywordMatches.score * 0.3; // Max 0.3 from keywords
        confidence += keywordConfidence;

        if (keywordMatches.score > 0) {
            factors.push(`Keyword matches (${keywordMatches.matches.join(', ')}): +${keywordConfidence.toFixed(2)}`);
        }

        // Domain relevance
        if (context.domain) {
            const domainRelevance = this.getDomainRelevance(tool, context.domain);
            confidence += domainRelevance;
            if (domainRelevance > 0) {
                factors.push(`Domain relevance: +${domainRelevance.toFixed(2)}`);
            }
        }

        // Complexity appropriateness
        if (context.complexity) {
            const complexityScore = this.getComplexityScore(tool, context.complexity);
            confidence += complexityScore;
            if (complexityScore > 0) {
                factors.push(`Complexity match: +${complexityScore.toFixed(2)}`);
            }
        }

        // Constraints compatibility
        if (context.constraints && context.constraints.length > 0) {
            const constraintsScore = this.getConstraintsCompatibility(tool, context.constraints);
            confidence += constraintsScore;
            if (constraintsScore > 0) {
                factors.push(`Constraints compatibility: +${constraintsScore.toFixed(2)}`);
            }
        }

        // Penalty for previously used tools that didn't work
        if (context.previouslyUsedTools && context.previouslyUsedTools.includes(tool.name)) {
            const penalty = -0.2;
            confidence += penalty;
            factors.push(`Previously tried without success: ${penalty.toFixed(2)}`);
        }

        // Generate suggested parameters based on context
        // This is a simplified version - in practice, this would be more sophisticated
        if (tool.name === 'mental_model') {
            // Suggest an appropriate mental model based on the problem
            const suggestedModel = this.suggestMentalModel(context.problemStatement, context.domain);
            if (suggestedModel) {
                suggestedParameters.modelName = suggestedModel;
                suggestedParameters.problem = context.problemStatement;
            }
        } else if (tool.name === 'sequential_thinking') {
            // Suggest appropriate thought parameters
            suggestedParameters.thoughtNumber = 1;
            suggestedParameters.totalThoughts = context.complexity === 'complex' ? 5 : 3;
            suggestedParameters.nextThoughtNeeded = true;
        }

        // Cap confidence at 0.95 to allow for some uncertainty
        confidence = Math.min(confidence, 0.95);

        // Generate rationale
        const rationale = factors.length > 0
            ? `This tool is recommended because: ${factors.join('; ')}.`
            : `This tool may be appropriate for the given context.`;

        return { confidence, rationale, suggestedParameters };
    }

    /**
     * Get keyword matches between tool description and problem statement
     * @param tool The tool to check
     * @param problemStatement The user's problem statement
     * @returns Object containing match score and matching keywords
     * @private
     */
    private getKeywordMatches(
        tool: AIToolDescription,
        problemStatement: string
    ): { score: number; matches: string[] } {
        // Define keywords for each tool
        const keywordMap: Record<string, string[]> = {
            mental_model: ['analyze', 'perspective', 'framework', 'understand', 'model', 'insight', 'thinking'],
            debugging_approach: ['debug', 'error', 'bug', 'issue', 'fix', 'troubleshoot', 'problem', 'solution'],
            sequential_thinking: ['step', 'sequence', 'process', 'reasoning', 'logic', 'thought', 'think through'],
            brainstorming: ['idea', 'generate', 'creative', 'solution', 'options', 'possibilities', 'alternatives'],
            model_selector: ['architecture', 'pattern', 'design', 'algorithm', 'structure', 'approach', 'implementation'],
            first_thought_advisor: ['start', 'approach', 'initial', 'direction', 'start', 'begin', 'guide'],
            feature_discussion: ['feature', 'requirement', 'specification', 'user story', 'functionality', 'plan'],
            feature_analyzer: ['analyze', 'complexity', 'estimate', 'dependency', 'risk', 'component', 'implementation'],
            stochastic_algorithm: ['optimize', 'uncertain', 'random', 'probability', 'decision', 'sequential']
        };

        const keywords = keywordMap[tool.name] || [];
        const lowercaseProblem = problemStatement.toLowerCase();
        const matches = keywords.filter(keyword => lowercaseProblem.includes(keyword.toLowerCase()));

        // Score based on number of matches and their importance
        const matchRatio = matches.length / keywords.length;
        const score = Math.min(matchRatio, 1) * 1.0; // Scale to max 1.0

        return { score, matches };
    }

    /**
     * Determine how relevant a tool is to a specific domain
     * @param tool The tool to check
     * @param domain The problem domain
     * @returns Relevance score from 0 to 0.2
     * @private
     */
    private getDomainRelevance(tool: AIToolDescription, domain: string): number {
        // Define domain affinity for each tool (higher = more relevant)
        const domainAffinities: Record<string, Record<string, number>> = {
            mental_model: {
                'programming': 0.15,
                'analysis': 0.2,
                'design': 0.15,
                'decision': 0.2
            },
            debugging_approach: {
                'programming': 0.2,
                'troubleshooting': 0.2,
                'system': 0.15
            },
            sequential_thinking: {
                'analysis': 0.2,
                'problem-solving': 0.2,
                'decision': 0.15
            },
            brainstorming: {
                'design': 0.2,
                'innovation': 0.2,
                'creative': 0.2
            },
            model_selector: {
                'programming': 0.2,
                'architecture': 0.2,
                'design': 0.15
            },
            first_thought_advisor: {
                'general': 0.2,
                'initial': 0.2,
                'planning': 0.15
            },
            feature_discussion: {
                'product': 0.2,
                'planning': 0.2,
                'requirements': 0.2
            },
            feature_analyzer: {
                'planning': 0.15,
                'implementation': 0.2,
                'assessment': 0.2
            },
            stochastic_algorithm: {
                'optimization': 0.2,
                'ai': 0.2,
                'decision': 0.15,
                'simulation': 0.2
            }
        };

        const toolAffinities = domainAffinities[tool.name] || {};
        const lowerDomain = domain.toLowerCase();

        // Find the highest affinity for domains that are mentioned
        let highestAffinity = 0;
        Object.entries(toolAffinities).forEach(([affinityDomain, score]) => {
            if (lowerDomain.includes(affinityDomain.toLowerCase()) && score > highestAffinity) {
                highestAffinity = score;
            }
        });

        return highestAffinity;
    }

    /**
     * Determine how appropriate a tool is for a specific complexity level
     * @param tool The tool to check
     * @param complexity The problem complexity
     * @returns Appropriateness score from 0 to 0.15
     * @private
     */
    private getComplexityScore(tool: AIToolDescription, complexity: 'simple' | 'moderate' | 'complex'): number {
        // Define complexity fit for each tool
        const complexityFit: Record<string, Record<string, number>> = {
            mental_model: { 'simple': 0.05, 'moderate': 0.1, 'complex': 0.15 },
            debugging_approach: { 'simple': 0.05, 'moderate': 0.15, 'complex': 0.1 },
            sequential_thinking: { 'simple': 0, 'moderate': 0.1, 'complex': 0.15 },
            brainstorming: { 'simple': 0.05, 'moderate': 0.1, 'complex': 0.15 },
            model_selector: { 'simple': 0.05, 'moderate': 0.15, 'complex': 0.1 },
            first_thought_advisor: { 'simple': 0.15, 'moderate': 0.1, 'complex': 0.05 },
            feature_discussion: { 'simple': 0.1, 'moderate': 0.15, 'complex': 0.1 },
            feature_analyzer: { 'simple': 0, 'moderate': 0.1, 'complex': 0.15 },
            stochastic_algorithm: { 'simple': 0, 'moderate': 0.05, 'complex': 0.15 }
        };

        return complexityFit[tool.name]?.[complexity] || 0;
    }

    /**
     * Evaluate how compatible a tool is with given constraints
     * @param tool The tool to check
     * @param constraints The user's constraints
     * @returns Compatibility score from 0 to 0.1
     * @private
     */
    private getConstraintsCompatibility(tool: AIToolDescription, constraints: string[]): number {
        // This would ideally check specific constraints against tool capabilities
        // For now, we'll use a simplified approach based on keywords

        const constraintKeywords: Record<string, string[]> = {
            'time': ['first_thought_advisor', 'model_selector'], // Quick results
            'performance': ['model_selector', 'stochastic_algorithm'], // Performance focused
            'memory': ['model_selector', 'stochastic_algorithm'], // Memory efficient
            'beginner': ['first_thought_advisor', 'mental_model'], // Beginner friendly
            'collaborative': ['brainstorming', 'feature_discussion'], // Good for teams
            'documentation': ['sequential_thinking', 'feature_discussion'] // Good documentation
        };

        let matchCount = 0;

        constraints.forEach(constraint => {
            const lowerConstraint = constraint.toLowerCase();

            // Check each constraint keyword
            Object.entries(constraintKeywords).forEach(([keyword, compatibleTools]) => {
                if (lowerConstraint.includes(keyword) && compatibleTools.includes(tool.name)) {
                    matchCount++;
                }
            });
        });

        // Score based on the proportion of constraints that match
        return Math.min(matchCount / constraints.length, 1) * 0.1;
    }

    /**
     * Suggest an appropriate mental model based on problem description and domain
     * @param problemStatement The user's problem statement
     * @param domain Optional domain information
     * @returns Suggested mental model name or undefined
     * @private
     */
    private suggestMentalModel(problemStatement: string, domain?: string): string | undefined {
        const problem = problemStatement.toLowerCase();

        // Programming-specific models
        if (domain === 'programming' || problem.includes('code') || problem.includes('program')) {
            if (problem.includes('class') || problem.includes('object') || problem.includes('inheritance')) {
                return 'composition_vs_inheritance';
            } else if (problem.includes('responsibility') || problem.includes('modularity')) {
                return 'single_responsibility';
            } else if (problem.includes('interface') || problem.includes('abstraction')) {
                return 'interface_segregation';
            } else if (problem.includes('concurrency') || problem.includes('parallel')) {
                return 'actor_model';
            } else if (problem.includes('algorithm') || problem.includes('performance') || problem.includes('complexity')) {
                return 'time_space_complexity';
            }
        }

        // General mental models
        if (problem.includes('fundamental') || problem.includes('basic') || problem.includes('core')) {
            return 'first_principles';
        } else if (problem.includes('trade') || problem.includes('alternative') || problem.includes('option')) {
            return 'opportunity_cost';
        } else if (problem.includes('explain') || problem.includes('understand')) {
            return 'rubber_duck';
        } else if (problem.includes('priority') || problem.includes('focus') || problem.includes('important')) {
            return 'pareto_principle';
        } else if (problem.includes('simple') || problem.includes('complex')) {
            return 'occams_razor';
        } else if (problem.includes('system') || problem.includes('interconnect')) {
            return 'systems_thinking';
        }

        return undefined;
    }
} 
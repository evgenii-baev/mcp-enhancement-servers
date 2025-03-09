import { FormattedOutput } from '../interfaces/server-interfaces';

export enum DiscussionStage {
    PROBLEM_DEFINITION = 'problem_definition',
    USER_NEEDS = 'user_needs',
    REQUIREMENTS = 'requirements',
    CONSTRAINTS = 'constraints',
    SOLUTION_IDEAS = 'solution_ideas',
    EVALUATION = 'evaluation',
    DECISION = 'decision',
    IMPLEMENTATION_PLAN = 'implementation_plan'
}

export class BrainstormingServer {
    processBrainstorming(input: unknown): FormattedOutput;
}

export class FirstThoughtAdvisorServer {
    validateFirstThoughtData(input: unknown): any;
    formatOutput(data: any): string;
    generateRecommendations(data: any): any;
    processAdvice(input: unknown): FormattedOutput;
}

export class FeatureDiscussionServer {
    validateDiscussionData(input: unknown): any;
    getDiscussionState(featureId: string): any;
    updateDiscussionState(featureId: string, response: string): any;
    formatNextPrompt(featureId: string): string;
    formatDiscussionSummary(featureId: string): string;
    processDiscussion(input: unknown): FormattedOutput;
}

export class FeatureAnalyzerServer {
    validateAnalyzerData(input: unknown): any;
    analyzeFeature(data: any): any;
    extractRequirements(name: string, description?: string): any[];
    identifyDependencies(name: string, description?: string): any[];
    assessComplexity(name: string, description?: string): any;
    calculateEffort(complexityScore: number): any;
    generateTechnicalSpecification(name: string, description?: string): any;
    generateArchitecture(isUiFeature: boolean, isDataFeature: boolean, isIntegrationFeature: boolean, isSecurityFeature: boolean): any;
    generateDataModels(name: string): any[];
    generateApiEndpoints(name: string): any[];
    generateUiComponents(name: string): any[];
    generateSecurityMeasures(): any[];
    generateImplementationConsiderations(isUiFeature: boolean, isDataFeature: boolean, isIntegrationFeature: boolean, isSecurityFeature: boolean): any[];
    formatOutput(analysis: any): string;
    processAnalysis(input: unknown): FormattedOutput;
}

export class StochasticAlgorithmServer {
    validateStochasticData(input: unknown): any;
    formatOutput(data: any): string;
    processAlgorithm(input: unknown): FormattedOutput;
}
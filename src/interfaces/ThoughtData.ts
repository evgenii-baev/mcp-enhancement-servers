/**
 * Интерфейсы для данных мыслей
 */

// Интерфейс для последовательной мысли
export interface SequentialThoughtData {
    thought: string;
    thoughtNumber: number;
    totalThoughts: number;
    nextThoughtNeeded: boolean;
    branchFromThought?: number;
    branchId?: string;
    isRevision?: boolean;
    revisesThought?: number;
    needsMoreThoughts?: boolean;
}

// Интерфейс для ментальной модели
export interface MentalModelData {
    modelName: string;
    problem: string;
}

// Интерфейс для подхода к отладке
export interface DebuggingApproachData {
    approachName: string;
    issue: string;
    findings?: string;
    steps?: string[];
    resolution?: string;
}

// Интерфейс для мозгового штурма
export interface BrainstormingData {
    phase: string;
    sessionId?: string;
    topic?: string;
}

// Интерфейс для стохастического алгоритма
export interface StochasticAlgorithmData {
    algorithm: string;
    problem: string;
    parameters: Record<string, any>;
    result?: string;
}

// Интерфейс для советника по первым мыслям
export interface FirstThoughtAdvisorData {
    problem: string;
    goal?: string;
    domain?: string;
    complexity?: 'low' | 'medium' | 'high';
    constraints?: string[];
    previousApproaches?: string[];
}

// Интерфейс для обсуждения функций
export interface FeatureDiscussionData {
    featureId: string;
    title?: string;
    response?: string;
}

// Интерфейс для анализатора функций
export interface FeatureAnalyzerData {
    featureName: string;
    featureDescription?: string;
}

// Интерфейс для советника по архитектуре
export interface ArchitectureAdvisorData {
    featureId: string;
    requirements: {
        performance?: string;
        security?: string;
        scalability?: string;
        maintainability?: string;
        [key: string]: any;
    };
}

// Интерфейс для результата анализа функции
export interface FeatureAnalysisResult {
    name: string;
    description: string;
    analysis: string;
    complexity: 'Low' | 'Medium' | 'High';
    dependencies: string[];
    risks: string[];
}

// Интерфейс для рекомендации по архитектуре
export interface ArchitectureRecommendation {
    featureId: string;
    pattern: string;
    components: string[];
    relationships: string[];
    designPatterns: string[];
    technologies: Record<string, string>;
    timestamp: string;
} 
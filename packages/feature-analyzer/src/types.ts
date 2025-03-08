/**
 * Типы и интерфейсы для компонента FeatureAnalyzer
 */

import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';

/**
 * Уровни мышления в многоуровневой архитектуре
 */
export enum ThinkingLevel {
    FOUNDATION = 'foundation',
    SPECIALIZED = 'specialized',
    INTEGRATED = 'integrated'
}

/**
 * Типы инструментов мышления
 */
export enum ToolType {
    ANALYZER = 'analyzer',
    GENERATOR = 'generator',
    EVALUATOR = 'evaluator',
    TRANSFORMER = 'transformer',
    ORCHESTRATOR = 'orchestrator'
}

/**
 * Тип требования к функции
 */
export enum RequirementType {
    FUNCTIONAL = 'functional',
    NON_FUNCTIONAL = 'non-functional',
    CONSTRAINT = 'constraint',
    TECHNICAL = 'technical',
    USER_INTERFACE = 'user-interface',
    SECURITY = 'security',
    PERFORMANCE = 'performance',
    ACCESSIBILITY = 'accessibility',
    LOCALIZATION = 'localization'
}

/**
 * Приоритет требования
 */
export enum RequirementPriority {
    CRITICAL = 'critical',
    HIGH = 'high',
    MEDIUM = 'medium',
    LOW = 'low',
    OPTIONAL = 'optional'
}

/**
 * Структура требования к функции
 */
export interface Requirement {
    id: string;
    description: string;
    type: RequirementType;
    priority: RequirementPriority;
    source?: string; // откуда взято требование (из обсуждения, пользовательского ввода и т.д.)
    notes?: string; // дополнительные заметки
}

/**
 * Информация о зависимостях между требованиями
 */
export interface RequirementDependency {
    requirementId: string;
    dependsOnId: string;
    type: 'requires' | 'conflicts' | 'enhances';
    description?: string;
}

/**
 * Оценка сложности реализации
 */
export interface ComplexityEstimation {
    requirementId: string;
    score: number; // от 1 до 10
    factors: string[]; // факторы, влияющие на сложность
    timeEstimate?: string; // примерная оценка времени
}

/**
 * Компонент технической спецификации
 */
export interface TechnicalSpecComponent {
    name: string;
    description: string;
    responsibilities: string[];
    interfaces?: string[];
    dependencies?: string[];
    notes?: string;
}

/**
 * Техническая спецификация функции
 */
export interface TechnicalSpecification {
    id: string;
    featureId: string;
    overview: string;
    components: TechnicalSpecComponent[];
    apis?: string[];
    dataStructures?: string[];
    algorithms?: string[];
    securityConsiderations?: string[];
    performanceRequirements?: string[];
    testingStrategy?: string;
    implementationStrategy?: string;
    riskAssessment?: string;
}

/**
 * Результат анализа требований к функции
 */
export interface RequirementsAnalysisResult {
    featureId: string;
    requirements: Requirement[];
    dependencies: RequirementDependency[];
    conflictsFounded: boolean;
    conflicts?: {
        description: string;
        relatedRequirements: string[];
        resolutionOptions?: string[];
    }[];
    complexity: ComplexityEstimation[];
    overallComplexity: number; // обобщенная оценка сложности от 1 до 10
    technicalSpecification?: TechnicalSpecification;
}

/**
 * Параметры для анализа функции
 */
export interface FeatureAnalysisParams {
    featureId: string;
    featureTitle: string;
    featureDescription: string;
    discussionData?: any; // данные из mcp-feature-discussion
    additionalRequirements?: string[]; // дополнительные требования, указанные пользователем
    existingArchitecture?: any; // информация о существующей архитектуре
    priorityWeights?: Record<RequirementPriority, number>; // веса для расчета приоритетов
}

/**
 * Интерфейс для компонента анализа функций
 */
export interface FeatureAnalyzerInterface {
    /**
     * Анализирует функцию на основе предоставленных данных
     * @param params Параметры для анализа
     * @returns Результат анализа требований
     */
    analyzeFeature(params: FeatureAnalysisParams): Promise<RequirementsAnalysisResult>;

    /**
     * Генерирует техническую спецификацию на основе проанализированных требований
     * @param analysisResult Результат анализа требований
     * @returns Техническая спецификация
     */
    generateTechnicalSpecification(analysisResult: RequirementsAnalysisResult): Promise<TechnicalSpecification>;

    /**
     * Проверяет требования на противоречия
     * @param requirements Список требований
     * @returns Найденные противоречия
     */
    checkForContradictions(requirements: Requirement[]): Promise<{
        conflictsFound: boolean;
        conflicts?: {
            description: string;
            relatedRequirements: string[];
            resolutionOptions?: string[];
        }[];
    }>;

    /**
     * Оценивает сложность реализации требований
     * @param requirements Список требований
     * @param existingArchitecture Информация о существующей архитектуре
     * @returns Оценки сложности
     */
    estimateComplexity(
        requirements: Requirement[],
        existingArchitecture?: any
    ): Promise<{
        individualComplexity: ComplexityEstimation[];
        overallComplexity: number;
    }>;
} 
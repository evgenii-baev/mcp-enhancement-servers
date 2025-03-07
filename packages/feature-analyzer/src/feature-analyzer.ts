import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import {
    FeatureAnalyzerInterface,
    FeatureAnalysisParams,
    RequirementsAnalysisResult,
    TechnicalSpecification,
    Requirement,
    RequirementType,
    RequirementPriority,
    RequirementDependency,
    ComplexityEstimation,
    ThinkingLevel,
    ToolType
} from './types.js';
import { FeatureDiscussionAdapter } from './adapters/feature-discussion-adapter.js';

/**
 * Базовый класс для анализа функций в многоуровневой архитектуре мышления
 */
export class FeatureAnalyzer implements FeatureAnalyzerInterface {
    /**
     * Метаданные инструмента мышления
     */
    static readonly metadata = {
        name: 'FeatureAnalyzer',
        description: 'Analyses feature requirements and provides technical specifications',
        level: ThinkingLevel.SPECIALIZED,
        type: ToolType.ANALYZER,
        version: '0.1.0'
    };

    /**
     * Конструктор класса FeatureAnalyzer
     */
    constructor() {
        // Можно добавить зависимости или конфигурацию
    }

    /**
     * Анализирует функцию на основе предоставленных данных
     * @param params Параметры для анализа
     * @returns Результат анализа требований
     */
    async analyzeFeature(params: FeatureAnalysisParams): Promise<RequirementsAnalysisResult> {
        try {
            // Извлечение требований из данных обсуждения и дополнительных требований
            const requirements = await this.extractRequirements(params);

            // Определение зависимостей между требованиями
            const dependencies = await this.identifyDependencies(requirements);

            // Проверка на противоречия
            const contradictionsCheck = await this.checkForContradictions(requirements);

            // Оценка сложности
            const complexityResult = await this.estimateComplexity(requirements, params.existingArchitecture);

            // Генерация технической спецификации
            const technicalSpec = await this.generateTechnicalSpecification({
                featureId: params.featureId,
                requirements,
                dependencies,
                conflictsFounded: contradictionsCheck.conflictsFound,
                conflicts: contradictionsCheck.conflicts,
                complexity: complexityResult.individualComplexity,
                overallComplexity: complexityResult.overallComplexity
            });

            // Формирование финального результата
            return {
                featureId: params.featureId,
                requirements,
                dependencies,
                conflictsFounded: contradictionsCheck.conflictsFound,
                conflicts: contradictionsCheck.conflicts,
                complexity: complexityResult.individualComplexity,
                overallComplexity: complexityResult.overallComplexity,
                technicalSpecification: technicalSpec
            };
        } catch (error) {
            if (error instanceof McpError) {
                throw error;
            }
            throw new McpError(
                ErrorCode.ServerError,
                `Error analyzing feature: ${(error as Error).message}`
            );
        }
    }

    /**
     * Извлекает требования из данных обсуждения и дополнительных входных данных
     * @param params Параметры для анализа
     * @returns Список требований
     */
    private async extractRequirements(params: FeatureAnalysisParams): Promise<Requirement[]> {
        const requirements: Requirement[] = [];

        // Извлечение требований из описания функции
        if (params.featureDescription) {
            requirements.push({
                id: `req_${requirements.length + 1}`,
                description: `Initial requirement extracted from feature description: ${params.featureTitle}`,
                type: RequirementType.FUNCTIONAL,
                priority: RequirementPriority.MEDIUM,
                source: 'feature_description'
            });
        }

        // Извлечение требований из данных обсуждения с использованием адаптера
        if (params.discussionData) {
            try {
                // Преобразование данных обсуждения в наш формат
                const discussionData = FeatureDiscussionAdapter.fromExternalFormat(params.discussionData);

                // Извлечение требований из данных обсуждения
                const discussionRequirements = FeatureDiscussionAdapter.extractRequirements(discussionData);

                // Добавление требований из обсуждения
                requirements.push(...discussionRequirements);
            } catch (error) {
                console.warn(`Warning: Failed to extract requirements from discussion data: ${(error as Error).message}`);
            }
        }

        // Добавление дополнительных требований
        if (params.additionalRequirements && params.additionalRequirements.length > 0) {
            params.additionalRequirements.forEach((req, index) => {
                requirements.push({
                    id: `req_${requirements.length + 1}`,
                    description: req,
                    type: RequirementType.FUNCTIONAL, // По умолчанию
                    priority: RequirementPriority.MEDIUM, // По умолчанию
                    source: 'user_input'
                });
            });
        }

        return requirements;
    }

    /**
     * Определяет зависимости между требованиями
     * @param requirements Список требований
     * @returns Список зависимостей
     */
    private async identifyDependencies(requirements: Requirement[]): Promise<RequirementDependency[]> {
        const dependencies: RequirementDependency[] = [];

        // TODO: Реализовать анализ для выявления зависимостей
        // Это заглушка для демонстрации

        // Пример зависимости для демонстрации
        if (requirements.length >= 2) {
            dependencies.push({
                requirementId: requirements[0].id,
                dependsOnId: requirements[1].id,
                type: 'requires',
                description: 'Automatically identified dependency'
            });
        }

        return dependencies;
    }

    /**
     * Проверяет требования на противоречия
     * @param requirements Список требований
     * @returns Найденные противоречия
     */
    async checkForContradictions(requirements: Requirement[]): Promise<{
        conflictsFound: boolean;
        conflicts?: {
            description: string;
            relatedRequirements: string[];
            resolutionOptions?: string[];
        }[];
    }> {
        // TODO: Реализовать алгоритм выявления противоречий
        // Это заглушка для демонстрации

        return {
            conflictsFound: false
        };
    }

    /**
     * Оценивает сложность реализации требований
     * @param requirements Список требований
     * @param existingArchitecture Информация о существующей архитектуре
     * @returns Оценки сложности
     */
    async estimateComplexity(
        requirements: Requirement[],
        existingArchitecture?: any
    ): Promise<{
        individualComplexity: ComplexityEstimation[];
        overallComplexity: number;
    }> {
        const individualComplexity: ComplexityEstimation[] = [];

        // Оценка сложности для каждого требования
        for (const req of requirements) {
            // TODO: Реализовать алгоритм оценки сложности
            // Это заглушка для демонстрации

            const complexity = {
                requirementId: req.id,
                score: Math.floor(Math.random() * 6) + 3, // Случайная оценка от 3 до 8
                factors: ['Complexity factor placeholder'],
                timeEstimate: '1-2 days' // Заглушка
            };

            individualComplexity.push(complexity);
        }

        // Расчет общей сложности
        const totalScore = individualComplexity.reduce((sum, item) => sum + item.score, 0);
        const overallComplexity = requirements.length > 0
            ? Math.min(10, totalScore / requirements.length * 1.5) // Умножаем на 1.5 для увеличения сложности
            : 0;

        return {
            individualComplexity,
            overallComplexity: Math.round(overallComplexity * 10) / 10 // Округляем до 1 десятичного знака
        };
    }

    /**
     * Генерирует техническую спецификацию на основе проанализированных требований
     * @param analysisResult Результат анализа требований
     * @returns Техническая спецификация
     */
    async generateTechnicalSpecification(analysisResult: RequirementsAnalysisResult): Promise<TechnicalSpecification> {
        // TODO: Реализовать генерацию детальной технической спецификации
        // Это заглушка для демонстрации

        return {
            id: `spec_${analysisResult.featureId}`,
            featureId: analysisResult.featureId,
            overview: `Technical specification for feature ${analysisResult.featureId}`,
            components: [
                {
                    name: 'MainComponent',
                    description: 'Main component for the feature implementation',
                    responsibilities: ['Handle core feature logic'],
                    interfaces: ['IMainComponent'],
                    dependencies: []
                }
            ],
            apis: ['GET /api/feature/{featureId}'],
            dataStructures: ['FeatureData'],
            testingStrategy: 'Unit tests + Integration tests'
        };
    }
} 
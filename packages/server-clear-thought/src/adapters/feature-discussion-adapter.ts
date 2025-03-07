/**
 * Адаптер для интеграции mcp-feature-discussion в архитектуру
 * 
 * Обеспечивает взаимодействие между основной архитектурой мышления
 * и функциональностью обсуждения особенностей.
 */

import { ToolMetadata, ThinkingLevel, ToolType } from '../interfaces/tool-metadata';

/**
 * Интерфейс для функций обсуждения особенностей
 */
export interface FeatureDiscussionFunction {
    beginFeatureDiscussion: (title: string) => Promise<FeatureDiscussionResponse>;
    provideFeatureInput: (featureId: string, response: string) => Promise<FeatureDiscussionResponse>;
}

/**
 * Запрос на начало обсуждения особенностей
 */
export interface BeginFeatureDiscussionRequest {
    /** Заголовок обсуждения */
    title: string;
}

/**
 * Запрос на ввод информации по особенностям
 */
export interface ProvideFeatureInputRequest {
    /** Идентификатор особенности */
    featureId: string;

    /** Ответ пользователя */
    response: string;
}

/**
 * Ответ от функции обсуждения особенностей
 */
export interface FeatureDiscussionResponse {
    /** Идентификатор особенности */
    featureId: string;

    /** Текущий шаг обсуждения */
    currentStep: number;

    /** Общее количество шагов */
    totalSteps: number;

    /** Подсказка для текущего шага */
    prompt: string;

    /** Завершено ли обсуждение */
    completed: boolean;

    /** Итоговый результат обсуждения (если завершено) */
    result?: FeatureDiscussionResult;
}

/**
 * Итоговый результат обсуждения особенностей
 */
export interface FeatureDiscussionResult {
    /** Идентификатор особенности */
    featureId: string;

    /** Заголовок особенности */
    title: string;

    /** Описание особенности */
    description: string;

    /** Требования к особенности */
    requirements: string[];

    /** Ограничения особенности */
    constraints: string[];

    /** Зависимости особенности */
    dependencies?: string[];

    /** Критерии приемки */
    acceptanceCriteria: string[];

    /** Технические детали */
    technicalDetails?: string;

    /** Предлагаемые подходы к реализации */
    implementationApproaches?: string[];

    /** Оценка сложности (1-5) */
    complexityRating?: number;

    /** Оценка приоритета (1-5) */
    priorityRating?: number;

    /** Оценка усилий (человеко-дни) */
    effortEstimate?: number;
}

/**
 * Адаптер для интеграции mcp-feature-discussion
 */
export class FeatureDiscussionAdapter {
    /** Функции обсуждения особенностей */
    private featureDiscussionFunctions: FeatureDiscussionFunction;

    /** Активные обсуждения особенностей */
    private activeDiscussions: Map<string, FeatureDiscussionResponse>;

    /**
     * Создает экземпляр адаптера обсуждения особенностей
     * @param featureDiscussionFunctions Функции обсуждения особенностей
     */
    constructor(featureDiscussionFunctions: FeatureDiscussionFunction) {
        this.featureDiscussionFunctions = featureDiscussionFunctions;
        this.activeDiscussions = new Map<string, FeatureDiscussionResponse>();
    }

    /**
     * Начинает обсуждение особенностей
     * @param request Запрос на начало обсуждения
     * @returns Ответ от функции обсуждения особенностей
     */
    public async beginFeatureDiscussion(
        request: BeginFeatureDiscussionRequest
    ): Promise<FeatureDiscussionResponse> {
        // Вызываем функцию начала обсуждения
        const response = await this.featureDiscussionFunctions.beginFeatureDiscussion(request.title);

        // Сохраняем обсуждение
        this.activeDiscussions.set(response.featureId, response);

        return response;
    }

    /**
     * Предоставляет ввод для обсуждения особенностей
     * @param request Запрос на ввод информации
     * @returns Ответ от функции обсуждения особенностей
     */
    public async provideFeatureInput(
        request: ProvideFeatureInputRequest
    ): Promise<FeatureDiscussionResponse> {
        // Проверяем наличие обсуждения
        if (!this.activeDiscussions.has(request.featureId)) {
            throw new Error(`Обсуждение с идентификатором ${request.featureId} не найдено`);
        }

        // Вызываем функцию ввода информации
        const response = await this.featureDiscussionFunctions.provideFeatureInput(
            request.featureId,
            request.response
        );

        // Обновляем состояние обсуждения
        this.activeDiscussions.set(response.featureId, response);

        return response;
    }

    /**
     * Получает активное обсуждение по идентификатору
     * @param featureId Идентификатор особенности
     * @returns Обсуждение или undefined, если обсуждение не найдено
     */
    public getActiveDiscussion(featureId: string): FeatureDiscussionResponse | undefined {
        return this.activeDiscussions.get(featureId);
    }

    /**
     * Получает все активные обсуждения
     * @returns Массив активных обсуждений
     */
    public getAllActiveDiscussions(): FeatureDiscussionResponse[] {
        return Array.from(this.activeDiscussions.values());
    }

    /**
     * Завершает обсуждение
     * @param featureId Идентификатор особенности
     * @returns true, если обсуждение было удалено, иначе false
     */
    public completeDiscussion(featureId: string): boolean {
        return this.activeDiscussions.delete(featureId);
    }

    /**
     * Получает метаданные инструмента обсуждения особенностей
     * @returns Метаданные инструмента
     */
    public getToolMetadata(): ToolMetadata {
        return {
            name: 'feature_discussion',
            description: 'Инструмент для структурированного обсуждения особенностей и требований',
            level: ThinkingLevel.SPECIALIZED,
            type: ToolType.STRUCTURING,
            parameters: {
                action: {
                    name: 'action',
                    description: 'Действие для выполнения с обсуждением особенностей',
                    type: 'string',
                    required: true,
                    allowedValues: ['begin', 'provide', 'get', 'list', 'complete']
                },
                title: {
                    name: 'title',
                    description: 'Заголовок обсуждения (для действия "begin")',
                    type: 'string',
                    required: false
                },
                featureId: {
                    name: 'featureId',
                    description: 'Идентификатор особенности (для действий "provide", "get", "complete")',
                    type: 'string',
                    required: false
                },
                response: {
                    name: 'response',
                    description: 'Ответ на текущий шаг обсуждения (для действия "provide")',
                    type: 'string',
                    required: false
                }
            },
            resultFormat: {
                featureId: {
                    name: 'featureId',
                    description: 'Идентификатор особенности',
                    type: 'string',
                    required: true
                },
                currentStep: {
                    name: 'currentStep',
                    description: 'Текущий шаг обсуждения',
                    type: 'number',
                    required: true
                },
                totalSteps: {
                    name: 'totalSteps',
                    description: 'Общее количество шагов',
                    type: 'number',
                    required: true
                },
                prompt: {
                    name: 'prompt',
                    description: 'Подсказка для текущего шага',
                    type: 'string',
                    required: true
                },
                completed: {
                    name: 'completed',
                    description: 'Завершено ли обсуждение',
                    type: 'boolean',
                    required: true
                },
                result: {
                    name: 'result',
                    description: 'Итоговый результат обсуждения (если завершено)',
                    type: 'object',
                    required: false
                }
            },
            examples: [
                {
                    name: 'Начало обсуждения',
                    description: 'Начало обсуждения новой особенности',
                    input: {
                        action: 'begin',
                        title: 'Система аутентификации пользователей'
                    },
                    expectedOutput: {
                        featureId: 'f12345',
                        currentStep: 1,
                        totalSteps: 7,
                        prompt: 'Опишите, какую проблему должна решать эта особенность?',
                        completed: false
                    }
                },
                {
                    name: 'Предоставление ответа',
                    description: 'Предоставление ответа на текущий шаг обсуждения',
                    input: {
                        action: 'provide',
                        featureId: 'f12345',
                        response: 'Система должна обеспечивать безопасную аутентификацию пользователей с использованием электронной почты и пароля.'
                    },
                    expectedOutput: {
                        featureId: 'f12345',
                        currentStep: 2,
                        totalSteps: 7,
                        prompt: 'Какие функциональные требования должны быть у этой системы?',
                        completed: false
                    }
                }
            ],
            interactsWith: [
                'feature_analyzer',
                'architecture_advisor',
                'sequential_thinking'
            ],
            tags: ['feature', 'discussion', 'requirements', 'specification'],
            priority: 70,
            version: '1.0.0',
            updatedAt: new Date().toISOString()
        };
    }

    /**
     * Обрабатывает запрос к инструменту
     * @param params Параметры запроса
     * @returns Результат обработки запроса
     */
    public async processToolRequest(params: any): Promise<any> {
        // Проверяем наличие действия
        if (!params.action) {
            throw new Error('Действие не указано');
        }

        // Обрабатываем запрос в зависимости от действия
        switch (params.action) {
            case 'begin':
                // Проверяем наличие заголовка
                if (!params.title) {
                    throw new Error('Заголовок не указан');
                }

                // Начинаем обсуждение
                return this.beginFeatureDiscussion({
                    title: params.title
                });

            case 'provide':
                // Проверяем наличие идентификатора особенности и ответа
                if (!params.featureId) {
                    throw new Error('Идентификатор особенности не указан');
                }

                if (!params.response) {
                    throw new Error('Ответ не указан');
                }

                // Предоставляем ввод для обсуждения
                return this.provideFeatureInput({
                    featureId: params.featureId,
                    response: params.response
                });

            case 'get':
                // Проверяем наличие идентификатора особенности
                if (!params.featureId) {
                    throw new Error('Идентификатор особенности не указан');
                }

                // Получаем обсуждение
                const discussion = this.getActiveDiscussion(params.featureId);

                if (!discussion) {
                    throw new Error(`Обсуждение с идентификатором ${params.featureId} не найдено`);
                }

                return discussion;

            case 'list':
                // Получаем все активные обсуждения
                return this.getAllActiveDiscussions();

            case 'complete':
                // Проверяем наличие идентификатора особенности
                if (!params.featureId) {
                    throw new Error('Идентификатор особенности не указан');
                }

                // Завершаем обсуждение
                const success = this.completeDiscussion(params.featureId);

                return {
                    success,
                    message: success
                        ? `Обсуждение ${params.featureId} успешно завершено`
                        : `Обсуждение ${params.featureId} не найдено`
                };

            default:
                throw new Error(`Неизвестное действие: ${params.action}`);
        }
    }
} 
/**
 * Мост между существующим сервером и новой архитектурой
 * 
 * Обеспечивает совместимость между оригинальными серверами MCP
 * и новой многоуровневой архитектурой мышления.
 */

import { ThoughtOrchestrator } from '../core/thought-orchestrator';
import { FeatureDiscussionAdapter } from '../adapters/feature-discussion-adapter';
import { FeatureAnalyzer } from '../specialized/feature-analyzer';
import { ThinkingLevel } from '../interfaces/tool-metadata';

// Типы запросов к различным серверам
type MentalModelRequest = { modelName: string; problem: string };
type SequentialThinkingRequest = {
    thought: string;
    thoughtNumber: number;
    totalThoughts: number;
    nextThoughtNeeded: boolean;
    isRevision?: boolean;
    revisesThought?: number;
    branchFromThought?: number;
    branchId?: string;
    needsMoreThoughts?: boolean;
};
type BrainstormingRequest = {
    phase: string;
    sessionId?: string;
    topic?: string;
};
type DebuggingApproachRequest = {
    approachName: string;
    issue: string;
    findings?: string;
    steps?: string[];
    resolution?: string;
};
type StochasticAlgorithmRequest = {
    algorithm: string;
    problem: string;
    parameters: Record<string, any>;
    result?: string;
};
type FeatureDiscussionRequest = {
    title?: string;
    featureId?: string;
    response?: string;
};

/**
 * Мост для интеграции существующих MCP серверов с новой архитектурой
 */
export class ServerBridge {
    /** Координатор мышления */
    private orchestrator: ThoughtOrchestrator;

    /** Адаптер для mcp-feature-discussion */
    private featureDiscussionAdapter?: FeatureDiscussionAdapter;

    /** Анализатор функций */
    private featureAnalyzer?: FeatureAnalyzer;

    /**
     * Создает экземпляр моста
     * @param orchestrator Координатор мышления
     */
    constructor(orchestrator: ThoughtOrchestrator) {
        this.orchestrator = orchestrator;

        // Инициализируем анализатор функций
        this.initFeatureAnalyzer();
    }

    /**
     * Инициализирует адаптер для mcp-feature-discussion
     * @param featureDiscussionFunctions Функции обсуждения особенностей
     */
    public initFeatureDiscussionAdapter(featureDiscussionFunctions: any): void {
        this.featureDiscussionAdapter = new FeatureDiscussionAdapter(featureDiscussionFunctions);

        // Регистрируем инструмент в координаторе
        this.orchestrator.registerTool(
            'feature_discussion',
            this.featureDiscussionAdapter.processToolRequest.bind(this.featureDiscussionAdapter)
        );
    }

    /**
     * Инициализирует анализатор функций
     */
    public initFeatureAnalyzer(): void {
        this.featureAnalyzer = new FeatureAnalyzer();

        // Регистрируем инструмент в координаторе
        this.orchestrator.registerTool(
            'feature_analyzer',
            this.featureAnalyzer.processToolRequest.bind(this.featureAnalyzer)
        );
    }

    /**
     * Обрабатывает запрос к серверу ментальных моделей
     * @param request Запрос к серверу ментальных моделей
     * @returns Результат обработки запроса
     */
    public async handleMentalModelRequest(request: MentalModelRequest): Promise<any> {
        // Преобразуем запрос для обработки в новой архитектуре
        const session = await this.orchestrator.processRequest(request, {
            forceTool: 'mental_model',
            preferredLevel: ThinkingLevel.FOUNDATION,
            maxSteps: 1 // Для ментальных моделей достаточно одного шага
        });

        // Возвращаем результат
        return session.result;
    }

    /**
     * Обрабатывает запрос к серверу последовательного мышления
     * @param request Запрос к серверу последовательного мышления
     * @returns Результат обработки запроса
     */
    public async handleSequentialThinkingRequest(request: SequentialThinkingRequest): Promise<any> {
        // Преобразуем запрос для обработки в новой архитектуре
        const session = await this.orchestrator.processRequest(request, {
            forceTool: 'sequential_thinking',
            preferredLevel: ThinkingLevel.SPECIALIZED,
            maxSteps: 1 // Для каждой мысли достаточно одного шага
        });

        // Возвращаем результат
        return session.result;
    }

    /**
     * Обрабатывает запрос к серверу мозгового штурма
     * @param request Запрос к серверу мозгового штурма
     * @returns Результат обработки запроса
     */
    public async handleBrainstormingRequest(request: BrainstormingRequest): Promise<any> {
        // Преобразуем запрос для обработки в новой архитектуре
        const session = await this.orchestrator.processRequest(request, {
            sessionId: request.sessionId, // Используем существующий идентификатор сессии, если есть
            forceTool: 'brainstorming',
            preferredLevel: ThinkingLevel.SPECIALIZED,
            maxSteps: 1 // Для каждой фазы мозгового штурма достаточно одного шага
        });

        // Возвращаем результат
        return session.result;
    }

    /**
     * Обрабатывает запрос к серверу подходов к отладке
     * @param request Запрос к серверу подходов к отладке
     * @returns Результат обработки запроса
     */
    public async handleDebuggingApproachRequest(request: DebuggingApproachRequest): Promise<any> {
        // Преобразуем запрос для обработки в новой архитектуре
        const session = await this.orchestrator.processRequest(request, {
            forceTool: 'debugging_approach',
            preferredLevel: ThinkingLevel.SPECIALIZED,
            maxSteps: 1 // Для каждого подхода к отладке достаточно одного шага
        });

        // Возвращаем результат
        return session.result;
    }

    /**
     * Обрабатывает запрос к серверу стохастических алгоритмов
     * @param request Запрос к серверу стохастических алгоритмов
     * @returns Результат обработки запроса
     */
    public async handleStochasticAlgorithmRequest(request: StochasticAlgorithmRequest): Promise<any> {
        // Преобразуем запрос для обработки в новой архитектуре
        const session = await this.orchestrator.processRequest(request, {
            forceTool: 'stochastic_algorithm',
            preferredLevel: ThinkingLevel.SPECIALIZED,
            maxSteps: 1 // Для каждого стохастического алгоритма достаточно одного шага
        });

        // Возвращаем результат
        return session.result;
    }

    /**
     * Обрабатывает запрос к серверу обсуждения особенностей
     * @param request Запрос к серверу обсуждения особенностей
     * @returns Результат обработки запроса
     */
    public async handleFeatureDiscussionRequest(request: FeatureDiscussionRequest): Promise<any> {
        // Проверяем инициализацию адаптера
        if (!this.featureDiscussionAdapter) {
            throw new Error('Адаптер обсуждения особенностей не инициализирован');
        }

        // Подготавливаем параметры запроса
        const params: Record<string, any> = {};

        // Определяем действие
        if (request.title) {
            params.action = 'begin';
            params.title = request.title;
        } else if (request.featureId && request.response) {
            params.action = 'provide';
            params.featureId = request.featureId;
            params.response = request.response;
        } else if (request.featureId) {
            params.action = 'get';
            params.featureId = request.featureId;
        } else {
            params.action = 'list';
        }

        // Преобразуем запрос для обработки в новой архитектуре
        const session = await this.orchestrator.processRequest(params, {
            forceTool: 'feature_discussion',
            preferredLevel: ThinkingLevel.SPECIALIZED,
            maxSteps: 1 // Для каждого шага обсуждения особенностей достаточно одного шага
        });

        // Возвращаем результат
        return session.result;
    }

    /**
     * Обрабатывает запрос к первому советнику мысли
     * @param request Запрос к первому советнику мысли
     * @returns Результат обработки запроса
     */
    public async handleFirstThoughtAdvisorRequest(request: any): Promise<any> {
        // Преобразуем запрос для обработки в новой архитектуре
        const session = await this.orchestrator.processRequest(request, {
            forceTool: 'first_thought_advisor',
            preferredLevel: ThinkingLevel.FOUNDATION,
            maxSteps: 1,
            enableIncorporation: true,
            incorporationOptions: {
                maxDepth: 1,
                conflictResolution: 'prioritized'
            }
        });

        // Возвращаем результат
        return session.result;
    }

    /**
     * Обрабатывает запрос к анализатору функций
     * @param request Запрос к анализатору функций
     * @returns Результат обработки запроса
     */
    public async handleFeatureAnalyzerRequest(request: any): Promise<any> {
        // Проверяем инициализацию анализатора
        if (!this.featureAnalyzer) {
            throw new Error('Анализатор функций не инициализирован');
        }

        // Преобразуем запрос для обработки в новой архитектуре
        const session = await this.orchestrator.processRequest(request, {
            forceTool: 'feature_analyzer',
            preferredLevel: ThinkingLevel.SPECIALIZED,
            maxSteps: 1 // Для анализа функций достаточно одного шага
        });

        // Возвращаем результат
        return session.result;
    }

    /**
     * Общий обработчик запросов к инструментам мышления
     * @param toolName Имя инструмента
     * @param request Запрос к инструменту
     * @param options Дополнительные опции обработки
     * @returns Результат обработки запроса
     */
    public async handleToolRequest(
        toolName: string,
        request: any,
        options: {
            preferredLevel?: ThinkingLevel;
            maxSteps?: number;
            enableIncorporation?: boolean;
            incorporationOptions?: any;
        } = {}
    ): Promise<any> {
        // Преобразуем запрос для обработки в новой архитектуре
        const session = await this.orchestrator.processRequest(request, {
            forceTool: toolName,
            preferredLevel: options.preferredLevel,
            maxSteps: options.maxSteps ?? 1,
            enableIncorporation: options.enableIncorporation ?? false,
            incorporationOptions: options.incorporationOptions
        });

        // Возвращаем результат
        return session.result;
    }

    /**
     * Создает функции-обертки для существующего сервера mental_model
     * @returns Объект с функциями-обертками
     */
    public createMentalModelServer(): any {
        return {
            mental_model: async (request: MentalModelRequest) => {
                return this.handleMentalModelRequest(request);
            }
        };
    }

    /**
     * Создает функции-обертки для существующего сервера sequential_thinking
     * @returns Объект с функциями-обертками
     */
    public createSequentialThinkingServer(): any {
        return {
            sequential_thinking: async (request: SequentialThinkingRequest) => {
                return this.handleSequentialThinkingRequest(request);
            }
        };
    }

    /**
     * Создает функции-обертки для существующего сервера brainstorming
     * @returns Объект с функциями-обертками
     */
    public createBrainstormingServer(): any {
        return {
            brainstorming: async (request: BrainstormingRequest) => {
                return this.handleBrainstormingRequest(request);
            }
        };
    }

    /**
     * Создает функции-обертки для существующего сервера debugging_approach
     * @returns Объект с функциями-обертками
     */
    public createDebuggingApproachServer(): any {
        return {
            debugging_approach: async (request: DebuggingApproachRequest) => {
                return this.handleDebuggingApproachRequest(request);
            }
        };
    }

    /**
     * Создает функции-обертки для существующего сервера stochastic_algorithm
     * @returns Объект с функциями-обертками
     */
    public createStochasticAlgorithmServer(): any {
        return {
            stochastic_algorithm: async (request: StochasticAlgorithmRequest) => {
                return this.handleStochasticAlgorithmRequest(request);
            }
        };
    }

    /**
     * Создает функции-обертки для существующего сервера feature_discussion
     * @returns Объект с функциями-обертками
     */
    public createFeatureDiscussionServer(): any {
        return {
            begin_feature_discussion: async (title: string) => {
                return this.handleFeatureDiscussionRequest({ title });
            },
            provide_feature_input: async (featureId: string, response: string) => {
                return this.handleFeatureDiscussionRequest({ featureId, response });
            }
        };
    }

    /**
     * Создает функции-обертки для существующего сервера first_thought_advisor
     * @returns Объект с функциями-обертками
     */
    public createFirstThoughtAdvisorServer(): any {
        return {
            first_thought_advisor: async (request: any) => {
                return this.handleFirstThoughtAdvisorRequest(request);
            }
        };
    }

    /**
     * Создает функции-обертки для анализатора функций
     * @returns Объект с функциями-обертками
     */
    public createFeatureAnalyzerServer(): any {
        return {
            feature_analyzer: async (request: any) => {
                return this.handleFeatureAnalyzerRequest(request);
            }
        };
    }

    /**
     * Создает функции-обертки для всех существующих серверов
     * @returns Объект с функциями-обертками для всех серверов
     */
    public createAllServers(): any {
        return {
            ...this.createMentalModelServer(),
            ...this.createSequentialThinkingServer(),
            ...this.createBrainstormingServer(),
            ...this.createDebuggingApproachServer(),
            ...this.createStochasticAlgorithmServer(),
            ...this.createFeatureDiscussionServer(),
            ...this.createFirstThoughtAdvisorServer(),
            ...this.createFeatureAnalyzerServer()
        };
    }
} 
/**
 * Маршрутизатор запросов
 * 
 * Отвечает за маршрутизацию запросов к соответствующим инструментам
 * мышления на основе предпочтительного уровня и других критериев.
 */

import { ToolRegistry } from './tool-registry';
import { ToolInteractionAPI } from './tool-interaction-api';
import { SessionContext } from './session-context';
import { ThinkingLevel } from '../interfaces/tool-metadata';

/**
 * Опции маршрутизации запросов
 */
export interface RequestRoutingOptions {
    /**
     * Предпочтительный уровень инструмента
     */
    preferredLevel?: ThinkingLevel;

    /**
     * Принудительно использовать указанный инструмент
     */
    forceTool?: string;

    /**
     * Максимальное количество шагов
     */
    maxSteps?: number;

    /**
     * Принудительно использовать указанный тип инструмента
     */
    forceToolType?: string;

    /**
     * Принудительно искать инструменты с требуемыми тегами
     */
    requiredTags?: string[];

    /**
     * Игнорировать инструменты с указанными тегами
     */
    excludeTags?: string[];
}

/**
 * Маршрутизатор запросов
 */
export class RequestRouter {
    /** Регистр инструментов мышления */
    private toolRegistry: ToolRegistry;

    /** API взаимодействия с инструментами */
    private toolApi: ToolInteractionAPI;

    /**
     * Создает экземпляр маршрутизатора запросов
     * @param toolRegistry Регистр инструментов мышления
     * @param toolApi API взаимодействия с инструментами
     */
    constructor(toolRegistry: ToolRegistry, toolApi: ToolInteractionAPI) {
        this.toolRegistry = toolRegistry;
        this.toolApi = toolApi;
    }

    /**
     * Маршрутизирует запрос к соответствующему инструменту
     * @param request Запрос к инструменту
     * @param context Контекст сессии
     * @param options Опции маршрутизации
     * @returns Результат обработки запроса
     */
    public async routeRequest(
        request: any,
        context: SessionContext,
        options: RequestRoutingOptions = {}
    ): Promise<any> {
        // Если указан принудительный инструмент, используем его
        if (options.forceTool) {
            const toolName = options.forceTool;

            if (!this.toolRegistry.hasTool(toolName)) {
                throw new Error(`Принудительный инструмент ${toolName} не найден`);
            }

            // Вызываем инструмент и возвращаем результат
            return this.toolApi.callTool(toolName, request, context);
        }

        // Определяем тип запроса на основе его содержимого
        const toolType = this.determineToolType(request, options);

        // Выбираем подходящий инструмент на основе типа и других критериев
        const selectedTool = this.selectToolForType(toolType, request, options);

        // Вызываем выбранный инструмент и возвращаем результат
        return this.toolApi.callTool(selectedTool, request, context);
    }

    /**
     * Определяет тип инструмента на основе запроса
     * @param request Запрос к инструменту
     * @param options Опции маршрутизации
     * @returns Тип инструмента
     */
    private determineToolType(request: any, options: RequestRoutingOptions): string {
        // Если принудительно указан тип инструмента, используем его
        if (options.forceToolType) {
            return options.forceToolType;
        }

        // Определяем тип на основе свойств запроса
        if (request.modelName) {
            return 'mental_model';
        } else if (request.thought && (request.thoughtNumber || request.nextThoughtNeeded !== undefined)) {
            return 'sequential_thinking';
        } else if (request.phase !== undefined && (request.topic || request.sessionId)) {
            return 'brainstorming';
        } else if (request.approachName && request.issue) {
            return 'debugging_approach';
        } else if (request.algorithm && request.problem) {
            return 'stochastic_algorithm';
        } else if (request.problem && request.goal) {
            return 'first_thought_advisor';
        } else if (request.title || request.featureId) {
            // Более детальная логика для определения между feature_discussion, feature_analyzer и architecture_advisor
            return this.determineFeatureRelatedToolType(request);
        }

        // По умолчанию выбираем инструмент на основе предпочтительного уровня
        return this.getDefaultToolType(options.preferredLevel || ThinkingLevel.BASIC);
    }

    /**
     * Определяет тип инструмента для запросов, связанных с функциями
     * @param request Запрос к инструменту
     * @returns Тип инструмента
     */
    private determineFeatureRelatedToolType(request: any): string {
        // Если запрос содержит action='recommend' и requirements, это запрос к architecture_advisor
        if (request.action === 'recommend' && request.requirements) {
            return 'architecture_advisor';
        }

        // Если запрос содержит action и featureId, но не содержит response, это запрос к feature_analyzer
        if (request.action && request.featureId && request.response === undefined) {
            return 'architecture_advisor';
        }

        // Если запрос содержит featureId и action, но не является запросом к architecture_advisor,
        // это запрос к feature_analyzer
        if (request.featureId && request.action && !this.isArchitectureAdvisorRequest(request)) {
            return 'feature_analyzer';
        }

        // Если запрос содержит title или response, это запрос к feature_discussion
        if (request.title || (request.featureId && request.response)) {
            return 'feature_discussion';
        }

        // По умолчанию считаем запрос запросом к feature_discussion
        return 'feature_discussion';
    }

    /**
     * Проверяет, является ли запрос запросом к советнику по архитектуре
     * @param request Запрос к инструменту
     * @returns true, если запрос к советнику по архитектуре
     */
    private isArchitectureAdvisorRequest(request: any): boolean {
        // Если запрос содержит action из списка действий советника по архитектуре,
        // считаем его запросом к советнику по архитектуре
        return request.action && ['recommend', 'get', 'clear'].includes(request.action);
    }

    /**
     * Возвращает тип инструмента по умолчанию для указанного уровня
     * @param level Уровень инструмента
     * @returns Тип инструмента по умолчанию
     */
    private getDefaultToolType(level: ThinkingLevel): string {
        switch (level) {
            case ThinkingLevel.META:
                return 'first_thought_advisor';
            case ThinkingLevel.SPECIALIZED:
                return 'feature_discussion';
            case ThinkingLevel.BASIC:
            default:
                return 'sequential_thinking';
        }
    }

    /**
     * Выбирает подходящий инструмент на основе типа и других критериев
     * @param toolType Тип инструмента
     * @param request Запрос к инструменту
     * @param options Опции маршрутизации
     * @returns Имя выбранного инструмента
     */
    private selectToolForType(toolType: string, request: any, options: RequestRoutingOptions): string {
        // Получаем все инструменты указанного типа
        const tools = this.toolRegistry.searchTools({
            type: toolType,
            tags: options.requiredTags
        });

        // Исключаем инструменты с запрещенными тегами
        const filteredTools = options.excludeTags
            ? tools.filter(tool =>
                !tool.tags || !options.excludeTags?.some(tag => tool.tags!.includes(tag))
            )
            : tools;

        // Если не найдено ни одного подходящего инструмента, выбрасываем ошибку
        if (filteredTools.length === 0) {
            throw new Error(`Не найдено подходящих инструментов для типа ${toolType}`);
        }

        // Выбираем инструмент с самым высоким приоритетом
        const selectedTool = filteredTools.reduce((best, current) =>
            (current.priority || 0) > (best.priority || 0) ? current : best
            , filteredTools[0]);

        // Возвращаем имя выбранного инструмента
        return selectedTool.name;
    }
} 
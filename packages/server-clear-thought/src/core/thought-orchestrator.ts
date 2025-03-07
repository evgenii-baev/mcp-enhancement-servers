/**
 * Координатор мышления
 * 
 * Центральный компонент архитектуры, отвечающий за координацию
 * всех мыслительных процессов и инструментов.
 */

import { ToolInteractionAPI } from './tool-interaction-api';
import { ToolRegistry } from './tool-registry';
import { ThoughtRouter } from './thought-router';
import { IncorporationSystem } from './incorporation-system';
import { ThinkingLevel } from '../interfaces/tool-metadata';

/**
 * Сессия мышления
 */
export interface ThinkingSession {
    /** Идентификатор сессии */
    id: string;

    /** Временная метка создания сессии */
    createdAt: string;

    /** Последнее обновление сессии */
    updatedAt: string;

    /** Исходный запрос */
    initialRequest: unknown;

    /** История обработки запроса */
    history: ThinkingHistoryItem[];

    /** Контекст сессии */
    context: Record<string, any>;

    /** Статус сессии */
    status: 'active' | 'completed' | 'error';

    /** Результат сессии */
    result?: any;

    /** Ошибка, если сессия завершилась с ошибкой */
    error?: string;
}

/**
 * Запись в истории мышления
 */
export interface ThinkingHistoryItem {
    /** Временная метка записи */
    timestamp: string;

    /** Инструмент, который обрабатывал запрос */
    toolName: string;

    /** Входные параметры для инструмента */
    input: any;

    /** Результат работы инструмента */
    output?: any;

    /** Уверенность в выборе инструмента */
    confidence: number;

    /** Альтернативные инструменты */
    alternatives?: Array<{ tool: string, confidence: number }>;

    /** Включенные результаты */
    incorporatedResults?: Array<{
        sourceToolName: string;
        incorporatedCount: number;
        success: boolean;
    }>;

    /** Ошибка, если возникла */
    error?: string;
}

/**
 * Опции обработки запроса
 */
export interface ProcessRequestOptions {
    /** Идентификатор сессии (если нужно продолжить существующую) */
    sessionId?: string;

    /** Принудительное использование определенного инструмента */
    forceTool?: string;

    /** Контекст запроса */
    context?: Record<string, any>;

    /** Максимальное количество шагов обработки */
    maxSteps?: number;

    /** Максимальное время обработки (в миллисекундах) */
    timeout?: number;

    /** Включать ли процесс инкорпорации результатов */
    enableIncorporation?: boolean;

    /** Опции инкорпорации */
    incorporationOptions?: {
        /** Максимальная глубина включения */
        maxDepth?: number;

        /** Стратегия разрешения конфликтов */
        conflictResolution?: 'first' | 'last' | 'merge' | 'prioritized';
    };

    /** Предпочтительный уровень инструментов */
    preferredLevel?: ThinkingLevel;
}

/**
 * Координатор мышления
 */
export class ThoughtOrchestrator {
    /** API для взаимодействия между инструментами */
    private interactionAPI: ToolInteractionAPI;

    /** Реестр инструментов */
    private registry: ToolRegistry;

    /** Маршрутизатор запросов */
    private router: ThoughtRouter;

    /** Система включения результатов */
    private incorporationSystem: IncorporationSystem;

    /** Активные сессии мышления */
    private sessions: Map<string, ThinkingSession>;

    /**
     * Создает экземпляр координатора мышления
     */
    constructor() {
        // Инициализируем компоненты
        this.registry = new ToolRegistry();
        this.interactionAPI = new ToolInteractionAPI(this.registry);
        this.router = new ThoughtRouter(this.interactionAPI);
        this.incorporationSystem = new IncorporationSystem(this.interactionAPI);
        this.sessions = new Map<string, ThinkingSession>();
    }

    /**
     * Обрабатывает запрос к системе мышления
     * @param request Запрос
     * @param options Опции обработки запроса
     * @returns Результат обработки запроса
     */
    public async processRequest(
        request: unknown,
        options: ProcessRequestOptions = {}
    ): Promise<ThinkingSession> {
        // Получаем или создаем сессию
        const session = this.getOrCreateSession(request, options);

        try {
            // Устанавливаем таймаут, если указан
            const timeoutPromise = options.timeout
                ? new Promise<never>((_, reject) => {
                    setTimeout(() => {
                        reject(new Error(`Таймаут обработки запроса (${options.timeout} мс)`));
                    }, options.timeout);
                })
                : null;

            // Создаем промис для обработки запроса
            const processPromise = this.executeThinkingProcess(session, options);

            // Запускаем обработку с учетом таймаута
            const result = await (timeoutPromise
                ? Promise.race([processPromise, timeoutPromise])
                : processPromise);

            // Обновляем сессию
            session.status = 'completed';
            session.result = result;
            session.updatedAt = new Date().toISOString();

            return session;
        } catch (error) {
            // В случае ошибки обновляем сессию
            session.status = 'error';
            session.error = error instanceof Error ? error.message : String(error);
            session.updatedAt = new Date().toISOString();

            throw error;
        }
    }

    /**
     * Получает сессию по идентификатору
     * @param sessionId Идентификатор сессии
     * @returns Сессия мышления
     */
    public getSession(sessionId: string): ThinkingSession | undefined {
        return this.sessions.get(sessionId);
    }

    /**
     * Получает все активные сессии
     * @returns Массив активных сессий
     */
    public getAllSessions(): ThinkingSession[] {
        return Array.from(this.sessions.values());
    }

    /**
     * Удаляет сессию
     * @param sessionId Идентификатор сессии
     * @returns true, если сессия была удалена, иначе false
     */
    public deleteSession(sessionId: string): boolean {
        return this.sessions.delete(sessionId);
    }

    /**
     * Регистрирует инструмент в системе
     * @param toolName Имя инструмента
     * @param toolImplementation Реализация инструмента
     * @returns true, если инструмент успешно зарегистрирован, иначе false
     */
    public registerTool(toolName: string, toolImplementation: any): boolean {
        // Регистрируем инструмент в API взаимодействия
        return this.interactionAPI.registerTool(toolName, toolImplementation);
    }

    /**
     * Получает или создает сессию мышления
     * @param request Запрос
     * @param options Опции обработки запроса
     * @returns Сессия мышления
     */
    private getOrCreateSession(
        request: unknown,
        options: ProcessRequestOptions
    ): ThinkingSession {
        // Если указан идентификатор сессии, пытаемся найти существующую
        if (options.sessionId && this.sessions.has(options.sessionId)) {
            const session = this.sessions.get(options.sessionId)!;

            // Проверяем статус сессии
            if (session.status === 'completed' || session.status === 'error') {
                throw new Error(`Сессия ${options.sessionId} уже завершена`);
            }

            return session;
        }

        // Создаем новую сессию
        const sessionId = options.sessionId || this.generateSessionId();
        const now = new Date().toISOString();

        const session: ThinkingSession = {
            id: sessionId,
            createdAt: now,
            updatedAt: now,
            initialRequest: request,
            history: [],
            context: options.context || {},
            status: 'active'
        };

        // Сохраняем сессию
        this.sessions.set(sessionId, session);

        return session;
    }

    /**
     * Выполняет процесс мышления
     * @param session Сессия мышления
     * @param options Опции обработки запроса
     * @returns Результат процесса мышления
     */
    private async executeThinkingProcess(
        session: ThinkingSession,
        options: ProcessRequestOptions
    ): Promise<any> {
        // Текущий запрос (изначально равен исходному запросу)
        let currentRequest = session.initialRequest;

        // Максимальное количество шагов
        const maxSteps = options.maxSteps || 10;

        // Выполняем шаги обработки
        for (let step = 0; step < maxSteps; step++) {
            // Маршрутизируем запрос
            const routingResult = await this.router.routeRequest(currentRequest, {
                forceTool: options.forceTool,
                preferredLevel: options.preferredLevel,
                context: { ...session.context, stepNumber: step }
            });

            // Создаем запись в истории
            const historyItem: ThinkingHistoryItem = {
                timestamp: new Date().toISOString(),
                toolName: routingResult.tool,
                input: routingResult.params,
                confidence: routingResult.confidence,
                alternatives: routingResult.alternatives
            };

            try {
                // Выполняем инструмент
                const output = await this.interactionAPI.callTool(
                    routingResult.tool,
                    routingResult.params
                );

                // Включаем результаты других инструментов, если включена инкорпорация
                let processedOutput = output;
                if (options.enableIncorporation !== false) {
                    const incorporationResult = await this.incorporationSystem.processIncorporation(
                        routingResult.tool,
                        output,
                        {
                            maxDepth: options.incorporationOptions?.maxDepth,
                            conflictResolution: options.incorporationOptions?.conflictResolution,
                            context: { ...session.context, stepNumber: step }
                        }
                    );

                    // Обновляем результат
                    processedOutput = incorporationResult.result;

                    // Добавляем информацию о включенных результатах в историю
                    historyItem.incorporatedResults = incorporationResult.incorporations.map(inc => ({
                        sourceToolName: inc.sourceToolName,
                        incorporatedCount: inc.incorporatedCount || 0,
                        success: inc.success
                    }));
                }

                // Обновляем запись в истории
                historyItem.output = processedOutput;

                // Проверяем, нужно ли продолжать обработку
                if (this.isProcessingComplete(routingResult.tool, processedOutput)) {
                    // Добавляем запись в историю
                    session.history.push(historyItem);

                    // Обработка завершена, возвращаем результат
                    return processedOutput;
                }

                // Обновляем текущий запрос результатом предыдущего шага
                currentRequest = processedOutput;
            } catch (error) {
                // В случае ошибки добавляем информацию в историю
                historyItem.error = error instanceof Error ? error.message : String(error);

                // Добавляем запись в историю
                session.history.push(historyItem);

                // Пробрасываем ошибку дальше
                throw error;
            }

            // Добавляем запись в историю
            session.history.push(historyItem);
        }

        // Если достигнуто максимальное количество шагов, возвращаем последний результат
        return currentRequest;
    }

    /**
     * Проверяет, завершена ли обработка запроса
     * @param toolName Имя инструмента
     * @param result Результат работы инструмента
     * @returns true, если обработка завершена, иначе false
     */
    private isProcessingComplete(toolName: string, result: any): boolean {
        // Получаем метаданные инструмента
        const metadata = this.interactionAPI.getToolMetadata(toolName);
        if (!metadata) {
            return true;
        }

        // В зависимости от инструмента и результата определяем, завершена ли обработка

        // Инструменты финального уровня всегда завершают обработку
        if (metadata.level === ThinkingLevel.INTEGRATED) {
            return true;
        }

        // Если результат содержит флаг о завершении, используем его
        if (
            typeof result === 'object' &&
            result !== null &&
            'processingComplete' in result
        ) {
            return Boolean(result.processingComplete);
        }

        // По умолчанию обработка не завершена
        return false;
    }

    /**
     * Генерирует уникальный идентификатор сессии
     * @returns Идентификатор сессии
     */
    private generateSessionId(): string {
        return `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    }
} 
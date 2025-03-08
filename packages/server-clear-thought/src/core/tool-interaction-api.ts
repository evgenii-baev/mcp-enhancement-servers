/**
 * API для межинструментального взаимодействия
 * 
 * Обеспечивает возможность взаимодействия между различными инструментами мышления,
 * включая вызов инструментов, кэширование результатов и управление метаданными.
 */

import { ToolMetadata, IncorporationOptions, ThinkingLevel } from '../interfaces/tool-metadata.js';

/**
 * Результат вызова инструмента
 */
export interface ToolResult {
    /** Имя вызванного инструмента */
    tool: string;

    /** Результат выполнения инструмента */
    result: any;

    /** Успешность выполнения */
    success: boolean;

    /** Сообщение об ошибке (если success === false) */
    error?: string;

    /** Дополнительные метаданные результата */
    metadata?: Record<string, any>;

    /** Время выполнения в миллисекундах */
    executionTime?: number;
}

/**
 * Опции вызова инструмента
 */
export interface ToolCallOptions {
    /** Должен ли результат кэшироваться */
    cache?: boolean;

    /** Время жизни кэша в миллисекундах */
    cacheTTL?: number;

    /** Параметры инкорпорации других инструментов */
    incorporation?: IncorporationOptions;

    /** Контекстные данные для вызова */
    context?: Record<string, any>;

    /** Максимальное время выполнения в миллисекундах */
    timeout?: number;
}

/**
 * API для взаимодействия между инструментами
 */
export class ToolInteractionAPI {
    /** Кэш результатов вызовов инструментов */
    private cache: Map<string, { result: any, timestamp: number, ttl: number }> = new Map();

    /** Сервер для выполнения инструментов */
    private server: any;

    /** Репозиторий метаданных инструментов */
    private toolMetadataRepository: Map<string, ToolMetadata> = new Map();

    /**
     * Создает экземпляр API для межинструментального взаимодействия
     * @param server Сервер для выполнения инструментов
     */
    constructor(server: any) {
        this.server = server;
    }

    /**
     * Вызывает инструмент с заданными параметрами
     * @param toolName Имя инструмента
     * @param params Параметры вызова
     * @param options Опции вызова
     * @returns Результат вызова инструмента
     */
    public async callTool(
        toolName: string,
        params: unknown,
        options: ToolCallOptions = {}
    ): Promise<ToolResult> {
        const startTime = Date.now();

        // Проверяем наличие инструмента
        const toolMetadata = this.toolMetadataRepository.get(toolName);
        if (!toolMetadata) {
            return {
                tool: toolName,
                result: null,
                success: false,
                error: `Tool "${toolName}" not found`,
                executionTime: Date.now() - startTime
            };
        }

        // Пытаемся получить результат из кэша
        if (options.cache !== false) {
            const cacheKey = this.generateCacheKey(toolName, params);
            const cachedResult = this.getCachedResult(cacheKey);

            if (cachedResult) {
                return {
                    tool: toolName,
                    result: cachedResult,
                    success: true,
                    metadata: { fromCache: true },
                    executionTime: 0
                };
            }
        }

        try {
            // Обрабатываем инкорпорацию, если она включена
            let enrichedParams = params;
            if (options.incorporation?.enabled) {
                enrichedParams = await this.handleIncorporation(
                    toolName,
                    params,
                    options.incorporation,
                    options.context || {}
                );
            }

            // Выполняем инструмент
            const result = await this.executeToolOnServer(toolName, enrichedParams, options);

            // Кэшируем результат, если требуется
            if (options.cache !== false) {
                const cacheKey = this.generateCacheKey(toolName, params);
                this.cacheResult(
                    cacheKey,
                    result,
                    options.cacheTTL || 60000 // По умолчанию кэш живет 1 минуту
                );
            }

            return {
                tool: toolName,
                result,
                success: true,
                executionTime: Date.now() - startTime
            };
        } catch (error) {
            return {
                tool: toolName,
                result: null,
                success: false,
                error: error instanceof Error ? error.message : String(error),
                executionTime: Date.now() - startTime
            };
        }
    }

    /**
     * Выполняет инструмент на сервере
     * @param toolName Имя инструмента
     * @param params Параметры инструмента
     * @param options Опции вызова
     * @returns Результат выполнения
     */
    private async executeToolOnServer(
        toolName: string,
        params: unknown,
        options: ToolCallOptions
    ): Promise<any> {
        // Здесь будет реализация вызова инструмента через сервер
        // Пока это заглушка, которую нужно будет реализовать позже
        return this.server.executeTool(toolName, params);
    }

    /**
     * Обрабатывает результаты инструментов для включения в другие инструменты
     * @param mainToolName Имя основного инструмента
     * @param params Параметры основного инструмента
     * @param incorporation Опции включения
     * @param context Контекст выполнения
     * @returns Обогащенные параметры
     */
    private async handleIncorporation(
        mainToolName: string,
        params: unknown,
        incorporation: IncorporationOptions,
        context: Record<string, any>
    ): Promise<unknown> {
        const toolMetadata = this.toolMetadataRepository.get(mainToolName);
        if (!toolMetadata) {
            return params;
        }

        // Проверяем, что инструменты могут быть инкорпорированы
        const validTools = incorporation.tools.filter(tool =>
            toolMetadata.interactsWith && toolMetadata.interactsWith.includes(tool)
        );

        if (validTools.length === 0) {
            return params;
        }

        let enrichedParams: any = { ...params as object };
        const toolResults: Record<string, any> = {};

        // Выполняем инструменты в соответствии с режимом инкорпорации
        switch (incorporation.mode) {
            case 'sequential':
                for (const tool of validTools) {
                    const toolResult = await this.callTool(tool, {
                        context,
                        params: enrichedParams
                    });

                    if (toolResult.success) {
                        toolResults[tool] = toolResult.result;
                        if (!incorporation.pureMode) {
                            // В режиме не чистой инкорпорации обогащаем параметры результатами
                            enrichedParams = this.enrichParams(enrichedParams, toolResult.result);
                        }
                    }
                }
                break;

            case 'parallel':
                const toolCalls = validTools.map(tool =>
                    this.callTool(tool, { context, params: enrichedParams })
                );

                const results = await Promise.all(toolCalls);

                results.forEach((result, index) => {
                    if (result.success) {
                        const tool = validTools[index];
                        toolResults[tool] = result.result;
                    }
                });

                if (!incorporation.pureMode) {
                    // В режиме не чистой инкорпорации обогащаем параметры всеми результатами
                    results.forEach(result => {
                        if (result.success) {
                            enrichedParams = this.enrichParams(enrichedParams, result.result);
                        }
                    });
                }
                break;

            case 'conditional':
                if (!incorporation.conditions || incorporation.conditions.length === 0) {
                    return params;
                }

                for (const condition of incorporation.conditions) {
                    if (this.evaluateCondition(condition.condition, context, params)) {
                        const toolResult = await this.callTool(condition.tool, {
                            context,
                            params: enrichedParams
                        });

                        if (toolResult.success) {
                            toolResults[condition.tool] = toolResult.result;
                            if (!incorporation.pureMode) {
                                enrichedParams = this.enrichParams(enrichedParams, toolResult.result);
                            }
                        }
                    }
                }
                break;
        }

        // Добавляем результаты инкорпорации
        if (incorporation.pureMode) {
            return {
                ...enrichedParams,
                incorporationResults: toolResults
            };
        } else {
            return enrichedParams;
        }
    }

    /**
     * Оценивает условие для включения результатов
     * @param condition Условие
     * @param context Контекст выполнения
     * @param params Параметры инструмента
     * @returns true, если условие выполнено, иначе false
     */
    private evaluateCondition(
        condition: string,
        context: Record<string, any>,
        params: unknown
    ): boolean {
        try {
            // Создаем функцию для оценки условия с доступом к контексту и параметрам
            const evalFunc = new Function('context', 'params', `return ${condition};`);
            return Boolean(evalFunc(context, params));
        } catch (error) {
            console.error(`Error evaluating condition "${condition}":`, error);
            return false;
        }
    }

    /**
     * Обогащает параметры результатами других инструментов
     * @param params Исходные параметры
     * @param result Результат для включения
     * @returns Обогащенные параметры
     */
    private enrichParams(params: any, result: any): any {
        // Базовая реализация - просто добавляем результаты в enrichments
        return {
            ...params,
            enrichments: {
                ...(params.enrichments || {}),
                [typeof result === 'object' && result !== null && 'tool' in result ? result.tool : 'unnamed']:
                    typeof result === 'object' && result !== null && 'result' in result ? result.result : result
            }
        };
    }

    /**
     * Генерирует ключ кэша для параметров инструмента
     * @param toolName Имя инструмента
     * @param params Параметры инструмента
     * @returns Ключ кэша
     */
    private generateCacheKey(toolName: string, params: unknown): string {
        return `${toolName}:${JSON.stringify(params)}`;
    }

    /**
     * Получает результат из кэша
     * @param cacheKey Ключ кэша
     * @returns Результат из кэша или undefined, если результат не найден или устарел
     */
    private getCachedResult(cacheKey: string): any | undefined {
        const cached = this.cache.get(cacheKey);

        if (!cached) {
            return undefined;
        }

        const now = Date.now();
        if (now - cached.timestamp > cached.ttl) {
            // Результат устарел
            this.cache.delete(cacheKey);
            return undefined;
        }

        return cached.result;
    }

    /**
     * Кэширует результат выполнения инструмента
     * @param cacheKey Ключ кэша
     * @param result Результат выполнения
     * @param ttl Время жизни кэша в миллисекундах
     */
    private cacheResult(cacheKey: string, result: any, ttl: number): void {
        this.cache.set(cacheKey, {
            result,
            timestamp: Date.now(),
            ttl
        });
    }

    /**
     * Очищает весь кэш
     */
    public clearCache(): void {
        this.cache.clear();
    }

    /**
     * Очищает кэш для определенного инструмента
     * @param toolName Имя инструмента
     */
    public clearToolCache(toolName: string): void {
        for (const key of this.cache.keys()) {
            if (key.startsWith(`${toolName}:`)) {
                this.cache.delete(key);
            }
        }
    }

    /**
     * Регистрирует метаданные инструмента
     * @param metadata Метаданные инструмента
     */
    public registerToolMetadata(metadata: ToolMetadata): void {
        this.toolMetadataRepository.set(metadata.name, metadata);
    }

    /**
     * Получает метаданные инструмента
     * @param toolName Имя инструмента
     * @returns Метаданные инструмента или undefined, если инструмент не найден
     */
    public getToolMetadata(toolName: string): ToolMetadata | undefined {
        return this.toolMetadataRepository.get(toolName);
    }

    /**
     * Получает все зарегистрированные метаданные инструментов
     * @returns Массив метаданных инструментов
     */
    public getAllToolMetadata(): ToolMetadata[] {
        return Array.from(this.toolMetadataRepository.values());
    }

    /**
     * Получает метаданные инструментов определенного уровня
     * @param level Уровень инструментов
     * @returns Массив метаданных инструментов указанного уровня
     */
    public getToolMetadataByLevel(level: ThinkingLevel): ToolMetadata[] {
        return Array.from(this.toolMetadataRepository.values())
            .filter(metadata => metadata.level === level);
    }

    /**
     * Регистрирует инструмент в API
     * @param toolName Имя инструмента
     * @param toolImplementation Реализация инструмента
     * @returns true, если инструмент успешно зарегистрирован, иначе false
     */
    public registerTool(toolName: string, toolImplementation: any): boolean {
        if (!toolName || !toolImplementation) {
            return false;
        }

        // Регистрируем инструмент в сервере
        if (this.server && typeof this.server.registerTool === 'function') {
            this.server.registerTool(toolName, toolImplementation);
        }

        return true;
    }
} 
/**
 * Система включения (incorporation) результатов инструментов
 * 
 * Позволяет интегрировать результаты одних инструментов мышления в другие
 * и создавать многоуровневые мыслительные процессы.
 */

import {
    IncorporationMetadata,
    IncorporationResult
} from '../interfaces/tool-metadata';
import { ToolInteractionAPI } from './tool-interaction-api';

/**
 * Опции процесса включения результатов
 */
export interface IncorporationOptions {
    /** Максимальная глубина включения */
    maxDepth?: number;

    /** Пороговое значение для включения */
    threshold?: number;

    /** Форматирование результатов включения */
    formatting?: 'compact' | 'detailed' | 'raw';

    /** Включать ли метаданные об источниках */
    includeSourceMetadata?: boolean;

    /** Стратегия разрешения конфликтов */
    conflictResolution?: 'first' | 'last' | 'merge' | 'prioritized';

    /** Контекст процесса включения */
    context?: Record<string, any>;
}

/**
 * Результат процесса включения
 */
export interface IncorporationBatchResult {
    /** Полученный результат */
    result: any;

    /** Статистика процесса включения */
    stats: {
        /** Общее количество включённых результатов */
        totalIncorporations: number;

        /** Количество успешных включений */
        successfulIncorporations: number;

        /** Количество пропущенных включений */
        skippedIncorporations: number;

        /** Глубина вложенности включений */
        depth: number;

        /** Время, затраченное на процесс включения (мс) */
        timeSpent: number;
    };

    /** Метаданные о прошедших включениях */
    incorporations: IncorporationMetadata[];

    /** Ошибки, возникшие при включении */
    errors?: Error[];
}

/**
 * Система включения результатов инструментов
 */
export class IncorporationSystem {
    /** API для взаимодействия между инструментами */
    private interactionAPI: ToolInteractionAPI;

    /**
     * Создает экземпляр системы включения
     * @param interactionAPI API для взаимодействия между инструментами
     */
    constructor(interactionAPI: ToolInteractionAPI) {
        this.interactionAPI = interactionAPI;
    }

    /**
     * Обрабатывает включение результатов инструментов
     * @param targetToolName Имя целевого инструмента
     * @param targetResult Результат целевого инструмента
     * @param options Опции процесса включения
     * @returns Результат процесса включения
     */
    public async processIncorporation(
        targetToolName: string,
        targetResult: any,
        options: IncorporationOptions = {}
    ): Promise<IncorporationBatchResult> {
        // Время начала процесса включения
        const startTime = Date.now();

        // Настройки по умолчанию
        const opts = {
            maxDepth: options.maxDepth || 2,
            threshold: options.threshold || 0.5,
            formatting: options.formatting || 'detailed',
            includeSourceMetadata: options.includeSourceMetadata !== false,
            conflictResolution: options.conflictResolution || 'prioritized',
            context: options.context || {}
        };

        // Получаем метаданные целевого инструмента
        const targetMetadata = this.interactionAPI.getToolMetadata(targetToolName);
        if (!targetMetadata) {
            throw new Error(`Инструмент ${targetToolName} не найден`);
        }

        // Результаты включения
        const incorporations: IncorporationMetadata[] = [];
        const errors: Error[] = [];

        // Получаем список инструментов, результаты которых можно включить
        const candidates = this.findIncorporationCandidates(targetToolName);

        // Статистика включений
        let successful = 0;
        let skipped = 0;

        // Обрабатываем каждого кандидата на включение
        for (const candidate of candidates) {
            try {
                // Получаем результаты кандидата из кэша
                const cachedResults = this.interactionAPI.getCachedResults(candidate);

                // Если у кандидата нет результатов, пропускаем его
                if (!cachedResults || cachedResults.length === 0) {
                    skipped++;
                    continue;
                }

                // Фильтруем результаты по условиям включения
                const validResults = this.filterResultsByConditions(
                    targetToolName,
                    candidate,
                    cachedResults,
                    opts.context
                );

                // Если нет подходящих результатов, пропускаем
                if (validResults.length === 0) {
                    skipped++;
                    continue;
                }

                // Включаем результаты в целевой инструмент
                const incorporation = await this.incorporateResults(
                    targetToolName,
                    targetResult,
                    candidate,
                    validResults,
                    opts
                );

                // Если включение выполнено успешно, сохраняем результат
                incorporations.push(incorporation);
                successful++;
            } catch (error) {
                errors.push(error instanceof Error ? error : new Error(String(error)));
            }
        }

        // Время окончания процесса включения
        const endTime = Date.now();

        // Формируем итоговый результат включения
        return {
            result: targetResult,
            stats: {
                totalIncorporations: candidates.length,
                successfulIncorporations: successful,
                skippedIncorporations: skipped,
                depth: 1, // Пока поддерживаем только одноуровневое включение
                timeSpent: endTime - startTime
            },
            incorporations,
            errors: errors.length > 0 ? errors : undefined
        };
    }

    /**
     * Находит инструменты, результаты которых можно включить в целевой инструмент
     * @param targetToolName Имя целевого инструмента
     * @returns Список имен инструментов-кандидатов
     */
    private findIncorporationCandidates(targetToolName: string): string[] {
        // Получаем метаданные целевого инструмента
        const targetMetadata = this.interactionAPI.getToolMetadata(targetToolName);
        if (!targetMetadata) {
            return [];
        }

        // Пока просто возвращаем список инструментов, которые можно включить
        // В будущем тут будет более сложная логика выбора кандидатов
        return targetMetadata.interactsWith || [];
    }

    /**
     * Фильтрует результаты инструмента по условиям включения
     * @param targetToolName Имя целевого инструмента
     * @param sourceToolName Имя исходного инструмента
     * @param results Результаты исходного инструмента
     * @param context Контекст процесса включения
     * @returns Отфильтрованные результаты
     */
    private filterResultsByConditions<T>(
        targetToolName: string,
        sourceToolName: string,
        results: T[],
        context: Record<string, any>
    ): T[] {
        // Получаем метаданные исходного инструмента
        const sourceMetadata = this.interactionAPI.getToolMetadata(sourceToolName);
        if (!sourceMetadata) {
            return [];
        }

        // Если нет условий включения, возвращаем все результаты
        const incorporationRules = this.getIncorporationRules(targetToolName, sourceToolName);
        if (!incorporationRules || !incorporationRules.conditions || incorporationRules.conditions.length === 0) {
            return results;
        }

        // Фильтруем результаты по условиям включения
        return results.filter(result => {
            if (!incorporationRules.conditions) return true;

            // Проверяем каждое условие
            for (const condition of incorporationRules.conditions) {
                try {
                    if (!condition.check({ result, context })) {
                        return false;
                    }
                } catch (error) {
                    console.error(`Ошибка при проверке условия включения: ${error}`);
                    return false;
                }
            }

            return true;
        });
    }

    /**
     * Включает результаты исходного инструмента в целевой инструмент
     * @param targetToolName Имя целевого инструмента
     * @param targetResult Результат целевого инструмента
     * @param sourceToolName Имя исходного инструмента
     * @param sourceResults Результаты исходного инструмента
     * @param options Опции процесса включения
     * @returns Метаданные о включении
     */
    private async incorporateResults<T, R>(
        targetToolName: string,
        targetResult: T,
        sourceToolName: string,
        sourceResults: R[],
        options: Required<IncorporationOptions>
    ): Promise<IncorporationMetadata> {
        // Получаем правила включения
        const rules = this.getIncorporationRules(targetToolName, sourceToolName);
        if (!rules) {
            throw new Error(`Правила включения для ${sourceToolName} -> ${targetToolName} не найдены`);
        }

        // Создаем метаданные о включении
        const metadata: IncorporationMetadata = {
            sourceToolName,
            targetToolName,
            timestamp: new Date().toISOString(),
            success: false,
            incorporatedCount: 0
        };

        try {
            // Если есть пользовательская функция включения, используем ее
            if (rules.processor) {
                const result = await rules.processor(targetResult, sourceResults, options);

                // Обновляем метаданные включения
                metadata.success = result.success;
                metadata.incorporatedCount = sourceResults.length;
                metadata.resultType = typeof result.result;

                // Возвращаем результат включения
                return metadata;
            }

            // Если нет пользовательской функции, используем стандартную стратегию включения
            // В зависимости от типа данных и стратегии разрешения конфликтов

            // По умолчанию считаем включение успешным
            metadata.success = true;
            metadata.incorporatedCount = sourceResults.length;

            return metadata;
        } catch (error) {
            // Если произошла ошибка, обновляем метаданные
            metadata.success = false;
            metadata.error = error instanceof Error ? error.message : String(error);

            // И пробрасываем ошибку дальше
            throw error;
        }
    }

    /**
     * Получает правила включения для пары инструментов
     * @param targetToolName Имя целевого инструмента
     * @param sourceToolName Имя исходного инструмента
     * @returns Правила включения или undefined, если их нет
     */
    private getIncorporationRules(targetToolName: string, sourceToolName: string): IncorporationResult | undefined {
        // Здесь будет логика получения правил включения
        // Пока просто заглушка
        return undefined;
    }
} 
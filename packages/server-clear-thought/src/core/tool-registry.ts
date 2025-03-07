/**
 * Реестр инструментов мышления
 * 
 * Центральное хранилище для регистрации, поиска и управления
 * инструментами мышления в архитектуре.
 */

import {
    ToolMetadata,
    ThinkingLevel,
    ToolType,
    IncorporationResult
} from '../interfaces/tool-metadata';

/**
 * Опции поиска инструментов
 */
export interface ToolSearchOptions {
    /** Уровень инструментов */
    level?: ThinkingLevel;

    /** Тип инструментов */
    type?: ToolType;

    /** Теги инструментов */
    tags?: string[];

    /** Поиск по имени (подстрока) */
    nameSubstring?: string;

    /** Поиск по описанию (подстрока) */
    descriptionSubstring?: string;

    /** Список инструментов, с которыми должен взаимодействовать */
    interactsWith?: string[];

    /** Минимальный приоритет */
    minPriority?: number;

    /** Максимальный приоритет */
    maxPriority?: number;

    /** Только экспериментальные инструменты */
    experimental?: boolean;

    /** Требуемые плагины */
    requiredPlugins?: string[];
}

/**
 * Результат регистрации инструмента
 */
export interface ToolRegistrationResult {
    /** Успешность регистрации */
    success: boolean;

    /** Имя зарегистрированного инструмента */
    toolName: string;

    /** Сообщение о результате регистрации */
    message: string;

    /** Ошибка, если регистрация не удалась */
    error?: Error;
}

/**
 * Правило включения между инструментами
 */
export interface IncorporationRule {
    /** Имя исходного инструмента */
    sourceToolName: string;

    /** Имя целевого инструмента */
    targetToolName: string;

    /** Правила включения */
    rules: IncorporationResult;
}

/**
 * Реестр инструментов мышления
 */
export class ToolRegistry {
    /** Зарегистрированные инструменты */
    private tools: Map<string, ToolMetadata>;

    /** Правила включения между инструментами */
    private incorporationRules: Map<string, IncorporationRule>;

    /**
     * Создает экземпляр реестра инструментов
     */
    constructor() {
        this.tools = new Map<string, ToolMetadata>();
        this.incorporationRules = new Map<string, IncorporationRule>();
    }

    /**
     * Регистрирует инструмент мышления
     * @param metadata Метаданные инструмента
     * @returns Результат регистрации
     */
    public registerTool(metadata: ToolMetadata): ToolRegistrationResult {
        try {
            // Проверяем корректность метаданных
            this.validateToolMetadata(metadata);

            // Проверяем, не зарегистрирован ли уже инструмент с таким именем
            if (this.tools.has(metadata.name)) {
                throw new Error(`Инструмент с именем ${metadata.name} уже зарегистрирован`);
            }

            // Регистрируем инструмент
            this.tools.set(metadata.name, metadata);

            return {
                success: true,
                toolName: metadata.name,
                message: `Инструмент ${metadata.name} успешно зарегистрирован`
            };
        } catch (error) {
            return {
                success: false,
                toolName: metadata.name,
                message: `Ошибка при регистрации инструмента ${metadata.name}`,
                error: error instanceof Error ? error : new Error(String(error))
            };
        }
    }

    /**
     * Обновляет метаданные зарегистрированного инструмента
     * @param toolName Имя инструмента
     * @param metadata Новые метаданные инструмента
     * @returns Результат обновления
     */
    public updateToolMetadata(toolName: string, metadata: Partial<ToolMetadata>): ToolRegistrationResult {
        try {
            // Проверяем наличие инструмента
            if (!this.tools.has(toolName)) {
                throw new Error(`Инструмент с именем ${toolName} не найден`);
            }

            // Получаем текущие метаданные
            const currentMetadata = this.tools.get(toolName)!;

            // Обновляем метаданные
            const updatedMetadata = {
                ...currentMetadata,
                ...metadata,
                name: toolName // Имя изменить нельзя
            };

            // Проверяем корректность обновленных метаданных
            this.validateToolMetadata(updatedMetadata);

            // Обновляем инструмент
            this.tools.set(toolName, updatedMetadata);

            return {
                success: true,
                toolName,
                message: `Метаданные инструмента ${toolName} успешно обновлены`
            };
        } catch (error) {
            return {
                success: false,
                toolName,
                message: `Ошибка при обновлении метаданных инструмента ${toolName}`,
                error: error instanceof Error ? error : new Error(String(error))
            };
        }
    }

    /**
     * Удаляет инструмент из реестра
     * @param toolName Имя инструмента
     * @returns Результат удаления
     */
    public unregisterTool(toolName: string): ToolRegistrationResult {
        try {
            // Проверяем наличие инструмента
            if (!this.tools.has(toolName)) {
                throw new Error(`Инструмент с именем ${toolName} не найден`);
            }

            // Удаляем инструмент
            this.tools.delete(toolName);

            // Удаляем все правила включения, связанные с этим инструментом
            this.incorporationRules.forEach((rule, key) => {
                if (rule.sourceToolName === toolName || rule.targetToolName === toolName) {
                    this.incorporationRules.delete(key);
                }
            });

            return {
                success: true,
                toolName,
                message: `Инструмент ${toolName} успешно удален из реестра`
            };
        } catch (error) {
            return {
                success: false,
                toolName,
                message: `Ошибка при удалении инструмента ${toolName}`,
                error: error instanceof Error ? error : new Error(String(error))
            };
        }
    }

    /**
     * Получает метаданные инструмента по имени
     * @param toolName Имя инструмента
     * @returns Метаданные инструмента или undefined, если инструмент не найден
     */
    public getToolMetadata(toolName: string): ToolMetadata | undefined {
        return this.tools.get(toolName);
    }

    /**
     * Проверяет наличие инструмента в реестре
     * @param toolName Имя инструмента
     * @returns true, если инструмент зарегистрирован, иначе false
     */
    public hasTool(toolName: string): boolean {
        return this.tools.has(toolName);
    }

    /**
     * Получает все зарегистрированные инструменты
     * @returns Массив метаданных всех зарегистрированных инструментов
     */
    public getAllTools(): ToolMetadata[] {
        return Array.from(this.tools.values());
    }

    /**
     * Ищет инструменты по заданным критериям
     * @param options Опции поиска
     * @returns Массив метаданных найденных инструментов
     */
    public searchTools(options: ToolSearchOptions = {}): ToolMetadata[] {
        let tools = this.getAllTools();

        // Фильтруем по уровню
        if (options.level !== undefined) {
            tools = tools.filter(tool => tool.level === options.level);
        }

        // Фильтруем по типу
        if (options.type !== undefined) {
            tools = tools.filter(tool => tool.type === options.type);
        }

        // Фильтруем по тегам
        if (options.tags !== undefined && options.tags.length > 0) {
            tools = tools.filter(tool =>
                options.tags!.every(tag => tool.tags.includes(tag))
            );
        }

        // Фильтруем по имени
        if (options.nameSubstring !== undefined) {
            tools = tools.filter(tool =>
                tool.name.toLowerCase().includes(options.nameSubstring!.toLowerCase())
            );
        }

        // Фильтруем по описанию
        if (options.descriptionSubstring !== undefined) {
            tools = tools.filter(tool =>
                tool.description.toLowerCase().includes(options.descriptionSubstring!.toLowerCase())
            );
        }

        // Фильтруем по взаимодействию с другими инструментами
        if (options.interactsWith !== undefined && options.interactsWith.length > 0) {
            tools = tools.filter(tool =>
                options.interactsWith!.every(interactsWith =>
                    tool.interactsWith?.includes(interactsWith)
                )
            );
        }

        // Фильтруем по приоритету
        if (options.minPriority !== undefined) {
            tools = tools.filter(tool => tool.priority >= options.minPriority!);
        }

        if (options.maxPriority !== undefined) {
            tools = tools.filter(tool => tool.priority <= options.maxPriority!);
        }

        // Фильтруем по экспериментальности
        if (options.experimental !== undefined) {
            tools = tools.filter(tool => tool.experimental === options.experimental);
        }

        // Фильтруем по требуемым плагинам
        if (options.requiredPlugins !== undefined && options.requiredPlugins.length > 0) {
            tools = tools.filter(tool =>
                options.requiredPlugins!.every(plugin =>
                    tool.requiredPlugins?.includes(plugin)
                )
            );
        }

        return tools;
    }

    /**
     * Регистрирует правило включения между инструментами
     * @param sourceToolName Имя исходного инструмента
     * @param targetToolName Имя целевого инструмента
     * @param rules Правила включения
     * @returns Результат регистрации
     */
    public registerIncorporationRule(
        sourceToolName: string,
        targetToolName: string,
        rules: IncorporationResult
    ): ToolRegistrationResult {
        try {
            // Проверяем наличие инструментов
            if (!this.tools.has(sourceToolName)) {
                throw new Error(`Исходный инструмент ${sourceToolName} не найден`);
            }

            if (!this.tools.has(targetToolName)) {
                throw new Error(`Целевой инструмент ${targetToolName} не найден`);
            }

            // Создаем ключ для правила
            const ruleKey = `${sourceToolName}->${targetToolName}`;

            // Регистрируем правило
            this.incorporationRules.set(ruleKey, {
                sourceToolName,
                targetToolName,
                rules
            });

            // Обновляем метаданные инструментов
            const sourceMetadata = this.tools.get(sourceToolName)!;
            const targetMetadata = this.tools.get(targetToolName)!;

            // Добавляем связи между инструментами
            if (!sourceMetadata.interactsWith) {
                sourceMetadata.interactsWith = [];
            }

            if (!targetMetadata.interactsWith) {
                targetMetadata.interactsWith = [];
            }

            if (!sourceMetadata.interactsWith.includes(targetToolName)) {
                sourceMetadata.interactsWith.push(targetToolName);
            }

            if (!targetMetadata.interactsWith.includes(sourceToolName)) {
                targetMetadata.interactsWith.push(sourceToolName);
            }

            return {
                success: true,
                toolName: `${sourceToolName}->${targetToolName}`,
                message: `Правило включения между ${sourceToolName} и ${targetToolName} успешно зарегистрировано`
            };
        } catch (error) {
            return {
                success: false,
                toolName: `${sourceToolName}->${targetToolName}`,
                message: `Ошибка при регистрации правила включения между ${sourceToolName} и ${targetToolName}`,
                error: error instanceof Error ? error : new Error(String(error))
            };
        }
    }

    /**
     * Получает правило включения между инструментами
     * @param sourceToolName Имя исходного инструмента
     * @param targetToolName Имя целевого инструмента
     * @returns Правило включения или undefined, если правило не найдено
     */
    public getIncorporationRule(
        sourceToolName: string,
        targetToolName: string
    ): IncorporationResult | undefined {
        const ruleKey = `${sourceToolName}->${targetToolName}`;
        const rule = this.incorporationRules.get(ruleKey);

        return rule?.rules;
    }

    /**
     * Удаляет правило включения между инструментами
     * @param sourceToolName Имя исходного инструмента
     * @param targetToolName Имя целевого инструмента
     * @returns Результат удаления
     */
    public unregisterIncorporationRule(
        sourceToolName: string,
        targetToolName: string
    ): ToolRegistrationResult {
        try {
            const ruleKey = `${sourceToolName}->${targetToolName}`;

            // Проверяем наличие правила
            if (!this.incorporationRules.has(ruleKey)) {
                throw new Error(`Правило включения между ${sourceToolName} и ${targetToolName} не найдено`);
            }

            // Удаляем правило
            this.incorporationRules.delete(ruleKey);

            return {
                success: true,
                toolName: `${sourceToolName}->${targetToolName}`,
                message: `Правило включения между ${sourceToolName} и ${targetToolName} успешно удалено`
            };
        } catch (error) {
            return {
                success: false,
                toolName: `${sourceToolName}->${targetToolName}`,
                message: `Ошибка при удалении правила включения между ${sourceToolName} и ${targetToolName}`,
                error: error instanceof Error ? error : new Error(String(error))
            };
        }
    }

    /**
     * Получает все правила включения для инструмента
     * @param toolName Имя инструмента
     * @param direction Направление включения ('source' - инструмент является источником, 'target' - целью, 'both' - любое)
     * @returns Массив правил включения
     */
    public getToolIncorporationRules(
        toolName: string,
        direction: 'source' | 'target' | 'both' = 'both'
    ): IncorporationRule[] {
        const rules: IncorporationRule[] = [];

        this.incorporationRules.forEach(rule => {
            if (
                (direction === 'source' && rule.sourceToolName === toolName) ||
                (direction === 'target' && rule.targetToolName === toolName) ||
                (direction === 'both' && (rule.sourceToolName === toolName || rule.targetToolName === toolName))
            ) {
                rules.push(rule);
            }
        });

        return rules;
    }

    /**
     * Валидирует метаданные инструмента
     * @param metadata Метаданные инструмента
     * @throws Ошибку, если метаданные некорректны
     */
    private validateToolMetadata(metadata: ToolMetadata): void {
        // Проверяем обязательные поля
        if (!metadata.name) {
            throw new Error('Имя инструмента отсутствует');
        }

        if (!metadata.description) {
            throw new Error('Описание инструмента отсутствует');
        }

        if (!metadata.level) {
            throw new Error('Уровень инструмента отсутствует');
        }

        if (!metadata.type) {
            throw new Error('Тип инструмента отсутствует');
        }

        if (!metadata.parameters) {
            throw new Error('Параметры инструмента отсутствуют');
        }

        if (!metadata.resultFormat) {
            throw new Error('Формат результата инструмента отсутствует');
        }

        if (!metadata.examples || metadata.examples.length === 0) {
            throw new Error('Примеры использования инструмента отсутствуют');
        }

        if (!metadata.tags || metadata.tags.length === 0) {
            throw new Error('Теги инструмента отсутствуют');
        }

        if (metadata.priority === undefined) {
            throw new Error('Приоритет инструмента отсутствует');
        }

        if (!metadata.version) {
            throw new Error('Версия инструмента отсутствует');
        }

        if (!metadata.updatedAt) {
            throw new Error('Дата обновления инструмента отсутствует');
        }

        // Проверяем корректность значений
        if (metadata.priority < 0 || metadata.priority > 100) {
            throw new Error('Приоритет инструмента должен быть от 0 до 100');
        }

        // Проверяем корректность версии
        if (!metadata.version.match(/^\d+\.\d+\.\d+$/)) {
            throw new Error('Версия инструмента должна соответствовать формату semver (x.y.z)');
        }

        // Проверяем корректность даты обновления
        try {
            new Date(metadata.updatedAt);
        } catch (error) {
            throw new Error('Дата обновления инструмента должна быть валидной датой ISO');
        }
    }
} 
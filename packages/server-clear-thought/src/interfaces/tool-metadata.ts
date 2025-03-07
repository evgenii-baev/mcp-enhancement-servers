/**
 * Интерфейсы для метаданных инструментов мышления
 * 
 * Эти интерфейсы определяют структуру метаданных для инструментов в многоуровневой
 * архитектуре мышления, включая уровни, зависимости и возможности инкорпорации.
 */

/**
 * Уровни мышления
 */
export enum ThinkingLevel {
    /** Базовый уровень мышления */
    FOUNDATION = 'foundation',

    /** Специализированный уровень мышления */
    SPECIALIZED = 'specialized',

    /** Интегрированный уровень мышления */
    INTEGRATED = 'integrated'
}

/**
 * Типы инструментов мышления
 */
export enum ToolType {
    /** Инструмент анализа */
    ANALYSIS = 'analysis',

    /** Инструмент генерации идей */
    GENERATION = 'generation',

    /** Инструмент принятия решений */
    DECISION = 'decision',

    /** Инструмент структурирования информации */
    STRUCTURING = 'structuring',

    /** Инструмент координации и управления */
    ORCHESTRATION = 'orchestration',

    /** Инструмент рефлексии и самоанализа */
    REFLECTION = 'reflection'
}

/**
 * Режимы инкорпорации инструментов
 */
export enum IncorporationMode {
    /** Последовательный вызов инструментов */
    SEQUENTIAL = 'sequential',

    /** Параллельный вызов инструментов */
    PARALLEL = 'parallel',

    /** Условный вызов инструментов */
    CONDITIONAL = 'conditional'
}

/**
 * Условие для условной инкорпорации
 */
export interface IncorporationCondition {
    /** Имя инструмента */
    tool: string;

    /** Условие для вызова инструмента (JavaScript-выражение) */
    condition: string;
}

/**
 * Опции инкорпорации инструментов
 */
export interface IncorporationOptions {
    /** Включена ли инкорпорация */
    enabled: boolean;

    /** Список инструментов для инкорпорации */
    tools: string[];

    /** Режим инкорпорации */
    mode: IncorporationMode;

    /** Включен ли "чистый режим" без смешивания результатов */
    pureMode: boolean;

    /** Условия для условной инкорпорации (только для mode === 'conditional') */
    conditions?: IncorporationCondition[];
}

/**
 * Параметр инструмента
 */
export interface ToolParameter {
    /** Название параметра */
    name: string;

    /** Описание параметра */
    description: string;

    /** Тип параметра */
    type: 'string' | 'number' | 'boolean' | 'object' | 'array';

    /** Является ли параметр обязательным */
    required: boolean;

    /** Возможные допустимые значения (для enum-подобных параметров) */
    allowedValues?: any[];

    /** Схема для объектных параметров */
    schema?: Record<string, ToolParameter>;

    /** Схема для элементов массива */
    items?: ToolParameter;

    /** Значение по умолчанию */
    defaultValue?: any;
}

/**
 * Пример использования инструмента
 */
export interface ToolExample {
    /** Название примера */
    name: string;

    /** Описание примера */
    description: string;

    /** Входные параметры для примера */
    input: Record<string, any>;

    /** Ожидаемый результат */
    expectedOutput: any;
}

/**
 * Условие для использования инструмента
 */
export interface ToolCondition {
    /** Описание условия */
    description: string;

    /** Функция проверки условия */
    check: (context: Record<string, any>) => boolean;
}

/**
 * Метаданные инструмента мышления
 */
export interface ToolMetadata {
    /** Название инструмента */
    name: string;

    /** Описание инструмента */
    description: string;

    /** Уровень мышления */
    level: ThinkingLevel;

    /** Тип инструмента */
    type: ToolType;

    /** Входные параметры */
    parameters: Record<string, ToolParameter>;

    /** Формат результата */
    resultFormat: Record<string, ToolParameter>;

    /** Примеры использования */
    examples: ToolExample[];

    /** Условия для использования инструмента */
    conditions?: ToolCondition[];

    /** Инструменты, с которыми может взаимодействовать */
    interactsWith?: string[];

    /** Теги для категоризации */
    tags: string[];

    /** Приоритет инструмента (чем выше, тем важнее) */
    priority: number;

    /** Ограничения по использованию */
    limits?: {
        /** Максимальное время выполнения (в миллисекундах) */
        maxExecutionTime?: number;

        /** Максимальное количество входных параметров */
        maxInputSize?: number;

        /** Максимальный размер выходных данных */
        maxOutputSize?: number;

        /** Максимальное количество вызовов в минуту */
        maxCallsPerMinute?: number;
    };

    /** Плагины, требуемые для работы */
    requiredPlugins?: string[];

    /** Является ли инструмент экспериментальным */
    experimental?: boolean;

    /** Версия инструмента */
    version: string;

    /** Дата последнего обновления */
    updatedAt: string;
}

/**
 * Репозиторий метаданных инструментов
 */
export interface ToolMetadataRepository {
    /** Получить метаданные инструмента по имени */
    getToolMetadata(name: string): ToolMetadata | undefined;

    /** Получить все метаданные инструментов */
    getAllToolMetadata(): ToolMetadata[];

    /** Получить метаданные инструментов определенного уровня */
    getToolMetadataByLevel(level: ThinkingLevel): ToolMetadata[];

    /** Добавить метаданные инструмента */
    addToolMetadata(metadata: ToolMetadata): void;

    /** Обновить метаданные инструмента */
    updateToolMetadata(name: string, metadata: Partial<ToolMetadata>): void;
} 
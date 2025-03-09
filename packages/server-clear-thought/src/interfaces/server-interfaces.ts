/**
 * Основные интерфейсы для MCP Clear Thought Server
 * 
 * Этот файл содержит общие интерфейсы, используемые различными серверами
 * и инструментами мышления.
 */

/**
 * Данные для последовательного мышления
 */
export interface ThoughtData {
    /** Содержание мысли */
    thought: string;

    /** Номер мысли в последовательности */
    thoughtNumber: number;

    /** Общее количество ожидаемых мыслей */
    totalThoughts: number;

    /** Является ли эта мысль пересмотром предыдущей */
    isRevision?: boolean;

    /** Если это пересмотр, то какую мысль он пересматривает */
    revisesThought?: number;

    /** Если это ответвление, то от какой мысли оно отходит */
    branchFromThought?: number;

    /** Идентификатор ветви */
    branchId?: string;

    /** Указывает, нужны ли дополнительные мысли */
    needsMoreThoughts?: boolean;

    /** Нужна ли следующая мысль */
    nextThoughtNeeded: boolean;
}

/**
 * Данные для применения ментальной модели
 */
export interface MentalModelData {
    /** Название ментальной модели */
    modelName: string;

    /** Проблема для анализа с помощью ментальной модели */
    problem: string;

    /** Шаги применения модели */
    steps: string[];

    /** Процесс рассуждения */
    reasoning: string;

    /** Вывод из применения модели */
    conclusion: string;
}

/**
 * Данные для подхода к отладке
 */
export interface DebuggingApproachData {
    /** Название подхода к отладке */
    approachName: string;

    /** Проблема для отладки */
    issue: string;

    /** Шаги процесса отладки */
    steps: string[];

    /** Находки в процессе отладки */
    findings: string;

    /** Решение проблемы */
    resolution: string;
}

/**
 * Общий интерфейс для форматированного вывода
 */
export interface FormattedOutput {
    /** Содержимое ответа */
    content: Array<{
        /** Тип содержимого */
        type: string;

        /** Текст содержимого */
        text: string
    }>;

    /** Флаг ошибки */
    isError?: boolean;
}

/**
 * Интерфейс для стандартизации обработчиков запросов
 */
export interface RequestHandler<T, R> {
    /** Метод обработки запроса */
    processRequest(input: T): Promise<R> | R;
}

/**
 * Интерфейс для метаданных сервера
 */
export interface ServerMetadata {
    /** Название сервера */
    name: string;

    /** Описание сервера */
    description: string;

    /** Версия сервера */
    version: string;

    /** Поддерживаемые возможности */
    capabilities: string[];
} 
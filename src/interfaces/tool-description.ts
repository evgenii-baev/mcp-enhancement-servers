/**
 * Стандартизированный интерфейс для описаний инструментов МСР,
 * используемых ИИ-ассистентами для понимания возможностей и применения
 */

export interface ToolCapabilityDescription {
    name: string;
    description: string;
    keyParameters: string[];
}

export interface ToolIntegrationDescription {
    withAI: string;
    examples: string[];
}

export interface ToolDescription {
    // Основная информация
    name: string;
    purpose: string;

    // Руководство по использованию
    whenToUse: string[];
    capabilities: ToolCapabilityDescription[];

    // Примеры и лучшие практики
    exampleScenarios: string[];
    bestPractices: string[];

    // Информация об интеграции с ИИ
    integration: ToolIntegrationDescription;

    // Дополнительные поля, специфичные для конкретного инструмента
    [key: string]: any;
}

/**
 * Функция для создания описания инструмента,
 * гарантирующая соответствие стандартному формату
 */
export function createToolDescription(description: ToolDescription): ToolDescription {
    return description;
}

/**
 * Проверяет наличие описаний для всех параметров инструмента
 * @param toolParameters Параметры инструмента
 * @returns Объект с результатами проверки
 */
export function validateParameterDescriptions(toolParameters: Record<string, any>): {
    valid: boolean;
    missingDescriptions: string[]
} {
    const missingDescriptions: string[] = [];

    for (const [paramName, paramDef] of Object.entries(toolParameters)) {
        if (!paramDef.description || paramDef.description.trim() === '') {
            missingDescriptions.push(paramName);
        }
    }

    return {
        valid: missingDescriptions.length === 0,
        missingDescriptions
    };
} 
/**
 * Утилиты для создания и работы с описаниями инструментов
 */

import { ToolDescription, ToolIntegrationDescription } from '../interfaces/tool-description.js';

/**
 * Создает структурированное описание инструмента
 * @param description Объект с описанием инструмента
 * @returns Структурированное описание инструмента
 */
export function createToolDescription(description: Partial<ToolDescription>): ToolDescription {
    // Проверка обязательных полей
    if (!description.name) {
        throw new Error('Tool description must have a name');
    }

    if (!description.purpose) {
        throw new Error(`Tool description for ${description.name} must have a purpose`);
    }

    // Создание дефолтной интеграции, если она не указана
    const defaultIntegration: ToolIntegrationDescription = {
        withAI: `AI assistants can use the ${description.name} tool to enhance their problem-solving capabilities`,
        examples: []
    };

    // Создание описания с дефолтными значениями
    return {
        name: description.name,
        purpose: description.purpose,
        whenToUse: description.whenToUse || [],
        capabilities: description.capabilities || [],
        exampleScenarios: description.exampleScenarios || [],
        bestPractices: description.bestPractices || [],
        integration: description.integration || defaultIntegration,
        parameterDescriptions: description.parameterDescriptions || {},
        exampleUsage: description.exampleUsage || {}
    };
}

/**
 * Проверяет наличие описаний для всех параметров инструмента
 * @param description Описание инструмента
 * @returns Результат проверки с информацией о недостающих описаниях
 */
export function validateParameterDescriptions(description: ToolDescription): {
    valid: boolean;
    missingDescriptions: string[]
} {
    const result = {
        valid: true,
        missingDescriptions: [] as string[]
    };

    if (!description.parameterDescriptions) {
        result.valid = false;
        result.missingDescriptions.push(`${description.name} has no parameterDescriptions`);
        return result;
    }

    const parameterDescriptions = description.parameterDescriptions as Record<string, string>;
    const capabilities = description.capabilities || [];

    for (const capability of capabilities) {
        const keyParameters = capability.keyParameters || [];

        for (const param of keyParameters) {
            if (!parameterDescriptions[param]) {
                result.valid = false;
                result.missingDescriptions.push(`${description.name}/${capability.name}: missing description for parameter ${param}`);
            }
        }
    }

    return result;
}

/**
 * Генерирует шаблон описания параметра на основе его имени
 * @param paramName Имя параметра
 * @returns Шаблон описания параметра
 */
export function generateParameterDescriptionTemplate(paramName: string): string {
    // Преобразуем camelCase в слова
    const words = paramName.replace(/([A-Z])/g, ' $1').toLowerCase();
    const readableName = words.charAt(0).toUpperCase() + words.slice(1);

    // Генерируем шаблон в зависимости от имени параметра
    if (paramName.includes('name')) {
        return `The name of the ${paramName.replace('Name', '').toLowerCase()} to be processed or analyzed.`;
    }

    if (paramName.includes('id')) {
        return `Unique identifier for the ${paramName.replace('Id', '').toLowerCase()}.`;
    }

    if (paramName.includes('description')) {
        return `Detailed description of the ${paramName.replace('Description', '').toLowerCase()}.`;
    }

    if (paramName.includes('type')) {
        return `The type or category of the ${paramName.replace('Type', '').toLowerCase()}.`;
    }

    if (paramName.includes('list') || paramName.includes('array') || paramName.endsWith('s')) {
        return `A collection of ${paramName.replace(/s$/, '').toLowerCase()} items.`;
    }

    if (paramName.includes('options')) {
        return `Configuration options for the operation.`;
    }

    if (paramName.includes('config')) {
        return `Configuration settings for the operation.`;
    }

    // Общий шаблон
    return `${readableName} for the operation.`;
} 
/**
 * Индексный файл для экспорта всех описаний инструментов
 */

// Экспорт описаний из файлов
export { FIRST_THOUGHT_ADVISOR_DESCRIPTION } from './first-thought-advisor-description.js';

// Экспорт улучшенных описаний для инструментов
export {
    MENTAL_MODEL_TOOL_DESCRIPTION,
    SEQUENTIAL_THINKING_TOOL_DESCRIPTION,
    DEBUGGING_APPROACH_TOOL_DESCRIPTION,
    BRAINSTORMING_TOOL_DESCRIPTION,
    STOCHASTIC_ALGORITHM_TOOL_DESCRIPTION,
    FIRST_THOUGHT_ADVISOR_TOOL_DESCRIPTION,
    FEATURE_DISCUSSION_TOOL_DESCRIPTION,
    FEATURE_ANALYZER_TOOL_DESCRIPTION,
    MODEL_SELECTOR_TOOL_DESCRIPTION
} from './improved-descriptions.js';

// Импорт для локального использования
import { FIRST_THOUGHT_ADVISOR_DESCRIPTION } from './first-thought-advisor-description.js';
import {
    MENTAL_MODEL_TOOL_DESCRIPTION,
    SEQUENTIAL_THINKING_TOOL_DESCRIPTION,
    DEBUGGING_APPROACH_TOOL_DESCRIPTION,
    BRAINSTORMING_TOOL_DESCRIPTION,
    STOCHASTIC_ALGORITHM_TOOL_DESCRIPTION,
    FEATURE_DISCUSSION_TOOL_DESCRIPTION,
    FEATURE_ANALYZER_TOOL_DESCRIPTION,
    MODEL_SELECTOR_TOOL_DESCRIPTION
} from './improved-descriptions.js';

/**
 * Возвращает объект с описаниями всех инструментов в формате для ИИ-ассистентов
 */
export function getAllToolDescriptions() {
    return {
        firstThoughtAdvisor: FIRST_THOUGHT_ADVISOR_DESCRIPTION,
        mentalModel: MENTAL_MODEL_TOOL_DESCRIPTION,
        sequentialThinking: SEQUENTIAL_THINKING_TOOL_DESCRIPTION,
        debuggingApproach: DEBUGGING_APPROACH_TOOL_DESCRIPTION,
        brainstorming: BRAINSTORMING_TOOL_DESCRIPTION,
        stochasticAlgorithm: STOCHASTIC_ALGORITHM_TOOL_DESCRIPTION,
        featureDiscussion: FEATURE_DISCUSSION_TOOL_DESCRIPTION,
        featureAnalyzer: FEATURE_ANALYZER_TOOL_DESCRIPTION,
        modelSelector: MODEL_SELECTOR_TOOL_DESCRIPTION
    };
}

/**
 * Проверяет наличие описаний параметров в описаниях инструментов
 * @returns Результат проверки описаний параметров
 */
export function validateToolParameterDescriptions() {
    const results = {
        total: 0,
        valid: 0,
        missingDescriptions: [] as string[]
    };

    const descriptions = getAllToolDescriptions();

    for (const [toolName, description] of Object.entries(descriptions)) {
        results.total++;

        if (!description.parameterDescriptions) {
            results.missingDescriptions.push(`${toolName} has no parameterDescriptions`);
            continue;
        }

        const parameterDescriptions = description.parameterDescriptions as Record<string, string>;
        const capabilities = description.capabilities || [];

        for (const capability of capabilities) {
            const keyParameters = capability.keyParameters || [];

            for (const param of keyParameters) {
                if (!parameterDescriptions[param]) {
                    results.missingDescriptions.push(`${toolName}/${capability.name}: missing description for parameter ${param}`);
                }
            }
        }

        if (results.missingDescriptions.length === results.total) {
            results.valid++;
        }
    }

    return results;
} 
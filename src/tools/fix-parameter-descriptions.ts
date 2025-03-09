/**
 * Скрипт для автоматического исправления отсутствующих описаний параметров инструментов
 */

import { validateAllToolParameters } from './parameter-validator.js';
import { servers } from '../../index.js';

// Шаблоны для автоматического заполнения описаний параметров
const descriptionTemplates: Record<string, string> = {
    // Общие параметры
    'problem': 'The specific problem or challenge that requires analysis. Be detailed and precise to receive relevant recommendations.',
    'goal': 'The specific outcome or objective you\'re trying to achieve. A clear goal helps focus the analysis.',
    'domain': 'The field or context in which the problem exists (e.g., software engineering, machine learning, business).',
    'complexity': 'Assessment of problem difficulty on a scale (low, moderate, high).',
    'constraints': 'Any limitations, boundaries, or requirements that affect potential solutions.',
    'previousApproaches': 'Methods or strategies already attempted, allowing the advisor to suggest novel alternatives.',
    'result': 'Expected or desired outcome from applying the approach.',

    // Параметры для Sequential Thinking
    'thought': 'The specific thought or step in the reasoning process.',
    'thoughtNumber': 'The current position in the sequence of thoughts (starts at 1).',
    'totalThoughts': 'The total number of thoughts planned for this sequence.',
    'nextThoughtNeeded': 'Whether another thought should follow in the sequence.',
    'branchFromThought': 'Optional number indicating which previous thought this branches from.',
    'branchId': 'Optional identifier for this particular branch of thinking.',
    'isRevision': 'Whether this thought revises a previous thought in the sequence.',
    'revisesThought': 'Number of the thought being revised.',
    'needsMoreThoughts': 'Whether the sequence should be extended beyond the initial plan.',

    // Параметры для Mental Model
    'modelName': 'The specific mental model to apply (e.g., first_principles, occams_razor).',

    // Параметры для Debugging Approach
    'approachName': 'The debugging approach to apply (e.g., binary_search, cause_elimination).',
    'issue': 'Description of the problem or bug that needs to be fixed.',
    'findings': 'Current observations or information discovered about the issue.',
    'steps': 'Sequence of specific actions to take as part of the debugging process.',
    'resolution': 'The solution or fix identified through the debugging process.',

    // Параметры для Brainstorming
    'phase': 'The current phase of the brainstorming process (preparation, ideation, clarification, etc.).',
    'sessionId': 'Unique identifier for this brainstorming session for continuity.',
    'topic': 'The main subject or problem for brainstorming.',

    // Параметры для Stochastic Algorithm
    'algorithm': 'The specific stochastic algorithm to apply (mdp, mcts, bandit, etc.).',
    'parameters': 'Algorithm-specific configuration parameters as a structured object.',

    // Параметры для Feature Discussion
    'featureId': 'Unique identifier for the feature being discussed.',
    'title': 'Name or title of the feature being discussed.',
    'response': 'Your input or response to the current discussion prompt.',

    // Параметры для Feature Analyzer
    'featureName': 'Name of the feature to analyze.',
    'featureDescription': 'Detailed description of the feature and its purpose.',

    // Параметры для Architecture Advisor
    'requirements': 'Specific functional and non-functional requirements for the architecture.',
    'performance': 'Performance requirements for the system.',
    'security': 'Security requirements or concerns for the system.',
    'scalability': 'How the system needs to scale with increased load or users.',
    'maintainability': 'Requirements for long-term maintenance and extensibility.'
};

/**
 * Исправляет отсутствующие описания параметров в инструментах
 */
export function fixMissingParameterDescriptions(): void {
    const validationResults = validateAllToolParameters();

    // Фильтруем инструменты с отсутствующими описаниями
    const toolsWithMissingDescriptions = validationResults.filter(r => !r.valid);

    if (toolsWithMissingDescriptions.length === 0) {
        console.log('All tools have valid parameter descriptions!');
        return;
    }

    console.log(`Found ${toolsWithMissingDescriptions.length} tools with missing parameter descriptions.`);

    // Исправляем каждый инструмент
    for (const result of toolsWithMissingDescriptions) {
        console.log(`\nFixing ${result.serverName} / ${result.capability}`);

        // Находим сервер и параметры его возможности
        const server = Object.values(servers).find(s => s.name === result.serverName);
        if (!server) {
            console.log(`  Server ${result.serverName} not found!`);
            continue;
        }

        const capability = server.capabilities.find(c => c.name === result.capability);
        if (!capability || !capability.parameters) {
            console.log(`  Capability ${result.capability} not found or has no parameters!`);
            continue;
        }

        // Исправляем отсутствующие описания
        for (const paramName of result.missingDescriptions) {
            console.log(`  - Adding description for parameter: ${paramName}`);

            // Проверяем, есть ли шаблон для этого параметра
            if (descriptionTemplates[paramName]) {
                // Применяем шаблон
                if (typeof capability.parameters[paramName] === 'object') {
                    capability.parameters[paramName].description = descriptionTemplates[paramName];
                } else {
                    // Если параметр не является объектом, преобразуем его
                    capability.parameters[paramName] = {
                        type: typeof capability.parameters[paramName] === 'object'
                            ? capability.parameters[paramName].type || 'any'
                            : 'any',
                        required: typeof capability.parameters[paramName] === 'object'
                            ? capability.parameters[paramName].required || false
                            : false,
                        description: descriptionTemplates[paramName]
                    };
                }
            } else {
                // Если шаблона нет, используем общий шаблон
                if (typeof capability.parameters[paramName] === 'object') {
                    capability.parameters[paramName].description = `Parameter ${paramName} for ${result.capability}.`;
                } else {
                    capability.parameters[paramName] = {
                        type: typeof capability.parameters[paramName] === 'object'
                            ? capability.parameters[paramName].type || 'any'
                            : 'any',
                        required: typeof capability.parameters[paramName] === 'object'
                            ? capability.parameters[paramName].required || false
                            : false,
                        description: `Parameter ${paramName} for ${result.capability}.`
                    };
                }
            }
        }
    }

    // Проверяем результаты после исправления
    const newValidationResults = validateAllToolParameters();
    const remainingToolsWithMissingDescriptions = newValidationResults.filter(r => !r.valid);

    if (remainingToolsWithMissingDescriptions.length === 0) {
        console.log('\nSuccess! All parameter descriptions have been fixed.');
    } else {
        console.log(`\nWarning: ${remainingToolsWithMissingDescriptions.length} tools still have missing parameter descriptions.`);
        console.log('This may be due to nested parameters or other complex structures.');
    }
}

// Запускаем исправление, если скрипт запущен напрямую
if (require.main === module) {
    console.log('Starting to fix missing parameter descriptions...');
    fixMissingParameterDescriptions();
}

export default fixMissingParameterDescriptions; 
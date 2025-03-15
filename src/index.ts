/**
 * Основной файл для экспорта серверов улучшения мышления
 */
import { 
// 1. Инструменты для начального анализа и выбора подхода
FirstThoughtAdvisorServer, // Помощь в выборе начального подхода
ModelSelectorServer, // Описание Model Selector для ИИ
FIRST_THOUGHT_ADVISOR_DESCRIPTION, // Описание FirstThoughtAdvisor для ИИ
// 2. Базовые инструменты структурированного мышления
SequentialThinkingServer, // Основа последовательного мышления
MentalModelServer, // Применение ментальных моделей
DebuggingApproachServer, // Подходы к отладке
// 3. Инструменты для генерации и оптимизации решений
BrainstormingServer, // Структурированный мозговой штурм
StochasticAlgorithmServer // Стохастические алгоритмы
 } from './servers/servers-exports.js';

// Импорт описаний инструментов для IDE
import { 
    MENTAL_MODEL_TOOL_DESCRIPTION, 
    SEQUENTIAL_THINKING_TOOL_DESCRIPTION, 
    DEBUGGING_APPROACH_TOOL_DESCRIPTION, 
    BRAINSTORMING_TOOL_DESCRIPTION, 
    STOCHASTIC_ALGORITHM_TOOL_DESCRIPTION, 
    FEATURE_DISCUSSION_TOOL_DESCRIPTION, 
    FEATURE_ANALYZER_TOOL_DESCRIPTION, 
    MODEL_SELECTOR_TOOL_DESCRIPTION 
} from './tool-descriptions/improved-descriptions.js';

// Создание экземпляров серверов
// 1. Инструменты для начального анализа и выбора подхода
const firstThoughtAdvisorServer = new FirstThoughtAdvisorServer();
const modelSelectorServer = new ModelSelectorServer();

// 2. Базовые инструменты структурированного мышления
const sequentialThinkingServer = new SequentialThinkingServer();
const mentalModelServer = new MentalModelServer();
const debuggingApproachServer = new DebuggingApproachServer();

// 3. Инструменты для генерации и оптимизации решений
const brainstormingServer = new BrainstormingServer();
const stochasticAlgorithmServer = new StochasticAlgorithmServer();

// Экспорт серверов
export const servers = {
    // 1. Инструменты для начального анализа и выбора подхода
    firstThoughtAdvisor: firstThoughtAdvisorServer,
    modelSelector: modelSelectorServer,
    
    // 2. Базовые инструменты структурированного мышления
    sequentialThinking: sequentialThinkingServer,
    mentalModel: mentalModelServer,
    debuggingApproach: debuggingApproachServer,
    
    // 3. Инструменты для генерации и оптимизации решений
    brainstorming: brainstormingServer,
    stochasticAlgorithm: stochasticAlgorithmServer
};

// Функция для получения всех возможностей серверов
export function getAllCapabilities() {
    const capabilities = {};
    
    // Добавление возможностей из всех серверов
    Object.entries(servers).forEach(([name, server]) => {
        if (typeof server.getCapabilities === 'function') {
            capabilities[name] = server.getCapabilities();
        }
    });
    
    return capabilities;
}

// Функция для обработки запроса к серверу
export async function handleServerRequest(serverName, capability, parameters) {
    const server = servers[serverName];
    if (!server) {
        throw new Error(`Server '${serverName}' not found`);
    }
    
    return server.handleRequest({
        capability,
        parameters
    });
}

// Экспорт серверных классов для использования в других модулях
export { 
    FirstThoughtAdvisorServer, 
    ModelSelectorServer, 
    SequentialThinkingServer, 
    MentalModelServer, 
    DebuggingApproachServer, 
    BrainstormingServer, 
    StochasticAlgorithmServer 
};

// Информация о пакете
export const packageInfo = {
    name: 'mcp-enhancement-servers',
    version: '1.0.0',
    description: 'Серверы для улучшения мышления в MCP',
    author: 'MCP Team'
};

// Экспорт информации о возможностях инструментов для ИИ-ассистентов
export const toolDescriptions = {
    modelSelector: MODEL_SELECTOR_TOOL_DESCRIPTION,
    firstThoughtAdvisor: FIRST_THOUGHT_ADVISOR_DESCRIPTION,
    mentalModel: MENTAL_MODEL_TOOL_DESCRIPTION,
    sequentialThinking: SEQUENTIAL_THINKING_TOOL_DESCRIPTION,
    debuggingApproach: DEBUGGING_APPROACH_TOOL_DESCRIPTION,
    brainstorming: BRAINSTORMING_TOOL_DESCRIPTION,
    stochasticAlgorithm: STOCHASTIC_ALGORITHM_TOOL_DESCRIPTION,
    featureDiscussion: FEATURE_DISCUSSION_TOOL_DESCRIPTION,
    featureAnalyzer: FEATURE_ANALYZER_TOOL_DESCRIPTION
}; 
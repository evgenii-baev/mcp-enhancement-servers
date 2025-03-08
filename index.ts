/**
 * Основной файл для экспорта серверов улучшения мышления
 */

import { Server, ServerCapability } from './src/interfaces/server-interfaces.js';
import {
  // 1. Инструменты для начального анализа и выбора подхода
  FirstThoughtAdvisorServer,  // Помощь в выборе начального подхода
  ModelSelectorServer,       // Выбор оптимальной модели
  MODEL_SELECTOR_DESCRIPTION, // Описание Model Selector для ИИ

  // 2. Базовые инструменты структурированного мышления
  SequentialThinkingServer,  // Основа последовательного мышления
  MentalModelServer,  // Применение ментальных моделей
  DebuggingApproachServer,  // Подходы к отладке

  // 3. Инструменты для генерации и оптимизации решений
  BrainstormingServer,  // Структурированный мозговой штурм
  StochasticAlgorithmServer  // Стохастические алгоритмы
} from './src/servers/index.js';

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
  firstThoughtAdvisorServer,
  modelSelectorServer,

  // 2. Базовые инструменты структурированного мышления
  sequentialThinkingServer,
  mentalModelServer,
  debuggingApproachServer,

  // 3. Инструменты для генерации и оптимизации решений
  brainstormingServer,
  stochasticAlgorithmServer
};

// Функция для получения всех возможностей серверов
export function getAllCapabilities(): Record<string, ServerCapability[]> {
  const capabilities: Record<string, ServerCapability[]> = {};

  for (const [name, server] of Object.entries(servers)) {
    capabilities[name] = server.capabilities;
  }

  return capabilities;
}

// Функция для обработки запроса к серверу
export async function handleServerRequest(
  serverName: string,
  capability: string,
  parameters: Record<string, any>
): Promise<any> {
  const server = (servers as Record<string, Server>)[serverName];

  if (!server) {
    throw new Error(`Server '${serverName}' not found`);
  }

  return server.handleRequest({
    capability,
    parameters
  });
}

// Экспорт основных классов для использования в других проектах
// 1. Инструменты для начального анализа и выбора подхода
export { FirstThoughtAdvisorServer } from './src/servers/index.js';
export { ModelSelectorServer, MODEL_SELECTOR_DESCRIPTION } from './src/servers/index.js';

// 2. Базовые инструменты структурированного мышления
export { SequentialThinkingServer } from './src/servers/index.js';
export { MentalModelServer } from './src/servers/index.js';
export { DebuggingApproachServer } from './src/servers/index.js';

// 3. Инструменты для генерации и оптимизации решений
export { BrainstormingServer } from './src/servers/index.js';
export { StochasticAlgorithmServer } from './src/servers/index.js';

// Экспорт интерфейсов
export {
  Server,
  ServerCapability,
  ServerRequest,
  ServerResponse
} from './src/interfaces/server-interfaces.js';

// Информация о пакете
export const packageInfo = {
  name: 'mcp-enhancement-servers',
  version: '1.0.0',
  description: 'Серверы для улучшения мышления в MCP',
  author: 'MCP Team'
};

// Экспорт информации о возможностях инструментов для ИИ-ассистентов
export const toolDescriptions = {
  modelSelector: MODEL_SELECTOR_DESCRIPTION
  // Здесь можно добавлять описания других инструментов по мере их создания
};

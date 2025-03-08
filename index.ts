/**
 * Основной файл для экспорта серверов улучшения мышления
 */

import { Server, ServerCapability } from './src/interfaces/server-interfaces.js';
import {
  // 1. Базовые мыслительные инструменты
  SequentialThinkingServer,  // Основа последовательного мышления
  MentalModelServer,  // Применение ментальных моделей
  DebuggingApproachServer,  // Подходы к отладке

  // 2. Инструменты для генерации идей и анализа
  FirstThoughtAdvisorServer,  // Помощь в выборе начального подхода
  BrainstormingServer,  // Структурированный мозговой штурм

  // 3. Специализированные инструменты для сложных задач
  StochasticAlgorithmServer  // Стохастические алгоритмы
} from './src/servers/index.js';

// Создание экземпляров серверов
// 1. Базовые мыслительные инструменты
const sequentialThinkingServer = new SequentialThinkingServer();
const mentalModelServer = new MentalModelServer();
const debuggingApproachServer = new DebuggingApproachServer();

// 2. Инструменты для генерации идей и анализа
const firstThoughtAdvisorServer = new FirstThoughtAdvisorServer();
const brainstormingServer = new BrainstormingServer();

// 3. Специализированные инструменты для сложных задач
const stochasticAlgorithmServer = new StochasticAlgorithmServer();

// Экспорт серверов
export const servers = {
  // 1. Базовые мыслительные инструменты
  sequentialThinkingServer,
  mentalModelServer,
  debuggingApproachServer,

  // 2. Инструменты для генерации идей и анализа
  firstThoughtAdvisorServer,
  brainstormingServer,

  // 3. Специализированные инструменты для сложных задач
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
// 1. Базовые мыслительные инструменты
export { SequentialThinkingServer } from './src/servers/index.js';
export { MentalModelServer } from './src/servers/index.js';
export { DebuggingApproachServer } from './src/servers/index.js';

// 2. Инструменты для генерации идей и анализа
export { FirstThoughtAdvisorServer } from './src/servers/index.js';
export { BrainstormingServer } from './src/servers/index.js';

// 3. Специализированные инструменты для сложных задач
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

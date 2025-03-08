/**
 * Основной файл для экспорта серверов улучшения мышления
 */

import { Server, ServerCapability } from './src/interfaces/server-interfaces.js';
import {
  MentalModelServer,
  SequentialThinkingServer,
  DebuggingApproachServer,
  BrainstormingServer,
  StochasticAlgorithmServer,
  FirstThoughtAdvisorServer
} from './src/servers/index.js';

// Создание экземпляров серверов
const mentalModelServer = new MentalModelServer();
const sequentialThinkingServer = new SequentialThinkingServer();
const debuggingApproachServer = new DebuggingApproachServer();
const brainstormingServer = new BrainstormingServer();
const stochasticAlgorithmServer = new StochasticAlgorithmServer();
const firstThoughtAdvisorServer = new FirstThoughtAdvisorServer();

// Экспорт серверов
export const servers = {
  mentalModelServer,
  sequentialThinkingServer,
  debuggingApproachServer,
  brainstormingServer,
  stochasticAlgorithmServer,
  firstThoughtAdvisorServer
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
export { MentalModelServer } from './src/servers/index.js';
export { SequentialThinkingServer } from './src/servers/index.js';
export { DebuggingApproachServer } from './src/servers/index.js';
export { BrainstormingServer } from './src/servers/index.js';
export { StochasticAlgorithmServer } from './src/servers/index.js';
export { FirstThoughtAdvisorServer } from './src/servers/index.js';

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

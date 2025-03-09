/**
 * Экспорт серверных классов
 */

import { Server, ServerCapability, ServerRequest, ServerResponse } from '../interfaces/server-interfaces.js';

// Базовый класс для серверов
export class BaseServer implements Server {
    name: string;
    version: string;
    capabilities: ServerCapability[];

    constructor(name: string, version: string, capabilities: ServerCapability[] = []) {
        this.name = name;
        this.version = version;
        this.capabilities = capabilities;
    }

    // Метод для обработки запросов
    async handleRequest(request: ServerRequest): Promise<ServerResponse> {
        const capability = this.capabilities.find(cap => cap.name === request.capability);

        if (!capability) {
            return {
                success: false,
                error: `Capability '${request.capability}' not found`
            };
        }

        try {
            // Заглушка для обработки запроса
            return {
                success: true,
                data: {
                    message: `Processed request for capability '${request.capability}'`,
                    timestamp: new Date().toISOString()
                }
            };
        } catch (error) {
            return {
                success: false,
                error: `Error processing request: ${error instanceof Error ? error.message : String(error)}`
            };
        }
    }
}

// Экспорт специализированных серверов
export { MentalModelServer } from './mental-model-server.js';
export { SequentialThinkingServer } from './sequential-thinking-server.js';
export { DebuggingApproachServer } from './debugging-approach-server.js';
export { BrainstormingServer } from './brainstorming-server.js';
export { StochasticAlgorithmServer } from './stochastic-algorithm-server.js';
export { FirstThoughtAdvisorServer } from './first-thought-advisor-server.js';

// Импорт и экспорт ModelSelectorServer
export { ModelSelectorServer, MODEL_SELECTOR_DESCRIPTION } from './model-selector-server.js';

// Импорт описания FirstThoughtAdvisor
import { FIRST_THOUGHT_ADVISOR_DESCRIPTION } from '../tool-descriptions/first-thought-advisor-description.js';
// Реэкспорт для использования в других модулях
export { FIRST_THOUGHT_ADVISOR_DESCRIPTION }; 
/**
 * Базовый серверный класс
 * This file contains only the BaseServer definition to avoid circular dependencies.
 */

import { Server, ServerCapability, ServerRequest, ServerResponse } from '../../interfaces/server-interfaces.js';

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
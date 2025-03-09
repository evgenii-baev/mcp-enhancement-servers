/**
 * Интерфейсы для серверов и их возможностей
 */

// Интерфейс для возможностей сервера
export interface ServerCapability {
    name: string;
    description: string;
    parameters?: Record<string, any>;
}

// Интерфейс для сервера
export interface Server {
    name: string;
    version: string;
    capabilities: ServerCapability[];
    handleRequest(request: ServerRequest): Promise<ServerResponse>;
}

// Интерфейс для запроса к серверу
export interface ServerRequest {
    capability: string;
    parameters: Record<string, any>;
}

// Интерфейс для ответа от сервера
export interface ServerResponse {
    success: boolean;
    data?: any;
    error?: string;
}

// Интерфейс для обработчика запросов
export interface RequestHandler {
    handleRequest(request: ServerRequest): Promise<ServerResponse>;
}

// Интерфейс для конфигурации сервера
export interface ServerConfig {
    port?: number;
    host?: string;
    timeout?: number;
    maxRequestSize?: number;
}

// Интерфейс для метаданных сервера
export interface ServerMetadata {
    name: string;
    version: string;
    description: string;
    capabilities: ServerCapability[];
    config: ServerConfig;
}

// Интерфейс для статистики сервера
export interface ServerStats {
    uptime: number;
    requestsProcessed: number;
    successRate: number;
    averageResponseTime: number;
    lastRequest: Date;
}

// Интерфейс для логгера сервера
export interface ServerLogger {
    log(level: string, message: string, meta?: Record<string, any>): void;
    info(message: string, meta?: Record<string, any>): void;
    warn(message: string, meta?: Record<string, any>): void;
    error(message: string, meta?: Record<string, any>): void;
    debug(message: string, meta?: Record<string, any>): void;
}

// Экспорт интерфейсов данных мыслей
export {
    SequentialThoughtData,
    MentalModelData,
    DebuggingApproachData,
    BrainstormingData,
    StochasticAlgorithmData,
    FirstThoughtAdvisorData,
    FirstThoughtAdvisorResult,
    FeatureDiscussionData,
    FeatureAnalyzerData,
    ArchitectureAdvisorData,
    FeatureAnalysisResult,
    ArchitectureRecommendation
} from './ThoughtData.js'; 
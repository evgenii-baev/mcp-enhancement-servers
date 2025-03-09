/**
 * Интерфейсы для метаданных инструментов
 */

// Перечисление для уровней мышления
export enum ThinkingLevel {
    Basic = 'basic',
    Intermediate = 'intermediate',
    Advanced = 'advanced'
}

// Интерфейс для метаданных инструмента
export interface ToolMetadata {
    name: string;
    description: string;
    thinkingLevel: ThinkingLevel;
    capabilities: string[];
    useCases: string[];
    parameters?: Record<string, any>;
    examples?: Record<string, any>[];
}

// Интерфейс для запроса к инструменту
export interface ToolRequest {
    name: string;
    parameters: Record<string, any>;
}

// Интерфейс для ответа от инструмента
export interface ToolResponse {
    success: boolean;
    data?: any;
    error?: string;
}

// Интерфейс для обработчика инструмента
export interface ToolHandler {
    handleRequest(request: ToolRequest): Promise<ToolResponse>;
}

// Интерфейс для регистрации инструмента
export interface ToolRegistration {
    metadata: ToolMetadata;
    handler: ToolHandler;
} 
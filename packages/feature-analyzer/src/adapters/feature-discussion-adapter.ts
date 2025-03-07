/**
 * Адаптер для интеграции с mcp-feature-discussion
 */

import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import {
    RequirementType,
    RequirementPriority,
    Requirement
} from '../types.js';

/**
 * Типы для данных feature-discussion
 */
interface FeatureDiscussionPrompt {
    id: string;
    text: string;
    type: string;
}

interface FeatureDiscussionResponse {
    id: string;
    promptId: string;
    response: string;
}

interface FeatureDiscussionData {
    featureId: string;
    title: string;
    prompts: FeatureDiscussionPrompt[];
    responses: FeatureDiscussionResponse[];
}

/**
 * Адаптер для преобразования данных из mcp-feature-discussion
 * в формат, пригодный для анализа в FeatureAnalyzer
 */
export class FeatureDiscussionAdapter {
    /**
     * Преобразует данные из mcp-feature-discussion в требования
     * @param discussionData Данные из mcp-feature-discussion
     * @returns Список требований
     */
    static extractRequirements(discussionData: FeatureDiscussionData): Requirement[] {
        try {
            const requirements: Requirement[] = [];

            // Извлечение требований из заголовка (если применимо)
            if (discussionData.title) {
                requirements.push({
                    id: `req_title_1`,
                    description: `Feature title: ${discussionData.title}`,
                    type: RequirementType.FUNCTIONAL,
                    priority: RequirementPriority.HIGH,
                    source: 'feature_title'
                });
            }

            // Извлечение требований из промптов
            discussionData.prompts.forEach((prompt, index) => {
                // Определяем приоритет на основе типа промпта (если это возможно)
                let priority = RequirementPriority.MEDIUM;
                if (prompt.type.includes('high') || prompt.type.includes('critical')) {
                    priority = RequirementPriority.HIGH;
                } else if (prompt.type.includes('low') || prompt.type.includes('optional')) {
                    priority = RequirementPriority.LOW;
                }

                // Определяем тип требования на основе типа промпта (если это возможно)
                let type = RequirementType.FUNCTIONAL;
                if (prompt.type.includes('performance')) {
                    type = RequirementType.PERFORMANCE;
                } else if (prompt.type.includes('security')) {
                    type = RequirementType.SECURITY;
                } else if (prompt.type.includes('ui') || prompt.type.includes('interface')) {
                    type = RequirementType.USER_INTERFACE;
                }

                requirements.push({
                    id: `req_prompt_${index + 1}`,
                    description: prompt.text,
                    type,
                    priority,
                    source: `prompt_${prompt.id}`
                });
            });

            // Извлечение требований из ответов
            discussionData.responses.forEach((response, index) => {
                // Здесь нужно более сложное извлечение требований из текста
                // Для простоты демо, просто добавляем первое предложение из ответа
                const firstSentence = response.response.split('.')[0].trim();
                if (firstSentence.length > 10) { // Проверка, чтобы избежать пустых или очень коротких предложений
                    requirements.push({
                        id: `req_response_${index + 1}`,
                        description: firstSentence,
                        type: RequirementType.FUNCTIONAL,
                        priority: RequirementPriority.MEDIUM,
                        source: `response_${response.id}`
                    });
                }
            });

            return requirements;
        } catch (error) {
            throw new McpError(
                ErrorCode.ServerError,
                `Error extracting requirements from discussion data: ${(error as Error).message}`
            );
        }
    }

    /**
     * Преобразует данные из внешнего формата feature discussion в формат FeatureDiscussionData
     * @param externalData Данные из внешнего источника
     * @returns Данные в формате FeatureDiscussionData
     */
    static fromExternalFormat(externalData: any): FeatureDiscussionData {
        try {
            // Проверка на необходимые поля
            if (!externalData.id || !externalData.title) {
                throw new Error('Missing required fields in external data format');
            }

            // Сопоставление полей с нашей внутренней структурой
            // Этот метод нужно адаптировать под конкретный формат mcp-feature-discussion
            const prompts: FeatureDiscussionPrompt[] = externalData.prompts?.map((p: any) => ({
                id: p.id,
                text: p.text || p.content || '',
                type: p.type || 'unknown'
            })) || [];

            const responses: FeatureDiscussionResponse[] = externalData.responses?.map((r: any) => ({
                id: r.id,
                promptId: r.promptId,
                response: r.response || r.content || ''
            })) || [];

            return {
                featureId: externalData.id,
                title: externalData.title,
                prompts,
                responses
            };
        } catch (error) {
            throw new McpError(
                ErrorCode.InvalidParams,
                `Error converting external format: ${(error as Error).message}`
            );
        }
    }
} 
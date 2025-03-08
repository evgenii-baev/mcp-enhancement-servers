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
    fullText?: string; // Полный текст обсуждения для анализа
}

/**
 * Индикаторы приоритета требований
 */
const PRIORITY_INDICATORS = {
    high: [
        'must', 'critical', 'essential', 'required', 'mandatory', 'high priority',
        'crucial', 'vital', 'необходимо', 'критически важно', 'обязательно',
        'важнейшее', 'высокий приоритет'
    ],
    medium: [
        'should', 'important', 'medium priority', 'recommended', 'desired',
        'significant', 'желательно', 'рекомендуется', 'важно', 'средний приоритет'
    ],
    low: [
        'may', 'could', 'optional', 'nice to have', 'low priority', 'желательно но не обязательно',
        'можно', 'опционально', 'низкий приоритет'
    ]
};

/**
 * Индикаторы типов требований
 */
const TYPE_INDICATORS = {
    functional: [
        'shall', 'should', 'must', 'will', 'функция', 'действие', 'операция',
        'выполнять', 'обрабатывать', 'реализовать', 'поддерживать',
        'implement', 'support', 'handle', 'process', 'execute', 'perform',
        'function', 'feature', 'capability'
    ],
    performance: [
        'fast', 'quick', 'speed', 'performance', 'efficient', 'optimize',
        'response time', 'throughput', 'latency', 'scalable', 'concurrent',
        'производительность', 'быстро', 'эффективно', 'оптимизация',
        'время отклика', 'пропускная способность', 'масштабируемость'
    ],
    security: [
        'secure', 'encryption', 'authentication', 'authorization', 'security',
        'protected', 'validation', 'privacy', 'confidential', 'integrity',
        'безопасность', 'шифрование', 'аутентификация', 'авторизация',
        'защита', 'валидация', 'конфиденциальность', 'целостность'
    ],
    user_interface: [
        'UI', 'UX', 'interface', 'display', 'screen', 'view', 'layout',
        'user-friendly', 'accessible', 'responsive', 'interactive',
        'интерфейс', 'отображение', 'экран', 'вид', 'доступность',
        'отзывчивость', 'интерактивность', 'дружественный интерфейс'
    ],
    compatibility: [
        'compatible', 'interoperable', 'integrate', 'compatibility',
        'platform', 'browser', 'device', 'environment', 'version',
        'совместимость', 'интероперабельность', 'интеграция',
        'платформа', 'браузер', 'устройство', 'окружение', 'версия'
    ],
    reliability: [
        'reliable', 'robust', 'stability', 'fault tolerance', 'recovery',
        'resilience', 'availability', 'uptime', 'failover', 'backup',
        'надежность', 'стабильность', 'отказоустойчивость',
        'восстановление', 'доступность', 'резервирование'
    ]
};

/**
 * Маркеры начала требований в тексте
 */
const REQUIREMENT_MARKERS = [
    'requirement:', 'feature:', 'must:', 'should:', 'shall:', 'needs to:',
    'требование:', 'функция:', 'должен:', 'необходимо:', 'требуется:',
    'the system shall', 'the system should', 'the system must',
    'система должна', 'система будет', 'система обязана',
    'требуется, чтобы', 'необходимо обеспечить',
    'it is required that', 'it is necessary that'
];

/**
 * Адаптер для преобразования данных из mcp-feature-discussion
 * в формат, пригодный для анализа в FeatureAnalyzer
 */
export class FeatureDiscussionAdapter {
    /**
     * Извлекает требования из текста с использованием различных эвристик
     * @param text Текст для анализа
     * @param source Источник текста
     * @param baseId Базовый идентификатор для генерации ID требований
     * @returns Массив извлеченных требований
     */
    private static extractRequirementsFromText(text: string, source: string, baseId: string): Requirement[] {
        const requirements: Requirement[] = [];

        // Разбиваем текст на предложения
        // Это простая эвристика, для реального приложения может потребоваться более сложная логика
        const sentences = text.split(/(?<=[.!?])\s+/);

        // Проходим по каждому предложению
        sentences.forEach((sentence, index) => {
            const trimmedSentence = sentence.trim();
            if (trimmedSentence.length < 10) return; // Пропускаем короткие предложения

            // Проверяем, содержит ли предложение маркеры требований
            const containsRequirementMarker = REQUIREMENT_MARKERS.some(marker =>
                trimmedSentence.toLowerCase().includes(marker.toLowerCase())
            );

            // Определяем тип требования на основе эвристик
            const type = this.determineRequirementType(trimmedSentence);

            // Определяем приоритет требования на основе эвристик
            const priority = this.determineRequirementPriority(trimmedSentence);

            // Создаем требование, если оно содержит маркеры или если это предложение с определенным типом
            if (containsRequirementMarker || type !== RequirementType.FUNCTIONAL) {
                requirements.push({
                    id: `${baseId}_${index + 1}`,
                    description: trimmedSentence,
                    type,
                    priority,
                    source
                });
            }
        });

        return requirements;
    }

    /**
     * Определяет тип требования на основе текста
     * @param text Текст требования
     * @returns Тип требования
     */
    private static determineRequirementType(text: string): RequirementType {
        const lowerText = text.toLowerCase();

        // Проверяем каждый тип индикаторов
        for (const [type, indicators] of Object.entries(TYPE_INDICATORS)) {
            if (indicators.some(indicator => lowerText.includes(indicator.toLowerCase()))) {
                switch (type) {
                    case 'performance': return RequirementType.PERFORMANCE;
                    case 'security': return RequirementType.SECURITY;
                    case 'user_interface': return RequirementType.USER_INTERFACE;
                    case 'compatibility': return RequirementType.COMPATIBILITY;
                    case 'reliability': return RequirementType.RELIABILITY;
                }
            }
        }

        // По умолчанию - функциональное требование
        return RequirementType.FUNCTIONAL;
    }

    /**
     * Определяет приоритет требования на основе текста
     * @param text Текст требования
     * @returns Приоритет требования
     */
    private static determineRequirementPriority(text: string): RequirementPriority {
        const lowerText = text.toLowerCase();

        // Проверяем каждый тип индикаторов приоритета
        if (PRIORITY_INDICATORS.high.some(indicator => lowerText.includes(indicator.toLowerCase()))) {
            return RequirementPriority.HIGH;
        }

        if (PRIORITY_INDICATORS.low.some(indicator => lowerText.includes(indicator.toLowerCase()))) {
            return RequirementPriority.LOW;
        }

        // По умолчанию - средний приоритет
        return RequirementPriority.MEDIUM;
    }

    /**
     * Удаляет дублирующиеся и похожие требования
     * @param requirements Список требований
     * @returns Список уникальных требований
     */
    private static deduplicateRequirements(requirements: Requirement[]): Requirement[] {
        const uniqueRequirements: Requirement[] = [];
        const descriptions = new Set<string>();

        requirements.forEach(req => {
            // Нормализуем описание для сравнения
            const normalizedDesc = req.description.toLowerCase().trim();

            // Проверяем, есть ли похожее требование по описанию
            let isDuplicate = false;
            for (const desc of descriptions) {
                // Простая проверка на сходство - если описания совпадают более чем на 80%
                // Это простая эвристика, можно использовать более сложные алгоритмы (Levenshtein, Jaccard и т.д.)
                if (this.calculateSimilarity(normalizedDesc, desc) > 0.8) {
                    isDuplicate = true;
                    break;
                }
            }

            if (!isDuplicate) {
                descriptions.add(normalizedDesc);
                uniqueRequirements.push(req);
            }
        });

        return uniqueRequirements;
    }

    /**
     * Рассчитывает сходство между двумя строками (простая реализация)
     * @param str1 Первая строка
     * @param str2 Вторая строка
     * @returns Коэффициент сходства от 0 до 1
     */
    private static calculateSimilarity(str1: string, str2: string): number {
        // Простая реализация на основе общих слов
        // Для более точных результатов можно использовать алгоритмы вроде расстояния Левенштейна
        const words1 = str1.split(/\s+/).filter(Boolean);
        const words2 = str2.split(/\s+/).filter(Boolean);

        const commonWords = words1.filter(word => words2.includes(word)).length;
        const totalWords = new Set([...words1, ...words2]).size;

        return totalWords === 0 ? 0 : commonWords / totalWords;
    }

    /**
     * Преобразует данные из mcp-feature-discussion в требования
     * @param discussionData Данные из mcp-feature-discussion
     * @returns Список требований
     */
    static extractRequirements(discussionData: FeatureDiscussionData): Requirement[] {
        try {
            let requirements: Requirement[] = [];

            // Извлечение требований из заголовка
            if (discussionData.title) {
                requirements.push({
                    id: `req_title_1`,
                    description: `Feature title: ${discussionData.title}`,
                    type: RequirementType.FUNCTIONAL,
                    priority: RequirementPriority.HIGH,
                    source: 'feature_title'
                });

                // Добавляем возможные требования из самого заголовка
                requirements = requirements.concat(
                    this.extractRequirementsFromText(discussionData.title, 'feature_title', 'req_title')
                );
            }

            // Извлечение требований из промптов
            discussionData.prompts.forEach((prompt, index) => {
                // Определяем приоритет и тип на основе метаданных промпта
                let priority = RequirementPriority.MEDIUM;
                let type = RequirementType.FUNCTIONAL;

                // Из метаданных промпта
                if (prompt.type) {
                    const promptType = prompt.type.toLowerCase();
                    if (promptType.includes('high') || promptType.includes('critical')) {
                        priority = RequirementPriority.HIGH;
                    } else if (promptType.includes('low') || promptType.includes('optional')) {
                        priority = RequirementPriority.LOW;
                    }

                    if (promptType.includes('performance')) {
                        type = RequirementType.PERFORMANCE;
                    } else if (promptType.includes('security')) {
                        type = RequirementType.SECURITY;
                    } else if (promptType.includes('ui') || promptType.includes('interface')) {
                        type = RequirementType.USER_INTERFACE;
                    } else if (promptType.includes('compatibility')) {
                        type = RequirementType.COMPATIBILITY;
                    } else if (promptType.includes('reliability')) {
                        type = RequirementType.RELIABILITY;
                    }
                }

                // Добавляем основное требование из промпта
                requirements.push({
                    id: `req_prompt_${index + 1}`,
                    description: prompt.text,
                    type,
                    priority,
                    source: `prompt_${prompt.id}`
                });

                // Извлекаем дополнительные требования из текста промпта
                const promptRequirements = this.extractRequirementsFromText(
                    prompt.text,
                    `prompt_${prompt.id}`,
                    `req_prompt_${index + 1}_sub`
                );

                requirements = requirements.concat(promptRequirements);
            });

            // Извлечение требований из ответов
            discussionData.responses.forEach((response, index) => {
                // Находим связанный промпт для контекста
                const relatedPrompt = discussionData.prompts.find(p => p.id === response.promptId);

                // Извлекаем все требования из ответа
                const responseRequirements = this.extractRequirementsFromText(
                    response.response,
                    `response_${response.id}`,
                    `req_response_${index + 1}`
                );

                // Если нашли требования, добавляем их
                if (responseRequirements.length > 0) {
                    requirements = requirements.concat(responseRequirements);
                } else {
                    // Если не нашли явных требований, используем первое значимое предложение
                    const sentences = response.response.split(/(?<=[.!?])\s+/);
                    for (const sentence of sentences) {
                        if (sentence.trim().length > 20) { // Минимальная длина для значимого предложения
                            let type = RequirementType.FUNCTIONAL;
                            let priority = RequirementPriority.MEDIUM;

                            // Если есть связанный промпт, используем его тип/приоритет как контекст
                            if (relatedPrompt) {
                                const promptType = relatedPrompt.type.toLowerCase();
                                if (promptType.includes('performance')) type = RequirementType.PERFORMANCE;
                                else if (promptType.includes('security')) type = RequirementType.SECURITY;
                                else if (promptType.includes('ui')) type = RequirementType.USER_INTERFACE;

                                if (promptType.includes('high')) priority = RequirementPriority.HIGH;
                                else if (promptType.includes('low')) priority = RequirementPriority.LOW;
                            }

                            requirements.push({
                                id: `req_response_${index + 1}`,
                                description: sentence.trim(),
                                type,
                                priority,
                                source: `response_${response.id}`
                            });
                            break;
                        }
                    }
                }
            });

            // Удаляем дубликаты и похожие требования
            const uniqueRequirements = this.deduplicateRequirements(requirements);

            // Обновляем идентификаторы после дедупликации
            return uniqueRequirements.map((req, index) => ({
                ...req,
                id: `req_${index + 1}`
            }));
        } catch (error) {
            throw new McpError(
                ErrorCode.InternalError,
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

            // Создаем полный текст обсуждения для анализа
            let fullText = `Feature: ${externalData.title}\n\n`;

            // Добавляем текст всех промптов и ответов
            prompts.forEach(prompt => {
                fullText += `${prompt.type}: ${prompt.text}\n`;
            });

            responses.forEach(response => {
                const relatedPrompt = prompts.find(p => p.id === response.promptId);
                fullText += `Response to ${relatedPrompt?.type || 'prompt'}: ${response.response}\n`;
            });

            return {
                featureId: externalData.id,
                title: externalData.title,
                prompts,
                responses,
                fullText
            };
        } catch (error) {
            throw new McpError(
                ErrorCode.InvalidParams,
                `Error converting external format: ${(error as Error).message}`
            );
        }
    }
} 
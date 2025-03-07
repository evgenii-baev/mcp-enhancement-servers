/**
 * Маршрутизатор запросов к инструментам мышления
 * 
 * Анализирует запросы и выбирает оптимальные инструменты для их обработки,
 * а также преобразует параметры для выбранных инструментов.
 */

import { ToolMetadata, ThinkingLevel } from '../interfaces/tool-metadata';
import { ToolInteractionAPI } from './tool-interaction-api';

/**
 * Результат анализа запроса
 */
export interface RequestAnalysis {
    /** Предполагаемая тема запроса */
    topic: string;

    /** Предполагаемый тип запроса */
    type: 'information' | 'analysis' | 'decision' | 'creation' | 'other';

    /** Предполагаемая сложность запроса */
    complexity: 'low' | 'medium' | 'high';

    /** Предполагаемая срочность запроса */
    urgency: 'low' | 'medium' | 'high';

    /** Предполагаемая важность запроса */
    importance: 'low' | 'medium' | 'high';

    /** Предполагаемая область применения */
    domain?: string;

    /** Ключевые слова из запроса */
    keywords: string[];

    /** Рекомендуемые инструменты с весами */
    recommendedTools: Array<{ tool: string, confidence: number }>;
}

/**
 * Опции маршрутизации запроса
 */
export interface RoutingOptions {
    /** Принудительное использование определенного инструмента */
    forceTool?: string;

    /** Предпочтительный уровень инструментов */
    preferredLevel?: ThinkingLevel;

    /** Требуемая минимальная уверенность выбора инструмента */
    minConfidence?: number;

    /** Максимальное количество рекомендуемых инструментов */
    maxRecommendations?: number;

    /** Контекст запроса */
    context?: Record<string, any>;
}

/**
 * Результат маршрутизации запроса
 */
export interface RoutingResult {
    /** Выбранный инструмент */
    tool: string;

    /** Преобразованные параметры для инструмента */
    params: unknown;

    /** Уверенность в выборе инструмента */
    confidence: number;

    /** Альтернативные инструменты */
    alternatives?: Array<{ tool: string, confidence: number }>;

    /** Метаданные выбранного инструмента */
    metadata?: ToolMetadata;
}

/**
 * Маршрутизатор запросов к инструментам мышления
 */
export class ThoughtRouter {
    /** API для взаимодействия между инструментами */
    private interactionAPI: ToolInteractionAPI;

    /**
     * Создает экземпляр маршрутизатора запросов
     * @param interactionAPI API для взаимодействия между инструментами
     */
    constructor(interactionAPI: ToolInteractionAPI) {
        this.interactionAPI = interactionAPI;
    }

    /**
     * Маршрутизирует запрос к подходящему инструменту
     * @param request Исходный запрос
     * @param options Опции маршрутизации
     * @returns Результат маршрутизации
     */
    public async routeRequest(
        request: unknown,
        options: RoutingOptions = {}
    ): Promise<RoutingResult> {
        // Если указан принудительный инструмент, используем его
        if (options.forceTool) {
            const metadata = this.interactionAPI.getToolMetadata(options.forceTool);
            return {
                tool: options.forceTool,
                params: request,
                confidence: 1.0,
                metadata
            };
        }

        // Анализируем запрос
        const analysis = await this.analyzeRequest(request, options.context || {});

        // Выбираем лучший инструмент из рекомендованных
        const selectedTool = this.selectTool(analysis, options);

        // Метаданные выбранного инструмента
        const metadata = this.interactionAPI.getToolMetadata(selectedTool.tool);

        // Преобразуем параметры для выбранного инструмента
        const transformedParams = await this.transformParams(request, selectedTool.tool, options.context || {});

        // Формируем результат маршрутизации
        const result: RoutingResult = {
            tool: selectedTool.tool,
            params: transformedParams,
            confidence: selectedTool.confidence,
            metadata
        };

        // Добавляем альтернативные инструменты
        if (analysis.recommendedTools.length > 1) {
            result.alternatives = analysis.recommendedTools
                .filter(t => t.tool !== selectedTool.tool)
                .slice(0, (options.maxRecommendations || 3) - 1);
        }

        return result;
    }

    /**
     * Анализирует запрос для определения подходящих инструментов
     * @param request Исходный запрос
     * @param context Контекст запроса
     * @returns Результат анализа запроса
     */
    private async analyzeRequest(
        request: unknown,
        context: Record<string, any>
    ): Promise<RequestAnalysis> {
        // Здесь будет реализация анализа запроса
        // Пока это заглушка, которую нужно будет реализовать позже

        // Создаем базовый анализ
        const analysis: RequestAnalysis = {
            topic: 'unknown',
            type: 'other',
            complexity: 'medium',
            urgency: 'medium',
            importance: 'medium',
            keywords: [],
            recommendedTools: []
        };

        // Пытаемся извлечь строковое представление запроса
        let requestText = '';
        if (typeof request === 'string') {
            requestText = request;
        } else if (
            typeof request === 'object' &&
            request !== null &&
            'text' in request &&
            typeof request.text === 'string'
        ) {
            requestText = request.text;
        } else if (
            typeof request === 'object' &&
            request !== null &&
            'query' in request &&
            typeof request.query === 'string'
        ) {
            requestText = request.query;
        } else {
            requestText = JSON.stringify(request);
        }

        // Извлекаем ключевые слова из запроса
        analysis.keywords = this.extractKeywords(requestText);

        // Определяем область применения по ключевым словам
        analysis.domain = this.determineDomain(analysis.keywords);

        // Определяем тип запроса по ключевым словам и структуре
        analysis.type = this.determineRequestType(requestText, analysis.keywords);

        // Определяем сложность по длине запроса и другим факторам
        analysis.complexity = this.determineComplexity(requestText, analysis.keywords);

        // Получаем все доступные инструменты
        const allTools = this.interactionAPI.getAllToolMetadata();

        // Рассчитываем соответствие каждого инструмента запросу
        for (const tool of allTools) {
            const confidence = this.calculateToolConfidence(tool, analysis, context);

            if (confidence > 0.1) { // Минимальный порог уверенности
                analysis.recommendedTools.push({
                    tool: tool.name,
                    confidence
                });
            }
        }

        // Сортируем инструменты по убыванию уверенности
        analysis.recommendedTools.sort((a, b) => b.confidence - a.confidence);

        return analysis;
    }

    /**
     * Извлекает ключевые слова из текста запроса
     * @param text Текст запроса
     * @returns Массив ключевых слов
     */
    private extractKeywords(text: string): string[] {
        // Удаляем лишние символы и приводим к нижнему регистру
        const cleanText = text.toLowerCase().replace(/[^\w\s]/g, ' ');

        // Разбиваем на слова
        const words = cleanText.split(/\s+/).filter(word => word.length > 2);

        // Удаляем стоп-слова
        const stopWords = new Set([
            'the', 'and', 'or', 'but', 'for', 'with', 'about', 'against', 'between',
            'into', 'through', 'during', 'before', 'after', 'above', 'below', 'from',
            'down', 'upon', 'onto', 'under', 'beside', 'over', 'above'
        ]);

        const keywords = words.filter(word => !stopWords.has(word));

        // Находим важные ключевые слова, которые могут указывать на конкретные инструменты
        const importantKeywords = [
            'analyze', 'analysis', 'think', 'thought', 'sequentially', 'sequential',
            'brainstorm', 'ideas', 'debug', 'problem', 'decision', 'decide', 'model',
            'mental', 'framework', 'stochastic', 'random', 'probability', 'simulate',
            'architecture', 'design', 'strategy', 'plan', 'feature', 'reflection',
            'foundation', 'assumption', 'critical', 'evaluate', 'assessment'
        ];

        // Добавляем важные ключевые слова с повышенным приоритетом
        for (const keyword of importantKeywords) {
            if (cleanText.includes(keyword)) {
                keywords.push(keyword);
                // Добавляем дважды для повышения значимости
                keywords.push(keyword);
            }
        }

        return keywords;
    }

    /**
     * Определяет область применения по ключевым словам
     * @param keywords Ключевые слова
     * @returns Область применения
     */
    private determineDomain(keywords: string[]): string | undefined {
        // Сопоставление ключевых слов с доменами
        const domainKeywords: Record<string, string[]> = {
            'tech': ['code', 'software', 'program', 'develop', 'tech', 'algorithm', 'computer'],
            'business': ['business', 'strategy', 'market', 'customer', 'product', 'service', 'finance'],
            'science': ['science', 'research', 'experiment', 'theory', 'hypothesis', 'observation'],
            'personal': ['personal', 'life', 'goal', 'habit', 'productivity', 'improvement', 'self'],
            'education': ['learn', 'teach', 'student', 'education', 'course', 'training', 'knowledge']
        };

        // Подсчитываем совпадения для каждого домена
        const domainScores: Record<string, number> = {};

        for (const [domain, domainWords] of Object.entries(domainKeywords)) {
            domainScores[domain] = 0;

            for (const keyword of keywords) {
                for (const domainWord of domainWords) {
                    if (keyword.includes(domainWord) || domainWord.includes(keyword)) {
                        domainScores[domain] += 1;
                    }
                }
            }
        }

        // Находим домен с максимальным счетом
        let maxScore = 0;
        let maxDomain: string | undefined;

        for (const [domain, score] of Object.entries(domainScores)) {
            if (score > maxScore) {
                maxScore = score;
                maxDomain = domain;
            }
        }

        // Если счет слишком низкий, не определяем домен
        return maxScore >= 2 ? maxDomain : undefined;
    }

    /**
     * Определяет тип запроса по тексту и ключевым словам
     * @param text Текст запроса
     * @param keywords Ключевые слова
     * @returns Тип запроса
     */
    private determineRequestType(text: string, keywords: string[]): 'information' | 'analysis' | 'decision' | 'creation' | 'other' {
        const lowerText = text.toLowerCase();

        // Проверяем наличие ключевых слов, указывающих на тип запроса
        if (
            keywords.some(k => ['analyze', 'analysis', 'understand', 'explain', 'why', 'how', 'what'].includes(k)) ||
            lowerText.includes('analyze') ||
            lowerText.includes('understand') ||
            lowerText.includes('explain')
        ) {
            return 'analysis';
        }

        if (
            keywords.some(k => ['decide', 'decision', 'choose', 'select', 'which', 'better'].includes(k)) ||
            lowerText.includes('should i') ||
            lowerText.includes('which is better') ||
            lowerText.includes('what should')
        ) {
            return 'decision';
        }

        if (
            keywords.some(k => ['create', 'design', 'develop', 'build', 'implement', 'make'].includes(k)) ||
            lowerText.includes('create') ||
            lowerText.includes('design') ||
            lowerText.includes('develop')
        ) {
            return 'creation';
        }

        if (
            keywords.some(k => ['information', 'details', 'tell', 'what is', 'who is'].includes(k)) ||
            lowerText.includes('what is') ||
            lowerText.includes('tell me about') ||
            lowerText.includes('information on') ||
            lowerText.includes('details about')
        ) {
            return 'information';
        }

        return 'other';
    }

    /**
     * Определяет сложность запроса
     * @param text Текст запроса
     * @param keywords Ключевые слова
     * @returns Уровень сложности
     */
    private determineComplexity(text: string, keywords: string[]): 'low' | 'medium' | 'high' {
        // Оцениваем сложность по разным факторам

        // 1. Длина запроса
        const length = text.length;
        let complexityScore = 0;

        if (length < 50) {
            complexityScore += 0;
        } else if (length < 150) {
            complexityScore += 1;
        } else {
            complexityScore += 2;
        }

        // 2. Количество ключевых слов
        if (keywords.length < 5) {
            complexityScore += 0;
        } else if (keywords.length < 10) {
            complexityScore += 1;
        } else {
            complexityScore += 2;
        }

        // 3. Наличие сложных конструкций и терминов
        const complexTerms = [
            'algorithm', 'architecture', 'optimization', 'simulation', 'infrastructure',
            'scaling', 'probability', 'statistical', 'integration', 'comparative',
            'comprehensive', 'framework', 'theoretical', 'implementation', 'strategy'
        ];

        let complexTermsCount = 0;
        for (const term of complexTerms) {
            if (text.toLowerCase().includes(term)) {
                complexTermsCount++;
            }
        }

        if (complexTermsCount < 2) {
            complexityScore += 0;
        } else if (complexTermsCount < 4) {
            complexityScore += 1;
        } else {
            complexityScore += 2;
        }

        // Определяем итоговую сложность по сумме факторов
        if (complexityScore < 2) {
            return 'low';
        } else if (complexityScore < 4) {
            return 'medium';
        } else {
            return 'high';
        }
    }

    /**
     * Вычисляет уверенность соответствия инструмента запросу
     * @param tool Метаданные инструмента
     * @param analysis Анализ запроса
     * @param context Контекст запроса
     * @returns Уверенность (от 0 до 1)
     */
    private calculateToolConfidence(
        tool: ToolMetadata,
        analysis: RequestAnalysis,
        context: Record<string, any>
    ): number {
        let confidence = 0;

        // Сопоставляем уровень сложности запроса с уровнем инструмента
        if (analysis.complexity === 'low' && tool.level === ThinkingLevel.FOUNDATION) {
            confidence += 0.2;
        } else if (analysis.complexity === 'medium' && tool.level === ThinkingLevel.SPECIALIZED) {
            confidence += 0.2;
        } else if (analysis.complexity === 'high' && tool.level === ThinkingLevel.INTEGRATED) {
            confidence += 0.2;
        }

        // Проверяем ключевые слова, специфичные для каждого инструмента
        const toolKeywords: Record<string, string[]> = {
            'first_thought_advisor': ['start', 'beginning', 'approach', 'method', 'advisor', 'recommendation'],
            'mental_model': ['model', 'mental', 'framework', 'principle', 'concept', 'approach'],
            'sequential_thinking': ['sequential', 'step', 'phase', 'process', 'sequence', 'linear', 'thought'],
            'thought_foundation': ['foundation', 'assumption', 'axiom', 'premise', 'basis', 'fundamental'],
            'feature_discussion': ['feature', 'requirement', 'user', 'story', 'specification', 'discussion'],
            'debugging_approach': ['debug', 'error', 'fix', 'issue', 'problem', 'troubleshoot', 'solve'],
            'stochastic_algorithm': ['stochastic', 'random', 'probability', 'uncertainty', 'statistical'],
            'brainstorming': ['brainstorm', 'idea', 'creative', 'generate', 'ideate', 'solution'],
            'critical_analysis': ['critical', 'analysis', 'evaluate', 'assess', 'review', 'examine'],
            'decision_making': ['decision', 'choose', 'select', 'option', 'alternative', 'criteria'],
            'feature_analyzer': ['analyze', 'requirement', 'technical', 'feasibility', 'implementation'],
            'thought_orchestrator': ['orchestrate', 'coordinate', 'manage', 'integrate', 'combine'],
            'cognitive_strategy': ['strategy', 'plan', 'approach', 'cognitive', 'optimize', 'method'],
            'reflection_engine': ['reflect', 'review', 'retrospect', 'improve', 'learn', 'insight'],
            'architecture_advisor': ['architecture', 'design', 'structure', 'component', 'pattern', 'system']
        };

        // Соответствие типа запроса инструментам
        const typeToolMap: Record<string, string[]> = {
            'information': ['first_thought_advisor', 'mental_model', 'thought_foundation'],
            'analysis': ['mental_model', 'sequential_thinking', 'critical_analysis', 'feature_analyzer'],
            'decision': ['decision_making', 'stochastic_algorithm', 'cognitive_strategy'],
            'creation': ['brainstorming', 'feature_discussion', 'architecture_advisor'],
            'other': ['thought_orchestrator', 'reflection_engine']
        };

        // Добавляем баллы за соответствие типу запроса
        if (typeToolMap[analysis.type]?.includes(tool.name)) {
            confidence += 0.3;
        }

        // Добавляем баллы за соответствие ключевым словам
        const relevantKeywords = toolKeywords[tool.name] || [];
        const keywordMatches = analysis.keywords.filter(k =>
            relevantKeywords.some(rk => k.includes(rk) || rk.includes(k))
        ).length;

        confidence += Math.min(0.5, keywordMatches * 0.1);

        // Если в запросе напрямую упоминается название инструмента, добавляем больше уверенности
        if (analysis.keywords.some(k => tool.name.toLowerCase().includes(k) || k.includes(tool.name.toLowerCase()))) {
            confidence += 0.2;
        }

        // Учитываем историю использования из контекста
        const usageHistory = context.toolUsageHistory as Record<string, number> | undefined;
        if (usageHistory && usageHistory[tool.name]) {
            // Если инструмент недавно использовался, добавляем небольшой бонус
            confidence += Math.min(0.1, usageHistory[tool.name] * 0.02);
        }

        // Нормализуем уверенность до диапазона [0, 1]
        return Math.min(1, Math.max(0, confidence));
    }

    /**
     * Выбирает лучший инструмент из рекомендованных
     * @param analysis Анализ запроса
     * @param options Опции маршрутизации
     * @returns Выбранный инструмент с уверенностью
     */
    private selectTool(
        analysis: RequestAnalysis,
        options: RoutingOptions
    ): { tool: string, confidence: number } {
        if (analysis.recommendedTools.length === 0) {
            // Если нет рекомендаций, используем инструмент первого уровня
            return {
                tool: 'first_thought_advisor',
                confidence: 0.5
            };
        }

        // Фильтруем инструменты по минимальной уверенности
        const minConfidence = options.minConfidence || 0.2;
        const validTools = analysis.recommendedTools.filter(t => t.confidence >= minConfidence);

        if (validTools.length === 0) {
            // Если нет подходящих инструментов, используем лучший из имеющихся
            return analysis.recommendedTools[0];
        }

        // Если есть предпочтительный уровень, пытаемся найти инструмент этого уровня
        if (options.preferredLevel) {
            const preferredLevelTools = validTools.filter(t => {
                const metadata = this.interactionAPI.getToolMetadata(t.tool);
                return metadata && metadata.level === options.preferredLevel;
            });

            if (preferredLevelTools.length > 0) {
                // Возвращаем лучший инструмент предпочтительного уровня
                return preferredLevelTools[0];
            }
        }

        // По умолчанию возвращаем инструмент с наивысшей уверенностью
        return validTools[0];
    }

    /**
     * Преобразует параметры запроса для выбранного инструмента
     * @param request Исходный запрос
     * @param toolName Имя выбранного инструмента
     * @param context Контекст запроса
     * @returns Преобразованные параметры
     */
    private async transformParams(
        request: unknown,
        toolName: string,
        context: Record<string, any>
    ): Promise<unknown> {
        // Получаем метаданные инструмента
        const metadata = this.interactionAPI.getToolMetadata(toolName);
        if (!metadata) {
            return request;
        }

        // Правила преобразования для каждого инструмента
        const transformRules: Record<string, (req: any, ctx: Record<string, any>) => any> = {
            // Здесь будут реализованы правила преобразования для каждого инструмента
            // Пока используем базовую трансформацию для всех инструментов
        };

        // Если есть специальное правило для инструмента, применяем его
        if (transformRules[toolName]) {
            return transformRules[toolName](request, context);
        }

        // Базовая трансформация
        if (typeof request === 'string') {
            // Если запрос - это просто строка, создаем объект с основным параметром
            const mainParam = this.getMainParameterForTool(toolName);
            return {
                [mainParam]: request
            };
        } else if (typeof request === 'object' && request !== null) {
            // Если запрос уже является объектом, просто используем его как параметры
            return request;
        }

        // Если преобразование невозможно, возвращаем исходный запрос
        return request;
    }

    /**
     * Возвращает название основного параметра для инструмента
     * @param toolName Имя инструмента
     * @returns Название основного параметра
     */
    private getMainParameterForTool(toolName: string): string {
        // Сопоставление инструментов с их основными параметрами
        const mainParams: Record<string, string> = {
            'first_thought_advisor': 'problem',
            'mental_model': 'problem',
            'sequential_thinking': 'thought',
            'thought_foundation': 'problem',
            'feature_discussion': 'title',
            'debugging_approach': 'issue',
            'stochastic_algorithm': 'problem',
            'brainstorming': 'topic',
            'critical_analysis': 'ideas',
            'decision_making': 'problem',
            'feature_analyzer': 'featureId',
            'thought_orchestrator': 'problem',
            'cognitive_strategy': 'problem',
            'reflection_engine': 'thinkingProcess',
            'architecture_advisor': 'featureId'
        };

        return mainParams[toolName] || 'query';
    }
} 
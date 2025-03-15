/**
 * FirstThoughtAdvisorServer - сервер для рекомендации оптимального подхода к решению проблемы
 */

import { ServerRequest, ServerResponse } from '../interfaces/server-interfaces.js';
import { BaseServer } from './base/base-server.js';
import { FIRST_THOUGHT_ADVISOR_PARAM_DESCRIPTIONS } from '../interfaces/parameter-descriptions.js';
import { createParameters } from '../utils/parameter-utils.js';
import { logger } from '../utils/logger.js';

// Допустимые значения для перечислимых параметров
const VALID_GOALS = ['analyze', 'innovate', 'optimize', 'debug', 'decide', 'understand', 'predict'];
const VALID_DOMAINS = ['tech', 'business', 'science', 'personal', 'education', 'other'];
const VALID_COMPLEXITY_LEVELS = ['low', 'medium', 'high'];

// Максимальная длина строки для обрезания
const MAX_STRING_LENGTH = 500;

/**
 * Интерфейс для подхода к решению проблемы
 */
interface Approach {
    name: string;
    confidence: number;
    description: string;
}

/**
 * Сервер для рекомендации оптимального подхода к решению проблемы
 */
export class FirstThoughtAdvisorServer extends BaseServer {
    constructor() {
        super('first-thought-advisor-server', '1.0.0', [
            {
                name: 'get_thinking_approach',
                description: 'Gets recommended thinking approach for a problem',
                parameters: createParameters(
                    ['problem', 'goal', 'domain', 'complexity', 'constraints', 'previousApproaches'],
                    FIRST_THOUGHT_ADVISOR_PARAM_DESCRIPTIONS,
                    {
                        problem: 'string',
                        goal: 'string',
                        domain: 'string',
                        complexity: 'string',
                        constraints: 'stringArray',
                        previousApproaches: 'stringArray'
                    },
                    ['problem'] // Обязательные параметры
                )
            }
        ]);
    }

    // Переопределение метода обработки запросов для советника по первым мыслям
    async handleRequest(request: ServerRequest): Promise<ServerResponse> {
        try {
            logger.info(`FirstThoughtAdvisorServer: Received request for capability '${request.capability}'`);

            if (request.capability === 'get_thinking_approach') {
                // Извлечение и валидация параметров
                const validatedParams = this.validateParameters(request.parameters);
                if ('error' in validatedParams) {
                    logger.error(`FirstThoughtAdvisorServer: Validation error - ${validatedParams.error}`);
                    return {
                        success: false,
                        error: validatedParams.error
                    };
                }

                const { problem, goal, domain, complexity, constraints, previousApproaches } = validatedParams;

                // Анализ сложности проблемы (если не указана явно)
                const complexityLevel = complexity || this.assessComplexity(problem);
                logger.info(`FirstThoughtAdvisorServer: Assessed complexity level - ${complexityLevel}`);

                // Рекомендации по подходам
                try {
                    const approaches = this.recommendApproaches(
                        problem,
                        goal,
                        domain,
                        complexityLevel,
                        constraints,
                        previousApproaches
                    );

                    logger.info(`FirstThoughtAdvisorServer: Generated ${approaches.length} approach recommendations`);

                    return {
                        success: true,
                        data: {
                            approaches: this.truncateApproaches(approaches),
                            analysisDetails: {
                                assessedComplexity: complexityLevel,
                                domain: domain || 'Not specified',
                                constraints: constraints || [],
                                previousApproaches: previousApproaches || []
                            },
                            nextSteps: [
                                'Consider the recommended approaches',
                                'Choose the most suitable one for your specific context',
                                'Break down the problem using the selected approach',
                                'Implement a solution using the mental model as a guide'
                            ],
                            timestamp: new Date().toISOString()
                        }
                    };
                } catch (error) {
                    logger.error(`FirstThoughtAdvisorServer: Error generating recommendations - ${error.message}`);
                    return {
                        success: false,
                        error: `Error generating recommendations: ${error.message}`
                    };
                }
            }

            logger.warn(`FirstThoughtAdvisorServer: Unsupported capability '${request.capability}'`);
            return {
                success: false,
                error: `Capability '${request.capability}' not supported`
            };
        } catch (error) {
            logger.error(`FirstThoughtAdvisorServer: Unexpected error - ${error.message}`);
            return {
                success: false,
                error: `Unexpected error: ${error.message}`
            };
        }
    }

    /**
     * Валидация параметров запроса
     */
    private validateParameters(params: any): { problem: string; goal?: string; domain?: string; complexity?: string; constraints?: string[]; previousApproaches?: string[] } | { error: string } {
        try {
            // Проверка наличия обязательных параметров
            if (!params || typeof params !== 'object') {
                return { error: 'Parameters must be an object' };
            }

            if (!params.problem) {
                return { error: 'Problem description is required' };
            }

            if (typeof params.problem !== 'string' || params.problem.trim() === '') {
                return { error: 'Problem description must be a non-empty string' };
            }

            // Валидация опциональных параметров
            if (params.goal !== undefined && (typeof params.goal !== 'string' || !VALID_GOALS.includes(params.goal))) {
                return { error: `Goal must be one of: ${VALID_GOALS.join(', ')}` };
            }

            if (params.domain !== undefined && (typeof params.domain !== 'string' || !VALID_DOMAINS.includes(params.domain))) {
                return { error: `Domain must be one of: ${VALID_DOMAINS.join(', ')}` };
            }

            if (params.complexity !== undefined && (typeof params.complexity !== 'string' || !VALID_COMPLEXITY_LEVELS.includes(params.complexity))) {
                return { error: `Complexity must be one of: ${VALID_COMPLEXITY_LEVELS.join(', ')}` };
            }

            // Валидация массивов
            if (params.constraints !== undefined && !Array.isArray(params.constraints)) {
                return { error: 'Constraints must be an array of strings' };
            }

            if (params.previousApproaches !== undefined && !Array.isArray(params.previousApproaches)) {
                return { error: 'Previous approaches must be an array of strings' };
            }

            // Проверка элементов массивов на строки
            if (params.constraints && !params.constraints.every(item => typeof item === 'string')) {
                return { error: 'All constraints must be strings' };
            }

            if (params.previousApproaches && !params.previousApproaches.every(item => typeof item === 'string')) {
                return { error: 'All previous approaches must be strings' };
            }

            // Обрезаем длинные строки
            const problem = this.truncateString(params.problem, MAX_STRING_LENGTH);
            const goal = params.goal ? this.truncateString(params.goal, 50) : undefined;
            const domain = params.domain ? this.truncateString(params.domain, 50) : undefined;
            const complexity = params.complexity;

            // Обрезаем длинные строки в массивах
            const constraints = params.constraints ?
                params.constraints.map(c => this.truncateString(c, 100)) : undefined;

            const previousApproaches = params.previousApproaches ?
                params.previousApproaches.map(a => this.truncateString(a, 100)) : undefined;

            return { problem, goal, domain, complexity, constraints, previousApproaches };
        } catch (error) {
            logger.error(`FirstThoughtAdvisorServer: Parameter validation error - ${error.message}`);
            return { error: `Parameter validation error: ${error.message}` };
        }
    }

    /**
     * Обрезает строку до указанной максимальной длины
     */
    private truncateString(str: string, maxLength: number): string {
        if (str.length <= maxLength) return str;
        return str.substring(0, maxLength) + '...';
    }

    /**
     * Обрезает длинные строки в подходах
     */
    private truncateApproaches(approaches: Approach[]): Approach[] {
        try {
            return approaches.map(approach => ({
                name: this.truncateString(approach.name, 100),
                confidence: approach.confidence,
                description: this.truncateString(approach.description, 300)
            }));
        } catch (error) {
            logger.error(`FirstThoughtAdvisorServer: Error truncating approaches - ${error.message}`);
            return approaches; // Возвращаем исходные подходы в случае ошибки
        }
    }

    // Метод для оценки сложности проблемы
    private assessComplexity(problem: string): string {
        try {
            const problemLower = problem.toLowerCase();

            // Простые признаки высокой сложности
            const highComplexityIndicators = [
                'very complex', 'highly complex', 'extremely difficult',
                'challenging', 'hard', 'complicated', 'intricate'
            ];

            // Простые признаки средней сложности
            const mediumComplexityIndicators = [
                'moderate', 'average', 'intermediate', 'medium', 'standard'
            ];

            // Простые признаки низкой сложности
            const lowComplexityIndicators = [
                'simple', 'easy', 'straightforward', 'basic', 'trivial'
            ];

            // Поиск индикаторов сложности в описании проблемы
            for (const indicator of highComplexityIndicators) {
                if (problemLower.includes(indicator)) {
                    return 'high';
                }
            }

            for (const indicator of mediumComplexityIndicators) {
                if (problemLower.includes(indicator)) {
                    return 'medium';
                }
            }

            for (const indicator of lowComplexityIndicators) {
                if (problemLower.includes(indicator)) {
                    return 'low';
                }
            }

            // Если не найдены явные индикаторы сложности
            const wordCount = problem.split(/\s+/).length;
            if (wordCount > 50) {
                return 'high';
            } else if (wordCount > 20) {
                return 'medium';
            }

            return 'medium'; // По умолчанию средняя сложность
        } catch (error) {
            logger.error(`FirstThoughtAdvisorServer: Error assessing complexity - ${error.message}`);
            return 'medium'; // По умолчанию средняя сложность в случае ошибки
        }
    }

    // Метод для рекомендации подходов на основе описания проблемы
    private recommendApproaches(
        problem: string,
        goal?: string,
        domain?: string,
        complexity?: string,
        constraints?: string[],
        previousApproaches?: string[]
    ): Approach[] {
        try {
            const problemLower = problem.toLowerCase();
            const goalLower = goal ? goal.toLowerCase() : '';
            const domainLower = domain ? domain.toLowerCase() : '';

            // Базовый набор подходов с уровнем релевантности (confidence)
            let approaches: Approach[] = [
                { name: 'First Principles Thinking', confidence: 50, description: 'Breaking down the problem into its fundamental elements and reasoning up from there' },
                { name: 'Systems Thinking', confidence: 50, description: 'Understanding the system as a whole and how parts interact with each other' },
                { name: 'Critical Thinking', confidence: 50, description: 'Evaluating information objectively and making reasoned judgments' },
                { name: 'Design Thinking', confidence: 50, description: 'User-centered approach to problem-solving with iterative prototyping' },
                { name: 'Scientific Method', confidence: 50, description: 'Formulating hypotheses and testing them through experimentation' },
                { name: 'Decision Matrix', confidence: 50, description: 'Evaluating options against multiple criteria to find optimal solutions' },
                { name: 'Lean Thinking', confidence: 50, description: 'Maximizing value while minimizing waste in processes' },
                { name: 'Constraint Analysis', confidence: 50, description: 'Identifying and addressing limitations that prevent optimal solutions' }
            ];

            // Корректировка на основе домена
            if (domainLower.includes('software') || domainLower.includes('program') || domainLower.includes('code') || domainLower === 'tech') {
                this.adjustConfidence(approaches, 'Design Thinking', 20);
                this.adjustConfidence(approaches, 'Systems Thinking', 20);

                // Добавление специфичных для программирования подходов
                approaches.push({ name: 'Algorithmic Thinking', confidence: 70, description: 'Breaking down problems into clear steps and procedures' });
                approaches.push({ name: 'Abstraction', confidence: 70, description: 'Simplifying complex systems by modeling essential features' });
                approaches.push({ name: 'Divide and Conquer', confidence: 70, description: 'Breaking a problem into smaller, manageable subproblems' });
            }

            // Корректировка на основе сложности
            if (complexity === 'high') {
                this.adjustConfidence(approaches, 'First Principles Thinking', 15);
                this.adjustConfidence(approaches, 'Systems Thinking', 20);
                this.adjustConfidence(approaches, 'Divide and Conquer', 20);
            } else if (complexity === 'low') {
                this.adjustConfidence(approaches, 'Critical Thinking', 10);
                this.adjustConfidence(approaches, 'Scientific Method', -10);
            }

            // Корректировка на основе цели
            if (goalLower.includes('optim') || goalLower === 'optimize') {
                this.adjustConfidence(approaches, 'Lean Thinking', 20);
                approaches.push({ name: 'Pareto Analysis (80/20 Rule)', confidence: 65, description: 'Focusing on the 20% of factors that produce 80% of results' });
            }

            if (goalLower.includes('innovat') || goalLower === 'innovate') {
                approaches.push({ name: 'Lateral Thinking', confidence: 65, description: 'Approaching problems from unexpected angles to generate creative ideas' });
                approaches.push({ name: 'SCAMPER Method', confidence: 60, description: 'Technique for generating new ideas by substituting, combining, adapting, etc.' });
            }

            if (goalLower === 'debug') {
                approaches.push({ name: 'Root Cause Analysis', confidence: 75, description: 'Identifying the fundamental source of a problem rather than addressing symptoms' });
                approaches.push({ name: 'Five Whys', confidence: 70, description: 'Iteratively asking why to drill down to the root cause' });
            }

            // Корректировка на основе ограничений
            if (constraints && constraints.length > 0) {
                this.adjustConfidence(approaches, 'Constraint Analysis', 25);

                const constraintsLower = constraints.map(c => c.toLowerCase());
                if (constraintsLower.some(c => c.includes('time') || c.includes('deadline'))) {
                    approaches.push({ name: 'Timeboxing', confidence: 60, description: 'Allocating fixed time periods to activities to ensure progress' });
                }

                if (constraintsLower.some(c => c.includes('resource') || c.includes('budget') || c.includes('cost'))) {
                    this.adjustConfidence(approaches, 'Lean Thinking', 15);
                }
            }

            // Исключение ранее использованных подходов или снижение их приоритета
            if (previousApproaches && previousApproaches.length > 0) {
                const prevApproachesLower = previousApproaches.map(a => a.toLowerCase());

                approaches = approaches.filter(approach =>
                    !prevApproachesLower.some(prev => prev.includes(approach.name.toLowerCase()))
                );

                // Если после фильтрации осталось мало подходов, добавим несколько новых
                if (approaches.length < 3) {
                    approaches.push({ name: 'Analogy Thinking', confidence: 55, description: 'Using similarities between situations to transfer solutions' });
                    approaches.push({ name: 'Inversion', confidence: 55, description: 'Approaching a problem from the opposite direction by focusing on what to avoid' });
                }
            }

            // Сортировка подходов по убыванию уверенности
            approaches.sort((a, b) => b.confidence - a.confidence);

            // Ограничиваем количество подходов для предотвращения слишком больших ответов
            return approaches.slice(0, 10);
        } catch (error) {
            logger.error(`FirstThoughtAdvisorServer: Error recommending approaches - ${error.message}`);
            // Возвращаем базовый набор подходов в случае ошибки
            return [
                { name: 'Critical Thinking', confidence: 60, description: 'Evaluating information objectively and making reasoned judgments' },
                { name: 'Problem Decomposition', confidence: 55, description: 'Breaking down complex problems into smaller, manageable parts' },
                { name: 'Systematic Approach', confidence: 50, description: 'Addressing problems in a methodical, step-by-step manner' }
            ];
        }
    }

    // Вспомогательный метод для корректировки уверенности
    private adjustConfidence(approaches: Approach[], name: string, amount: number) {
        try {
            const approach = approaches.find(a => a.name === name);
            if (approach) {
                approach.confidence += amount;
                // Ограничиваем значением от 0 до 100
                approach.confidence = Math.min(Math.max(approach.confidence, 0), 100);
            }
        } catch (error) {
            logger.error(`FirstThoughtAdvisorServer: Error adjusting confidence - ${error.message}`);
            // Просто игнорируем ошибку и продолжаем
        }
    }
} 
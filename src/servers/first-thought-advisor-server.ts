/**
 * FirstThoughtAdvisorServer - сервер для рекомендации оптимального подхода к решению проблемы
 */

import { ServerRequest, ServerResponse } from '../interfaces/server-interfaces.js';
import { BaseServer } from './index.js';
import { FIRST_THOUGHT_ADVISOR_PARAM_DESCRIPTIONS } from '../interfaces/parameter-descriptions.js';
import { createParameters } from '../utils/parameter-utils.js';

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
        if (request.capability === 'get_thinking_approach') {
            const { problem, goal, domain, complexity, constraints, previousApproaches } = request.parameters;

            // Валидация обязательных параметров
            if (!problem || problem.trim() === '') {
                return {
                    success: false,
                    error: 'Problem description is required'
                };
            }

            // Анализ сложности проблемы (если не указана явно)
            const complexityLevel = complexity || this.assessComplexity(problem);

            // Рекомендации по подходам
            const approaches = this.recommendApproaches(
                problem,
                goal,
                domain,
                complexityLevel,
                constraints,
                previousApproaches
            );

            return {
                success: true,
                data: {
                    approaches,
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
        }

        return {
            success: false,
            error: `Capability '${request.capability}' not supported`
        };
    }

    // Метод для оценки сложности проблемы
    private assessComplexity(problem: string): string {
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
    }

    // Метод для рекомендации подходов на основе описания проблемы
    private recommendApproaches(
        problem: string,
        goal?: string,
        domain?: string,
        complexity?: string,
        constraints?: string[],
        previousApproaches?: string[]
    ) {
        const problemLower = problem.toLowerCase();
        const goalLower = goal ? goal.toLowerCase() : '';
        const domainLower = domain ? domain.toLowerCase() : '';

        // Базовый набор подходов с уровнем релевантности (confidence)
        let approaches = [
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
        if (domainLower.includes('software') || domainLower.includes('program') || domainLower.includes('code')) {
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
        if (goalLower.includes('optim') || goalLower.includes('improv') || goalLower.includes('efficien')) {
            this.adjustConfidence(approaches, 'Lean Thinking', 20);
            approaches.push({ name: 'Pareto Analysis (80/20 Rule)', confidence: 65, description: 'Focusing on the 20% of factors that produce 80% of results' });
        }

        if (goalLower.includes('innovat') || goalLower.includes('creativ') || goalLower.includes('new')) {
            approaches.push({ name: 'Lateral Thinking', confidence: 65, description: 'Approaching problems from unexpected angles to generate creative ideas' });
            approaches.push({ name: 'SCAMPER Method', confidence: 60, description: 'Technique for generating new ideas by substituting, combining, adapting, etc.' });
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

        return approaches;
    }

    // Вспомогательный метод для корректировки уверенности
    private adjustConfidence(approaches: any[], name: string, amount: number) {
        const approach = approaches.find(a => a.name === name);
        if (approach) {
            approach.confidence += amount;
            // Ограничиваем значением от 0 до 100
            approach.confidence = Math.min(Math.max(approach.confidence, 0), 100);
        }
    }
} 
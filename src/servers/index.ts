/**
 * Экспорт серверных классов
 */

import { Server, ServerCapability, ServerRequest, ServerResponse } from '../interfaces/server-interfaces.js';
import { getAllMentalModelNames } from '../models/mental-models.js';

// Импортируем ModelSelectorServer и его описание
export { ModelSelectorServer, MODEL_SELECTOR_DESCRIPTION } from './model-selector-server.js';

// Импорт описания FirstThoughtAdvisor
import { FIRST_THOUGHT_ADVISOR_DESCRIPTION } from '../tool-descriptions/first-thought-advisor-description.js';
// Реэкспорт для использования в других модулях
export { FIRST_THOUGHT_ADVISOR_DESCRIPTION };

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

// Класс для сервера ментальных моделей
export class MentalModelServer extends BaseServer {
    constructor() {
        super('mental-model-server', '1.0.0', [
            {
                name: 'apply_mental_model',
                description: 'Applies a mental model to a problem',
                parameters: {
                    modelName: { type: 'string', required: true },
                    problem: { type: 'string', required: true }
                }
            },
            {
                name: 'list_mental_models',
                description: 'Lists all available mental models'
            }
        ]);
    }

    // Переопределение метода обработки запросов для ментальных моделей
    async handleRequest(request: ServerRequest): Promise<ServerResponse> {
        if (request.capability === 'apply_mental_model') {
            // Заглушка для применения ментальной модели
            return {
                success: true,
                data: {
                    model: request.parameters.modelName,
                    problem: request.parameters.problem,
                    analysis: `Analysis using ${request.parameters.modelName} model`,
                    insights: ['Insight 1', 'Insight 2', 'Insight 3'],
                    timestamp: new Date().toISOString()
                }
            };
        } else if (request.capability === 'list_mental_models') {
            // Получаем полный список ментальных моделей
            const modelNames = getAllMentalModelNames();

            return {
                success: true,
                data: {
                    models: modelNames
                }
            };
        }

        return super.handleRequest(request);
    }
}

// Класс для сервера последовательного мышления
export class SequentialThinkingServer extends BaseServer {
    constructor() {
        super('sequential-thinking-server', '1.0.0', [
            {
                name: 'process_sequential_thought',
                description: 'Processes a sequential thought',
                parameters: {
                    thought: { type: 'string', required: true },
                    thoughtNumber: { type: 'number', required: true },
                    totalThoughts: { type: 'number', required: true }
                }
            }
        ]);
    }

    // Переопределение метода обработки запросов для последовательного мышления
    async handleRequest(request: ServerRequest): Promise<ServerResponse> {
        if (request.capability === 'process_sequential_thought') {
            // Заглушка для обработки последовательной мысли
            return {
                success: true,
                data: {
                    processedThought: request.parameters.thought,
                    thoughtNumber: request.parameters.thoughtNumber,
                    totalThoughts: request.parameters.totalThoughts,
                    nextThoughtNeeded: request.parameters.thoughtNumber < request.parameters.totalThoughts,
                    analysis: 'Analysis of sequential thought',
                    timestamp: new Date().toISOString()
                }
            };
        }

        return super.handleRequest(request);
    }
}

// Класс для сервера отладки
export class DebuggingApproachServer extends BaseServer {
    constructor() {
        super('debugging-approach-server', '1.0.0', [
            {
                name: 'apply_debugging_approach',
                description: 'Applies a debugging approach to an issue',
                parameters: {
                    approachName: { type: 'string', required: true },
                    issue: { type: 'string', required: true }
                }
            },
            {
                name: 'list_debugging_approaches',
                description: 'Lists all available debugging approaches'
            }
        ]);
    }

    // Переопределение метода обработки запросов для отладки
    async handleRequest(request: ServerRequest): Promise<ServerResponse> {
        if (request.capability === 'apply_debugging_approach') {
            // Заглушка для применения подхода к отладке
            return {
                success: true,
                data: {
                    approach: request.parameters.approachName,
                    issue: request.parameters.issue,
                    steps: [
                        'Step 1: Identify the problem',
                        'Step 2: Isolate the source',
                        'Step 3: Fix the issue',
                        'Step 4: Test the solution'
                    ],
                    timestamp: new Date().toISOString()
                }
            };
        } else if (request.capability === 'list_debugging_approaches') {
            // Заглушка для списка подходов к отладке
            return {
                success: true,
                data: {
                    approaches: [
                        'binary_search',
                        'reverse_engineering',
                        'divide_conquer',
                        'backtracking',
                        'cause_elimination'
                    ]
                }
            };
        }

        return super.handleRequest(request);
    }
}

// Класс для сервера мозгового штурма
export class BrainstormingServer extends BaseServer {
    constructor() {
        super('brainstorming-server', '1.0.0', [
            {
                name: 'start_brainstorming',
                description: 'Starts a brainstorming session',
                parameters: {
                    topic: { type: 'string', required: true },
                    phase: { type: 'string', required: true }
                }
            },
            {
                name: 'continue_brainstorming',
                description: 'Continues an existing brainstorming session',
                parameters: {
                    sessionId: { type: 'string', required: true },
                    phase: { type: 'string', required: true }
                }
            }
        ]);
    }

    // Переопределение метода обработки запросов для мозгового штурма
    async handleRequest(request: ServerRequest): Promise<ServerResponse> {
        if (request.capability === 'start_brainstorming') {
            // Заглушка для начала сессии мозгового штурма
            return {
                success: true,
                data: {
                    sessionId: `brainstorm-${Date.now()}`,
                    topic: request.parameters.topic,
                    phase: request.parameters.phase,
                    ideas: [],
                    timestamp: new Date().toISOString()
                }
            };
        } else if (request.capability === 'continue_brainstorming') {
            // Заглушка для продолжения сессии мозгового штурма
            return {
                success: true,
                data: {
                    sessionId: request.parameters.sessionId,
                    phase: request.parameters.phase,
                    ideas: ['Idea 1', 'Idea 2', 'Idea 3'],
                    nextPhase: request.parameters.phase === 'ideation' ? 'evaluation' : 'action_planning',
                    timestamp: new Date().toISOString()
                }
            };
        }

        return super.handleRequest(request);
    }
}

// Класс для сервера стохастических алгоритмов
export class StochasticAlgorithmServer extends BaseServer {
    constructor() {
        super('stochastic-algorithm-server', '1.0.0', [
            {
                name: 'apply_stochastic_algorithm',
                description: 'Applies a stochastic algorithm to a problem',
                parameters: {
                    algorithm: { type: 'string', required: true },
                    problem: { type: 'string', required: true },
                    parameters: { type: 'object', required: true }
                }
            }
        ]);
    }

    // Переопределение метода обработки запросов для стохастических алгоритмов
    async handleRequest(request: ServerRequest): Promise<ServerResponse> {
        if (request.capability === 'apply_stochastic_algorithm') {
            // Заглушка для применения стохастического алгоритма
            return {
                success: true,
                data: {
                    algorithm: request.parameters.algorithm,
                    problem: request.parameters.problem,
                    result: `Result of applying ${request.parameters.algorithm} to the problem`,
                    confidence: 0.85,
                    iterations: 100,
                    timestamp: new Date().toISOString()
                }
            };
        }

        return super.handleRequest(request);
    }
}

// Класс для сервера советника по первым мыслям
export class FirstThoughtAdvisorServer extends BaseServer {
    constructor() {
        super('first-thought-advisor-server', '1.0.0', [
            {
                name: 'get_thinking_approach',
                description: 'Gets recommended thinking approach for a problem',
                parameters: {
                    problem: {
                        type: 'string',
                        required: true,
                        description: 'The specific problem or challenge that requires analysis. Be detailed and precise to receive the most relevant mental model recommendation.'
                    },
                    goal: {
                        type: 'string',
                        required: false,
                        description: 'The specific outcome or objective you are trying to achieve. A clear goal statement helps focus recommendations on solutions that directly address your desired end result.'
                    },
                    domain: {
                        type: 'string',
                        required: false,
                        description: 'The field or context in which the problem exists (e.g., software engineering, machine learning, business strategy). This helps tailor recommendations to domain-specific approaches.'
                    },
                    complexity: {
                        type: 'string',
                        required: false,
                        description: 'Assessment of problem difficulty on a scale from low to high. This helps calibrate the sophistication level of the recommended mental models.'
                    },
                    constraints: {
                        type: 'array',
                        items: { type: 'string' },
                        required: false,
                        description: 'Any limitations, boundaries, or requirements that affect potential solutions. Each constraint should be expressed as a separate array element.'
                    },
                    previousApproaches: {
                        type: 'array',
                        items: { type: 'string' },
                        required: false,
                        description: 'Methods or strategies already attempted, allowing the advisor to suggest novel alternatives. Each approach should be listed as a separate array element.'
                    }
                }
            }
        ]);
    }

    // Переопределение метода обработки запросов для советника по первым мыслям
    async handleRequest(request: ServerRequest): Promise<ServerResponse> {
        if (request.capability === 'get_thinking_approach') {
            const { problem, goal, domain, complexity, constraints, previousApproaches } = request.parameters;

            // Анализ уровня сложности проблемы
            let complexityLevel = complexity || this.assessComplexity(problem);

            // Определяем подходящие подходы на основе параметров
            const recommendedApproaches = this.recommendApproaches(
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
                    problem,
                    goal,
                    domain,
                    complexity: complexityLevel,
                    constraints,
                    previousApproaches,
                    recommendedApproaches,
                    timestamp: new Date().toISOString()
                }
            };
        }

        return {
            success: false,
            error: `Unknown capability: ${request.capability}`
        };
    }

    // Оценка сложности проблемы на основе текста
    private assessComplexity(problem: string): string {
        // Простой алгоритм оценки сложности на основе длины и ключевых слов
        const complexityIndicators = [
            'complex', 'difficult', 'challenging', 'sophisticated', 'intricate',
            'multiple', 'interdependent', 'unclear', 'ambiguous', 'uncertain'
        ];

        const wordCount = problem.split(' ').length;
        let indicatorCount = 0;

        for (const indicator of complexityIndicators) {
            if (problem.toLowerCase().includes(indicator)) {
                indicatorCount++;
            }
        }

        if (wordCount > 100 || indicatorCount > 3) {
            return 'high';
        } else if (wordCount > 50 || indicatorCount > 1) {
            return 'moderate';
        } else {
            return 'low';
        }
    }

    // Рекомендация подходов на основе всех параметров
    private recommendApproaches(
        problem: string,
        goal?: string,
        domain?: string,
        complexity?: string,
        constraints?: string[],
        previousApproaches?: string[]
    ) {
        // Здесь будет логика рекомендаций на основе всех параметров
        // Это заглушка с некоторыми примерами подходов

        const approaches = [
            { name: 'systems_thinking', confidence: 0, reason: 'Best for understanding complex interconnected systems' },
            { name: 'first_principles', confidence: 0, reason: 'Good for breaking down complex problems to fundamentals' },
            { name: 'mental_model', confidence: 0, reason: 'Provides structured framework for analysis' },
            { name: 'design_thinking', confidence: 0, reason: 'Human-centered approach to innovation and problem solving' },
            { name: 'critical_path', confidence: 0, reason: 'Identifies essential sequence of steps with dependencies' },
            { name: 'decision_tree', confidence: 0, reason: 'Maps decisions and their possible consequences' },
            { name: 'cost_benefit', confidence: 0, reason: 'Evaluates actions by comparing costs to benefits' },
            { name: 'scenario_planning', confidence: 0, reason: 'Prepares for different possible future states' },
            { name: 'root_cause', confidence: 0, reason: 'Focuses on identifying the fundamental source of problems' }
        ];

        // Повышаем уверенность в соответствующих подходах на основе входных данных
        // В реальном приложении здесь будет более сложная логика

        // На основе предметной области
        if (domain) {
            const domainLower = domain.toLowerCase();
            if (domainLower.includes('software') || domainLower.includes('engineering')) {
                this.adjustConfidence(approaches, 'first_principles', 0.2);
                this.adjustConfidence(approaches, 'systems_thinking', 0.3);
            } else if (domainLower.includes('business') || domainLower.includes('strategy')) {
                this.adjustConfidence(approaches, 'scenario_planning', 0.3);
                this.adjustConfidence(approaches, 'cost_benefit', 0.3);
            } else if (domainLower.includes('design') || domainLower.includes('user')) {
                this.adjustConfidence(approaches, 'design_thinking', 0.4);
            }
        }

        // На основе сложности
        if (complexity === 'high') {
            this.adjustConfidence(approaches, 'systems_thinking', 0.3);
            this.adjustConfidence(approaches, 'scenario_planning', 0.2);
        } else if (complexity === 'moderate') {
            this.adjustConfidence(approaches, 'mental_model', 0.2);
            this.adjustConfidence(approaches, 'decision_tree', 0.2);
        } else {
            this.adjustConfidence(approaches, 'root_cause', 0.2);
            this.adjustConfidence(approaches, 'cost_benefit', 0.2);
        }

        // На основе цели
        if (goal) {
            const goalLower = goal.toLowerCase();
            if (goalLower.includes('optimize') || goalLower.includes('improve')) {
                this.adjustConfidence(approaches, 'root_cause', 0.2);
            } else if (goalLower.includes('design') || goalLower.includes('create')) {
                this.adjustConfidence(approaches, 'design_thinking', 0.3);
                this.adjustConfidence(approaches, 'first_principles', 0.2);
            } else if (goalLower.includes('decide') || goalLower.includes('choose')) {
                this.adjustConfidence(approaches, 'decision_tree', 0.3);
                this.adjustConfidence(approaches, 'cost_benefit', 0.3);
            }
        }

        // Исключаем предыдущие подходы
        if (previousApproaches && previousApproaches.length > 0) {
            for (const approach of approaches) {
                if (previousApproaches.some(prev =>
                    prev.toLowerCase().includes(approach.name.toLowerCase())
                )) {
                    approach.confidence = 0;
                }
            }
        }

        // Исключаем подходы, которые не соответствуют ограничениям
        if (constraints && constraints.length > 0) {
            const constraintsLower = constraints.map(c => c.toLowerCase());

            if (constraintsLower.some(c => c.includes('time') && c.includes('limit'))) {
                this.adjustConfidence(approaches, 'systems_thinking', -0.1);
                this.adjustConfidence(approaches, 'critical_path', 0.2);
            }

            if (constraintsLower.some(c => c.includes('budget') || c.includes('cost'))) {
                this.adjustConfidence(approaches, 'cost_benefit', 0.3);
            }

            if (constraintsLower.some(c => c.includes('uncertain') || c.includes('unpredictable'))) {
                this.adjustConfidence(approaches, 'scenario_planning', 0.3);
            }
        }

        // Сортируем по уверенности и возвращаем топ-3
        return approaches
            .filter(a => a.confidence > 0)
            .sort((a, b) => b.confidence - a.confidence)
            .slice(0, 3)
            .map(a => ({
                ...a,
                confidence: parseFloat(a.confidence.toFixed(2))
            }));
    }

    // Вспомогательный метод для корректировки уверенности в подходе
    private adjustConfidence(approaches: any[], name: string, amount: number) {
        const approach = approaches.find(a => a.name === name);
        if (approach) {
            approach.confidence += amount;
            approach.confidence = Math.max(0, Math.min(1, approach.confidence));
        }
    }
}

// Экспорт всех серверов
export const servers = {
    MentalModelServer,
    SequentialThinkingServer,
    DebuggingApproachServer,
    BrainstormingServer,
    StochasticAlgorithmServer,
    FirstThoughtAdvisorServer
}; 
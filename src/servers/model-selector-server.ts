/**
 * ModelSelectorServer - сервер для выбора оптимальной модели/подхода для задач программирования
 * Специализируется на выборе архитектурных решений, паттернов проектирования, алгоритмов и структур данных
 */

import { ServerRequest, ServerResponse } from '../interfaces/server-interfaces.js';
import { BaseServer } from './index.js';

// Тип для описания модели, подхода или решения
export interface ProgrammingModel {
    name: string;
    category: ProgrammingModelCategory;
    description: string;
    useCases: string[];
    advantages: string[];
    disadvantages: string[];
    complexity: 'Low' | 'Medium' | 'High';
    timeComplexity?: string;
    spaceComplexity?: string;
    examples: string[];
    alternatives: string[];
    references: string[];
}

// Категории моделей и подходов к программированию
export enum ProgrammingModelCategory {
    // Архитектурные модели
    ARCHITECTURE = 'Architecture',
    DESIGN_PATTERN = 'Design Pattern',

    // Парадигмы программирования
    PROGRAMMING_PARADIGM = 'Programming Paradigm',
    CODE_ORGANIZATION = 'Code Organization',

    // Алгоритмы и структуры данных
    ALGORITHM = 'Algorithm',
    DATA_STRUCTURE = 'Data Structure',

    // Взаимодействие и интеграция
    API_DESIGN = 'API Design',
    SYSTEM_INTEGRATION = 'System Integration',

    // Подходы к тестированию и отладке
    TESTING_STRATEGY = 'Testing Strategy',
    DEBUGGING_STRATEGY = 'Debugging Strategy',

    // Оптимизация и производительность
    OPTIMIZATION_STRATEGY = 'Optimization Strategy',
    CONCURRENCY_MODEL = 'Concurrency Model',
}

// Критерии для выбора модели
export interface ModelSelectionCriteria {
    task: string;
    context?: string;
    language?: string;
    framework?: string;
    constraints?: string[];
    preferences?: string[];
    requiredFeatures?: string[];
    optimizationGoals?: string[];
    teamExperience?: string;
    projectScale?: 'Small' | 'Medium' | 'Large' | 'Enterprise';
    timeConstraints?: 'Tight' | 'Normal' | 'Relaxed';
}

// Каталог моделей (это базовый набор, в реальной реализации он должен быть гораздо больше)
const PROGRAMMING_MODELS: ProgrammingModel[] = [
    // Архитектурные модели
    {
        name: 'Microservices',
        category: ProgrammingModelCategory.ARCHITECTURE,
        description: 'Architecture that structures an application as a collection of loosely coupled services.',
        useCases: ['Large-scale applications', 'Systems with multiple teams', 'Applications requiring high scalability'],
        advantages: ['Independent deployability', 'Technology diversity', 'Resilience', 'Scalability'],
        disadvantages: ['Complexity', 'Network latency', 'Data consistency challenges'],
        complexity: 'High',
        examples: ['Netflix', 'Amazon', 'Uber'],
        alternatives: ['Monolithic', 'Service-Oriented Architecture', 'Serverless'],
        references: ['https://microservices.io']
    },
    {
        name: 'Model-View-Controller (MVC)',
        category: ProgrammingModelCategory.ARCHITECTURE,
        description: 'Architectural pattern that separates an application into three interconnected components.',
        useCases: ['Web applications', 'Desktop applications', 'Mobile apps'],
        advantages: ['Separation of concerns', 'Code reusability', 'Parallel development'],
        disadvantages: ['Tight coupling between components', 'Overhead for simple applications'],
        complexity: 'Medium',
        examples: ['Ruby on Rails', 'Django', 'Spring MVC'],
        alternatives: ['MVVM', 'MVP', 'Flux/Redux'],
        references: ['https://developer.mozilla.org/en-US/docs/Glossary/MVC']
    },

    // Паттерны проектирования
    {
        name: 'Factory Method',
        category: ProgrammingModelCategory.DESIGN_PATTERN,
        description: 'Creational pattern that provides an interface for creating objects without specifying their concrete classes.',
        useCases: ['Object creation with dynamic types', 'When a class cannot anticipate the type of objects it must create', 'When you want to delegate responsibility to subclasses'],
        advantages: ['Loose coupling', 'Single Responsibility Principle', 'Open/Closed Principle'],
        disadvantages: ['Complexity for simple cases', 'May lead to too many small classes'],
        complexity: 'Medium',
        examples: [
            'DocumentCreator creates different types of documents (PDF, Word)',
            'UIButtonFactory creates platform-specific buttons'
        ],
        alternatives: ['Abstract Factory', 'Builder', 'Prototype'],
        references: ['https://refactoring.guru/design-patterns/factory-method']
    },

    // Алгоритмы
    {
        name: 'QuickSort',
        category: ProgrammingModelCategory.ALGORITHM,
        description: 'Efficient sorting algorithm using divide-and-conquer strategy with a pivot element.',
        useCases: ['General-purpose sorting', 'In-memory array sorting'],
        advantages: ['Efficient for large datasets', 'In-place sorting with low memory usage', 'Good cache performance'],
        disadvantages: ['Unstable sort', 'Worst-case O(n²) time complexity', 'Recursive implementation may cause stack overflow'],
        complexity: 'Medium',
        timeComplexity: 'Average: O(n log n), Worst: O(n²)',
        spaceComplexity: 'O(log n)',
        examples: ['Arrays.sort() in Java', 'Standard library sort in many languages'],
        alternatives: ['MergeSort', 'HeapSort', 'TimSort'],
        references: ['https://en.wikipedia.org/wiki/Quicksort']
    },

    // Структуры данных
    {
        name: 'HashMap',
        category: ProgrammingModelCategory.DATA_STRUCTURE,
        description: 'Data structure that implements an associative array using a hash function.',
        useCases: ['Fast lookups by key', 'Caching', 'Indexing', 'Counting occurrences'],
        advantages: ['O(1) average time complexity for lookups', 'Flexible key types', 'Dynamic sizing'],
        disadvantages: ['Collision handling overhead', 'No ordering of elements', 'Higher memory usage'],
        complexity: 'Medium',
        timeComplexity: 'Average: O(1) for search, insert, delete. Worst: O(n)',
        spaceComplexity: 'O(n)',
        examples: ['HashMap in Java', 'dict in Python', 'Map in JavaScript'],
        alternatives: ['TreeMap', 'LinkedHashMap', 'HashTable'],
        references: ['https://en.wikipedia.org/wiki/Hash_table']
    },

    // Парадигмы программирования
    {
        name: 'Functional Programming',
        category: ProgrammingModelCategory.PROGRAMMING_PARADIGM,
        description: 'Programming paradigm where programs are constructed by applying and composing functions.',
        useCases: ['Data processing', 'Parallel computing', 'Event-driven applications'],
        advantages: ['Immutability', 'Pure functions with no side effects', 'Easier testing', 'Concurrency'],
        disadvantages: ['Learning curve', 'Can be less intuitive for some algorithms', 'Performance overhead'],
        complexity: 'Medium',
        examples: ['Haskell', 'Clojure', 'Scala', 'JavaScript with functional approach'],
        alternatives: ['Object-Oriented Programming', 'Procedural Programming', 'Reactive Programming'],
        references: ['https://en.wikipedia.org/wiki/Functional_programming']
    },

    // Модели многопоточности
    {
        name: 'Actor Model',
        category: ProgrammingModelCategory.CONCURRENCY_MODEL,
        description: 'Concurrency model treating actors as universal primitives of concurrent computation.',
        useCases: ['Distributed systems', 'Highly concurrent applications', 'Fault-tolerant systems'],
        advantages: ['No shared state', 'Message passing for safety', 'Location transparency', 'Fault isolation'],
        disadvantages: ['Complexity', 'Performance overhead for simple cases', 'Potential message overload'],
        complexity: 'High',
        examples: ['Akka', 'Erlang/OTP', 'Orleans'],
        alternatives: ['CSP', 'Threads and locks', 'STM'],
        references: ['https://en.wikipedia.org/wiki/Actor_model']
    }
];

export class ModelSelectorServer extends BaseServer {
    constructor() {
        super('model-selector-server', '1.0.0', [
            {
                name: 'select_model',
                description: 'Selects the optimal model/approach for a programming task',
                parameters: {
                    task: { type: 'string', required: true },
                    context: { type: 'string', required: false },
                    language: { type: 'string', required: false },
                    framework: { type: 'string', required: false },
                    constraints: { type: 'array', required: false },
                    preferences: { type: 'array', required: false },
                    requiredFeatures: { type: 'array', required: false },
                    optimizationGoals: { type: 'array', required: false },
                    teamExperience: { type: 'string', required: false },
                    projectScale: { type: 'string', required: false },
                    timeConstraints: { type: 'string', required: false }
                }
            },
            {
                name: 'list_models',
                description: 'Lists all available models/approaches in a specific category',
                parameters: {
                    category: { type: 'string', required: false }
                }
            },
            {
                name: 'compare_models',
                description: 'Compares two or more models/approaches',
                parameters: {
                    modelNames: { type: 'array', required: true },
                    criteria: { type: 'array', required: false }
                }
            }
        ]);
    }

    private findMatchingModels(criteria: ModelSelectionCriteria): ProgrammingModel[] {
        // Реализация базового алгоритма поиска подходящих моделей:

        // 1. Ищем ключевые слова в задаче и контексте
        const taskLower = criteria.task.toLowerCase();
        const contextLower = criteria.context?.toLowerCase() || '';

        // 2. Фильтруем модели, подходящие по описанию к задаче
        let matches = PROGRAMMING_MODELS.filter(model => {
            // Проверяем соответствие по категории и описанию
            const descriptionMatch = model.description.toLowerCase().includes(taskLower) ||
                model.useCases.some(useCase => useCase.toLowerCase().includes(taskLower));

            // Проверяем соответствие по предпочтениям и ограничениям
            const preferencesMatch = !criteria.preferences ||
                criteria.preferences.some(pref =>
                    model.advantages.some(adv => adv.toLowerCase().includes(pref.toLowerCase())));

            const constraintsPass = !criteria.constraints ||
                !criteria.constraints.some(constraint =>
                    model.disadvantages.some(disadv => disadv.toLowerCase().includes(constraint.toLowerCase())));

            return descriptionMatch && preferencesMatch && constraintsPass;
        });

        // Если нет совпадений, возвращаем все модели
        if (matches.length === 0) {
            matches = PROGRAMMING_MODELS;
        }

        return matches;
    }

    private rankModels(models: ProgrammingModel[], criteria: ModelSelectionCriteria): ProgrammingModel[] {
        // Реализация ранжирования моделей по релевантности к задаче:
        return models.sort((a, b) => {
            // Здесь должна быть сложная логика оценки каждой модели
            // Упрощенная версия для примера:

            let scoreA = 0;
            let scoreB = 0;

            // Оценка по соответствию сложности проекта
            if (criteria.projectScale) {
                const complexityMap = { 'Small': 1, 'Medium': 2, 'Large': 3, 'Enterprise': 4 };
                const modelComplexityMap = { 'Low': 1, 'Medium': 2, 'High': 3 };

                const projectComplexity = complexityMap[criteria.projectScale];
                const modelAComplexity = modelComplexityMap[a.complexity];
                const modelBComplexity = modelComplexityMap[b.complexity];

                // Чем ближе сложность модели к сложности проекта, тем лучше
                scoreA += Math.max(0, 4 - Math.abs(projectComplexity - modelAComplexity));
                scoreB += Math.max(0, 4 - Math.abs(projectComplexity - modelBComplexity));
            }

            // Дополнительные оценки по другим критериям...

            return scoreB - scoreA; // Сортировка по убыванию оценки
        });
    }

    private formatModelRecommendation(models: ProgrammingModel[], criteria: ModelSelectionCriteria): string {
        if (models.length === 0) {
            return "No matching models found for your criteria.";
        }

        // Выбираем топ-3 модели для рекомендации
        const topModels = models.slice(0, 3);

        let result = `# Model Selection Recommendations\n\n`;
        result += `## Task Analysis\n`;
        result += `Task: ${criteria.task}\n`;
        if (criteria.context) result += `Context: ${criteria.context}\n`;
        if (criteria.language) result += `Language: ${criteria.language}\n`;
        if (criteria.framework) result += `Framework: ${criteria.framework}\n`;

        result += `\n## Top Recommendations\n\n`;

        topModels.forEach((model, index) => {
            result += `### ${index + 1}. ${model.name} (${model.category})\n\n`;
            result += `${model.description}\n\n`;

            result += `**Best for:**\n`;
            model.useCases.forEach(useCase => result += `- ${useCase}\n`);

            result += `\n**Advantages:**\n`;
            model.advantages.forEach(adv => result += `- ${adv}\n`);

            result += `\n**Potential challenges:**\n`;
            model.disadvantages.forEach(disadv => result += `- ${disadv}\n`);

            if (model.timeComplexity) {
                result += `\n**Complexity:** ${model.complexity}`;
                result += `\n**Time Complexity:** ${model.timeComplexity}`;
                result += `\n**Space Complexity:** ${model.spaceComplexity}\n`;
            } else {
                result += `\n**Complexity:** ${model.complexity}\n`;
            }

            result += `\n**Examples:**\n`;
            model.examples.forEach(example => result += `- ${example}\n`);

            result += `\n**Alternatives to consider:**\n`;
            model.alternatives.forEach(alt => result += `- ${alt}\n`);

            result += `\n`;
        });

        result += `## Implementation Guidance\n\n`;
        result += `When implementing the recommended approach, consider:\n`;
        result += `- Start with a simplified prototype to validate the approach\n`;
        result += `- Focus on the key requirements first\n`;
        result += `- Consider testability from the beginning\n`;
        result += `- Document design decisions and trade-offs\n`;

        return result;
    }

    async handleRequest(request: ServerRequest): Promise<ServerResponse> {
        try {
            if (request.capability === 'select_model') {
                // Преобразуем параметры запроса в критерии выбора модели
                const criteria: ModelSelectionCriteria = {
                    task: request.parameters.task,
                    context: request.parameters.context,
                    language: request.parameters.language,
                    framework: request.parameters.framework,
                    constraints: request.parameters.constraints,
                    preferences: request.parameters.preferences,
                    requiredFeatures: request.parameters.requiredFeatures,
                    optimizationGoals: request.parameters.optimizationGoals,
                    teamExperience: request.parameters.teamExperience,
                    projectScale: request.parameters.projectScale,
                    timeConstraints: request.parameters.timeConstraints
                };

                // Находим подходящие модели
                const matchingModels = this.findMatchingModels(criteria);

                // Ранжируем модели по релевантности
                const rankedModels = this.rankModels(matchingModels, criteria);

                // Форматируем рекомендации
                const recommendation = this.formatModelRecommendation(rankedModels, criteria);

                return {
                    success: true,
                    data: {
                        recommendation,
                        models: rankedModels.slice(0, 3).map(model => ({
                            name: model.name,
                            category: model.category,
                            description: model.description,
                            complexity: model.complexity
                        }))
                    }
                };
            }
            else if (request.capability === 'list_models') {
                // Фильтруем модели по категории, если указана
                const categoryFilter = request.parameters.category;
                let models = PROGRAMMING_MODELS;

                if (categoryFilter) {
                    models = models.filter(model =>
                        model.category.toLowerCase() === categoryFilter.toLowerCase());
                }

                return {
                    success: true,
                    data: {
                        models: models.map(model => ({
                            name: model.name,
                            category: model.category,
                            description: model.description
                        })),
                        categories: Object.values(ProgrammingModelCategory)
                    }
                };
            }
            else if (request.capability === 'compare_models') {
                const modelNames = request.parameters.modelNames;
                const modelsToCompare = PROGRAMMING_MODELS.filter(model =>
                    modelNames.includes(model.name));

                return {
                    success: true,
                    data: {
                        models: modelsToCompare,
                        comparison: this.compareModels(modelsToCompare, request.parameters.criteria)
                    }
                };
            }

            return super.handleRequest(request);
        } catch (error) {
            return {
                success: false,
                error: `Error in ModelSelectorServer: ${error instanceof Error ? error.message : String(error)}`
            };
        }
    }

    private compareModels(models: ProgrammingModel[], criteria?: string[]): Record<string, any> {
        // Реализация сравнения моделей по заданным критериям
        const comparison: Record<string, any> = {};

        // Генерируем сравнительную таблицу по различным аспектам
        const aspects = ['complexity', 'advantages', 'disadvantages', 'useCases'];

        aspects.forEach(aspect => {
            comparison[aspect] = {};
            models.forEach(model => {
                comparison[aspect][model.name] = model[aspect];
            });
        });

        return comparison;
    }
} 
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import {
    FeatureAnalyzerInterface,
    FeatureAnalysisParams,
    RequirementsAnalysisResult,
    TechnicalSpecification,
    Requirement,
    RequirementType,
    RequirementPriority,
    RequirementDependency,
    ComplexityEstimation,
    ThinkingLevel,
    ToolType
} from './types.js';
import { FeatureDiscussionAdapter } from './adapters/feature-discussion-adapter.js';

/**
 * Базовый класс для анализа функций в многоуровневой архитектуре мышления
 */
export class FeatureAnalyzer implements FeatureAnalyzerInterface {
    /**
     * Метаданные инструмента мышления
     */
    static readonly metadata = {
        name: 'FeatureAnalyzer',
        description: 'Analyses feature requirements and provides technical specifications',
        level: ThinkingLevel.SPECIALIZED,
        type: ToolType.ANALYZER,
        version: '0.1.0'
    };

    /**
     * Конструктор класса FeatureAnalyzer
     */
    constructor() {
        // Можно добавить зависимости или конфигурацию
    }

    /**
     * Анализирует функцию на основе предоставленных данных
     * @param params Параметры для анализа
     * @returns Результат анализа требований
     */
    async analyzeFeature(params: FeatureAnalysisParams): Promise<RequirementsAnalysisResult> {
        try {
            // Извлечение требований из данных обсуждения и дополнительных требований
            const requirements = await this.extractRequirements(params);

            // Определение зависимостей между требованиями
            const dependencies = await this.identifyDependencies(requirements);

            // Проверка на противоречия
            const contradictionsCheck = await this.checkForContradictions(requirements);

            // Оценка сложности
            const complexityResult = await this.estimateComplexity(requirements, params.existingArchitecture);

            // Генерация технической спецификации
            const technicalSpec = await this.generateTechnicalSpecification({
                featureId: params.featureId,
                requirements,
                dependencies,
                conflictsFounded: contradictionsCheck.conflictsFound,
                conflicts: contradictionsCheck.conflicts,
                complexity: complexityResult.individualComplexity,
                overallComplexity: complexityResult.overallComplexity
            });

            // Формирование финального результата
            return {
                featureId: params.featureId,
                requirements,
                dependencies,
                conflictsFounded: contradictionsCheck.conflictsFound,
                conflicts: contradictionsCheck.conflicts,
                complexity: complexityResult.individualComplexity,
                overallComplexity: complexityResult.overallComplexity,
                technicalSpecification: technicalSpec
            };
        } catch (error) {
            if (error instanceof McpError) {
                throw error;
            }
            throw new McpError(
                ErrorCode.InternalError,
                `Error analyzing feature: ${(error as Error).message}`
            );
        }
    }

    /**
     * Извлекает требования из данных обсуждения и дополнительных входных данных
     * @param params Параметры для анализа
     * @returns Список требований
     */
    private async extractRequirements(params: FeatureAnalysisParams): Promise<Requirement[]> {
        const requirements: Requirement[] = [];

        // Извлечение требований из описания функции
        if (params.featureDescription) {
            requirements.push({
                id: `req_${requirements.length + 1}`,
                description: `Initial requirement extracted from feature description: ${params.featureTitle}`,
                type: RequirementType.FUNCTIONAL,
                priority: RequirementPriority.MEDIUM,
                source: 'feature_description'
            });
        }

        // Извлечение требований из данных обсуждения с использованием адаптера
        if (params.discussionData) {
            try {
                // Преобразование данных обсуждения в наш формат
                const discussionData = FeatureDiscussionAdapter.fromExternalFormat(params.discussionData);

                // Извлечение требований из данных обсуждения
                const discussionRequirements = FeatureDiscussionAdapter.extractRequirements(discussionData);

                // Добавление требований из обсуждения
                requirements.push(...discussionRequirements);
            } catch (error) {
                console.warn(`Warning: Failed to extract requirements from discussion data: ${(error as Error).message}`);
            }
        }

        // Добавление дополнительных требований
        if (params.additionalRequirements && params.additionalRequirements.length > 0) {
            params.additionalRequirements.forEach((req, index) => {
                requirements.push({
                    id: `req_${requirements.length + 1}`,
                    description: req,
                    type: RequirementType.FUNCTIONAL, // По умолчанию
                    priority: RequirementPriority.MEDIUM, // По умолчанию
                    source: 'user_input'
                });
            });
        }

        return requirements;
    }

    /**
     * Определяет зависимости между требованиями
     * @param requirements Список требований
     * @returns Список зависимостей
     */
    private async identifyDependencies(requirements: Requirement[]): Promise<RequirementDependency[]> {
        const dependencies: RequirementDependency[] = [];

        // Создаем словарь ключевых слов для каждого требования
        const requirementKeywords: { [reqId: string]: string[] } = {};

        // Создаем словарь для быстрого поиска требований по ID
        const requirementsById: { [reqId: string]: Requirement } = {};

        // Заполняем словари
        requirements.forEach(req => {
            // Добавляем требование в словарь для быстрого поиска
            requirementsById[req.id] = req;

            // Извлекаем ключевые слова из описания требования
            const words = req.description
                .toLowerCase()
                .replace(/[^\w\s]/g, '') // Убираем пунктуацию
                .split(/\s+/)
                .filter(word => word.length > 3) // Отфильтровываем короткие слова
                .filter(word => !this.isStopWord(word)); // Отфильтровываем стоп-слова

            requirementKeywords[req.id] = words;
        });

        // Массив маркеров зависимостей в тексте
        const dependencyMarkers = [
            'depends on', 'requires', 'needs', 'based on', 'follows', 'after',
            'dependent on', 'prerequisite', 'prerequisite for', 'dependent upon',
            'зависит от', 'требует', 'нуждается в', 'основано на', 'следует после',
            'должно быть выполнено после', 'предварительное условие'
        ];

        // Перебираем все требования для выявления зависимостей
        for (let i = 0; i < requirements.length; i++) {
            const currentReq = requirements[i];
            const currentDesc = currentReq.description.toLowerCase();

            // 1. Проверяем явные указания на зависимости
            for (let j = 0; j < requirements.length; j++) {
                if (i === j) continue; // Пропускаем сравнение с самим собой

                const otherReq = requirements[j];

                // Проверяем наличие прямых зависимостей по числовым/буквенным идентификаторам
                // Например, "Depends on R1" или "Requires requirement 3.2"
                const reqNumberPattern = new RegExp(`(requirement|req)\\s+(?:number|#)?\\s*${otherReq.id.replace(/^req_/, '')}\\b`, 'i');
                if (reqNumberPattern.test(currentDesc)) {
                    dependencies.push({
                        requirementId: currentReq.id,
                        dependsOnId: otherReq.id,
                        type: 'requires',
                        description: `Explicit reference to ${otherReq.id}`
                    });
                    continue;
                }

                // Проверяем текстовые маркеры зависимостей
                for (const marker of dependencyMarkers) {
                    const markerIndex = currentDesc.indexOf(marker);
                    if (markerIndex >= 0) {
                        // Извлекаем текст после маркера зависимости
                        const textAfterMarker = currentDesc.substring(markerIndex + marker.length).trim();
                        // Если текст после маркера содержит ключевые слова из другого требования
                        const otherKeywords = requirementKeywords[otherReq.id];
                        const matchedKeywords = otherKeywords.filter(keyword =>
                            textAfterMarker.includes(keyword)
                        );

                        // Если найдено достаточное количество совпадений ключевых слов
                        if (matchedKeywords.length >= Math.min(2, otherKeywords.length * 0.3)) {
                            dependencies.push({
                                requirementId: currentReq.id,
                                dependsOnId: otherReq.id,
                                type: 'requires',
                                description: `Dependency based on marker "${marker}" and keyword matches`
                            });
                        }
                    }
                }
            }

            // 2. Ищем зависимости на основе схожести ключевых слов
            const currentKeywords = requirementKeywords[currentReq.id];
            for (let j = 0; j < requirements.length; j++) {
                if (i === j) continue; // Пропускаем сравнение с самим собой

                const otherReq = requirements[j];
                const otherKeywords = requirementKeywords[otherReq.id];

                // Подсчитываем общие ключевые слова
                const commonKeywords = currentKeywords.filter(word => otherKeywords.includes(word));
                const similarityScore = commonKeywords.length / Math.max(1, Math.min(currentKeywords.length, otherKeywords.length));

                // Если сходство превышает порог и требования не уже связаны
                if (similarityScore > 0.5 && !dependencies.some(dep =>
                    (dep.requirementId === currentReq.id && dep.dependsOnId === otherReq.id) ||
                    (dep.requirementId === otherReq.id && dep.dependsOnId === currentReq.id)
                )) {
                    // Определяем направление зависимости на основе типа требований
                    const isPriorityBasedDependency = this.determineDependencyByPriority(currentReq, otherReq);
                    const isTypeBasedDependency = this.determineDependencyByType(currentReq, otherReq);

                    if (isPriorityBasedDependency || isTypeBasedDependency) {
                        dependencies.push({
                            requirementId: currentReq.id,
                            dependsOnId: otherReq.id,
                            type: 'related_to',
                            description: `Semantic relation based on similar keywords: ${commonKeywords.join(', ')}`
                        });
                    }
                }
            }

            // 3. Дополнительные эвристики для выявления зависимостей

            // 3.1 Зависимость по порядку определения (с учетом типа и приоритета)
            if (i > 0) {
                const prevReq = requirements[i - 1];

                // Проверяем, имеют ли последовательные требования логическую связь
                if (this.determineDependencyBySequence(currentReq, prevReq)) {
                    // Проверяем, не создана ли уже зависимость
                    if (!dependencies.some(dep =>
                        dep.requirementId === currentReq.id && dep.dependsOnId === prevReq.id
                    )) {
                        dependencies.push({
                            requirementId: currentReq.id,
                            dependsOnId: prevReq.id,
                            type: 'potentially_follows',
                            description: 'Sequential dependency based on requirement order and content analysis'
                        });
                    }
                }
            }

            // 3.2 Функциональные требования часто зависят от нефункциональных соответствующего типа
            if (currentReq.type === RequirementType.FUNCTIONAL) {
                for (const otherReq of requirements) {
                    if (otherReq.id === currentReq.id) continue;

                    if (otherReq.type !== RequirementType.FUNCTIONAL) {
                        // Проверяем, содержит ли функциональное требование ключевые слова из нефункционального
                        const otherKeywords = requirementKeywords[otherReq.id];
                        const matchedKeywords = otherKeywords.filter(keyword =>
                            currentReq.description.toLowerCase().includes(keyword)
                        );

                        if (matchedKeywords.length >= 2) {
                            dependencies.push({
                                requirementId: currentReq.id,
                                dependsOnId: otherReq.id,
                                type: 'constrained_by',
                                description: `Functional requirement constrained by non-functional requirement of type ${otherReq.type}`
                            });
                        }
                    }
                }
            }
        }

        // Убираем потенциальные циклические зависимости
        this.resolveCyclicDependencies(dependencies);

        return dependencies;
    }

    /**
     * Определяет, является ли слово стоп-словом
     * @param word Слово для проверки
     * @returns true, если слово является стоп-словом
     */
    private isStopWord(word: string): boolean {
        const stopWords = [
            'the', 'and', 'a', 'an', 'in', 'on', 'at', 'for', 'to', 'of', 'with', 'by',
            'as', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
            'do', 'does', 'did', 'from', 'that', 'this', 'these', 'those', 'then', 'than',
            'when', 'where', 'which', 'who', 'whom', 'whose', 'what', 'why', 'how',
            'или', 'и', 'в', 'на', 'с', 'по', 'для', 'от', 'к', 'о', 'об', 'при',
            'за', 'из', 'под', 'над', 'без', 'до', 'после', 'через', 'как', 'что', 'где',
            'когда', 'кто', 'чей', 'который', 'чтобы', 'если', 'то', 'бы', 'ли'
        ];

        return stopWords.includes(word.toLowerCase());
    }

    /**
     * Определяет направление зависимости на основе приоритета требований
     * @param req1 Первое требование
     * @param req2 Второе требование
     * @returns true, если первое требование зависит от второго на основе приоритета
     */
    private determineDependencyByPriority(req1: Requirement, req2: Requirement): boolean {
        // Обычно требования с более низким приоритетом зависят от требований с более высоким приоритетом
        const priorityMap = {
            [RequirementPriority.HIGH]: 3,
            [RequirementPriority.MEDIUM]: 2,
            [RequirementPriority.LOW]: 1
        };

        return priorityMap[req1.priority] < priorityMap[req2.priority];
    }

    /**
     * Определяет направление зависимости на основе типа требований
     * @param req1 Первое требование
     * @param req2 Второе требование
     * @returns true, если первое требование зависит от второго на основе типа
     */
    private determineDependencyByType(req1: Requirement, req2: Requirement): boolean {
        // Обычно функциональные требования зависят от нефункциональных
        // А конкретные типы имеют свою специфику зависимостей

        // Функциональные требования часто зависят от требований безопасности
        if (req1.type === RequirementType.FUNCTIONAL && req2.type === RequirementType.SECURITY) {
            return true;
        }

        // UI-требования часто зависят от функциональных
        if (req1.type === RequirementType.USER_INTERFACE && req2.type === RequirementType.FUNCTIONAL) {
            return true;
        }

        // Требования производительности часто связаны с функциональными
        if (req1.type === RequirementType.PERFORMANCE && req2.type === RequirementType.FUNCTIONAL) {
            return true;
        }

        return false;
    }

    /**
     * Определяет, есть ли логическая последовательная зависимость между требованиями
     * @param currentReq Текущее требование
     * @param previousReq Предыдущее требование
     * @returns true, если текущее требование логически следует за предыдущим
     */
    private determineDependencyBySequence(currentReq: Requirement, previousReq: Requirement): boolean {
        // Игнорируем требования из разных источников
        if (currentReq.source !== previousReq.source) {
            return false;
        }

        // Проверяем на наличие маркеров последовательности
        const sequenceMarkers = [
            'after', 'then', 'next', 'following', 'subsequently', 'once',
            'later', 'secondly', 'finally', 'lastly', 'eventually',
            'после', 'затем', 'далее', 'следующий', 'в дальнейшем',
            'позже', 'во-вторых', 'наконец', 'в конечном итоге'
        ];

        for (const marker of sequenceMarkers) {
            if (currentReq.description.toLowerCase().startsWith(marker)) {
                return true;
            }
        }

        // Проверяем на наличие связи "часть-целое"
        const partWholeMarkers = [
            'part of', 'component of', 'element of', 'aspect of', 'feature of',
            'часть', 'компонент', 'элемент', 'аспект', 'функция'
        ];

        for (const marker of partWholeMarkers) {
            if (currentReq.description.toLowerCase().includes(marker)) {
                return true;
            }
        }

        // Дополнительные эвристики могут быть добавлены здесь

        return false;
    }

    /**
     * Разрешает циклические зависимости, удаляя наименее уверенные связи
     * @param dependencies Список зависимостей
     */
    private resolveCyclicDependencies(dependencies: RequirementDependency[]): void {
        // Строим граф зависимостей
        const graph: { [reqId: string]: string[] } = {};

        for (const dep of dependencies) {
            if (!graph[dep.requirementId]) {
                graph[dep.requirementId] = [];
            }
            graph[dep.requirementId].push(dep.dependsOnId);
        }

        // Обнаруживаем циклы в графе
        const visited = new Set<string>();
        const recursionStack = new Set<string>();

        // DFS функция для обнаружения циклов
        const detectCycle = (node: string, path: string[] = []): string[] | null => {
            if (!graph[node]) return null;

            visited.add(node);
            recursionStack.add(node);

            const currentPath = [...path, node];

            for (const neighbor of graph[node]) {
                if (!visited.has(neighbor)) {
                    const cyclePath = detectCycle(neighbor, currentPath);
                    if (cyclePath) return cyclePath;
                } else if (recursionStack.has(neighbor)) {
                    return [...currentPath, neighbor];
                }
            }

            recursionStack.delete(node);
            return null;
        };

        // Находим и разрываем циклы
        for (const node of Object.keys(graph)) {
            if (!visited.has(node)) {
                const cycle = detectCycle(node);
                if (cycle) {
                    // Находим ребро для удаления (обычно выбираем наименее уверенную связь)
                    let indexToRemove = -1;
                    let minConfidence = Number.MAX_VALUE;

                    // Проходим по циклу и ищем наименее уверенную связь
                    for (let i = 0; i < cycle.length - 1; i++) {
                        const from = cycle[i];
                        const to = cycle[i + 1];

                        // Находим соответствующую зависимость
                        const depIndex = dependencies.findIndex(
                            dep => dep.requirementId === from && dep.dependsOnId === to
                        );

                        if (depIndex !== -1) {
                            const dep = dependencies[depIndex];
                            // Вычисляем "уверенность" на основе типа зависимости
                            let confidence = 0;

                            switch (dep.type) {
                                case 'requires': confidence = 3; break;
                                case 'constrained_by': confidence = 2; break;
                                case 'related_to': confidence = 1; break;
                                case 'potentially_follows': confidence = 0; break;
                                default: confidence = 0;
                            }

                            if (confidence < minConfidence) {
                                minConfidence = confidence;
                                indexToRemove = depIndex;
                            }
                        }
                    }

                    // Удаляем наименее уверенную связь
                    if (indexToRemove !== -1) {
                        dependencies.splice(indexToRemove, 1);

                        // Обновляем граф
                        graph[dependencies[indexToRemove].requirementId] =
                            graph[dependencies[indexToRemove].requirementId].filter(
                                id => id !== dependencies[indexToRemove].dependsOnId
                            );
                    }
                }
            }
        }
    }

    /**
     * Проверяет требования на противоречия
     * @param requirements Список требований
     * @returns Найденные противоречия
     */
    async checkForContradictions(requirements: Requirement[]): Promise<{
        conflictsFound: boolean;
        conflicts?: {
            description: string;
            relatedRequirements: string[];
            resolutionOptions?: string[];
        }[];
    }> {
        const conflicts: {
            description: string;
            relatedRequirements: string[];
            resolutionOptions?: string[];
        }[] = [];

        // Если слишком мало требований - противоречий быть не может
        if (requirements.length < 2) {
            return { conflictsFound: false };
        }

        // Словарь ключевых слов для противоречий
        const CONFLICT_INDICATORS = {
            // Противоположные действия
            actionConflicts: [
                ['add', 'remove'], ['create', 'delete'], ['enable', 'disable'],
                ['show', 'hide'], ['increase', 'decrease'], ['expand', 'collapse'],
                ['open', 'close'], ['start', 'stop'], ['activate', 'deactivate'],
                ['allow', 'forbid'], ['permit', 'prohibit'], ['include', 'exclude'],
                ['добавить', 'удалить'], ['создать', 'удалить'], ['включить', 'выключить'],
                ['показать', 'скрыть'], ['увеличить', 'уменьшить'], ['развернуть', 'свернуть'],
                ['разрешить', 'запретить'], ['включить', 'исключить']
            ],
            // Противоположные состояния
            stateConflicts: [
                ['on', 'off'], ['enabled', 'disabled'], ['visible', 'invisible'], ['hidden', 'shown'],
                ['active', 'inactive'], ['connected', 'disconnected'], ['synchronized', 'unsynchronized'],
                ['locked', 'unlocked'], ['available', 'unavailable'], ['completed', 'incomplete'],
                ['включен', 'выключен'], ['активен', 'неактивен'], ['видимый', 'невидимый'],
                ['заблокирован', 'разблокирован'], ['доступен', 'недоступен'], ['завершен', 'незавершен']
            ],
            // Противоположные характеристики качества
            qualityConflicts: [
                ['fast', 'slow'], ['high performance', 'low resource usage'],
                ['secure', 'easy to use'], ['detailed', 'concise'],
                ['comprehensive', 'simple'], ['centralized', 'distributed'],
                ['быстрый', 'медленный'], ['высокая производительность', 'низкое потребление ресурсов'],
                ['безопасный', 'простой в использовании'], ['подробный', 'краткий']
            ]
        };

        // 1. Анализ на прямые противоречия по ключевым словам
        for (let i = 0; i < requirements.length; i++) {
            const req1 = requirements[i];
            const desc1 = req1.description.toLowerCase();

            for (let j = i + 1; j < requirements.length; j++) {
                const req2 = requirements[j];
                const desc2 = req2.description.toLowerCase();

                // Проверяем наличие противоположных действий
                for (const [action1, action2] of CONFLICT_INDICATORS.actionConflicts) {
                    if ((desc1.includes(action1) && desc2.includes(action2)) ||
                        (desc1.includes(action2) && desc2.includes(action1))) {

                        // Проверяем, относятся ли противоположные действия к одному объекту
                        // Для этого ищем общие существительные вокруг этих действий
                        const desc1Words = desc1.split(/\s+/);
                        const desc2Words = desc2.split(/\s+/);
                        const commonWords = desc1Words.filter(word =>
                            desc2Words.includes(word) && word.length > 3 && !this.isStopWord(word)
                        );

                        if (commonWords.length > 0) {
                            conflicts.push({
                                description: `Conflicting actions: "${action1}" vs "${action2}" for ${commonWords.join(', ')}`,
                                relatedRequirements: [req1.id, req2.id],
                                resolutionOptions: [
                                    `Clarify conditions for each action`,
                                    `Add timing or sequence constraints`,
                                    `Specify different contexts or user roles`,
                                    `Prioritize one requirement over the other`
                                ]
                            });
                        }
                    }
                }

                // Проверяем наличие противоположных состояний
                for (const [state1, state2] of CONFLICT_INDICATORS.stateConflicts) {
                    if ((desc1.includes(state1) && desc2.includes(state2)) ||
                        (desc1.includes(state2) && desc2.includes(state1))) {

                        // Проверяем, относятся ли противоположные состояния к одному объекту
                        const desc1Words = desc1.split(/\s+/);
                        const desc2Words = desc2.split(/\s+/);
                        const commonWords = desc1Words.filter(word =>
                            desc2Words.includes(word) && word.length > 3 && !this.isStopWord(word)
                        );

                        if (commonWords.length > 0) {
                            conflicts.push({
                                description: `Conflicting states: "${state1}" vs "${state2}" for ${commonWords.join(', ')}`,
                                relatedRequirements: [req1.id, req2.id],
                                resolutionOptions: [
                                    `Clarify the state transition conditions`,
                                    `Specify different contexts or modes`,
                                    `Define a state machine with clear transitions`,
                                    `Prioritize one state over the other in specific scenarios`
                                ]
                            });
                        }
                    }
                }

                // Проверяем конфликты качественных характеристик
                for (const [quality1, quality2] of CONFLICT_INDICATORS.qualityConflicts) {
                    if ((desc1.includes(quality1) && desc2.includes(quality2)) ||
                        (desc1.includes(quality2) && desc2.includes(quality1))) {
                        conflicts.push({
                            description: `Conflicting quality attributes: "${quality1}" vs "${quality2}"`,
                            relatedRequirements: [req1.id, req2.id],
                            resolutionOptions: [
                                `Define acceptable thresholds for both qualities`,
                                `Specify trade-off parameters`,
                                `Prioritize qualities based on context`,
                                `Use different qualities for different system components`
                            ]
                        });
                    }
                }
            }
        }

        // 2. Проверка числовых противоречий
        // Ищем и анализируем числовые требования, например, "response time < 100ms" vs "throughput > 1000 req/s"
        const numericRequirements = requirements.filter(req => {
            const desc = req.description.toLowerCase();
            // Ищем числовые значения и операторы сравнения
            return /[<>]=?\s*\d+|\d+\s*[<>]=?/.test(desc);
        });

        if (numericRequirements.length >= 2) {
            // Классифицируем требования по метрикам
            const metricGroups: { [key: string]: { req: Requirement, value: number, operator: string }[] } = {};

            // Определяем метрики и их значения
            const metrics = [
                'response time', 'load time', 'throughput', 'latency', 'memory usage', 'cpu usage',
                'storage', 'bandwidth', 'concurrent users', 'requests per second',
                'время отклика', 'время загрузки', 'пропускная способность', 'задержка',
                'использование памяти', 'использование процессора', 'хранилище',
                'пропускная способность сети', 'одновременных пользователей'
            ];

            for (const req of numericRequirements) {
                const desc = req.description.toLowerCase();

                // Для каждой метрики проверяем, упоминается ли она в требовании
                for (const metric of metrics) {
                    if (desc.includes(metric)) {
                        // Извлекаем значение и оператор
                        const match = desc.match(/([<>]=?)\s*(\d+)|\s*(\d+)\s*([<>]=?)/);
                        if (match) {
                            const operator = match[1] || match[4];
                            const value = parseInt(match[2] || match[3], 10);

                            if (!metricGroups[metric]) {
                                metricGroups[metric] = [];
                            }

                            metricGroups[metric].push({ req, value, operator });
                        }
                    }
                }
            }

            // Анализируем каждую группу метрик на противоречия
            for (const [metric, reqs] of Object.entries(metricGroups)) {
                if (reqs.length >= 2) {
                    // Сортируем по значению
                    reqs.sort((a, b) => a.value - b.value);

                    // Ищем противоречия типа "X < 100" и "X > 200"
                    for (let i = 0; i < reqs.length - 1; i++) {
                        for (let j = i + 1; j < reqs.length; j++) {
                            const req1 = reqs[i];
                            const req2 = reqs[j];

                            // Проверяем на противоречия
                            let conflictFound = false;

                            // "<" и ">" с несовместимыми значениями
                            if (req1.operator.includes('<') && req2.operator.includes('>')) {
                                if (req1.value <= req2.value) {
                                    conflictFound = true;
                                }
                            }
                            // ">" и "<" с несовместимыми значениями
                            else if (req1.operator.includes('>') && req2.operator.includes('<')) {
                                if (req1.value >= req2.value) {
                                    conflictFound = true;
                                }
                            }

                            if (conflictFound) {
                                conflicts.push({
                                    description: `Numeric conflict for ${metric}: "${req1.req.description}" vs "${req2.req.description}"`,
                                    relatedRequirements: [req1.req.id, req2.req.id],
                                    resolutionOptions: [
                                        `Redefine acceptable ranges for ${metric}`,
                                        `Specify different contexts or operation modes`,
                                        `Consider trade-offs with other quality attributes`,
                                        `Prioritize one requirement based on business needs`
                                    ]
                                });
                            }
                        }
                    }
                }
            }
        }

        // 3. Конфликты на основе типов требований
        // Некоторые типы требований могут быть противоречивыми по своей природе
        const securityReqs = requirements.filter(req => req.type === RequirementType.SECURITY);
        const uiReqs = requirements.filter(req => req.type === RequirementType.USER_INTERFACE);
        const perfReqs = requirements.filter(req => req.type === RequirementType.PERFORMANCE);

        // Ищем противоречия между безопасностью и удобством использования
        for (const secReq of securityReqs) {
            for (const uiReq of uiReqs) {
                // Проверяем, есть ли ключевые слова в обоих требованиях, указывающие на противоречие
                const secDesc = secReq.description.toLowerCase();
                const uiDesc = uiReq.description.toLowerCase();

                const securityKeywords = ['authentication', 'verification', 'validation', 'password', 'access control',
                    'аутентификация', 'проверка', 'валидация', 'пароль', 'контроль доступа'];
                const usabilityKeywords = ['simple', 'easy', 'intuitive', 'quick', 'streamlined', 'one-click',
                    'простой', 'легкий', 'интуитивный', 'быстрый', 'упрощенный', 'в один клик'];

                const hasSecurityKeyword = securityKeywords.some(keyword => secDesc.includes(keyword));
                const hasUsabilityKeyword = usabilityKeywords.some(keyword => uiDesc.includes(keyword));

                if (hasSecurityKeyword && hasUsabilityKeyword) {
                    conflicts.push({
                        description: `Potential security-usability conflict: "${secReq.description}" vs "${uiReq.description}"`,
                        relatedRequirements: [secReq.id, uiReq.id],
                        resolutionOptions: [
                            `Use progressive security measures based on sensitivity`,
                            `Employ user-friendly security mechanisms`,
                            `Implement context-aware security`,
                            `Consider risk-based authentication approaches`
                        ]
                    });
                }
            }
        }

        // Ищем противоречия между производительностью и другими нефункциональными требованиями
        for (const perfReq of perfReqs) {
            const otherNonFunctionalReqs = requirements.filter(req =>
                req.id !== perfReq.id &&
                req.type !== RequirementType.FUNCTIONAL
            );

            for (const otherReq of otherNonFunctionalReqs) {
                const perfDesc = perfReq.description.toLowerCase();
                const otherDesc = otherReq.description.toLowerCase();

                const perfKeywords = ['fast', 'quick', 'responsive', 'low latency', 'high throughput',
                    'быстрый', 'скорость', 'отзывчивый', 'низкая задержка', 'высокая пропускная способность'];

                const conflictingKeywords: { [key: string]: string[] } = {
                    [RequirementType.SECURITY]: ['encryption', 'verification', 'validation', 'шифрование', 'проверка'],
                    [RequirementType.RELIABILITY]: ['redundancy', 'backup', 'consistency', 'избыточность', 'резервирование'],
                    [RequirementType.COMPATIBILITY]: ['support for legacy', 'backward compatibility', 'поддержка устаревших', 'обратная совместимость']
                };

                const hasPerfKeyword = perfKeywords.some(keyword => perfDesc.includes(keyword));
                const hasConflictingKeyword = (conflictingKeywords[otherReq.type] || []).some(keyword => otherDesc.includes(keyword));

                if (hasPerfKeyword && hasConflictingKeyword) {
                    conflicts.push({
                        description: `Potential performance-${otherReq.type.toLowerCase()} conflict: "${perfReq.description}" vs "${otherReq.description}"`,
                        relatedRequirements: [perfReq.id, otherReq.id],
                        resolutionOptions: [
                            `Define acceptable performance thresholds`,
                            `Consider performance optimizations specific to ${otherReq.type}`,
                            `Implement selective application of ${otherReq.type} features`,
                            `Use dynamic trade-off mechanisms based on context`
                        ]
                    });
                }
            }
        }

        // 4. Конфликты приоритетов
        // Проверяем, есть ли требования с одинаковым высоким приоритетом, но конфликтующие по смыслу
        const highPriorityReqs = requirements.filter(req => req.priority === RequirementPriority.HIGH);

        if (highPriorityReqs.length >= 2) {
            // Проверяем высокоприоритетные требования на противоречия
            for (let i = 0; i < highPriorityReqs.length - 1; i++) {
                for (let j = i + 1; j < highPriorityReqs.length; j++) {
                    const req1 = highPriorityReqs[i];
                    const req2 = highPriorityReqs[j];

                    // Используем простую метрику сходства
                    const words1 = req1.description.toLowerCase().split(/\s+/);
                    const words2 = req2.description.toLowerCase().split(/\s+/);

                    // Находим общие слова
                    const commonWords = words1.filter(word =>
                        words2.includes(word) &&
                        word.length > 3 &&
                        !this.isStopWord(word)
                    );

                    // Если есть общие слова, но требования отличаются, возможен конфликт приоритетов
                    if (commonWords.length > 0 &&
                        (words1.length !== words2.length || req1.description !== req2.description)) {

                        // Проверяем на наличие противоположных ключевых слов
                        let hasOppositeKeywords = false;

                        // Объединяем все ключевые слова противоречий
                        const allConflictPairs = [
                            ...CONFLICT_INDICATORS.actionConflicts,
                            ...CONFLICT_INDICATORS.stateConflicts,
                            ...CONFLICT_INDICATORS.qualityConflicts
                        ];

                        for (const [word1, word2] of allConflictPairs) {
                            if ((req1.description.toLowerCase().includes(word1) && req2.description.toLowerCase().includes(word2)) ||
                                (req1.description.toLowerCase().includes(word2) && req2.description.toLowerCase().includes(word1))) {
                                hasOppositeKeywords = true;
                                break;
                            }
                        }

                        if (hasOppositeKeywords) {
                            conflicts.push({
                                description: `Priority conflict between high-priority requirements: "${req1.description}" vs "${req2.description}"`,
                                relatedRequirements: [req1.id, req2.id],
                                resolutionOptions: [
                                    `Reassess priorities based on business value`,
                                    `Split into separate features with different release schedules`,
                                    `Define context-specific priority rules`,
                                    `Consult stakeholders for priority clarification`
                                ]
                            });
                        }
                    }
                }
            }
        }

        return {
            conflictsFound: conflicts.length > 0,
            conflicts: conflicts.length > 0 ? conflicts : undefined
        };
    }

    /**
     * Оценивает сложность реализации требований
     * @param requirements Список требований
     * @param existingArchitecture Информация о существующей архитектуре
     * @returns Оценки сложности
     */
    async estimateComplexity(
        requirements: Requirement[],
        existingArchitecture?: any
    ): Promise<{
        individualComplexity: ComplexityEstimation[];
        overallComplexity: number;
    }> {
        const individualComplexity: ComplexityEstimation[] = [];

        // Если список требований пуст, возвращаем пустой результат
        if (requirements.length === 0) {
            return {
                individualComplexity: [],
                overallComplexity: 0
            };
        }

        // Определяем факторы сложности для различных типов требований
        const complexityFactors = {
            // Факторы сложности для функциональных требований
            [RequirementType.FUNCTIONAL]: {
                highFactors: [
                    'machine learning', 'ai', 'artificial intelligence', 'neural network',
                    'complex algorithm', 'distributed', 'synchronization', 'concurrency',
                    'real-time', 'streaming', 'blockchain', 'cryptography', 'optimization',
                    'машинное обучение', 'искусственный интеллект', 'нейронная сеть',
                    'сложный алгоритм', 'распределенный', 'синхронизация', 'параллельная обработка',
                    'реального времени', 'потоковая обработка', 'блокчейн', 'криптография'
                ],
                mediumFactors: [
                    'database', 'api integration', 'file processing', 'reporting',
                    'search functionality', 'filtering', 'batch processing',
                    'multi-step process', 'workflow', 'state management',
                    'база данных', 'интеграция api', 'обработка файлов', 'отчетность',
                    'функциональность поиска', 'фильтрация', 'пакетная обработка',
                    'многоэтапный процесс', 'рабочий процесс', 'управление состоянием'
                ],
                lowFactors: [
                    'simple validation', 'basic form', 'static content', 'display',
                    'read-only', 'configuration', 'simple logic', 'common pattern',
                    'простая валидация', 'базовая форма', 'статический контент',
                    'отображение', 'только для чтения', 'конфигурация', 'простая логика'
                ]
            },
            // Факторы сложности для требований производительности
            [RequirementType.PERFORMANCE]: {
                highFactors: [
                    'microsecond', 'low latency trading', 'real-time processing',
                    'high frequency', 'massive scale', 'millions of users',
                    'petabyte', 'terabyte', 'микросекунда', 'торговля с низкой задержкой',
                    'обработка в реальном времени', 'высокая частота', 'массивный масштаб',
                    'миллионы пользователей', 'петабайт', 'терабайт'
                ],
                mediumFactors: [
                    'millisecond', 'caching', 'optimization', 'throughput',
                    'thousands of users', 'gigabyte', 'миллисекунда', 'кэширование',
                    'оптимизация', 'пропускная способность', 'тысячи пользователей', 'гигабайт'
                ],
                lowFactors: [
                    'second', 'responsive', 'moderate performance', 'standard requirements',
                    'секунда', 'отзывчивый', 'умеренная производительность', 'стандартные требования'
                ]
            },
            // Факторы сложности для требований безопасности
            [RequirementType.SECURITY]: {
                highFactors: [
                    'encryption', 'military grade', 'confidential data', 'authentication',
                    'authorization', 'role-based access', 'compliance', 'audit',
                    'penetration testing', 'шифрование', 'военного уровня', 'конфиденциальные данные',
                    'аутентификация', 'авторизация', 'ролевой доступ', 'соответствие',
                    'аудит', 'тестирование на проникновение'
                ],
                mediumFactors: [
                    'secure communication', 'user permissions', 'https', 'ssl',
                    'data protection', 'безопасная связь', 'разрешения пользователя',
                    'защита данных'
                ],
                lowFactors: [
                    'basic validation', 'input sanitization', 'standard security',
                    'базовая проверка', 'очистка ввода', 'стандартная безопасность'
                ]
            },
            // Факторы сложности для требований к пользовательскому интерфейсу
            [RequirementType.USER_INTERFACE]: {
                highFactors: [
                    'complex visualization', 'interactive dashboard', 'drag and drop',
                    'real-time updates', 'animations', 'canvas', 'custom controls',
                    'сложная визуализация', 'интерактивная панель', 'перетаскивание',
                    'обновления в реальном времени', 'анимации', 'холст', 'пользовательские элементы управления'
                ],
                mediumFactors: [
                    'responsive design', 'multiple themes', 'form validation',
                    'dynamic content', 'адаптивный дизайн', 'несколько тем',
                    'проверка формы', 'динамический контент'
                ],
                lowFactors: [
                    'static page', 'simple form', 'basic styling', 'standard controls',
                    'статическая страница', 'простая форма', 'базовый стиль', 'стандартные элементы управления'
                ]
            },
            // Факторы сложности для требований совместимости
            [RequirementType.COMPATIBILITY]: {
                highFactors: [
                    'legacy systems', 'multiple platforms', 'backward compatibility',
                    'cross-browser', 'cross-device', 'старые системы', 'несколько платформ',
                    'обратная совместимость', 'кросс-браузерная', 'кросс-устройственная'
                ],
                mediumFactors: [
                    'specific browser', 'specific os', 'specific device',
                    'конкретный браузер', 'конкретная ос', 'конкретное устройство'
                ],
                lowFactors: [
                    'standard compatibility', 'common platforms', 'стандартная совместимость',
                    'общие платформы'
                ]
            },
            // Факторы сложности для требований надежности
            [RequirementType.RELIABILITY]: {
                highFactors: [
                    'failover', 'high availability', 'disaster recovery', 'redundancy',
                    'fault tolerance', 'резервирование', 'высокая доступность',
                    'аварийное восстановление', 'избыточность', 'отказоустойчивость'
                ],
                mediumFactors: [
                    'error handling', 'exception handling', 'retry mechanism',
                    'monitoring', 'обработка ошибок', 'обработка исключений',
                    'механизм повторных попыток', 'мониторинг'
                ],
                lowFactors: [
                    'basic logging', 'simple validation', 'базовое логирование',
                    'простая проверка'
                ]
            }
        };

        // Количественные оценки сложности по типу и приоритету
        const baseComplexity = {
            [RequirementType.FUNCTIONAL]: 3,
            [RequirementType.PERFORMANCE]: 4,
            [RequirementType.SECURITY]: 5,
            [RequirementType.USER_INTERFACE]: 2,
            [RequirementType.COMPATIBILITY]: 3,
            [RequirementType.RELIABILITY]: 4
        };

        const priorityMultiplier = {
            [RequirementPriority.HIGH]: 1.2,
            [RequirementPriority.MEDIUM]: 1.0,
            [RequirementPriority.LOW]: 0.8
        };

        // Карта зависимостей для учета в оценке сложности
        // Строим граф зависимостей, чтобы учесть их в оценке сложности
        const dependencies = await this.identifyDependencies(requirements);
        const dependencyGraph: { [reqId: string]: string[] } = {};
        const dependentsCount: { [reqId: string]: number } = {};

        // Инициализируем счетчики зависимостей
        requirements.forEach(req => {
            dependencyGraph[req.id] = [];
            dependentsCount[req.id] = 0;
        });

        // Заполняем граф зависимостей
        dependencies.forEach(dep => {
            dependencyGraph[dep.requirementId].push(dep.dependsOnId);
            dependentsCount[dep.dependsOnId] = (dependentsCount[dep.dependsOnId] || 0) + 1;
        });

        // Оценка сложности для каждого требования
        for (const req of requirements) {
            // Базовая сложность по типу требования
            let score = baseComplexity[req.type] || 3;

            // Корректируем по приоритету
            score *= priorityMultiplier[req.priority] || 1.0;

            // Анализируем текст требования на наличие факторов сложности
            const description = req.description.toLowerCase();
            const factors: string[] = [];

            // Добавляем факторы из текста требования
            let factorMultiplier = 1.0;

            if (complexityFactors[req.type]) {
                // Высокие факторы сложности
                for (const factor of complexityFactors[req.type].highFactors) {
                    if (description.includes(factor.toLowerCase())) {
                        factors.push(`High: ${factor}`);
                        factorMultiplier *= 1.5;
                    }
                }

                // Средние факторы сложности
                for (const factor of complexityFactors[req.type].mediumFactors) {
                    if (description.includes(factor.toLowerCase())) {
                        factors.push(`Medium: ${factor}`);
                        factorMultiplier *= 1.2;
                    }
                }

                // Низкие факторы сложности
                for (const factor of complexityFactors[req.type].lowFactors) {
                    if (description.includes(factor.toLowerCase())) {
                        factors.push(`Low: ${factor}`);
                        factorMultiplier *= 0.8;
                    }
                }
            }

            // Учитываем длину описания (предполагая, что более длинные требования сложнее)
            if (description.length > 200) {
                factorMultiplier *= 1.2;
                factors.push('Long requirement description');
            }

            // Учитываем зависимости
            const dependencyCount = dependencyGraph[req.id].length;
            if (dependencyCount > 0) {
                factorMultiplier *= (1 + dependencyCount * 0.1); // Каждая зависимость добавляет 10% сложности
                factors.push(`Depends on ${dependencyCount} other requirement(s)`);
            }

            // Учитываем количество зависимых требований
            const dependentCount = dependentsCount[req.id] || 0;
            if (dependentCount > 0) {
                factorMultiplier *= (1 + dependentCount * 0.05); // Каждое зависимое требование добавляет 5% сложности
                factors.push(`${dependentCount} requirement(s) depend on this`);
            }

            // Учитываем существующую архитектуру, если она предоставлена
            if (existingArchitecture) {
                // Это простая заглушка - в реальном приложении здесь должен быть более сложный анализ
                if (typeof existingArchitecture === 'object' && existingArchitecture.complexity === 'high') {
                    factorMultiplier *= 1.3;
                    factors.push('Integration with complex existing architecture');
                }
            }

            // Применяем множитель факторов
            score *= factorMultiplier;

            // Ограничиваем сложность от 1 до 10
            score = Math.min(10, Math.max(1, score));

            // Округляем до одной десятой
            score = Math.round(score * 10) / 10;

            // Вычисляем временную оценку на основе сложности
            let timeEstimate: string;
            if (score <= 2) {
                timeEstimate = 'Hours (4-8)';
            } else if (score <= 4) {
                timeEstimate = '1-2 days';
            } else if (score <= 6) {
                timeEstimate = '3-5 days';
            } else if (score <= 8) {
                timeEstimate = '1-2 weeks';
            } else {
                timeEstimate = '2+ weeks';
            }

            individualComplexity.push({
                requirementId: req.id,
                score,
                factors,
                timeEstimate
            });
        }

        // Расчет общей сложности

        // 1. Учитываем индивидуальные сложности
        const sumScore = individualComplexity.reduce((sum, item) => sum + item.score, 0);

        // 2. Учитываем количество и сложность зависимостей
        const dependenciesScore = dependencies.length * 0.2; // Каждая зависимость добавляет 0.2 к общей сложности

        // 3. Учитываем количество разных типов требований
        const uniqueTypes = new Set(requirements.map(req => req.type)).size;
        const typesDiversityFactor = 1 + (uniqueTypes - 1) * 0.1; // Каждый дополнительный тип добавляет 10% сложности

        // 4. Учитываем наличие высокоприоритетных требований
        const highPriorityCount = requirements.filter(req => req.priority === RequirementPriority.HIGH).length;
        const priorityFactor = 1 + (highPriorityCount / requirements.length) * 0.2; // До 20% дополнительной сложности

        // Расчет итоговой сложности с учетом всех факторов
        let overallComplexity = (sumScore / requirements.length) * typesDiversityFactor * priorityFactor + dependenciesScore;

        // Ограничиваем общую сложность от 1 до 10
        overallComplexity = Math.min(10, Math.max(1, overallComplexity));

        // Округляем до одной десятой
        overallComplexity = Math.round(overallComplexity * 10) / 10;

        return {
            individualComplexity,
            overallComplexity
        };
    }

    /**
     * Генерирует техническую спецификацию на основе проанализированных требований
     * @param analysisResult Результат анализа требований
     * @returns Техническая спецификация
     */
    async generateTechnicalSpecification(analysisResult: RequirementsAnalysisResult): Promise<TechnicalSpecification> {
        // TODO: Реализовать генерацию детальной технической спецификации
        // Это заглушка для демонстрации

        return {
            id: `spec_${analysisResult.featureId}`,
            featureId: analysisResult.featureId,
            overview: `Technical specification for feature ${analysisResult.featureId}`,
            components: [
                {
                    name: 'MainComponent',
                    description: 'Main component for the feature implementation',
                    responsibilities: ['Handle core feature logic'],
                    interfaces: ['IMainComponent'],
                    dependencies: []
                }
            ],
            apis: ['GET /api/feature/{featureId}'],
            dataStructures: ['FeatureData'],
            testingStrategy: 'Unit tests + Integration tests'
        };
    }
} 
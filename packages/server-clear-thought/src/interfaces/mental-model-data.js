/**
 * @fileoverview Интерфейсы для инструмента Mental Model
 */

/**
 * @typedef {Object} MentalModelData
 * @property {string} modelName - Название ментальной модели
 * @property {string} problem - Проблема для анализа
 */

/**
 * Типы ментальных моделей
 * @enum {string}
 */
export const MentalModelTypes = {
    /** Мышление первыми принципами */
    FIRST_PRINCIPLES: 'first_principles',

    /** Альтернативные издержки */
    OPPORTUNITY_COST: 'opportunity_cost',

    /** Распространение ошибок */
    ERROR_PROPAGATION: 'error_propagation',

    /** Резиновая утка (объяснение проблемы простыми словами) */
    RUBBER_DUCK: 'rubber_duck',

    /** Принцип Парето (80/20) */
    PARETO_PRINCIPLE: 'pareto_principle',

    /** Бритва Оккама */
    OCCAMS_RAZOR: 'occams_razor',

    /** Регрессия к среднему */
    REGRESSION_TO_MEAN: 'regression_to_mean',

    /** Систематическая ошибка подтверждения */
    CONFIRMATION_BIAS: 'confirmation_bias',

    /** Нормальное распределение */
    NORMAL_DISTRIBUTION: 'normal_distribution',

    /** Анализ чувствительности */
    SENSITIVITY_ANALYSIS: 'sensitivity_analysis',

    /** Теорема Байеса */
    BAYES_THEOREM: 'bayes_theorem',

    /** Систематическая ошибка выжившего */
    SURVIVORSHIP_BIAS: 'survivorship_bias',

    /** Системное мышление */
    SYSTEMS_THINKING: 'systems_thinking',

    /** Мысленный эксперимент */
    THOUGHT_EXPERIMENT: 'thought_experiment',

    /** Бритва Хэнлона */
    HANLONS_RAZOR: 'hanlons_razor',

    /** Ближние и конечные причины */
    PROXIMATE_ULTIMATE_CAUSATION: 'proximate_ultimate_causation',

    /** Игра с нулевой суммой */
    ZERO_SUM_GAME: 'zero_sum_game',

    /** Избегание потерь */
    LOSS_AVERSION: 'sunk_cost',

    /** Необратимые затраты */
    SUNK_COST: 'sunk_cost',

    /** Латеральное мышление */
    LATERAL_THINKING: 'lateral_thinking',

    /** Дивергентное мышление */
    DIVERGENT_THINKING: 'divergent_thinking',

    /** Научный метод */
    SCIENTIFIC_METHOD: 'scientific_method',

    /** Дерево решений */
    DECISION_TREE: 'decision_tree',

    /** Планирование сценариев */
    SCENARIO_PLANNING: 'scenario_planning',

    /** Симуляция */
    SIMULATION: 'simulation',

    /** Катализ (ускорение изменений) */
    CATALYSIS: 'catalysis',

    /** Экосистема */
    ECOSYSTEM: 'ecosystem',

    /** Композиция против наследования (программирование) */
    COMPOSITION_VS_INHERITANCE: 'composition_vs_inheritance',

    /** Принцип единственной ответственности (программирование) */
    SINGLE_RESPONSIBILITY: 'single_responsibility',

    /** Разделение интерфейсов (программирование) */
    INTERFACE_SEGREGATION: 'interface_segregation',

    /** Модель акторов (программирование) */
    ACTOR_MODEL: 'actor_model',

    /** Сложность времени и пространства (программирование) */
    TIME_SPACE_COMPLEXITY: 'time_space_complexity'
};

// Экспорт для документации
export const MentalModelParameters = {
    modelName: "Конкретная ментальная модель для применения к проблеме. Для задач программирования рассмотрите использование специализированных моделей программирования: composition_vs_inheritance, single_responsibility, interface_segregation, actor_model или time_space_complexity. Выбор подходящей модели критически важен для получения полезных выводов.",

    problem: "Проблема для анализа с использованием выбранной ментальной модели. Описание должно быть четким, концентрированным и содержать достаточно контекста для применения выбранной модели. Для моделей программирования предоставьте конкретные проблемы дизайна кода или архитектуры."
}; 
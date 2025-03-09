/**
 * @fileoverview Интерфейсы для стохастического алгоритма
 */

/**
 * @typedef {Object} StochasticAlgorithmData
 * @property {string} algorithm - Тип алгоритма (mdp, mcts, bandit, bayesian, hmm)
 * @property {string} problem - Описание проблемы для решения
 * @property {Object} parameters - Параметры алгоритма
 * @property {string} [result] - Опциональный результат
 */

/**
 * @typedef {Object} MDPParameters
 * @property {number} [gamma=0.9] - Коэффициент дисконтирования
 * @property {number} [iterations=100] - Максимальное количество итераций
 * @property {string[]} [states] - Список возможных состояний
 * @property {string[]} [actions] - Список возможных действий
 * @property {Object} [rewards] - Матрица вознаграждений
 * @property {Object} [transitions] - Матрица переходов
 */

/**
 * @typedef {Object} MCTSParameters
 * @property {number} [explorationWeight=1.0] - Вес исследования
 * @property {number} [iterations=1000] - Количество итераций
 * @property {number} [timeLimit=5000] - Ограничение времени в миллисекундах
 * @property {Object} [initialState] - Начальное состояние
 */

/**
 * @typedef {Object} BanditParameters
 * @property {string} [strategy='epsilon-greedy'] - Стратегия (epsilon-greedy, ucb, thompson)
 * @property {number} [epsilon=0.1] - Параметр эпсилон для epsilon-greedy
 * @property {number} [arms=2] - Количество рук (вариантов)
 * @property {number[]} [priors] - Начальные вероятности для методов, использующих байесовский подход
 */

/**
 * @typedef {Object} BayesianParameters
 * @property {string} [method='mcmc'] - Метод (mcmc, variational, exact)
 * @property {number} [samples=1000] - Количество образцов
 * @property {Object} [priors] - Априорные распределения
 * @property {Object} [observations] - Наблюдения
 */

/**
 * @typedef {Object} HMMParameters
 * @property {number} [states=2] - Количество скрытых состояний
 * @property {string} [algorithm='forward-backward'] - Используемый алгоритм
 * @property {number[][]} [transitionMatrix] - Матрица переходов
 * @property {number[][]} [emissionMatrix] - Матрица излучения
 * @property {number[]} [initialProbabilities] - Начальные вероятности
 */

// Экспорт констант для использования в сервере
export const StochasticAlgorithms = {
    MDP: 'mdp',          // Markov Decision Process
    MCTS: 'mcts',        // Monte Carlo Tree Search
    BANDIT: 'bandit',    // Multi-Armed Bandit
    BAYESIAN: 'bayesian',// Bayesian Optimization
    HMM: 'hmm'           // Hidden Markov Model
};

// Экспорт для документации
export const StochasticAlgorithmParameters = {
    algorithm: "Стохастический алгоритм для применения. Каждый алгоритм подходит для разных типов задач принятия решений: 'mdp' идеален для последовательных решений с полностью наблюдаемыми состояниями, 'mcts' эффективен для сложного поиска в деревьях решений (например, в играх), 'bandit' оптимизирует исследование vs. использование при выборе из нескольких вариантов, 'bayesian' лучше всего подходит для оптимизации функций с дорогостоящей оценкой, а 'hmm' идеален для работы с частично наблюдаемыми последовательными данными.",

    problem: "Задача принятия решений для решения. Опишите неопределенность, варианты и желаемый результат. Четкое описание проблемы критически важно для правильной настройки алгоритма. Например, для задачи МДП (MDP) включите информацию о состояниях, действиях и моделях вознаграждения, а для задачи многоруких бандитов опишите варианты выбора и критерий успеха.",

    parameters: "Специфичные для алгоритма параметры настройки. Каждый алгоритм имеет свои собственные требования к параметрам, которые существенно влияют на его производительность. Например, MDP требует определения состояний, действий и функций вознаграждения, MCTS зависит от правильной настройки веса исследования, а байесовская оптимизация опирается на хорошо определенные априорные распределения. Тщательная настройка этих параметров может значительно улучшить качество решений."
}; 
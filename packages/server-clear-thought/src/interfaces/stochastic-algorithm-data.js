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
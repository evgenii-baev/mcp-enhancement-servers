/**
 * Feature Analyzer Module - Component for analyzing feature requirements
 * and generating technical specifications in the multi-level thinking architecture.
 */

// Экспорт основных типов
export * from './types.js';

// Экспорт основного класса
export { FeatureAnalyzer } from './feature-analyzer.js';

// Экспорт адаптеров
export { FeatureDiscussionAdapter } from './adapters/feature-discussion-adapter.js';

// Функция для создания экземпляра FeatureAnalyzer
import { FeatureAnalyzer } from './feature-analyzer.js';
export function createFeatureAnalyzer(): FeatureAnalyzer {
    return new FeatureAnalyzer();
} 
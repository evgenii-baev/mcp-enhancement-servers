# Feature Analyzer

Компонент для анализа требований к функциям и генерации технических спецификаций в многоуровневой архитектуре мышления MCP.

## Описание

FeatureAnalyzer - это специализированный инструмент мышления, который анализирует требования к функциям, выявляет зависимости и противоречия, оценивает сложность реализации и генерирует технические спецификации.

## Возможности

- Извлечение требований из данных обсуждения функций (интеграция с mcp-feature-discussion)
- Выявление зависимостей между требованиями
- Проверка требований на противоречия
- Оценка сложности реализации требований
- Генерация технических спецификаций

## Установка

```bash
npm install @mcp/feature-analyzer
```

## Использование

```typescript
import { createFeatureAnalyzer, FeatureAnalysisParams } from '@mcp/feature-analyzer';

// Создание экземпляра анализатора
const analyzer = createFeatureAnalyzer();

// Параметры для анализа
const params: FeatureAnalysisParams = {
  featureId: 'feature-123',
  featureTitle: 'User Authentication',
  featureDescription: 'Implement user authentication with email and password',
  additionalRequirements: [
    'Support for two-factor authentication',
    'Password reset functionality'
  ]
};

// Анализ функции
const result = await analyzer.analyzeFeature(params);

// Использование результатов
console.log(`Feature ID: ${result.featureId}`);
console.log(`Requirements: ${result.requirements.length}`);
console.log(`Overall complexity: ${result.overallComplexity}/10`);
console.log(`Technical specification: ${result.technicalSpecification.overview}`);
```

## Интеграция с mcp-feature-discussion

```typescript
import { createFeatureAnalyzer, FeatureDiscussionAdapter } from '@mcp/feature-analyzer';
import { getFeatureDiscussion } from '@mcp/feature-discussion';

// Получение данных обсуждения
const discussionData = await getFeatureDiscussion('feature-123');

// Создание экземпляра анализатора
const analyzer = createFeatureAnalyzer();

// Параметры для анализа с данными обсуждения
const params = {
  featureId: 'feature-123',
  featureTitle: 'User Authentication',
  featureDescription: 'Implement user authentication with email and password',
  discussionData
};

// Анализ функции
const result = await analyzer.analyzeFeature(params);
```

## API

### FeatureAnalyzer

Основной класс для анализа функций.

#### Methods

- `analyzeFeature(params: FeatureAnalysisParams): Promise<RequirementsAnalysisResult>`
- `generateTechnicalSpecification(analysisResult: RequirementsAnalysisResult): Promise<TechnicalSpecification>`
- `checkForContradictions(requirements: Requirement[]): Promise<{ conflictsFound: boolean; conflicts?: any[] }>`
- `estimateComplexity(requirements: Requirement[], existingArchitecture?: any): Promise<{ individualComplexity: ComplexityEstimation[]; overallComplexity: number }>`

### FeatureDiscussionAdapter

Адаптер для интеграции с mcp-feature-discussion.

#### Methods

- `static extractRequirements(discussionData: FeatureDiscussionData): Requirement[]`
- `static fromExternalFormat(externalData: any): FeatureDiscussionData`

## Лицензия

MIT 
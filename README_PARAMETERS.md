# Централизованное управление описаниями параметров

## Проблема и решение

При разработке инструментов MCP Enhancement Servers мы столкнулись с необходимостью дублировать описания параметров в нескольких местах:

1. В определениях серверов (для обработки запросов от клиентов)
2. В описаниях инструментов (для отображения в IDE и документации)

Это приводило к рассинхронизации описаний и усложняло поддержку.

Было создано решение с **централизованным хранилищем описаний параметров**, которое используется как для серверов, так и для документации. Это гарантирует согласованность описаний во всей системе.

## Архитектура

### 1. Централизованное хранилище описаний

Файл `src/interfaces/parameter-descriptions.ts` содержит все описания параметров инструментов в виде констант:

```typescript
export const FIRST_THOUGHT_ADVISOR_PARAM_DESCRIPTIONS = {
  problem: 'The problem to analyze...',
  goal: 'The desired outcome or objective...',
  // ...
};

export const MENTAL_MODEL_PARAM_DESCRIPTIONS = {
  // ...
};

// И так далее для всех инструментов
```

### 2. Утилиты для создания параметров

Файл `src/utils/parameter-utils.ts` содержит вспомогательные функции для создания параметров на основе центрального хранилища:

```typescript
export function createParameters(
  paramNames: string[],
  descriptions: Record<string, string>,
  paramTypes: Record<string, string | ParameterDefinition> = {},
  requiredParams: string[] = []
): Record<string, any> {
  // Создание объекта параметров для сервера
}
```

### 3. Использование в серверах

Каждый сервер импортирует описания своих параметров из центрального хранилища и использует их при создании:

```typescript
import { FIRST_THOUGHT_ADVISOR_PARAM_DESCRIPTIONS } from '../interfaces/parameter-descriptions.js';
import { createParameters } from '../utils/parameter-utils.js';

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
  
  // Реализация сервера...
}
```

### 4. Использование в описаниях инструментов

Описания инструментов также используют те же самые описания параметров:

```typescript
import { FIRST_THOUGHT_ADVISOR_PARAM_DESCRIPTIONS } from '../interfaces/parameter-descriptions.js';

export const FIRST_THOUGHT_ADVISOR_DESCRIPTION: ToolDescription = createToolDescription({
  // ...
  parameterDescriptions: FIRST_THOUGHT_ADVISOR_PARAM_DESCRIPTIONS,
  // ...
});
```

## Преимущества подхода

1. **Единый источник правды**: описания хранятся в одном месте
2. **Согласованность**: описания всегда идентичны во всей системе
3. **Удобство поддержки**: для изменения описания достаточно изменить его в одном месте
4. **Типизация**: благодаря TypeScript, можно обеспечить корректность типов параметров
5. **Автоматическая валидация**: проверка наличия описаний для всех параметров

## Как добавить новые параметры

1. Добавьте описания в соответствующий объект в `src/interfaces/parameter-descriptions.ts`
2. Используйте функцию `createParameters` при создании сервера
3. Используйте тот же объект описаний при создании описания инструмента

## Рекомендации по написанию описаний

1. **Краткость и ясность**: Описание должно быть понятным и лаконичным
2. **Полнота**: Укажите назначение, тип и допустимые значения
3. **Примеры**: По возможности, добавьте примеры значений
4. **Обязательность**: Укажите, является ли параметр обязательным
5. **Зависимости**: Опишите связи с другими параметрами, если они есть

## Дополнительные утилиты

### Валидация описаний

Для проверки наличия описаний всех параметров можно использовать функцию `validateParameterDescriptions`:

```typescript
import { validateParameterDescriptions } from '../utils/tool-description-utils.js';

const result = validateParameterDescriptions(TOOL_DESCRIPTION);
console.log(result.valid ? 'All parameters have descriptions' : 'Missing descriptions:', result.missingDescriptions);
```

### Запуск проверки

Запустите скрипт `npm run validate:params` для проверки описаний всех параметров.

### Автоматическое исправление

Запустите скрипт `npm run fix:params` для добавления шаблонов описаний для параметров, у которых они отсутствуют. 
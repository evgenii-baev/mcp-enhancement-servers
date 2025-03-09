/**
 * Утилиты для работы с параметрами серверов и инструментов
 */

/**
 * Типы параметров
 */
type ParameterType = 'string' | 'number' | 'boolean' | 'array' | 'object';

/**
 * Интерфейс для простого описания параметра
 */
export interface ParameterDefinition {
    type: ParameterType;
    required: boolean;
    arrayItemType?: ParameterType;
}

/**
 * Интерфейс для полного описания параметра
 */
export interface FullParameterDefinition extends ParameterDefinition {
    description: string;
}

/**
 * Типы параметров для разных типов данных
 */
const TYPE_DEFAULTS: Record<string, ParameterDefinition> = {
    string: { type: 'string', required: false },
    number: { type: 'number', required: false },
    boolean: { type: 'boolean', required: false },
    array: { type: 'array', required: false },
    object: { type: 'object', required: false },
    stringArray: { type: 'array', required: false, arrayItemType: 'string' },
    numberArray: { type: 'array', required: false, arrayItemType: 'number' }
};

/**
 * Создает параметр с описанием на основе имени, типа и описания
 * @param paramName Имя параметра
 * @param paramType Тип параметра или предустановленный тип
 * @param description Описание параметра
 * @param required Обязательность параметра
 * @returns Полное описание параметра
 */
export function createParameter(
    paramName: string,
    paramType: string | ParameterDefinition,
    description: string,
    required: boolean = false
): Record<string, any> {
    // Определяем базовую структуру параметра
    let paramDef: ParameterDefinition;

    if (typeof paramType === 'string') {
        // Используем предустановленный тип, если передана строка
        paramDef = { ...TYPE_DEFAULTS[paramType] };
    } else {
        // Используем переданное определение параметра
        paramDef = { ...paramType };
    }

    // Переопределяем required если указано
    paramDef.required = required;

    // Создаем полное определение параметра
    const fullDef: Record<string, any> = {
        type: paramDef.type,
        required: paramDef.required,
        description: description
    };

    // Добавляем информацию об элементах массива, если это массив
    if (paramDef.type === 'array' && paramDef.arrayItemType) {
        fullDef.items = { type: paramDef.arrayItemType };
    }

    return fullDef;
}

/**
 * Создает объект параметров для сервера на основе набора имен параметров и объекта описаний
 * @param paramNames Массив имен параметров
 * @param descriptions Объект с описаниями параметров
 * @param paramTypes Объект с типами параметров (опционально)
 * @param requiredParams Массив имен обязательных параметров (опционально)
 * @returns Объект с параметрами для передачи в сервер
 */
export function createParameters(
    paramNames: string[],
    descriptions: Record<string, string>,
    paramTypes: Record<string, string | ParameterDefinition> = {},
    requiredParams: string[] = []
): Record<string, any> {
    const parameters: Record<string, any> = {};

    for (const paramName of paramNames) {
        // Получаем описание параметра
        const description = descriptions[paramName] || `No description available for parameter '${paramName}'`;

        // Определяем тип параметра
        const paramType = paramTypes[paramName] || 'string';

        // Определяем обязательность параметра
        const required = requiredParams.includes(paramName);

        // Создаем параметр
        parameters[paramName] = createParameter(paramName, paramType, description, required);
    }

    return parameters;
} 
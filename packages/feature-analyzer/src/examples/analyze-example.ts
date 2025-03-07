/**
 * Пример использования FeatureAnalyzer для анализа функции
 */
import { FeatureAnalyzer, FeatureAnalysisParams, RequirementType, RequirementPriority } from '../index.js';

async function runExample() {
    console.log('Запуск примера анализа функции с помощью FeatureAnalyzer\n');

    // Создание анализатора
    const analyzer = new FeatureAnalyzer();
    console.log('FeatureAnalyzer создан\n');

    // Определение параметров для анализа
    const params: FeatureAnalysisParams = {
        featureId: 'example-feature-001',
        featureTitle: 'Инструмент визуализации архитектуры',
        featureDescription: 'Инструмент для визуального представления архитектуры проекта на основе результатов анализа требований. Должен позволять динамически отображать компоненты, зависимости и потоки данных.',
        additionalRequirements: [
            'Должен поддерживать экспорт в различные форматы (PNG, SVG, PDF)',
            'Должен позволять масштабировать и панорамировать визуализацию',
            'Должен автоматически обновляться при изменении архитектурных решений',
            'Должен иметь высокую производительность даже для сложных архитектур',
            'Должна быть возможность интеграции с существующими инструментами визуализации'
        ]
    };

    console.log('Параметры для анализа:');
    console.log(JSON.stringify(params, null, 2));
    console.log('\nНачинаем анализ...\n');

    try {
        // Выполнение анализа
        const result = await analyzer.analyzeFeature(params);

        // Вывод результатов
        console.log('Анализ завершен успешно!\n');
        console.log('Результаты анализа:');
        console.log('==================\n');

        console.log(`ID функции: ${result.featureId}`);
        console.log(`Общая сложность: ${result.overallComplexity}/10\n`);

        console.log('Выявленные требования:');
        result.requirements.forEach((req, index) => {
            console.log(`${index + 1}. [${req.type}][${req.priority}] ${req.description}`);
        });

        console.log('\nЗависимости:');
        if (result.dependencies.length === 0) {
            console.log('Не выявлено зависимостей');
        } else {
            result.dependencies.forEach((dep, index) => {
                console.log(`${index + 1}. ${dep.requirementId} -> ${dep.dependsOnId}: ${dep.type}`);
            });
        }

        console.log('\nТехническая спецификация:');
        if (result.technicalSpecification) {
            console.log('Компоненты:');
            result.technicalSpecification.components.forEach((comp, index) => {
                console.log(`${index + 1}. ${comp.name}: ${comp.description}`);
                console.log(`   Ответственности: ${comp.responsibilities.join(', ')}`);
                if (comp.dependencies && comp.dependencies.length > 0) {
                    console.log('   Зависимости:');
                    comp.dependencies.forEach(dep => {
                        console.log(`   - ${dep}`);
                    });
                }
                console.log('');
            });

            console.log('API:');
            if (result.technicalSpecification.apis && result.technicalSpecification.apis.length > 0) {
                result.technicalSpecification.apis.forEach((api, index) => {
                    console.log(`${index + 1}. ${api}`);
                });
            } else {
                console.log('API не определены');
            }
        } else {
            console.log('Техническая спецификация не сгенерирована');
        }

    } catch (error) {
        console.error('Произошла ошибка при анализе:');
        console.error(error);
    }
}

// Запуск примера
runExample().catch(console.error); 
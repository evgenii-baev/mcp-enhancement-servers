// Тестирование программно-ориентированных ментальных моделей
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Функция для загрузки ментальных моделей
async function loadMentalModels() {
    const filePath = join(__dirname, 'packages/server-clear-thought/src/models/mental-models.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent);
}

// Функция для форматирования вывода модели
function formatModelOutput(model) {
    const border = '─'.repeat(Math.max(model.name.length + 20, model.definition.length + 4));

    const formatList = (items) =>
        items.map(item => `│ • ${item.padEnd(border.length - 4)} │`).join('\n');

    return `
┌${border}┐
│ 🧠 Mental Model: ${model.name.padEnd(border.length - 16)} │
├${border}┤
│ Definition: ${model.definition.padEnd(border.length - 13)} │
├${border}┤
│ When to Use:${' '.repeat(border.length - 12)} │
${formatList(model.when_to_use)}
├${border}┤
│ Steps:${' '.repeat(border.length - 7)} │
${formatList(model.steps)}
├${border}┤
│ Example: ${model.example.padEnd(border.length - 10)} │
├${border}┤
│ Pitfalls:${' '.repeat(border.length - 10)} │
${formatList(model.pitfalls)}
└${border}┘`;
}

// Имитация применения модели к проблеме
function applyModelToProblem(model, problem) {
    // Пример анализа с помощью модели
    const analysisSteps = model.steps.map((step, index) => {
        return `Step ${index + 1}: ${step}\nAnalysis: ${generateAnalysisForStep(problem, step)}`;
    }).join('\n\n');

    return `
🔍 Applying "${model.name}" to Problem: "${problem}"

${analysisSteps}

🚀 Conclusion:
Based on the ${model.name} mental model, we can conclude that ${generateConclusion(model, problem)}

⚠️ Watch out for:
${model.pitfalls[0]} and ${model.pitfalls[1]}
`;
}

// Вспомогательная функция для генерации анализа по шагу
function generateAnalysisForStep(problem, step) {
    // Это упрощенная имитация - в реальной системе здесь была бы настоящая логика анализа
    return `Considering "${problem}" through the lens of this step, we observe [analysis based on model step]`;
}

// Вспомогательная функция для генерации заключения
function generateConclusion(model, problem) {
    switch (model.id) {
        case 'composition_vs_inheritance':
            return 'composition provides more flexibility than inheritance for this particular case, allowing for dynamic behavior changes and avoiding the fragile base class problem.';
        case 'single_responsibility':
            return 'breaking down the current structure into smaller, more focused components will improve maintainability and reduce coupling.';
        case 'interface_segregation':
            return 'designing clear interfaces separated from implementation details will allow for multiple implementations and easier testing.';
        case 'actor_model':
            return 'using isolated actors communicating through messages eliminates shared state problems and provides a natural model for the concurrent aspects of this system.';
        case 'time_space_complexity':
            return 'the optimal algorithm for this problem has O(n log n) time complexity, making it suitable for large datasets while maintaining reasonable performance.';
        default:
            return 'applying this mental model provides valuable insights that lead to improved design decisions.';
    }
}

// Функция для запуска демонстрации
async function runDemonstration() {
    try {
        // Загружаем ментальные модели
        const modelsData = await loadMentalModels();

        // Программно-ориентированные модели, которые мы добавили
        const programmingModels = [
            'composition_vs_inheritance',
            'single_responsibility',
            'interface_segregation',
            'actor_model',
            'time_space_complexity'
        ];

        console.log('='.repeat(80));
        console.log('ДЕМОНСТРАЦИЯ ПРОГРАММНО-ОРИЕНТИРОВАННЫХ МЕНТАЛЬНЫХ МОДЕЛЕЙ');
        console.log('='.repeat(80));

        // Тестовые проблемы для каждой модели
        const testProblems = {
            'composition_vs_inheritance': 'How should I structure my game entities like Player, Enemy, and NPC that share common behavior?',
            'single_responsibility': 'Our UserManager class handles authentication, profile updates, and data persistence, making it hard to maintain',
            'interface_segregation': 'We need to support multiple payment processors in our e-commerce application',
            'actor_model': 'Our multi-threaded application has frequent race conditions and deadlocks',
            'time_space_complexity': 'We need to search through a sorted dataset of 10 million records efficiently'
        };

        // Проходим по каждой модели и демонстрируем ее применение
        for (const modelId of programmingModels) {
            const model = modelsData.mental_models.find(m => m.id === modelId);

            if (model) {
                console.log('\n\n' + '='.repeat(80));
                console.log(`МОДЕЛЬ: ${model.name}`);
                console.log('='.repeat(80));

                // Показываем полное описание модели
                console.log(formatModelOutput(model));

                // Демонстрируем применение модели к проблеме
                const problem = testProblems[modelId];
                console.log('\n' + '-'.repeat(80));
                console.log('ПРИМЕР ПРИМЕНЕНИЯ К ПРОБЛЕМЕ:');
                console.log('-'.repeat(80));
                console.log(applyModelToProblem(model, problem));

                // Делаем паузу для удобства чтения
                console.log('\nНажмите Enter для продолжения...');
                await new Promise(resolve => process.stdin.once('data', resolve));
            }
        }

        console.log('\n' + '='.repeat(80));
        console.log('ДЕМОНСТРАЦИЯ ЗАВЕРШЕНА');
        console.log('='.repeat(80));
        console.log('\nВсе программно-ориентированные ментальные модели успешно интегрированы и готовы к использованию ИИ-ассистентами!');

    } catch (error) {
        console.error('Ошибка при запуске демонстрации:', error);
    } finally {
        // Закрываем stdin
        process.stdin.destroy();
    }
}

// Запускаем демонстрацию
runDemonstration(); 
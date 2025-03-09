import { getMentalModelById, getAllMentalModelIds, formatMentalModelOutput } from './packages/server-clear-thought/src/models/mental-models.js';

// Получить все идентификаторы моделей
const allModelIds = getAllMentalModelIds();
console.log('Все ментальные модели:', allModelIds);

// Проверить новые программно-ориентированные модели
const newModelIds = [
    'composition_vs_inheritance',
    'single_responsibility',
    'interface_segregation',
    'actor_model',
    'time_space_complexity'
];

console.log('\nПроверка новых программно-ориентированных моделей:');
for (const modelId of newModelIds) {
    const model = getMentalModelById(modelId);
    if (model) {
        console.log(`\n✅ Модель "${model.name}" найдена`);
        console.log(`  Определение: ${model.definition.substring(0, 100)}...`);
        console.log(`  Количество шагов: ${model.steps.length}`);
        console.log(`  Когда использовать (первые 2): ${model.when_to_use.slice(0, 2).join(', ')}`);
    } else {
        console.log(`❌ Модель с ID "${modelId}" не найдена!`);
    }
}

// Вывести полное форматированное представление одной из новых моделей
const sampleModelId = 'time_space_complexity';
const sampleModel = getMentalModelById(sampleModelId);
if (sampleModel) {
    console.log('\nПример форматирования модели:');
    console.log(formatMentalModelOutput(sampleModel));
} 
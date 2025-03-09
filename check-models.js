// Простой скрипт для проверки наличия новых программно-ориентированных ментальных моделей
const fs = require('fs');
const path = require('path');

// Путь к файлу ментальных моделей
const modelsPath = path.join(__dirname, 'packages/server-clear-thought/src/models/mental-models.json');

// Чтение файла
try {
    const modelsData = JSON.parse(fs.readFileSync(modelsPath, 'utf8'));

    // Новые программно-ориентированные модели, которые мы добавили
    const programmingModels = [
        'composition_vs_inheritance',
        'single_responsibility',
        'interface_segregation',
        'actor_model',
        'time_space_complexity'
    ];

    console.log('Проверка наличия программно-ориентированных ментальных моделей:');

    // Проверяем каждую модель
    let allFound = true;
    programmingModels.forEach(modelId => {
        const model = modelsData.mental_models.find(m => m.id === modelId);
        if (model) {
            console.log(`✅ Модель "${model.name}" найдена успешно`);
        } else {
            console.log(`❌ Модель с ID "${modelId}" не найдена!`);
            allFound = false;
        }
    });

    // Общий результат
    if (allFound) {
        console.log('\n🎉 Все программно-ориентированные ментальные модели успешно добавлены!');
    } else {
        console.log('\n⚠️ Некоторые модели не были найдены. Проверьте обновление файла mental-models.json.');
    }

    // Вывод общего количества моделей
    console.log(`\nВсего ментальных моделей в файле: ${modelsData.mental_models.length}`);
} catch (error) {
    console.error('Ошибка при чтении файла ментальных моделей:', error);
} 
#!/bin/bash

# Скрипт для запуска примера использования серверов улучшения мышления

# Переходим в корневую директорию проекта
cd "$(dirname "$0")/.."

# Проверяем, установлены ли зависимости
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Собираем проект
echo "Building project..."
npm run build

# Запускаем пример
echo "Running example..."
node dist/examples/basic-usage.js

echo "Example completed!" 
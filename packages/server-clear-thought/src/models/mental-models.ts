import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface MentalModel {
  id: string;
  name: string;
  definition: string;
  when_to_use: string[];
  steps: string[];
  example: string;
  pitfalls: string[];
}

export interface MentalModelsData {
  mental_models: MentalModel[];
}

// Кэширование моделей для избежания повторного чтения файла
let cachedModels: MentalModelsData | null = null;

export function loadMentalModels(): MentalModelsData {
  // Если модели уже загружены, используем кэш
  if (cachedModels) {
    return cachedModels;
  }

  try {
    const filePath = join(__dirname, 'mental-models.json');
    console.error(`Loading mental models from ${filePath}`);
    const fileContent = readFileSync(filePath, 'utf-8');

    try {
      cachedModels = JSON.parse(fileContent) as MentalModelsData;

      // Проверка на корректность данных
      if (!cachedModels.mental_models || !Array.isArray(cachedModels.mental_models)) {
        throw new Error('Invalid mental models format: missing mental_models array');
      }

      return cachedModels;
    } catch (parseError) {
      console.error('Error parsing mental models JSON:', parseError);

      // Возвращаем минимальный валидный объект при ошибке парсинга
      return {
        mental_models: [
          {
            id: 'fallback_model',
            name: 'Fallback Model (Error Loading)',
            definition: 'This is a fallback model due to an error loading the mental models file.',
            when_to_use: ['Emergency situations when other models fail to load'],
            steps: ['Identify the problem', 'Use basic problem-solving techniques'],
            example: 'Using simple troubleshooting when advanced tools are unavailable',
            pitfalls: ['Limited functionality compared to regular models']
          }
        ]
      };
    }
  } catch (fileError) {
    console.error('Error reading mental models file:', fileError);

    // Возвращаем минимальный валидный объект при ошибке чтения файла
    return {
      mental_models: [
        {
          id: 'fallback_model',
          name: 'Fallback Model (File Error)',
          definition: 'This is a fallback model due to an error reading the mental models file.',
          when_to_use: ['Emergency situations when the models file is inaccessible'],
          steps: ['Report the error', 'Check file permissions and paths'],
          example: 'File not found or insufficient permissions',
          pitfalls: ['Cannot access the full range of mental models']
        }
      ]
    };
  }
}

export function getMentalModelById(id: string): MentalModel | undefined {
  const { mental_models } = loadMentalModels();
  return mental_models.find(model => model.id === id);
}

export function getAllMentalModelIds(): string[] {
  const { mental_models } = loadMentalModels();
  return mental_models.map(model => model.id);
}

export function formatMentalModelOutput(model: MentalModel): string {
  try {
    const border = '─'.repeat(Math.max(model.name.length + 20, model.definition.length + 4));

    const formatList = (items: string[]): string =>
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
  } catch (error) {
    console.error('Error formatting mental model output:', error);
    return `[Error formatting mental model: ${model.name}]`;
  }
} 
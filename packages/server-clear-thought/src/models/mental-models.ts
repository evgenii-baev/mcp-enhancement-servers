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

export function loadMentalModels(): MentalModelsData {
  const filePath = join(__dirname, 'mental-models.json');
  const fileContent = readFileSync(filePath, 'utf-8');
  return JSON.parse(fileContent) as MentalModelsData;
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
} 
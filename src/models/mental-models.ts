import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface MentalModel {
    name: string;
    description: string;
    steps: string[];
    examples: string[];
}

export interface MentalModelsData {
    models: MentalModel[];
}

export function loadMentalModels(): MentalModelsData {
    const filePath = join(__dirname, 'mental-models.json');
    const fileContent = readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent) as MentalModelsData;
}

export function getMentalModelByName(name: string): MentalModel | undefined {
    const { models } = loadMentalModels();
    return models.find(model => model.name === name);
}

export function getAllMentalModelNames(): string[] {
    const { models } = loadMentalModels();
    return models.map(model => model.name);
} 
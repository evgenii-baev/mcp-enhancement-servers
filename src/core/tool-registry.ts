// Реестр инструментов
export class ToolRegistry {
    private tools: Map<string, any> = new Map();

    // Метод для регистрации инструмента
    public registerTool(name: string, toolDefinition: any): void {
        this.tools.set(name, toolDefinition);
        console.log(`Tool registered: ${name}`);
    }

    // Метод для получения инструмента
    public getTool(name: string): any {
        if (!this.tools.has(name)) {
            throw new Error(`Tool not found: ${name}`);
        }

        return this.tools.get(name);
    }

    // Метод для проверки наличия инструмента
    public hasTool(name: string): boolean {
        return this.tools.has(name);
    }

    // Метод для получения списка всех инструментов
    public getAllTools(): string[] {
        return Array.from(this.tools.keys());
    }

    // Метод для удаления инструмента
    public unregisterTool(name: string): boolean {
        if (!this.tools.has(name)) {
            return false;
        }

        this.tools.delete(name);
        console.log(`Tool unregistered: ${name}`);
        return true;
    }
} 
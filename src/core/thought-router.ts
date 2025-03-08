// Маршрутизатор мыслей
export class ThoughtRouter {
    private routes: Map<string, (thought: any) => any> = new Map();

    // Метод для регистрации обработчика мысли
    public registerRoute(pattern: string, handler: (thought: any) => any): void {
        this.routes.set(pattern, handler);
        console.log(`Route registered: ${pattern}`);
    }

    // Метод для маршрутизации мысли
    public routeThought(thought: any): any {
        // Находим подходящий обработчик
        for (const [pattern, handler] of this.routes.entries()) {
            if (this.matchesPattern(thought, pattern)) {
                console.log(`Routing thought to handler: ${pattern}`);
                return handler(thought);
            }
        }

        // Если обработчик не найден, возвращаем мысль без изменений
        console.log('No matching route found for thought');
        return thought;
    }

    // Метод для проверки соответствия мысли шаблону
    private matchesPattern(thought: any, pattern: string): boolean {
        // Заглушка для проверки соответствия
        // В реальной реализации здесь может быть более сложная логика
        return thought.type === pattern || thought.category === pattern;
    }

    // Метод для получения списка всех маршрутов
    public getAllRoutes(): string[] {
        return Array.from(this.routes.keys());
    }

    // Метод для удаления маршрута
    public unregisterRoute(pattern: string): boolean {
        if (!this.routes.has(pattern)) {
            return false;
        }

        this.routes.delete(pattern);
        console.log(`Route unregistered: ${pattern}`);
        return true;
    }
} 
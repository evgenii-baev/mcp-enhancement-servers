/**
 * Адаптер для обсуждения функций
 */

// Интерфейс для обсуждения функций
interface FeatureDiscussion {
    featureId: string;
    title: string;
    responses: string[];
}

// Класс для адаптера обсуждения функций
export class FeatureDiscussionAdapter {
    private discussions: Map<string, FeatureDiscussion>;
    
    constructor() {
        this.discussions = new Map<string, FeatureDiscussion>();
    }
    
    // Метод для начала обсуждения
    public beginDiscussion(featureId: string, title: string): void {
        if (!this.discussions.has(featureId)) {
            this.discussions.set(featureId, {
                featureId,
                title,
                responses: []
            });
            console.log(`Started discussion for feature: ${featureId} - ${title}`);
        } else {
            console.log(`Discussion for feature ${featureId} already exists`);
        }
    }
    
    // Метод для добавления ответа
    public addResponse(featureId: string, response: string): void {
        const discussion = this.discussions.get(featureId);
        
        if (!discussion) {
            throw new Error(`Discussion for feature ${featureId} not found`);
        }
        
        discussion.responses.push(response);
        console.log(`Added response to discussion for feature: ${featureId}`);
    }
    
    // Метод для получения обсуждения
    public getDiscussion(featureId: string): FeatureDiscussion {
        const discussion = this.discussions.get(featureId);
        
        if (!discussion) {
            throw new Error(`Discussion for feature ${featureId} not found`);
        }
        
        return discussion;
    }
    
    // Метод для получения всех обсуждений
    public getAllDiscussions(): FeatureDiscussion[] {
        return Array.from(this.discussions.values());
    }
    
    // Метод для удаления обсуждения
    public removeDiscussion(featureId: string): boolean {
        return this.discussions.delete(featureId);
    }
} 
import { expect } from 'chai';
import { ModelSelectorServer, ProgrammingModelCategory } from '../src/servers/model-selector-server.js';

describe('ModelSelectorServer', () => {
    let server: ModelSelectorServer;

    beforeEach(() => {
        server = new ModelSelectorServer();
    });

    describe('select_model capability', () => {
        it('should select models for a web application task', async () => {
            const request = {
                capability: 'select_model',
                parameters: {
                    task: 'Create a scalable web application',
                    context: 'We need to handle millions of users with real-time updates',
                    language: 'JavaScript',
                    framework: 'React',
                    constraints: ['limited resources', 'high availability required'],
                    preferences: ['scalability', 'maintainable code']
                }
            };

            const response = await server.handleRequest(request);
            expect(response.success).to.be.true;
            if (response.success) {
                expect(response.data.recommendation).to.be.a('string');
                expect(response.data.models).to.be.an('array');
                expect(response.data.models.length).to.be.greaterThan(0);
            }
        });

        it('should handle missing optional parameters', async () => {
            const request = {
                capability: 'select_model',
                parameters: {
                    task: 'Sort a large dataset efficiently'
                }
            };

            const response = await server.handleRequest(request);
            expect(response.success).to.be.true;
            if (response.success) {
                expect(response.data.recommendation).to.be.a('string');
                expect(response.data.models).to.be.an('array');
            }
        });
    });

    describe('list_models capability', () => {
        it('should list all models when no category is specified', async () => {
            const request = {
                capability: 'list_models',
                parameters: {}
            };

            const response = await server.handleRequest(request);
            expect(response.success).to.be.true;
            if (response.success) {
                expect(response.data.models).to.be.an('array');
                expect(response.data.models.length).to.be.greaterThan(0);
                expect(response.data.categories).to.be.an('array');
                expect(response.data.categories).to.include(ProgrammingModelCategory.ALGORITHM);
            }
        });

        it('should filter models by category', async () => {
            const request = {
                capability: 'list_models',
                parameters: {
                    category: 'Algorithm'
                }
            };

            const response = await server.handleRequest(request);
            expect(response.success).to.be.true;
            if (response.success) {
                expect(response.data.models).to.be.an('array');
                response.data.models.forEach((model: any) => {
                    expect(model.category).to.equal(ProgrammingModelCategory.ALGORITHM);
                });
            }
        });
    });

    describe('compare_models capability', () => {
        it('should compare multiple models', async () => {
            const request = {
                capability: 'compare_models',
                parameters: {
                    modelNames: ['Microservices', 'Model-View-Controller (MVC)']
                }
            };

            const response = await server.handleRequest(request);
            expect(response.success).to.be.true;
            if (response.success) {
                expect(response.data.models).to.be.an('array');
                expect(response.data.models.length).to.equal(2);
                expect(response.data.comparison).to.be.an('object');
                expect(response.data.comparison.complexity).to.be.an('object');
                expect(response.data.comparison.complexity).to.have.property('Microservices');
                expect(response.data.comparison.complexity).to.have.property('Model-View-Controller (MVC)');
            }
        });
    });

    describe('error handling', () => {
        it('should handle unknown capabilities gracefully', async () => {
            const request = {
                capability: 'unknown_capability',
                parameters: {}
            };

            const response = await server.handleRequest(request as any);
            expect(response.success).to.be.false;
        });
    });
}); 
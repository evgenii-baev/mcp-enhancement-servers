/**
 * Simple test example for the AI Integration Layer
 * This shows how an AI assistant might use the layer to get model recommendations
 */

import { createAIModelServer, AIModelRequest } from '../index';

// Create server instance
const server = createAIModelServer();

// Example 1: Class design problem
const request1: AIModelRequest = {
    context: "Building an application with many similar UI components that need to share functionality, considering inheritance versus alternatives",
    languages: ["javascript", "typescript"],
    projectScale: "medium"
};

console.log("\n--- Example 1: Class Design Problem ---");
console.log("Request:", JSON.stringify(request1, null, 2));
console.log("\nResponse:");
console.log(JSON.stringify(server.getModelRecommendations(request1), null, 2));

// Example 2: Performance optimization
const request2: AIModelRequest = {
    context: "Optimizing a Python web scraper that's getting slow when handling large amounts of data",
    languages: ["python"],
    constraints: ["performance is critical", "handles large datasets"]
};

console.log("\n--- Example 2: Performance Optimization ---");
console.log("Request:", JSON.stringify(request2, null, 2));
console.log("\nResponse:");
console.log(JSON.stringify(server.getModelRecommendations(request2), null, 2));

// Example 3: Simple request
const request3: AIModelRequest = {
    context: "How should I structure my React components to avoid prop drilling?"
};

console.log("\n--- Example 3: Simple Frontend Request ---");
console.log("Request:", JSON.stringify(request3, null, 2));
console.log("\nResponse:");
console.log(JSON.stringify(server.getModelRecommendations(request3), null, 2));

// Example 4: Concurrency problem
const request4: AIModelRequest = {
    context: "Building a system that needs to handle many concurrent connections and process data in parallel without race conditions",
    languages: ["go", "rust"],
    projectScale: "large",
    returnAllMatches: true
};

console.log("\n--- Example 4: Concurrency Problem ---");
console.log("Request:", JSON.stringify(request4, null, 2));
console.log("\nResponse:");
console.log(JSON.stringify(server.getModelRecommendations(request4), null, 2)); 
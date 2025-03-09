# AI Usage Examples for Programming Mental Models

This document demonstrates how AI assistants can effectively use the new programming-oriented mental models to provide better advice and solutions to developers.

## Example 1: Composition vs. Inheritance

**User Query:**
```
I'm creating a game with different types of characters like Player, Enemy, and NPC. They all need movement, health, and inventory capabilities. Should I create a base Character class and inherit from it?
```

**AI Response using the Mental Model:**
```
I'll analyze this design question using the composition_vs_inheritance mental model.

The question of whether to use a base Character class (inheritance) or composition depends on several factors:

Step 1: Identifying what functionality needs to be shared
- Movement, health, and inventory capabilities are common to all character types

Step 2: Consider if this is an "is-a" or "has-a" relationship
- While all are "characters" (suggesting inheritance), their behaviors might vary significantly
- The relationship could be modeled as "has-a": every character has movement capability, has health, has inventory

Step 3: Evaluating composition approach
A composition-based design might look like:
```
class MovementComponent {
  // movement implementation
}

class HealthComponent {
  // health implementation
}

class InventoryComponent {
  // inventory implementation
}

class Character {
  constructor(movement, health, inventory) {
    this.movement = movement;
    this.health = health;
    this.inventory = inventory;
  }
}

class Player extends Character {
  // Player-specific functionality
}
```

This approach offers more flexibility as:
- You can easily swap out components (e.g., different movement types)
- Functionality can be composed differently for each character type
- Behavior can change at runtime

Watch out for the potential pitfalls:
- This might add complexity with many small components
- There's some performance overhead from delegation

In this case, composition is likely the better choice as it provides more flexibility for future extensions and avoids the "fragile base class" problem that might occur with inheritance.
```

## Example 2: Single Responsibility Principle

**User Query:**
```
My UserService class is getting huge. It handles user registration, authentication, profile updates, email notifications, and data persistence. Is this a problem?
```

**AI Response using the Mental Model:**
```
I'll apply the single_responsibility mental model to analyze your UserService class.

The Single Responsibility Principle states that a class should have only one reason to change. Your UserService currently has multiple responsibilities:

Step 1: Identifying all responsibilities
- User registration
- Authentication
- Profile updates
- Email notifications
- Data persistence

Step 2: Analyzing if these belong together
These are related to users but are distinct concerns that could change for different reasons:
- Authentication might change due to security requirements
- Notifications might change due to communication preferences
- Data persistence might change due to database optimizations

Step 3: Recommending separation of responsibilities
Consider refactoring into:

```
class UserRegistrationService {
  // handles user registration
}

class AuthenticationService {
  // handles authentication
}

class UserProfileService {
  // handles profile updates
}

class NotificationService {
  // handles email notifications
}

class UserRepository {
  // handles data persistence
}

class UserFacade {
  // coordinates between the services if needed
}
```

This approach will:
- Make your code more maintainable
- Allow for easier testing of individual components
- Enable independent scaling and development of each aspect
- Simplify reasoning about each part

Watch out for:
- Creating too many tiny classes that increase system complexity
- Introducing too much indirection

The refactored design should strike a balance between separation of concerns and overall system complexity.
```

## Example 3: Time and Space Complexity Analysis

**User Query:**
```
I need to store and retrieve a large amount of user session data efficiently. I'm considering using a HashMap or a Tree-based structure. How should I decide?
```

**AI Response using the Mental Model:**
```
I'll use the time_space_complexity mental model to analyze the optimal data structure for your user session data.

Step 1: Identifying key operations
For session data, you likely need:
- Fast lookups by session ID
- Possibly iteration through sessions (e.g., for cleanup)
- Insertions and deletions as sessions are created and expired

Step 2: Determining operation frequency for each structure
HashMap:
- Lookup: O(1) average case, O(n) worst case
- Insertion: O(1) average case
- Deletion: O(1) average case
- No inherent ordering

Tree structure (e.g., TreeMap):
- Lookup: O(log n)
- Insertion: O(log n)
- Deletion: O(log n)
- Maintains ordering (useful for iteration)

Step 3: Analyzing dominant operations
If your application primarily does lookups by session ID, the dominant operation is retrieval, making HashMap's O(1) average case preferable.

Step 4: Considering space requirements
Both structures have O(n) space complexity, but HashMap typically has higher constant factors due to internal array and potential empty slots.

Based on time and space complexity analysis:
- If random access by ID is the primary operation: HashMap is optimal
- If you need ordered iteration or range queries: TreeMap is better
- If memory is severely constrained: Consider more specialized structures

Also consider:
- The HashMap performance depends on a good hash function for session IDs
- For very large data sets, external storage might be preferable to in-memory solutions

Watch out for premature optimization - measure actual performance with realistic data sizes before making a final decision.
```

## Example 4: Interface-Implementation Separation

**User Query:**
```
We're integrating with multiple payment gateways (PayPal, Stripe, etc.) in our e-commerce app. What's the best way to structure this code?
```

**AI Response using the Mental Model:**
```
I'll apply the interface_segregation mental model to design a flexible payment gateway integration.

Step 1: Define clear interfaces
Start by creating a clean interface that specifies what operations are available:

```typescript
interface PaymentGateway {
  processPayment(amount: number, currency: string, details: PaymentDetails): Promise<PaymentResult>;
  refundPayment(transactionId: string, amount?: number): Promise<RefundResult>;
  verifyPayment(transactionId: string): Promise<VerificationResult>;
}
```

Step 2: Keep interfaces focused and cohesive
If some gateways don't support all operations, consider splitting into smaller interfaces:

```typescript
interface PaymentProcessor {
  processPayment(amount: number, currency: string, details: PaymentDetails): Promise<PaymentResult>;
}

interface RefundProcessor {
  refundPayment(transactionId: string, amount?: number): Promise<RefundResult>;
}

interface VerificationProcessor {
  verifyPayment(transactionId: string): Promise<VerificationResult>;
}
```

Step 3: Implement concrete classes
Create implementations for each payment provider:

```typescript
class StripePaymentGateway implements PaymentProcessor, RefundProcessor, VerificationProcessor {
  // Stripe-specific implementations
}

class PayPalPaymentGateway implements PaymentProcessor, RefundProcessor, VerificationProcessor {
  // PayPal-specific implementations
}
```

Step 4: Hide implementation details
Keep provider-specific details contained within the implementations:

```typescript
class StripePaymentGateway implements PaymentProcessor, RefundProcessor, VerificationProcessor {
  private stripeClient: StripeClient;
  
  constructor(apiKey: string) {
    this.stripeClient = new StripeClient(apiKey);
  }
  
  async processPayment(amount: number, currency: string, details: PaymentDetails): Promise<PaymentResult> {
    // Stripe-specific implementation
  }
  // ...
}
```

Step 5: Use dependency injection
In your application code, inject the right implementation:

```typescript
class CheckoutService {
  constructor(private paymentProcessor: PaymentProcessor) {}
  
  async checkout(cart: ShoppingCart, paymentDetails: PaymentDetails): Promise<OrderResult> {
    // Use the injected payment processor without knowing its concrete type
    const paymentResult = await this.paymentProcessor.processPayment(
      cart.total, 
      cart.currency, 
      paymentDetails
    );
    
    // Process the result
  }
}
```

This approach:
- Makes it easy to add new payment gateways without changing client code
- Allows for testing with mock implementations
- Creates clear separation between what your system needs (the interface) and how each gateway works (the implementation)

Watch out for:
- Creating overly generic interfaces that don't provide useful abstractions
- Not considering the unique features of each payment gateway
```

## Example 5: Actor Model for Concurrency

**User Query:**
```
Our backend needs to handle real-time updates for thousands of connected clients. We're having issues with race conditions and deadlocks. How can we improve this?
```

**AI Response using the Mental Model:**
```
I'll apply the actor_model mental model to solve your concurrency challenges with real-time updates.

The actor model treats "actors" as the basic units of computation that communicate exclusively through message passing rather than shared state.

Step 1: Identify actors in your system
For a real-time update system, typical actors might include:
- ConnectionActor (manages a single client connection)
- RoomActor (manages a group of related clients)
- DataSourceActor (watches for changes to notify about)
- PersistenceActor (handles saving state)

Step 2: Define messages between actors
Example messages:
- ClientConnected(connectionId)
- ClientDisconnected(connectionId)
- DataUpdated(resource, newData)
- SendMessageToClient(connectionId, message)

Step 3: Design actors to process messages sequentially
Each actor:
- Has its own private state not accessible from outside
- Processes one message at a time (eliminating race conditions)
- Communicates only by sending messages to other actors

Sample implementation using a library like Akka:

```typescript
class ConnectionActor extends Actor {
  private connection: WebSocket;
  
  onReceive(message: any) {
    switch(message.type) {
      case 'Connect':
        this.connection = message.webSocket;
        // Tell room actor about new connection
        this.context.actorOf('room').tell({
          type: 'ClientConnected',
          connectionId: this.self.id
        });
        break;
        
      case 'SendToClient':
        // No race conditions as messages are processed sequentially
        this.connection.send(message.data);
        break;
        
      case 'Disconnect':
        this.connection.close();
        // Tell room we're disconnecting
        this.context.actorOf('room').tell({
          type: 'ClientDisconnected',
          connectionId: this.self.id
        });
        break;
    }
  }
}
```

Step 4: Set up supervision hierarchies
Create a hierarchy to manage actor failures:

```
SupervisorActor
├── RoomSupervisorActor
│   ├── Room1Actor
│   ├── Room2Actor
│   └── ...
├── ConnectionSupervisorActor
│   ├── Connection1Actor
│   ├── Connection2Actor
│   └── ...
└── DataSourceSupervisorActor
    ├── DataSource1Actor
    └── ...
```

This approach eliminates race conditions and deadlocks because:
- No shared mutable state between actors
- Each actor processes messages one at a time
- State is encapsulated within actors
- Failure is isolated to specific actors

Benefits for your system:
- Eliminates race conditions by design
- Scales horizontally across multiple machines
- Naturally fits the domain of connections and updates
- Improves fault tolerance through supervision

Watch out for:
- Potential message delivery issues in distributed systems
- Learning curve for teams new to the actor model
- Need to design message protocols carefully
```

These examples demonstrate how AI assistants can leverage programming-oriented mental models to provide structured, principled advice to developers. 
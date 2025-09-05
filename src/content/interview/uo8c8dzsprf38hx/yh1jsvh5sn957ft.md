---
title: "Distributed Systems - Backend Interview Questions"
postId: "yh1jsvh5sn957ft"
category: "BackEnd Interview"
created: "2/9/2025"
updated: "2/9/2025"
---

# Distributed Systems - Backend Interview Questions


## 57. Test distributed systems?

**Trả lời:** Testing distributed systems là một trong những challenges phức tạp nhất trong software engineering do tính phân tán, network issues, và timing dependencies.

### Challenges trong Distributed Testing:

#### 1. Network Partitions:
```python
# Simulate network partition testing
import threading
import time
import random

class NetworkSimulator:
    def __init__(self):
        self.partitions = {}  # node_id -> isolated status
        self.latencies = {}   # (node1, node2) -> latency_ms
        self.packet_loss = {} # (node1, node2) -> loss_percentage
    
    def create_partition(self, nodes_group_a, nodes_group_b):
        """Simulate network split between two groups"""
        for node_a in nodes_group_a:
            for node_b in nodes_group_b:
                self.latencies[(node_a, node_b)] = float('inf')  # No connectivity
                self.latencies[(node_b, node_a)] = float('inf')
                self.packet_loss[(node_a, node_b)] = 1.0  # 100% packet loss
    
    def heal_partition(self, nodes_group_a, nodes_group_b):
        """Restore network connectivity"""
        for node_a in nodes_group_a:
            for node_b in nodes_group_b:
                self.latencies[(node_a, node_b)] = random.randint(10, 100)
                self.latencies[(node_b, node_a)] = random.randint(10, 100)
                self.packet_loss[(node_a, node_b)] = 0.0

# Example distributed system test
def test_leader_election_during_partition():
    network = NetworkSimulator()
    cluster = ['node1', 'node2', 'node3', 'node4', 'node5']
    
    # Normal operation - should have one leader
    leader = elect_leader(cluster)
    assert leader is not None
    
    # Create partition: [node1, node2] vs [node3, node4, node5]
    network.create_partition(['node1', 'node2'], ['node3', 'node4', 'node5'])
    
    time.sleep(5)  # Allow time for partition detection
    
    # Each partition should elect its own leader
    partition_a_leader = elect_leader(['node1', 'node2'])
    partition_b_leader = elect_leader(['node3', 'node4', 'node5'])
    
    assert partition_a_leader in ['node1', 'node2']
    assert partition_b_leader in ['node3', 'node4', 'node5']
    
    # Heal partition
    network.heal_partition(['node1', 'node2'], ['node3', 'node4', 'node5'])
    
    time.sleep(5)  # Allow time for convergence
    
    # Should converge to single leader
    final_leader = elect_leader(cluster)
    assert final_leader is not None
```

#### 2. Chaos Engineering:
```java
// Netflix Chaos Monkey inspired testing
public class ChaosMonkey {
    private final List<String> services;
    private final Random random = new Random();
    
    public ChaosMonkey(List<String> services) {
        this.services = services;
    }
    
    @Scheduled(fixedRate = 60000) // Every minute
    public void introduceChaos() {
        ChaosType chaos = selectRandomChaos();
        String targetService = selectRandomService();
        
        switch (chaos) {
            case KILL_INSTANCE:
                killServiceInstance(targetService);
                break;
            case INTRODUCE_LATENCY:
                introduceLatency(targetService, 1000 + random.nextInt(5000));
                break;
            case CORRUPT_DATA:
                corruptRandomData(targetService);
                break;
            case FILL_DISK:
                fillDiskSpace(targetService, 0.9); // Fill to 90%
                break;
        }
        
        // Monitor system behavior after chaos
        monitorSystemHealth();
    }
    
    private void killServiceInstance(String service) {
        // Terminate random instance of service
        List<String> instances = getServiceInstances(service);
        if (!instances.isEmpty()) {
            String victim = instances.get(random.nextInt(instances.size()));
            terminateInstance(victim);
            
            // Verify system continues to function
            assertSystemHealthy();
        }
    }
    
    private void introduceLatency(String service, int latencyMs) {
        // Add network latency to service calls
        NetworkProxy.addLatency(service, latencyMs);
        
        // Test that system degrades gracefully
        long startTime = System.currentTimeMillis();
        Response response = callService(service);
        long duration = System.currentTimeMillis() - startTime;
        
        assertTrue("Service should still respond within timeout", 
                   duration < 30000); // 30 second timeout
    }
}
```

### Testing Strategies:

#### 1. Contract Testing:
```javascript
// Consumer-driven contract testing with Pact
const { Pact } = require('@pact-foundation/pact');
const { like, eachLike } = require('@pact-foundation/pact').Matchers;

describe('User Service Contract', () => {
  const provider = new Pact({
    consumer: 'OrderService',
    provider: 'UserService',
    port: 1234,
  });

  beforeAll(() => provider.setup());
  afterEach(() => provider.verify());
  afterAll(() => provider.finalize());

  describe('when requesting user data', () => {
    beforeEach(() => {
      return provider.addInteraction({
        state: 'user exists',
        uponReceiving: 'a request for user data',
        withRequest: {
          method: 'GET',
          path: '/users/123',
          headers: {
            'Accept': 'application/json',
            'Authorization': like('Bearer token123')
          }
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          },
          body: {
            id: like(123),
            name: like('John Doe'),
            email: like('john@example.com'),
            orders: eachLike({
              id: like(456),
              amount: like(99.99),
              status: like('completed')
            })
          }
        }
      });
    });

    it('should return user data with orders', async () => {
      const userService = new UserServiceClient('http://localhost:1234');
      const user = await userService.getUser(123);
      
      expect(user.id).toBe(123);
      expect(user.orders).toHaveLength(1);
      expect(user.orders[0].status).toBe('completed');
    });
  });
});
```

#### 2. End-to-End Testing:
```go
// Distributed system integration test
package integration_test

import (
    "context"
    "testing"
    "time"
    "github.com/stretchr/testify/suite"
)

type DistributedSystemSuite struct {
    suite.Suite
    cluster    *TestCluster
    clients    []*TestClient
}

func (s *DistributedSystemSuite) SetupSuite() {
    // Start distributed system cluster
    s.cluster = NewTestCluster(5) // 5 nodes
    s.cluster.Start()
    
    // Wait for cluster to be ready
    s.cluster.WaitForReady(30 * time.Second)
    
    // Create test clients
    for _, node := range s.cluster.Nodes {
        client := NewTestClient(node.Address)
        s.clients = append(s.clients, client)
    }
}

func (s *DistributedSystemSuite) TearDownSuite() {
    s.cluster.Stop()
}

func (s *DistributedSystemSuite) TestDistributedTransactionConsistency() {
    ctx := context.Background()
    
    // Perform distributed transaction across multiple nodes
    tx := s.cluster.BeginTransaction(ctx)
    
    // Write to multiple partitions
    err1 := tx.Write("partition1", "key1", "value1")
    err2 := tx.Write("partition2", "key2", "value2")
    err3 := tx.Write("partition3", "key3", "value3")
    
    s.NoError(err1)
    s.NoError(err2) 
    s.NoError(err3)
    
    // Commit transaction
    err := tx.Commit(ctx)
    s.NoError(err)
    
    // Verify consistency across all nodes
    for _, client := range s.clients {
        val1, _ := client.Read("partition1", "key1")
        val2, _ := client.Read("partition2", "key2")
        val3, _ := client.Read("partition3", "key3")
        
        s.Equal("value1", val1)
        s.Equal("value2", val2)
        s.Equal("value3", val3)
    }
}

func (s *DistributedSystemSuite) TestNetworkPartitionRecovery() {
    // Create network partition
    partition := []int{0, 1}  // Isolate nodes 0,1 from 2,3,4
    s.cluster.CreateNetworkPartition(partition)
    
    // Wait for partition detection
    time.Sleep(10 * time.Second)
    
    // Verify minority partition stops accepting writes
    client := s.clients[0] // In minority partition
    err := client.Write("test-partition", "key", "value")
    s.Error(err, "Minority partition should reject writes")
    
    // Verify majority partition continues working
    majorityClient := s.clients[2] // In majority partition
    err = majorityClient.Write("test-partition", "key", "value")
    s.NoError(err, "Majority partition should accept writes")
    
    // Heal partition
    s.cluster.HealNetworkPartition()
    time.Sleep(15 * time.Second) // Allow recovery
    
    // Verify all nodes converge to same state
    for _, client := range s.clients {
        value, err := client.Read("test-partition", "key")
        s.NoError(err)
        s.Equal("value", value)
    }
}
```

#### 3. Load Testing:
```python
# Distributed load testing
import asyncio
import aiohttp
import time
from concurrent.futures import ThreadPoolExecutor

class DistributedLoadTester:
    def __init__(self, endpoints, max_concurrent=1000):
        self.endpoints = endpoints
        self.max_concurrent = max_concurrent
        self.results = {
            'requests_sent': 0,
            'requests_succeeded': 0,
            'requests_failed': 0,
            'latencies': [],
            'errors': []
        }
    
    async def make_request(self, session, endpoint):
        start_time = time.time()
        try:
            async with session.get(endpoint) as response:
                await response.text()
                latency = time.time() - start_time
                
                self.results['requests_sent'] += 1
                if response.status == 200:
                    self.results['requests_succeeded'] += 1
                    self.results['latencies'].append(latency)
                else:
                    self.results['requests_failed'] += 1
                    self.results['errors'].append(f"HTTP {response.status}")
                    
        except Exception as e:
            self.results['requests_sent'] += 1
            self.results['requests_failed'] += 1
            self.results['errors'].append(str(e))
    
    async def run_load_test(self, duration_seconds=60, rps=100):
        """Run load test for specified duration at target RPS"""
        interval = 1.0 / rps
        end_time = time.time() + duration_seconds
        
        connector = aiohttp.TCPConnector(limit=self.max_concurrent)
        async with aiohttp.ClientSession(connector=connector) as session:
            while time.time() < end_time:
                # Send requests to random endpoints
                tasks = []
                for _ in range(rps):
                    endpoint = random.choice(self.endpoints)
                    task = asyncio.create_task(
                        self.make_request(session, endpoint)
                    )
                    tasks.append(task)
                
                # Wait for batch to complete or timeout
                await asyncio.gather(*tasks, return_exceptions=True)
                
                # Rate limiting
                await asyncio.sleep(interval)
    
    def analyze_results(self):
        if not self.results['latencies']:
            return "No successful requests"
        
        latencies = sorted(self.results['latencies'])
        return {
            'total_requests': self.results['requests_sent'],
            'success_rate': self.results['requests_succeeded'] / self.results['requests_sent'],
            'avg_latency': sum(latencies) / len(latencies),
            'p50_latency': latencies[len(latencies) // 2],
            'p95_latency': latencies[int(len(latencies) * 0.95)],
            'p99_latency': latencies[int(len(latencies) * 0.99)],
            'errors': list(set(self.results['errors']))
        }

# Usage
async def test_distributed_system_load():
    endpoints = [
        'http://service1.example.com/api/health',
        'http://service2.example.com/api/health', 
        'http://service3.example.com/api/health'
    ]
    
    tester = DistributedLoadTester(endpoints)
    await tester.run_load_test(duration_seconds=300, rps=500)  # 5 min, 500 RPS
    
    results = tester.analyze_results()
    
    # Assertions for distributed system performance
    assert results['success_rate'] > 0.99, "Success rate should be > 99%"
    assert results['p95_latency'] < 1.0, "P95 latency should be < 1 second"
    assert results['p99_latency'] < 2.0, "P99 latency should be < 2 seconds"
```

\---

## 58. Khi nào dùng async communication?

**Trả lời:** Asynchronous communication phù hợp cho nhiều scenarios trong distributed systems, đặc biệt khi cần decoupling, scalability, và fault tolerance.

### Khi Nên Dùng Async Communication:

#### 1. High Throughput Systems:
```python
# Async message processing for high throughput
import asyncio
import aioredis
from typing import List

class AsyncOrderProcessor:
    def __init__(self, redis_url="redis://localhost"):
        self.redis = None
        self.processing = True
    
    async def setup(self):
        self.redis = await aioredis.from_url(redis_url)
    
    async def submit_order(self, order_data):
        """Submit order asynchronously - returns immediately"""
        order_id = generate_order_id()
        await self.redis.lpush("order_queue", json.dumps({
            "order_id": order_id,
            "data": order_data,
            "timestamp": time.time()
        }))
        
        # Return immediately - processing happens asynchronously
        return {"order_id": order_id, "status": "accepted"}
    
    async def process_orders(self):
        """Background worker processing orders"""
        while self.processing:
            try:
                # Pop order from queue
                order_json = await self.redis.brpop("order_queue", timeout=1)
                if not order_json:
                    continue
                
                order = json.loads(order_json[1])
                
                # Process order (can be slow)
                await self.process_single_order(order)
                
                # Publish completion event
                await self.redis.publish("order_completed", json.dumps({
                    "order_id": order["order_id"],
                    "status": "completed",
                    "timestamp": time.time()
                }))
                
            except Exception as e:
                logger.error(f"Error processing order: {e}")
    
    async def process_single_order(self, order):
        # Simulate complex order processing
        await asyncio.sleep(random.uniform(0.1, 2.0))
        
        # Could involve multiple async operations:
        await self.validate_inventory(order)
        await self.charge_payment(order)
        await self.ship_order(order)

# Can handle thousands of orders per second
# Processing happens in background without blocking submission
```

#### 2. Long-Running Operations:
```java
// Video processing service with async communication
@Service
public class VideoProcessingService {
    
    @Autowired
    private MessagePublisher messagePublisher;
    
    @Autowired
    private FileStorageService fileStorage;
    
    public CompletableFuture<String> processVideo(String videoId, ProcessingOptions options) {
        // Return immediately with job ID
        String jobId = UUID.randomUUID().toString();
        
        // Publish processing request
        ProcessingRequest request = new ProcessingRequest(jobId, videoId, options);
        messagePublisher.publish("video.processing.requested", request);
        
        return CompletableFuture.completedFuture(jobId);
    }
    
    @EventListener("video.processing.requested")
    public void handleProcessingRequest(ProcessingRequest request) {
        try {
            // This can take minutes or hours
            VideoFile originalVideo = fileStorage.download(request.getVideoId());
            
            // Multiple processing steps
            VideoFile resized = resizeVideo(originalVideo, request.getOptions());
            VideoFile transcoded = transcodeVideo(resized, request.getOptions());
            VideoFile optimized = optimizeVideo(transcoded, request.getOptions());
            
            // Upload processed video
            String processedUrl = fileStorage.upload(optimized);
            
            // Publish completion event
            ProcessingCompleted event = new ProcessingCompleted(
                request.getJobId(),
                processedUrl,
                ProcessingStatus.SUCCESS
            );
            messagePublisher.publish("video.processing.completed", event);
            
        } catch (Exception e) {
            // Publish failure event
            ProcessingCompleted event = new ProcessingCompleted(
                request.getJobId(),
                null,
                ProcessingStatus.FAILED,
                e.getMessage()
            );
            messagePublisher.publish("video.processing.failed", event);
        }
    }
    
    @EventListener("video.processing.completed")
    public void handleProcessingCompleted(ProcessingCompleted event) {
        // Notify user, update database, etc.
        notificationService.notifyUser(event.getJobId(), "Video processing completed");
        databaseService.updateVideoStatus(event.getJobId(), VideoStatus.READY);
    }
}
```

#### 3. Event-Driven Architecture:
```typescript
// E-commerce system với event-driven async communication
interface DomainEvent {
  eventId: string;
  eventType: string;
  aggregateId: string;
  timestamp: Date;
  version: number;
}

class OrderPlaced implements DomainEvent {
  constructor(
    public eventId: string,
    public eventType: string = 'OrderPlaced',
    public aggregateId: string,
    public timestamp: Date,
    public version: number,
    public customerId: string,
    public orderItems: OrderItem[],
    public totalAmount: number
  ) {}
}

class EventBus {
  private handlers: Map<string, Array<(event: DomainEvent) => Promise<void>>> = new Map();
  
  subscribe<T extends DomainEvent>(
    eventType: string, 
    handler: (event: T) => Promise<void>
  ): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    this.handlers.get(eventType)!.push(handler);
  }
  
  async publish(event: DomainEvent): Promise<void> {
    const handlers = this.handlers.get(event.eventType) || [];
    
    // Process all handlers asynchronously
    const promises = handlers.map(handler => 
      handler(event).catch(error => 
        console.error(`Handler failed for ${event.eventType}:`, error)
      )
    );
    
    await Promise.allSettled(promises);
  }
}

// Event handlers for different services
class InventoryService {
  constructor(private eventBus: EventBus) {
    this.eventBus.subscribe('OrderPlaced', this.handleOrderPlaced.bind(this));
  }
  
  private async handleOrderPlaced(event: OrderPlaced): Promise<void> {
    // Reserve inventory items
    for (const item of event.orderItems) {
      await this.reserveItem(item.productId, item.quantity);
    }
    
    // Publish inventory reserved event
    await this.eventBus.publish(new InventoryReserved(
      generateId(),
      event.aggregateId,
      new Date(),
      1,
      event.orderItems
    ));
  }
}

class PaymentService {
  constructor(private eventBus: EventBus) {
    this.eventBus.subscribe('OrderPlaced', this.handleOrderPlaced.bind(this));
  }
  
  private async handleOrderPlaced(event: OrderPlaced): Promise<void> {
    try {
      // Process payment asynchronously
      const paymentResult = await this.processPayment(
        event.customerId,
        event.totalAmount
      );
      
      if (paymentResult.success) {
        await this.eventBus.publish(new PaymentProcessed(
          generateId(),
          event.aggregateId,
          new Date(),
          1,
          paymentResult.transactionId
        ));
      } else {
        await this.eventBus.publish(new PaymentFailed(
          generateId(),
          event.aggregateId,
          new Date(),
          1,
          paymentResult.error
        ));
      }
    } catch (error) {
      await this.eventBus.publish(new PaymentFailed(
        generateId(),
        event.aggregateId,
        new Date(),
        1,
        error.message
      ));
    }
  }
}
```

#### 4. Microservices Decoupling:
```go
// Service communication through message queues
package services

import (
    "encoding/json"
    "log"
    "github.com/streadway/amqp"
)

type UserRegistrationEvent struct {
    UserID    string `json:"user_id"`
    Email     string `json:"email"`
    Name      string `json:"name"`
    Timestamp int64  `json:"timestamp"`
}

type EmailService struct {
    conn    *amqp.Connection
    channel *amqp.Channel
}

func NewEmailService(amqpURL string) (*EmailService, error) {
    conn, err := amqp.Dial(amqpURL)
    if err != nil {
        return nil, err
    }
    
    channel, err := conn.Channel()
    if err != nil {
        return nil, err
    }
    
    // Declare queue for user registration events
    _, err = channel.QueueDeclare(
        "user.registered",  // queue name
        true,              // durable
        false,             // delete when unused
        false,             // exclusive
        false,             // no-wait
        nil,               // arguments
    )
    
    if err != nil {
        return nil, err
    }
    
    return &EmailService{conn: conn, channel: channel}, nil
}

func (es *EmailService) StartListening() error {
    msgs, err := es.channel.Consume(
        "user.registered", // queue
        "",               // consumer
        false,            // auto-ack (manual ack for reliability)
        false,            // exclusive
        false,            // no-local
        false,            // no-wait
        nil,              // args
    )
    
    if err != nil {
        return err
    }
    
    go func() {
        for msg := range msgs {
            var event UserRegistrationEvent
            if err := json.Unmarshal(msg.Body, &event); err != nil {
                log.Printf("Error unmarshaling event: %v", err)
                msg.Nack(false, false) // Reject and don't requeue
                continue
            }
            
            // Process event asynchronously
            if err := es.handleUserRegistration(event); err != nil {
                log.Printf("Error processing user registration: %v", err)
                msg.Nack(false, true) // Reject and requeue for retry
            } else {
                msg.Ack(false) // Acknowledge successful processing
            }
        }
    }()
    
    return nil
}

func (es *EmailService) handleUserRegistration(event UserRegistrationEvent) error {
    // Send welcome email asynchronously
    emailContent := EmailContent{
        To:      event.Email,
        Subject: "Welcome to Our Platform!",
        Body:    fmt.Sprintf("Hello %s, welcome to our platform!", event.Name),
    }
    
    return es.sendEmail(emailContent)
}

// User Service publishes events instead of calling email service directly
type UserService struct {
    publisher *MessagePublisher
}

func (us *UserService) RegisterUser(userData UserData) error {
    // Save user to database
    user, err := us.repository.CreateUser(userData)
    if err != nil {
        return err
    }
    
    // Publish event asynchronously - don't wait for email service
    event := UserRegistrationEvent{
        UserID:    user.ID,
        Email:     user.Email,
        Name:      user.Name,
        Timestamp: time.Now().Unix(),
    }
    
    // This returns immediately - email processing happens async
    return us.publisher.Publish("user.registered", event)
}
```

### Benefits của Async Communication:

#### 1. System Resilience:
- Services không phụ thuộc vào availability của other services
- Failures trong một service không cascade
- Messages có thể được queued và processed later

#### 2. Scalability:
- Each service có thể scale independently
- Load balancing through message distribution
- Backpressure handling through queue management

#### 3. Performance:
- Non-blocking operations
- Parallel processing
- Better resource utilization

### Khi KHÔNG Nên Dùng Async:

#### 1. Real-time Requirements:
```javascript
// Bad for real-time scenarios
async function processPayment(paymentData) {
    // Can't use async for immediate payment verification
    // User needs to know RIGHT NOW if payment succeeded
    
    // This won't work for e-commerce checkout:
    await messageQueue.publish('process-payment', paymentData);
    return { status: 'processing' }; // User doesn't know if they can leave!
}

// Better: Synchronous for immediate feedback
async function processPaymentSync(paymentData) {
    const result = await paymentGateway.charge(paymentData);
    return { 
        status: result.success ? 'completed' : 'failed',
        transactionId: result.transactionId 
    };
}
```

#### 2. Strong Consistency Requirements:
```sql
-- Bank transfers need ACID transactions, not async messaging
BEGIN TRANSACTION;
    UPDATE accounts SET balance = balance - 1000 WHERE id = 'account_a';
    UPDATE accounts SET balance = balance + 1000 WHERE id = 'account_b';
    
    -- Both operations must succeed or fail together
    -- Can't use async here - would risk money disappearing!
COMMIT;
```

### Best Practices:

#### 1. Message Durability:
```python
# Ensure messages survive system failures
import pika

connection = pika.BlockingConnection(
    pika.ConnectionParameters('localhost')
)
channel = connection.channel()

# Declare durable queue
channel.queue_declare(queue='task_queue', durable=True)

# Publish persistent messages
channel.basic_publish(
    exchange='',
    routing_key='task_queue', 
    body=message,
    properties=pika.BasicProperties(
        delivery_mode=2,  # Make message persistent
    )
)
```

#### 2. Dead Letter Queues:
```java
// Handle poison messages
@RabbitListener(queues = "order.processing")
public void processOrder(OrderMessage order, 
                        @Header Map<String, Object> headers) {
    try {
        orderService.process(order);
    } catch (Exception e) {
        // After max retries, message goes to dead letter queue
        throw new AmqpRejectAndDontRequeueException("Processing failed", e);
    }
}
```

#### 3. Idempotency:
```python
# Handle duplicate messages safely
def process_payment(payment_request):
    # Check if already processed
    existing = db.get_payment(payment_request.idempotency_key)
    if existing:
        return existing  # Return cached result
    
    # Process only once
    result = payment_gateway.charge(payment_request)
    
    # Cache result with idempotency key
    db.save_payment(payment_request.idempotency_key, result)
    return result
```

\---

## 59. RPC pitfalls?

**Trả lời:** Remote Procedure Call (RPC) systems have several inherent challenges và pitfalls mà developers cần be aware of để build robust distributed systems.

### Major RPC Pitfalls:

#### 1. Network Latency và Unreliability:
```python
# RPC calls look like local calls but have network overhead
import time
import random

class UserServiceClient:
    def __init__(self, service_url):
        self.service_url = service_url
    
    def get_user(self, user_id):
        # This looks like a local method call, but...
        # - Network latency: 10-100ms+
        # - Can fail due to network issues
        # - Timeout considerations
        # - Retry logic needed
        
        try:
            response = requests.get(
                f"{self.service_url}/users/{user_id}",
                timeout=5.0  # What if this times out?
            )
            return response.json()
        except requests.RequestException as e:
            # Network failure - what should we do?
            raise ServiceUnavailableError(f"User service unavailable: {e}")

# Problematic usage - looks innocent but has hidden complexity
def get_user_profile(user_id):
    user_client = UserServiceClient("http://user-service")
    
    # Each call has 50ms latency - this takes 200ms total!
    user = user_client.get_user(user_id)           # 50ms
    preferences = user_client.get_preferences(user_id)  # 50ms  
    settings = user_client.get_settings(user_id)        # 50ms
    history = user_client.get_history(user_id)          # 50ms
    
    # Plus risk of cascading failures if service is down
    return combine_user_data(user, preferences, settings, history)

# Better approach - batch calls or async
async def get_user_profile_optimized(user_id):
    user_client = UserServiceClient("http://user-service")
    
    # Parallel calls reduce latency to ~50ms
    tasks = await asyncio.gather(
        user_client.get_user(user_id),
        user_client.get_preferences(user_id), 
        user_client.get_settings(user_id),
        user_client.get_history(user_id),
        return_exceptions=True  # Handle partial failures
    )
    
    # Handle individual failures gracefully
    user, prefs, settings, history = tasks
    return combine_user_data_safely(user, prefs, settings, history)
```

#### 2. Partial Failures và Error Handling:
```java
// Complex error scenarios in RPC
public class OrderServiceClient {
    private final RestTemplate restTemplate;
    private final CircuitBreaker circuitBreaker;
    
    public OrderResult createOrder(OrderRequest request) {
        try {
            return circuitBreaker.executeSupplier(() -> {
                ResponseEntity<OrderResult> response = restTemplate.postForEntity(
                    "/orders", request, OrderResult.class);
                
                if (response.getStatusCode().is2xxSuccessful()) {
                    return response.getBody();
                } else if (response.getStatusCode() == HttpStatus.BAD_REQUEST) {
                    // Client error - don't retry
                    throw new InvalidOrderException("Invalid order data");
                } else {
                    // Server error - might be worth retrying
                    throw new ServiceException("Order service error");
                }
            });
            
        } catch (CallNotPermittedException e) {
            // Circuit breaker is open
            throw new ServiceUnavailableException("Order service unavailable");
            
        } catch (Exception e) {
            // Network timeout, connection refused, etc.
            // Did the order get created? We don't know!
            throw new ServiceException("Unknown order status", e);
        }
    }
    
    // The "Did it succeed?" problem
    public void handleUncertainty(OrderRequest request) {
        try {
            createOrder(request);
            // Success - order was created
            
        } catch (ServiceException e) {
            // But what if:
            // 1. Order was created but response was lost?
            // 2. Order creation failed but we got timeout?
            // 3. Service is partially down?
            
            // Need idempotent operations with unique request IDs
            String idempotencyKey = request.getIdempotencyKey();
            
            // Check if order already exists
            try {
                OrderResult existing = getOrderByIdempotencyKey(idempotencyKey);
                if (existing != null) {
                    // Order was created despite error response
                    return existing;
                }
            } catch (Exception checkError) {
                // Can't even check - now what?
                log.error("Cannot determine order status", checkError);
                throw new SystemException("Order status unknown");
            }
        }
    }
}
```

#### 3. Version Compatibility Issues:
```protobuf
// API evolution challenges
// Version 1 of User service
message UserV1 {
    int32 id = 1;
    string name = 2;
    string email = 3;
}

// Version 2 adds required field - breaks old clients!
message UserV2 {
    int32 id = 1;
    string name = 2;
    string email = 3;
    string phone = 4;  // Oops! This breaks backward compatibility
    // Old clients can't handle this field
}

// Better approach - backward compatible changes
message UserV2Compatible {
    int32 id = 1;
    string name = 2;
    string email = 3;
    
    // Optional field maintains compatibility
    optional string phone = 4;
    
    // Use oneof for mutually exclusive fields
    oneof contact_preference {
        string email_preference = 5;
        string sms_preference = 6;
    }
    
    // Reserved fields prevent accidental reuse
    reserved 10 to 20;
    reserved "deprecated_field";
}
```

```go
// Client version handling
type UserServiceClient struct {
    version string
}

func (c *UserServiceClient) GetUser(userID string) (*User, error) {
    switch c.version {
    case "v1":
        return c.getUserV1(userID)
    case "v2":
        return c.getUserV2(userID)
    default:
        // Graceful degradation
        return c.getUserV1(userID)
    }
}

func (c *UserServiceClient) getUserV2(userID string) (*User, error) {
    // Try v2 API first
    user, err := c.callUserServiceV2(userID)
    if err != nil {
        // Fallback to v1 if v2 not available
        log.Warn("V2 API failed, falling back to v1", "error", err)
        return c.getUserV1(userID)
    }
    return user, nil
}
```

#### 4. Different Error Models:
```cpp
// Local vs Remote error handling complexity
class LocalUserService {
public:
    User getUser(int userId) {
        if (userId <= 0) {
            throw std::invalid_argument("Invalid user ID");
        }
        
        auto it = users.find(userId);
        if (it == users.end()) {
            throw UserNotFoundException("User not found");
        }
        
        return it->second;  // Simple, predictable errors
    }
};

class RemoteUserService {
private:
    HttpClient httpClient;
    
public:
    User getUser(int userId) {
        // Many more error conditions to handle:
        try {
            HttpResponse response = httpClient.get("/users/" + std::to_string(userId));
            
            switch (response.statusCode) {
                case 200:
                    return parseUser(response.body);
                    
                case 404:
                    throw UserNotFoundException("User not found");
                    
                case 400:
                    throw std::invalid_argument("Invalid request");
                    
                case 401:
                    throw AuthenticationException("Not authenticated");
                    
                case 403:
                    throw AuthorizationException("Not authorized");
                    
                case 429:
                    // Rate limited - should we retry?
                    throw RateLimitException("Too many requests");
                    
                case 500:
                    // Server error - temporary or permanent?
                    throw ServerException("Internal server error");
                    
                case 502:
                case 503:
                case 504:
                    // Gateway/proxy errors - definitely retry-able
                    throw ServiceUnavailableException("Service temporarily unavailable");
                    
                default:
                    throw UnknownException("Unexpected response: " + std::to_string(response.statusCode));
            }
            
        } catch (const NetworkException& e) {
            // Network-level errors
            throw ServiceException("Network error: " + std::string(e.what()));
            
        } catch (const TimeoutException& e) {
            // Request timeout
            throw ServiceException("Request timeout");
            
        } catch (const ConnectionException& e) {
            // Can't connect to service
            throw ServiceUnavailableException("Cannot connect to user service");
        }
    }
};
```

### Advanced RPC Challenges:

#### 1. Debugging Across Services:
```python
# Distributed tracing for RPC debugging
import opentracing
from jaeger_client import Config

def configure_tracing():
    config = Config(
        config={
            'sampler': {'type': 'const', 'param': 1},
            'logging': True,
        },
        service_name='order-service'
    )
    return config.initialize_tracer()

class OrderService:
    def __init__(self, tracer):
        self.tracer = tracer
        self.user_client = UserServiceClient(tracer)
        self.inventory_client = InventoryServiceClient(tracer)
        self.payment_client = PaymentServiceClient(tracer)
    
    def create_order(self, order_data):
        # Create root span for the entire operation
        with self.tracer.start_span('create_order') as span:
            span.set_tag('order.customer_id', order_data['customer_id'])
            span.set_tag('order.total_amount', order_data['total_amount'])
            
            try:
                # Each RPC call creates child spans
                user = self.user_client.get_user(order_data['customer_id'])
                span.log_kv({'event': 'user_fetched', 'user_id': user['id']})
                
                # Check inventory - this might fail
                inventory = self.inventory_client.check_availability(order_data['items'])
                span.log_kv({'event': 'inventory_checked', 'available': len(inventory)})
                
                # Process payment - this might also fail  
                payment = self.payment_client.charge(user['id'], order_data['total_amount'])
                span.log_kv({'event': 'payment_processed', 'transaction_id': payment['id']})
                
                # Save order
                order = self.save_order(order_data, payment['id'])
                span.set_tag('order.id', order['id'])
                
                return order
                
            except Exception as e:
                span.set_tag('error', True)
                span.log_kv({'event': 'error', 'error.object': str(e)})
                raise

# Without tracing, debugging distributed failures is nightmare:
# - Which service failed?
# - In what order did calls happen? 
# - What were the parameter values?
# - How long did each step take?
```

#### 2. Load Balancing và Service Discovery:
```java
// Service discovery complexity
@Service
public class UserServiceClient {
    private final ServiceDiscovery serviceDiscovery;
    private final LoadBalancer loadBalancer;
    private final List<ServiceInstance> healthyInstances = new CopyOnWriteArrayList<>();
    
    public UserServiceClient(ServiceDiscovery serviceDiscovery) {
        this.serviceDiscovery = serviceDiscovery;
        this.loadBalancer = new RoundRobinLoadBalancer();
        
        // Monitor service health
        startHealthChecking();
    }
    
    public User getUser(String userId) throws ServiceException {
        ServiceInstance instance = selectHealthyInstance();
        if (instance == null) {
            throw new ServiceUnavailableException("No healthy user service instances");
        }
        
        try {
            return callUserService(instance, userId);
            
        } catch (Exception e) {
            // Mark instance as potentially unhealthy
            handleInstanceError(instance, e);
            
            // Try another instance
            ServiceInstance fallback = selectHealthyInstance();
            if (fallback != null && !fallback.equals(instance)) {
                return callUserService(fallback, userId);
            }
            
            throw new ServiceException("All user service instances failed", e);
        }
    }
    
    private ServiceInstance selectHealthyInstance() {
        List<ServiceInstance> healthy = getHealthyInstances();
        return healthy.isEmpty() ? null : loadBalancer.select(healthy);
    }
    
    private void startHealthChecking() {
        ScheduledExecutorService executor = Executors.newScheduledThreadPool(1);
        
        executor.scheduleAtFixedRate(() -> {
            try {
                // Discover all service instances
                List<ServiceInstance> allInstances = serviceDiscovery.getInstances("user-service");
                
                // Health check each instance
                List<ServiceInstance> healthy = new ArrayList<>();
                for (ServiceInstance instance : allInstances) {
                    if (isHealthy(instance)) {
                        healthy.add(instance);
                    }
                }
                
                // Update healthy instances list
                healthyInstances.clear();
                healthyInstances.addAll(healthy);
                
            } catch (Exception e) {
                log.error("Health check failed", e);
            }
        }, 0, 30, TimeUnit.SECONDS);
    }
    
    private boolean isHealthy(ServiceInstance instance) {
        try {
            HttpResponse response = httpClient.get(
                instance.getBaseUrl() + "/health",
                Duration.ofSeconds(5)
            );
            return response.getStatus() == 200;
            
        } catch (Exception e) {
            log.warn("Health check failed for instance: " + instance, e);
            return false;
        }
    }
}
```

### Best Practices for RPC:

#### 1. Implement Circuit Breakers:
```python
# Prevent cascading failures
class CircuitBreaker:
    def __init__(self, failure_threshold=5, timeout=60, recovery_timeout=30):
        self.failure_threshold = failure_threshold
        self.timeout = timeout
        self.recovery_timeout = recovery_timeout
        
        self.failure_count = 0
        self.last_failure_time = None
        self.state = 'CLOSED'  # CLOSED, OPEN, HALF_OPEN
    
    def call(self, func, *args, **kwargs):
        if self.state == 'OPEN':
            if time.time() - self.last_failure_time > self.recovery_timeout:
                self.state = 'HALF_OPEN'
            else:
                raise CircuitBreakerOpenException("Circuit breaker is OPEN")
        
        try:
            result = func(*args, **kwargs)
            self.on_success()
            return result
            
        except Exception as e:
            self.on_failure()
            raise
    
    def on_success(self):
        self.failure_count = 0
        self.state = 'CLOSED'
    
    def on_failure(self):
        self.failure_count += 1
        self.last_failure_time = time.time()
        
        if self.failure_count >= self.failure_threshold:
            self.state = 'OPEN'
```

#### 2. Use Timeouts và Retries:
```java
// Resilient RPC calls
@Component
public class ResilientRPCClient {
    
    @Retryable(
        value = {ServiceException.class},
        maxAttempts = 3,
        backoff = @Backoff(delay = 1000, multiplier = 2)
    )
    public User getUserWithRetry(String userId) {
        return restTemplate.getForObject(
            "/users/{userId}", 
            User.class, 
            userId
        );
    }
    
    @CircuitBreaker(name = "user-service", fallbackMethod = "getUserFallback")
    @TimeLimiter(name = "user-service")
    public CompletableFuture<User> getUserAsync(String userId) {
        return CompletableFuture.supplyAsync(() -> 
            restTemplate.getForObject("/users/{userId}", User.class, userId)
        );
    }
    
    // Fallback method
    public CompletableFuture<User> getUserFallback(String userId, Exception ex) {
        return CompletableFuture.completedFuture(
            User.builder()
                .id(userId)
                .name("Unknown User")
                .email("unknown@example.com")
                .build()
        );
    }
}
```

#### 3. Design for Idempotency:
```python
# Idempotent RPC operations
class PaymentService:
    def charge_payment(self, payment_request):
        # Use idempotency key to handle retries safely
        idempotency_key = payment_request.get('idempotency_key')
        
        if not idempotency_key:
            raise ValueError("Idempotency key required")
        
        # Check if we already processed this request
        existing_payment = self.get_payment_by_key(idempotency_key)
        if existing_payment:
            # Return cached result - don't charge again!
            return existing_payment
        
        # Process payment
        try:
            result = self.payment_gateway.charge(payment_request)
            
            # Cache result with idempotency key
            self.cache_payment(idempotency_key, result)
            
            return result
            
        except Exception as e:
            # Don't cache failures - allow retries
            raise PaymentException(f"Payment failed: {e}")
```

### Key Takeaways:
- **RPC isn't just "function calls over network"** - it has unique failure modes
- **Design for failures** - networks are unreliable, services go down
- **Use appropriate timeouts, retries, và circuit breakers**
- **Make operations idempotent** to handle duplicate requests safely
- **Plan for API evolution** - services will change over time
- **Implement proper monitoring và tracing** for debugging distributed issues
- **Consider async alternatives** when appropriate for better resilience

---

*Post ID: yh1jsvh5sn957ft*  
*Category: BackEnd Interview*  
*Created: 2/9/2025*  
*Updated: 2/9/2025*

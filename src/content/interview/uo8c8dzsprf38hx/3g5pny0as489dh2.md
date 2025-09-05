---
title: "Distributed Systems (Phần 2) - Backend Interview Questions"
postId: "3g5pny0as489dh2"
category: "BackEnd Interview"
created: "2/9/2025"
updated: "2/9/2025"
---

# Distributed Systems (Phần 2) - Backend Interview Questions


## 60. Design cho scalability và robustness?

**Trả lời:** Designing scalable và robust distributed systems requires multiple architectural patterns, strategies, và best practices để handle growth và failures gracefully.

### Scalability Design Patterns:

#### 1. Horizontal Scaling (Scale-out):
```python
# Load balancer distributing requests across multiple instances
import random
import hashlib
from typing import List, Dict

class LoadBalancer:
    def __init__(self):
        self.servers = []
        self.weights = {}
        self.health_status = {}
    
    def add_server(self, server_id: str, weight: int = 1):
        self.servers.append(server_id)
        self.weights[server_id] = weight
        self.health_status[server_id] = True
    
    def remove_server(self, server_id: str):
        if server_id in self.servers:
            self.servers.remove(server_id)
            del self.weights[server_id]
            del self.health_status[server_id]
    
    def round_robin_select(self) -> str:
        """Simple round-robin load balancing"""
        healthy_servers = [s for s in self.servers if self.health_status[s]]
        if not healthy_servers:
            raise Exception("No healthy servers available")
        
        # Use global counter for round-robin
        if not hasattr(self, '_rr_counter'):
            self._rr_counter = 0
        
        server = healthy_servers[self._rr_counter % len(healthy_servers)]
        self._rr_counter += 1
        return server
    
    def consistent_hash_select(self, key: str) -> str:
        """Consistent hashing for sticky sessions"""
        if not self.servers:
            raise Exception("No servers available")
        
        # Hash the key and map to server ring
        hash_value = int(hashlib.md5(key.encode()).hexdigest(), 16)
        
        # Simple consistent hashing implementation
        server_hashes = []
        for server in self.servers:
            if self.health_status[server]:
                server_hash = int(hashlib.md5(server.encode()).hexdigest(), 16)
                server_hashes.append((server_hash, server))
        
        if not server_hashes:
            raise Exception("No healthy servers available")
        
        server_hashes.sort()
        
        # Find the first server whose hash is >= our key hash
        for server_hash, server in server_hashes:
            if hash_value <= server_hash:
                return server
        
        # Wrap around to the first server
        return server_hashes[0][1]
    
    def weighted_select(self) -> str:
        """Weighted random selection"""
        healthy_servers = [(s, self.weights[s]) for s in self.servers 
                          if self.health_status[s]]
        
        if not healthy_servers:
            raise Exception("No healthy servers available")
        
        total_weight = sum(weight for _, weight in healthy_servers)
        random_value = random.uniform(0, total_weight)
        
        current_weight = 0
        for server, weight in healthy_servers:
            current_weight += weight
            if random_value <= current_weight:
                return server
        
        return healthy_servers[-1][0]  # Fallback

# Usage example
class ScalableWebService:
    def __init__(self):
        self.load_balancer = LoadBalancer()
        self.setup_servers()
    
    def setup_servers(self):
        # Add multiple server instances
        for i in range(5):
            self.load_balancer.add_server(f"server-{i}", weight=1)
    
    def handle_request(self, request):
        # Route request to available server
        if request.get('user_id'):
            # Use consistent hashing for stateful requests
            server = self.load_balancer.consistent_hash_select(
                str(request['user_id'])
            )
        else:
            # Use round-robin for stateless requests
            server = self.load_balancer.round_robin_select()
        
        return self.forward_request(server, request)
    
    def auto_scale(self, current_load: float):
        """Auto-scaling based on load"""
        if current_load > 0.8:  # Scale up at 80% capacity
            new_server_id = f"server-{len(self.load_balancer.servers)}"
            self.spawn_new_instance(new_server_id)
            self.load_balancer.add_server(new_server_id)
        
        elif current_load < 0.3 and len(self.load_balancer.servers) > 2:
            # Scale down when load is low, but keep minimum instances
            server_to_remove = self.load_balancer.servers[-1]
            self.terminate_instance(server_to_remove)
            self.load_balancer.remove_server(server_to_remove)
```

#### 2. Database Sharding:
```java
// Horizontal database partitioning
public class DatabaseShardManager {
    private final List<DataSource> shards;
    private final ShardingStrategy strategy;
    
    public enum ShardingStrategy {
        HASH_BASED,
        RANGE_BASED,
        DIRECTORY_BASED
    }
    
    public DatabaseShardManager(List<DataSource> shards, ShardingStrategy strategy) {
        this.shards = shards;
        this.strategy = strategy;
    }
    
    public DataSource selectShard(String shardKey) {
        switch (strategy) {
            case HASH_BASED:
                return hashBasedSharding(shardKey);
            case RANGE_BASED:
                return rangeBasedSharding(shardKey);
            case DIRECTORY_BASED:
                return directoryBasedSharding(shardKey);
            default:
                throw new IllegalArgumentException("Unknown sharding strategy");
        }
    }
    
    private DataSource hashBasedSharding(String key) {
        int hash = Math.abs(key.hashCode());
        int shardIndex = hash % shards.size();
        return shards.get(shardIndex);
    }
    
    private DataSource rangeBasedSharding(String key) {
        // Example: shard by user ID ranges
        // Shard 0: 1-1000000, Shard 1: 1000001-2000000, etc.
        try {
            long id = Long.parseLong(key);
            int shardIndex = (int) ((id - 1) / 1000000);
            return shardIndex < shards.size() ? shards.get(shardIndex) : shards.get(0);
        } catch (NumberFormatException e) {
            return shards.get(0); // Default shard
        }
    }
    
    private DataSource directoryBasedSharding(String key) {
        // Look up shard location in directory service
        // This allows for more flexible shard assignment
        ShardLocation location = shardDirectory.lookup(key);
        return getShardByLocation(location);
    }
    
    // Cross-shard query coordination
    public <T> List<T> executeAcrossShards(String query, Class<T> resultClass) {
        List<CompletableFuture<List<T>>> futures = new ArrayList<>();
        
        for (DataSource shard : shards) {
            CompletableFuture<List<T>> future = CompletableFuture.supplyAsync(() -> {
                try (Connection conn = shard.getConnection()) {
                    return executeQuery(conn, query, resultClass);
                } catch (SQLException e) {
                    throw new RuntimeException("Shard query failed", e);
                }
            });
            futures.add(future);
        }
        
        // Collect results from all shards
        return futures.stream()
                .map(CompletableFuture::join)
                .flatMap(List::stream)
                .collect(Collectors.toList());
    }
    
    // Distributed transaction coordination
    public void executeDistributedTransaction(List<ShardOperation> operations) {
        // Two-phase commit protocol
        List<TransactionManager> txManagers = new ArrayList<>();
        
        try {
            // Phase 1: Prepare
            for (ShardOperation operation : operations) {
                DataSource shard = selectShard(operation.getShardKey());
                TransactionManager txManager = new TransactionManager(shard);
                boolean prepared = txManager.prepare(operation);
                
                if (!prepared) {
                    throw new TransactionException("Failed to prepare transaction on shard");
                }
                txManagers.add(txManager);
            }
            
            // Phase 2: Commit
            for (TransactionManager txManager : txManagers) {
                txManager.commit();
            }
            
        } catch (Exception e) {
            // Rollback all prepared transactions
            for (TransactionManager txManager : txManagers) {
                try {
                    txManager.rollback();
                } catch (Exception rollbackError) {
                    logger.error("Failed to rollback transaction", rollbackError);
                }
            }
            throw new TransactionException("Distributed transaction failed", e);
        }
    }
}
```

### Robustness Design Patterns:

#### 1. Circuit Breaker Pattern:
```go
package resilience

import (
    "errors"
    "sync"
    "time"
)

type CircuitBreakerState int

const (
    StateClosed CircuitBreakerState = iota
    StateHalfOpen
    StateOpen
)

type CircuitBreaker struct {
    mu                sync.RWMutex
    state             CircuitBreakerState
    failureCount      int
    successCount      int
    lastFailureTime   time.Time
    
    // Configuration
    failureThreshold  int           // Number of failures to open circuit
    recoveryTimeout   time.Duration // Time to wait before trying again
    successThreshold  int           // Number of successes to close circuit
}

func NewCircuitBreaker(failureThreshold int, recoveryTimeout time.Duration) *CircuitBreaker {
    return &CircuitBreaker{
        failureThreshold: failureThreshold,
        recoveryTimeout:  recoveryTimeout,
        successThreshold: 3, // Default: 3 successes to close
        state:           StateClosed,
    }
}

func (cb *CircuitBreaker) Execute(operation func() error) error {
    cb.mu.RLock()
    state := cb.state
    failureCount := cb.failureCount
    lastFailureTime := cb.lastFailureTime
    cb.mu.RUnlock()
    
    switch state {
    case StateClosed:
        return cb.executeOperation(operation)
        
    case StateOpen:
        // Check if we should transition to half-open
        if time.Since(lastFailureTime) > cb.recoveryTimeout {
            cb.mu.Lock()
            if cb.state == StateOpen { // Double-check
                cb.state = StateHalfOpen
                cb.successCount = 0
            }
            cb.mu.Unlock()
            return cb.executeOperation(operation)
        }
        return errors.New("circuit breaker is open")
        
    case StateHalfOpen:
        return cb.executeOperation(operation)
        
    default:
        return errors.New("unknown circuit breaker state")
    }
}

func (cb *CircuitBreaker) executeOperation(operation func() error) error {
    err := operation()
    
    cb.mu.Lock()
    defer cb.mu.Unlock()
    
    if err != nil {
        cb.onFailure()
    } else {
        cb.onSuccess()
    }
    
    return err
}

func (cb *CircuitBreaker) onFailure() {
    cb.failureCount++
    cb.lastFailureTime = time.Now()
    
    if cb.state == StateHalfOpen {
        // Failure in half-open state goes back to open
        cb.state = StateOpen
        cb.successCount = 0
    } else if cb.failureCount >= cb.failureThreshold {
        // Too many failures, open the circuit
        cb.state = StateOpen
        cb.successCount = 0
    }
}

func (cb *CircuitBreaker) onSuccess() {
    cb.failureCount = 0
    
    if cb.state == StateHalfOpen {
        cb.successCount++
        if cb.successCount >= cb.successThreshold {
            // Enough successes, close the circuit
            cb.state = StateClosed
            cb.successCount = 0
        }
    }
}

// Usage example
func main() {
    cb := NewCircuitBreaker(5, 30*time.Second)
    
    // Simulate service calls
    for i := 0; i < 100; i++ {
        err := cb.Execute(func() error {
            // Simulate external service call
            return callExternalService()
        })
        
        if err != nil {
            fmt.Printf("Request %d failed: %v\n", i, err)
        } else {
            fmt.Printf("Request %d succeeded\n", i)
        }
        
        time.Sleep(1 * time.Second)
    }
}
```

#### 2. Bulkhead Pattern:
```java
// Isolate resources to prevent cascading failures
@Component
public class BulkheadExecutorService {
    
    private final Map<String, ExecutorService> executorPools = new ConcurrentHashMap<>();
    
    @PostConstruct
    public void initialize() {
        // Create separate thread pools for different operations
        executorPools.put("user-operations", 
            Executors.newFixedThreadPool(10, namedThreadFactory("user-pool")));
        
        executorPools.put("order-operations", 
            Executors.newFixedThreadPool(15, namedThreadFactory("order-pool")));
        
        executorPools.put("payment-operations", 
            Executors.newFixedThreadPool(5, namedThreadFactory("payment-pool")));
        
        executorPools.put("notification-operations", 
            Executors.newFixedThreadPool(8, namedThreadFactory("notification-pool")));
    }
    
    public <T> CompletableFuture<T> submit(String poolName, Supplier<T> operation) {
        ExecutorService executor = executorPools.get(poolName);
        if (executor == null) {
            throw new IllegalArgumentException("Unknown pool: " + poolName);
        }
        
        return CompletableFuture.supplyAsync(operation, executor)
            .orTimeout(30, TimeUnit.SECONDS) // Prevent hung operations
            .handle((result, throwable) -> {
                if (throwable instanceof TimeoutException) {
                    logger.warn("Operation timed out in pool: " + poolName);
                    throw new ServiceTimeoutException("Operation timed out");
                }
                if (throwable != null) {
                    logger.error("Operation failed in pool: " + poolName, throwable);
                    throw new RuntimeException(throwable);
                }
                return result;
            });
    }
    
    // Example usage methods
    public CompletableFuture<User> getUserAsync(String userId) {
        return submit("user-operations", () -> {
            return userService.getUser(userId);
        });
    }
    
    public CompletableFuture<Order> processOrderAsync(OrderRequest request) {
        return submit("order-operations", () -> {
            return orderService.processOrder(request);
        });
    }
    
    public CompletableFuture<PaymentResult> processPaymentAsync(PaymentRequest request) {
        return submit("payment-operations", () -> {
            return paymentService.processPayment(request);
        });
    }
    
    // Monitor pool health
    @Scheduled(fixedRate = 60000) // Every minute
    public void monitorPools() {
        executorPools.forEach((poolName, executor) -> {
            if (executor instanceof ThreadPoolExecutor) {
                ThreadPoolExecutor tpe = (ThreadPoolExecutor) executor;
                
                int activeThreads = tpe.getActiveCount();
                int poolSize = tpe.getPoolSize();
                long completedTasks = tpe.getCompletedTaskCount();
                int queueSize = tpe.getQueue().size();
                
                logger.info("Pool {}: active={}, total={}, completed={}, queued={}", 
                    poolName, activeThreads, poolSize, completedTasks, queueSize);
                
                // Alert if pool is under stress
                if (queueSize > 100 || (double) activeThreads / poolSize > 0.9) {
                    logger.warn("Pool {} is under stress", poolName);
                }
            }
        });
    }
    
    @PreDestroy
    public void shutdown() {
        executorPools.values().forEach(ExecutorService::shutdown);
    }
}
```

#### 3. Graceful Degradation:
```python
# Feature toggles and fallback mechanisms
class FeatureToggle:
    def __init__(self):
        self.features = {
            'advanced_search': True,
            'recommendation_engine': True,
            'real_time_analytics': True,
            'social_features': True,
            'premium_features': True
        }
        self.fallbacks = {
            'advanced_search': self.basic_search,
            'recommendation_engine': self.popular_items,
            'real_time_analytics': self.cached_analytics,
            'social_features': self.no_social_features,
            'premium_features': self.basic_features
        }
    
    def is_enabled(self, feature_name):
        return self.features.get(feature_name, False)
    
    def execute_with_fallback(self, feature_name, primary_function, *args, **kwargs):
        if self.is_enabled(feature_name):
            try:
                return primary_function(*args, **kwargs)
            except Exception as e:
                logger.warning(f"Feature {feature_name} failed, using fallback: {e}")
                return self.fallbacks[feature_name](*args, **kwargs)
        else:
            logger.info(f"Feature {feature_name} disabled, using fallback")
            return self.fallbacks[feature_name](*args, **kwargs)
    
    # Fallback implementations
    def basic_search(self, query, filters=None):
        # Simple text matching instead of advanced search
        return simple_text_search(query)
    
    def popular_items(self, user_id, category=None):
        # Return popular items instead of personalized recommendations
        return get_popular_items(category)
    
    def cached_analytics(self, metric, time_range):
        # Return cached data instead of real-time calculation
        return get_cached_analytics(metric, time_range)
    
    def no_social_features(self, *args, **kwargs):
        return {'social_data': None, 'message': 'Social features temporarily unavailable'}
    
    def basic_features(self, *args, **kwargs):
        return {'features': ['basic'], 'message': 'Premium features unavailable'}

class RobustECommerceService:
    def __init__(self):
        self.feature_toggle = FeatureToggle()
        self.circuit_breakers = {
            'payment': CircuitBreaker(failure_threshold=3, timeout=30),
            'inventory': CircuitBreaker(failure_threshold=5, timeout=60),
            'recommendations': CircuitBreaker(failure_threshold=10, timeout=120)
        }
    
    def search_products(self, query, filters=None):
        """Search with graceful degradation"""
        return self.feature_toggle.execute_with_fallback(
            'advanced_search',
            self.advanced_search_service.search,
            query, filters
        )
    
    def get_recommendations(self, user_id):
        """Recommendations with circuit breaker and fallback"""
        cb = self.circuit_breakers['recommendations']
        
        try:
            if cb.state != 'OPEN':
                return self.feature_toggle.execute_with_fallback(
                    'recommendation_engine',
                    self.recommendation_service.get_recommendations,
                    user_id
                )
        except Exception as e:
            cb.record_failure()
            logger.error(f"Recommendation service failed: {e}")
        
        # Fallback to popular items
        return self.feature_toggle.fallbacks['recommendation_engine'](user_id)
    
    def process_checkout(self, cart, payment_info):
        """Critical path with multiple fallback levels"""
        try:
            # Try primary payment processor
            payment_result = self.primary_payment_service.process(payment_info)
            
        except PaymentServiceException:
            try:
                # Fallback to secondary payment processor
                payment_result = self.secondary_payment_service.process(payment_info)
                logger.info("Used secondary payment processor")
                
            except PaymentServiceException:
                # Final fallback - queue for later processing
                self.queue_payment_for_retry(cart, payment_info)
                return {
                    'status': 'pending',
                    'message': 'Payment queued for processing',
                    'order_id': generate_order_id()
                }
        
        # Continue with order fulfillment
        try:
            inventory_result = self.reserve_inventory(cart.items)
        except InventoryServiceException:
            # Compensate: refund payment
            self.refund_payment(payment_result.transaction_id)
            raise OrderProcessingException("Inventory unavailable")
        
        return self.create_order(cart, payment_result, inventory_result)
```

#### 4. Health Checks và Monitoring:
```go
// Comprehensive health monitoring
package monitoring

import (
    "context"
    "encoding/json"
    "net/http"
    "sync"
    "time"
)

type HealthStatus string

const (
    StatusHealthy   HealthStatus = "healthy"
    StatusDegraded  HealthStatus = "degraded" 
    StatusUnhealthy HealthStatus = "unhealthy"
)

type HealthCheck struct {
    Name        string        `json:"name"`
    Status      HealthStatus  `json:"status"`
    Message     string        `json:"message,omitempty"`
    LastChecked time.Time     `json:"last_checked"`
    Duration    time.Duration `json:"duration"`
}

type HealthChecker interface {
    Check(ctx context.Context) HealthCheck
}

type DatabaseHealthChecker struct {
    db Database
}

func (h *DatabaseHealthChecker) Check(ctx context.Context) HealthCheck {
    start := time.Now()
    
    // Test database connection
    err := h.db.Ping(ctx)
    duration := time.Since(start)
    
    if err != nil {
        return HealthCheck{
            Name:        "database",
            Status:      StatusUnhealthy,
            Message:     err.Error(),
            LastChecked: start,
            Duration:    duration,
        }
    }
    
    // Check if response time is acceptable
    if duration > 1*time.Second {
        return HealthCheck{
            Name:        "database", 
            Status:      StatusDegraded,
            Message:     "slow response time",
            LastChecked: start,
            Duration:    duration,
        }
    }
    
    return HealthCheck{
        Name:        "database",
        Status:      StatusHealthy,
        LastChecked: start,
        Duration:    duration,
    }
}

type ExternalServiceHealthChecker struct {
    serviceName string
    endpoint    string
    client      *http.Client
}

func (h *ExternalServiceHealthChecker) Check(ctx context.Context) HealthCheck {
    start := time.Now()
    
    req, err := http.NewRequestWithContext(ctx, "GET", h.endpoint+"/health", nil)
    if err != nil {
        return HealthCheck{
            Name:        h.serviceName,
            Status:      StatusUnhealthy,
            Message:     "failed to create request: " + err.Error(),
            LastChecked: start,
            Duration:    time.Since(start),
        }
    }
    
    resp, err := h.client.Do(req)
    duration := time.Since(start)
    
    if err != nil {
        return HealthCheck{
            Name:        h.serviceName,
            Status:      StatusUnhealthy,
            Message:     "request failed: " + err.Error(),
            LastChecked: start,
            Duration:    duration,
        }
    }
    defer resp.Body.Close()
    
    if resp.StatusCode != http.StatusOK {
        return HealthCheck{
            Name:        h.serviceName,
            Status:      StatusDegraded,
            Message:     fmt.Sprintf("HTTP %d", resp.StatusCode),
            LastChecked: start,
            Duration:    duration,
        }
    }
    
    return HealthCheck{
        Name:        h.serviceName,
        Status:      StatusHealthy,
        LastChecked: start,
        Duration:    duration,
    }
}

type HealthService struct {
    mu       sync.RWMutex
    checkers map[string]HealthChecker
    results  map[string]HealthCheck
    interval time.Duration
}

func NewHealthService(interval time.Duration) *HealthService {
    return &HealthService{
        checkers: make(map[string]HealthChecker),
        results:  make(map[string]HealthCheck),
        interval: interval,
    }
}

func (hs *HealthService) AddChecker(name string, checker HealthChecker) {
    hs.mu.Lock()
    defer hs.mu.Unlock()
    hs.checkers[name] = checker
}

func (hs *HealthService) Start(ctx context.Context) {
    ticker := time.NewTicker(hs.interval)
    defer ticker.Stop()
    
    // Initial health check
    hs.runHealthChecks(ctx)
    
    for {
        select {
        case <-ctx.Done():
            return
        case <-ticker.C:
            hs.runHealthChecks(ctx)
        }
    }
}

func (hs *HealthService) runHealthChecks(ctx context.Context) {
    var wg sync.WaitGroup
    
    hs.mu.RLock()
    checkers := make(map[string]HealthChecker)
    for name, checker := range hs.checkers {
        checkers[name] = checker
    }
    hs.mu.RUnlock()
    
    for name, checker := range checkers {
        wg.Add(1)
        go func(n string, c HealthChecker) {
            defer wg.Done()
            
            // Timeout for individual health check
            checkCtx, cancel := context.WithTimeout(ctx, 10*time.Second)
            defer cancel()
            
            result := c.Check(checkCtx)
            
            hs.mu.Lock()
            hs.results[n] = result
            hs.mu.Unlock()
        }(name, checker)
    }
    
    wg.Wait()
}

func (hs *HealthService) GetOverallStatus() (HealthStatus, map[string]HealthCheck) {
    hs.mu.RLock()
    defer hs.mu.RUnlock()
    
    results := make(map[string]HealthCheck)
    for k, v := range hs.results {
        results[k] = v
    }
    
    overallStatus := StatusHealthy
    
    for _, check := range results {
        switch check.Status {
        case StatusUnhealthy:
            return StatusUnhealthy, results
        case StatusDegraded:
            overallStatus = StatusDegraded
        }
    }
    
    return overallStatus, results
}

// HTTP handler for health endpoint
func (hs *HealthService) HealthHandler(w http.ResponseWriter, r *http.Request) {
    status, checks := hs.GetOverallStatus()
    
    response := map[string]interface{}{
        "status": status,
        "checks": checks,
        "timestamp": time.Now(),
    }
    
    w.Header().Set("Content-Type", "application/json")
    
    if status == StatusUnhealthy {
        w.WriteHeader(http.StatusServiceUnavailable)
    } else if status == StatusDegraded {
        w.WriteHeader(http.StatusOK) // Still serving requests
    } else {
        w.WriteHeader(http.StatusOK)
    }
    
    json.NewEncoder(w).Encode(response)
}
```

\---

## 61. Fault tolerance strategies?

**Trả lời:** Fault tolerance trong distributed systems requires multiple layers của protection để ensure system continues operating despite component failures.

### Core Fault Tolerance Patterns:

#### 1. Retry with Exponential Backoff:
```python
import time
import random
from functools import wraps
from typing import Callable, Any, Type, List

class RetryConfig:
    def __init__(self, 
                 max_attempts: int = 3,
                 base_delay: float = 1.0,
                 max_delay: float = 60.0,
                 exponential_base: float = 2.0,
                 jitter: bool = True,
                 retryable_exceptions: List[Type[Exception]] = None):
        self.max_attempts = max_attempts
        self.base_delay = base_delay
        self.max_delay = max_delay
        self.exponential_base = exponential_base
        self.jitter = jitter
        self.retryable_exceptions = retryable_exceptions or [Exception]

def retry_with_backoff(config: RetryConfig):
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs) -> Any:
            last_exception = None
            
            for attempt in range(config.max_attempts):
                try:
                    return func(*args, **kwargs)
                    
                except Exception as e:
                    last_exception = e
                    
                    # Check if exception is retryable
                    if not any(isinstance(e, exc_type) for exc_type in config.retryable_exceptions):
                        raise  # Don't retry non-retryable exceptions
                    
                    if attempt == config.max_attempts - 1:
                        raise  # Last attempt, re-raise the exception
                    
                    # Calculate delay
                    delay = config.base_delay * (config.exponential_base ** attempt)
                    delay = min(delay, config.max_delay)
                    
                    # Add jitter to prevent thundering herd
                    if config.jitter:
                        delay *= (0.5 + random.random() * 0.5)
                    
                    print(f"Attempt {attempt + 1} failed: {e}. Retrying in {delay:.2f}s...")
                    time.sleep(delay)
            
            raise last_exception
        
        return wrapper
    return decorator

# Usage examples
class ExternalServiceClient:
    @retry_with_backoff(RetryConfig(
        max_attempts=5,
        base_delay=1.0,
        max_delay=30.0,
        retryable_exceptions=[requests.ConnectionError, requests.Timeout]
    ))
    def fetch_user_data(self, user_id: str):
        response = requests.get(f"https://api.example.com/users/{user_id}", timeout=10)
        response.raise_for_status()
        return response.json()
    
    @retry_with_backoff(RetryConfig(
        max_attempts=3,
        base_delay=0.5,
        retryable_exceptions=[DatabaseConnectionError]
    ))
    def save_user_data(self, user_data: dict):
        with database.get_connection() as conn:
            conn.execute("INSERT INTO users (...) VALUES (...)", user_data)
```

#### 2. Circuit Breaker with Metrics:
```java
import java.time.Duration;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class AdvancedCircuitBreaker {
    public enum State {
        CLOSED, OPEN, HALF_OPEN
    }
    
    private volatile State state = State.CLOSED;
    
    // Metrics
    private final AtomicInteger failureCount = new AtomicInteger(0);
    private final AtomicInteger successCount = new AtomicInteger(0);
    private final AtomicInteger requestCount = new AtomicInteger(0);
    private final AtomicLong lastFailureTime = new AtomicLong(0);
    private final AtomicLong lastSuccessTime = new AtomicLong(0);
    
    // Configuration
    private final int failureThreshold;
    private final Duration timeout;
    private final int halfOpenMaxCalls;
    private final Duration metricsWindow;
    
    // Sliding window for failure rate calculation
    private final SlidingWindow failureRateWindow;
    
    public AdvancedCircuitBreaker(int failureThreshold, 
                                 Duration timeout,
                                 int halfOpenMaxCalls,
                                 Duration metricsWindow) {
        this.failureThreshold = failureThreshold;
        this.timeout = timeout;
        this.halfOpenMaxCalls = halfOpenMaxCalls;
        this.metricsWindow = metricsWindow;
        this.failureRateWindow = new SlidingWindow(metricsWindow);
    }
    
    public <T> T execute(Supplier<T> operation) throws Exception {
        if (!canExecute()) {
            throw new CircuitBreakerOpenException("Circuit breaker is OPEN");
        }
        
        long startTime = System.currentTimeMillis();
        requestCount.incrementAndGet();
        
        try {
            T result = operation.get();
            onSuccess(System.currentTimeMillis() - startTime);
            return result;
            
        } catch (Exception e) {
            onFailure(System.currentTimeMillis() - startTime);
            throw e;
        }
    }
    
    private boolean canExecute() {
        switch (state) {
            case CLOSED:
                return true;
                
            case OPEN:
                if (System.currentTimeMillis() - lastFailureTime.get() > timeout.toMillis()) {
                    // Transition to half-open
                    synchronized (this) {
                        if (state == State.OPEN) {
                            state = State.HALF_OPEN;
                            successCount.set(0);
                            failureCount.set(0);
                            return true;
                        }
                    }
                }
                return false;
                
            case HALF_OPEN:
                return requestCount.get() < halfOpenMaxCalls;
                
            default:
                return false;
        }
    }
    
    private void onSuccess(long executionTime) {
        lastSuccessTime.set(System.currentTimeMillis());
        successCount.incrementAndGet();
        failureRateWindow.recordSuccess();
        
        if (state == State.HALF_OPEN) {
            synchronized (this) {
                if (successCount.get() >= halfOpenMaxCalls / 2) {
                    // Enough successes, close the circuit
                    state = State.CLOSED;
                    resetMetrics();
                }
            }
        }
    }
    
    private void onFailure(long executionTime) {
        lastFailureTime.set(System.currentTimeMillis());
        failureCount.incrementAndGet();
        failureRateWindow.recordFailure();
        
        // Calculate failure rate over sliding window
        double failureRate = failureRateWindow.getFailureRate();
        
        if (state == State.CLOSED && failureRate > 0.5 && failureCount.get() >= failureThreshold) {
            // Open the circuit
            synchronized (this) {
                if (state == State.CLOSED) {
                    state = State.OPEN;
                }
            }
        } else if (state == State.HALF_OPEN) {
            // Any failure in half-open goes back to open
            synchronized (this) {
                state = State.OPEN;
            }
        }
    }
    
    public CircuitBreakerMetrics getMetrics() {
        return new CircuitBreakerMetrics(
            state,
            failureCount.get(),
            successCount.get(),
            requestCount.get(),
            failureRateWindow.getFailureRate(),
            lastFailureTime.get(),
            lastSuccessTime.get()
        );
    }
    
    private void resetMetrics() {
        failureCount.set(0);
        successCount.set(0);
        requestCount.set(0);
        failureRateWindow.reset();
    }
}

// Sliding window implementation for failure rate
class SlidingWindow {
    private final ConcurrentLinkedQueue<WindowEntry> entries = new ConcurrentLinkedQueue<>();
    private final long windowSizeMs;
    
    public SlidingWindow(Duration windowSize) {
        this.windowSizeMs = windowSize.toMillis();
    }
    
    public void recordSuccess() {
        record(true);
    }
    
    public void recordFailure() {
        record(false);
    }
    
    private void record(boolean success) {
        long now = System.currentTimeMillis();
        entries.offer(new WindowEntry(now, success));
        cleanupOldEntries(now);
    }
    
    public double getFailureRate() {
        long now = System.currentTimeMillis();
        cleanupOldEntries(now);
        
        int totalCount = 0;
        int failureCount = 0;
        
        for (WindowEntry entry : entries) {
            totalCount++;
            if (!entry.success) {
                failureCount++;
            }
        }
        
        return totalCount == 0 ? 0.0 : (double) failureCount / totalCount;
    }
    
    private void cleanupOldEntries(long now) {
        entries.removeIf(entry -> now - entry.timestamp > windowSizeMs);
    }
    
    public void reset() {
        entries.clear();
    }
    
    private static class WindowEntry {
        final long timestamp;
        final boolean success;
        
        WindowEntry(long timestamp, boolean success) {
            this.timestamp = timestamp;
            this.success = success;
        }
    }
}
```

#### 3. Bulkhead Isolation:
```go
// Resource isolation to prevent cascading failures
package bulkhead

import (
    "context"
    "fmt"
    "sync"
    "time"
)

type ResourcePool struct {
    name         string
    capacity     int
    available    chan struct{}
    inUse        int
    mu           sync.RWMutex
    metrics      *PoolMetrics
}

type PoolMetrics struct {
    TotalRequests    int64
    ActiveRequests   int64
    RejectedRequests int64
    AverageWaitTime  time.Duration
    MaxWaitTime      time.Duration
}

func NewResourcePool(name string, capacity int) *ResourcePool {
    available := make(chan struct{}, capacity)
    
    // Fill the pool
    for i := 0; i < capacity; i++ {
        available <- struct{}{}
    }
    
    return &ResourcePool{
        name:      name,
        capacity:  capacity,
        available: available,
        metrics:   &PoolMetrics{},
    }
}

func (rp *ResourcePool) Acquire(ctx context.Context, timeout time.Duration) (*Resource, error) {
    startTime := time.Now()
    
    rp.mu.Lock()
    rp.metrics.TotalRequests++
    rp.mu.Unlock()
    
    // Try to acquire resource with timeout
    acquireCtx, cancel := context.WithTimeout(ctx, timeout)
    defer cancel()
    
    select {
    case <-rp.available:
        waitTime := time.Since(startTime)
        
        rp.mu.Lock()
        rp.inUse++
        rp.metrics.ActiveRequests++
        
        if waitTime > rp.metrics.MaxWaitTime {
            rp.metrics.MaxWaitTime = waitTime
        }
        
        // Update average wait time (simple moving average)
        rp.metrics.AverageWaitTime = (rp.metrics.AverageWaitTime + waitTime) / 2
        rp.mu.Unlock()
        
        return &Resource{
            pool:        rp,
            acquiredAt: startTime,
        }, nil
        
    case <-acquireCtx.Done():
        rp.mu.Lock()
        rp.metrics.RejectedRequests++
        rp.mu.Unlock()
        
        return nil, fmt.Errorf("failed to acquire resource from pool %s: %v", 
            rp.name, acquireCtx.Err())
    }
}

func (rp *ResourcePool) release() {
    rp.mu.Lock()
    rp.inUse--
    rp.metrics.ActiveRequests--
    rp.mu.Unlock()
    
    rp.available <- struct{}{}
}

func (rp *ResourcePool) GetMetrics() PoolMetrics {
    rp.mu.RLock()
    defer rp.mu.RUnlock()
    return *rp.metrics
}

type Resource struct {
    pool       *ResourcePool
    acquiredAt time.Time
}

func (r *Resource) Release() {
    r.pool.release()
}

// Bulkhead service that isolates different types of operations
type BulkheadService struct {
    pools map[string]*ResourcePool
    mu    sync.RWMutex
}

func NewBulkheadService() *BulkheadService {
    return &BulkheadService{
        pools: make(map[string]*ResourcePool),
    }
}

func (bs *BulkheadService) CreatePool(name string, capacity int) {
    bs.mu.Lock()
    defer bs.mu.Unlock()
    bs.pools[name] = NewResourcePool(name, capacity)
}

func (bs *BulkheadService) ExecuteInPool(ctx context.Context, 
                                       poolName string,
                                       timeout time.Duration,
                                       operation func() error) error {
    bs.mu.RLock()
    pool, exists := bs.pools[poolName]
    bs.mu.RUnlock()
    
    if !exists {
        return fmt.Errorf("pool %s does not exist", poolName)
    }
    
    resource, err := pool.Acquire(ctx, timeout)
    if err != nil {
        return fmt.Errorf("failed to acquire resource: %v", err)
    }
    defer resource.Release()
    
    return operation()
}

// Usage example
func main() {
    bulkhead := NewBulkheadService()
    
    // Create separate resource pools for different operations
    bulkhead.CreatePool("database-read", 20)   // 20 concurrent DB reads
    bulkhead.CreatePool("database-write", 5)   // 5 concurrent DB writes  
    bulkhead.CreatePool("external-api", 10)    // 10 concurrent API calls
    bulkhead.CreatePool("file-upload", 3)      // 3 concurrent file uploads
    
    // Example usage
    ctx := context.Background()
    
    // Database read operation - isolated from other operations
    err := bulkhead.ExecuteInPool(ctx, "database-read", 5*time.Second, func() error {
        return performDatabaseRead()
    })
    
    if err != nil {
        log.Printf("Database read failed: %v", err)
    }
    
    // External API call - won't affect database operations even if slow
    err = bulkhead.ExecuteInPool(ctx, "external-api", 10*time.Second, func() error {
        return callExternalService()
    })
    
    if err != nil {
        log.Printf("External API call failed: %v", err)
    }
}
```

#### 4. Timeout và Deadline Management:
```python
# Comprehensive timeout management
import asyncio
import time
from contextlib import asynccontextmanager
from dataclasses import dataclass
from typing import Optional, Any, Dict

@dataclass
class TimeoutConfig:
    connect_timeout: float = 5.0
    read_timeout: float = 30.0
    write_timeout: float = 10.0
    total_timeout: float = 60.0

class TimeoutManager:
    def __init__(self, config: TimeoutConfig):
        self.config = config
        self.active_operations: Dict[str, float] = {}
    
    @asynccontextmanager
    async def with_timeout(self, operation_name: str, timeout: Optional[float] = None):
        """Context manager for timeout control"""
        timeout = timeout or self.config.total_timeout
        start_time = time.time()
        
        self.active_operations[operation_name] = start_time
        
        try:
            async with asyncio.timeout(timeout):
                yield
        except asyncio.TimeoutError:
            duration = time.time() - start_time
            raise TimeoutError(f"Operation '{operation_name}' timed out after {duration:.2f}s")
        finally:
            self.active_operations.pop(operation_name, None)
    
    async def execute_with_cascading_timeouts(self, operations):
        """Execute operations with decreasing timeout budgets"""
        total_start = time.time()
        remaining_budget = self.config.total_timeout
        results = []
        
        for i, (name, operation) in enumerate(operations):
            if remaining_budget <= 0:
                raise TimeoutError(f"No time budget left for operation '{name}'")
            
            # Allocate timeout budget
            operation_timeout = min(remaining_budget, self.config.total_timeout / len(operations))
            
            try:
                async with self.with_timeout(name, operation_timeout):
                    result = await operation()
                    results.append(result)
                    
                    # Update remaining budget
                    elapsed = time.time() - total_start
                    remaining_budget = self.config.total_timeout - elapsed
                    
            except TimeoutError as e:
                # Decide whether to continue or fail fast
                if self._is_critical_operation(name):
                    raise
                else:
                    results.append(None)  # Continue with partial failure
        
        return results
    
    def _is_critical_operation(self, operation_name: str) -> bool:
        critical_operations = {'payment', 'authentication', 'security_check'}
        return operation_name in critical_operations

class ResilientHTTPClient:
    def __init__(self, timeout_config: TimeoutConfig):
        self.timeout_manager = TimeoutManager(timeout_config)
        self.session = None
    
    async def make_request_with_timeouts(self, url: str, method: str = 'GET', **kwargs):
        """HTTP request with granular timeout control"""
        
        connector = aiohttp.TCPConnector(
            connect_timeout=self.timeout_config.connect_timeout,
            read_timeout=self.timeout_config.read_timeout
        )
        
        timeout = aiohttp.ClientTimeout(
            total=self.timeout_config.total_timeout,
            connect=self.timeout_config.connect_timeout,
            sock_read=self.timeout_config.read_timeout
        )
        
        async with aiohttp.ClientSession(
            connector=connector, 
            timeout=timeout
        ) as session:
            
            async with self.timeout_manager.with_timeout(f"http_{method}_{url}"):
                async with session.request(method, url, **kwargs) as response:
                    return await response.json()

# Distributed operation with timeout coordination
class DistributedOperationManager:
    def __init__(self):
        self.timeout_manager = TimeoutManager(TimeoutConfig(total_timeout=120.0))
    
    async def process_distributed_transaction(self, transaction_data):
        """Process transaction across multiple services with coordinated timeouts"""
        
        operations = [
            ("validate_user", lambda: self.validate_user_service(transaction_data['user_id'])),
            ("check_inventory", lambda: self.inventory_service(transaction_data['items'])),
            ("reserve_payment", lambda: self.payment_service(transaction_data['payment_info'])),
            ("create_order", lambda: self.order_service(transaction_data)),
            ("notify_user", lambda: self.notification_service(transaction_data['user_id']))
        ]
        
        try:
            results = await self.timeout_manager.execute_with_cascading_timeouts(operations)
            return self.process_results(results)
            
        except TimeoutError as e:
            # Initiate compensation/rollback
            await self.rollback_partial_transaction(transaction_data)
            raise DistributedTransactionTimeout(str(e))
    
    async def rollback_partial_transaction(self, transaction_data):
        """Compensating actions for partial failures"""
        # Implement saga pattern rollback
        rollback_operations = [
            ("release_inventory", lambda: self.release_inventory(transaction_data['items'])),
            ("cancel_payment", lambda: self.cancel_payment_hold(transaction_data['payment_info'])),
            ("cleanup_order", lambda: self.cleanup_partial_order(transaction_data))
        ]
        
        # Use shorter timeout for rollback operations
        rollback_config = TimeoutConfig(total_timeout=30.0)
        rollback_manager = TimeoutManager(rollback_config)
        
        for name, operation in rollback_operations:
            try:
                async with rollback_manager.with_timeout(name):
                    await operation()
            except Exception as e:
                # Log rollback failures but continue
                logger.error(f"Rollback operation {name} failed: {e}")
```

### Key Principles:

1. **Fail Fast**: Detect failures quickly và don't let them propagate
2. **Isolation**: Isolate failures to prevent cascading 
3. **Redundancy**: Have backup systems và fallback mechanisms
4. **Graceful Degradation**: Reduce functionality rather than complete failure
5. **Monitoring**: Continuous health monitoring và alerting
6. **Testing**: Regular chaos engineering và failure scenario testing

\---

## 62. Handle failures trong distributed systems?

**Trả lời:** Handling failures trong distributed systems requires comprehensive strategies để detect, isolate, recover from, và learn from failures across network partitions, service outages, và data inconsistencies.

### Failure Detection Strategies:

#### 1. Health Check Systems:
```java
// Comprehensive health monitoring and failure detection
@Component
public class DistributedHealthMonitor {
    
    private final Map<String, ServiceHealthTracker> serviceTrackers = new ConcurrentHashMap<>();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(5);
    
    @PostConstruct
    public void initialize() {
        // Register services for monitoring
        registerService("user-service", "http://user-service:8080", Duration.ofSeconds(30));
        registerService("payment-service", "http://payment-service:8080", Duration.ofSeconds(15));
        registerService("inventory-service", "http://inventory-service:8080", Duration.ofSeconds(45));
        
        // Start monitoring
        startHealthMonitoring();
    }
    
    public void registerService(String serviceName, String healthEndpoint, Duration checkInterval) {
        ServiceHealthTracker tracker = new ServiceHealthTracker(serviceName, healthEndpoint);
        serviceTrackers.put(serviceName, tracker);
        
        // Schedule periodic health checks
        scheduler.scheduleAtFixedRate(
            () -> checkServiceHealth(tracker),
            0,
            checkInterval.toSeconds(),
            TimeUnit.SECONDS
        );
    }
    
    private void checkServiceHealth(ServiceHealthTracker tracker) {
        try {
            HealthCheckResult result = performHealthCheck(tracker.getHealthEndpoint());
            tracker.recordHealthCheck(result);
            
            if (result.isHealthy()) {
                if (tracker.wasUnhealthy()) {
                    // Service recovered
                    handleServiceRecovery(tracker);
                }
            } else {
                if (tracker.wasHealthy()) {
                    // Service just became unhealthy
                    handleServiceFailure(tracker, result);
                }
            }
            
        } catch (Exception e) {
            // Health check itself failed
            HealthCheckResult failedResult = HealthCheckResult.failed("Health check failed: " + e.getMessage());
            tracker.recordHealthCheck(failedResult);
            
            if (tracker.wasHealthy()) {
                handleServiceFailure(tracker, failedResult);
            }
        }
    }
    
    private void handleServiceFailure(ServiceHealthTracker tracker, HealthCheckResult result) {
        String serviceName = tracker.getServiceName();
        logger.warn("Service {} became unhealthy: {}", serviceName, result.getMessage());
        
        // Remove from load balancer
        loadBalancer.removeService(serviceName);
        
        // Trigger circuit breaker
        circuitBreakerRegistry.circuitBreaker(serviceName).transitionToOpenState();
        
        // Send alert
        alertService.sendAlert(AlertLevel.HIGH, 
            "Service Failure", 
            String.format("Service %s is unhealthy: %s", serviceName, result.getMessage()));
        
        // Start recovery procedures
        initiateServiceRecovery(tracker);
    }
    
    private void handleServiceRecovery(ServiceHealthTracker tracker) {
        String serviceName = tracker.getServiceName();
        logger.info("Service {} recovered", serviceName);
        
        // Add back to load balancer
        loadBalancer.addService(serviceName, tracker.getServiceEndpoint());
        
        // Reset circuit breaker to half-open
        circuitBreakerRegistry.circuitBreaker(serviceName).transitionToHalfOpenState();
        
        // Send recovery notification
        alertService.sendAlert(AlertLevel.INFO, 
            "Service Recovery", 
            String.format("Service %s has recovered", serviceName));
    }
    
    private void initiateServiceRecovery(ServiceHealthTracker tracker) {
        // Auto-recovery strategies
        CompletableFuture.runAsync(() -> {
            try {
                // Wait before attempting recovery
                Thread.sleep(Duration.ofMinutes(2).toMillis());
                
                // Attempt service restart
                if (serviceManager.isManaged(tracker.getServiceName())) {
                    logger.info("Attempting to restart service: {}", tracker.getServiceName());
                    serviceManager.restartService(tracker.getServiceName());
                }
                
                // Scale up additional instances
                autoScaler.scaleUp(tracker.getServiceName(), 1);
                
            } catch (Exception e) {
                logger.error("Auto-recovery failed for service: " + tracker.getServiceName(), e);
            }
        });
    }
}

class ServiceHealthTracker {
    private final String serviceName;
    private final String healthEndpoint;
    private final Queue<HealthCheckResult> recentResults = new ArrayDeque<>(10);
    private volatile boolean currentlyHealthy = true;
    private volatile long lastFailureTime = 0;
    private volatile int consecutiveFailures = 0;
    
    public ServiceHealthTracker(String serviceName, String healthEndpoint) {
        this.serviceName = serviceName;
        this.healthEndpoint = healthEndpoint;
    }
    
    public void recordHealthCheck(HealthCheckResult result) {
        synchronized (recentResults) {
            recentResults.offer(result);
            if (recentResults.size() > 10) {
                recentResults.poll();
            }
        }
        
        if (result.isHealthy()) {
            currentlyHealthy = true;
            consecutiveFailures = 0;
        } else {
            if (currentlyHealthy) {
                lastFailureTime = System.currentTimeMillis();
            }
            currentlyHealthy = false;
            consecutiveFailures++;
        }
    }
    
    public boolean wasHealthy() {
        return currentlyHealthy;
    }
    
    public boolean wasUnhealthy() {
        return !currentlyHealthy;
    }
    
    public double getHealthPercentage() {
        synchronized (recentResults) {
            long healthyCount = recentResults.stream()
                .mapToLong(r -> r.isHealthy() ? 1 : 0)
                .sum();
            return recentResults.isEmpty() ? 0.0 : (double) healthyCount / recentResults.size();
        }
    }
}
```

#### 2. Distributed Consensus và Leader Election:
```go
// Raft consensus implementation for leader election and failure handling
package raft

import (
    "context"
    "math/rand"
    "sync"
    "time"
)

type NodeState int

const (
    Follower NodeState = iota
    Candidate
    Leader
)

type RaftNode struct {
    id           string
    state        NodeState
    currentTerm  int64
    votedFor     string
    log          []LogEntry
    commitIndex  int64
    lastApplied  int64
    
    // Leader state
    nextIndex    map[string]int64
    matchIndex   map[string]int64
    
    // Channels
    appendEntriesCh chan AppendEntriesRequest
    requestVoteCh   chan RequestVoteRequest
    
    // Peers
    peers        []string
    client       *RaftClient
    
    // Timing
    electionTimeout  time.Duration
    heartbeatTimeout time.Duration
    
    mu sync.RWMutex
}

type LogEntry struct {
    Term    int64
    Index   int64
    Command interface{}
}

type AppendEntriesRequest struct {
    Term         int64
    LeaderId     string
    PrevLogIndex int64
    PrevLogTerm  int64
    Entries      []LogEntry
    LeaderCommit int64
    ResponseCh   chan AppendEntriesResponse
}

type RequestVoteRequest struct {
    Term         int64
    CandidateId  string
    LastLogIndex int64
    LastLogTerm  int64
    ResponseCh   chan RequestVoteResponse
}

func NewRaftNode(id string, peers []string) *RaftNode {
    return &RaftNode{
        id:               id,
        state:           Follower,
        peers:           peers,
        electionTimeout: randomElectionTimeout(),
        heartbeatTimeout: 50 * time.Millisecond,
        appendEntriesCh: make(chan AppendEntriesRequest, 100),
        requestVoteCh:   make(chan RequestVoteRequest, 100),
        nextIndex:       make(map[string]int64),
        matchIndex:      make(map[string]int64),
    }
}

func (rn *RaftNode) Start(ctx context.Context) {
    go rn.run(ctx)
}

func (rn *RaftNode) run(ctx context.Context) {
    electionTimer := time.NewTimer(rn.electionTimeout)
    heartbeatTimer := time.NewTimer(rn.heartbeatTimeout)
    
    for {
        select {
        case <-ctx.Done():
            return
            
        case req := <-rn.appendEntriesCh:
            rn.handleAppendEntries(req)
            electionTimer.Reset(rn.electionTimeout)
            
        case req := <-rn.requestVoteCh:
            rn.handleRequestVote(req)
            
        case <-electionTimer.C:
            // Election timeout - become candidate
            if rn.state != Leader {
                rn.startElection()
            }
            electionTimer.Reset(randomElectionTimeout())
            
        case <-heartbeatTimer.C:
            // Send heartbeats if leader
            if rn.state == Leader {
                rn.sendHeartbeats()
            }
            heartbeatTimer.Reset(rn.heartbeatTimeout)
        }
    }
}

func (rn *RaftNode) startElection() {
    rn.mu.Lock()
    rn.state = Candidate
    rn.currentTerm++
    rn.votedFor = rn.id
    term := rn.currentTerm
    lastLogIndex := int64(len(rn.log))
    lastLogTerm := int64(0)
    if len(rn.log) > 0 {
        lastLogTerm = rn.log[len(rn.log)-1].Term
    }
    rn.mu.Unlock()
    
    log.Printf("Node %s starting election for term %d", rn.id, term)
    
    votes := 1 // Vote for self
    voteCh := make(chan bool, len(rn.peers))
    
    // Request votes from peers
    for _, peer := range rn.peers {
        go func(peerId string) {
            resp, err := rn.client.RequestVote(peerId, RequestVoteRequest{
                Term:         term,
                CandidateId:  rn.id,
                LastLogIndex: lastLogIndex,
                LastLogTerm:  lastLogTerm,
            })
            
            if err != nil {
                voteCh <- false
                return
            }
            
            // Update term if we discover a higher term
            rn.mu.Lock()
            if resp.Term > rn.currentTerm {
                rn.currentTerm = resp.Term
                rn.state = Follower
                rn.votedFor = ""
            }
            rn.mu.Unlock()
            
            voteCh <- resp.VoteGranted
        }(peer)
    }
    
    // Count votes
    majority := len(rn.peers)/2 + 1
    timeout := time.After(rn.electionTimeout)
    
    for votes < majority {
        select {
        case vote := <-voteCh:
            if vote {
                votes++
            }
        case <-timeout:
            log.Printf("Node %s election timeout", rn.id)
            return
        }
    }
    
    // Won election
    rn.mu.Lock()
    if rn.state == Candidate && rn.currentTerm == term {
        rn.state = Leader
        rn.initializeLeaderState()
        log.Printf("Node %s became leader for term %d", rn.id, term)
    }
    rn.mu.Unlock()
}

func (rn *RaftNode) handleAppendEntries(req AppendEntriesRequest) {
    rn.mu.Lock()
    defer rn.mu.Unlock()
    
    response := AppendEntriesResponse{
        Term:    rn.currentTerm,
        Success: false,
    }
    
    // Reply false if term < currentTerm
    if req.Term < rn.currentTerm {
        req.ResponseCh <- response
        return
    }
    
    // Update term and convert to follower if necessary
    if req.Term > rn.currentTerm {
        rn.currentTerm = req.Term
        rn.votedFor = ""
    }
    rn.state = Follower
    
    // Reply false if log doesn't contain an entry at prevLogIndex
    // whose term matches prevLogTerm
    if req.PrevLogIndex > 0 {
        if int64(len(rn.log)) < req.PrevLogIndex ||
           rn.log[req.PrevLogIndex-1].Term != req.PrevLogTerm {
            req.ResponseCh <- response
            return
        }
    }
    
    // Append new entries
    if len(req.Entries) > 0 {
        // Delete any conflicting entries
        if int64(len(rn.log)) > req.PrevLogIndex {
            rn.log = rn.log[:req.PrevLogIndex]
        }
        
        // Append new entries
        rn.log = append(rn.log, req.Entries...)
    }
    
    // Update commit index
    if req.LeaderCommit > rn.commitIndex {
        rn.commitIndex = min(req.LeaderCommit, int64(len(rn.log)))
    }
    
    response.Success = true
    req.ResponseCh <- response
}

func (rn *RaftNode) sendHeartbeats() {
    rn.mu.RLock()
    if rn.state != Leader {
        rn.mu.RUnlock()
        return
    }
    
    term := rn.currentTerm
    commitIndex := rn.commitIndex
    rn.mu.RUnlock()
    
    for _, peer := range rn.peers {
        go func(peerId string) {
            rn.mu.RLock()
            nextIndex := rn.nextIndex[peerId]
            prevLogIndex := nextIndex - 1
            prevLogTerm := int64(0)
            
            if prevLogIndex > 0 && int(prevLogIndex) <= len(rn.log) {
                prevLogTerm = rn.log[prevLogIndex-1].Term
            }
            
            entries := []LogEntry{}
            if int(nextIndex) <= len(rn.log) {
                entries = rn.log[nextIndex-1:]
            }
            rn.mu.RUnlock()
            
            resp, err := rn.client.AppendEntries(peerId, AppendEntriesRequest{
                Term:         term,
                LeaderId:     rn.id,
                PrevLogIndex: prevLogIndex,
                PrevLogTerm:  prevLogTerm,
                Entries:      entries,
                LeaderCommit: commitIndex,
            })
            
            if err != nil {
                log.Printf("Failed to send heartbeat to %s: %v", peerId, err)
                return
            }
            
            rn.mu.Lock()
            if resp.Term > rn.currentTerm {
                rn.currentTerm = resp.Term
                rn.state = Follower
                rn.votedFor = ""
            } else if rn.state == Leader && resp.Success {
                rn.nextIndex[peerId] = nextIndex + int64(len(entries))
                rn.matchIndex[peerId] = rn.nextIndex[peerId] - 1
            } else if rn.state == Leader && !resp.Success {
                rn.nextIndex[peerId] = max(1, rn.nextIndex[peerId]-1)
            }
            rn.mu.Unlock()
        }(peer)
    }
}

func randomElectionTimeout() time.Duration {
    return time.Duration(150+rand.Intn(150)) * time.Millisecond
}
```

#### 3. Saga Pattern for Distributed Transaction Recovery:
```python
# Saga pattern implementation for handling distributed transaction failures
from abc import ABC, abstractmethod
from enum import Enum
from typing import List, Dict, Any, Optional
import asyncio
import logging

class SagaStepStatus(Enum):
    PENDING = "pending"
    COMPLETED = "completed" 
    COMPENSATED = "compensated"
    FAILED = "failed"

class SagaStep(ABC):
    def __init__(self, name: str):
        self.name = name
        self.status = SagaStepStatus.PENDING
        self.result = None
        self.error = None
    
    @abstractmethod
    async def execute(self, context: Dict[str, Any]) -> Any:
        """Execute the step"""
        pass
    
    @abstractmethod
    async def compensate(self, context: Dict[str, Any]) -> Any:
        """Compensate for this step (undo the operation)"""
        pass

class OrderSagaSteps:
    """Concrete saga steps for order processing"""
    
    class ReserveInventoryStep(SagaStep):
        def __init__(self, inventory_service):
            super().__init__("reserve_inventory")
            self.inventory_service = inventory_service
        
        async def execute(self, context: Dict[str, Any]) -> Any:
            order_items = context['order']['items']
            reservation_id = await self.inventory_service.reserve_items(order_items)
            return {'reservation_id': reservation_id}
        
        async def compensate(self, context: Dict[str, Any]) -> Any:
            if self.result and 'reservation_id' in self.result:
                await self.inventory_service.release_reservation(
                    self.result['reservation_id']
                )
    
    class ProcessPaymentStep(SagaStep):
        def __init__(self, payment_service):
            super().__init__("process_payment")
            self.payment_service = payment_service
        
        async def execute(self, context: Dict[str, Any]) -> Any:
            payment_info = context['order']['payment_info']
            amount = context['order']['total_amount']
            
            charge_result = await self.payment_service.charge_payment(
                payment_info, amount
            )
            return {'transaction_id': charge_result['transaction_id']}
        
        async def compensate(self, context: Dict[str, Any]) -> Any:
            if self.result and 'transaction_id' in self.result:
                await self.payment_service.refund_payment(
                    self.result['transaction_id']
                )
    
    class CreateOrderStep(SagaStep):
        def __init__(self, order_service):
            super().__init__("create_order")
            self.order_service = order_service
        
        async def execute(self, context: Dict[str, Any]) -> Any:
            order_data = context['order']
            order_id = await self.order_service.create_order(order_data)
            return {'order_id': order_id}
        
        async def compensate(self, context: Dict[str, Any]) -> Any:
            if self.result and 'order_id' in self.result:
                await self.order_service.cancel_order(
                    self.result['order_id']
                )

class SagaOrchestrator:
    def __init__(self, saga_id: str, steps: List[SagaStep]):
        self.saga_id = saga_id
        self.steps = steps
        self.current_step = 0
        self.context = {}
        self.status = "running"
    
    async def execute(self, initial_context: Dict[str, Any]) -> Dict[str, Any]:
        """Execute the saga"""
        self.context = initial_context.copy()
        
        try:
            # Execute all steps
            for i, step in enumerate(self.steps):
                self.current_step = i
                
                logging.info(f"Saga {self.saga_id}: Executing step {step.name}")
                
                try:
                    step.result = await step.execute(self.context)
                    step.status = SagaStepStatus.COMPLETED
                    
                    # Add step result to context for next steps
                    self.context[f"{step.name}_result"] = step.result
                    
                except Exception as e:
                    step.error = str(e)
                    step.status = SagaStepStatus.FAILED
                    
                    logging.error(f"Saga {self.saga_id}: Step {step.name} failed: {e}")
                    
                    # Start compensation
                    await self.compensate()
                    self.status = "failed"
                    
                    return {
                        'saga_id': self.saga_id,
                        'status': self.status,
                        'failed_step': step.name,
                        'error': str(e)
                    }
            
            self.status = "completed"
            logging.info(f"Saga {self.saga_id}: Completed successfully")
            
            return {
                'saga_id': self.saga_id,
                'status': self.status,
                'results': {step.name: step.result for step in self.steps}
            }
            
        except Exception as e:
            logging.error(f"Saga {self.saga_id}: Unexpected error: {e}")
            await self.compensate()
            self.status = "failed"
            
            return {
                'saga_id': self.saga_id,
                'status': self.status,
                'error': str(e)
            }
    
    async def compensate(self):
        """Compensate completed steps in reverse order"""
        logging.info(f"Saga {self.saga_id}: Starting compensation")
        
        # Compensate in reverse order
        for i in range(self.current_step, -1, -1):
            step = self.steps[i]
            
            if step.status == SagaStepStatus.COMPLETED:
                try:
                    logging.info(f"Saga {self.saga_id}: Compensating step {step.name}")
                    
                    await step.compensate(self.context)
                    step.status = SagaStepStatus.COMPENSATED
                    
                except Exception as e:
                    logging.error(f"Saga {self.saga_id}: Compensation failed for {step.name}: {e}")
                    # Continue compensating other steps even if one fails
        
        logging.info(f"Saga {self.saga_id}: Compensation completed")

class DistributedOrderService:
    def __init__(self, inventory_service, payment_service, order_service):
        self.inventory_service = inventory_service
        self.payment_service = payment_service
        self.order_service = order_service
        self.active_sagas = {}
    
    async def process_order(self, order_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process order using saga pattern"""
        
        saga_id = f"order_saga_{order_data['order_id']}"
        
        # Define saga steps
        steps = [
            OrderSagaSteps.ReserveInventoryStep(self.inventory_service),
            OrderSagaSteps.ProcessPaymentStep(self.payment_service),
            OrderSagaSteps.CreateOrderStep(self.order_service)
        ]
        
        # Create and execute saga
        saga = SagaOrchestrator(saga_id, steps)
        self.active_sagas[saga_id] = saga
        
        try:
            result = await saga.execute({'order': order_data})
            return result
        finally:
            # Cleanup
            self.active_sagas.pop(saga_id, None)
    
    async def get_saga_status(self, saga_id: str) -> Optional[Dict[str, Any]]:
        """Get current status of a saga"""
        saga = self.active_sagas.get(saga_id)
        if not saga:
            return None
        
        return {
            'saga_id': saga_id,
            'status': saga.status,
            'current_step': saga.current_step,
            'steps': [
                {
                    'name': step.name,
                    'status': step.status.value,
                    'error': step.error
                }
                for step in saga.steps
            ]
        }

# Usage example
async def main():
    # Mock services
    inventory_service = InventoryService()
    payment_service = PaymentService()
    order_service = OrderService()
    
    # Create distributed order service
    distributed_order_service = DistributedOrderService(
        inventory_service, payment_service, order_service
    )
    
    # Process order
    order_data = {
        'order_id': '12345',
        'items': [{'product_id': 'A', 'quantity': 2}],
        'payment_info': {'card_token': 'abc123'},
        'total_amount': 99.99
    }
    
    result = await distributed_order_service.process_order(order_data)
    print(f"Order processing result: {result}")
```

### Key Failure Handling Principles:

1. **Fail Fast**: Detect failures quickly và avoid wasting resources
2. **Isolation**: Prevent failures from cascading to other components
3. **Redundancy**: Have backup systems ready to take over
4. **Graceful Degradation**: Reduce functionality rather than complete failure
5. **Recovery**: Implement automated recovery mechanisms
6. **Monitoring**: Comprehensive observability để detect và diagnose issues
7. **Testing**: Regular chaos engineering và disaster recovery drills

---

*Post ID: 3g5pny0as489dh2*  
*Category: BackEnd Interview*  
*Created: 2/9/2025*  
*Updated: 2/9/2025*

---
title: "Git, Version Control & Concurrency - Backend Interview Questions"
postId: "8uh5x4ywmiyy5cj"
category: "BackEnd Interview"
created: "2/9/2025"
updated: "2/9/2025"
---

# Git, Version Control & Concurrency - Backend Interview Questions


## 49. Git rebase là gì?

**Trả lời:** Git rebase là process replay commits từ một branch lên base khác, tạo ra linear history thay vì merge commit.

### Cách hoạt động:

#### Before Rebase:
```
main:     A---B---C
               \
feature:        D---E---F
```

#### After Rebase:
```
main:     A---B---C---D'---E'---F'
```

### Basic Rebase:
```bash
# Switch to feature branch
git checkout feature-branch

# Rebase onto main
git rebase main

# Alternatively, do it in one command
git rebase main feature-branch
```

### Interactive Rebase:
```bash
# Interactive rebase last 3 commits
git rebase -i HEAD~3

# Editor opens với options:
pick abc123d Add user authentication
squash def456e Fix typo in auth
pick ghi789f Add password validation

# Options available:
# pick = use commit
# reword = use commit, but edit message  
# edit = use commit, but stop for amending
# squash = use commit, but meld into previous commit
# fixup = like squash, but discard commit message
# drop = remove commit
```

### Rebase vs Merge:

#### Merge approach:
```bash
git checkout main
git merge feature-branch

# Creates merge commit:
main: A---B---C---M (merge commit)
           \     /
feature:    D---E
```

#### Rebase approach:
```bash
git checkout feature-branch
git rebase main
git checkout main
git merge feature-branch  # Fast-forward merge

# Linear history:
main: A---B---C---D---E
```

### Advanced Rebase Operations:

#### 1. Rebase onto specific commit:
```bash
# Rebase feature branch onto specific commit
git rebase abc123def feature-branch
```

#### 2. Rebase subset of commits:
```bash
# Rebase commits from commit-A to commit-B onto main
git rebase --onto main commit-A commit-B
```

#### 3. Conflict resolution during rebase:
```bash
git rebase main

# If conflicts occur:
# 1. Fix conflicts in files
# 2. Stage resolved files
git add .

# 3. Continue rebase
git rebase --continue

# Or abort rebase
git rebase --abort
```

### When to use Rebase:

#### Good use cases:
- **Clean up local history** trước khi push
- **Update feature branch** với latest main changes
- **Squash commits** để create logical units
- **Remove unnecessary commits** từ history

#### Avoid rebase when:
- **Commits đã được pushed** và others có thể based work on them
- **Working on shared branch** với other developers
- **Unsure about git history** - merge is safer

### Rebase Best Practices:

#### 1. Golden Rule - Never rebase public history:
```bash
# BAD: Don't rebase commits that others might be using
git push origin feature-branch
git rebase main feature-branch  # Others may have based work on this!

# GOOD: Rebase before sharing
git rebase main feature-branch  
git push origin feature-branch  # First time pushing
```

#### 2. Clean up commits before sharing:
```bash
# Interactive rebase để clean history
git rebase -i HEAD~5

# Squash related commits
pick 1234567 Add user model
squash 2345678 Fix user model typo
squash 3456789 Add user model tests
pick 4567890 Add user controller
```

#### 3. Keep feature branches up to date:
```bash
# Regularly rebase feature branch
git checkout feature-branch
git rebase main

# Better than merge để avoid "merge commit noise"
```

### Rebase Advantages:
- **Linear history**: Easier to read và understand
- **Cleaner git log**: No unnecessary merge commits
- **Bisect friendly**: `git bisect` works better với linear history
- **Clear authorship**: Commits maintain original timestamps

### Rebase Disadvantages:
- **Rewrites history**: Can be dangerous if misused
- **Conflicts**: May need to resolve same conflicts multiple times
- **Learning curve**: More complex than merge
- **Lost context**: Merge commits show integration points

\---

## 50. Tại sao Git merge dễ hơn SVN?

**Trả lời:** Git merge operations are fundamentally easier than SVN merging due to Git's superior architecture và merge algorithms.

### Git's Content-Tracking Advantage:

#### Git tracks content changes:
```bash
# Git understands what changed, not just which files
git log --follow filename.js  # Tracks file even when renamed
git blame filename.js         # Shows line-by-line history
git show commit_hash         # Shows exact content changes
```

#### SVN tracks file versions:
```bash
# SVN tracks file states, not content relationships
svn log filename.js      # Only shows commits affecting this file
svn blame filename.js    # Less accurate change tracking
```

### Three-Way Merge Algorithm:

#### Git's sophisticated merging:
```bash
# Git uses three-way merge algorithm
# Compares: common ancestor + branch A + branch B

# Example merge scenario:
Common Ancestor:  def calculate(a, b): return a + b
Branch A:         def calculate(a, b): return a + b + 1  
Branch B:         def calculate(x, y): return x + y

# Git can often auto-merge: def calculate(x, y): return x + y + 1
```

#### SVN's simpler approach:
```bash
# SVN primarily does text-based merges
# More likely to create conflicts requiring manual resolution
```

### Distributed Nature Benefits:

#### Git's local merge capabilities:
```bash
# All merging happens locally với full history
git merge feature-branch        # Fast, complete information
git mergetool                   # Rich conflict resolution tools
git log --merge                 # See conflicting commits
git show :1:filename.js         # See common ancestor version
git show :2:filename.js         # See current branch version  
git show :3:filename.js         # See merging branch version
```

#### SVN's server dependency:
```bash
# SVN merging often requires server communication
svn merge ^/branches/feature-branch
# Limited information about merge history
# Slower due to network operations
```

### Merge History Tracking:

#### Git's superior tracking:
```bash
# Git maintains detailed merge history
git log --graph --oneline --all
# Shows branch relationships và merge points

git log --first-parent main
# Shows only main branch commits (ignores merged commits)

git show-branch
# Visualizes branch relationships
```

#### SVN's limited tracking:
```bash
# SVN merge info is stored as properties
svn propget svn:mergeinfo
# Less intuitive, harder to visualize branch relationships
```

### Conflict Resolution:

#### Git's advanced tools:
```bash
# Multiple merge strategies available
git merge -X ours feature-branch     # Prefer our changes
git merge -X theirs feature-branch   # Prefer their changes
git merge --no-ff feature-branch     # Force merge commit

# Rich conflict resolution
git mergetool --tool=vimdiff
git checkout --ours filename.js      # Take our version
git checkout --theirs filename.js    # Take their version
```

#### SVN's basic resolution:
```bash
# Limited merge strategies
svn resolve --accept working filename.js
svn resolve --accept theirs-full filename.js
# Less sophisticated conflict resolution tools
```

### Branch Integration:

#### Git's flexible integration:
```bash
# Multiple integration strategies
git merge feature-branch          # Standard merge
git rebase feature-branch         # Rewrite history
git cherry-pick commit_hash       # Select specific commits
git merge --squash feature-branch # Combine all commits into one
```

#### SVN's limited options:
```bash
# Primarily one merge approach
svn merge ^/branches/feature-branch
# Less flexibility in how changes are integrated
```

### Example Comparison:

#### Git merge workflow:
```bash
# Create and work on feature branch
git checkout -b feature/payment-system
git commit -m "Add payment model"
git commit -m "Add payment validation"

# Switch to main and merge
git checkout main
git pull origin main               # Update main branch
git merge feature/payment-system   # Clean merge operation

# If conflicts:
git mergetool                      # Powerful resolution tools
git commit                         # Complete merge
```

#### SVN merge workflow:
```bash
# Work on branch
svn switch ^/branches/feature-payment
svn commit -m "Add payment model"  
svn commit -m "Add payment validation"

# Merge to trunk
svn switch ^/trunk
svn update                         # Get latest trunk changes
svn merge ^/branches/feature-payment  # May require server round-trips

# If conflicts:
svn resolve                        # Basic resolution
svn commit -m "Merge feature branch"  # More manual process
```

### Key Advantages of Git Merging:

1. **Speed**: Local operations, no network latency
2. **Intelligence**: Content-aware merging algorithms  
3. **Flexibility**: Multiple merge strategies available
4. **History**: Rich merge history tracking
5. **Tooling**: Advanced conflict resolution tools
6. **Offline**: Can merge without network connection
7. **Safety**: Easy to abort và retry merges

### Why This Matters:
- **Developer productivity**: Less time spent on merge conflicts
- **Code quality**: Better merge results with fewer errors
- **Team collaboration**: Easier integration of parallel work
- **Project velocity**: Faster development cycles
- **Confidence**: Developers more willing to create branches

\---

## 51. Tại sao cần concurrency?

**Trả lời:** Concurrency is essential trong modern software systems để achieve better performance, responsiveness, và resource utilization.

### Core Reasons for Concurrency:

#### 1. Performance & Throughput:
```python
# Sequential processing - slow
def process_orders_sequential(orders):
    results = []
    for order in orders:
        # Each order takes 100ms to process
        result = process_single_order(order)  # Blocking operation
        results.append(result)
    return results

# Time: 100ms * 1000 orders = 100 seconds

# Concurrent processing - fast  
import concurrent.futures

def process_orders_concurrent(orders):
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        futures = [executor.submit(process_single_order, order) for order in orders]
        results = [future.result() for future in futures]
    return results

# Time: ~10 seconds với 10 concurrent threads
```

#### 2. Resource Utilization:
```javascript
// Without concurrency - CPU idle during I/O
async function fetchUserDataSequential(userIds) {
    const users = [];
    for (const id of userIds) {
        // CPU idle while waiting for database
        const user = await database.findUser(id);  // 50ms I/O wait
        users.push(user);
    }
    return users;
}

// With concurrency - CPU busy while I/O happens
async function fetchUserDataConcurrent(userIds) {
    // All database requests start immediately
    const promises = userIds.map(id => database.findUser(id));
    const users = await Promise.all(promises);
    return users;
}
```

#### 3. Responsiveness:
```java
// Web server handling multiple requests
public class WebServer {
    public void handleRequest(HttpRequest request) {
        // Without concurrency - other requests wait
        String result = processLongRunningTask(request); // 5 seconds
        sendResponse(result);
    }
    
    // With concurrency - requests handled simultaneously
    public void handleRequestConcurrent(HttpRequest request) {
        CompletableFuture.supplyAsync(() -> {
            return processLongRunningTask(request);
        }).thenAccept(result -> {
            sendResponse(result);
        });
    }
}
```

### Modern System Requirements:

#### 1. Multi-core Hardware:
```cpp
// Single-threaded program only uses 1 core
void calculatePrimesSequential(int n) {
    for (int i = 2; i <= n; i++) {
        if (isPrime(i)) {
            primes.push_back(i);
        }
    }
}

// Multi-threaded program utilizes all cores
void calculatePrimesConcurrent(int n) {
    int numThreads = std::thread::hardware_concurrency(); // 8 cores
    std::vector<std::thread> threads;
    
    int range = n / numThreads;
    for (int t = 0; t < numThreads; t++) {
        int start = t * range + 2;
        int end = (t == numThreads - 1) ? n : (t + 1) * range + 1;
        
        threads.emplace_back([start, end]() {
            for (int i = start; i <= end; i++) {
                if (isPrime(i)) {
                    std::lock_guard<std::mutex> lock(primes_mutex);
                    primes.push_back(i);
                }
            }
        });
    }
    
    for (auto& t : threads) {
        t.join();
    }
}
```

#### 2. I/O Bound Operations:
```python
# Network requests, file operations, database queries
import asyncio
import aiohttp

async def fetch_data_from_apis():
    urls = [
        'https://api1.example.com/data',
        'https://api2.example.com/data', 
        'https://api3.example.com/data'
    ]
    
    async with aiohttp.ClientSession() as session:
        # All requests execute concurrently
        tasks = [session.get(url) for url in urls]
        responses = await asyncio.gather(*tasks)
        return responses

# Instead of 3 * 200ms = 600ms sequential
# Takes ~200ms concurrent (limited by slowest request)
```

### User Experience Benefits:

#### 1. Non-blocking UI:
```javascript
// Bad - UI freezes during calculation
function calculateHeavyTask() {
    // This blocks UI for 5 seconds
    for (let i = 0; i < 1000000000; i++) {
        // Heavy computation
    }
    updateUI(result);
}

// Good - UI remains responsive
function calculateHeavyTaskAsync() {
    // Use Web Worker or async processing
    setTimeout(() => {
        const result = heavyComputation();
        updateUI(result);
    }, 0);
    
    // Or better, use Web Workers
    const worker = new Worker('heavy-calculation-worker.js');
    worker.postMessage({ task: 'calculate' });
    worker.onmessage = (event) => {
        updateUI(event.data.result);
    };
}
```

#### 2. Parallel Data Processing:
```python
# Image processing pipeline
import concurrent.futures
from PIL import Image

def process_images_concurrent(image_paths):
    def process_single_image(path):
        img = Image.open(path)
        img = img.resize((800, 600))          # Resize
        img = img.convert('L')                # Grayscale
        img = apply_filters(img)              # Custom filters
        img.save(f"processed_{path}")
        return f"Processed {path}"
    
    # Process multiple images simultaneously
    with concurrent.futures.ProcessPoolExecutor() as executor:
        results = list(executor.map(process_single_image, image_paths))
    
    return results
```

### System Scalability:

#### 1. Server Applications:
```go
// Go web server handling concurrent requests
func main() {
    http.HandleFunc("/api/users", func(w http.ResponseWriter, r *http.Request) {
        // Each request runs in separate goroutine
        go handleUserRequest(w, r)
    })
    
    log.Fatal(http.ListenAndServe(":8080", nil))
}

func handleUserRequest(w http.ResponseWriter, r *http.Request) {
    // Can handle thousands of concurrent requests
    user := fetchUserFromDatabase(r.URL.Query().Get("id"))
    json.NewEncoder(w).Encode(user)
}
```

#### 2. Background Processing:
```python
# Task queue processing
import threading
import queue

class TaskProcessor:
    def __init__(self, num_workers=5):
        self.task_queue = queue.Queue()
        self.workers = []
        
        # Start worker threads
        for i in range(num_workers):
            worker = threading.Thread(target=self.worker)
            worker.daemon = True
            worker.start()
            self.workers.append(worker)
    
    def worker(self):
        while True:
            task = self.task_queue.get()
            if task is None:
                break
            
            # Process task concurrently
            self.process_task(task)
            self.task_queue.task_done()
    
    def add_task(self, task):
        self.task_queue.put(task)
```

### Modern Concurrency Patterns:

#### 1. Actor Model:
```erlang
% Erlang/OTP actor-based concurrency
start_user_manager() ->
    spawn(fun() -> user_manager_loop([]) end).

user_manager_loop(Users) ->
    receive
        {add_user, User} ->
            NewUsers = [User | Users],
            user_manager_loop(NewUsers);
        {get_users, From} ->
            From ! {users, Users},
            user_manager_loop(Users)
    end.
```

#### 2. Reactive Streams:
```java
// RxJava reactive programming
Observable.fromIterable(userIds)
    .flatMap(id -> userService.fetchUser(id)) // Concurrent API calls
    .filter(user -> user.isActive())
    .map(user -> user.getName())
    .subscribe(name -> System.out.println(name));
```

### Business Impact:
- **Cost savings**: Better hardware utilization
- **User satisfaction**: Faster response times
- **Scalability**: Handle more users simultaneously
- **Competitive advantage**: Better performing applications
- **Resource efficiency**: Do more with less hardware

\---

## 52. Test concurrent code khó vì sao?

**Trả lời:** Testing concurrent code is notoriously difficult due to several inherent characteristics of multi-threaded và parallel systems.

### 1. Non-deterministic Behavior:

#### Unpredictable Execution Order:
```java
public class CounterTest {
    private int counter = 0;
    
    // This test might pass 99% of the time, fail 1%
    @Test
    public void testConcurrentIncrement() throws InterruptedException {
        int numThreads = 10;
        int incrementsPerThread = 1000;
        ExecutorService executor = Executors.newFixedThreadPool(numThreads);
        
        for (int i = 0; i < numThreads; i++) {
            executor.submit(() -> {
                for (int j = 0; j < incrementsPerThread; j++) {
                    counter++;  // Race condition!
                }
            });
        }
        
        executor.shutdown();
        executor.awaitTermination(1, TimeUnit.SECONDS);
        
        // Expected: 10,000, Actual: varies (7,234, 8,901, 9,456...)
        assertEquals(10000, counter);
    }
}
```

#### Timing Dependencies:
```python
import threading
import time
import unittest

class TimingDependentTest(unittest.TestCase):
    def test_producer_consumer(self):
        items = []
        
        def producer():
            time.sleep(0.1)  # Simulated work
            items.append("item1")
            
        def consumer():
            time.sleep(0.05)  # Different timing
            # This might fail if consumer runs before producer
            self.assertEqual(len(items), 1)
        
        producer_thread = threading.Thread(target=producer)
        consumer_thread = threading.Thread(target=consumer)
        
        producer_thread.start()
        consumer_thread.start()
        
        producer_thread.join()
        consumer_thread.join()
```

### 2. Race Conditions:

#### Shared State Corruption:
```cpp
class BankAccount {
private:
    int balance = 1000;
    
public:
    void withdraw(int amount) {
        // Race condition: multiple threads can read same balance
        if (balance >= amount) {        // Thread A reads balance = 1000
                                       // Thread B reads balance = 1000  
            std::this_thread::sleep_for(std::chrono::milliseconds(1));
            balance -= amount;          // Thread A: balance = 500
                                       // Thread B: balance = 0 (should be -500!)
        }
    }
    
    int getBalance() { return balance; }
};

// Test might inconsistently fail
TEST(BankAccountTest, ConcurrentWithdrawals) {
    BankAccount account;
    
    std::thread t1([&]() { account.withdraw(600); });
    std::thread t2([&]() { account.withdraw(600); });
    
    t1.join();
    t2.join();
    
    // Balance could be 400, -200, or other unexpected values
    EXPECT_GE(account.getBalance(), 0);
}
```

### 3. Hard to Reproduce Bugs:

#### Heisenbug Phenomenon:
```javascript
// Bug that disappears when you try to debug it
class DataProcessor {
    constructor() {
        this.data = [];
        this.processing = false;
    }
    
    async addData(item) {
        if (!this.processing) {
            this.processing = true;
            this.data.push(item);
            
            // Adding console.log here might change timing enough 
            // to make race condition disappear!
            // console.log('Processing:', item);
            
            await this.processData();
            this.processing = false;
        }
    }
    
    async processData() {
        // Complex async processing
        return new Promise(resolve => setTimeout(resolve, Math.random() * 10));
    }
}

// Test fails sporadically
test('concurrent data processing', async () => {
    const processor = new DataProcessor();
    
    // Multiple concurrent calls might cause race condition
    const promises = Array.from({length: 100}, (_, i) => 
        processor.addData(`item${i}`)
    );
    
    await Promise.all(promises);
    
    // Sometimes passes, sometimes fails
    expect(processor.data.length).toBe(100);
});
```

### 4. Complex Debugging:

#### Deadlock Detection:
```java
public class DeadlockExample {
    private final Object lock1 = new Object();
    private final Object lock2 = new Object();
    
    public void method1() {
        synchronized(lock1) {
            Thread.sleep(10);  // Give other thread chance to acquire lock2
            synchronized(lock2) {
                // Do work
            }
        }
    }
    
    public void method2() {
        synchronized(lock2) {
            Thread.sleep(10);  // Give other thread chance to acquire lock1
            synchronized(lock1) {
                // Do work  
            }
        }
    }
}

// Test might hang indefinitely
@Test(timeout = 5000)  // Timeout needed to prevent infinite wait
public void testDeadlock() throws InterruptedException {
    DeadlockExample example = new DeadlockExample();
    
    Thread t1 = new Thread(() -> example.method1());
    Thread t2 = new Thread(() -> example.method2());
    
    t1.start();
    t2.start();
    
    t1.join();  // Might never return due to deadlock
    t2.join();
}
```

### 5. State Verification Challenges:

#### Intermediate State Observation:
```python
import threading
import time

class OrderProcessor:
    def __init__(self):
        self.orders = []
        self.processed_orders = []
        self.lock = threading.Lock()
    
    def process_order(self, order):
        with self.lock:
            self.orders.append(order)
        
        # Processing happens outside lock
        processed = self.complex_processing(order)
        
        with self.lock:
            self.processed_orders.append(processed)
            self.orders.remove(order)
    
    def get_stats(self):
        with self.lock:
            return {
                'pending': len(self.orders),
                'processed': len(self.processed_orders)
            }

# Test verification is challenging
def test_concurrent_processing():
    processor = OrderProcessor()
    orders = [f"order_{i}" for i in range(100)]
    
    threads = []
    for order in orders:
        thread = threading.Thread(target=processor.process_order, args=(order,))
        threads.append(thread)
        thread.start()
    
    # When to check stats? State is constantly changing
    time.sleep(0.1)  # Arbitrary wait
    stats = processor.get_stats()
    
    # What should we assert? State is in flux
    # pending + processed might not equal 100 at any given moment
    assert stats['pending'] + stats['processed'] <= 100
```

### 6. Testing Strategies & Solutions:

#### 1. Deterministic Testing với Controlled Scheduling:
```java
// Using CountDownLatch to control execution order
@Test
public void testOrderedExecution() throws InterruptedException {
    CountDownLatch startSignal = new CountDownLatch(1);
    CountDownLatch doneSignal = new CountDownLatch(2);
    
    AtomicInteger counter = new AtomicInteger(0);
    
    // First thread
    new Thread(() -> {
        try {
            startSignal.await();  // Wait for signal
            counter.incrementAndGet();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        } finally {
            doneSignal.countDown();
        }
    }).start();
    
    // Second thread  
    new Thread(() -> {
        try {
            startSignal.await();  // Wait for signal
            counter.incrementAndGet();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        } finally {
            doneSignal.countDown();
        }
    }).start();
    
    startSignal.countDown();  // Release both threads
    doneSignal.await();       // Wait for completion
    
    assertEquals(2, counter.get());
}
```

#### 2. Property-Based Testing:
```scala
// ScalaCheck property-based testing
import org.scalacheck._

class ConcurrentSetTest extends Properties("ConcurrentSet") {
    property("concurrent adds") = forAll { (items: List[Int]) =>
        val set = new ConcurrentHashMap[Int, Boolean]()
        
        // Add items concurrently
        val futures = items.map { item =>
            Future { set.put(item, true) }
        }
        
        Await.ready(Future.sequence(futures), 10.seconds)
        
        // Property: all items should be present
        items.forall(item => set.containsKey(item))
    }
}
```

#### 3. Load Testing:
```python
import concurrent.futures
import time

def test_thread_safety_under_load():
    shared_counter = ThreadSafeCounter()  # Implementation under test
    
    def increment_worker():
        for _ in range(1000):
            shared_counter.increment()
    
    # High load test
    with concurrent.futures.ThreadPoolExecutor(max_workers=50) as executor:
        futures = [executor.submit(increment_worker) for _ in range(50)]
        concurrent.futures.wait(futures)
    
    # With proper synchronization, should always be 50,000
    assert shared_counter.value == 50000
```

### Testing Tools & Approaches:

- **Thread safety analyzers**: FindBugs, SpotBugs
- **Stress testing**: JCStress, ThreadSanitizer  
- **Formal verification**: TLA+, Spin model checker
- **Chaos testing**: Randomly introduce delays và failures
- **Deterministic replay**: Record và replay executions

### Key Takeaways:
- **Design for testability**: Minimize shared mutable state
- **Use proven concurrency primitives**: java.util.concurrent, async/await
- **Test different scenarios**: Light load, heavy load, edge cases
- **Automate**: Run concurrent tests many times
- **Monitor production**: Logging, metrics, crash reports

\---

## 53. Race Condition là gì?

**Trả lời:** Race Condition xảy ra khi multiple threads hoặc processes access shared resources simultaneously và outcome phụ thuộc vào timing hoặc ordering của executions.

### Định nghĩa và Đặc điểm:

#### Core Concept:
- **Shared resource**: Multiple threads access cùng data/resource
- **Non-atomic operations**: Operations không complete trong single step
- **Timing dependent**: Results vary based on execution timing
- **Unpredictable**: Same code có thể produce different results

### Classic Examples:

#### 1. Counter Race Condition:
```java
public class UnsafeCounter {
    private int count = 0;
    
    public void increment() {
        // This looks like one operation, but it's actually three:
        // 1. Read current value of count
        // 2. Add 1 to the value  
        // 3. Write new value back to count
        count++;
    }
    
    public int getCount() {
        return count;
    }
}

// Race condition scenario:
// Thread A reads count = 5
// Thread B reads count = 5 (before A writes back)
// Thread A writes count = 6
// Thread B writes count = 6 (should be 7!)
```

#### Execution Timeline:
```
Time | Thread A          | Thread B          | count value
-----|-------------------|-------------------|------------
  1  | read count (5)    |                   | 5
  2  |                   | read count (5)    | 5  
  3  | calculate 5+1=6   |                   | 5
  4  |                   | calculate 5+1=6   | 5
  5  | write count=6     |                   | 6
  6  |                   | write count=6     | 6 (Lost increment!)
```

#### 2. Bank Account Race Condition:
```python
class BankAccount:
    def __init__(self, initial_balance=0):
        self.balance = initial_balance
    
    def withdraw(self, amount):
        # Race condition here!
        if self.balance >= amount:          # Check
            time.sleep(0.001)               # Simulate processing delay
            self.balance -= amount          # Update
            return True
        return False

# Problematic scenario:
account = BankAccount(1000)

def thread_a():
    account.withdraw(800)  # Should succeed

def thread_b():  
    account.withdraw(800)  # Should fail, but might succeed due to race

# Both threads might see balance=1000 và both withdraw 800
# Final balance could be -600 instead of 200!
```

#### 3. File Writing Race Condition:
```cpp
#include <fstream>
#include <thread>

class Logger {
private:
    std::string filename;
    
public:
    Logger(const std::string& file) : filename(file) {}
    
    void log(const std::string& message) {
        // Race condition: multiple threads writing to same file
        std::ofstream file(filename, std::ios::app);
        
        // These operations are not atomic:
        file << "[" << getCurrentTime() << "] ";  // Thread A writes timestamp
                                                  // Thread B interrupts here!
        file << message << std::endl;             // Thread A writes message
                                                  // Result: corrupted log entries
    }
};

// Possible corrupted output:
// [2024-01-15 10:30:00] [2024-01-15 10:30:00] User loginError processing payment
```

### Types of Race Conditions:

#### 1. Check-Then-Act Race Condition:
```javascript
// Singleton pattern với race condition
class Singleton {
    static instance = null;
    
    static getInstance() {
        if (Singleton.instance === null) {        // Check
            // Multiple threads can pass this check!
            Singleton.instance = new Singleton();  // Act
        }
        return Singleton.instance;
    }
}

// Two threads might create two instances!
```

#### 2. Read-Modify-Write Race Condition:
```go
package main

import (
    "fmt"
    "sync"
)

var counter = 0

func increment() {
    temp := counter    // Read
    temp = temp + 1    // Modify  
    counter = temp     // Write
    // Another thread can interfere at any point!
}

func main() {
    var wg sync.WaitGroup
    
    // Start 1000 goroutines
    for i := 0; i < 1000; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            increment()
        }()
    }
    
    wg.Wait()
    fmt.Printf("Counter: %d\n", counter)  // Probably not 1000!
}
```

### Real-World Race Condition Examples:

#### 1. Web Session Management:
```python
# Session storage race condition
class SessionManager:
    def __init__(self):
        self.sessions = {}
    
    def create_session(self, user_id):
        session_id = generate_session_id()
        
        # Race condition: check and create not atomic
        if session_id not in self.sessions:
            # Another thread might create same session_id here!
            self.sessions[session_id] = {
                'user_id': user_id,
                'created_at': time.time()
            }
        
        return session_id
```

#### 2. Database Connection Pool:
```java
public class ConnectionPool {
    private List<Connection> availableConnections;
    private List<Connection> usedConnections;
    
    public Connection getConnection() {
        if (!availableConnections.isEmpty()) {
            // Race condition: size check và removal not atomic
            Connection conn = availableConnections.remove(0);  // Thread A gets connection
                                                              // Thread B might get same connection!
            usedConnections.add(conn);
            return conn;
        }
        return null;
    }
}
```

### Solutions và Prevention:

#### 1. Synchronization với Locks:
```java
public class SafeCounter {
    private int count = 0;
    private final Object lock = new Object();
    
    public void increment() {
        synchronized(lock) {
            count++;  // Atomic operation within synchronized block
        }
    }
    
    public int getCount() {
        synchronized(lock) {
            return count;
        }
    }
}
```

#### 2. Atomic Operations:
```java
import java.util.concurrent.atomic.AtomicInteger;

public class AtomicCounter {
    private AtomicInteger count = new AtomicInteger(0);
    
    public void increment() {
        count.incrementAndGet();  // Atomic operation
    }
    
    public int getCount() {
        return count.get();
    }
}
```

#### 3. Thread-Safe Data Structures:
```python
import threading
from collections import deque

class ThreadSafeQueue:
    def __init__(self):
        self.queue = deque()
        self.lock = threading.Lock()
    
    def put(self, item):
        with self.lock:
            self.queue.append(item)
    
    def get(self):
        with self.lock:
            if self.queue:
                return self.queue.popleft()
            return None
```

#### 4. Compare-and-Swap (CAS):
```cpp
#include <atomic>

class LockFreeCounter {
private:
    std::atomic<int> count{0};
    
public:
    void increment() {
        int expected = count.load();
        int desired;
        
        do {
            desired = expected + 1;
            // Keep trying until successful
        } while (!count.compare_exchange_weak(expected, desired));
    }
    
    int get() const {
        return count.load();
    }
};
```

### Detection và Debugging:

#### 1. Testing Strategies:
```python
import threading
import time
import random

def test_race_condition():
    counter = UnsafeCounter()
    
    def worker():
        for _ in range(1000):
            counter.increment()
            # Add random delay to increase race condition probability
            time.sleep(random.uniform(0, 0.001))
    
    threads = []
    for _ in range(10):
        thread = threading.Thread(target=worker)
        threads.append(thread)
        thread.start()
    
    for thread in threads:
        thread.join()
    
    expected = 10000
    actual = counter.get_count()
    
    if actual != expected:
        print(f"Race condition detected! Expected: {expected}, Actual: {actual}")
```

#### 2. Static Analysis Tools:
- **ThreadSanitizer**: Detects data races at runtime
- **Helgrind**: Valgrind tool for race condition detection
- **FindBugs/SpotBugs**: Static analysis for Java
- **Clang Static Analyzer**: For C/C++

### Best Practices:
- **Minimize shared state**: Reduce opportunities for race conditions
- **Use thread-safe collections**: ConcurrentHashMap, BlockingQueue
- **Prefer immutable objects**: Cannot be modified, hence thread-safe
- **Design for single-threaded logic**: Use message passing instead của shared state
- **Test thoroughly**: Use stress testing và automated race condition detection tools

\---

## 54. Deadlock là gì?

**Trả lời:** Deadlock là situation trong concurrent programming khi two or more threads bị blocked indefinitely, waiting for each other để release resources mà they need.

### Định nghĩa và Conditions:

#### Coffman Conditions (4 điều kiện cho deadlock):

1. **Mutual Exclusion**: Resources cannot be shared
2. **Hold and Wait**: Threads hold resources while waiting for others  
3. **No Preemption**: Resources cannot be forcibly taken away
4. **Circular Wait**: Circular chain of threads waiting for resources

### Classic Deadlock Example:

#### Two-Lock Deadlock:
```java
public class DeadlockExample {
    private final Object lock1 = new Object();
    private final Object lock2 = new Object();
    
    public void method1() {
        synchronized(lock1) {                    // Thread A acquires lock1
            System.out.println("Thread A: Got lock1");
            
            try { Thread.sleep(100); } catch (InterruptedException e) {}
            
            synchronized(lock2) {                // Thread A waits for lock2 (held by B)
                System.out.println("Thread A: Got lock2");
            }
        }
    }
    
    public void method2() {
        synchronized(lock2) {                    // Thread B acquires lock2
            System.out.println("Thread B: Got lock2");
            
            try { Thread.sleep(100); } catch (InterruptedException e) {}
            
            synchronized(lock1) {                // Thread B waits for lock1 (held by A)
                System.out.println("Thread B: Got lock1");
            }
        }
    }
}

// Execution scenario:
// Time 1: Thread A gets lock1, Thread B gets lock2
// Time 2: Thread A waits for lock2, Thread B waits for lock1  
// Result: Both threads blocked forever!
```

#### Deadlock State Diagram:
```
Thread A: lock1 ──┐              ┌── lock1 :Thread B
                  │   DEADLOCK   │
                  └── lock2 ────► └── lock2
```

### Real-World Deadlock Scenarios:

#### 1. Database Deadlock:
```sql
-- Transaction 1
BEGIN TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;  -- Locks account 1
-- ... some delay ...
UPDATE accounts SET balance = balance + 100 WHERE id = 2;  -- Waits for account 2
COMMIT;

-- Transaction 2 (running simultaneously)
BEGIN TRANSACTION;  
UPDATE accounts SET balance = balance - 50 WHERE id = 2;   -- Locks account 2
-- ... some delay ...
UPDATE accounts SET balance = balance + 50 WHERE id = 1;   -- Waits for account 1  
COMMIT;

-- Result: Both transactions wait for each other indefinitely
```

#### 2. File Locking Deadlock:
```python
import threading
import time

class FileManager:
    def __init__(self):
        self.file1_lock = threading.Lock()
        self.file2_lock = threading.Lock()
    
    def copy_file1_to_file2(self):
        print("Process A: Acquiring file1 lock...")
        with self.file1_lock:
            print("Process A: Got file1 lock")
            time.sleep(0.1)  # Simulate file read
            
            print("Process A: Acquiring file2 lock...")
            with self.file2_lock:  # Deadlock potential here!
                print("Process A: Writing to file2")
    
    def copy_file2_to_file1(self):
        print("Process B: Acquiring file2 lock...")
        with self.file2_lock:
            print("Process B: Got file2 lock")  
            time.sleep(0.1)  # Simulate file read
            
            print("Process B: Acquiring file1 lock...")
            with self.file1_lock:  # Deadlock potential here!
                print("Process B: Writing to file1")

# Two threads calling these methods can deadlock
```

#### 3. Network Resource Deadlock:
```go
package main

import (
    "fmt"
    "sync"
    "time"
)

type Server struct {
    mu1 sync.Mutex
    mu2 sync.Mutex
}

func (s *Server) handleRequestA() {
    s.mu1.Lock()                    // Server locks database connection
    fmt.Println("Service A: Got database lock")
    
    time.Sleep(100 * time.Millisecond)
    
    s.mu2.Lock()                    // Server waits for cache lock
    fmt.Println("Service A: Got cache lock")
    s.mu2.Unlock()
    s.mu1.Unlock()
}

func (s *Server) handleRequestB() {
    s.mu2.Lock()                    // Server locks cache connection  
    fmt.Println("Service B: Got cache lock")
    
    time.Sleep(100 * time.Millisecond)
    
    s.mu1.Lock()                    // Server waits for database lock
    fmt.Println("Service B: Got database lock")
    s.mu1.Unlock() 
    s.mu2.Unlock()
}
```

### Complex Deadlock Scenarios:

#### 1. Circular Dependency Deadlock:
```java
// Three threads, three resources - circular wait
public class CircularDeadlock {
    private Object resourceA = new Object();
    private Object resourceB = new Object(); 
    private Object resourceC = new Object();
    
    public void thread1Work() {
        synchronized(resourceA) {           // Thread 1: A → B
            synchronized(resourceB) {
                // Work here
            }
        }
    }
    
    public void thread2Work() {
        synchronized(resourceB) {           // Thread 2: B → C
            synchronized(resourceC) {
                // Work here  
            }
        }
    }
    
    public void thread3Work() {
        synchronized(resourceC) {           // Thread 3: C → A  
            synchronized(resourceA) {
                // Work here
            }
        }
    }
}
// Circular dependency: Thread1 → Thread2 → Thread3 → Thread1
```

#### 2. Reader-Writer Deadlock:
```cpp
#include <shared_mutex>
#include <thread>

class DataStore {
private:
    std::shared_mutex rw_mutex1;
    std::shared_mutex rw_mutex2;
    
public:
    void reader1() {
        std::shared_lock<std::shared_mutex> lock1(rw_mutex1);
        std::this_thread::sleep_for(std::chrono::milliseconds(100));
        std::shared_lock<std::shared_mutex> lock2(rw_mutex2);  // Might deadlock
        // Read data
    }
    
    void reader2() {
        std::shared_lock<std::shared_mutex> lock2(rw_mutex2);
        std::this_thread::sleep_for(std::chrono::milliseconds(100));
        std::unique_lock<std::shared_mutex> lock1(rw_mutex1); // Writer lock - deadlock!
        // Read and modify data
    }
};
```

### Deadlock Prevention Strategies:

#### 1. Lock Ordering:
```java
// Always acquire locks trong same order
public class OrderedLocking {
    private final Object lock1 = new Object();
    private final Object lock2 = new Object();
    
    public void method1() {
        synchronized(lock1) {        // Always lock1 first
            synchronized(lock2) {    // Then lock2
                // Safe operations
            }
        }
    }
    
    public void method2() {
        synchronized(lock1) {        // Same order: lock1 first
            synchronized(lock2) {    // Then lock2  
                // Safe operations
            }
        }
    }
}
```

#### 2. Timeout-based Locking:
```java
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class TimeoutLocking {
    private Lock lock1 = new ReentrantLock();
    private Lock lock2 = new ReentrantLock();
    
    public boolean transferFunds() {
        boolean acquired1 = false, acquired2 = false;
        
        try {
            acquired1 = lock1.tryLock(1, TimeUnit.SECONDS);
            if (!acquired1) return false;
            
            acquired2 = lock2.tryLock(1, TimeUnit.SECONDS);  
            if (!acquired2) return false;
            
            // Perform transfer
            return true;
            
        } catch (InterruptedException e) {
            return false;
        } finally {
            if (acquired2) lock2.unlock();
            if (acquired1) lock1.unlock();
        }
    }
}
```

#### 3. Banker's Algorithm (Resource Allocation):
```python
class BankersAlgorithm:
    def __init__(self, processes, resources, allocation, max_need):
        self.processes = processes
        self.resources = resources
        self.allocation = allocation
        self.max_need = max_need
        self.available = [total - sum(allocation[i][j] for i in range(processes)) 
                         for j in range(resources)]
    
    def is_safe_state(self):
        work = self.available[:]
        finish = [False] * self.processes
        safe_sequence = []
        
        while len(safe_sequence) < self.processes:
            found = False
            for i in range(self.processes):
                if not finish[i]:
                    need = [self.max_need[i][j] - self.allocation[i][j] 
                           for j in range(self.resources)]
                    
                    if all(need[j] <= work[j] for j in range(self.resources)):
                        # Process can complete
                        for j in range(self.resources):
                            work[j] += self.allocation[i][j]
                        finish[i] = True
                        safe_sequence.append(i)
                        found = True
                        break
            
            if not found:
                return False, []  # Deadlock possible
        
        return True, safe_sequence
```

### Deadlock Detection:

#### 1. Wait-for Graph:
```python
class DeadlockDetector:
    def __init__(self):
        self.wait_for_graph = {}  # process -> [list of processes it waits for]
    
    def add_wait_relationship(self, waiting_process, holding_process):
        if waiting_process not in self.wait_for_graph:
            self.wait_for_graph[waiting_process] = []
        self.wait_for_graph[waiting_process].append(holding_process)
    
    def has_cycle(self):
        visited = set()
        rec_stack = set()
        
        for node in self.wait_for_graph:
            if node not in visited:
                if self._has_cycle_util(node, visited, rec_stack):
                    return True
        return False
    
    def _has_cycle_util(self, node, visited, rec_stack):
        visited.add(node)
        rec_stack.add(node)
        
        for neighbor in self.wait_for_graph.get(node, []):
            if neighbor not in visited:
                if self._has_cycle_util(neighbor, visited, rec_stack):
                    return True
            elif neighbor in rec_stack:
                return True  # Cycle found!
        
        rec_stack.remove(node)
        return False
```

#### 2. Resource Allocation Graph:
```
Process P1 ──requests──► Resource R1
     ▲                      │
     │                      │
  allocated              allocated
     │                      ▼
Resource R2 ◄──requests── Process P2

# Cycle detected: P1 → R1 → P2 → R2 → P1 = Deadlock!
```

### Recovery Strategies:

#### 1. Process Termination:
- **Abort all deadlocked processes**: Drastic but effective
- **Abort one process at a time**: Until deadlock cycle is eliminated

#### 2. Resource Preemption:
- **Select a victim**: Choose process to preempt resources from
- **Rollback**: Return process to safe state
- **Prevent starvation**: Ensure same process isn't always chosen

### Modern Approaches:

#### 1. Lock-Free Programming:
```java
import java.util.concurrent.atomic.AtomicReference;

public class LockFreeStack<T> {
    private AtomicReference<Node<T>> head = new AtomicReference<>();
    
    public void push(T item) {
        Node<T> newNode = new Node<>(item);
        Node<T> currentHead;
        
        do {
            currentHead = head.get();
            newNode.next = currentHead;
        } while (!head.compareAndSet(currentHead, newNode));
    }
    
    public T pop() {
        Node<T> currentHead;
        Node<T> newHead;
        
        do {
            currentHead = head.get();
            if (currentHead == null) return null;
            newHead = currentHead.next;
        } while (!head.compareAndSet(currentHead, newHead));
        
        return currentHead.data;
    }
}
```

#### 2. Actor Model:
```scala
import akka.actor.{Actor, ActorRef, ActorSystem, Props}

class BankActor extends Actor {
    var balance: Int = 1000
    
    def receive = {
        case Withdraw(amount) =>
            if (balance >= amount) {
                balance -= amount
                sender() ! Success(balance)
            } else {
                sender() ! InsufficientFunds
            }
        
        case Deposit(amount) =>
            balance += amount  
            sender() ! Success(balance)
    }
}

// No shared state, no locks, no deadlocks!
```

### Key Takeaways:
- **Prevention is better than detection**: Design systems to avoid deadlocks
- **Keep critical sections short**: Minimize time holding locks
- **Use higher-level concurrency constructs**: Concurrent collections, actors
- **Test thoroughly**: Deadlocks can be subtle và rare
- **Monitor production**: Detect và alert on potential deadlock situations

\---

## 55. Process Starvation?

**Trả lời:** Process Starvation xảy ra khi một process không được allocated CPU time hoặc resources mà nó cần để execute, thường do unfair scheduling algorithms hoặc resource allocation policies.

### Định nghĩa và Nguyên nhân:

#### Core Concept:
- **Indefinite postponement**: Process never gets chance to execute
- **Unfair resource allocation**: Some processes monopolize resources
- **Priority inversion**: Low-priority processes block high-priority ones
- **Resource competition**: High demand for limited resources

### Common Causes:

#### 1. Priority-based Scheduling Issues:
```python
import heapq
import time

class Process:
    def __init__(self, pid, priority, cpu_time):
        self.pid = pid
        self.priority = priority  # Lower number = higher priority
        self.cpu_time = cpu_time
        self.remaining_time = cpu_time
    
    def __lt__(self, other):
        return self.priority < other.priority

class PriorityScheduler:
    def __init__(self):
        self.ready_queue = []
        self.current_time = 0
    
    def add_process(self, process):
        heapq.heappush(self.ready_queue, process)
    
    def schedule(self):
        while self.ready_queue:
            # Always pick highest priority process
            current_process = heapq.heappop(self.ready_queue)
            
            print(f"Time {self.current_time}: Running process {current_process.pid} "
                  f"(Priority: {current_process.priority})")
            
            # Process runs for 1 time unit
            current_process.remaining_time -= 1
            self.current_time += 1
            
            if current_process.remaining_time > 0:
                heapq.heappush(self.ready_queue, current_process)

# Problem: Low priority processes may never run!
scheduler = PriorityScheduler()
scheduler.add_process(Process("P1", priority=1, cpu_time=5))  # High priority
scheduler.add_process(Process("P2", priority=5, cpu_time=3))  # Low priority  
scheduler.add_process(Process("P3", priority=1, cpu_time=4))  # High priority

# P2 may starve if P1 and P3 keep running
scheduler.schedule()
```

#### 2. Reader-Writer Lock Starvation:
```java
// Writers can starve if readers keep coming
public class ReaderWriterLock {
    private int readers = 0;
    private boolean writer = false;
    private final Object lock = new Object();
    
    public void readLock() throws InterruptedException {
        synchronized(lock) {
            // Readers allowed if no writer
            while (writer) {
                lock.wait();
            }
            readers++;
        }
    }
    
    public void readUnlock() {
        synchronized(lock) {
            readers--;
            if (readers == 0) {
                lock.notifyAll();  // Wake up waiting writers
            }
        }
    }
    
    public void writeLock() throws InterruptedException {
        synchronized(lock) {
            // Writer must wait for all readers to finish
            while (readers > 0 || writer) {
                lock.wait();  // STARVATION: If readers keep coming!
            }
            writer = true;
        }
    }
    
    public void writeUnlock() {
        synchronized(lock) {
            writer = false;
            lock.notifyAll();
        }
    }
}
```

#### 3. Resource Pool Starvation:
```cpp
#include <vector>
#include <queue>
#include <mutex>
#include <condition_variable>

template<typename T>
class ResourcePool {
private:
    std::vector<T> pool;
    std::queue<std::thread::id> waiting_queue;
    std::mutex pool_mutex;
    std::condition_variable cv;
    
public:
    ResourcePool(std::vector<T> resources) : pool(std::move(resources)) {}
    
    T acquire() {
        std::unique_lock<std::mutex> lock(pool_mutex);
        
        // Add to waiting queue
        waiting_queue.push(std::this_thread::get_id());
        
        // Wait until resource available AND it's our turn
        cv.wait(lock, [this] { 
            return !pool.empty() && 
                   waiting_queue.front() == std::this_thread::get_id(); 
        });
        
        // Remove from queue and get resource
        waiting_queue.pop();
        T resource = pool.back();
        pool.pop_back();
        
        return resource;
    }
    
    void release(T resource) {
        std::unique_lock<std::mutex> lock(pool_mutex);
        pool.push_back(resource);
        cv.notify_one();  // Wake up next waiter
    }
};

// Without fair queuing, some threads might starve
```

### Real-World Starvation Examples:

#### 1. Database Connection Pool Starvation:
```python
import threading
import time
import queue

class DatabaseConnectionPool:
    def __init__(self, max_connections=5):
        self.connections = queue.Queue(maxsize=max_connections)
        self.waiting_threads = []
        self.lock = threading.Lock()
        
        # Initialize connection pool
        for i in range(max_connections):
            self.connections.put(f"Connection-{i}")
    
    def get_connection(self, thread_id, timeout=None):
        start_time = time.time()
        
        while True:
            try:
                # Try to get connection immediately
                connection = self.connections.get_nowait()
                print(f"Thread {thread_id}: Got {connection}")
                return connection
                
            except queue.Empty:
                # No connections available
                if timeout and (time.time() - start_time) > timeout:
                    print(f"Thread {thread_id}: Timed out waiting for connection")
                    return None
                
                # Some threads might wait forever if connections
                # are always taken by faster/luckier threads
                print(f"Thread {thread_id}: Waiting for connection...")
                time.sleep(0.1)
    
    def release_connection(self, connection, thread_id):
        self.connections.put(connection)
        print(f"Thread {thread_id}: Released {connection}")

# High-frequency threads might starve low-frequency ones
pool = DatabaseConnectionPool(max_connections=2)

def high_frequency_worker(thread_id):
    for i in range(10):
        conn = pool.get_connection(thread_id, timeout=1)
        if conn:
            time.sleep(0.1)  # Quick operation
            pool.release_connection(conn, thread_id)

def low_frequency_worker(thread_id):
    conn = pool.get_connection(thread_id, timeout=5)  # Might starve!
    if conn:
        time.sleep(2)  # Long operation
        pool.release_connection(conn, thread_id)
```

#### 2. Network Bandwidth Starvation:
```javascript
// Simulation of network request starvation
class NetworkManager {
    constructor(maxConcurrentRequests = 3) {
        this.maxConcurrent = maxConcurrentRequests;
        this.activeRequests = 0;
        this.requestQueue = [];
        this.requestCounts = new Map();
    }
    
    async makeRequest(requestId, priority = 'normal') {
        return new Promise((resolve, reject) => {
            const request = {
                id: requestId,
                priority: priority,
                resolve: resolve,
                reject: reject,
                timestamp: Date.now()
            };
            
            // Track request frequency per ID
            const count = this.requestCounts.get(requestId) || 0;
            this.requestCounts.set(requestId, count + 1);
            
            if (this.activeRequests < this.maxConcurrent) {
                this.executeRequest(request);
            } else {
                // Queue might not be fair - high frequency requesters 
                // might starve others
                this.requestQueue.push(request);
                this.sortQueueByFrequency(); // Unfair sorting!
            }
        });
    }
    
    sortQueueByFrequency() {
        // This creates starvation - frequent requesters get priority
        this.requestQueue.sort((a, b) => {
            const aCount = this.requestCounts.get(a.id) || 0;
            const bCount = this.requestCounts.get(b.id) || 0;
            return bCount - aCount; // Higher frequency first
        });
    }
    
    async executeRequest(request) {
        this.activeRequests++;
        
        try {
            // Simulate network request
            await new Promise(resolve => 
                setTimeout(resolve, Math.random() * 1000)
            );
            
            request.resolve(`Response for ${request.id}`);
        } catch (error) {
            request.reject(error);
        } finally {
            this.activeRequests--;
            this.processQueue();
        }
    }
    
    processQueue() {
        if (this.requestQueue.length > 0 && 
            this.activeRequests < this.maxConcurrent) {
            const nextRequest = this.requestQueue.shift();
            this.executeRequest(nextRequest);
        }
    }
}
```

### Starvation Detection:

#### 1. Waiting Time Monitoring:
```java
import java.util.concurrent.atomic.AtomicLong;
import java.util.concurrent.ConcurrentHashMap;

public class StarvationDetector {
    private final ConcurrentHashMap<String, Long> waitStartTimes = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, AtomicLong> totalWaitTimes = new ConcurrentHashMap<>();
    private final long starvationThreshold = 5000; // 5 seconds
    
    public void recordWaitStart(String threadId) {
        waitStartTimes.put(threadId, System.currentTimeMillis());
    }
    
    public void recordWaitEnd(String threadId) {
        Long startTime = waitStartTimes.remove(threadId);
        if (startTime != null) {
            long waitTime = System.currentTimeMillis() - startTime;
            
            totalWaitTimes.computeIfAbsent(threadId, k -> new AtomicLong(0))
                         .addAndGet(waitTime);
            
            if (waitTime > starvationThreshold) {
                System.out.println("STARVATION DETECTED: Thread " + threadId + 
                                 " waited " + waitTime + "ms");
            }
        }
    }
    
    public void printStatistics() {
        System.out.println("Wait time statistics:");
        totalWaitTimes.forEach((threadId, totalTime) -> {
            System.out.println("Thread " + threadId + ": " + totalTime.get() + "ms total");
        });
    }
}
```

#### 2. Fairness Metrics:
```python
import time
import statistics

class FairnessMonitor:
    def __init__(self):
        self.execution_times = {}
        self.wait_times = {}
        self.execution_counts = {}
    
    def record_execution(self, process_id, execution_time, wait_time):
        if process_id not in self.execution_times:
            self.execution_times[process_id] = []
            self.wait_times[process_id] = []
            self.execution_counts[process_id] = 0
        
        self.execution_times[process_id].append(execution_time)
        self.wait_times[process_id].append(wait_time)
        self.execution_counts[process_id] += 1
    
    def calculate_fairness_index(self):
        # Jain's Fairness Index: (sum of xi)^2 / (n * sum of xi^2)
        # where xi is throughput of process i
        
        if not self.execution_counts:
            return 0.0
        
        throughputs = list(self.execution_counts.values())
        n = len(throughputs)
        
        sum_throughput = sum(throughputs)
        sum_squared_throughput = sum(x * x for x in throughputs)
        
        if sum_squared_throughput == 0:
            return 1.0  # Perfect fairness (all zeros)
        
        fairness = (sum_throughput ** 2) / (n * sum_squared_throughput)
        return fairness  # 1.0 = perfect fairness, closer to 0 = more unfair
    
    def detect_starving_processes(self):
        avg_executions = statistics.mean(self.execution_counts.values())
        starving_processes = []
        
        for process_id, count in self.execution_counts.items():
            if count < avg_executions * 0.1:  # Less than 10% of average
                avg_wait = statistics.mean(self.wait_times[process_id])
                starving_processes.append((process_id, count, avg_wait))
        
        return starving_processes
```

### Solutions và Prevention:

#### 1. Aging Technique:
```java
// Gradually increase priority of waiting processes
public class AgingScheduler {
    private final PriorityBlockingQueue<AgedProcess> processQueue;
    private final long agingInterval = 1000; // 1 second
    
    private class AgedProcess implements Comparable<AgedProcess> {
        String processId;
        int basePriority;
        long waitStartTime;
        
        public int getEffectivePriority() {
            long waitTime = System.currentTimeMillis() - waitStartTime;
            int ageBonus = (int)(waitTime / agingInterval);
            return Math.max(0, basePriority - ageBonus); // Lower = higher priority
        }
        
        @Override
        public int compareTo(AgedProcess other) {
            return Integer.compare(this.getEffectivePriority(), 
                                 other.getEffectivePriority());
        }
    }
    
    public void addProcess(String processId, int priority) {
        AgedProcess process = new AgedProcess();
        process.processId = processId;
        process.basePriority = priority;
        process.waitStartTime = System.currentTimeMillis();
        
        processQueue.offer(process);
    }
    
    public AgedProcess getNextProcess() {
        return processQueue.poll();
    }
}
```

#### 2. Fair Queuing Algorithm:
```cpp
#include <queue>
#include <unordered_map>

template<typename T>
class FairQueue {
private:
    std::unordered_map<int, std::queue<T>> queues;  // flow_id -> queue
    std::queue<int> activeFlows;
    std::unordered_map<int, int> flowWeights;
    int currentFlow = 0;
    
public:
    void enqueue(T item, int flowId, int weight = 1) {
        if (queues[flowId].empty()) {
            activeFlows.push(flowId);  // Add to round-robin if was empty
        }
        
        queues[flowId].push(item);
        flowWeights[flowId] = weight;
    }
    
    T dequeue() {
        if (activeFlows.empty()) {
            throw std::runtime_error("No items in queue");
        }
        
        // Round-robin through active flows
        int flowId = activeFlows.front();
        activeFlows.pop();
        
        T item = queues[flowId].front();
        queues[flowId].pop();
        
        // If flow still has items, add back to round-robin
        if (!queues[flowId].empty()) {
            activeFlows.push(flowId);
        }
        
        return item;
    }
};
```

#### 3. Starvation-Free Reader-Writer Lock:
```java
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class FairReaderWriterLock {
    private final Lock lock = new ReentrantLock();
    private final Condition readCondition = lock.newCondition();
    private final Condition writeCondition = lock.newCondition();
    
    private int readers = 0;
    private int writers = 0;
    private int waitingWriters = 0;
    
    public void readLock() throws InterruptedException {
        lock.lock();
        try {
            // Don't allow new readers if writers are waiting
            while (writers > 0 || waitingWriters > 0) {
                readCondition.await();
            }
            readers++;
        } finally {
            lock.unlock();
        }
    }
    
    public void readUnlock() {
        lock.lock();
        try {
            readers--;
            if (readers == 0) {
                writeCondition.signalAll();  // Wake up writers
            }
        } finally {
            lock.unlock();
        }
    }
    
    public void writeLock() throws InterruptedException {
        lock.lock();
        try {
            waitingWriters++;
            while (readers > 0 || writers > 0) {
                writeCondition.await();
            }
            waitingWriters--;
            writers++;
        } finally {
            lock.unlock();
        }
    }
    
    public void writeUnlock() {
        lock.lock();
        try {
            writers--;
            // Give priority to waiting writers, then readers
            if (waitingWriters > 0) {
                writeCondition.signal();
            } else {
                readCondition.signalAll();
            }
        } finally {
            lock.unlock();
        }
    }
}
```

### Best Practices:

#### 1. Monitor và Alert:
- Track waiting times cho all processes/threads
- Set thresholds for acceptable wait times
- Alert khi starvation detected

#### 2. Fair Scheduling:
- Use round-robin or weighted fair queuing
- Implement aging mechanisms
- Avoid pure priority-based scheduling

#### 3. Resource Management:
- Set timeouts for resource acquisition
- Implement fair resource allocation algorithms
- Monitor resource utilization patterns

#### 4. System Design:
- Design systems to minimize resource contention
- Use lock-free algorithms where possible
- Implement backpressure mechanisms

### Key Takeaways:
- **Prevention is better than detection**: Design fair systems from start
- **Monitor continuously**: Track fairness metrics in production
- **Use proven algorithms**: Round-robin, weighted fair queuing, aging
- **Set reasonable timeouts**: Prevent indefinite waiting
- **Test under load**: Starvation often appears under high contention

\---

## 56. Wait-free Algorithm?

**Trả lời:** Wait-free algorithms guarantee rằng every thread will complete its operations trong finite number of steps, regardless of actions của other threads. Đây là strongest progress guarantee trong concurrent programming.

### Progress Guarantees Hierarchy:

#### 1. Blocking → 2. Lock-free → 3. Wait-free (strongest)

```cpp
// Progress guarantee comparison:

// 1. BLOCKING - threads can be blocked indefinitely
class BlockingCounter {
    std::mutex mtx;
    int value = 0;
public:
    void increment() {
        std::lock_guard<std::mutex> lock(mtx);  // Can block forever
        value++;
    }
};

// 2. LOCK-FREE - system makes progress, but individual threads might not
class LockFreeCounter {
    std::atomic<int> value{0};
public:
    void increment() {
        int expected;
        do {
            expected = value.load();
            // Thread might retry indefinitely if others keep interfering
        } while (!value.compare_exchange_weak(expected, expected + 1));
    }
};

// 3. WAIT-FREE - every thread guaranteed to complete in finite steps
class WaitFreeCounter {
    std::atomic<int> value{0};
public:
    void increment() {
        // Guaranteed to complete in exactly one step
        value.fetch_add(1);  // Atomic hardware operation
    }
};
```

### Wait-free Algorithm Characteristics:

#### Key Properties:
- **Bounded steps**: Each operation completes trong finite, bounded số steps
- **No starvation**: No thread can prevent another từ making progress  
- **System-wide progress**: All threads make progress, not just system as whole
- **Strongest guarantee**: Implies lock-free và obstruction-free

### Classic Wait-free Examples:

#### 1. Wait-free Queue Implementation:
```java
import java.util.concurrent.atomic.AtomicReferenceArray;
import java.util.concurrent.atomic.AtomicInteger;

public class WaitFreeQueue<T> {
    private final AtomicReferenceArray<T> buffer;
    private final AtomicInteger head = new AtomicInteger(0);
    private final AtomicInteger tail = new AtomicInteger(0);
    private final int capacity;
    
    public WaitFreeQueue(int capacity) {
        this.capacity = capacity;
        this.buffer = new AtomicReferenceArray<>(capacity);
    }
    
    public boolean enqueue(T item) {
        int currentTail = tail.get();
        int nextTail = (currentTail + 1) % capacity;
        
        // Check if queue is full
        if (nextTail == head.get()) {
            return false;  // Queue full
        }
        
        // Single atomic operation - wait-free!
        buffer.set(currentTail, item);
        tail.set(nextTail);
        
        return true;
    }
    
    public T dequeue() {
        int currentHead = head.get();
        
        // Check if queue is empty
        if (currentHead == tail.get()) {
            return null;  // Queue empty
        }
        
        // Single atomic operation - wait-free!
        T item = buffer.get(currentHead);
        buffer.set(currentHead, null);  // Clear reference
        head.set((currentHead + 1) % capacity);
        
        return item;
    }
}
```

#### 2. Wait-free Stack using CAS Array:
```cpp
#include <atomic>
#include <array>

template<typename T, size_t MaxThreads>
class WaitFreeStack {
private:
    struct Node {
        T data;
        std::atomic<Node*> next{nullptr};
        
        Node(const T& value) : data(value) {}
    };
    
    // Per-thread announcement array
    std::array<std::atomic<Node*>, MaxThreads> announce;
    std::atomic<Node*> head{nullptr};
    
public:
    WaitFreeStack() {
        for (auto& slot : announce) {
            slot.store(nullptr);
        }
    }
    
    void push(const T& value, int threadId) {
        Node* newNode = new Node(value);
        
        // Announce intention
        announce[threadId].store(newNode);
        
        // Help other threads first (wait-free helping)
        helpOthers();
        
        // Complete our operation
        Node* currentHead;
        do {
            currentHead = head.load();
            newNode->next.store(currentHead);
        } while (!head.compare_exchange_weak(currentHead, newNode));
        
        // Clear announcement
        announce[threadId].store(nullptr);
    }
    
    T pop(int threadId) {
        // Help others first
        helpOthers();
        
        Node* currentHead;
        do {
            currentHead = head.load();
            if (!currentHead) return T{}; // Empty stack
            
        } while (!head.compare_exchange_weak(currentHead, 
                                           currentHead->next.load()));
        
        T result = currentHead->data;
        delete currentHead;
        return result;
    }
    
private:
    void helpOthers() {
        // Help complete announced operations
        for (auto& announcedNode : announce) {
            Node* node = announcedNode.load();
            if (node) {
                // Try to help complete this operation
                Node* currentHead = head.load();
                node->next.store(currentHead);
                head.compare_exchange_weak(currentHead, node);
            }
        }
    }
};
```

### Universal Construction:

#### Wait-free Universal Object:
```java
// Herlihy's Universal Construction - can implement any wait-free object
public class WaitFreeUniversalConstruction<T> {
    private static class Node {
        public Object operation;
        public Object response;
        public Node next;
        
        public Node(Object op) {
            this.operation = op;
        }
    }
    
    private final AtomicReference<Node> tail;
    private final T sequentialObject;
    private final int maxThreads;
    
    // Thread-local announcement array
    private final AtomicReferenceArray<Node> announce;
    
    public WaitFreeUniversalConstruction(T object, int threads) {
        this.sequentialObject = object;
        this.maxThreads = threads;
        this.announce = new AtomicReferenceArray<>(threads);
        
        Node dummy = new Node(null);
        this.tail = new AtomicReference<>(dummy);
    }
    
    public Object apply(Object operation, int threadId) {
        Node newNode = new Node(operation);
        
        // Announce operation
        announce.set(threadId, newNode);
        
        // Help complete all announced operations
        helpComplete();
        
        // Find response for our operation
        Node current = tail.get();
        while (current.operation != operation) {
            current = current.next;
        }
        
        return current.response;
    }
    
    private void helpComplete() {
        while (true) {
            Node currentTail = tail.get();
            Node newTail = currentTail;
            
            // Collect all announced operations
            for (int i = 0; i < maxThreads; i++) {
                Node announced = announce.get(i);
                if (announced != null && !isApplied(announced)) {
                    // Apply operation sequentially
                    Object response = applySequentially(announced.operation);
                    announced.response = response;
                    
                    // Link to tail
                    newTail.next = announced;
                    newTail = announced;
                }
            }
            
            // Try to update tail
            if (tail.compareAndSet(currentTail, newTail)) {
                break;
            }
        }
    }
    
    private boolean isApplied(Node node) {
        Node current = tail.get();
        while (current != null) {
            if (current == node) return true;
            current = current.next;
        }
        return false;
    }
    
    private Object applySequentially(Object operation) {
        // Apply operation to sequential object
        // Implementation depends on specific object type
        return null; // Placeholder
    }
}
```

### Practical Wait-free Algorithms:

#### 1. Wait-free Snapshot:
```go
package main

import (
    "sync/atomic"
    "unsafe"
)

type WaitFreeSnapshot struct {
    values []int64
    stamps []int64  // Version stamps
    size   int
}

func NewWaitFreeSnapshot(size int) *WaitFreeSnapshot {
    return &WaitFreeSnapshot{
        values: make([]int64, size),
        stamps: make([]int64, size),
        size:   size,
    }
}

func (ws *WaitFreeSnapshot) Update(index int, value int64) {
    // Increment stamp first
    stamp := atomic.AddInt64(&ws.stamps[index], 1)
    
    // Update value
    atomic.StoreInt64(&ws.values[index], value)
    
    // Increment stamp again (indicates completion)
    atomic.StoreInt64(&ws.stamps[index], stamp+1)
}

func (ws *WaitFreeSnapshot) Scan() []int64 {
    result := make([]int64, ws.size)
    stamps := make([]int64, ws.size)
    
    for {
        // Read all stamps
        for i := 0; i < ws.size; i++ {
            stamps[i] = atomic.LoadInt64(&ws.stamps[i])
        }
        
        // Read all values
        for i := 0; i < ws.size; i++ {
            result[i] = atomic.LoadInt64(&ws.values[i])
        }
        
        // Verify stamps haven't changed
        consistent := true
        for i := 0; i < ws.size; i++ {
            currentStamp := atomic.LoadInt64(&ws.stamps[i])
            if currentStamp != stamps[i] || currentStamp%2 == 1 {
                consistent = false
                break
            }
        }
        
        if consistent {
            return result
        }
        // Retry if not consistent
    }
}
```

#### 2. Wait-free Hash Table:
```rust
use std::sync::atomic::{AtomicPtr, AtomicUsize, Ordering};
use std::ptr;

struct WaitFreeHashMap<K, V> {
    buckets: Vec<AtomicPtr<Node<K, V>>>,
    size: AtomicUsize,
    capacity: usize,
}

struct Node<K, V> {
    key: K,
    value: V,
    next: AtomicPtr<Node<K, V>>,
    deleted: std::sync::atomic::AtomicBool,
}

impl<K: Eq + std::hash::Hash, V> WaitFreeHashMap<K, V> {
    fn new(capacity: usize) -> Self {
        let mut buckets = Vec::with_capacity(capacity);
        for _ in 0..capacity {
            buckets.push(AtomicPtr::new(ptr::null_mut()));
        }
        
        Self {
            buckets,
            size: AtomicUsize::new(0),
            capacity,
        }
    }
    
    fn hash(&self, key: &K) -> usize {
        use std::collections::hash_map::DefaultHasher;
        use std::hash::{Hash, Hasher};
        
        let mut hasher = DefaultHasher::new();
        key.hash(&mut hasher);
        hasher.finish() as usize % self.capacity
    }
    
    fn insert(&self, key: K, value: V) -> bool {
        let hash_index = self.hash(&key);
        let new_node = Box::into_raw(Box::new(Node {
            key,
            value,
            next: AtomicPtr::new(ptr::null_mut()),
            deleted: std::sync::atomic::AtomicBool::new(false),
        }));
        
        loop {
            let head = self.buckets[hash_index].load(Ordering::Acquire);
            unsafe { (*new_node).next.store(head, Ordering::Relaxed) };
            
            // Try to CAS new node as head
            match self.buckets[hash_index].compare_exchange_weak(
                head,
                new_node,
                Ordering::Release,
                Ordering::Relaxed,
            ) {
                Ok(_) => {
                    self.size.fetch_add(1, Ordering::Relaxed);
                    return true;
                }
                Err(_) => continue, // Retry
            }
        }
    }
    
    fn find(&self, key: &K) -> Option<&V> {
        let hash_index = self.hash(key);
        let mut current = self.buckets[hash_index].load(Ordering::Acquire);
        
        while !current.is_null() {
            unsafe {
                let node = &*current;
                if !node.deleted.load(Ordering::Relaxed) && &node.key == key {
                    return Some(&node.value);
                }
                current = node.next.load(Ordering::Acquire);
            }
        }
        
        None
    }
}
```

### Challenges trong Wait-free Programming:

#### 1. Memory Management:
```cpp
// Memory reclamation is complex in wait-free algorithms
template<typename T>
class WaitFreeList {
private:
    struct Node {
        T data;
        std::atomic<Node*> next;
        std::atomic<bool> marked{false};  // Logical deletion
    };
    
    std::atomic<Node*> head{nullptr};
    
    // Hazard pointer for memory safety
    thread_local static Node* hazardPointer;
    
public:
    void insert(const T& value) {
        Node* newNode = new Node{value, nullptr};
        
        while (true) {
            Node* currentHead = head.load();
            newNode->next.store(currentHead);
            
            if (head.compare_exchange_weak(currentHead, newNode)) {
                break;
            }
        }
    }
    
    bool remove(const T& value) {
        while (true) {
            Node* current = head.load();
            hazardPointer = current;  // Protect from deletion
            
            // Verify pointer still valid
            if (current != head.load()) continue;
            
            while (current && current->data != value) {
                Node* next = current->next.load();
                hazardPointer = next;  // Update hazard pointer
                
                if (next != current->next.load()) {
                    break;  // Retry from beginning
                }
                current = next;
            }
            
            if (!current) return false;  // Not found
            
            // Mark for deletion
            if (current->marked.exchange(true)) continue;  // Already marked
            
            // Physical deletion would require more complex memory management
            return true;
        }
    }
};
```

#### 2. Space Complexity:
Wait-free algorithms often require additional space for helping mechanisms:

```java
// Space overhead for helping in wait-free algorithms
public class WaitFreeCounter {
    private final int MAX_THREADS = 64;
    
    // Space overhead: O(n) where n = number of threads
    private final AtomicReferenceArray<Integer> announces = 
        new AtomicReferenceArray<>(MAX_THREADS);
    private final AtomicInteger counter = new AtomicInteger(0);
    
    public int increment(int threadId) {
        // Announce intention
        announces.set(threadId, 1);  // Space: O(1) per thread
        
        // Help all other threads
        for (int i = 0; i < MAX_THREADS; i++) {  // Time: O(n)
            Integer announced = announces.get(i);
            if (announced != null) {
                counter.addAndGet(announced);
                announces.set(i, null);  // Clear after helping
            }
        }
        
        return counter.get();
    }
}
```

### When to Use Wait-free Algorithms:

#### Advantages:
- **Predictable performance**: Bounded execution time
- **No priority inversion**: High-priority threads can't be blocked
- **Real-time guarantees**: Suitable for hard real-time systems
- **Starvation-free**: All threads make progress

#### Disadvantages:
- **Complex implementation**: Much harder to implement correctly
- **Memory overhead**: Often require additional space for helping
- **Limited applicability**: Not all algorithms can be made wait-free efficiently
- **Performance**: May be slower than lock-free trong common case

#### Good Use Cases:
- **Real-time systems**: Hard deadlines must be met
- **High-contention scenarios**: Many threads accessing same data
- **Critical infrastructure**: Systems that cannot afford blocking
- **Gaming engines**: Consistent frame rates required

#### Poor Use Cases:
- **Low-contention scenarios**: Overhead not justified
- **Complex operations**: Wait-free implementation may be impractical
- **Memory-constrained systems**: Space overhead too high
- **Prototype/development**: Implementation complexity not worth it

### Key Takeaways:
- **Strongest progress guarantee**: Wait-free > Lock-free > Lock-based
- **Implementation complexity**: Significantly harder to implement
- **Use judiciously**: Only when bounded execution time is critical
- **Consider alternatives**: Lock-free algorithms may be sufficient
- **Memory management**: Major challenge trong wait-free programming
- **Testing crucial**: Subtle bugs are common trong wait-free code

---

*Post ID: 8uh5x4ywmiyy5cj*  
*Category: BackEnd Interview*  
*Created: 2/9/2025*  
*Updated: 2/9/2025*

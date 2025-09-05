---
title: "NoSQL - Backend Interview Questions"
postId: "mt8hipr3hynocj4"
category: "BackEnd Interview"
created: "2/9/2025"
updated: "2/9/2025"
---

# NoSQL - Backend Interview Questions


## 41. Eventual Consistency là gì?

**Trả lời:** Eventual Consistency là consistency model trong distributed systems nơi system sẽ trở nên consistent sau một khoảng thời gian, nhưng không guarantee immediate consistency.

### Đặc điểm:
- **Not immediately consistent**: Updates có thể không visible ngay lập tức across all nodes
- **Eventually consistent**: Given no new updates, tất cả replicas sẽ converge về same value
- **Trade-off**: Đổi lấy higher availability và performance
- **Asynchronous replication**: Changes propagate asynchronously giữa nodes

### Ví dụ thực tế:
```javascript
// User updates profile picture
await updateUserProfile(userId, { avatar: 'new-image.jpg' });

// Different regions có thể see different values trong short period
const user1 = await getUserProfile(userId); // Region US: old avatar
const user2 = await getUserProfile(userId); // Region EU: new avatar

// Eventually, both regions sẽ có same data
```

### Use cases phù hợp:
- **Social media feeds**: Ok nếu user không see latest post immediately
- **Product catalogs**: Inventory updates có thể delay một chút
- **DNS systems**: DNS changes propagate eventually
- **CDN content**: New content distribution across edge servers

### Challenges:
- **Read-your-writes consistency**: User có thể không see their own changes
- **Application complexity**: Must handle inconsistent states
- **Business logic**: Some operations require strong consistency

\---

## 42. CAP Theorem?

**Trả lời:** CAP Theorem (Brewer's Theorem) states rằng distributed system chỉ có thể guarantee 2 trong 3 properties sau đây:

### C - Consistency
- All nodes see same data simultaneously
- Every read receives most recent write
- Strong consistency across distributed system

### A - Availability  
- System operational 100% của time
- Every request receives response (success hoặc failure)
- No single point of failure

### P - Partition Tolerance
- System continues operating despite network partitions
- Communication between nodes có thể fail
- Essential cho bất kỳ distributed system nào

### CAP Classifications:

#### CP Systems (Consistency + Partition Tolerance):
- **Traditional RDBMS**: MySQL, PostgreSQL (single-node có thể be CA)
- **MongoDB**: With strong consistency settings
- **HBase**, **Redis Cluster**
- **Trade-off**: Sacrifice availability during partitions

#### AP Systems (Availability + Partition Tolerance):
- **Cassandra**: Always available, eventually consistent
- **DynamoDB**: High availability, eventual consistency
- **CouchDB**: Available even during network issues
- **Trade-off**: Temporary inconsistency across nodes

#### CA Systems (Consistency + Availability):
- **Single-node databases**: Traditional RDBMS on single server
- **Not practical** cho distributed systems vì network partitions inevitable

### Real-world considerations:
```python
# CP System example - MongoDB with majority write concern
client.db.collection.insert_one(
    document, 
    write_concern=WriteConcern(w="majority")  # Wait for majority ack
)

# AP System example - Cassandra with eventual consistency
session.execute(
    "INSERT INTO users (id, name) VALUES (?, ?)",
    [user_id, name],
    consistency_level=ConsistencyLevel.ONE  # Don't wait for all replicas
)
```

### Modern interpretation:
- CAP không phải binary choice
- Different consistency levels cho different operations
- Systems có thể be CP cho some operations, AP cho others
- **PACELC theorem**: Extension của CAP considering latency

\---

## 43. NoSQL rise tại sao?

**Trả lời:** NoSQL databases tăng popularity trong những năm gần đây vì several key factors:

### 1. Scalability Requirements
- **Horizontal scaling**: Traditional RDBMS khó scale out
- **Big data volumes**: Petabytes của data cần distributed storage
- **High throughput**: Millions của concurrent users

```javascript
// Traditional SQL scaling challenges
// Difficult to shard across multiple servers
SELECT u.*, p.* FROM users u 
JOIN posts p ON u.id = p.user_id 
WHERE u.region = 'US';

// NoSQL natural partitioning
db.users.find({ region: 'US' }); // Easily distributed across shards
```

### 2. Flexible Schema
- **Agile development**: Rapid iteration without schema migrations
- **Heterogeneous data**: Different document structures trong same collection
- **JSON-native**: Web applications naturally work với JSON

```javascript
// Different document structures trong same collection
{
  "_id": 1,
  "name": "John",
  "email": "john@example.com"
}

{
  "_id": 2,  
  "name": "Jane",
  "email": "jane@example.com",
  "preferences": {
    "theme": "dark",
    "language": "en"
  },
  "social_profiles": ["twitter", "linkedin"]
}
```

### 3. Cloud-Native Architecture
- **Microservices**: Each service có thể have different data requirements
- **Container deployment**: NoSQL databases containerize well
- **DevOps friendly**: Infrastructure as code, automated scaling

### 4. Performance for Specific Use Cases
- **Read-heavy workloads**: Document databases optimize for reads
- **Time-series data**: Specialized databases như InfluxDB
- **Graph relationships**: Neo4j cho social networks, recommendations
- **Caching**: Redis cho high-speed data access

### 5. Developer Experience
- **Object-Document Mapping**: Natural fit với OOP languages
- **API-first**: RESTful interfaces, GraphQL integration
- **Simplified queries**: No complex JOINs for simple operations

### 6. Open Source Ecosystem
- **Community driven**: MongoDB, Cassandra, CouchDB
- **Vendor diversity**: Avoid lock-in với proprietary solutions
- **Innovation pace**: Rapid feature development

### Market drivers:
- **Internet scale**: Google, Facebook, Amazon cần new solutions
- **Mobile applications**: JSON APIs, offline sync
- **IoT data**: Sensor data, time-series analytics
- **Real-time applications**: Gaming, chat, collaboration tools

\---

## 44. NoSQL scalability advantages?

**Trả lời:** NoSQL databases có several inherent advantages cho scalability so với traditional RDBMS:

### 1. Horizontal Scaling (Scale-out)
```javascript
// NoSQL sharding example - MongoDB
// Data automatically distributed across shards
db.runCommand({
  shardCollection: "app.users",
  key: { "user_id": "hashed" }
});

// vs SQL scaling challenges
-- Difficult to distribute JOINs across servers
SELECT u.name, COUNT(o.id) FROM users u 
JOIN orders o ON u.id = o.user_id 
GROUP BY u.id;
```

**Advantages:**
- **Linear scalability**: Add more nodes → more capacity
- **Cost effective**: Use commodity hardware thay vì expensive vertical scaling
- **No single bottleneck**: Load distributed across multiple machines

### 2. Built-in Sharding
```python
# Cassandra automatic partitioning
CREATE TABLE users (
    user_id UUID PRIMARY KEY,  -- Partition key
    name TEXT,
    email TEXT
) WITH replication = {
    'class': 'SimpleStrategy',
    'replication_factor': 3
};

# Data automatically distributed based on partition key hash
```

**Benefits:**
- **Automatic data distribution**: No manual partitioning logic
- **Transparent to application**: Sharding handled by database
- **Rebalancing**: Automatic data redistribution khi add/remove nodes

### 3. Schema Flexibility
```json
// Easy to add new fields without migration
{
  "_id": ObjectId("..."),
  "user_id": 123,
  "name": "John",
  "email": "john@example.com",
  "new_field": "added without downtime"  // No schema change needed
}
```

**Scalability impact:**
- **Zero-downtime schema changes**: No locking entire database
- **Independent evolution**: Different services có thể evolve schemas independently
- **Rapid iteration**: No coordination for schema changes

### 4. Eventually Consistent Models
```javascript
// Cassandra tunable consistency
await client.execute(
  'INSERT INTO users (id, name) VALUES (?, ?)',
  [id, name],
  { consistency: cassandra.types.consistencies.one } // Fast writes
);

await client.execute(
  'SELECT * FROM users WHERE id = ?',
  [id],
  { consistency: cassandra.types.consistencies.quorum } // Strong reads
);
```

**Scalability benefits:**
- **Higher availability**: System remains operational during failures
- **Better performance**: Không cần wait cho all replicas
- **Geographic distribution**: Cross-region replication with local reads

### 5. Specialized Data Models

#### Document Databases (MongoDB):
- **Denormalized data**: Reduce JOINs, improve read performance
- **Embedded documents**: Related data stored together

#### Column-family (Cassandra):
- **Write optimization**: Optimized for write-heavy workloads
- **Time-series data**: Efficient storage cho chronological data

#### Key-Value (Redis, DynamoDB):
- **Simple operations**: O(1) lookups, high throughput
- **Caching layer**: Extremely fast data access

#### Graph (Neo4j):
- **Relationship queries**: Efficient traversal của connected data

### 6. Multi-master Replication
```javascript
// CouchDB multi-master setup
// All nodes can accept writes
const result1 = await db1.put(document); // Write to node 1
const result2 = await db2.put(document); // Write to node 2

// Automatic conflict resolution
```

**Benefits:**
- **No single master bottleneck**: Writes distributed across nodes
- **Geographic distribution**: Users write to nearest node
- **High availability**: No master failure point

### 7. Auto-scaling in Cloud
```yaml
# MongoDB Atlas auto-scaling
scaling:
  instance_size_name: M30
  cluster_tier: M30
  auto_scaling:
    disk_gb_enabled: true
    compute_enabled: true
    compute_scale_down_enabled: true
    compute_min_instance_size: M10
    compute_max_instance_size: M60
```

**Cloud advantages:**
- **Elastic scaling**: Scale up/down based on demand
- **Managed services**: Provider handles scaling complexity
- **Pay-as-you-scale**: Cost scales với usage

\---

## 45. Document DB vs Relational DB khi nào dùng?

**Trả lời:** Choosing between Document databases và Relational databases depends on specific use case requirements:

## Document Databases (MongoDB, CouchDB, etc.)

### Khi nào dùng Document DB:

#### 1. Flexible, Evolving Schema
```javascript
// Product catalog với different attributes
{
  "_id": "laptop_001",
  "name": "MacBook Pro",
  "category": "Electronics",
  "specs": {
    "cpu": "M2 Pro",
    "ram": "16GB",
    "storage": "512GB SSD"
  },
  "reviews": [
    { "user": "john", "rating": 5, "comment": "Great laptop!" }
  ]
}

{
  "_id": "book_001", 
  "name": "Clean Code",
  "category": "Books",
  "author": "Robert Martin",
  "isbn": "978-0132350884",
  "pages": 464
  // Different structure, same collection
}
```

#### 2. Rapid Development & Prototyping
- **No upfront schema design**: Start coding immediately
- **Agile methodology**: Requirements change frequently
- **MVP development**: Quick iteration cycles

#### 3. Nested/Hierarchical Data
```javascript
// User profile với complex nested structure
{
  "user_id": "u123",
  "profile": {
    "personal": {
      "name": "John Doe",
      "address": {
        "street": "123 Main St",
        "city": "New York",
        "coordinates": { "lat": 40.7128, "lng": -74.0060 }
      }
    },
    "preferences": {
      "notifications": { "email": true, "push": false },
      "privacy": { "profile_visible": true }
    }
  }
}
```

#### 4. Content Management Systems
- **Blog posts, articles**: Rich content với metadata
- **Media files**: Images, videos với associated data
- **User-generated content**: Comments, reviews, social posts

#### 5. Real-time Applications
```javascript
// Chat application messages
{
  "message_id": "msg_123",
  "conversation_id": "conv_456", 
  "sender": "user_789",
  "content": "Hello there!",
  "timestamp": ISODate("2024-01-15T10:30:00Z"),
  "message_type": "text",
  "reactions": [
    { "user": "user_111", "emoji": "👍" }
  ]
}
```

## Relational Databases (PostgreSQL, MySQL, etc.)

### Khi nào dùng Relational DB:

#### 1. ACID Transactions Critical
```sql
-- Banking transaction - must be atomic
BEGIN TRANSACTION;
  UPDATE accounts SET balance = balance - 100 WHERE id = 'account1';
  UPDATE accounts SET balance = balance + 100 WHERE id = 'account2';
  INSERT INTO transactions (from_account, to_account, amount) 
  VALUES ('account1', 'account2', 100);
COMMIT;
```

#### 2. Complex Queries & Reporting
```sql
-- Complex analytics query
SELECT 
  c.region,
  p.category,
  AVG(oi.price * oi.quantity) as avg_order_value,
  COUNT(DISTINCT o.id) as total_orders
FROM customers c
JOIN orders o ON c.id = o.customer_id  
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
WHERE o.created_at > '2024-01-01'
GROUP BY c.region, p.category
HAVING avg_order_value > 100
ORDER BY total_orders DESC;
```

#### 3. Data Integrity & Consistency
```sql
-- Enforced relationships và constraints
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_id INT NOT NULL,
  order_date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_amount DECIMAL(10,2) CHECK (total_amount > 0),
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE INDEX idx_orders_customer_date ON orders(customer_id, order_date);
```

#### 4. Established Workflows
- **Enterprise applications**: ERP, CRM systems
- **Financial systems**: Accounting, billing
- **Regulatory compliance**: Audit trails, data governance

#### 5. Mature Ecosystem
- **BI tools**: Tableau, PowerBI integration
- **Reporting systems**: Crystal Reports, SSRS
- **Database administrators**: Existing expertise

## Hybrid Approaches

### PostgreSQL JSON Support:
```sql
-- Best of both worlds
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category_id INT REFERENCES categories(id),
  specifications JSONB,  -- Flexible schema
  created_at TIMESTAMP DEFAULT NOW()
);

-- Query JSON data
SELECT name, specifications->>'cpu' as cpu_type
FROM products 
WHERE specifications @> '{"ram": "16GB"}';
```

### Decision Matrix:

| Factor | Document DB | Relational DB |
|--------|-------------|---------------|
| **Schema Evolution** | ✅ Flexible | ❌ Rigid |  
| **ACID Transactions** | ❌ Limited | ✅ Full Support |
| **Complex Queries** | ❌ Limited | ✅ SQL Power |
| **Horizontal Scaling** | ✅ Native | ❌ Complex |
| **Data Integrity** | ❌ Application-level | ✅ Database-level |
| **Learning Curve** | ✅ Low | ❌ Higher |
| **Ecosystem Maturity** | ❌ Newer | ✅ Very Mature |

### Key considerations:
- **Start simple**: Relational DB nếu unsure, có thể migrate later
- **Data relationships**: Many-to-many relationships → SQL
- **Scale requirements**: Massive scale → consider NoSQL
- **Team expertise**: Use what team knows well
- **Consistency requirements**: Strong consistency → SQL

---

*Post ID: mt8hipr3hynocj4*  
*Category: BackEnd Interview*  
*Created: 2/9/2025*  
*Updated: 2/9/2025*

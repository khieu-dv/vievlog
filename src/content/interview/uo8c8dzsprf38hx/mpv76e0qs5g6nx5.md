---
title: "Git & Version Control - Backend Interview Questions"
postId: "mpv76e0qs5g6nx5"
category: "BackEnd Interview"
created: "2/9/2025"
updated: "2/9/2025"
---

# Git & Version Control - Backend Interview Questions


## 46. Git branching vs SVN?

**Trả lời:** Git và SVN có fundamental differences trong cách handle branching:

### Git Branching

#### Lightweight Branches:
```bash
# Create branch instantly - just a pointer to commit
git checkout -b feature/user-auth

# Switch branches quickly
git checkout main
git checkout feature/user-auth

# List all branches
git branch -a
```

**Đặc điểm Git branches:**
- **Pointer to commit**: Branch chỉ là reference đến specific commit
- **Local branches**: Created locally, không cần server communication
- **Instant creation**: O(1) operation, create trong milliseconds  
- **Cheap operations**: Switch, create, delete branches rất nhanh
- **Merge history**: Preserves full branch history và merge points

#### Advanced Git Branching:
```bash
# Create branch from specific commit
git checkout -b hotfix abc123def

# Interactive rebase to clean history  
git rebase -i HEAD~3

# Cherry-pick commits giữa branches
git cherry-pick commit_hash

# Merge với different strategies
git merge --no-ff feature-branch    # Create merge commit
git merge --squash feature-branch   # Squash all commits
```

### SVN Branching

#### Heavy Branching Operations:
```bash
# SVN branch - copy entire directory structure
svn copy https://repo.com/trunk https://repo.com/branches/feature-branch

# Switch to branch
svn switch https://repo.com/branches/feature-branch

# Merge branch back to trunk
svn merge https://repo.com/branches/feature-branch
```

**Đặc điểm SVN branches:**
- **Directory copies**: Branch là full copy của codebase
- **Server-side operation**: Cần network communication
- **Expensive**: Large repositories = slow branch operations
- **Linear history**: Harder to track branch relationships
- **Merge tracking**: Limited merge history preservation

### Key Differences:

| Aspect | Git | SVN |
|--------|-----|-----|
| **Branch creation** | Instant (pointer) | Slow (directory copy) |
| **Storage** | Single .git directory | Multiple branch directories |
| **Network requirement** | No (local) | Yes (server) |
| **History tracking** | Full branch history | Limited merge tracking |
| **Switching cost** | O(changed files) | O(all files) |

### Workflow Implications:

#### Git enables advanced workflows:
```bash
# Feature branch workflow
git checkout -b feature/payment-integration
# ... work on feature ...
git push origin feature/payment-integration
# ... create pull request ...
git checkout main
git pull origin main
git branch -d feature/payment-integration
```

#### SVN encourages simpler workflows:
```bash
# Typically work on trunk
svn checkout https://repo.com/trunk
# ... make changes ...
svn commit -m "Add payment integration"
```

### Advantages:

**Git Branching:**
- Encourage experimentation
- Parallel development
- Feature isolation
- Easy context switching
- Complex merge strategies

**SVN Branching:**
- Simpler conceptual model
- Central authority
- Easier access control
- Less complex for small teams

\---

## 47. DVCS vs Centralized VCS?

**Trả lời:** Distributed Version Control Systems (DVCS) và Centralized VCS có fundamental architectural differences:

## Distributed VCS (Git, Mercurial, Bazaar)

### Architecture:
```
Developer 1        Developer 2        Developer 3
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│ Local Repo  │   │ Local Repo  │   │ Local Repo  │
│ Full History│   │ Full History│   │ Full History│
└─────┬───────┘   └─────┬───────┘   └─────┬───────┘
      │                 │                 │
      └─────────────────┼─────────────────┘
                        │
                ┌───────▼───────┐
                │ Remote Repo   │
                │ (Origin)      │
                └───────────────┘
```

### Key Features:

#### 1. Full Local Repository:
```bash
# Complete history available offline
git log --oneline --graph --all
git blame filename.js
git show commit_hash

# Work completely offline
git commit -m "Feature implemented"
git branch new-feature
git merge feature-branch

# Sync when online
git push origin main
```

#### 2. Multiple Remotes:
```bash
# Add multiple remote repositories
git remote add upstream https://github.com/original/repo.git
git remote add fork https://github.com/myuser/repo.git

# Push to different remotes
git push origin feature-branch
git push fork feature-branch

# Pull from different sources
git pull upstream main
```

#### 3. Flexible Workflows:
```bash
# Forking workflow (GitHub model)
git clone https://github.com/myuser/forked-repo.git
git remote add upstream https://github.com/original/repo.git

# Gitflow workflow
git flow feature start new-feature
git flow feature finish new-feature

# Integration manager workflow
# Developers push to their public repos
# Integration manager pulls from multiple repos
```

## Centralized VCS (SVN, Perforce, CVS)

### Architecture:
```
Developer 1        Developer 2        Developer 3
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│Working Copy │   │Working Copy │   │Working Copy │
│(No History) │   │(No History) │   │(No History) │
└─────┬───────┘   └─────┬───────┘   └─────┬───────┘
      │                 │                 │
      └─────────────────┼─────────────────┘
                        │
                ┌───────▼───────┐
                │Central Server │
                │(All History)  │
                └───────────────┘
```

### Key Features:

#### 1. Central Authority:
```bash
# All operations go through server
svn checkout https://repo.com/trunk
svn update                    # Get latest changes
svn commit -m "Changes"       # Send to server
svn log                       # Query server for history
```

#### 2. Linear Development:
```bash
# Sequential revision numbers
r1234: Add user authentication
r1235: Fix login bug  
r1236: Update documentation
r1237: Refactor user service
```

## Comparison:

### Advantages of DVCS:

#### 1. Offline Capabilities:
```bash
# Full functionality without network
git commit, branch, merge, log, diff, blame
# Entire project history available locally
```

#### 2. Distributed Backup:
- Every clone là full backup
- No single point of failure  
- Multiple developers have complete history

#### 3. Flexible Workflows:
- Peer-to-peer collaboration
- Multiple integration points
- Experimental branches safe

#### 4. Performance:
- Local operations are fast
- No network latency cho most operations
- Better handling của large files/repos

### Advantages of Centralized VCS:

#### 1. Simpler Conceptual Model:
```bash
# One source of truth
svn checkout → work → svn commit
# Linear, easy to understand
```

#### 2. Access Control:
- Fine-grained permissions
- Path-based security
- Easier audit trails

#### 3. Binary Files:
- Better handling của large binary files
- Locking mechanisms cho exclusive editing
- No distributed storage overhead

#### 4. Administrative Control:
- Central policies enforcement
- Backup strategies simpler
- User management centralized

### Use Cases:

**Choose DVCS when:**
- Distributed team
- Open source projects
- Need offline work
- Complex branching/merging
- Want local experimentation

**Choose Centralized when:**
- Need strict access control
- Working with large binary files
- Simple, linear workflows
- Centralized admin requirements
- Team comfortable với model

### Modern Hybrid Approaches:
```bash
# Git với centralized workflow
git clone https://central-repo.com/project.git
# Work like centralized system
git pull origin main
# ... make changes ...
git push origin main

# But with DVCS benefits available when needed
git branch experimental-feature
git commit --amend
git rebase -i HEAD~3
```

\---

## 48. GitFlow vs GitHub Flow?

**Trả lời:** GitFlow và GitHub Flow là two popular branching strategies với different complexity levels và use cases:

## GitFlow

### Branch Structure:
```
main (production-ready code)
├── develop (integration branch)
│   ├── feature/user-auth
│   ├── feature/payment-system  
│   └── feature/notification-service
├── release/v2.1.0 (release preparation)
├── hotfix/critical-security-fix (urgent production fixes)
└── support/v1.x (maintenance branches)
```

### Workflow Process:

#### 1. Feature Development:
```bash
# Start new feature from develop
git checkout develop
git pull origin develop
git checkout -b feature/user-authentication

# Work on feature
git add .
git commit -m "Add user registration endpoint"
git commit -m "Add password validation"

# Finish feature
git checkout develop
git pull origin develop
git merge --no-ff feature/user-authentication
git branch -d feature/user-authentication
git push origin develop
```

#### 2. Release Process:
```bash
# Create release branch from develop
git checkout develop  
git pull origin develop
git checkout -b release/v2.1.0

# Release preparation
git commit -m "Update version to 2.1.0"
git commit -m "Fix release documentation"

# Merge to main and develop
git checkout main
git merge --no-ff release/v2.1.0
git tag -a v2.1.0 -m "Release version 2.1.0"

git checkout develop
git merge --no-ff release/v2.1.0
git branch -d release/v2.1.0
```

#### 3. Hotfix Process:
```bash
# Critical bug in production
git checkout main
git pull origin main
git checkout -b hotfix/security-vulnerability

# Fix bug
git commit -m "Fix SQL injection vulnerability"

# Merge to main and develop
git checkout main
git merge --no-ff hotfix/security-vulnerability
git tag -a v2.1.1 -m "Hotfix: Security vulnerability"

git checkout develop
git merge --no-ff hotfix/security-vulnerability
git branch -d hotfix/security-vulnerability
```

### GitFlow Pros:
- **Clear structure**: Well-defined branch purposes
- **Parallel development**: Multiple features simultaneously
- **Release management**: Dedicated release preparation
- **Hotfix support**: Quick production fixes
- **Large teams**: Scales well với multiple developers

### GitFlow Cons:
- **Complex**: Many branch types và rules
- **Merge conflicts**: develop branch có thể become messy
- **Overhead**: Additional branches to maintain
- **Not CD-friendly**: Doesn't suit continuous deployment

## GitHub Flow

### Simple Structure:
```
main (always deployable)
├── feature/add-user-auth
├── feature/improve-performance
└── hotfix/fix-login-bug
```

### Workflow Process:

#### 1. Feature Development:
```bash
# Create feature branch from main
git checkout main
git pull origin main
git checkout -b feature/add-payment-processing

# Work on feature với frequent commits
git add .
git commit -m "Add payment model"
git push origin feature/add-payment-processing

# Continue development
git commit -m "Add payment validation"
git commit -m "Add payment tests"
git push origin feature/add-payment-processing
```

#### 2. Pull Request Process:
```bash
# Create pull request (GitHub UI)
# Request review from team members
# Run CI/CD pipeline automatically

# After approval, merge to main
git checkout main
git pull origin main
git branch -d feature/add-payment-processing
```

#### 3. Immediate Deployment:
```bash
# main is always deployable
git checkout main
git pull origin main

# Deploy to production
./deploy.sh production

# Or automatic deployment via CI/CD
# GitHub Actions, Jenkins, etc.
```

### GitHub Flow Pros:
- **Simple**: Only main + feature branches
- **Fast**: Quick iteration cycles
- **CD-friendly**: Perfect cho continuous deployment
- **Focus**: Single branch of truth (main)
- **Pull requests**: Built-in code review process

### GitHub Flow Cons:
- **Limited release control**: No dedicated release branches
- **Hotfix challenges**: Must go through same process
- **Less suitable**: For scheduled releases
- **Risk**: Direct impact on production branch

## Comparison:

| Aspect | GitFlow | GitHub Flow |
|--------|---------|-------------|
| **Complexity** | High | Low |
| **Branch types** | 5 types | 2 types |
| **Release process** | Structured | Continuous |
| **Team size** | Large teams | Small-medium teams |
| **Deployment** | Scheduled releases | Continuous deployment |
| **Learning curve** | Steep | Gentle |
| **Flexibility** | Less flexible | Very flexible |

## When to Use:

### Use GitFlow when:
- **Scheduled releases**: Monthly/quarterly release cycles
- **Large teams**: Multiple teams working on different features
- **Enterprise environment**: Formal release processes
- **Mobile apps**: App store approval processes
- **Complex products**: Need parallel development tracks

### Use GitHub Flow when:
- **Web applications**: Can deploy anytime
- **Small teams**: 2-10 developers
- **Continuous deployment**: Deploy multiple times per day
- **SaaS products**: Always-updated online services
- **Rapid iteration**: Quick feedback cycles

## Modified Approaches:

### Git Flow Lite:
```bash
# Simplified GitFlow without release branches
main (production)
├── develop (integration)
│   ├── feature/feature-a
│   └── feature/feature-b
└── hotfix/urgent-fix (directly from main)
```

### GitHub Flow với Release Tags:
```bash
# GitHub Flow + periodic releases
git checkout main
git tag -a v2.1.0 -m "Release 2.1.0"
git push origin v2.1.0

# Continue normal GitHub Flow
git checkout -b feature/next-feature
```

### Choosing Strategy:
- **Start simple**: Begin với GitHub Flow
- **Evolve as needed**: Add complexity when team grows
- **Match deployment**: Choose strategy that fits deployment model
- **Team comfort**: Consider team's Git experience level

---

*Post ID: mpv76e0qs5g6nx5*  
*Category: BackEnd Interview*  
*Created: 2/9/2025*  
*Updated: 2/9/2025*

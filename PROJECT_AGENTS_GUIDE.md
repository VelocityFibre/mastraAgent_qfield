# Project-Specific Agents - Setup Guide

## Concept
**One agent per project. Each has its own memory, context, history.**

KISS principle: Just track what happened, what's next, decisions made.

## What You Get Per Project

### Core Functions
1. **Context** - Current state, next actions, blockers
2. **Log** - Record progress, bugs, decisions, ideas
3. **History** - Search past work
4. **Status** - Quick health check

### Memory
- Working memory: Current project state
- Semantic memory: All logs, decisions, searchable

## Project A (Example Created)

Agent: `projectAAgent`
Location: `src/mastra/agents/project-a.agent.ts`

### Usage Examples

**Get context:**
```
You: status
Agent:
Current: API integration (Week 3)
Next: Frontend connection, testing
Blockers: None
```

**Log progress:**
```
You: Progress: User auth complete
Agent: Logged. Updated context → Moving to API phase
```

**Log bug:**
```
You: Bug: Login fails Safari mobile
Agent: Logged (High priority). No similar history.
```

**Log decision:**
```
You: Decision: Using JWT, not sessions. Reason: stateless
Agent: Decision logged with reasoning
```

**Search history:**
```
You: Find auth work
Agent:
1. [Oct 20] JWT implementation
2. [Oct 18] Decision: JWT chosen
3. [Oct 15] Token bug fixed
```

## Replicate for Projects B, C, D

### Step 1: Copy agent-a.agent.ts

```bash
cd src/mastra/agents
cp project-a.agent.ts project-b.agent.ts
cp project-a.agent.ts project-c.agent.ts
cp project-a.agent.ts project-d.agent.ts
```

### Step 2: Edit Each File

**For project-b.agent.ts:**

Change:
```typescript
const PROJECT_A_INSTRUCTIONS = `# Role
Project memory system for Project A.
```

To:
```typescript
const PROJECT_B_INSTRUCTIONS = `# Role
Project memory system for Project B.
```

Change:
```typescript
export const projectAAgent = new Agent({
  name: "project-a",
  instructions: PROJECT_A_INSTRUCTIONS,
```

To:
```typescript
export const projectBAgent = new Agent({
  name: "project-b",
  instructions: PROJECT_B_INSTRUCTIONS,
```

Change working memory template:
```typescript
template: `# Project A - Context Memory
```

To:
```typescript
template: `# Project B - Context Memory
```

**Repeat for C and D.**

### Step 3: Register in index.ts

Add imports:
```typescript
import { projectAAgent } from './agents/project-a.agent';
import { projectBAgent } from './agents/project-b.agent';
import { projectCAgent } from './agents/project-c.agent';
import { projectDAgent } from './agents/project-d.agent';
```

Add to agents object:
```typescript
agents: {
  weatherAgent,
  agentBuilderAgent,
  diaryGuideAgent,
  ldpCompassAgent,
  projectAAgent,
  projectBAgent,
  projectCAgent,
  projectDAgent
},
```

### Step 4: Restart Server

```bash
npm run dev
```

Open http://localhost:4111/

You'll see all 4 project agents in the list.

## Daily Workflow

### Morning (LDP Compass)
```
You: Plan blocks
LDP: Block 1-3 suggestions

You: Block 1 = Project A today
```

### During Work (Project Agent)
```
[Switch to projectAAgent]

You: status
Agent: Current phase, next actions

[Do work...]

You: Progress: Completed API endpoint for users
Agent: Logged. Context updated.

[Hit blocker...]

You: Blocker: Need client API key
Agent: Logged blocker. Next: Request from client.
```

### Context Switch
```
[Switch to projectCAgent]

You: status
Agent: Current: Testing phase, 90% done

You: Bug: Edge case crashes app
Agent: Logged (Critical). Similar: None. Investigate edge input.
```

### End of Day
```
[Back to LDP Compass]

You: Block 3 done: Project C bug fix, +3 energy
LDP: Logged. 5pm exercise next.
```

### Next Day
```
[Switch to projectCAgent]

You: status
Agent:
Current: Bug fix mode
Last: Edge case crash (critical)
Next: Deploy fix, regression test
```

**Instant context recall. No mental overhead.**

## Integration with LDP Compass

### Block Logging
```
[LDP Compass]
You: Block 1 done: Project A API work, +4
LDP: Logged energy

[Project A Agent]
You: Progress: API endpoints complete
Agent: Context updated
```

### Weekly Review
```
[LDP Compass]
You: weekly
LDP: 28 blocks, energy 7/10

Manual check each project:
- Project A: 12 blocks (momentum)
- Project B: 6 blocks (slower)
- Project C: 8 blocks (near done)
- Project D: 2 blocks (idea phase)
```

## Memory Architecture

### Per Project
- **Working Memory**: Current state (phase, next, blockers)
- **Conversation History**: Last 10 exchanges
- **Semantic Memory**: All logs, decisions (searchable)

### Shared (None)
Projects don't share memory. Intentional isolation.

If you need cross-project insights:
- Ask each agent individually
- You connect the dots

## Advanced: Custom Per Project

Each agent can be customized:

### Project A (Client work)
Add to working memory:
```
- Client: [Name]
- Contract: [Details]
- Deadline: [Date]
- Revenue: [Amount]
```

### Project B (Internal tool)
Add to working memory:
```
- Users: [Team members]
- Launch: [Date]
- KPIs: [Metrics]
```

### Project C (Experimental)
Add to working memory:
```
- Hypothesis: [What testing]
- Results: [Data]
- Next experiment:
```

### Project D (Long-term)
Add to working memory:
```
- Vision: [End goal]
- Milestones: [Steps]
- Research: [Learning]
```

## Tips

### 1. Name Projects Clearly
Not "Project A" → Use real names in agent instructions

### 2. Log Everything
- Progress: "Completed X"
- Bugs: "Found Y"
- Decisions: "Chose Z because..."
- Ideas: "What if we..."

### 3. Use Status Often
Before starting work:
```
You: status
```

Instant context load.

### 4. Search Before Reinventing
```
You: Find work on authentication
```

Reuse solutions.

### 5. Decision History = Gold
Log why you chose X over Y.

Future you will thank you.

## Commands Cheat Sheet

| Command | Action |
|---------|--------|
| `status` | Full context |
| `quick status` | One-line health |
| `Progress: [X]` | Log work done |
| `Bug: [Y]` | Log issue |
| `Decision: [Z]` | Log choice + why |
| `Idea: [W]` | Log future work |
| `Blocker: [B]` | Log what's stuck |
| `Find [query]` | Search history |
| `Why [decision]?` | Recall reasoning |

## ROI

**Time saved per context switch: 10-15 min**

4 projects × 2 switches/day × 10 min = **1.3 hrs/day**

Over 12 weeks: **100+ hours saved**

## Next Steps

1. Register Project B, C, D agents
2. Start using Project A this week
3. Log everything
4. Review after 1 week
5. Adjust template if needed

---

**Current Status:**
- ✅ Project A agent created
- ⏳ Project B, C, D - replicate from A
- ⏳ Test with real project work

**Questions?** Test Project A first, then scale.

# LDP Compass Agent (Momentum Sentinel)

## Overview
Your personal productivity coach for Oct 2025. Tracks deep work blocks, fixed anchors, and backcasts from 50-year vision.

## What It Does
- **Block tracking**: Log 4-5 daily 90min deep work blocks with energy levels
- **Vision backcasting**: Reverse-engineer from 80-year-old self to today's actions
- **Anchor management**: Track 5pm exercise, 8pm boys, 10:30pm sleep
- **Weekly reflection**: 12-week cycle with pattern analysis

## Quick Start

### 1. Log a Block
```
Block 1 done: AI prompt, +4 energy
```

Output:
```
Block 1: ✓ AI work, +4 energy
Strong start. Allocate Block 2: Contract tasks?
Momentum: Carry +4 to next 90min.
```

### 2. Backcast Vision
```
Vision: 50yr me?
```

Agent asks: "At 80: AI mentorship legacy? Impacted how many?"

You answer:
```
At 80, I've mentored 1000+ businesses in AI transformation
```

Output:
```
2075 (80): 1000+ AI businesses mentored
2050 (55): Leading consultancy
2035 (40): 3+ enterprise clients
Oct 2025: First paying client
Action now: Block 4 = 3 outreach emails
```

### 3. Check Anchors
```
Anchor check
```

Output:
```
5pm exercise: Approaching (set 4:55pm alarm)
8pm boys: Scheduled (30min presence)
Sleep: Target 10:30pm bed (8.5hr)
```

### 4. Weekly Reflection
```
weekly
```

Outputs wins, adjustments, next week focus.

## Commands

| Command | Action |
|---------|--------|
| `Block X done: [task], +Y energy` | Log completion |
| `Plan blocks` | Get allocation suggestions |
| `Vision: 50yr` | Backcast from 80yr vision |
| `Anchor check` | Status on fixed schedule |
| `weekly` | Week summary + reflection |

## Block System

### Daily Structure (4 mandatory + 1 optional)
1. **Block 1** (7:30-9:00): AI/Core work (highest focus)
2. **Block 2** (9:30-11:00): Contract/Core work
3. **Block 3** (11:30-1:00): Core wrap-up
4. **Block 4** (2:00-3:30): Outreach/Communication
5. **Block 5** (Optional): Personal growth/reflection

### Energy Tracking
- Rate 1-10 after each block
- Agent tracks patterns (e.g., post-walk = +2 energy)
- Low energy (<3) triggers system check (sleep? walk? block quality?)

## Fixed Anchors

### 5pm Exercise
- 20min walk
- Fuels Block 4 energy
- Tracked daily

### 8pm Boys Time
- 30min scheduled
- Relationship anchor
- Full presence

### 10:30pm Sleep
- 8.5hr target (wake 7am)
- Quality rated 1-10
- Pattern analysis for optimization

## Vision Framework

### Backcasting Process
1. Define 50yr vision (at 80)
2. Work backward in decades:
   - 2075 (80): Legacy
   - 2050 (55): Leadership
   - 2035 (40): Expertise
   - 2025 (NOW): First steps
3. Agent extracts TODAY's action

### Example
```
Vision: "At 80, AI mentor empire, 1000+ businesses"
↓
Today: Send 3 outreach emails (Block 4)
```

## 12-Week Cycle

### Weekly Check-in
- Blocks completed vs target (28/week = 4/day)
- Average energy
- Anchor consistency
- Pattern insights

### Reflection Output
```
Week 5/12
Wins:
- 24/28 blocks (86%)
- 6/7 exercise anchors

Adjust:
- Sleep: 4/7 on target. Review 10:30pm wind-down.

Next: Increase Block 5 frequency (growth work)
```

## Memory System

### Short-term (Last 5 exchanges)
- Current session context
- Recent blocks logged

### Long-term (Semantic recall)
- Energy patterns post-exercise
- Sleep quality correlations
- Block allocation trends
- Vision evolution

## Response Style

### Factual + Light Motivational
```
✓ Good: "Block 1: ✓ AI work, +4. Allocate Block 2: Contracts?"
✗ Bad: "Wow! Amazing job! You're crushing it! Keep going!"
```

### Structured Output
- Bullets, not paragraphs
- Data-first: scores → insights
- Action-oriented nudges
- Max 3 exchanges per session

### Tone
- Direct, no fluff
- Vision-tied actions
- Pattern-based insights
- Support when energy <3

## Daily Template

```
7:00   Wake
7:30   Block 1: AI/Core
9:00   Break
9:30   Block 2: Contract/Core
11:00  Break
11:30  Block 3: Core wrap
1:00   Lunch
2:00   Block 4: Outreach
3:30   Buffer
5:00   Exercise [ANCHOR]
6:00   Relationship time
8:00   Boys [ANCHOR]
9:00   Wind-down
10:30  Bed [ANCHOR]
```

## Sample Week

### Monday
```
You: Block 1 done: AI prompt, +4
Agent: Block 1: ✓ AI, +4. Block 2: Contract review?

You: Block 2 done: Contract edit, +3
Agent: Block 2: ✓, +3. 5pm walk = Block 4 fuel.

You: Anchor check
Agent:
5pm: Approaching
8pm: On schedule
Sleep: 10:30pm target
```

### Wednesday
```
You: Vision: 50yr
Agent: At 80: AI legacy? Mentored how many?

You: 1000+ businesses, AI transformation framework published
Agent:
2075 (80): 1000+ mentored
2035 (40): 3+ clients, expert
Oct 2025: First client
Block 4 today: 3 cold emails
```

### Sunday
```
You: weekly
Agent:
Week 2/12
Wins: 26/28 blocks (93%), 6/7 exercise
Adjust: Sleep 5/7 target. Check wind-down.
Next: Maintain block momentum.
```

## Technical Details

- **Model**: GPT-4o-mini (fast, cost-effective)
- **Tools**: 4 specialized (allocator, backcaster, nudger, reflection)
- **Memory**: LibSQL with working memory
- **Session**: Max 3 exchanges
- **Storage**: All blocks, energy, anchors tracked

## Tips

### Maximize Impact
1. Log blocks immediately after completion
2. Be specific: "AI prompt eng" > "work stuff"
3. Energy honest: Track actual, not ideal
4. Vision clarity: Specific > vague
5. Anchor consistency: Build trust through reps

### Troubleshooting
- **Low energy pattern**: Check sleep quality, exercise consistency
- **Block completion <60%**: Review what's blocking (meetings? distractions?)
- **Vision unclear**: Start with "What problem am I solving at scale?"

---

**Agent Name**: `ldpCompassAgent`
**Access**: http://localhost:4111/ → Select ldpCompassAgent
**First prompt**: "Ready for Block 1? Or vision kickoff?"

Let's build momentum. 🎯

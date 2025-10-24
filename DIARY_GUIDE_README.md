# Diary Guide Agent - User Guide

## Overview

The Diary Guide Agent is a personal growth coach based on Steven Bartlett's "The Diary" methodology. It helps users navigate a 12-week journey of self-discovery across four life pillars:

- 🏢 **Work**: Career satisfaction, projects, work-life balance
- 💰 **Finances**: Budget, savings, financial confidence
- 🏃 **Health**: Physical health, exercise, stress management
- ❤️ **Relationships**: Close connections, communication, quality time

## Features

### 1. **Baseline Assessment**
- Initial quiz-like questions for each pillar
- Establishes starting points on a 1-10 scale
- Creates personalized baseline for tracking progress

### 2. **Daily Reflections**
- Conversational prompts adapted to your journey
- Sentiment analysis of your entries
- Actionable insights and next steps
- Resource recommendations (books, podcasts, articles)

### 3. **Progress Tracking**
- Trend analysis across weeks and months
- Mood averages per pillar
- Week-by-week comparison
- Celebrates improvements and identifies areas for focus

### 4. **Proactive Nudges**
- Gentle check-ins if you miss a day
- Week milestone celebrations
- Pillar rotation suggestions
- Personalized motivational prompts

### 5. **Memory & Recall**
- Remembers past reflections
- References previous challenges and wins
- Tracks long-term patterns
- Builds on your unique journey

## How to Use

### Getting Started

1. **Open the Playground**: http://localhost:4111/
2. **Select** `diaryGuideAgent` from the agents list
3. **Start chatting**:
   ```
   Hi! I'm ready to start my personal growth journey.
   ```

### First Session (Onboarding)

The agent will:
1. Welcome you and explain the 12-week journey
2. Ask which pillar you want to start with
3. Run baseline assessment questions
4. Establish your starting point

Example conversation:
```
You: I want to get started
Agent: Welcome to your 12-week growth journey! Let's start with a baseline.
        Which pillar interests you most: work, finances, health, or relationships?
You: Work
Agent: Great! On a scale of 1-10, how satisfied are you with your current work?
```

### Daily Reflections

Start each session with:
```
Ready for today's reflection
```

Or be specific:
```
I want to reflect on my health today
```

```
Can we talk about my relationships?
```

The agent will:
- Ask guided questions
- Analyze your responses
- Provide insights and action items
- Suggest relevant resources

### Checking Progress

Ask:
```
How am I doing overall?
```

```
Show me my progress on work
```

```
What week am I on?
```

The agent will use the progress tracker to show:
- Average sentiment scores
- Trends (improving/stable/declining)
- Week number in your 12-week cycle
- Comparisons to past reflections

### Getting Resources

Ask:
```
Can you recommend resources for better sleep?
```

```
What books would help with budgeting?
```

The agent will suggest curated:
- Books
- Podcasts
- Articles
- Videos

## Tools Available

The agent has 5 specialized tools:

1. **Reflection Analyzer**
   - Sentiment scoring
   - Insight extraction
   - Action item generation

2. **Resource Fetcher**
   - Curated recommendations
   - Topic-specific suggestions

3. **Progress Tracker**
   - Trend analysis
   - Week tracking
   - Comparative insights

4. **Baseline Assessment**
   - Initial pillar evaluation
   - 1-10 scale questions

5. **Nudge Generator**
   - Check-in prompts
   - Motivational messages

## Tips for Best Results

### 1. **Be Specific**
Instead of: "Work was okay"
Try: "I finished that big project today and my manager gave positive feedback"

### 2. **Reflect Regularly**
- Daily is ideal
- At least 3x per week maintains momentum
- Consistency reveals patterns

### 3. **Be Honest**
- The agent is non-judgmental
- Authenticity leads to better insights
- Track both wins and struggles

### 4. **Act on Insights**
- Note the action items provided
- Try at least one suggestion per week
- Report back on progress

### 5. **Explore All Pillars**
- Don't focus on just one area
- Balance across all four pillars
- Each affects the others

## Sample Conversations

### Week 1 - First Reflection
```
You: I'm ready to start
Agent: Welcome! Let's begin with work. On a scale of 1-10, how satisfied are you?
You: Probably a 6. It's okay but not great.
Agent: Thanks for sharing. What would make it a 7 or 8?
You: Better boundaries and less overtime
Agent: That's a great insight! Let me analyze this...
      [Uses reflection analyzer tool]
      Your work satisfaction baseline is 6/10. Key insight: boundary-setting
      is a priority. Action: Set one specific boundary this week (e.g., no
      emails after 7pm). Resource: Try "Deep Work" by Cal Newport.
```

### Week 5 - Progress Check
```
You: How am I doing on health?
Agent: [Uses progress tracker]
      Great question! Your health score has improved from 4 to 7 over 5 weeks.
      That's a strong upward trend! Your consistent exercise mentions show
      real commitment. Remember your Week 2 entry about feeling tired? You're
      managing energy much better now. Keep it up! 🌟
```

### Week 10 - Looking Back
```
You: Can you remind me what I said about finances in the beginning?
Agent: Of course! In Week 1, you rated financial confidence at 4/10 and
      mentioned stress about budgeting. Now you're at 7/10 and tracking
      expenses consistently. Your savings habit has really developed. That's
      75% improvement in just 9 weeks! What changed for you?
```

## Advanced Features

### Multi-Session Memory

The agent remembers:
- All your reflections
- Sentiment scores over time
- Goals you've mentioned
- Resources you've requested
- Patterns in your responses

### Adaptive Prompts

Questions adapt based on:
- Your week number (1-12)
- Last pillar discussed
- Recent sentiment trends
- Your specific goals

### Resource Personalization

Recommendations match:
- Your current challenge
- Pillar focus
- Preferred format (book/podcast/article)

## Troubleshooting

### "Agent isn't remembering past reflections"
- Make sure you're using the same session/resource ID
- Check the Memory tab in the playground
- Working memory persists across conversations

### "Want more specific insights"
- Provide more detailed reflections
- Use concrete examples
- Mention specific situations or feelings

### "Reflections feel repetitive"
- Try a different pillar
- Ask for progress comparison
- Request specific resource recommendations

## Next Steps

After 12 weeks:
1. Review overall progress across all pillars
2. Set new goals for next cycle
3. Continue daily reflections to maintain momentum
4. Share your growth story!

## Technical Details

- **Model**: GPT-4o-mini (fast, cost-effective)
- **Memory**: LibSQL storage with semantic recall
- **Tools**: 5 specialized tools for reflection analysis
- **Session length**: 3-5 exchanges (quick, focused)
- **Conversation history**: Last 10 messages
- **Working memory**: Persistent across sessions

---

Ready to start your journey? Open the playground and say hello! 🚀

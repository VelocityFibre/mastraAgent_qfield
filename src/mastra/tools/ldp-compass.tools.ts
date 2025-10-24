import { createTool } from "@mastra/core";
import { z } from "zod";

/**
 * Block Allocator Tool
 * Suggests optimal task allocation for deep work blocks based on energy and priorities
 */
export const blockAllocatorTool = createTool({
  id: "block-allocator",
  description: "Allocates tasks to deep work blocks (1-5) based on energy levels and priorities",
  inputSchema: z.object({
    blockNum: z.number().min(1).max(5).describe("Block number (1-5)"),
    task: z.string().optional().describe("Completed or planned task"),
    energy: z.number().min(1).max(10).optional().describe("Energy level after block"),
    isPlanning: z.boolean().default(false).describe("Planning mode vs completion log"),
  }),
  outputSchema: z.object({
    allocation: z.string().describe("Suggested task allocation"),
    reasoning: z.string().describe("Why this allocation"),
    energyNote: z.string().optional().describe("Energy-based insight"),
  }),
  execute: async ({ context }) => {
    const { blockNum, task, energy, isPlanning } = context;

    // Core allocation logic: Blocks 1-3 for core work, 4 for outreach, 5 for reflection
    const allocations = {
      1: "AI/Core Work (highest focus)",
      2: "Contract/Core Work (sustained focus)",
      3: "Core Work wrap-up (final push)",
      4: "Outreach/Communication (lighter cognitive load)",
      5: "Personal Growth/Reflection (flexible, optional)",
    };

    let allocation = allocations[blockNum as keyof typeof allocations] || "Undefined block";
    let reasoning = "";
    let energyNote = undefined;

    if (isPlanning) {
      // Planning mode: suggest what to do
      reasoning = `Block ${blockNum} typically reserved for ${allocation}. Align with 50yr vision.`;

      if (blockNum <= 3) {
        reasoning += " Peak hours—tackle hardest work.";
      } else if (blockNum === 4) {
        reasoning += " Post-core energy—ideal for connections.";
      } else {
        reasoning += " Optional block—invest in future self.";
      }
    } else {
      // Completion mode: analyze what was done
      reasoning = `Block ${blockNum} completed${task ? `: ${task}` : ""}.`;

      if (energy) {
        if (energy >= 7) {
          energyNote = `+${energy} energy—strong momentum. Carry to next block.`;
        } else if (energy >= 4) {
          energyNote = `${energy}/10 energy—steady. 5pm walk will help.`;
        } else {
          energyNote = `${energy}/10 energy—low. Prioritize recovery, check sleep quality.`;
        }
      }
    }

    return {
      allocation,
      reasoning,
      energyNote,
    };
  },
});

/**
 * Vision Backcaster Tool
 * Prompts user with vision questions and reverse-engineers steps from 50yr goal to today
 */
export const visionBackcasterTool = createTool({
  id: "vision-backcaster",
  description: "Backcast from 50-year vision to actionable steps for Oct 2025",
  inputSchema: z.object({
    horizon: z.enum(["50yr", "10yr", "5yr", "1yr"]).describe("Time horizon for vision"),
    visionStatement: z.string().optional().describe("User's vision statement"),
  }),
  outputSchema: z.object({
    question: z.string().optional().describe("Vision-prompting question"),
    backcastSteps: z.array(z.object({
      timeframe: z.string(),
      milestone: z.string(),
      actions: z.array(z.string()),
    })).optional().describe("Reverse-engineered steps"),
  }),
  execute: async ({ context }) => {
    const { horizon, visionStatement } = context;

    if (!visionStatement) {
      // Ask vision question - life wheel framework
      const questions = {
        "50yr": "At 80: What does your life wheel look like? Which spokes matter most? (Career, family, health, impact, wealth, relationships, growth)",
        "10yr": "2035: Your life wheel - which spokes are thriving? What balance have you achieved?",
        "5yr": "2030: Key spokes - what's your position? What have you built?",
        "1yr": "Oct 2026: Life wheel check - which spokes need focus? What progress?",
      };

      return {
        question: questions[horizon],
      };
    }

    // Backcast from vision
    const backcastSteps = [];

    // Parse user's vision and backcast from their actual goals
    // No assumptions - use their words
    if (horizon === "50yr") {
      backcastSteps.push(
        {
          timeframe: "2075 (Age 80)",
          milestone: visionStatement,
          actions: ["Extract from user's stated vision"],
        },
        {
          timeframe: "2050 (Age 55)",
          milestone: "15yr mark from 80",
          actions: ["Mid-point achievement toward 80yr vision"],
        },
        {
          timeframe: "2035 (Age 40)",
          milestone: "Established foundation",
          actions: ["Core systems/relationships/income built"],
        },
        {
          timeframe: "Oct 2025 (NOW)",
          milestone: "Starting point",
          actions: [
            "Identify which wheel spoke needs TODAY's block",
            "1 action this week toward 80yr vision",
          ],
        }
      );
    } else if (horizon === "10yr") {
      backcastSteps.push(
        {
          timeframe: "2035",
          milestone: visionStatement,
          actions: ["Reverse from user's stated 10yr goal"],
        },
        {
          timeframe: "2030",
          milestone: "5yr checkpoint",
          actions: ["Halfway point achievements"],
        },
        {
          timeframe: "2027",
          milestone: "Early momentum",
          actions: ["Initial traction in key spokes"],
        },
        {
          timeframe: "Oct 2025 (NOW)",
          milestone: "First step",
          actions: ["Today: Which spoke gets Block 4?"],
        }
      );
    }

    return {
      backcastSteps: backcastSteps.length > 0 ? backcastSteps : undefined,
    };
  },
});

/**
 * Anchor Nudger Tool
 * Tracks fixed schedule anchors and suggests adjustments based on patterns
 */
export const anchorNudgerTool = createTool({
  id: "anchor-nudger",
  description: "Manages fixed schedule anchors (5pm exercise, 8pm boys, sleep) and nudges",
  inputSchema: z.object({
    anchorType: z.enum(["exercise", "boys", "sleep", "check"]).describe("Which anchor to manage"),
    completed: z.boolean().optional().describe("Whether anchor was completed"),
    sleepQuality: z.number().min(1).max(10).optional().describe("Sleep quality rating"),
    bedTime: z.string().optional().describe("Actual bed time (HH:MM format)"),
  }),
  outputSchema: z.object({
    status: z.string().describe("Anchor status"),
    nudge: z.string().optional().describe("Actionable nudge"),
    pattern: z.string().optional().describe("Observed pattern"),
  }),
  execute: async ({ context }) => {
    const { anchorType, completed, sleepQuality, bedTime } = context;

    let status = "";
    let nudge = undefined;
    let pattern = undefined;

    if (anchorType === "exercise") {
      if (completed === true) {
        status = "5pm exercise: ✓ Complete";
        nudge = "Energy boost logged. Notice the post-walk clarity in Block 4?";
      } else if (completed === false) {
        status = "5pm exercise: ✗ Missed";
        nudge = "Tomorrow: Set 4:55pm alarm. Walk = Block 4 fuel.";
      } else {
        status = "5pm exercise approaching";
        nudge = "Prep: Shoes ready. 20min walk = +2 energy for evening blocks.";
      }
    } else if (anchorType === "boys") {
      if (completed === true) {
        status = "8pm boys time: ✓ Complete";
        nudge = "Connection anchor held. Relationship pillar stable.";
      } else if (completed === false) {
        status = "8pm boys time: ✗ Missed";
        nudge = "Reschedule or note reason. Consistency = trust.";
      } else {
        status = "8pm boys time: 30min scheduled";
        nudge = "Presence over productivity. Full attention.";
      }
    } else if (anchorType === "sleep") {
      if (sleepQuality && bedTime) {
        const targetBed = "22:30"; // 10:30pm
        const actualMinutes = parseTimeToMinutes(bedTime);
        const targetMinutes = parseTimeToMinutes(targetBed);
        const variance = actualMinutes - targetMinutes;

        status = `Sleep: ${sleepQuality}/10 quality, bed at ${bedTime}`;

        if (sleepQuality >= 7 && Math.abs(variance) <= 30) {
          nudge = "Optimal sleep. 8.5hr protocol working. Repeat tonight.";
          pattern = "Consistent bed time = high quality sleep.";
        } else if (sleepQuality < 5) {
          nudge = "Low quality. Check: screen time after 9pm? Room temp? Stress?";
          pattern = "Sleep <5 often follows late blocks or skipped exercise.";
        } else if (variance > 30) {
          nudge = `Bed ${Math.floor(variance / 60)}h late. Tomorrow: 10:30pm hard stop.`;
        } else if (variance < -30) {
          nudge = "Early bed but low quality—check sleep environment.";
        }
      } else {
        status = "Sleep target: 10:30pm bed, 7am wake (8.5hr)";
        nudge = "Track tonight: Bed time + quality (1-10) tomorrow morning.";
      }
    } else if (anchorType === "check") {
      status = "Anchor check";
      nudge = "Today's anchors: 5pm exercise? 8pm boys? 10:30pm bed?";
    }

    return {
      status,
      nudge,
      pattern,
    };
  },
});

/**
 * Weekly Reflection Tool
 * Generates weekly summary and prompts for 12-week cycle reflection
 */
export const weeklyReflectionTool = createTool({
  id: "weekly-reflection",
  description: "Generates weekly reflection summary for 12-week cycle",
  inputSchema: z.object({
    weekNumber: z.number().min(1).max(12).describe("Current week in cycle"),
    blocksCompleted: z.number().describe("Total blocks completed this week"),
    avgEnergy: z.number().min(1).max(10).describe("Average energy across blocks"),
    anchorsHeld: z.object({
      exercise: z.number().min(0).max(7),
      boys: z.number().min(0).max(7),
      sleep: z.number().min(0).max(7),
    }).describe("Anchor completion count"),
  }),
  outputSchema: z.object({
    summary: z.string(),
    wins: z.array(z.string()),
    adjustments: z.array(z.string()),
    nextWeekFocus: z.string(),
  }),
  execute: async ({ context }) => {
    const { weekNumber, blocksCompleted, avgEnergy, anchorsHeld } = context;

    const targetBlocks = 4 * 7; // 4 blocks/day * 7 days = 28
    const blockCompletion = (blocksCompleted / targetBlocks) * 100;

    const wins = [];
    const adjustments = [];

    // Block analysis
    if (blockCompletion >= 80) {
      wins.push(`${blocksCompleted}/${targetBlocks} blocks (${Math.round(blockCompletion)}%)—strong execution`);
    } else if (blockCompletion >= 60) {
      wins.push(`${blocksCompleted} blocks completed—solid foundation`);
      adjustments.push("Target: 4 blocks daily. Identify friction points.");
    } else {
      adjustments.push(`Only ${blocksCompleted}/${targetBlocks} blocks. Review: What blocked momentum?`);
    }

    // Energy analysis
    if (avgEnergy >= 7) {
      wins.push(`${avgEnergy}/10 avg energy—optimal state`);
    } else if (avgEnergy < 5) {
      adjustments.push(`Low energy (${avgEnergy}/10). Check: Sleep? Exercise? Block quality?`);
    }

    // Anchor analysis
    if (anchorsHeld.exercise >= 5) {
      wins.push(`${anchorsHeld.exercise}/7 exercise anchors—routine solidifying`);
    } else {
      adjustments.push(`Exercise: ${anchorsHeld.exercise}/7. Tie to Block 4 reminder.`);
    }

    if (anchorsHeld.sleep >= 5) {
      wins.push(`${anchorsHeld.sleep}/7 sleep anchors—8.5hr protocol working`);
    } else {
      adjustments.push(`Sleep: ${anchorsHeld.sleep}/7. Review 10:30pm wind-down.`);
    }

    const summary = `Week ${weekNumber}/12: ${Math.round(blockCompletion)}% blocks, ${avgEnergy}/10 energy.`;
    const nextWeekFocus = adjustments.length > 0
      ? `Fix: ${adjustments[0].split('.')[0]}`
      : "Maintain momentum, increase Block 5 frequency.";

    return {
      summary,
      wins: wins.length > 0 ? wins : ["Showing up—momentum builds from here."],
      adjustments: adjustments.length > 0 ? adjustments : ["Keep current protocol."],
      nextWeekFocus,
    };
  },
});

// Helper function
function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

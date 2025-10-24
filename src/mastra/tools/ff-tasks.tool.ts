import { createTool } from "@mastra/core";
import { z } from "zod";
import { neon } from "@neondatabase/serverless";

// Database connection - Use POSTGRES_URL for Neon PostgreSQL
const getDatabaseUrl = () => {
  const url = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  if (!url) {
    console.warn("POSTGRES_URL or DATABASE_URL not set, task tools may not function properly");
    return null;
  }
  return url;
};

// Get SQL client
const getSQL = () => {
  const url = getDatabaseUrl();
  if (!url) return null;
  return neon(url);
};

// Task interface matching database schema
interface Task {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed" | "blocked";
  priority: "low" | "medium" | "high" | "urgent";
  category?: string | null;
  tags?: string[] | null;
  created_at: Date;
  updated_at: Date;
  due_date?: Date | null;
  completed_at?: Date | null;
}

function generateId(): string {
  return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Initialize table if it doesn't exist
async function initializeTable() {
  const sql = getSQL();
  if (!sql) return;

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS ff_tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed', 'blocked')),
        priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
        category TEXT,
        tags TEXT[],
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        due_date TIMESTAMP WITH TIME ZONE,
        completed_at TIMESTAMP WITH TIME ZONE
      )
    `;

    // Create indexes if they don't exist
    await sql`CREATE INDEX IF NOT EXISTS idx_ff_tasks_status ON ff_tasks(status)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_ff_tasks_priority ON ff_tasks(priority)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_ff_tasks_category ON ff_tasks(category)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_ff_tasks_created_at ON ff_tasks(created_at DESC)`;
  } catch (error) {
    console.error("Error initializing ff_tasks table:", error);
  }
}

// Initialize on module load
initializeTable();

/**
 * Add Task Tool
 * Create a new task with description, priority, etc.
 */
export const addTaskTool = createTool({
  id: "add-task",
  description: "Add a new task to the task list with title, description, priority, and category",
  inputSchema: z.object({
    title: z.string().describe("Short task title"),
    description: z.string().describe("Detailed task description"),
    priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
    category: z.string().optional().describe("Task category (e.g., 'refactor', 'bug', 'feature')"),
    tags: z.array(z.string()).optional().describe("Tags for organization"),
    dueDate: z.string().optional().describe("Due date (ISO format)"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    taskId: z.string(),
    message: z.string(),
    task: z.object({
      id: z.string(),
      title: z.string(),
      status: z.string(),
      priority: z.string(),
    }),
  }),
  execute: async ({ context }) => {
    const sql = getSQL();
    if (!sql) {
      return {
        success: false,
        taskId: "",
        message: "Database not configured. Set DATABASE_URL environment variable.",
        task: { id: "", title: "", status: "", priority: "" },
      };
    }

    const { title, description, priority, category, tags, dueDate } = context;
    const taskId = generateId();

    try {
      await sql`
        INSERT INTO ff_tasks (id, title, description, status, priority, category, tags, due_date)
        VALUES (
          ${taskId},
          ${title},
          ${description},
          'pending',
          ${priority},
          ${category || null},
          ${tags ? sql.array(tags) : null},
          ${dueDate || null}
        )
      `;

      return {
        success: true,
        taskId,
        message: `Task added: "${title}" [${priority}]`,
        task: {
          id: taskId,
          title,
          status: "pending",
          priority,
        },
      };
    } catch (error) {
      console.error("Error adding task:", error);
      return {
        success: false,
        taskId: "",
        message: `Failed to add task: ${error instanceof Error ? error.message : "Unknown error"}`,
        task: { id: "", title: "", status: "", priority: "" },
      };
    }
  },
});

/**
 * List Tasks Tool
 * Get all tasks with optional filtering
 */
export const listTasksTool = createTool({
  id: "list-tasks",
  description: "List all tasks with optional filters by status, priority, or category",
  inputSchema: z.object({
    status: z.enum(["pending", "in_progress", "completed", "blocked", "all"]).default("all"),
    priority: z.enum(["low", "medium", "high", "urgent", "all"]).default("all"),
    category: z.string().optional().describe("Filter by category"),
    sortBy: z.enum(["priority", "created_at", "updated_at"]).default("priority"),
  }),
  outputSchema: z.object({
    tasks: z.array(z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      status: z.string(),
      priority: z.string(),
      category: z.string().optional(),
      createdAt: z.string(),
      dueDate: z.string().optional(),
    })),
    total: z.number(),
    summary: z.string(),
  }),
  execute: async ({ context }) => {
    const sql = getSQL();
    if (!sql) {
      return {
        tasks: [],
        total: 0,
        summary: "Database not configured. Set DATABASE_URL environment variable.",
      };
    }

    const { status, priority, category, sortBy } = context;

    try {
      // Build query with filters
      let query = sql`SELECT * FROM ff_tasks WHERE 1=1`;

      if (status !== "all") {
        query = sql`SELECT * FROM ff_tasks WHERE status = ${status}`;
      }

      // Apply additional filters
      const conditions = [];
      if (status !== "all") conditions.push(sql`status = ${status}`);
      if (priority !== "all") conditions.push(sql`priority = ${priority}`);
      if (category) conditions.push(sql`category = ${category}`);

      // Reconstruct query with all conditions
      if (conditions.length > 0) {
        query = sql`SELECT * FROM ff_tasks WHERE ${sql.join(conditions, sql` AND `)}`;
      } else {
        query = sql`SELECT * FROM ff_tasks`;
      }

      // Add sorting
      const priorityOrder = sql`
        CASE priority
          WHEN 'urgent' THEN 0
          WHEN 'high' THEN 1
          WHEN 'medium' THEN 2
          WHEN 'low' THEN 3
        END
      `;

      if (sortBy === "priority") {
        query = sql`${query} ORDER BY ${priorityOrder}, created_at DESC`;
      } else if (sortBy === "created_at") {
        query = sql`${query} ORDER BY created_at DESC`;
      } else if (sortBy === "updated_at") {
        query = sql`${query} ORDER BY updated_at DESC`;
      }

      const tasks = await query;

      const taskList = tasks.map((t: any) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        status: t.status,
        priority: t.priority,
        category: t.category || undefined,
        createdAt: t.created_at.toISOString(),
        dueDate: t.due_date ? t.due_date.toISOString() : undefined,
      }));

      const summary = `Found ${tasks.length} task(s)${status !== "all" ? ` with status '${status}'` : ""}${priority !== "all" ? ` with priority '${priority}'` : ""}`;

      return {
        tasks: taskList,
        total: tasks.length,
        summary,
      };
    } catch (error) {
      console.error("Error listing tasks:", error);
      return {
        tasks: [],
        total: 0,
        summary: `Error listing tasks: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  },
});

/**
 * Update Task Tool
 * Update task status, priority, or other fields
 */
export const updateTaskTool = createTool({
  id: "update-task",
  description: "Update task status, priority, description, or other fields",
  inputSchema: z.object({
    taskId: z.string().describe("Task ID to update"),
    status: z.enum(["pending", "in_progress", "completed", "blocked"]).optional(),
    priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
    description: z.string().optional().describe("Updated description"),
    notes: z.string().optional().describe("Additional notes"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
    task: z.object({
      id: z.string(),
      title: z.string(),
      status: z.string(),
      priority: z.string(),
      updatedAt: z.string(),
    }).optional(),
  }),
  execute: async ({ context }) => {
    const sql = getSQL();
    if (!sql) {
      return {
        success: false,
        message: "Database not configured. Set DATABASE_URL environment variable.",
      };
    }

    const { taskId, status, priority, description, notes } = context;

    try {
      // First, check if task exists
      const existing = await sql`SELECT * FROM ff_tasks WHERE id = ${taskId}`;

      if (existing.length === 0) {
        return {
          success: false,
          message: `Task not found: ${taskId}`,
        };
      }

      const task = existing[0];

      // Build update query
      const updates: any = { updated_at: new Date() };
      if (status) updates.status = status;
      if (priority) updates.priority = priority;
      if (description) updates.description = description;

      // Set completion date if status is completed
      if (status === "completed" && !task.completed_at) {
        updates.completed_at = new Date();
      }

      // Perform update
      const updateParts = [];
      const values = [];

      if (status) updateParts.push(`status = ${status}`);
      if (priority) updateParts.push(`priority = ${priority}`);
      if (description) updateParts.push(`description = ${description}`);
      if (status === "completed" && !task.completed_at) {
        updateParts.push(`completed_at = NOW()`);
      }
      updateParts.push(`updated_at = NOW()`);

      await sql`
        UPDATE ff_tasks
        SET
          status = COALESCE(${status}, status),
          priority = COALESCE(${priority}, priority),
          description = COALESCE(${description}, description),
          completed_at = CASE WHEN ${status === "completed" && !task.completed_at} THEN NOW() ELSE completed_at END,
          updated_at = NOW()
        WHERE id = ${taskId}
      `;

      // Get updated task
      const updated = await sql`SELECT * FROM ff_tasks WHERE id = ${taskId}`;
      const updatedTask = updated[0];

      const updatesList = [];
      if (status) updatesList.push(`status → ${status}`);
      if (priority) updatesList.push(`priority → ${priority}`);
      if (description) updatesList.push("description updated");
      if (notes) updatesList.push(`notes: ${notes}`);

      return {
        success: true,
        message: `Task updated: ${updatedTask.title} (${updatesList.join(", ")})`,
        task: {
          id: updatedTask.id,
          title: updatedTask.title,
          status: updatedTask.status,
          priority: updatedTask.priority,
          updatedAt: updatedTask.updated_at.toISOString(),
        },
      };
    } catch (error) {
      console.error("Error updating task:", error);
      return {
        success: false,
        message: `Failed to update task: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  },
});

/**
 * Get Task Tool
 * Get details of a specific task
 */
export const getTaskTool = createTool({
  id: "get-task",
  description: "Get detailed information about a specific task by ID",
  inputSchema: z.object({
    taskId: z.string().describe("Task ID to retrieve"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    task: z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      status: z.string(),
      priority: z.string(),
      category: z.string().optional(),
      tags: z.array(z.string()).optional(),
      createdAt: z.string(),
      updatedAt: z.string(),
      dueDate: z.string().optional(),
      completedAt: z.string().optional(),
    }).optional(),
    message: z.string(),
  }),
  execute: async ({ context }) => {
    const sql = getSQL();
    if (!sql) {
      return {
        success: false,
        message: "Database not configured. Set DATABASE_URL environment variable.",
      };
    }

    const { taskId } = context;

    try {
      const result = await sql`SELECT * FROM ff_tasks WHERE id = ${taskId}`;

      if (result.length === 0) {
        return {
          success: false,
          message: `Task not found: ${taskId}`,
        };
      }

      const task = result[0];

      return {
        success: true,
        task: {
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          category: task.category || undefined,
          tags: task.tags || undefined,
          createdAt: task.created_at.toISOString(),
          updatedAt: task.updated_at.toISOString(),
          dueDate: task.due_date ? task.due_date.toISOString() : undefined,
          completedAt: task.completed_at ? task.completed_at.toISOString() : undefined,
        },
        message: `Task retrieved: ${task.title}`,
      };
    } catch (error) {
      console.error("Error getting task:", error);
      return {
        success: false,
        message: `Failed to get task: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  },
});

/**
 * Search Tasks Tool
 * Search tasks by text in title or description
 */
export const searchTasksTool = createTool({
  id: "search-tasks",
  description: "Search tasks by text in title, description, or tags",
  inputSchema: z.object({
    query: z.string().describe("Search query"),
    searchIn: z.enum(["title", "description", "both", "tags"]).default("both"),
  }),
  outputSchema: z.object({
    tasks: z.array(z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      status: z.string(),
      priority: z.string(),
    })),
    total: z.number(),
    message: z.string(),
  }),
  execute: async ({ context }) => {
    const sql = getSQL();
    if (!sql) {
      return {
        tasks: [],
        total: 0,
        message: "Database not configured. Set DATABASE_URL environment variable.",
      };
    }

    const { query, searchIn } = context;

    try {
      const lowerQuery = `%${query.toLowerCase()}%`;
      let results;

      if (searchIn === "title") {
        results = await sql`
          SELECT * FROM ff_tasks
          WHERE LOWER(title) LIKE ${lowerQuery}
          ORDER BY created_at DESC
        `;
      } else if (searchIn === "description") {
        results = await sql`
          SELECT * FROM ff_tasks
          WHERE LOWER(description) LIKE ${lowerQuery}
          ORDER BY created_at DESC
        `;
      } else if (searchIn === "tags") {
        results = await sql`
          SELECT * FROM ff_tasks
          WHERE EXISTS (
            SELECT 1 FROM unnest(tags) AS tag
            WHERE LOWER(tag) LIKE ${lowerQuery}
          )
          ORDER BY created_at DESC
        `;
      } else {
        // Search in both title and description
        results = await sql`
          SELECT * FROM ff_tasks
          WHERE LOWER(title) LIKE ${lowerQuery}
            OR LOWER(description) LIKE ${lowerQuery}
          ORDER BY created_at DESC
        `;
      }

      return {
        tasks: results.map((t: any) => ({
          id: t.id,
          title: t.title,
          description: t.description,
          status: t.status,
          priority: t.priority,
        })),
        total: results.length,
        message: `Found ${results.length} task(s) matching "${query}"`,
      };
    } catch (error) {
      console.error("Error searching tasks:", error);
      return {
        tasks: [],
        total: 0,
        message: `Error searching tasks: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  },
});

/**
 * Delete Task Tool
 * Remove a task from the list
 */
export const deleteTaskTool = createTool({
  id: "delete-task",
  description: "Delete a task by ID",
  inputSchema: z.object({
    taskId: z.string().describe("Task ID to delete"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
  }),
  execute: async ({ context }) => {
    const sql = getSQL();
    if (!sql) {
      return {
        success: false,
        message: "Database not configured. Set DATABASE_URL environment variable.",
      };
    }

    const { taskId } = context;

    try {
      // First, get the task to return its title
      const existing = await sql`SELECT title FROM ff_tasks WHERE id = ${taskId}`;

      if (existing.length === 0) {
        return {
          success: false,
          message: `Task not found: ${taskId}`,
        };
      }

      const taskTitle = existing[0].title;

      // Delete the task
      await sql`DELETE FROM ff_tasks WHERE id = ${taskId}`;

      return {
        success: true,
        message: `Task deleted: ${taskTitle}`,
      };
    } catch (error) {
      console.error("Error deleting task:", error);
      return {
        success: false,
        message: `Failed to delete task: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  },
});

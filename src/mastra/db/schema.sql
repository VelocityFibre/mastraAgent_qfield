-- FibreFlow Agent Tasks Table
-- Stores tasks for the FF agent task management system

CREATE TABLE IF NOT EXISTS ff_tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed', 'blocked')),
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  category TEXT,
  tags TEXT[], -- Array of tags
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  due_date TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Index for common queries
CREATE INDEX IF NOT EXISTS idx_ff_tasks_status ON ff_tasks(status);
CREATE INDEX IF NOT EXISTS idx_ff_tasks_priority ON ff_tasks(priority);
CREATE INDEX IF NOT EXISTS idx_ff_tasks_category ON ff_tasks(category);
CREATE INDEX IF NOT EXISTS idx_ff_tasks_created_at ON ff_tasks(created_at DESC);

-- Full text search index for title and description
CREATE INDEX IF NOT EXISTS idx_ff_tasks_search ON ff_tasks USING gin(to_tsvector('english', title || ' ' || description));

-- Comments
COMMENT ON TABLE ff_tasks IS 'Tasks managed by the FibreFlow (FF) agent';
COMMENT ON COLUMN ff_tasks.id IS 'Unique task identifier (task_timestamp_random)';
COMMENT ON COLUMN ff_tasks.status IS 'Task status: pending, in_progress, completed, blocked';
COMMENT ON COLUMN ff_tasks.priority IS 'Task priority: low, medium, high, urgent';
COMMENT ON COLUMN ff_tasks.category IS 'Task category (e.g., refactor, bug, feature)';
COMMENT ON COLUMN ff_tasks.tags IS 'Array of tags for task organization';

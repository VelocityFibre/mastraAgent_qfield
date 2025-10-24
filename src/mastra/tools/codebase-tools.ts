import { createTool } from "@mastra/core";
import { z } from "zod";
import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

/**
 * Search Code Tool
 * Greps through project codebase for patterns
 */
export const searchCodeTool = createTool({
  id: "search-code",
  description: "Search through project codebase using grep/ripgrep patterns",
  inputSchema: z.object({
    projectPath: z.string().describe("Project root path (e.g., /home/louisdup/VF/Apps/FF_React)"),
    query: z.string().describe("Search pattern/keyword"),
    fileType: z.string().optional().describe("File extension filter (e.g., 'ts', 'tsx', 'js')"),
    contextLines: z.number().optional().default(2).describe("Lines of context before/after match"),
  }),
  outputSchema: z.object({
    results: z.array(z.object({
      file: z.string(),
      line: z.number(),
      content: z.string(),
    })),
    summary: z.string(),
    totalMatches: z.number(),
  }),
  execute: async ({ context }) => {
    const { projectPath, query, fileType, contextLines } = context;

    try {
      // Build grep command
      let cmd = `cd "${projectPath}" && grep -rn`;

      if (contextLines && contextLines > 0) {
        cmd += ` -C ${contextLines}`;
      }

      if (fileType) {
        cmd += ` --include="*.${fileType}"`;
      }

      cmd += ` "${query}" src/ 2>/dev/null || true`;

      const output = execSync(cmd, {
        encoding: 'utf-8',
        maxBuffer: 1024 * 1024 * 10, // 10MB buffer
      });

      if (!output || output.trim() === '') {
        return {
          results: [],
          summary: `No matches found for "${query}"`,
          totalMatches: 0,
        };
      }

      // Parse grep output (format: file:line:content)
      const lines = output.split('\n').filter(l => l.trim());
      const results = lines.slice(0, 50).map(line => { // Limit to 50 results
        const match = line.match(/^([^:]+):(\d+):(.*)$/);
        if (match) {
          return {
            file: match[1],
            line: parseInt(match[2]),
            content: match[3].trim(),
          };
        }
        return null;
      }).filter(Boolean) as Array<{file: string, line: number, content: string}>;

      return {
        results,
        summary: `Found ${lines.length} matches for "${query}"${lines.length > 50 ? ' (showing first 50)' : ''}`,
        totalMatches: lines.length,
      };
    } catch (error) {
      return {
        results: [],
        summary: `Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        totalMatches: 0,
      };
    }
  },
});

/**
 * Read File Tool
 * Reads specific files from the codebase
 */
export const readFileTool = createTool({
  id: "read-file",
  description: "Read contents of a specific file from the codebase",
  inputSchema: z.object({
    filePath: z.string().describe("Absolute path to file OR relative path from project root"),
    projectPath: z.string().optional().describe("Project root (if using relative path)"),
    startLine: z.number().optional().describe("Starting line number (1-indexed)"),
    endLine: z.number().optional().describe("Ending line number (inclusive)"),
  }),
  outputSchema: z.object({
    content: z.string(),
    lines: z.number(),
    summary: z.string(),
  }),
  execute: async ({ context }) => {
    const { filePath, projectPath, startLine, endLine } = context;

    try {
      // Resolve full path
      let fullPath = filePath;
      if (projectPath && !path.isAbsolute(filePath)) {
        fullPath = path.join(projectPath, filePath);
      }

      // Check if file exists
      if (!fs.existsSync(fullPath)) {
        return {
          content: '',
          lines: 0,
          summary: `File not found: ${fullPath}`,
        };
      }

      // Read file
      let content = fs.readFileSync(fullPath, 'utf-8');
      const allLines = content.split('\n');

      // Handle line range
      if (startLine !== undefined || endLine !== undefined) {
        const start = (startLine || 1) - 1; // Convert to 0-indexed
        const end = endLine || allLines.length;
        content = allLines.slice(start, end).join('\n');
      }

      return {
        content,
        lines: content.split('\n').length,
        summary: `Read ${fullPath}${startLine ? ` (lines ${startLine}-${endLine || 'end'})` : ''}`,
      };
    } catch (error) {
      return {
        content: '',
        lines: 0,
        summary: `Read failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  },
});

/**
 * Find Files Tool
 * Finds files matching glob patterns
 */
export const findFilesTool = createTool({
  id: "find-files",
  description: "Find files in codebase using glob patterns (e.g., **/*contractor*)",
  inputSchema: z.object({
    projectPath: z.string().describe("Project root path"),
    pattern: z.string().describe("Glob pattern (e.g., '**/*contractor*.tsx', '**/components/**')"),
    maxResults: z.number().optional().default(50).describe("Maximum results to return"),
  }),
  outputSchema: z.object({
    files: z.array(z.string()),
    summary: z.string(),
    totalFound: z.number(),
  }),
  execute: async ({ context }) => {
    const { projectPath, pattern, maxResults } = context;

    try {
      // Use find command (faster than node glob for large codebases)
      // Convert glob pattern to find-compatible pattern
      let findPattern = pattern.replace(/\*\*/g, '*').replace(/\*/g, '*');

      const cmd = `cd "${projectPath}" && find src -type f -path "*${pattern.replace(/\*\*/g, '*')}*" 2>/dev/null | head -n ${maxResults}`;

      const output = execSync(cmd, {
        encoding: 'utf-8',
        maxBuffer: 1024 * 1024 * 5,
      });

      if (!output || output.trim() === '') {
        return {
          files: [],
          summary: `No files found matching "${pattern}"`,
          totalFound: 0,
        };
      }

      const files = output.split('\n').filter(f => f.trim());

      return {
        files,
        summary: `Found ${files.length} files matching "${pattern}"`,
        totalFound: files.length,
      };
    } catch (error) {
      return {
        files: [],
        summary: `Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        totalFound: 0,
      };
    }
  },
});

/**
 * List Directory Tool
 * Lists contents of a directory
 */
export const listDirectoryTool = createTool({
  id: "list-directory",
  description: "List files and directories in a specific path",
  inputSchema: z.object({
    directoryPath: z.string().describe("Path to directory"),
    depth: z.number().optional().default(1).describe("Depth of listing (1=immediate children)"),
  }),
  outputSchema: z.object({
    items: z.array(z.object({
      name: z.string(),
      type: z.enum(['file', 'directory']),
      path: z.string(),
    })),
    summary: z.string(),
  }),
  execute: async ({ context }) => {
    const { directoryPath, depth } = context;

    try {
      if (!fs.existsSync(directoryPath)) {
        return {
          items: [],
          summary: `Directory not found: ${directoryPath}`,
        };
      }

      const items: Array<{name: string, type: 'file' | 'directory', path: string}> = [];

      const readDir = (dir: string, currentDepth: number) => {
        if (currentDepth > depth!) return;

        const entries = fs.readdirSync(dir);

        for (const entry of entries) {
          const fullPath = path.join(dir, entry);
          const stat = fs.statSync(fullPath);

          items.push({
            name: entry,
            type: stat.isDirectory() ? 'directory' : 'file',
            path: fullPath,
          });

          if (stat.isDirectory() && currentDepth < depth!) {
            readDir(fullPath, currentDepth + 1);
          }
        }
      };

      readDir(directoryPath, 1);

      return {
        items: items.slice(0, 100), // Limit to 100 items
        summary: `Found ${items.length} items in ${directoryPath}`,
      };
    } catch (error) {
      return {
        items: [],
        summary: `List failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  },
});

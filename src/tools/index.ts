/**
 * MCP Tools Registry - combines all PDF tool modules
 */

import { documentTools } from './document';
import { formTools } from './forms';
import { editTools } from './edit';
import { pageTools } from './pages';
import { signatureTools } from './signatures';
import { securityTools } from './security';
import { exportTools } from './export';
import { MCPToolDefinition, MCPResult } from '../types/mcp';

// Combine all PDF tools
const allTools: MCPToolDefinition[] = [
  ...documentTools,
  ...formTools,
  ...editTools,
  ...pageTools,
  ...signatureTools,
  ...securityTools,
  ...exportTools,
];

/**
 * Get all available tools for MCP server registration
 * @returns Array of tool definitions
 */
export const getToolDefinitions = () => {
  return allTools.map((tool) => ({
    name: tool.name,
    description: tool.description,
    inputSchema: tool.inputSchema,
  }));
};

/**
 * Handle MCP tool call requests
 * @param request - MCP tool call request
 * @returns Tool response in MCP format
 */
export const handleToolCall = async (request: any) => {
  const { name, arguments: args } = request.params;

  try {
    // Find the tool handler
    const tool = allTools.find((t) => t.name === name);

    if (!tool) {
      throw new Error(`Unknown tool: ${name}`);
    }

    // Execute the tool handler
    const result = await tool.handler(args);
    return result;
  } catch (error) {
    console.error(`❌ Error in ${name}:`, (error as Error).message);

    return {
      content: [
        {
          type: 'text',
          text: `Error: ${(error as Error).message}`,
        },
      ],
      isError: true,
    };
  }
};

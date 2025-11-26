#!/usr/bin/env node

/**
 * PDF MCP Server
 * Model Context Protocol server for PDF manipulation and operations
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { getToolDefinitions, handleToolCall } from './src/tools';
import { SERVER_CONFIG } from './src/config/constants';
import { handleCliCommands } from './src/cli';
import { getPDFManager } from './src/pdf/pdf-manager';

// Handle CLI commands if arguments provided
if (process.argv.length > 2) {
  const args = process.argv.slice(2);
  handleCliCommands(args);
  process.exit(0);
}

/**
 * Main MCP Server
 */
async function main() {
  // Initialize PDF manager
  const pdfManager = getPDFManager();

  // Setup cleanup interval for old sessions
  setInterval(() => {
    pdfManager.cleanupSessions();
  }, 60000); // Cleanup every minute

  // Create MCP server
  const server = new Server(
    {
      name: SERVER_CONFIG.name,
      version: SERVER_CONFIG.version,
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // List available tools
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: getToolDefinitions(),
    };
  });

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const result = await handleToolCall(request);
    return {
      content: result.content,
      isError: result.isError,
    };
  });

  // Start server with stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error(`✅ ${SERVER_CONFIG.name} v${SERVER_CONFIG.version} started`);
  console.error(`📄 PDF operations ready`);
}

// Run server
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

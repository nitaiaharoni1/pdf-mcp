/**
 * MCP (Model Context Protocol) Type Definitions
 */

// MCP Tool Result Content
export interface MCPTextContent {
  type: 'text';
  text: string;
}

export interface MCPImageContent {
  type: 'image';
  data: string;
  mimeType: string;
}

export type MCPContent = MCPTextContent | MCPImageContent;

// MCP Tool Result
export interface MCPResult {
  content: MCPContent[];
  isError?: boolean;
}

// MCP Tool Input Schema Property
export interface MCPInputProperty {
  type: string;
  description: string;
  default?: any;
  enum?: string[];
  items?: MCPInputProperty;
  properties?: { [key: string]: MCPInputProperty };
  required?: string[];
}

// MCP Tool Input Schema
export interface MCPInputSchema {
  type: 'object';
  properties: { [key: string]: MCPInputProperty };
  required?: string[];
}

// MCP Tool Definition
export interface MCPToolDefinition {
  name: string;
  description: string;
  inputSchema: MCPInputSchema;
  handler: (args: any) => Promise<MCPResult>;
}

// MCP Tool Arguments (generic)
export interface MCPToolArgs {
  [key: string]: any;
}

// PDF-specific tool argument interfaces can be added here as needed

// MCP Server Configuration
export interface MCPServerConfig {
  name: string;
  version: string;
}

// MCP Error Response
export interface MCPError {
  code: number;
  message: string;
  data?: any;
}

// CLI Command Interfaces
export interface ParsedCommand {
  command: string | null;
  filePath?: string;
}

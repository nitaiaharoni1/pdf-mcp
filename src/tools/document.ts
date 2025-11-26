/**
 * PDF Document Tools - Open, create, save, get info
 */

import { MCPToolDefinition, MCPResult } from '../types/mcp';
import { getPDFManager } from '../pdf/pdf-manager';
import { metadataHandler } from '../pdf/metadata';

const pdfManager = getPDFManager();

export const documentTools: MCPToolDefinition[] = [
  {
    name: 'open_pdf',
    description: 'Open and read a PDF file. Returns a session ID for subsequent operations.',
    inputSchema: {
      type: 'object',
      properties: {
        file_path: {
          type: 'string',
          description: 'Absolute path to the PDF file',
        },
      },
      required: ['file_path'],
    },
    handler: async (args: { file_path: string }): Promise<MCPResult> => {
      try {
        const sessionId = await pdfManager.loadFromFile(args.file_path);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                session_id: sessionId,
                message: 'PDF opened successfully',
                file_path: args.file_path,
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error opening PDF: ${(error as Error).message}`,
            },
          ],
          isError: true,
        };
      }
    },
  },
  {
    name: 'create_pdf',
    description: 'Create a new blank PDF document. Returns a session ID.',
    inputSchema: {
      type: 'object',
      properties: {
        file_path: {
          type: 'string',
          description: 'Optional: Path where PDF will be saved',
        },
      },
    },
    handler: async (args: { file_path?: string }): Promise<MCPResult> => {
      try {
        const sessionId = await pdfManager.createSession(args.file_path);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                session_id: sessionId,
                message: 'PDF created successfully',
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error creating PDF: ${(error as Error).message}`,
            },
          ],
          isError: true,
        };
      }
    },
  },
  {
    name: 'save_pdf',
    description: 'Save PDF to file system',
    inputSchema: {
      type: 'object',
      properties: {
        session_id: {
          type: 'string',
          description: 'PDF session ID',
        },
        output_path: {
          type: 'string',
          description: 'Path where PDF should be saved',
        },
      },
      required: ['session_id', 'output_path'],
    },
    handler: async (args: { session_id: string; output_path: string }): Promise<MCPResult> => {
      try {
        await pdfManager.saveToFile(args.session_id, args.output_path);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                message: 'PDF saved successfully',
                output_path: args.output_path,
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error saving PDF: ${(error as Error).message}`,
            },
          ],
          isError: true,
        };
      }
    },
  },
  {
    name: 'close_pdf',
    description: 'Close PDF session and cleanup resources',
    inputSchema: {
      type: 'object',
      properties: {
        session_id: {
          type: 'string',
          description: 'PDF session ID to close',
        },
      },
      required: ['session_id'],
    },
    handler: async (args: { session_id: string }): Promise<MCPResult> => {
      try {
        pdfManager.closeSession(args.session_id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                message: 'PDF session closed successfully',
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error closing PDF: ${(error as Error).message}`,
            },
          ],
          isError: true,
        };
      }
    },
  },
  {
    name: 'get_pdf_info',
    description: 'Get PDF metadata, page count, size, encryption status',
    inputSchema: {
      type: 'object',
      properties: {
        session_id: {
          type: 'string',
          description: 'PDF session ID',
        },
      },
      required: ['session_id'],
    },
    handler: async (args: { session_id: string }): Promise<MCPResult> => {
      try {
        const info = await pdfManager.getInfo(args.session_id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(info, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error getting PDF info: ${(error as Error).message}`,
            },
          ],
          isError: true,
        };
      }
    },
  },
];


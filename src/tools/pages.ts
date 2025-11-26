/**
 * PDF Page Tools - Merge, split, rotate, delete pages
 */

import { MCPToolDefinition, MCPResult } from '../types/mcp';
import { pageOperations } from '../pdf/page-operations';

export const pageTools: MCPToolDefinition[] = [
  {
    name: 'get_pages',
    description: 'List all pages with dimensions',
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
        const pages = await pageOperations.getPages(args.session_id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ pages }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error getting pages: ${(error as Error).message}`,
            },
          ],
          isError: true,
        };
      }
    },
  },
  {
    name: 'merge_pdfs',
    description: 'Combine multiple PDFs into the current document',
    inputSchema: {
      type: 'object',
      properties: {
        session_id: {
          type: 'string',
          description: 'PDF session ID (target document)',
        },
        pdf_paths: {
          type: 'array',
          items: {
            type: 'string',
            description: 'PDF file path',
          },
          description: 'Array of PDF file paths to merge',
        },
      },
      required: ['session_id', 'pdf_paths'],
    },
    handler: async (args: { session_id: string; pdf_paths: string[] }): Promise<MCPResult> => {
      try {
        await pageOperations.mergePDFs(args.session_id, args.pdf_paths);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                message: 'PDFs merged successfully',
                merged_count: args.pdf_paths.length,
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error merging PDFs: ${(error as Error).message}`,
            },
          ],
          isError: true,
        };
      }
    },
  },
  {
    name: 'split_pdf',
    description: 'Split PDF into separate files (one per page)',
    inputSchema: {
      type: 'object',
      properties: {
        session_id: {
          type: 'string',
          description: 'PDF session ID',
        },
        output_dir: {
          type: 'string',
          description: 'Directory where split PDFs will be saved',
        },
      },
      required: ['session_id', 'output_dir'],
    },
    handler: async (args: { session_id: string; output_dir: string }): Promise<MCPResult> => {
      try {
        const outputPaths = await pageOperations.splitPDF(args.session_id, args.output_dir);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                message: 'PDF split successfully',
                output_paths: outputPaths,
                page_count: outputPaths.length,
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error splitting PDF: ${(error as Error).message}`,
            },
          ],
          isError: true,
        };
      }
    },
  },
  {
    name: 'rotate_page',
    description: 'Rotate specific pages',
    inputSchema: {
      type: 'object',
      properties: {
        session_id: {
          type: 'string',
          description: 'PDF session ID',
        },
        page_number: {
          type: 'number',
          description: 'Page number to rotate (1-based)',
        },
        degrees: {
          type: 'number',
          description: 'Rotation angle in degrees (will be normalized to 0, 90, 180, or 270)',
        },
      },
      required: ['session_id', 'page_number', 'degrees'],
    },
    handler: async (args: { session_id: string; page_number: number; degrees: number }): Promise<MCPResult> => {
      try {
        await pageOperations.rotatePage(args.session_id, args.page_number, args.degrees);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                message: 'Page rotated successfully',
                page_number: args.page_number,
                degrees: args.degrees,
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error rotating page: ${(error as Error).message}`,
            },
          ],
          isError: true,
        };
      }
    },
  },
  {
    name: 'delete_pages',
    description: 'Remove pages from PDF',
    inputSchema: {
      type: 'object',
      properties: {
        session_id: {
          type: 'string',
          description: 'PDF session ID',
        },
        page_numbers: {
          type: 'array',
          items: {
            type: 'number',
            description: 'Page number (1-based)',
          },
          description: 'Array of page numbers to delete (1-based)',
        },
      },
      required: ['session_id', 'page_numbers'],
    },
    handler: async (args: { session_id: string; page_numbers: number[] }): Promise<MCPResult> => {
      try {
        await pageOperations.deletePages(args.session_id, args.page_numbers);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                message: 'Pages deleted successfully',
                deleted_count: args.page_numbers.length,
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error deleting pages: ${(error as Error).message}`,
            },
          ],
          isError: true,
        };
      }
    },
  },
  {
    name: 'extract_pages',
    description: 'Extract pages to new PDF file',
    inputSchema: {
      type: 'object',
      properties: {
        session_id: {
          type: 'string',
          description: 'PDF session ID',
        },
        page_numbers: {
          type: 'array',
          items: {
            type: 'number',
            description: 'Page number (1-based)',
          },
          description: 'Array of page numbers to extract (1-based)',
        },
        output_path: {
          type: 'string',
          description: 'Path where extracted PDF will be saved',
        },
      },
      required: ['session_id', 'page_numbers', 'output_path'],
    },
    handler: async (args: {
      session_id: string;
      page_numbers: number[];
      output_path: string;
    }): Promise<MCPResult> => {
      try {
        await pageOperations.extractPages(args.session_id, args.page_numbers, args.output_path);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                message: 'Pages extracted successfully',
                output_path: args.output_path,
                page_count: args.page_numbers.length,
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error extracting pages: ${(error as Error).message}`,
            },
          ],
          isError: true,
        };
      }
    },
  },
];


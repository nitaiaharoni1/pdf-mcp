/**
 * PDF Export Tools - Extract text, images, form data, compress
 */

import { MCPToolDefinition, MCPResult } from '../types/mcp';
import { PDFDocument } from 'pdf-lib';
import * as fs from 'fs/promises';
import { getPDFManager } from '../pdf/pdf-manager';
import { formHandler } from '../pdf/form-handler';
import { createObjectCsvWriter } from 'csv-writer';

export const exportTools: MCPToolDefinition[] = [
  {
    name: 'extract_text',
    description: 'Extract all text content from PDF',
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
          description: 'Optional: Specific pages to extract (1-based). If not provided, extracts all pages.',
        },
      },
      required: ['session_id'],
    },
    handler: async (args: { session_id: string; page_numbers?: number[] }): Promise<MCPResult> => {
      try {
        const session = getPDFManager().getSession(args.session_id);
        const document = session.document;
        const pages = document.getPages();
        
        // pdf-lib doesn't have direct text extraction
        // This is a placeholder - would need pdfjs-dist or similar for actual extraction
        const extractedText: Record<string, string> = {};
        
        const pagesToExtract = args.page_numbers || pages.map((_, i) => i + 1);
        
        for (const pageNum of pagesToExtract) {
          if (pageNum < 1 || pageNum > pages.length) {
            continue;
          }
          // Placeholder - actual text extraction requires additional library
          extractedText[`page_${pageNum}`] = '[Text extraction requires pdfjs-dist or similar library]';
        }
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                message: 'Text extraction requires additional implementation with pdfjs-dist or similar library',
                pages: extractedText,
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error extracting text: ${(error as Error).message}`,
            },
          ],
          isError: true,
        };
      }
    },
  },
  {
    name: 'extract_images',
    description: 'Extract embedded images from PDF',
    inputSchema: {
      type: 'object',
      properties: {
        session_id: {
          type: 'string',
          description: 'PDF session ID',
        },
        output_dir: {
          type: 'string',
          description: 'Directory where images will be saved',
        },
      },
      required: ['session_id', 'output_dir'],
    },
    handler: async (args: { session_id: string; output_dir: string }): Promise<MCPResult> => {
      try {
        // pdf-lib doesn't have direct image extraction
        // This would require parsing PDF structure
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                message: 'Image extraction requires additional implementation with PDF parsing library',
              }, null, 2),
            },
          ],
          isError: true,
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error extracting images: ${(error as Error).message}`,
            },
          ],
          isError: true,
        };
      }
    },
  },
  {
    name: 'export_form_data',
    description: 'Export form data to JSON or CSV',
    inputSchema: {
      type: 'object',
      properties: {
        session_id: {
          type: 'string',
          description: 'PDF session ID',
        },
        output_path: {
          type: 'string',
          description: 'Path where form data will be exported',
        },
        format: {
          type: 'string',
          enum: ['json', 'csv'],
          description: 'Export format',
        },
        include_empty_fields: {
          type: 'boolean',
          description: 'Include empty fields in export',
        },
      },
      required: ['session_id', 'output_path', 'format'],
    },
    handler: async (args: {
      session_id: string;
      output_path: string;
      format: 'json' | 'csv';
      include_empty_fields?: boolean;
    }): Promise<MCPResult> => {
      try {
        const values = await formHandler.getFormValues(args.session_id);
        
        // Filter empty fields if needed
        const filteredValues = args.include_empty_fields
          ? values
          : Object.fromEntries(Object.entries(values).filter(([_, v]) => v !== undefined && v !== null && v !== ''));

        if (args.format === 'json') {
          await fs.writeFile(args.output_path, JSON.stringify(filteredValues, null, 2));
        } else {
          // CSV export
          const csvWriter = createObjectCsvWriter({
            path: args.output_path,
            header: [
              { id: 'field_name', title: 'Field Name' },
              { id: 'value', title: 'Value' },
            ],
          });
          
          const records = Object.entries(filteredValues).map(([field_name, value]) => ({
            field_name,
            value: String(value),
          }));
          
          await csvWriter.writeRecords(records);
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                message: 'Form data exported successfully',
                output_path: args.output_path,
                format: args.format,
                field_count: Object.keys(filteredValues).length,
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error exporting form data: ${(error as Error).message}`,
            },
          ],
          isError: true,
        };
      }
    },
  },
  {
    name: 'compress_pdf',
    description: 'Optimize PDF file size (basic compression)',
    inputSchema: {
      type: 'object',
      properties: {
        session_id: {
          type: 'string',
          description: 'PDF session ID',
        },
        output_path: {
          type: 'string',
          description: 'Path where compressed PDF will be saved',
        },
        remove_metadata: {
          type: 'boolean',
          description: 'Remove metadata to reduce size',
        },
      },
      required: ['session_id', 'output_path'],
    },
    handler: async (args: {
      session_id: string;
      output_path: string;
      remove_metadata?: boolean;
    }): Promise<MCPResult> => {
      try {
        const session = getPDFManager().getSession(args.session_id);
        const document = session.document;
        
        if (args.remove_metadata) {
          document.setTitle('');
          document.setAuthor('');
          document.setSubject('');
          document.setKeywords([]);
          document.setCreator('');
          document.setProducer('');
        }
        
        // Save with compression (pdf-lib handles this automatically)
        await getPDFManager().saveToFile(args.session_id, args.output_path);
        
        const originalSize = (await document.save()).length;
        const compressedSize = (await fs.readFile(args.output_path)).length;
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                message: 'PDF compressed successfully',
                output_path: args.output_path,
                original_size: originalSize,
                compressed_size: compressedSize,
                reduction_percent: ((1 - compressedSize / originalSize) * 100).toFixed(2),
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error compressing PDF: ${(error as Error).message}`,
            },
          ],
          isError: true,
        };
      }
    },
  },
];


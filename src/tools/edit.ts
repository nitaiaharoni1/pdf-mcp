/**
 * PDF Editing Tools - Text, images, annotations, watermarks
 */

import { MCPToolDefinition, MCPResult } from '../types/mcp';
import { pdfEditor } from '../pdf/editor';
import { metadataHandler } from '../pdf/metadata';

export const editTools: MCPToolDefinition[] = [
  {
    name: 'add_text',
    description: 'Add text to PDF at coordinates with styling',
    inputSchema: {
      type: 'object',
      properties: {
        session_id: {
          type: 'string',
          description: 'PDF session ID',
        },
        page_number: {
          type: 'number',
          description: 'Page number (1-based)',
        },
        text: {
          type: 'string',
          description: 'Text to add',
        },
        x: {
          type: 'number',
          description: 'X coordinate',
        },
        y: {
          type: 'number',
          description: 'Y coordinate',
        },
        font_size: {
          type: 'number',
          description: 'Font size (default: 12)',
        },
        font_path: {
          type: 'string',
          description: 'Optional: Absolute path to custom font file (TTF/OTF) for Hebrew/Unicode support. If not provided, uses default font which may not support Hebrew.',
        },
        color: {
          type: 'string',
          description: 'Text color in hex format (default: #000000)',
        },
      },
      required: ['session_id', 'page_number', 'text', 'x', 'y'],
    },
    handler: async (args: {
      session_id: string;
      page_number: number;
      text: string;
      x: number;
      y: number;
      font_size?: number;
      font_path?: string;
      color?: string;
    }): Promise<MCPResult> => {
      try {
        await pdfEditor.addText(
          args.session_id,
          args.page_number,
          args.text,
          args.x,
          args.y,
          {
            fontSize: args.font_size,
            fontPath: args.font_path,
            color: args.color,
          }
        );
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                message: 'Text added successfully',
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error adding text: ${(error as Error).message}`,
            },
          ],
          isError: true,
        };
      }
    },
  },
  {
    name: 'add_image',
    description: 'Insert image into PDF',
    inputSchema: {
      type: 'object',
      properties: {
        session_id: {
          type: 'string',
          description: 'PDF session ID',
        },
        page_number: {
          type: 'number',
          description: 'Page number (1-based)',
        },
        image_path: {
          type: 'string',
          description: 'Path to image file',
        },
        x: {
          type: 'number',
          description: 'X coordinate',
        },
        y: {
          type: 'number',
          description: 'Y coordinate',
        },
        width: {
          type: 'number',
          description: 'Image width (optional)',
        },
        height: {
          type: 'number',
          description: 'Image height (optional)',
        },
      },
      required: ['session_id', 'page_number', 'image_path', 'x', 'y'],
    },
    handler: async (args: {
      session_id: string;
      page_number: number;
      image_path: string;
      x: number;
      y: number;
      width?: number;
      height?: number;
    }): Promise<MCPResult> => {
      try {
        await pdfEditor.addImage(
          args.session_id,
          args.page_number,
          args.image_path,
          args.x,
          args.y,
          args.width,
          args.height
        );
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                message: 'Image added successfully',
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error adding image: ${(error as Error).message}`,
            },
          ],
          isError: true,
        };
      }
    },
  },
  {
    name: 'add_annotation',
    description: 'Add comments, highlights, notes to PDF',
    inputSchema: {
      type: 'object',
      properties: {
        session_id: {
          type: 'string',
          description: 'PDF session ID',
        },
        type: {
          type: 'string',
          enum: ['text', 'highlight', 'note'],
          description: 'Annotation type',
        },
        page_number: {
          type: 'number',
          description: 'Page number (1-based)',
        },
        x: {
          type: 'number',
          description: 'X coordinate',
        },
        y: {
          type: 'number',
          description: 'Y coordinate',
        },
        width: {
          type: 'number',
          description: 'Width (for highlight)',
        },
        height: {
          type: 'number',
          description: 'Height (for highlight)',
        },
        content: {
          type: 'string',
          description: 'Annotation content (for text/note)',
        },
        color: {
          type: 'string',
          description: 'Color in hex format (default: #FFFF00 for highlight)',
        },
      },
      required: ['session_id', 'type', 'page_number', 'x', 'y'],
    },
    handler: async (args: {
      session_id: string;
      type: 'text' | 'highlight' | 'note';
      page_number: number;
      x: number;
      y: number;
      width?: number;
      height?: number;
      content?: string;
      color?: string;
    }): Promise<MCPResult> => {
      try {
        await pdfEditor.addAnnotation(args.session_id, {
          type: args.type,
          pageNumber: args.page_number,
          x: args.x,
          y: args.y,
          width: args.width,
          height: args.height,
          content: args.content,
          color: args.color,
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                message: 'Annotation added successfully',
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error adding annotation: ${(error as Error).message}`,
            },
          ],
          isError: true,
        };
      }
    },
  },
  {
    name: 'add_watermark',
    description: 'Add text or image watermark to all pages',
    inputSchema: {
      type: 'object',
      properties: {
        session_id: {
          type: 'string',
          description: 'PDF session ID',
        },
        text: {
          type: 'string',
          description: 'Watermark text (if using text watermark)',
        },
        image_path: {
          type: 'string',
          description: 'Path to watermark image (if using image watermark)',
        },
        opacity: {
          type: 'number',
          description: 'Opacity (0-1, default: 0.3)',
        },
        rotation: {
          type: 'number',
          description: 'Rotation angle in degrees (default: -45)',
        },
        font_size: {
          type: 'number',
          description: 'Font size for text watermark (default: 48)',
        },
        font_path: {
          type: 'string',
          description: 'Optional: Absolute path to custom font file (TTF/OTF) for Hebrew/Unicode support in watermark text.',
        },
        color: {
          type: 'string',
          description: 'Color for text watermark (default: #CCCCCC)',
        },
      },
      required: ['session_id'],
    },
    handler: async (args: {
      session_id: string;
      text?: string;
      image_path?: string;
      opacity?: number;
      rotation?: number;
      font_size?: number;
      font_path?: string;
      color?: string;
    }): Promise<MCPResult> => {
      try {
        if (!args.text && !args.image_path) {
          throw new Error('Either text or image_path must be provided');
        }
        await pdfEditor.addWatermark(args.session_id, {
          text: args.text,
          imagePath: args.image_path,
          opacity: args.opacity,
          rotation: args.rotation,
          fontSize: args.font_size,
          fontPath: args.font_path,
          color: args.color,
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                message: 'Watermark added successfully',
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error adding watermark: ${(error as Error).message}`,
            },
          ],
          isError: true,
        };
      }
    },
  },
  {
    name: 'modify_metadata',
    description: 'Update PDF metadata (title, author, subject, keywords)',
    inputSchema: {
      type: 'object',
      properties: {
        session_id: {
          type: 'string',
          description: 'PDF session ID',
        },
        title: {
          type: 'string',
          description: 'Document title',
        },
        author: {
          type: 'string',
          description: 'Document author',
        },
        subject: {
          type: 'string',
          description: 'Document subject',
        },
        keywords: {
          type: 'string',
          description: 'Comma-separated keywords',
        },
        creator: {
          type: 'string',
          description: 'Document creator',
        },
        producer: {
          type: 'string',
          description: 'Document producer',
        },
      },
      required: ['session_id'],
    },
    handler: async (args: {
      session_id: string;
      title?: string;
      author?: string;
      subject?: string;
      keywords?: string;
      creator?: string;
      producer?: string;
    }): Promise<MCPResult> => {
      try {
        await metadataHandler.setMetadata(args.session_id, {
          title: args.title,
          author: args.author,
          subject: args.subject,
          keywords: args.keywords ? args.keywords.split(',').map(k => k.trim()) : undefined,
          creator: args.creator,
          producer: args.producer,
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                message: 'Metadata updated successfully',
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error modifying metadata: ${(error as Error).message}`,
            },
          ],
          isError: true,
        };
      }
    },
  },
];


/**
 * PDF Signature Tools - Visual and digital signatures
 */

import { MCPToolDefinition, MCPResult } from '../types/mcp';
import { signatureHandler } from '../pdf/signature-handler';

export const signatureTools: MCPToolDefinition[] = [
  {
    name: 'add_visual_signature',
    description: 'Add image-based signature to PDF',
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
          description: 'Path to signature image file',
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
          description: 'Signature width',
        },
        height: {
          type: 'number',
          description: 'Signature height',
        },
      },
      required: ['session_id', 'page_number', 'image_path', 'x', 'y', 'width', 'height'],
    },
    handler: async (args: {
      session_id: string;
      page_number: number;
      image_path: string;
      x: number;
      y: number;
      width: number;
      height: number;
    }): Promise<MCPResult> => {
      try {
        await signatureHandler.addVisualSignature(
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
                message: 'Visual signature added successfully',
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error adding visual signature: ${(error as Error).message}`,
            },
          ],
          isError: true,
        };
      }
    },
  },
  {
    name: 'create_signature_field',
    description: 'Create signature field in PDF form',
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
        field_name: {
          type: 'string',
          description: 'Name for the signature field',
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
          description: 'Field width',
        },
        height: {
          type: 'number',
          description: 'Field height',
        },
      },
      required: ['session_id', 'page_number', 'field_name', 'x', 'y', 'width', 'height'],
    },
    handler: async (args: {
      session_id: string;
      page_number: number;
      field_name: string;
      x: number;
      y: number;
      width: number;
      height: number;
    }): Promise<MCPResult> => {
      try {
        await signatureHandler.createSignatureField(
          args.session_id,
          args.page_number,
          args.field_name,
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
                message: 'Signature field created successfully',
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error creating signature field: ${(error as Error).message}`,
            },
          ],
          isError: true,
        };
      }
    },
  },
  {
    name: 'sign_pdf_digital',
    description: 'Apply digital signature with certificate (requires node-forge implementation)',
    inputSchema: {
      type: 'object',
      properties: {
        session_id: {
          type: 'string',
          description: 'PDF session ID',
        },
        certificate_path: {
          type: 'string',
          description: 'Path to X.509 certificate file',
        },
        password: {
          type: 'string',
          description: 'Certificate password',
        },
      },
      required: ['session_id', 'certificate_path', 'password'],
    },
    handler: async (args: {
      session_id: string;
      certificate_path: string;
      password: string;
    }): Promise<MCPResult> => {
      try {
        await signatureHandler.signPDFDigital(args.session_id, args.certificate_path, args.password);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                message: 'Digital signature applied successfully',
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error applying digital signature: ${(error as Error).message}`,
            },
          ],
          isError: true,
        };
      }
    },
  },
  {
    name: 'verify_signature',
    description: 'Verify existing digital signatures',
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
        const signatures = await signatureHandler.verifySignature(args.session_id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                signatures,
                signature_count: signatures.length,
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error verifying signatures: ${(error as Error).message}`,
            },
          ],
          isError: true,
        };
      }
    },
  },
];


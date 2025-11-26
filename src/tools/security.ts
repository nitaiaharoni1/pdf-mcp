/**
 * PDF Security Tools - Encryption, decryption, permissions
 */

import { MCPToolDefinition, MCPResult } from '../types/mcp';
import { pdfEncryption } from '../pdf/encryption';

export const securityTools: MCPToolDefinition[] = [
  {
    name: 'encrypt_pdf',
    description: 'Add password protection and permissions (limited support - requires additional implementation)',
    inputSchema: {
      type: 'object',
      properties: {
        session_id: {
          type: 'string',
          description: 'PDF session ID',
        },
        user_password: {
          type: 'string',
          description: 'User password',
        },
        owner_password: {
          type: 'string',
          description: 'Owner password (optional)',
        },
        allow_printing: {
          type: 'string',
          enum: ['low', 'high', 'none'],
          description: 'Printing permission level',
        },
        allow_modifying: {
          type: 'boolean',
          description: 'Allow modifying document',
        },
        allow_copying: {
          type: 'boolean',
          description: 'Allow copying content',
        },
      },
      required: ['session_id', 'user_password'],
    },
    handler: async (args: {
      session_id: string;
      user_password: string;
      owner_password?: string;
      allow_printing?: 'low' | 'high' | 'none';
      allow_modifying?: boolean;
      allow_copying?: boolean;
    }): Promise<MCPResult> => {
      try {
        await pdfEncryption.encryptPDF(args.session_id, {
          userPassword: args.user_password,
          ownerPassword: args.owner_password,
          permissions: {
            printing: args.allow_printing,
            modifying: args.allow_modifying,
            copying: args.allow_copying,
          },
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                message: 'PDF encryption is not yet fully implemented. pdf-lib has limited encryption support.',
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
              text: `Error encrypting PDF: ${(error as Error).message}`,
            },
          ],
          isError: true,
        };
      }
    },
  },
  {
    name: 'decrypt_pdf',
    description: 'Remove password protection (handled during PDF loading)',
    inputSchema: {
      type: 'object',
      properties: {
        session_id: {
          type: 'string',
          description: 'PDF session ID',
        },
        password: {
          type: 'string',
          description: 'Password to decrypt',
        },
      },
      required: ['session_id', 'password'],
    },
    handler: async (args: { session_id: string; password: string }): Promise<MCPResult> => {
      try {
        await pdfEncryption.decryptPDF(args.session_id, args.password);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                message: 'Decryption should be handled during PDF loading. Provide password when loading PDF.',
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
              text: `Error decrypting PDF: ${(error as Error).message}`,
            },
          ],
          isError: true,
        };
      }
    },
  },
  {
    name: 'set_permissions',
    description: 'Set printing, copying, editing permissions (requires encryption)',
    inputSchema: {
      type: 'object',
      properties: {
        session_id: {
          type: 'string',
          description: 'PDF session ID',
        },
        allow_printing: {
          type: 'string',
          enum: ['low', 'high', 'none'],
          description: 'Printing permission level',
        },
        allow_modifying: {
          type: 'boolean',
          description: 'Allow modifying document',
        },
        allow_copying: {
          type: 'boolean',
          description: 'Allow copying content',
        },
        allow_annotating: {
          type: 'boolean',
          description: 'Allow annotations',
        },
        allow_filling_forms: {
          type: 'boolean',
          description: 'Allow filling forms',
        },
        allow_extracting_content: {
          type: 'boolean',
          description: 'Allow extracting content',
        },
        allow_assembling: {
          type: 'boolean',
          description: 'Allow assembling document',
        },
      },
      required: ['session_id'],
    },
    handler: async (args: {
      session_id: string;
      allow_printing?: 'low' | 'high' | 'none';
      allow_modifying?: boolean;
      allow_copying?: boolean;
      allow_annotating?: boolean;
      allow_filling_forms?: boolean;
      allow_extracting_content?: boolean;
      allow_assembling?: boolean;
    }): Promise<MCPResult> => {
      try {
        await pdfEncryption.setPermissions(args.session_id, {
          printing: args.allow_printing,
          modifying: args.allow_modifying,
          copying: args.allow_copying,
          annotating: args.allow_annotating,
          fillingForms: args.allow_filling_forms,
          extractingContent: args.allow_extracting_content,
          assembling: args.allow_assembling,
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                message: 'Setting permissions requires encryption, which is not yet fully implemented.',
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
              text: `Error setting permissions: ${(error as Error).message}`,
            },
          ],
          isError: true,
        };
      }
    },
  },
  {
    name: 'get_security_info',
    description: 'Check encryption and permissions',
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
        const securityInfo = await pdfEncryption.getSecurityInfo(args.session_id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(securityInfo, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error getting security info: ${(error as Error).message}`,
            },
          ],
          isError: true,
        };
      }
    },
  },
];


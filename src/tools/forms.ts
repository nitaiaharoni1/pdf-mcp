/**
 * PDF Form Tools - Form field operations
 */

import { MCPToolDefinition, MCPResult } from '../types/mcp';
import { formHandler } from '../pdf/form-handler';

export const formTools: MCPToolDefinition[] = [
  {
    name: 'list_form_fields',
    description: 'List all form fields with types and values',
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
        const fields = await formHandler.listFormFields(args.session_id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ fields }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error listing form fields: ${(error as Error).message}`,
            },
          ],
          isError: true,
        };
      }
    },
  },
  {
    name: 'fill_form_field',
    description: 'Fill a specific form field (text, checkbox, radio, dropdown)',
    inputSchema: {
      type: 'object',
      properties: {
        session_id: {
          type: 'string',
          description: 'PDF session ID',
        },
        field_name: {
          type: 'string',
          description: 'Name of the form field',
        },
        value: {
          type: 'string',
          description: 'Value to set (string for text/radio/dropdown, boolean string for checkbox)',
        },
      },
      required: ['session_id', 'field_name', 'value'],
    },
    handler: async (args: { session_id: string; field_name: string; value: string }): Promise<MCPResult> => {
      try {
        // Parse value - could be string, boolean, or array
        let parsedValue: string | boolean | string[];
        
        // Try to parse as boolean
        if (args.value === 'true' || args.value === 'false') {
          parsedValue = args.value === 'true';
        } else if (args.value.startsWith('[') && args.value.endsWith(']')) {
          // Try to parse as array
          parsedValue = JSON.parse(args.value);
        } else {
          parsedValue = args.value;
        }

        await formHandler.fillFormField(args.session_id, args.field_name, parsedValue);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                message: 'Form field filled successfully',
                field_name: args.field_name,
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error filling form field: ${(error as Error).message}`,
            },
          ],
          isError: true,
        };
      }
    },
  },
  {
    name: 'fill_form_fields',
    description: 'Fill multiple form fields at once. Provide a JSON object with field names as keys and values as values. Values can be strings, booleans (for checkboxes), or arrays (for dropdowns).',
    inputSchema: {
      type: 'object',
      properties: {
        session_id: {
          type: 'string',
          description: 'PDF session ID',
        },
        fields: {
          type: 'object',
          description: 'Object mapping field names to values. Values can be strings, booleans, or arrays. Example: {"name": "John", "age": "30", "agree": true}',
        },
      },
      required: ['session_id', 'fields'],
    },
    handler: async (args: { session_id: string; fields: Record<string, any> }): Promise<MCPResult> => {
      try {
        // Parse and normalize field values
        const normalizedFields: Record<string, string | boolean | string[]> = {};
        
        for (const [fieldName, value] of Object.entries(args.fields)) {
          if (typeof value === 'boolean') {
            normalizedFields[fieldName] = value;
          } else if (typeof value === 'string') {
            // Try to parse boolean strings
            if (value === 'true' || value === 'false') {
              normalizedFields[fieldName] = value === 'true';
            } else if (value.startsWith('[') && value.endsWith(']')) {
              // Try to parse as array
              try {
                normalizedFields[fieldName] = JSON.parse(value);
              } catch {
                normalizedFields[fieldName] = value;
              }
            } else {
              normalizedFields[fieldName] = value;
            }
          } else if (Array.isArray(value)) {
            normalizedFields[fieldName] = value;
          } else {
            normalizedFields[fieldName] = String(value);
          }
        }

        const result = await formHandler.fillFormFields(args.session_id, normalizedFields);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                message: `Filled ${result.filled.length} field(s) successfully`,
                filled: result.filled,
                errors: result.errors.length > 0 ? result.errors : undefined,
              }, null, 2),
            },
          ],
          isError: result.errors.length > 0 && result.filled.length === 0,
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error filling form fields: ${(error as Error).message}`,
            },
          ],
          isError: true,
        };
      }
    },
  },
  {
    name: 'get_form_values',
    description: 'Get all current form values',
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
        const values = await formHandler.getFormValues(args.session_id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ values }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error getting form values: ${(error as Error).message}`,
            },
          ],
          isError: true,
        };
      }
    },
  },
  {
    name: 'flatten_form',
    description: 'Flatten form to make fields non-editable',
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
        await formHandler.flattenForm(args.session_id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                message: 'Form flattened successfully',
              }, null, 2),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error flattening form: ${(error as Error).message}`,
            },
          ],
          isError: true,
        };
      }
    },
  },
];


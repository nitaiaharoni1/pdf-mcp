/**
 * Tools Unit Tests
 * Tests for MCP tool registration and handling for PDF tools
 */

import { getToolDefinitions } from '../src/tools/index';

describe('Tools Module', () => {
  describe('getToolDefinitions', () => {
    test('should return all available tool definitions', () => {
      const tools = getToolDefinitions();

      expect(Array.isArray(tools)).toBe(true);
      expect(tools.length).toBeGreaterThan(0);

      // Check that all tools have required properties
      tools.forEach((tool) => {
        expect(tool).toHaveProperty('name');
        expect(tool).toHaveProperty('description');
        expect(tool).toHaveProperty('inputSchema');

        expect(typeof tool.name).toBe('string');
        expect(typeof tool.description).toBe('string');
        expect(typeof tool.inputSchema).toBe('object');
      });
    });

    test('should include all expected PDF tool categories', () => {
      const tools = getToolDefinitions();
      const toolNames = tools.map((tool) => tool.name);

      // Document tools
      expect(toolNames).toContain('open_pdf');
      expect(toolNames).toContain('create_pdf');
      expect(toolNames).toContain('save_pdf');
      expect(toolNames).toContain('close_pdf');
      expect(toolNames).toContain('get_pdf_info');

      // Form tools
      expect(toolNames).toContain('list_form_fields');
      expect(toolNames).toContain('fill_form_field');
      expect(toolNames).toContain('get_form_values');
      expect(toolNames).toContain('flatten_form');

      // Page tools
      expect(toolNames).toContain('get_pages');
      expect(toolNames).toContain('merge_pdfs');
      expect(toolNames).toContain('split_pdf');
      expect(toolNames).toContain('rotate_page');
      expect(toolNames).toContain('delete_pages');
      expect(toolNames).toContain('extract_pages');
    });

    test('should have valid input schemas for all tools', () => {
      const tools = getToolDefinitions();

      tools.forEach((tool) => {
        const schema = tool.inputSchema;

        expect(schema.type).toBe('object');
        expect(schema).toHaveProperty('properties');
        expect(typeof schema.properties).toBe('object');

        // If required array exists, it should be an array
        if (schema.required) {
          expect(Array.isArray(schema.required)).toBe(true);
        }

        // Check that all required properties exist in properties
        if (schema.required) {
          schema.required.forEach((reqProp) => {
            expect(schema.properties).toHaveProperty(reqProp);
          });
        }
      });
    });

    test('should have unique tool names', () => {
      const tools = getToolDefinitions();
      const toolNames = tools.map((tool) => tool.name);
      const uniqueNames = new Set(toolNames);

      expect(uniqueNames.size).toBe(toolNames.length);
    });

    test('should have non-empty descriptions for all tools', () => {
      const tools = getToolDefinitions();

      tools.forEach((tool) => {
        expect(tool.description.trim().length).toBeGreaterThan(0);
        expect(tool.description).toMatch(/\w/); // Contains at least one word character
      });
    });

    test('should include PDF-related information in descriptions', () => {
      const tools = getToolDefinitions();
      let toolsWithPDFMention = 0;

      tools.forEach((tool) => {
        // Most tools should mention PDF or related terms
        const description = tool.description.toLowerCase();
        const mentionsPDF =
          description.includes('pdf') ||
          description.includes('document') ||
          description.includes('form') ||
          description.includes('page') ||
          description.includes('signature') ||
          description.includes('metadata') ||
          description.includes('watermark') ||
          description.includes('annotation') ||
          description.includes('session') ||
          description.includes('file');

        if (mentionsPDF) {
          toolsWithPDFMention++;
        }
      });

      // At least 90% of tools should mention PDF-related terms
      const percentage = (toolsWithPDFMention / tools.length) * 100;
      expect(percentage).toBeGreaterThanOrEqual(90);
    });
  });

  describe('Tool Input Schema Validation', () => {
    test('open_pdf should have correct schema', () => {
      const tools = getToolDefinitions();
      const openTool = tools.find((tool) => tool.name === 'open_pdf');

      expect(openTool).toBeDefined();
      expect(openTool!.inputSchema.required).toContain('file_path');
      expect(openTool!.inputSchema.properties).toHaveProperty('file_path');
      expect(openTool!.inputSchema.properties.file_path.type).toBe('string');
    });

    test('create_pdf should have correct schema', () => {
      const tools = getToolDefinitions();
      const createTool = tools.find((tool) => tool.name === 'create_pdf');

      expect(createTool).toBeDefined();
      expect(createTool!.inputSchema.properties).toHaveProperty('file_path');
      expect(createTool!.inputSchema.properties.file_path.type).toBe('string');
    });

    test('list_form_fields should have correct schema', () => {
      const tools = getToolDefinitions();
      const listFieldsTool = tools.find((tool) => tool.name === 'list_form_fields');

      expect(listFieldsTool).toBeDefined();
      expect(listFieldsTool!.inputSchema.required).toContain('session_id');
      expect(listFieldsTool!.inputSchema.properties).toHaveProperty('session_id');
      expect(listFieldsTool!.inputSchema.properties.session_id.type).toBe('string');
    });

    test('fill_form_field should have correct schema', () => {
      const tools = getToolDefinitions();
      const fillTool = tools.find((tool) => tool.name === 'fill_form_field');

      expect(fillTool).toBeDefined();
      expect(fillTool!.inputSchema.required).toContain('session_id');
      expect(fillTool!.inputSchema.required).toContain('field_name');
      expect(fillTool!.inputSchema.required).toContain('value');
      expect(fillTool!.inputSchema.properties).toHaveProperty('session_id');
      expect(fillTool!.inputSchema.properties).toHaveProperty('field_name');
      expect(fillTool!.inputSchema.properties).toHaveProperty('value');
    });

    test('get_pages should have correct schema', () => {
      const tools = getToolDefinitions();
      const getPagesTool = tools.find((tool) => tool.name === 'get_pages');

      expect(getPagesTool).toBeDefined();
      expect(getPagesTool!.inputSchema.required).toContain('session_id');
      expect(getPagesTool!.inputSchema.properties).toHaveProperty('session_id');
      expect(getPagesTool!.inputSchema.properties.session_id.type).toBe('string');
    });
  });
});

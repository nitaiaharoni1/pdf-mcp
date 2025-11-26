/**
 * Application Constants
 */

import { MCPServerConfig } from '../types/mcp';

// PDF operation limits
export const PDF_LIMITS = {
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100 MB
  MAX_PAGES: 10000,
  MAX_SESSION_SIZE: 500 * 1024 * 1024, // 500 MB total in memory
  SESSION_TIMEOUT: 3600000, // 1 hour in milliseconds
} as const;

// Server configuration
export const SERVER_CONFIG: MCPServerConfig = {
  name: 'pdf-mcp',
  version: '1.0.0',
} as const;

// Supported PDF features
export const SUPPORTED_FEATURES = [
  'forms',
  'signatures',
  'encryption',
  'annotations',
  'watermarks',
  'merge',
  'split',
  'extract',
] as const;

// Temporary directory for PDF operations
export const TEMP_DIR = process.env.TEMP_DIR || '/tmp/pdf-mcp';

// Maximum search results
export const MAX_SEARCH_RESULTS = 50;

// Tool categories for PDF operations
export const TOOL_CATEGORIES = {
  DOCUMENT: 'Document Operations',
  FORMS: 'Form Operations',
  EDIT: 'Editing Operations',
  PAGES: 'Page Operations',
  SIGNATURES: 'Signature Operations',
  SECURITY: 'Security Operations',
  EXPORT: 'Export Operations',
} as const;

// Default PDF settings
export const DEFAULT_PDF_SETTINGS = {
  pageSize: 'A4',
  orientation: 'portrait',
  fontSize: 12,
  fontFamily: 'Helvetica',
  color: '#000000',
} as const;

// Supported image formats
export const SUPPORTED_IMAGE_FORMATS = [
  'png',
  'jpg',
  'jpeg',
  'gif',
  'webp',
] as const;

// PDF MIME type
export const PDF_MIME_TYPE = 'application/pdf';

// File validation patterns
export const FILE_PATTERNS = {
  pdf: /\.pdf$/i,
  image: /\.(png|jpg|jpeg|gif|webp)$/i,
} as const;

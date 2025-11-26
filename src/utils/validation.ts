/**
 * PDF Validation Utilities
 */

import { PDF_LIMITS } from '../config/constants';

/**
 * Validate PDF file path format
 */
export const validatePDFPath = (filePath: string): void => {
  if (!filePath || typeof filePath !== 'string') {
    throw new Error('File path must be a non-empty string');
  }

  if (!filePath.endsWith('.pdf')) {
    throw new Error('File must have .pdf extension');
  }
};

/**
 * Validate session ID format
 */
export const validateSessionId = (sessionId: string): void => {
  if (!sessionId || typeof sessionId !== 'string') {
    throw new Error('Session ID must be a non-empty string');
  }

  if (!sessionId.startsWith('pdf_')) {
    throw new Error('Invalid session ID format');
  }
};

/**
 * Validate page number
 */
export const validatePageNumber = (pageNumber: number, maxPages: number): void => {
  if (!Number.isInteger(pageNumber) || pageNumber < 1) {
    throw new Error('Page number must be a positive integer');
  }

  if (pageNumber > maxPages) {
    throw new Error(`Page number ${pageNumber} exceeds maximum pages (${maxPages})`);
  }
};

/**
 * Validate file size
 */
export const validateFileSize = (size: number): void => {
  if (size > PDF_LIMITS.MAX_FILE_SIZE) {
    throw new Error(
      `File size (${(size / 1024 / 1024).toFixed(2)} MB) exceeds maximum of ${PDF_LIMITS.MAX_FILE_SIZE / 1024 / 1024} MB`
    );
  }
};

/**
 * Validate coordinates
 */
export const validateCoordinates = (x: number, y: number): void => {
  if (typeof x !== 'number' || typeof y !== 'number') {
    throw new Error('Coordinates must be numbers');
  }

  if (x < 0 || y < 0) {
    throw new Error('Coordinates must be non-negative');
  }
};

/**
 * Validate dimensions
 */
export const validateDimensions = (width: number, height: number): void => {
  if (typeof width !== 'number' || typeof height !== 'number') {
    throw new Error('Dimensions must be numbers');
  }

  if (width <= 0 || height <= 0) {
    throw new Error('Dimensions must be positive');
  }
};

/**
 * Validate color hex format
 */
export const validateColor = (color: string): void => {
  if (!color || typeof color !== 'string') {
    throw new Error('Color must be a non-empty string');
  }

  if (!/^#[0-9A-Fa-f]{6}$/.test(color)) {
    throw new Error('Color must be in hex format (#RRGGBB)');
  }
};

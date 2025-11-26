/**
 * PDF File Manager - Handles PDF file operations and validation
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { PDF_LIMITS, FILE_PATTERNS } from '../config/constants';
import { PDFValidationResult } from '../types/pdf';

/**
 * File Manager for PDF operations
 */
export class FileManager {
  /**
   * Validate PDF file path
   */
  static async validatePDFPath(filePath: string): Promise<void> {
    if (!filePath || typeof filePath !== 'string') {
      throw new Error('File path must be a non-empty string');
    }

    // Check if path is absolute
    if (!path.isAbsolute(filePath)) {
      throw new Error('File path must be absolute');
    }

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch {
      throw new Error(`PDF file not found: ${filePath}`);
    }

    // Check file extension
    if (!FILE_PATTERNS.pdf.test(filePath)) {
      throw new Error('File must have .pdf extension');
    }

    // Check file size
    const stats = await fs.stat(filePath);
    if (stats.size > PDF_LIMITS.MAX_FILE_SIZE) {
      throw new Error(
        `PDF file exceeds maximum size of ${PDF_LIMITS.MAX_FILE_SIZE / 1024 / 1024} MB`
      );
    }
  }

  /**
   * Validate image file path
   */
  static async validateImagePath(imagePath: string): Promise<void> {
    if (!imagePath || typeof imagePath !== 'string') {
      throw new Error('Image path must be a non-empty string');
    }

    if (!path.isAbsolute(imagePath)) {
      throw new Error('Image path must be absolute');
    }

    try {
      await fs.access(imagePath);
    } catch {
      throw new Error(`Image file not found: ${imagePath}`);
    }

    if (!FILE_PATTERNS.image.test(imagePath)) {
      throw new Error('Image must be PNG, JPG, JPEG, GIF, or WEBP');
    }
  }

  /**
   * Ensure directory exists
   */
  static async ensureDirectory(dirPath: string): Promise<void> {
    try {
      await fs.mkdir(dirPath, { recursive: true });
    } catch (error) {
      throw new Error(`Failed to create directory: ${(error as Error).message}`);
    }
  }

  /**
   * Validate PDF file (basic validation)
   */
  static async validatePDF(filePath: string): Promise<PDFValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      await this.validatePDFPath(filePath);
    } catch (error) {
      errors.push((error as Error).message);
      return { isValid: false, errors, warnings };
    }

    // Try to read first bytes to check PDF header
    try {
      const fileHandle = await fs.open(filePath, 'r');
      const buffer = Buffer.alloc(4);
      await fileHandle.read(buffer, 0, 4, 0);
      await fileHandle.close();

      const header = buffer.toString('ascii', 0, 4);
      if (header !== '%PDF') {
        errors.push('File does not appear to be a valid PDF (missing PDF header)');
      }
    } catch (error) {
      warnings.push(`Could not verify PDF header: ${(error as Error).message}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  }

  /**
   * Get file size
   */
  static async getFileSize(filePath: string): Promise<number> {
    try {
      const stats = await fs.stat(filePath);
      return stats.size;
    } catch (error) {
      throw new Error(`Failed to get file size: ${(error as Error).message}`);
    }
  }

  /**
   * Check if file exists
   */
  static async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }
}


/**
 * PDF Type Definitions
 */

import { PDFDocument } from 'pdf-lib';

// PDF document session interface
export interface PDFDocumentSession {
  id: string;
  document: PDFDocument;
  filePath?: string;
  createdAt: Date;
  lastAccessed: Date;
}

// PDF metadata interface
export interface PDFMetadata {
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string[];
  creator?: string;
  producer?: string;
  creationDate?: Date;
  modificationDate?: Date;
}

// PDF page information
export interface PageInfo {
  pageNumber: number;
  width: number;
  height: number;
  rotation?: number;
}

// Form field types
export type FormFieldType = 'text' | 'checkbox' | 'radio' | 'dropdown' | 'signature';

// Form field interface
export interface FormField {
  name: string;
  type: FormFieldType;
  value?: string | boolean | string[];
  required?: boolean;
  readOnly?: boolean;
  pageNumber?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

// Signature interface
export interface SignatureInfo {
  type: 'visual' | 'digital';
  pageNumber: number;
  x: number;
  y: number;
  width: number;
  height: number;
  imageData?: Uint8Array; // For visual signatures
  certificate?: string; // For digital signatures
  signedAt?: Date;
  signer?: string;
}

// Annotation types
export type AnnotationType = 'text' | 'highlight' | 'note' | 'stamp' | 'link';

// Annotation interface
export interface Annotation {
  type: AnnotationType;
  pageNumber: number;
  x: number;
  y: number;
  width?: number;
  height?: number;
  content?: string;
  color?: string;
  author?: string;
  createdAt?: Date;
}

// Encryption configuration
export interface EncryptionConfig {
  userPassword?: string;
  ownerPassword?: string;
  permissions?: PDFPermissions;
}

// PDF permissions
export interface PDFPermissions {
  printing?: 'low' | 'high' | 'none';
  modifying?: boolean;
  copying?: boolean;
  annotating?: boolean;
  fillingForms?: boolean;
  extractingContent?: boolean;
  assembling?: boolean;
}

// Text styling options
export interface TextStyle {
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}

// Image insertion options
export interface ImageOptions {
  x: number;
  y: number;
  width?: number;
  height?: number;
  opacity?: number;
  rotation?: number;
}

// Watermark options
export interface WatermarkOptions {
  text?: string;
  imagePath?: string;
  opacity?: number;
  rotation?: number;
  fontSize?: number;
  color?: string;
}

// PDF security information
export interface SecurityInfo {
  encrypted: boolean;
  userPasswordProtected: boolean;
  ownerPasswordProtected: boolean;
  permissions?: PDFPermissions;
  encryptionAlgorithm?: string;
}

// PDF file information
export interface PDFInfo {
  pageCount: number;
  fileSize: number;
  metadata?: PDFMetadata;
  security?: SecurityInfo;
  hasForms?: boolean;
  hasSignatures?: boolean;
}

// Validation result
export interface PDFValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

// Export options
export interface ExportOptions {
  format: 'json' | 'csv';
  includeEmptyFields?: boolean;
}

// Compression options
export interface CompressionOptions {
  quality?: number; // 0-100
  removeMetadata?: boolean;
  removeAnnotations?: boolean;
  removeForms?: boolean;
}


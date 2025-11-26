/**
 * PDF Manager - Core PDF operations wrapper
 */

import { PDFDocument, PDFPage, rgb, PDFFont, PDFImage } from 'pdf-lib';
import * as fs from 'fs/promises';
import * as path from 'path';
import { PDFDocumentSession, PDFMetadata, PDFInfo, SecurityInfo } from '../types/pdf';
import { PDF_LIMITS } from '../config/constants';

export class PDFManager {
  private sessions: Map<string, PDFDocumentSession> = new Map();
  private sessionCounter = 0;

  /**
   * Create a new PDF document session
   */
  async createSession(filePath?: string): Promise<string> {
    const sessionId = `pdf_${Date.now()}_${++this.sessionCounter}`;
    const document = await PDFDocument.create();
    
    const session: PDFDocumentSession = {
      id: sessionId,
      document,
      filePath,
      createdAt: new Date(),
      lastAccessed: new Date(),
    };

    this.sessions.set(sessionId, session);
    return sessionId;
  }

  /**
   * Load PDF from file
   */
  async loadFromFile(filePath: string): Promise<string> {
    // Validate file exists
    await fs.access(filePath);

    // Read file
    const fileData = await fs.readFile(filePath);
    
    // Validate file size
    if (fileData.length > PDF_LIMITS.MAX_FILE_SIZE) {
      throw new Error(`PDF file exceeds maximum size of ${PDF_LIMITS.MAX_FILE_SIZE / 1024 / 1024} MB`);
    }

    // Load PDF
    const document = await PDFDocument.load(fileData);
    
    // Check page count
    if (document.getPageCount() > PDF_LIMITS.MAX_PAGES) {
      throw new Error(`PDF exceeds maximum page count of ${PDF_LIMITS.MAX_PAGES}`);
    }

    const sessionId = `pdf_${Date.now()}_${++this.sessionCounter}`;
    const session: PDFDocumentSession = {
      id: sessionId,
      document,
      filePath,
      createdAt: new Date(),
      lastAccessed: new Date(),
    };

    this.sessions.set(sessionId, session);
    return sessionId;
  }

  /**
   * Get PDF document session
   */
  getSession(sessionId: string): PDFDocumentSession {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`PDF session not found: ${sessionId}`);
    }
    session.lastAccessed = new Date();
    return session;
  }

  /**
   * Save PDF to file
   */
  async saveToFile(sessionId: string, outputPath: string): Promise<void> {
    const session = this.getSession(sessionId);
    const pdfBytes = await session.document.save();
    
    // Ensure directory exists
    const dir = path.dirname(outputPath);
    await fs.mkdir(dir, { recursive: true });
    
    await fs.writeFile(outputPath, pdfBytes);
  }

  /**
   * Get PDF information
   */
  async getInfo(sessionId: string): Promise<PDFInfo> {
    const session = this.getSession(sessionId);
    const document = session.document;
    
    const pageCount = document.getPageCount();
    const metadata = await this.getMetadata(sessionId);
    
    // Calculate file size (approximate)
    const pdfBytes = await document.save();
    const fileSize = pdfBytes.length;

    // Check for forms
    const formFields = document.getForm().getFields();
    const hasForms = formFields.length > 0;

    // Security info
    const security: SecurityInfo = {
      encrypted: false, // pdf-lib doesn't expose encryption status directly
      userPasswordProtected: false,
      ownerPasswordProtected: false,
    };

    return {
      pageCount,
      fileSize,
      metadata,
      security,
      hasForms,
      hasSignatures: false, // Would need to check signatures
    };
  }

  /**
   * Get PDF metadata
   */
  async getMetadata(sessionId: string): Promise<PDFMetadata> {
    const session = this.getSession(sessionId);
    const document = session.document;
    
    const keywords = document.getKeywords();
    
    return {
      title: document.getTitle() || undefined,
      author: document.getAuthor() || undefined,
      subject: document.getSubject() || undefined,
      keywords: keywords ? keywords.split(/\s+/).filter(k => k.length > 0) : undefined,
      creator: document.getCreator() || undefined,
      producer: document.getProducer() || undefined,
      creationDate: document.getCreationDate() || undefined,
      modificationDate: document.getModificationDate() || undefined,
    };
  }

  /**
   * Set PDF metadata
   */
  async setMetadata(sessionId: string, metadata: Partial<PDFMetadata>): Promise<void> {
    const session = this.getSession(sessionId);
    const document = session.document;
    
    if (metadata.title !== undefined) {
      document.setTitle(metadata.title);
    }
    if (metadata.author !== undefined) {
      document.setAuthor(metadata.author);
    }
    if (metadata.subject !== undefined) {
      document.setSubject(metadata.subject);
    }
    if (metadata.keywords !== undefined && metadata.keywords.length > 0) {
      document.setKeywords(metadata.keywords);
    }
    if (metadata.creator !== undefined) {
      document.setCreator(metadata.creator);
    }
    if (metadata.producer !== undefined) {
      document.setProducer(metadata.producer);
    }
  }

  /**
   * Close and remove session
   */
  closeSession(sessionId: string): void {
    this.sessions.delete(sessionId);
  }

  /**
   * Clean up old sessions
   */
  cleanupSessions(): void {
    const now = Date.now();
    for (const [id, session] of this.sessions.entries()) {
      const age = now - session.lastAccessed.getTime();
      if (age > PDF_LIMITS.SESSION_TIMEOUT) {
        this.sessions.delete(id);
      }
    }
  }

  /**
   * Get all active sessions
   */
  getActiveSessions(): string[] {
    return Array.from(this.sessions.keys());
  }
}

// Singleton instance
let pdfManagerInstance: PDFManager | null = null;

export function getPDFManager(): PDFManager {
  if (!pdfManagerInstance) {
    pdfManagerInstance = new PDFManager();
  }
  return pdfManagerInstance;
}


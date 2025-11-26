/**
 * PDF Metadata Handler - Read/write PDF metadata
 */

import { PDFMetadata } from '../types/pdf';
import { getPDFManager } from './pdf-manager';

export class PDFMetadataHandler {
  /**
   * Get metadata (delegates to PDFManager)
   */
  async getMetadata(sessionId: string): Promise<PDFMetadata> {
    const manager = getPDFManager();
    return await manager.getMetadata(sessionId);
  }

  /**
   * Set metadata (delegates to PDFManager)
   */
  async setMetadata(sessionId: string, metadata: Partial<PDFMetadata>): Promise<void> {
    const manager = getPDFManager();
    await manager.setMetadata(sessionId, metadata);
  }
}

export const metadataHandler = new PDFMetadataHandler();


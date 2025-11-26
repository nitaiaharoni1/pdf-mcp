/**
 * PDF Page Operations - Merge, split, rotate, delete pages
 */

import { PDFDocument } from 'pdf-lib';
import * as fs from 'fs/promises';
import { PageInfo } from '../types/pdf';
import { getPDFManager } from './pdf-manager';

export class PageOperations {
  /**
   * Get page information
   */
  async getPages(sessionId: string): Promise<PageInfo[]> {
    const session = getPDFManager().getSession(sessionId);
    const document = session.document;
    const pages = document.getPages();

    return pages.map((page, index) => {
      const { width, height } = page.getSize();
      return {
        pageNumber: index + 1,
        width,
        height,
      };
    });
  }

  /**
   * Merge multiple PDFs
   */
  async mergePDFs(sessionId: string, pdfPaths: string[]): Promise<void> {
    const session = getPDFManager().getSession(sessionId);
    const document = session.document;

    for (const pdfPath of pdfPaths) {
      const pdfBytes = await fs.readFile(pdfPath);
      const sourceDoc = await PDFDocument.load(pdfBytes);
      const pages = await document.copyPages(sourceDoc, sourceDoc.getPageIndices());
      
      for (const page of pages) {
        document.addPage(page);
      }
    }
  }

  /**
   * Split PDF into separate files
   */
  async splitPDF(sessionId: string, outputDir: string): Promise<string[]> {
    const session = getPDFManager().getSession(sessionId);
    const sourceDoc = session.document;
    const pageCount = sourceDoc.getPageCount();
    const outputPaths: string[] = [];

    for (let i = 0; i < pageCount; i++) {
      const newDoc = await PDFDocument.create();
      const [page] = await newDoc.copyPages(sourceDoc, [i]);
      newDoc.addPage(page);
      
      const pdfBytes = await newDoc.save();
      const outputPath = `${outputDir}/page_${i + 1}.pdf`;
      await fs.writeFile(outputPath, pdfBytes);
      outputPaths.push(outputPath);
    }

    return outputPaths;
  }

  /**
   * Rotate page
   */
  async rotatePage(sessionId: string, pageNumber: number, degrees: number): Promise<void> {
    const session = getPDFManager().getSession(sessionId);
    const document = session.document;
    const pages = document.getPages();
    
    if (pageNumber < 1 || pageNumber > pages.length) {
      throw new Error(`Invalid page number: ${pageNumber}`);
    }

    const page = pages[pageNumber - 1];
    
    // Normalize degrees to 0, 90, 180, or 270
    const normalizedDegrees = Math.round(degrees / 90) * 90;
    page.setRotation({ angleDegrees: normalizedDegrees } as any);
  }

  /**
   * Delete pages
   */
  async deletePages(sessionId: string, pageNumbers: number[]): Promise<void> {
    const session = getPDFManager().getSession(sessionId);
    const document = session.document;
    const pages = document.getPages();
    
    // Sort page numbers in descending order to avoid index shifting issues
    const sortedPages = [...pageNumbers].sort((a, b) => b - a);
    
    for (const pageNum of sortedPages) {
      if (pageNum < 1 || pageNum > pages.length) {
        throw new Error(`Invalid page number: ${pageNum}`);
      }
      document.removePage(pageNum - 1);
    }
  }

  /**
   * Extract pages to new PDF
   */
  async extractPages(sessionId: string, pageNumbers: number[], outputPath: string): Promise<void> {
    const session = getPDFManager().getSession(sessionId);
    const sourceDoc = session.document;
    const newDoc = await PDFDocument.create();
    
    // Convert to 0-based indices
    const indices = pageNumbers.map(n => n - 1);
    
    // Validate indices
    for (const index of indices) {
      if (index < 0 || index >= sourceDoc.getPageCount()) {
        throw new Error(`Invalid page number: ${index + 1}`);
      }
    }
    
    const pages = await newDoc.copyPages(sourceDoc, indices);
    for (const page of pages) {
      newDoc.addPage(page);
    }
    
    const pdfBytes = await newDoc.save();
    await fs.writeFile(outputPath, pdfBytes);
  }
}

export const pageOperations = new PageOperations();


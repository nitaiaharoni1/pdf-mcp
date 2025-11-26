/**
 * PDF Editor - Text editing, annotations, watermarks
 */

import { PDFDocument, PDFPage, rgb, StandardFonts, Color } from 'pdf-lib';
import * as fs from 'fs/promises';
import { TextStyle, Annotation, WatermarkOptions } from '../types/pdf';
import { getPDFManager } from './pdf-manager';

export class PDFEditor {
  /**
   * Add text to PDF
   */
  async addText(
    sessionId: string,
    pageNumber: number,
    text: string,
    x: number,
    y: number,
    style?: TextStyle
  ): Promise<void> {
    const session = getPDFManager().getSession(sessionId);
    const document = session.document;
    const pages = document.getPages();
    
    if (pageNumber < 1 || pageNumber > pages.length) {
      throw new Error(`Invalid page number: ${pageNumber}`);
    }

    const page = pages[pageNumber - 1];
    const font = await document.embedFont(StandardFonts.Helvetica);
    
    const fontSize = style?.fontSize || 12;
    const [r, g, b] = this.parseColor(style?.color || '#000000');
    const color = rgb(r, g, b);
    
    page.drawText(text, {
      x,
      y,
      size: fontSize,
      font,
      color,
    });
  }

  /**
   * Add image to PDF
   */
  async addImage(
    sessionId: string,
    pageNumber: number,
    imagePath: string,
    x: number,
    y: number,
    width?: number,
    height?: number
  ): Promise<void> {
    const session = getPDFManager().getSession(sessionId);
    const document = session.document;
    const pages = document.getPages();
    
    if (pageNumber < 1 || pageNumber > pages.length) {
      throw new Error(`Invalid page number: ${pageNumber}`);
    }

    const page = pages[pageNumber - 1];
    const imageBytes = await fs.readFile(imagePath);
    
    // Determine image type
    let image;
    if (imagePath.toLowerCase().endsWith('.png')) {
      image = await document.embedPng(imageBytes);
    } else {
      image = await document.embedJpg(imageBytes);
    }

    const { width: imgWidth, height: imgHeight } = image.scale(1);
    
    // Calculate dimensions if not provided
    const finalWidth = width || imgWidth;
    const finalHeight = height || imgHeight;

    page.drawImage(image, {
      x,
      y,
      width: finalWidth,
      height: finalHeight,
    });
  }

  /**
   * Add annotation (as text comment)
   */
  async addAnnotation(
    sessionId: string,
    annotation: Annotation
  ): Promise<void> {
    const session = getPDFManager().getSession(sessionId);
    const document = session.document;
    const pages = document.getPages();
    
    if (annotation.pageNumber < 1 || annotation.pageNumber > pages.length) {
      throw new Error(`Invalid page number: ${annotation.pageNumber}`);
    }

    const page = pages[annotation.pageNumber - 1];
    const font = await document.embedFont(StandardFonts.Helvetica);
    const [r, g, b] = this.parseColor(annotation.color || '#FFFF00');
    const color = rgb(r, g, b);

    // Draw annotation based on type
    switch (annotation.type) {
      case 'text':
      case 'note':
        if (annotation.content) {
          page.drawText(annotation.content, {
            x: annotation.x,
            y: annotation.y,
            size: 10,
            font,
            color: rgb(0, 0, 0),
          });
        }
        break;
      case 'highlight':
        if (annotation.width && annotation.height) {
          page.drawRectangle({
            x: annotation.x,
            y: annotation.y,
            width: annotation.width,
            height: annotation.height,
            color,
            opacity: 0.3,
          });
        }
        break;
      default:
        throw new Error(`Unsupported annotation type: ${annotation.type}`);
    }
  }

  /**
   * Add watermark
   */
  async addWatermark(
    sessionId: string,
    options: WatermarkOptions
  ): Promise<void> {
    const session = getPDFManager().getSession(sessionId);
    const document = session.document;
    const pages = document.getPages();

    const opacity = options.opacity || 0.3;
    const rotation = options.rotation || -45;

    for (const page of pages) {
      const { width, height } = page.getSize();
      const centerX = width / 2;
      const centerY = height / 2;

      if (options.text) {
        const font = await document.embedFont(StandardFonts.HelveticaBold);
        const fontSize = options.fontSize || 48;
        const [r, g, b] = this.parseColor(options.color || '#CCCCCC');
        const color = rgb(r, g, b);

        page.drawText(options.text, {
          x: centerX,
          y: centerY,
          size: fontSize,
          font,
          color,
          opacity,
          rotate: { angleDegrees: rotation } as any,
        });
      } else if (options.imagePath) {
        const imageBytes = await fs.readFile(options.imagePath);
        let image;
        if (options.imagePath.toLowerCase().endsWith('.png')) {
          image = await document.embedPng(imageBytes);
        } else {
          image = await document.embedJpg(imageBytes);
        }

        const imgWidth = width * 0.5;
        const imgHeight = image.height * (imgWidth / image.width);

        page.drawImage(image, {
          x: centerX - imgWidth / 2,
          y: centerY - imgHeight / 2,
          width: imgWidth,
          height: imgHeight,
          opacity,
          rotate: { angleDegrees: rotation } as any,
        });
      }
    }
  }

  /**
   * Parse color string to RGB tuple
   */
  private parseColor(color: string): [number, number, number] {
    // Handle hex colors
    if (color.startsWith('#')) {
      const hex = color.slice(1);
      const r = parseInt(hex.slice(0, 2), 16) / 255;
      const g = parseInt(hex.slice(2, 4), 16) / 255;
      const b = parseInt(hex.slice(4, 6), 16) / 255;
      return [r, g, b];
    }
    
    // Default to black
    return [0, 0, 0];
  }
}

export const pdfEditor = new PDFEditor();


import { Injectable } from '@nestjs/common';
import * as Tesseract from 'tesseract.js';

@Injectable()
export class OcrService {
  async processImage(imageBuffer: Buffer): Promise<string> {
    try {
      const { data: { text } } = await Tesseract.recognize(imageBuffer, 'eng'); // 'eng' for English
      return text ;
    } catch (error) {
      throw new Error(`OCR processing failed: ${error.message}`);
    }
  }
}

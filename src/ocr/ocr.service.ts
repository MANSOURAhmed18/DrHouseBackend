import { Injectable } from '@nestjs/common';
import * as Tesseract from 'tesseract.js';

@Injectable()
export class OcrService {
  async processImage(imageBuffer: Buffer): Promise<string> {
    try {
      const { data: { text } } = await Tesseract.recognize(imageBuffer, 'eng'); // 'eng' for English

      // Extract medicine name from the OCR text
      const medicineName = this.extractMedicineNameUsingKeywords(text);
      return medicineName || "No matching medicine name found."; // Return the extracted medicine name or default message
    } catch (error) {
      throw new Error(`OCR processing failed: ${error.message}`);
    }
  }

  // Function to extract medicine name using keywords from OCR text
  private extractMedicineNameUsingKeywords(text: string): string {
    const medicineKeywords = [
      "aKtiv", "GROSSIVIT", "GROSS!", "GROSS", "Panadol", "Cough", "Med", "Capsule", "Tablet",
      "Supplement", "Syrup", "Herb", "Natural", "Health", "Boost", "Relief", "Remedy",
      "Immune", "Strength"
    ];

    // Check if any of the keywords exist in the text and return the matching one
    for (const keyword of medicineKeywords) {
      if (text.toLowerCase().includes(keyword.toLowerCase())) {
        return keyword;
      }
    }

    return ''; // If no match is found, return an empty string
  }
}

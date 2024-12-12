import { Controller, Post, UploadedFile, UseInterceptors, HttpException, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { OcrService } from './ocr.service';

@Controller('ocr')
export class OcrController {
  constructor(private readonly ocrService: OcrService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<{ text: string }> {
    if (!file || !file.buffer) {
      throw new HttpException('No file uploaded or file is empty', HttpStatus.BAD_REQUEST);
    }
  
    try {
      const text = await this.ocrService.processImage(file.buffer);
      // Ensure that text is never null or undefined
      return { text: text || "No text detected from the image." };  // Return a fallback string if no text was extracted
    } catch (error) {
      throw new HttpException(`Error processing the file: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
}

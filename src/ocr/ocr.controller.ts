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
      // Process the image buffer directly
      const text = await this.ocrService.processImage(file.buffer);
      return { text };  // Ensure we return the result as a JSON object with a "text" field
    } catch (error) {
      throw new HttpException(`Error processing the file: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

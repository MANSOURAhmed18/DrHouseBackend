import { IsString, IsNumber } from 'class-validator';

export class CreateProductDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  price?: number;

  @IsString()
  category: string;

  @IsString()
  image?: string;
}

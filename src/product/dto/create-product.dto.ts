import { IsString, IsNumber, IsBoolean, IsOptional, Min, IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  @IsNotEmpty()
  category: string; // Category ID, typically a MongoDB ObjectId

  @IsOptional()
  @IsBoolean()
  requiresPrescription?: boolean;

  @IsNumber()
  @Min(0)
  stock: number;
}

import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Put } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from 'src/schemas/product.schema';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // Create a new product
  @Post()
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    try {
      return await this.productService.create(createProductDto);
    } catch (error) {
      throw new HttpException(
        'Error creating product',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Get all products
  @Get()
  async findAll(): Promise<Product[]> {
    return await this.productService.findAll();
  }

  // Get a single product by ID
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product> {
    try {
      return await this.productService.findOne(id);
    } catch (error) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
  }

  // Update a product by ID
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    try {
      return await this.productService.update(id, updateProductDto);
    } catch (error) {
      throw new HttpException(
        'Error updating product',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Delete a product by ID
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Product> {
    try {
      return await this.productService.delete(id);
    } catch (error) {
      throw new HttpException(
        'Error deleting product',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}


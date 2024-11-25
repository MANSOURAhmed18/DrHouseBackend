import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Put } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from 'src/schemas/category.schema';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // Create a new category
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    try {
      return await this.categoryService.create(createCategoryDto);
    } catch (error) {
      throw new HttpException(
        'Error creating category',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Get all categories
  @Get()
  async findAll(): Promise<Category[]> {
    return await this.categoryService.findAll();
  }

  // Get a single category by ID
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Category> {
    try {
      return await this.categoryService.findOne(id);
    } catch (error) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }
  }

  // Update a category by ID
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    try {
      return await this.categoryService.update(id, updateCategoryDto);
    } catch (error) {
      throw new HttpException(
        'Error updating category',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Delete a category by ID
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Category> {
    try {
      return await this.categoryService.delete(id);
    } catch (error) {
      throw new HttpException(
        'Error deleting category',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
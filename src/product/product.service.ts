import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from 'src/schemas/product.schema';
import { Category } from 'src/schemas/category.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    @InjectModel(Category.name) private categoryModel: Model<Category>, // Inject the CategoryModel

  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    // Find the category by name
    const category = await this.categoryModel.findOne({ name: createProductDto.category });
    if (!category) {
      throw new NotFoundException(`Category '${createProductDto.category}' not found.`);
    }

    // Create the product with the resolved category ID
    const newProduct = new this.productModel({
      ...createProductDto,
      category: category._id, // Save category ID if needed
    });

    return await newProduct.save();
  }


  async findAll(): Promise<Product[]> {
    return await this.productModel.find().populate('category').exec();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).populate('category').exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .populate('category')
      .exec();
    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return updatedProduct;
  }

  async delete(id: string): Promise<Product> {
    const deletedProduct = await this.productModel.findByIdAndDelete(id).exec();
    if (!deletedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return deletedProduct;
  }
}

import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order } from './order.schema';
import { Product } from '../product/product.schema';
import { v4 as uuid } from 'uuid';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel('Order') private readonly orderModel: Model<Order>,
    @InjectModel('Product') private readonly productModel: Model<Product>,
  ) {}

  async createOrder(orderData): Promise<Order> {
    const { products } = orderData;

    const resolvedProducts = await Promise.all(
      products.map(async (item) => {
        // Find product by name
        const product = await this.productModel.findById( item.productId );
        if (!product) {
          throw new BadRequestException(`Product with name "${item.productId}" not found.`);
        }

        // Check stock
        if (product.count < item.quantity) {
          throw new BadRequestException(`Insufficient stock for product: ${product.name}.`);
        }

        // Update stock
        if (typeof item.quantity !== 'number' || item.quantity <= 0) {
          throw new BadRequestException(`Invalid quantity for product: ${product.name}`);
        }
        
        if (product.count === undefined || product.count < item.quantity) {
          throw new BadRequestException(`Insufficient stock for product: ${product.name}`);
        }
        
        product.count = product.count - item.quantity;
        await product.save();


        return { productId: product._id, quantity: item.quantity }; // Use ObjectId
      }),
    );

    // Calculate total amount
    const totalAmount = await Promise.all(
      resolvedProducts.map(async (item) => {
        const product = await this.productModel.findById(item.productId);
        return product.price * item.quantity;
      }),
    ).then((amounts) => amounts.reduce((acc, curr) => acc + curr, 0));

    // Generate order ID if not provided
    const orderId = orderData.id || uuid();

    // Create and save the order
    const order = new this.orderModel({
      id: orderId,
      products: resolvedProducts,
      totalAmount,
      status: 'pending',
      createdAt: new Date(),
    });

    return await order.save();
  }

  async getOrders(): Promise<Order[]> {
    return this.orderModel.find().populate('products.product').exec();
  }
}

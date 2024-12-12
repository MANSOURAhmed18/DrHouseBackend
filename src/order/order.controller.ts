import { Controller, Post, Get, Body } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() orderData) {
    console.log(orderData);
    return this.orderService.createOrder(orderData);
  }

  @Get()
  async getOrders() {
    return this.orderService.getOrders();
  }
}

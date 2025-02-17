// src/payment/payment.controller.ts
import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { PaymentService } from './payment.service';

// DTO for payment intent request
class CreatePaymentIntentDto {
  amount: number;
  currency: string;
  userId: string;
}

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-payment-intent')
  async createPaymentIntent(@Body() body: CreatePaymentIntentDto) {
    try {
      // Validate the amount
      if (!body.amount || body.amount <= 0) {
        throw new HttpException('Invalid amount', HttpStatus.BAD_REQUEST);
      }

      // Validate userId
      if (!body.userId) {
        throw new HttpException('User ID is required', HttpStatus.BAD_REQUEST);
      }

      // Log the request
      console.log('Received payment intent request:', {
        amount: body.amount,
        currency: body.currency,
        userId: body.userId,
      });

      const result = await this.paymentService.createPaymentIntent(
        body.amount,
        body.currency || 'usd', // Default to USD if not specified
        body.userId,
      );

      return {
        clientSecret: result.clientSecret,
        paymentIntentId: result.paymentIntentId,
      };
    } catch (error) {
      console.error('Payment intent creation failed:', error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to create payment intent',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
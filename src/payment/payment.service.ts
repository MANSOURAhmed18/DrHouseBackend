// src/payment/payment.service.ts
import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    // Initialize Stripe with your secret key
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), {
     // apiVersion: '2023-10-16', // Use the latest API version
    });
  }

  async createPaymentIntent(amount: number, currency: string, userId: string) {
    try {
      console.log(`Creating payment intent for user ${userId} with amount ${amount}`);

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount, // Amount in cents
        currency,
        metadata: {
          userId, // Store userId in metadata for reference
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      console.log(`Payment intent created: ${paymentIntent.id}`);

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      };
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }
}
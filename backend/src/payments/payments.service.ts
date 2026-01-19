import { Injectable, BadRequestException, InternalServerErrorException, Logger } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
    private stripe: Stripe;
    private readonly logger = new Logger(PaymentsService.name);

    constructor() {
        const secretKey = process.env.STRIPE_SECRET_KEY;
        if (!secretKey || secretKey.includes('placeholder')) {
            this.logger.warn('Stripe Secret Key not configured properly. Payments will fail.');
        }
        this.stripe = new Stripe(secretKey || '');
    }

    async createPaymentIntent(amount: number, currency: string = 'vnd', orderId?: string) {
        // Validate amount - Stripe minimum for VND is 12000
        if (!amount || amount < 12000) {
            throw new BadRequestException(`Số tiền tối thiểu là 12,000 VND. Hiện tại: ${amount} VND`);
        }

        // Check if Stripe is properly configured
        if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('placeholder')) {
            throw new InternalServerErrorException('Stripe chưa được cấu hình. Vui lòng liên hệ quản lý.');
        }

        try {
            this.logger.log(`Creating PaymentIntent for ${amount} ${currency.toUpperCase()}`);

            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: Math.round(amount), // Ensure whole number for VND
                currency: currency.toLowerCase(),
                automatic_payment_methods: {
                    enabled: true,
                },
                metadata: {
                    orderId: orderId || 'multi-order',
                    createdAt: new Date().toISOString(),
                },
            });

            this.logger.log(`PaymentIntent created: ${paymentIntent.id}`);

            return {
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id,
                amount: paymentIntent.amount,
                currency: paymentIntent.currency,
            };
        } catch (error) {
            this.logger.error('Failed to create PaymentIntent', error);

            if (error instanceof Stripe.errors.StripeError) {
                throw new BadRequestException(`Stripe error: ${error.message}`);
            }

            throw new InternalServerErrorException('Không thể tạo thanh toán. Vui lòng thử lại.');
        }
    }

    async retrievePaymentIntent(paymentIntentId: string) {
        try {
            const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
            return {
                id: paymentIntent.id,
                status: paymentIntent.status,
                amount: paymentIntent.amount,
                currency: paymentIntent.currency,
            };
        } catch (error) {
            this.logger.error(`Failed to retrieve PaymentIntent: ${paymentIntentId}`, error);
            throw new BadRequestException('Không thể lấy thông tin thanh toán.');
        }
    }
}

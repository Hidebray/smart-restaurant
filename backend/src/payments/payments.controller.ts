import { Body, Controller, Post, Get, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { PaymentsService } from './payments.service';

interface CreatePaymentIntentDto {
    amount: number;
    orderId?: string;
}

@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @Post('create-intent')
    @HttpCode(HttpStatus.OK)
    async createPaymentIntent(@Body() body: CreatePaymentIntentDto) {
        return this.paymentsService.createPaymentIntent(body.amount, 'vnd', body.orderId);
    }

    @Get('status/:paymentIntentId')
    async getPaymentStatus(@Param('paymentIntentId') paymentIntentId: string) {
        return this.paymentsService.retrievePaymentIntent(paymentIntentId);
    }
}

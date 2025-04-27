import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class PaymentService {
  createPaymentPayload(order: any): Record<string, any> {
    const payload = {
      merchant_id: process.env.MERCHANT_ID,
      return_url: process.env.RETURN_URL,
      cancel_url: process.env.CANCEL_URL,
      notify_url: process.env.NOTIFY_URL,
      order_id: order.id,
      items: order.items,
      amount: order.amount,
      currency: 'LKR',
      first_name: order.firstName,
      last_name: order.lastName,
      email: order.email,
      phone: order.phone,
      address: order.address,
      city: order.city,
      country: 'Sri Lanka',
    };
    return payload;
  }

  verifySignature(params: Record<string, any>): boolean {
    const merchantSecret = process.env.MERCHANT_SECRET;
    const hash = crypto
      .createHash('md5')
      .update(
        `${params.merchant_id}${params.order_id}${params.payhere_amount}${params.payhere_currency}${params.status_code}${merchantSecret}`
      )
      .digest('hex')
      .toUpperCase();
    return hash === params.md5sig;
  }
}

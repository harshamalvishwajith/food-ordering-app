import { Controller, Post, Body, Res, HttpStatus, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Response, Request } from 'express';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create')
  createPayment(@Body() order: any, @Res() res: Response) {
    const payload = this.paymentService.createPaymentPayload(order);
    const formInputs = Object.entries(payload)
      .map(
        ([key, value]) =>
          `<input type="hidden" name="${key}" value="${value}" />`
      )
      .join('\n');

    const form = `
      <html>
        <body onload="document.forms[0].submit()">
          <form method="post" action="https://sandbox.payhere.lk/pay/checkout">
            ${formInputs}
          </form>
        </body>
      </html>
    `;

    res.status(HttpStatus.OK).send(form);
  }

  @Post('notify')
  handleNotification(@Req() req: Request, @Res() res: Response) {
    const isValid = this.paymentService.verifySignature(req.body);
    if (isValid) {
      // TODO: Update order status in the database
      res.status(HttpStatus.OK).send('Payment verified');
    } else {
      res.status(HttpStatus.BAD_REQUEST).send('Invalid signature');
    }
  }
}

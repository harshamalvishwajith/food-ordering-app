import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ResendService {
  private readonly API_URL = 'https://api.resend.com/emails';

  async sendEmail(to: string, subject: string, text: string) {
    await axios.post(
      this.API_URL,
      {
        to,
        subject,
        text,
        from: 'your@domain.com', // Your verified sender address
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );
  }
}

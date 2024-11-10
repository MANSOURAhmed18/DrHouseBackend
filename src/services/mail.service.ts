import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendPasswordResetEmail(email: string, token: string) {
    const resetLink = `https://your-app.com/reset-password?token=${token}`;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Password Reset Request',
      template: './reset-password', // The name of your template file
      context: {
        resetLink,
      },
    });
  }
}

import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,       // Your Gmail address
        pass: process.env.GMAIL_APP_PASSWORD, // App Password
      },
    });

    this.transporter.verify((error, success) => {
      if (error) {
        console.error('Error connecting to Gmail:', error);
      } else {
        console.log('Connected to Gmail successfully!');
      }
    });
  }

  async sendResetEmail(email: string, resetCode: string): Promise<void> {
    const mailOptions = {
      from: `Auth-backend service <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Code',
      text: `Your password reset code is: ${resetCode}`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}

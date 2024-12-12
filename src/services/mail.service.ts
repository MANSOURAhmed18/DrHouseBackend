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

  async sendEmail(to: string, subject: string, content: string): Promise<void> {
    const mailOptions = {
      from: `Auth-backend service <${process.env.GMAIL_USER}>`,
      to: to,
      subject: subject,
      text: content,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }

  async sendWelcomeEmail(email: string, name: string, isAdmin: boolean): Promise<void> {
    const subject = isAdmin 
        ? 'Welcome to Our Platform - Admin Account Created'
        : 'Welcome to Our Platform';

    const content = isAdmin
        ? `Dear ${name},\n\nYour admin account has been successfully created. Welcome to our platform!\n\nBest regards,\nThe Team`
        : `Dear ${name},\n\nWelcome to our platform! Your account has been successfully created.\n\nBest regards,\nThe Team`;

    await this.sendEmail(email, subject, content);
  }
  async sendreclayionEmail(email: string, name: string, isAdmin: boolean): Promise<void> {
    const subject = isAdmin 
        ? 'Welcome to Our Platform - Admin Account Created'
        : 'Welcome to Our Platform';

    const content = isAdmin
        ? `Dear ${name},\n\nYour admin account has been successfully created. Welcome to our platform!\n\nBest regards,\nThe Team`
        : `Dear ${name},\n\nWelcome to our platform! Your account has been successfully created.\n\nBest regards,\nThe Team`;

    await this.sendEmail(email, subject, content);
  }
  
  async sendPasswordResetConfirmation(email: string) {
    const subject = 'Password Reset Successful';
    const html = `
        <h1>Password Reset Successful</h1>
        <p>Your password has been successfully reset.</p>
        <p>If you didn't make this change, please contact support immediately.</p>
    `;

    await this.sendEmail(email, subject, html);
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
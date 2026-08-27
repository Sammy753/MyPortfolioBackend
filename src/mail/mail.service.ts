import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  async notifyAdminOfNewMessage(name: string, email: string, phone: string, message: string) {
    try {
      await this.transporter.sendMail({
        from: process.env.MAIL_FROM,
        to: process.env.ADMIN_NOTIFY_EMAIL,
        subject: `New contact message from ${name}`,
        html: `
          <h3>New message from your portfolio site</h3>
          <p><b>Name:</b> ${name}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Phone:</b> ${phone}</p>
          <p><b>Message:</b></p>
          <p>${message}</p>
        `,
      });
    } catch (err) {
      this.logger.error('Failed to send contact alert email', err as Error);
    }
  }

  async notifySubscribersOfNewProject(
    emails: string[],
    title: string,
    overview: string,
    liveLink?: string,
  ) {
    if (!emails.length) return;
    try {
      // BCC everyone in one send so subscribers don't see each other's emails
      await this.transporter.sendMail({
        from: process.env.MAIL_FROM,
        to: process.env.MAIL_FROM,
        bcc: emails,
        subject: `New project just dropped: ${title}`,
        html: `
          <h2>${title}</h2>
          <p>${overview}</p>
          ${liveLink ? `<p><a href="${liveLink}">View it live</a></p>` : ''}
          <hr/>
          <p style="font-size:12px;color:#888">
            You're receiving this because you subscribed for project updates.
          </p>
        `,
      });
    } catch (err) {
      this.logger.error('Failed to send subscriber notification emails', err as Error);
    }
  }
}

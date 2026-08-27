import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async create(dto: CreateContactDto) {
    const message = await this.prisma.contactMessage.create({ data: dto });
    this.mailService
      .notifyAdminOfNewMessage(dto.name, dto.email, dto.phone, dto.message)
      .catch((err) => console.error('Failed to send contact alert email:', err));
    return message;
  }

  findAll() {
    return this.prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const item = await this.prisma.contactMessage.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Message not found');
    return item;
  }

  async markAsRead(id: string) {
    await this.findOne(id);
    return this.prisma.contactMessage.update({ where: { id }, data: { isRead: true } });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.contactMessage.delete({ where: { id } });
  }
}

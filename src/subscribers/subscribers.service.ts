import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';

@Injectable()
export class SubscribersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateSubscriberDto) {
    const existing = await this.prisma.subscriber.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already subscribed');
    return this.prisma.subscriber.create({ data: dto });
  }

  findAll() {
    return this.prisma.subscriber.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async remove(id: string) {
    const existing = await this.prisma.subscriber.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Subscriber not found');
    return this.prisma.subscriber.delete({ where: { id } });
  }

  // Public unsubscribe by email - no admin auth needed
  async unsubscribe(email: string) {
    const existing = await this.prisma.subscriber.findUnique({ where: { email } });
    if (!existing) throw new NotFoundException('Email not found in subscriber list');
    return this.prisma.subscriber.delete({ where: { email } });
  }
}

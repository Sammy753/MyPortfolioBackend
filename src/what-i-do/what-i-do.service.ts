import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWhatIDoDto } from './dto/create-what-i-do.dto';
import { UpdateWhatIDoDto } from './dto/update-what-i-do.dto';

@Injectable()
export class WhatIDoService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateWhatIDoDto) {
    return this.prisma.whatIDo.create({ data: dto });
  }

  findAll() {
    return this.prisma.whatIDo.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const item = await this.prisma.whatIDo.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Item not found');
    return item;
  }

  async update(id: string, dto: UpdateWhatIDoDto) {
    await this.findOne(id);
    return this.prisma.whatIDo.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.whatIDo.delete({ where: { id } });
  }
}

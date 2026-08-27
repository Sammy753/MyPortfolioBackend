import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSkillToolDto } from './dto/create-skill-tool.dto';
import { UpdateSkillToolDto } from './dto/update-skill-tool.dto';

@Injectable()
export class SkillsToolsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateSkillToolDto) {
    return this.prisma.skillTool.create({ data: dto });
  }

  findAll() {
    return this.prisma.skillTool.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const item = await this.prisma.skillTool.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Skill/Tool not found');
    return item;
  }

  async update(id: string, dto: UpdateSkillToolDto) {
    await this.findOne(id);
    return this.prisma.skillTool.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.skillTool.delete({ where: { id } });
  }
}

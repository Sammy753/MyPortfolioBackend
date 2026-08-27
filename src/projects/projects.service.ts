import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  private async notifySubscribers(title: string, overview: string, liveLink?: string) {
    const subscribers = await this.prisma.subscriber.findMany();
    if (!subscribers.length) return;
    await this.mailService.notifySubscribersOfNewProject(
      subscribers.map((s) => s.email),
      title,
      overview,
      liveLink,
    );
  }

  async create(dto: CreateProjectDto) {
    const shouldPublishNow = dto.published === true;
    const project = await this.prisma.project.create({
      data: {
        ...dto,
        published: shouldPublishNow,
        publishedAt: shouldPublishNow ? new Date() : null,
      },
    });

    if (shouldPublishNow) {
      this.notifySubscribers(project.title, project.overview, project.liveLink ?? undefined).catch(
        (err) => console.error('Failed to send subscriber notifications:', err),
      );
    }

    return project;
  }

  findAll(publishedOnly = false) {
    return this.prisma.project.findMany({
      where: publishedOnly ? { published: true } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async update(id: string, dto: UpdateProjectDto) {
    const existing = await this.findOne(id);

    // If this update transitions the project from draft -> published, stamp publishedAt
    const willPublishNow = dto.published === true && existing.published === false;

    const updated = await this.prisma.project.update({
      where: { id },
      data: {
        ...dto,
        ...(willPublishNow ? { publishedAt: new Date() } : {}),
      },
    });

    if (willPublishNow) {
      this.notifySubscribers(updated.title, updated.overview, updated.liveLink ?? undefined).catch(
        (err) => console.error('Failed to send subscriber notifications:', err),
      );
    }

    return updated;
  }

  // Explicit publish action - flips a draft live and notifies subscribers.
  // No-ops (just returns the project) if it's already published.
  async publish(id: string) {
    const existing = await this.findOne(id);
    if (existing.published) return existing;

    const updated = await this.prisma.project.update({
      where: { id },
      data: { published: true, publishedAt: new Date() },
    });

    this.notifySubscribers(updated.title, updated.overview, updated.liveLink ?? undefined).catch(
      (err) => console.error('Failed to send subscriber notifications:', err),
    );

    return updated;
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.project.delete({ where: { id } });
  }
}

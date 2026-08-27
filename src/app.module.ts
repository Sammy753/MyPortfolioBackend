import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { WhatIDoModule } from './what-i-do/what-i-do.module';
import { ProjectsModule } from './projects/projects.module';
import { SkillsToolsModule } from './skills-tools/skills-tools.module';
import { ContactModule } from './contact/contact.module';
import { SubscribersModule } from './subscribers/subscribers.module';
import { UploadModule } from './upload/upload.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    MailModule,
    AuthModule,
    WhatIDoModule,
    ProjectsModule,
    SkillsToolsModule,
    ContactModule,
    SubscribersModule,
    UploadModule,
  ],
})
export class AppModule {}

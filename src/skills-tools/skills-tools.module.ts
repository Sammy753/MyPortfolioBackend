import { Module } from '@nestjs/common';
import { SkillsToolsService } from './skills-tools.service';
import { SkillsToolsController } from './skills-tools.controller';

@Module({
  providers: [SkillsToolsService],
  controllers: [SkillsToolsController],
})
export class SkillsToolsModule {}

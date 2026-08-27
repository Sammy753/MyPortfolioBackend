import { PartialType } from '@nestjs/swagger';
import { CreateSkillToolDto } from './create-skill-tool.dto';

export class UpdateSkillToolDto extends PartialType(CreateSkillToolDto) {}

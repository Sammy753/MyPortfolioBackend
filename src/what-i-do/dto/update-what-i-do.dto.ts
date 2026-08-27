import { PartialType } from '@nestjs/swagger';
import { CreateWhatIDoDto } from './create-what-i-do.dto';

export class UpdateWhatIDoDto extends PartialType(CreateWhatIDoDto) {}

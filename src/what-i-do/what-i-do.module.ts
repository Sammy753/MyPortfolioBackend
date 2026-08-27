import { Module } from '@nestjs/common';
import { WhatIDoService } from './what-i-do.service';
import { WhatIDoController } from './what-i-do.controller';

@Module({
  providers: [WhatIDoService],
  controllers: [WhatIDoController],
})
export class WhatIDoModule {}

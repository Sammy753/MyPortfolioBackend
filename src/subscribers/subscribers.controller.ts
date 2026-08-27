import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SubscribersService } from './subscribers.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';

@ApiTags('subscribers')
@Controller('subscribers')
export class SubscribersController {
  constructor(private service: SubscribersService) {}

  // Public - visitor subscribes for new-project notifications
  @Post()
  create(@Body() dto: CreateSubscriberDto) {
    return this.service.create(dto);
  }

  // Public - unsubscribe link in emails can hit this directly
  @Delete('unsubscribe/:email')
  unsubscribe(@Param('email') email: string) {
    return this.service.unsubscribe(email);
  }

  // Admin-only
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}

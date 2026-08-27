import {
  Controller,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UploadService } from './upload.service';

@ApiTags('upload')
@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  // Admin-only: upload an image (icon/thumbnail) or a project video,
  // get back a Cloudinary URL to plug into the create/update DTOs
  // (icon, thumbnail, mobileVideoUrl, tabVideoUrl, laptopVideoUrl, desktopVideoUrl)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Query('type') type: 'image' | 'video' = 'image',
  ) {
    const url = await this.uploadService.uploadFile(file, type);
    return { url };
  }
}

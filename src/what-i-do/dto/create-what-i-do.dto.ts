import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateWhatIDoDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsUrl()
  icon: string; // Cloudinary URL, upload via POST /upload first

  @IsUrl()
  thumbnail: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}

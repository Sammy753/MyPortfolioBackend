import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateSkillToolDto {
  @IsUrl() icon: string;
  @IsString() @IsNotEmpty() title: string;
  @IsString() @IsNotEmpty() description: string;
}

import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  ValidateIf,
} from 'class-validator';

export class CreateProjectDto {
  @IsString() @IsNotEmpty() title: string;
  @IsString() @IsNotEmpty() overview: string;
  @IsString() @IsNotEmpty() category: string; // "e-commerce" | "other" | etc.
  @IsString() @IsNotEmpty() aim: string;
  @IsString() @IsNotEmpty() objective: string;

  @IsArray()
  @IsString({ each: true })
  technologyUsed: string[];

  @IsOptional() @IsString() developmentProcess?: string;
  @IsOptional() @IsString() designProcess?: string;
  @IsOptional() @IsString() challengesAndSolutions?: string;
  @IsOptional() @IsString() limitations?: string;
  @IsOptional() @IsString() outcome?: string;

  @IsUrl() mobileVideoUrl: string; // 1st
  @IsUrl() tabVideoUrl: string; // 2nd
  @IsUrl() laptopVideoUrl: string; // 3rd
  @IsUrl() desktopVideoUrl: string; // 4th

  @IsBoolean() isTeamWork: boolean;

  // required only when isTeamWork is true
  @ValidateIf((o) => o.isTeamWork === true)
  @IsString()
  @IsNotEmpty({ message: 'myRole is required when isTeamWork is true' })
  myRole?: string;

  @IsArray()
  @IsString({ each: true })
  keyFeatures: string[];

  @IsOptional() @IsUrl() liveLink?: string;
  @IsOptional() @IsUrl() repoLink?: string;

  @IsString() @IsNotEmpty() description: string;

  // Optional at creation. Defaults to false (draft) in the DB.
  // Leave unset/false to save as draft; set true to publish immediately
  // and trigger subscriber notification emails right away.
  @IsOptional() @IsBoolean() published?: boolean;
}

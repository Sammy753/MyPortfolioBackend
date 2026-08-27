import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateContactDto {
  @IsString() @IsNotEmpty() name: string;

  // Relaxed phone validation: accepts numbers, spaces, dashes, parentheses,
  // and an optional leading +, 7-20 chars. Does NOT require a country code.
  @Matches(/^[+]?[\d\s\-().]{7,20}$/, {
    message: 'phone must be a valid phone number',
  })
  phone: string;

  @IsEmail() email: string;
  @IsString() @IsNotEmpty() message: string;
}

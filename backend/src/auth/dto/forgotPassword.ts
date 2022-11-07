import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class forgotPasswordDto {
  @IsEmail()
  @ApiProperty()
  email: string;
}

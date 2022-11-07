import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Matches, MinLength, IsString } from 'class-validator';

export class refreshPasswordDto {
  @IsEmail()
  @ApiProperty()
  email: string;

  @ApiProperty()
  @MinLength(6, { message: 'The password must be longer than 6 characters' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'The password must contain uppercase and lowercase letters',
  })
  @IsString()
  password: string;
}

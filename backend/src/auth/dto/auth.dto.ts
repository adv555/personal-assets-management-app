import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MinLength } from 'class-validator';
import { MESSAGES, REGEX } from 'src/shared/regexp';

export class AuthDto {
  @ApiProperty({ example: 'test@gmail.com', description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Pass@1234',
    description: 'User password',
  })
  @MinLength(8, { message: 'The password must be longer than 8 characters' })
  @Matches(REGEX.PASSWORD_RULE, {
    message: MESSAGES.PASSWORD_RULE_MESSAGE,
  })
  @IsString()
  password: string;
}

import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { MESSAGES, REGEX } from 'src/shared/regexp';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    description: 'User name',
    example: 'Jane',
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({
    description: 'User surname',
    example: 'Duncan',
  })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({
    description: 'User email',
    example: 'duncan@gmail.com',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'User password',
    example: 'Qwerty@12345',
  })
  @IsString()
  @IsOptional()
  @MinLength(8, { message: 'The password must be longer than 8 characters' })
  @Matches(REGEX.PASSWORD_RULE, {
    message: MESSAGES.PASSWORD_RULE_MESSAGE,
  })
  password?: string;

  @ApiProperty({
    description: 'User address',
    example: '27 Astronomichna street, Kharkiv, Ukraine',
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({
    description: 'User phone number',
    example: '+380680802212',
  })
  @IsString()
  @IsOptional()
  @Type(() => null)
  @Transform(({ value }) => (value === '' ? null : value))
  @IsPhoneNumber('UA', { message: MESSAGES.PHONE_NUMBER_MESSAGE })
  phone?: string | null;

  @ApiProperty({
    description: 'User birthdate',
    example: '2000-12-01',
  })
  @IsOptional()
  @Type(() => null)
  @Transform(({ value }) => (value === '' ? null : value))
  birthdate?: Date | null;

  @IsString()
  @IsOptional()
  refreshTokenHash?: string;

  @IsString()
  @IsOptional()
  activationLink?: string;

  @ApiProperty({
    description: 'User activation status',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isVerified?: boolean;

  @IsString()
  @IsOptional()
  avatarPath?: string;
}

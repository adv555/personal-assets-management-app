import { Type, Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class FilterDto {
  @IsOptional()
  @Type(() => String)
  //   @Transform(({ value }) => value.split(','))
  email?: string;

  @IsOptional()
  @Type(() => String)
  //   @Transform(({ value }) => value.split(','))
  name?: string;
}

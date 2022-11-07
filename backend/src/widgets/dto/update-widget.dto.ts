import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';

export class UpdateWidgetDto {
  @ApiProperty({
    description: 'React widget component state',
  })
  @IsObject()
  state: Record<string, any>;
}

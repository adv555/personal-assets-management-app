import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class AddGoalDto {
  @ApiProperty()
  @IsNumber()
  walletId: number;

  @ApiProperty()
  @IsNumber()
  goalBalance: number;
}

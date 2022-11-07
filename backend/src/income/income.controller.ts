import { SkipThrottle } from '@nestjs/throttler';
import { IncomeEntity } from './entities/income.entity';
import { CreateIncomeDto } from './dto/createIncome.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  HttpStatus,
  HttpCode,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IncomeService } from './income.service';
import { UpdateIncomeDto } from './dto/updateIncome.dto';
import { AllWalletIncomeResponseDto } from './dto/allWalletIncomeResponse.dto';
import { AllUserIncomeResponseDto } from './dto/allUserIncomeResponse.dto';
import { AllUserIncomeResponseType } from './interfaces/allUserIncomeResponse.type';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@ApiTags('Income')
@Controller('income')
@SkipThrottle()
export class IncomeController {
  constructor(private readonly incomeService: IncomeService) {}

  @ApiOperation({ summary: 'Create income' })
  @ApiResponse({ status: HttpStatus.CREATED, type: IncomeEntity })
  @Post('wallet/:walletId')
  @UsePipes(new ValidationPipe())
  async createNewIncome(
    @Param('walletId') walletId: number,
    @Body() createIncomeDto: CreateIncomeDto,
  ): Promise<IncomeEntity> {
    return await this.incomeService.createIncome(walletId, createIncomeDto);
  }

  @ApiOperation({ summary: `Get all wallet's income` })
  @ApiResponse({ status: HttpStatus.OK, type: AllWalletIncomeResponseDto })
  @Get('wallet/:walletId')
  @UsePipes(new ValidationPipe())
  async getAllWalletIncome(
    @Param('walletId') walletId: number,
    @Query() query: PaginationQueryDto,
  ): Promise<AllWalletIncomeResponseDto> {
    return await this.incomeService.getAllWalletIncome(walletId, query);
  }

  @ApiOperation({ summary: `Get all user's income` })
  @ApiResponse({ status: HttpStatus.OK, type: AllUserIncomeResponseDto })
  @Get('user/:userId')
  @UsePipes(new ValidationPipe())
  async getAllUserIncome(
    @Param('userId') userId: number,
    @Query() query: PaginationQueryDto,
  ): Promise<AllUserIncomeResponseType> {
    return await this.incomeService.getAllUserIncome(userId, query);
  }

  @ApiOperation({ summary: `Update user's income` })
  @ApiResponse({ type: IncomeEntity })
  @Patch(':incomeId')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  async updateIncome(
    @Param('incomeId') incomeId: number,
    @Body() updateIncomeDto: UpdateIncomeDto,
  ): Promise<IncomeEntity> {
    return await this.incomeService.updateIncome(incomeId, updateIncomeDto);
  }

  @ApiOperation({ summary: `Delete income` })
  @Delete(':incomeId')
  async removeIncome(@Param('incomeId') incomeId: number): Promise<void> {
    await this.incomeService.removeIncome(incomeId);
  }
}

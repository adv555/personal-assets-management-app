import { CostEntity } from './entities/cost.entity';
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
import { CostsService } from './costs.service';
import { CreateCostDto } from './dto/createCost.dto';
import { UpdateCostDto } from './dto/updateCost.dto';
import { AllWalletCostsResponseDto } from './dto/allWalletCostsResponse.dto';
import { AllUserCostsResponseDto } from './dto/allUserCostsResponse.dto';
import { AllUserCostsResponseType } from './interfaces/allUserCostsResponse.type';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { SkipThrottle } from '@nestjs/throttler';

@ApiTags('Costs')
@SkipThrottle()
@Controller('costs')
export class CostsController {
  constructor(private readonly costsService: CostsService) {}

  @ApiOperation({ summary: 'Create cost' })
  @ApiResponse({ status: HttpStatus.CREATED, type: CostEntity })
  @Post('wallet/:walletId')
  @UsePipes(new ValidationPipe())
  async createNewCost(
    @Param('walletId') walletId: number,
    @Body() createCostDto: CreateCostDto,
  ): Promise<CostEntity> {
    return await this.costsService.createCost(walletId, createCostDto);
  }

  @ApiOperation({ summary: `Get all wallet's costs` })
  @ApiResponse({ status: HttpStatus.OK, type: AllWalletCostsResponseDto })
  @Get('wallet/:walletId')
  @UsePipes(new ValidationPipe())
  async getAllWalletCosts(
    @Param('walletId') walletId: number,
    @Query() query: PaginationQueryDto,
  ): Promise<AllWalletCostsResponseDto> {
    return await this.costsService.getAllWalletCosts(walletId, query);
  }

  @ApiOperation({ summary: `Get all user's costs` })
  @ApiResponse({ status: HttpStatus.OK, type: AllUserCostsResponseDto })
  @Get('user/:userId')
  @UsePipes(new ValidationPipe())
  async getAllUserCosts(
    @Param('userId') userId: number,
    @Query() query: PaginationQueryDto,
  ): Promise<AllUserCostsResponseType> {
    return await this.costsService.getAllUserCosts(userId, query);
  }

  @ApiOperation({ summary: `Update user's cost` })
  @ApiResponse({ type: CostEntity })
  @Patch(':costId')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  async updateCost(
    @Param('costId') costId: number,
    @Body() updateCostDto: UpdateCostDto,
  ): Promise<CostEntity> {
    return await this.costsService.updateCost(costId, updateCostDto);
  }

  @ApiOperation({ summary: `Delete cost` })
  @Delete(':costId')
  async removeCost(@Param('costId') costId: number): Promise<void> {
    await this.costsService.removeCost(costId);
  }
}

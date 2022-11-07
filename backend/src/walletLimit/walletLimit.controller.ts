import { WalletLimitEntity } from './entities/walletLimit.entity';
import { CreateWalletLimitDto } from './dto/create-walletLimit.dto';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { WalletLimitService } from './walletLimit.service';
import { User } from 'src/user/decorators/user.decorator';
import { UpdateWalletLimitDto } from './dto/update-walletLimit.dto';

@ApiTags('WalletLimits')
@ApiHeader({ name: 'authorization', description: 'must be token' })
@Controller('walletLimits')
export class WalletLimitController {
  constructor(private walletLimitService: WalletLimitService) {
    console.log('constructor WalletLimitController');
  }

  @ApiOperation({ summary: 'Create WalletLimit' })
  @ApiResponse({ status: HttpStatus.CREATED, type: WalletLimitEntity })
  @Post(':walletId')
  @UsePipes(new ValidationPipe())
  async createNewWallet(
    @Param('walletId', ParseIntPipe) walletId: number,
    @Body() createWalletLimitDto: CreateWalletLimitDto,
  ): Promise<WalletLimitEntity> {
    console.log('controller createNewWalletLimit');

    return await this.walletLimitService.createNewWalletLimit(
      walletId,
      createWalletLimitDto,
    );
  }

  @ApiOperation({ summary: 'Get all WalletLimits' })
  @ApiResponse({ status: HttpStatus.CREATED, type: WalletLimitEntity })
  @Get()
  @UsePipes(new ValidationPipe())
  async getAllWalletLimits(@User('id') currentUserId: number): Promise<any> {
    console.log('controller createNewWalletLimit');
    return this.walletLimitService.getAllWalletLimits(currentUserId);
  }

  @ApiOperation({ summary: `Update user's cost` })
  @ApiResponse({ status: HttpStatus.ACCEPTED, type: WalletLimitEntity })
  @Patch(':walletLimitId')
  @UsePipes(new ValidationPipe())
  async updateCost(
    @Param('walletLimitId') walletLimitId: number,
    @Body() updateWalletLimitDto: UpdateWalletLimitDto,
  ): Promise<WalletLimitEntity> {
    return await this.walletLimitService.updateWalletLimit(
      walletLimitId,
      updateWalletLimitDto,
    );
  }

  @ApiOperation({ summary: `Delete walletLimit` })
  @ApiResponse({ status: HttpStatus.CREATED, type: WalletLimitEntity })
  @Delete(':walletLimitId')
  async removeWalletLimit(
    @Param('walletLimitId') walletLimitId: number,
  ): Promise<void> {
    await this.walletLimitService.removeWalletLimit(walletLimitId);
  }
}

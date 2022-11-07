import { SkipThrottle } from '@nestjs/throttler';
import { WalletEntity } from 'src/wallet/entities/wallet.entity';
import { CreateWalletDto } from './dto/createWallet.dto';
import { WalletService } from './wallet.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '../user/decorators/user.decorator';
import { UpdateWalletDto } from './dto/updateWallet.dto';

@ApiTags('Wallets')
@ApiHeader({ name: 'authorization', description: 'must be token' })
@SkipThrottle()
@Controller('wallets')
export class WalletController {
  constructor(private walletService: WalletService) {}

  @ApiOperation({ summary: 'Create Wallet' })
  @ApiResponse({ status: HttpStatus.CREATED, type: WalletEntity })
  @Post()
  @UsePipes(new ValidationPipe())
  async createNewWallet(
    @User('id') currentUserId: number,
    @Body() createWalletDto: CreateWalletDto,
  ): Promise<WalletEntity> {
    return await this.walletService.createNewWallet(
      currentUserId,
      createWalletDto,
    );
  }

  @ApiOperation({ summary: `Get all user's wallets` })
  @ApiResponse({ status: HttpStatus.OK, type: [WalletEntity] })
  @Get()
  async getAllUserWallets(
    @User('id') currentUserId: number,
  ): Promise<WalletEntity[]> {
    return await this.walletService.getAllUserWallets(currentUserId);
  }

  @ApiOperation({ summary: `Get one user's wallet` })
  @ApiResponse({ status: HttpStatus.OK, type: WalletEntity })
  @Get(':walletId')
  async getOneWallet(
    @User('id') currentUserId: number,
    @Param('walletId') walletId: number,
  ): Promise<WalletEntity> {
    return await this.walletService.getOneWallet(currentUserId, walletId);
  }

  @ApiOperation({ summary: `Update user's wallet` })
  @ApiResponse({ status: HttpStatus.CREATED, type: WalletEntity })
  @Patch(':walletId')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  async updateWallet(
    @Param('walletId') walletId: number,
    @Body() updateWalletDto: UpdateWalletDto,
  ): Promise<WalletEntity> {
    return this.walletService.updateWallet(walletId, updateWalletDto);
  }

  @ApiOperation({ summary: `Delete user's wallet` })
  @Delete(':walletId')
  async removeWallet(
    @User('id') currentUserId: number,
    @Param('walletId') walletId: number,
  ): Promise<void> {
    await this.walletService.removeWallet(currentUserId, walletId);
  }
}

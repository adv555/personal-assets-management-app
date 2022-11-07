import { SkipThrottle } from '@nestjs/throttler';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Controller, Get, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guard';
import { CryptoPortfolioService } from './cryptoPortfolio.service';

@SkipThrottle()
@UseGuards(AccessTokenGuard)
@Controller('cryptoPortfolio')
export class CryptoPortfolioController {
  constructor(private readonly cryptoService: CryptoPortfolioService) {}

  @Get('create')
  create(@Req() req: Request) {
    const email = req.user['email'];
    return this.cryptoService.createPortfolio(email);
  }

  @Get('myPortfolio')
  async findOne(@Req() req: Request) {
    const email = req.user['email'];
    return await this.cryptoService.getPortfolio(email);
  }

  @Delete(':id')
  removePortfolio(@Req() req: Request, @Param('id') idPortfolio: number) {
    const userId = req.user['id'];

    return this.cryptoService.removePortfolio(+userId, idPortfolio);
  }
}

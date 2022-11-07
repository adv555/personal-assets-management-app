import { SkipThrottle } from '@nestjs/throttler';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guard';
import { CryptoService } from './crypto.service';
import { CreateCryptoDto } from './dto/create-crypto.dto';
import { UpdateCryptoDto } from './dto/update-crypto.dto';

@UseGuards(AccessTokenGuard)
@SkipThrottle()
@Controller('crypto')
export class CryptoController {
  constructor(private readonly cryptoService: CryptoService) {}

  @Post('create')
  create(@Body() createCryptoDto: CreateCryptoDto, @Req() req: Request) {
    const email = req.user['email'];
    return this.cryptoService.creteNewCryptoItem(createCryptoDto, email);
  }

  @Delete(':idItem')
  remove(@Param('idItem') idItem: number) {
    return this.cryptoService.remove(idItem);
  }
}

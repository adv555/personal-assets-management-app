import { Module } from '@nestjs/common';
import { CryptoService } from './crypto.service';
import { CryptoController } from './crypto.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CryptoEntity } from './entities/crypto.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { CryptoPortfolioEntity } from '../cryptoPortfolio/entities/cryptoPortfolio.entity';

@Module({
  controllers: [CryptoController],
  providers: [CryptoService],
  imports: [
    TypeOrmModule.forFeature([CryptoEntity, UserEntity, CryptoPortfolioEntity]),
  ],
})
export class CryptoModule {}

import { MiddlewareConsumer, Module } from '@nestjs/common';
import { WalletLimitService } from './walletLimit.service';
import { WalletLimitController } from './walletLimit.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletLimitEntity } from './entities/walletLimit.entity';
import { WalletEntity } from '../wallet/entities/wallet.entity';
import { AuthMiddleware } from '../auth/middleware/auth.middleware';
import { UserEntity } from 'src/user/entities/user.entity';

@Module({
  controllers: [WalletLimitController],
  providers: [WalletLimitService],
  exports: [WalletLimitService],
  imports: [
    TypeOrmModule.forFeature([WalletLimitEntity, WalletEntity, UserEntity]),
  ],
})
export class WalletLimitModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(WalletLimitController);
  }
}

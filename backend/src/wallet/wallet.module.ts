import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletEntity } from './entities/wallet.entity';
import { UserEntity } from '../user/entities/user.entity';
import { AuthMiddleware } from '../auth/middleware/auth.middleware';

@Module({
  controllers: [WalletController],
  providers: [WalletService],
  imports: [TypeOrmModule.forFeature([WalletEntity, UserEntity])],
})
export class WalletModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(WalletController);
  }
}

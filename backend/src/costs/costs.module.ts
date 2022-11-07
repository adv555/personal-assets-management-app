import { Module } from '@nestjs/common';
import { CostsService } from './costs.service';
import { CostsController } from './costs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CostEntity } from './entities/cost.entity';
import { WalletEntity } from '../wallet/entities/wallet.entity';
import { UserEntity } from '../user/entities/user.entity';
import { WalletLimitService } from '../walletLimit/walletLimit.service';
import { WalletLimitModule } from '../walletLimit/walletLimit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CostEntity, WalletEntity, UserEntity]),
    WalletLimitModule,
  ],
  controllers: [CostsController],
  providers: [CostsService],
})
export class CostsModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletEntity } from 'src/wallet/entities/wallet.entity';
import { ReportEntity } from './entities/report.entity';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

@Module({
  imports: [TypeOrmModule.forFeature([ReportEntity, WalletEntity])],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReportEntity } from './entities/report.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(ReportEntity)
    private reportRepository: Repository<ReportEntity>,
  ) {}

  async getReportOfPeriod(
    walletId: number | string,
    startDate: string,
    endDate: string,
  ) {
    const periodData = this.reportRepository
      .createQueryBuilder('periodReport')
      .select(['"periodReport"."category"', '"periodReport"."isIncome"'])
      .addSelect(`SUM("periodReport"."sum")`)
      .where('"periodReport"."walletId" = :walletId', { walletId })
      .andWhere(`"periodReport"."createdAt" BETWEEN :startDate AND :endDate`, {
        startDate,
        endDate,
      })
      .groupBy('"periodReport"."category"')
      .addGroupBy('"periodReport"."isIncome"')
      .orderBy('"periodReport"."category"', 'ASC')
      .getRawMany();

    const sumsByOperationType = this.reportRepository
      .createQueryBuilder('sums')
      .select(['"sums"."isIncome"', 'SUM("sums"."sum")'])
      .where('"sums"."walletId" = :walletId', { walletId })
      .andWhere(`"sums"."createdAt" BETWEEN :startDate AND :endDate`, {
        startDate,
        endDate,
      })
      .groupBy('"sums"."isIncome"')
      .getRawMany();

    const [periodReport, sums] = await Promise.all([
      periodData,
      sumsByOperationType,
    ]);

    // return { periodReport, sums };
    return { periodReport, sums };
  }
}

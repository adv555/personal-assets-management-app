import { SkipThrottle } from '@nestjs/throttler';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guard';
import { ReportsService } from './reports.service';

@SkipThrottle()
@UseGuards(AccessTokenGuard)
@Controller('overview')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('search?')
  getReportOfPeriod(
    @Query('walletId') walletId: number | string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const report = this.reportsService.getReportOfPeriod(
      walletId,
      startDate,
      endDate,
    );

    return report;
  }
}

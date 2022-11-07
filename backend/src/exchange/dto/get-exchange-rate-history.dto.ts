import { IntersectionType } from '@nestjs/mapped-types';
import { DateFilterQueryDto } from './date-filter-query.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

export class GetExchangeRateHistoryDto extends IntersectionType(
  DateFilterQueryDto,
  PaginationQueryDto,
) {}

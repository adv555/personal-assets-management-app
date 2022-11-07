import { IntersectionType } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CurrencyFilterQueryDto } from './currency-filter-query.dto';

export class GetBankRatesDto extends IntersectionType(
  PaginationQueryDto,
  CurrencyFilterQueryDto,
) {}

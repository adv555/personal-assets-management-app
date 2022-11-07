import { PartialType } from '@nestjs/swagger';
import { CreateCryptoPortfolioDto } from './create-cryptoPortfolio.dto';

export class UpdateCryptoPortfolioDto extends PartialType(
  CreateCryptoPortfolioDto,
) {}

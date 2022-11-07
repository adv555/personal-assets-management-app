import { BankEntity } from '../entities/bank.entity';
import { Base } from 'src/common/dto/base.dto';

export type ExchangeBank = Omit<BankEntity, keyof Base>;

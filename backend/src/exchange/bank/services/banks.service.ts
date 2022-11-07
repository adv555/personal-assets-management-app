import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BankEntity } from '../entities/bank.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BanksService {
  constructor(
    @InjectRepository(BankEntity)
    private bankRepository: Repository<BankEntity>,
  ) {}

  async getAll(): Promise<BankEntity[]> {
    return await this.bankRepository.find();
  }
}
